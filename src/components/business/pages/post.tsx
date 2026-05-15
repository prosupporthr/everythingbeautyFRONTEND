"use client";
import { PostCard } from "@/components/cards";
import { LoadingLayout } from "@/components/shared";
import { IPostDetail } from "@/helper/model/business";
import { URLS } from "@/helper/services/urls";
import { useInfiniteScroller } from "@/hooks/useCustomGetScroller";  
import { useParams } from "next/navigation"; 

export default function PostPage({
    isProfile,
    businessId,
}: {
    isProfile?: boolean;
    businessId?: string;
}) {
    const param = useParams();
    const id = param.id as string;

    // const effectiveBusinessId = businessId ?? id ?? "";

    const {
        items = [],
        ref,
        isLoading,
        isFetchingMore,
    } = useInfiniteScroller<IPostDetail>({
        queryKeyBase: "post",
        endpoint: URLS.POST,
        limit: 10, 
    }); 

    return (
        <LoadingLayout
            loading={isLoading}
            refetching={isFetchingMore}
            length={items?.length}
            ref={ref}
        >
            <div className=" w-full grid lg:grid-cols-2 gap-4 ">
                {items?.map((item, index) => {
                    return (
                        <PostCard key={index} item={item} />
                    );
                })}
            </div>
        </LoadingLayout>
    );
}
