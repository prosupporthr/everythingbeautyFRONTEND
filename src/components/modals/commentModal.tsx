"use client";
import { MessageText, Send } from "iconsax-reactjs";
import { useEffect, useState } from "react";
import { LoadingLayout, ModalLayout } from "../shared";
import { CommentCard } from "../cards";
import usePost from "@/hooks/usePost";
import { IPostDetail } from "@/helper/model/business";
import { IComment } from "@/helper/model/post";
import { textLimit } from "@/helper/utils/textlimit";
import { Spinner } from "@heroui/react";
import { useAtom, useAtomValue } from "jotai";
import { commentData, commentDeleted, replyData } from "@/store/comment";
import { useInfiniteScroller } from "@/hooks/useCustomGetScroller";
import { uniqBy } from "lodash";

// LoadingLayout expects a "length" that reflects the merged/deduped list, but
// there's a render where the freshly-fetched page hasn't been merged into
// the atom yet. Falling back to 1 avoids a flash of the empty state during
// that gap without lying about the real count once they're in sync.

export default function CommentModal({
    post,
    setActiveId,
    activeId,
}: {
    post: IPostDetail;
    setActiveId: (id: string) => void;
    activeId: string;
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [loadingLikeId, setLoadingLikeId] = useState("");
    const deletedComments = useAtomValue(commentDeleted);
    const [comments, setComments] = useAtom(commentData);
    const [repliesData, setRepliesData] = useAtom(replyData);

    const {
        formikComment,
        setIndex,
        isLoading,
        setCommentId,
        currentComment,
        setCurrentComment,
        setActiveReply,
        activeReply,
        deleteCommentMutation,
        likeCommentMutation,
    } = usePost();

    const {
        items = [],
        ref,
        isLoading: loading,
        isFetchingMore,
        refetch
    } = useInfiniteScroller<IComment>({
        queryKeyBaseArray: [activeId, "comment"],
        endpoint: `/post/${activeId}/comments`,
        enable: Boolean(activeId),
        limit: 10,
        noCache: true,
    });

    const {
        items: repliesItems = [],
        ref: repliesRef,
        isLoading: loadingReplies,
        isFetchingMore: isFetchingMoreReplies,
        reset: refetchReply
    } = useInfiniteScroller<IComment>({
        queryKeyBaseArray: [activeReply, "reply"],
        endpoint: `/post/comment/${activeReply}/replies`,
        enable: Boolean(activeReply),
        limit: 10,
        noCache: true,
    });

    useEffect(() => {
        setIndex(activeId);
        if (currentComment?.id) {
            setRepliesData([]);
            setCommentId(currentComment.id);
            setActiveReply(currentComment.id);
            formikComment.setFieldValue("commentId", currentComment.id);
            formikComment.setFieldValue("isReply", true);
        } else {
            formikComment.setFieldValue("commentId", "");
            formikComment.setFieldValue("isReply", false);
        }
    }, [activeId, currentComment]);

    const handleClick = () => {
        // Reset all thread state before switching posts — comments, the
        // active reply thread, and the "replying to" target are otherwise
        // shared global atoms and would leak in from whatever post was
        // last viewed.

        refetch()
        setComments([]);
        setRepliesData([]);
        setCurrentComment({ id: "", name: "", message: "" });
        setActiveReply("");
        formikComment.resetForm?.();
        setIsOpen(true);
        setActiveId(post?._id);
    };

    const handleClickReply = (comment: IComment) => {
        refetchReply()
        setRepliesData([]);
        setActiveReply(activeReply === comment?._id ? "" : comment?._id);
    };

    const handleLike = async (id: string) => {
        setLoadingLikeId(id);
        try {
            await likeCommentMutation.mutateAsync(id);
        } finally {
            setLoadingLikeId("");
        }
    };

    const visibleComments = uniqBy([...comments, ...items], "_id")?.filter(
        (comment) => !deletedComments.includes(comment?._id),
    );
    const visibleReplies = uniqBy(
        [...repliesData, ...repliesItems],
        "_id",
    )?.filter((reply) => !deletedComments.includes(reply?._id));

    return (
        <div className=" ">
            <button onClick={handleClick} className=" flex gap-1 ">
                <MessageText size={20} />

                <p className=" text-[10px] font-bold ">{post?.commentsCount}</p>
            </button>
            <ModalLayout
                isOpen={isOpen}
                nospace
                size="xl"
                title="Comments"
                onClose={() => setIsOpen(false)}
            >
                <div className=" w-full flex flex-col gap-5 pb-4 max-h-[70vh] min-h-[50vh] px-4 py-4 overflow-y-auto ">
                    <LoadingLayout
                        loading={loading}
                        length={isFetchingMore ? 1 : visibleComments?.length}
                        ref={ref}
                        refetching={isFetchingMore}
                    >
                        {visibleComments?.map((comment) => (
                            <div
                                key={comment?._id}
                                className=" w-full flex flex-col gap-3 "
                            >
                                <CommentCard
                                    loadingLike={loadingLikeId}
                                    item={comment}
                                    setCommentId={setCurrentComment}
                                    onLike={() => handleLike(comment?._id)}
                                    newLikeData={
                                        likeCommentMutation.data
                                            ?.data as IComment
                                    }
                                    onDelete={() =>
                                        deleteCommentMutation.mutate(
                                            comment?._id,
                                        )
                                    }
                                />
                                {activeReply === comment?._id && (
                                    <div className=" my-3 flex flex-col gap-5 ">
                                        <LoadingLayout
                                            loading={loadingReplies}
                                            refetching={isFetchingMoreReplies}
                                            ref={repliesRef}
                                            length={visibleReplies?.length}
                                        >
                                            {visibleReplies?.map((reply) => (
                                                <div
                                                    key={reply?._id}
                                                    className="  pl-10 w-full "
                                                >
                                                    <CommentCard
                                                        loadingLike={
                                                            loadingLikeId
                                                        }
                                                        item={reply}
                                                        reply
                                                        onLike={() =>
                                                            handleLike(
                                                                reply?._id,
                                                            )
                                                        }
                                                        newLikeData={
                                                            likeCommentMutation
                                                                .data
                                                                ?.data as IComment
                                                        }
                                                        onDelete={() =>
                                                            deleteCommentMutation.mutate(
                                                                reply?._id,
                                                            )
                                                        }
                                                    />
                                                </div>
                                            ))}
                                        </LoadingLayout>
                                    </div>
                                )}

                                {comment?.replies > 0 && (
                                    <div className=" w-full flex justify-center ">
                                        <button
                                            className=" text-secondary text-xs font-medium "
                                            onClick={() =>
                                                handleClickReply(comment)
                                            }
                                        >
                                            {activeReply === comment?._id
                                                ? "Hide Replies"
                                                : "Show Replies"}
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </LoadingLayout>
                </div>
                <div className=" bg-white w-full flex pt-3 pb-2 border-t flex-col gap-2 ">
                    {currentComment?.id && (
                        <p className=" text-sm px-4 ">
                            Reply to{" "}
                            <span className=" text-brand capitalize font-semibold ">
                                {textLimit(currentComment?.name, 12)}
                            </span>{" "}
                            comment{" "}
                            <span className=" text-brand font-semibold ">
                                "{currentComment?.message}"
                            </span>
                        </p>
                    )}
                    <div className=" w-full px-4 flex h-[40px] items-center gap-4">
                        <input
                            onChange={(e) =>
                                formikComment.setFieldValue(
                                    "body",
                                    e.target.value,
                                )
                            }
                            value={formikComment.values?.body}
                            className="flex-1 px-4 text-sm outline-none! h-[40px] ring-0! bg-[#F0F3FF] focus:outline-none! rounded focus:ring-0! focus:border-transparent"
                            placeholder="Add a comment..."
                        />
                        <button
                            className=" disabled:opacity-25 "
                            onClick={() => formikComment.handleSubmit()}
                            disabled={!formikComment.values.body || isLoading}
                        >
                            {isLoading ? (
                                <Spinner size="sm" />
                            ) : (
                                <Send size={20} />
                            )}
                        </button>
                    </div>
                </div>
            </ModalLayout>
        </div>
    );
}
