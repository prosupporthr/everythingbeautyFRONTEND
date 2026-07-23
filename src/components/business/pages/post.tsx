"use client";
import { PostCard } from "@/components/cards";
import { LoadingLayout } from "@/components/shared";
import { IPostDetail } from "@/helper/model/business";
import { URLS } from "@/helper/services/urls"; 
import { useInfiniteScroller } from "@/hooks/useCustomGetScroller"; 
import usePost from "@/hooks/usePost";
import { postDeleted } from "@/store/post";
import { userAtom } from "@/store/user";
import { useAtom } from "jotai";
import { useParams } from "next/navigation";
import { useRouter } from "next/router";
// import { useParams } from "next/navigation";

export default function PostPage({ 
    isProfile
}: {
    isProfile?: boolean;
    businessId?: string;
}) { 


    const param = useParams(); 
    const id = param.id as string;
    const [user] = useAtom(userAtom); 
    const [deletedItem] = useAtom(postDeleted);
    const {
        items = [],
        ref,
        isLoading,
        isFetchingMore,
    } = useInfiniteScroller<IPostDetail>({
        queryKeyBaseArray: ["post", user?._id + ""],
        endpoint: URLS.POSTBYUSERID(isProfile ? user?._id + "" : id+""),
        limit: 10,
        noCache: true,
    });

    const { handleLikePost } = usePost();

    return (
        <div className=" w-full flex justify-center items-center ">
            <LoadingLayout
                loading={isLoading}
                refetching={isFetchingMore}
                length={items?.filter((item) => !deletedItem.includes(item?._id))?.length}
                ref={ref}
            >
                <div className=" lg:max-w-[500px] w-full flex flex-col gap-4 ">
                    {items?.filter((item) => !deletedItem.includes(item?._id)).map((item, index) => {
                        return (
                            <PostCard
                                click={handleLikePost}
                                key={index}
                                isProfile={isProfile}
                                item={item}
                            />
                        );
                    })}
                </div>
            </LoadingLayout>
        </div>
    );
}
