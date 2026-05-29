"use client";
import { PostCard } from "@/components/cards";
import { LoadingLayout } from "@/components/shared";
import { IPostDetail } from "@/helper/model/business";
import { URLS } from "@/helper/services/urls";
import { useInfiniteScroller } from "@/hooks/useCustomGetScroller";  
import usePost from "@/hooks/usePost";
import { userAtom } from "@/store/user";
import { useAtom } from "jotai";
// import { useParams } from "next/navigation"; 

export default function PostPage({
    isProfile,
    businessId,
}: {
    isProfile?: boolean;
    businessId?: string;
}) {
    // const param = useParams();
    // const id = param.id as string;

    const [user] = useAtom(userAtom);

    const {
        items = [],
        ref,
        isLoading,
        isFetchingMore,
    } = useInfiniteScroller<IPostDetail>({
        queryKeyBase: "post",
        endpoint: URLS.POSTBYUSERID(user?._id+""),
        limit: 10, 
    }); 

    const { handleLikePost } = usePost()

    return (
        <LoadingLayout
            loading={isLoading}
            refetching={isFetchingMore}
            length={items?.length}
            ref={ref}
        >
            <div className={` w-full grid lg:grid-cols-3 gap-4 `}>
                {items?.map((item, index) => {
                    return (
                        <PostCard click={handleLikePost} key={index} isProfile={true} item={item} />
                    );
                })}
            </div>
        </LoadingLayout>
    );
}
