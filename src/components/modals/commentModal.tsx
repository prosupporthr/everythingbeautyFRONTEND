"use client";
import { Gallery, MessageText, Send } from "iconsax-reactjs";
import { useEffect, useState } from "react";
import { LoadingLayout, ModalLayout } from "../shared";
import { CommentCard } from "../cards";
import usePost from "@/hooks/usePost";
import { useFetchData } from "@/hooks/useFetchData";
import { IPostDetail } from "@/helper/model/business";
import { IComment } from "@/helper/model/post";
import { textLimit } from "@/helper/utils/textlimit";
import { Spinner } from "@heroui/react";

export default function CommentModal({ item }: { item: IPostDetail }) {
    const [isOpen, setIsOpen] = useState(false);
    const [activeId, setActiveId] = useState("");

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

    const { data = [], isLoading: loading } = useFetchData<IComment[]>({
        endpoint: `/post/${activeId}/comments`,
        name: ["comment", activeId],
        enable: activeId ? true : false,
        params: {
            page: 1,
            limit: 10,
        },
    });

    const {
        data: replies = [],
        isLoading: loadingReplies,
        isRefetching,
    } = useFetchData<IComment[]>({
        endpoint: `/post/comment/${activeReply}/replies`,
        name: ["reply", activeReply],
        enable: activeReply ? true : false,
        params: {
            page: 1,
            limit: 10,
        },
    });

    console.log(replies);

    useEffect(() => {
        setIndex(activeId);
        if (currentComment?.id) {
            setCommentId(currentComment?.id);
            formikComment.setFieldValue("commentId", currentComment?.id);
            formikComment.setFieldValue("isReply", true);
        } else {
            formikComment.setFieldValue("commentId", "");
            formikComment.setFieldValue("isReply", false);
        }
    }, [activeId, currentComment]);

    const handleClick = () => {
        setIsOpen(true);
        setActiveId(item?._id);
    };

    return (
        <div className=" pt-[6px] ">
            <button onClick={handleClick}>
                <MessageText size={20} />
            </button>
            <ModalLayout
                isOpen={isOpen}
                nospace
                size="xl"
                title="Comments"
                onClose={() => setIsOpen(false)}
            >
                <div className=" w-full flex flex-col gap-5 pb-4 max-h-[70vh] min-h-[50vh] px-4 py-4 overflow-y-auto ">
                    <LoadingLayout loading={loading} length={data?.length}>
                        {data?.map((item, index) => {
                            return (
                                <div
                                    key={index}
                                    className=" w-full flex flex-col gap-3 "
                                >
                                    <CommentCard
                                        item={item}
                                        setCommentId={setCurrentComment}
                                        onLike={() =>
                                            likeCommentMutation.mutate(
                                                item?._id,
                                            )
                                        }
                                        onDelete={() =>
                                            deleteCommentMutation.mutate(
                                                item?._id,
                                            )
                                        }
                                    />
                                    {activeReply === item?._id && (
                                        <div className=" my-3 flex flex-col gap-5 ">
                                            <LoadingLayout
                                                loading={loadingReplies}
                                                refetching={isRefetching}
                                            >
                                                {replies?.map(
                                                    (subitem, index) => {
                                                        return (
                                                            <div
                                                                key={index}
                                                                className="  pl-10 w-full "
                                                            >
                                                                <CommentCard
                                                                    item={
                                                                        subitem
                                                                    }
                                                                    reply
                                                                    onLike={() =>
                                                                        likeCommentMutation.mutate(
                                                                            subitem?._id,
                                                                        )
                                                                    }
                                                                    onDelete={() =>
                                                                        deleteCommentMutation.mutate(
                                                                            subitem?._id,
                                                                        )
                                                                    }
                                                                />
                                                            </div>
                                                        );
                                                    },
                                                )}
                                            </LoadingLayout>
                                        </div>
                                    )}

                                    {item?.replies > 0 && (
                                        <div className=" w-full flex justify-center ">
                                            <button
                                                className=" text-secondary text-xs font-medium "
                                                onClick={() =>
                                                    setActiveReply(
                                                        activeReply ===
                                                            item?._id
                                                            ? ""
                                                            : item?._id,
                                                    )
                                                }
                                            >
                                                {activeReply === item?._id
                                                    ? "Hide Replies"
                                                    : "Show Replies"}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </LoadingLayout>
                </div>
                <div className=" bg-white w-full flex pt-3 pb-2 border-t flex-col gap-2 ">
                    {currentComment?.id && (
                        <p className=" text-sm ">
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
                            disabled={
                                formikComment.values.body && !isLoading
                                    ? false
                                    : true
                            }
                        >
                            {isLoading && <Spinner size="sm" />}
                            {!isLoading && <Send size={20} />}
                        </button>
                    </div>
                </div>
            </ModalLayout>
        </div>
    );
}
