"use client";
import { PostCard } from "@/components/cards";
import { LoadingLayout } from "@/components/shared";
import { IPostDetail } from "@/helper/model/business";
import { URLS } from "@/helper/services/urls";
import { useInfiniteScroller } from "@/hooks/useCustomGetScroller";
import { useFetchData } from "@/hooks/useFetchData";
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

    const [user] = useAtom(userAtom); 

    const {
        data: items,
        isLoading,
        // isRefetching,
    } = useFetchData<IPostDetail[]>({
        endpoint: URLS.POSTBYUSERID(user?._id + ""),
        name: ["post", user?._id + ""],
    });

    const { handleLikePost } = usePost();

    return (
        <div className=" w-full flex justify-center items-center ">
            <LoadingLayout
                loading={isLoading}
                // refetching={isFetchingMore}
                length={items?.length}
                // ref={ref}
            >
                <div className=" lg:max-w-[500px] w-full flex flex-col gap-4 ">
                    {items?.map((item, index) => {
                        return (
                            <PostCard
                                click={handleLikePost}
                                key={index}
                                isProfile={true}
                                item={item}
                            />
                        );
                    })}
                </div>
            </LoadingLayout>
        </div>
    );
}
