"use client"
import { PostCard } from "@/components/cards";
import { CustomButton } from "@/components/custom";
import { LoadingLayout } from "@/components/shared";
import { IPostDetail } from "@/helper/model/business";
import { URLS } from "@/helper/services/urls";
import { useInfiniteScroller } from "@/hooks/useCustomGetScroller";
import { People, Star1 } from "iconsax-reactjs";

export default function PostPage() {
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
        <div className=" w-full flex-1 flex gap-6 overflow-hidden ">
            <div className=" flex-1 flex flex-col p-6 pr-0 gap-4 overflow-auto ">
                <p className=" text-lg font-medium ">Recent Post</p>
                <div className=" w-full flex flex-col gap-4 ">
                    <LoadingLayout
                        loading={isLoading}
                        refetching={isFetchingMore}
                        length={items?.length}
                        ref={ref}
                    >
                        {items?.map((item, index) => {
                            return <PostCard key={index} item={item} />;
                        })}
                    </LoadingLayout>
                </div>
            </div>
            <div className=" max-w-[470px] w-full pl-0 p-6 flex flex-col gap-6 overflow-auto ">
                <div
                    style={{ boxShadow: "0px 4px 20px -2px #8127CF14" }}
                    className=" border rounded-3xl p-6 w-full gap-4 flex flex-col "
                >
                    <div className=" w-full flex justify-between items-center ">
                        <p className=" font-bold ">Trending Stylists</p>
                        <p className=" font-bold text-xs ">View All</p>
                    </div>
                    <div className=" w-full flex items-center justify-between ">
                        <div className=" flex gap-2 items-center ">
                            <div className=" w-11 h-11 rounded-full bg-green-300 " />
                            <div className=" flex flex-col ">
                                <p className=" text-sm font-bold ">
                                    Alex Rivera
                                </p>
                                <p className=" text-secondary text-[11px] ">
                                    Barbering Expert
                                </p>
                            </div>
                        </div>
                        <CustomButton height="35px" variant="outlinebrand">
                            Follow
                        </CustomButton>
                    </div>
                    <div className=" w-full flex items-center justify-between ">
                        <div className=" flex gap-2 items-center ">
                            <div className=" w-11 h-11 rounded-full bg-green-300 " />
                            <div className=" flex flex-col ">
                                <p className=" text-sm font-bold ">
                                    Alex Rivera
                                </p>
                                <p className=" text-secondary text-[11px] ">
                                    Barbering Expert
                                </p>
                            </div>
                        </div>
                        <CustomButton height="35px">Following</CustomButton>
                    </div>
                    <div className=" w-full flex items-center justify-between ">
                        <div className=" flex gap-2 items-center ">
                            <div className=" w-11 h-11 rounded-full bg-green-300 " />
                            <div className=" flex flex-col ">
                                <p className=" text-sm font-bold ">
                                    Alex Rivera
                                </p>
                                <p className=" text-secondary text-[11px] ">
                                    Barbering Expert
                                </p>
                            </div>
                        </div>
                        <CustomButton height="35px" variant="outlinebrand">
                            Follow
                        </CustomButton>
                    </div>
                </div>
                <div className=" flex w-full flex-col gap-4 ">
                    <p className=" font-bold ">Discovery</p>
                    <div className=" w-full grid grid-cols-2 gap-4 text-white ">
                        <div className=" w-full h-[177px] rounded-3xl flex p-4 flex-col bg-brand ">
                            <div className=" mt-auto flex flex-col gap-3 ">
                                <Star1 size={20} />
                                <p className=" text-sm font-bold ">
                                    All hair Product
                                </p>
                            </div>
                        </div>
                        <div className=" w-full h-[177px] rounded-3xl flex p-4 flex-col bg-brand ">
                            <div className=" mt-auto flex flex-col gap-3 ">
                                <Star1 size={20} />
                                <p className=" text-sm font-bold ">
                                    All Skin care product{" "}
                                </p>
                            </div>
                        </div>
                        <div className=" w-full h-[177px] rounded-3xl flex p-4 flex-col bg-brand ">
                            <div className=" mt-auto flex flex-col gap-3 ">
                                <Star1 size={20} />
                                <p className=" text-sm font-bold ">
                                    All the hair stylists
                                </p>
                            </div>
                        </div>
                        <div className=" w-full h-[177px] rounded-3xl flex p-4 flex-col bg-brand ">
                            <div className=" mt-auto flex flex-col gap-3 ">
                                <Star1 size={20} />
                                <p className=" text-sm font-bold ">
                                    All the hair stylists
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div
                    style={{
                        background:
                            "linear-gradient(135deg, rgba(129, 39, 207, 0.05) 0%, rgba(129, 39, 207, 0) 100%)",
                    }}
                    className=" w-full flex flex-col shadow p-6 gap-3 rounded-3xl justify-center items-center "
                >
                    <div className=" w-14 h-14 rounded-2xl bg-white text-brand flex justify-center items-center ">
                        <People size={30} />
                    </div>
                    <div className=" text-center ">
                        <p className=" font-bold ">Jenes Glow</p>
                        <p className=" text-sm text-secondary ">
                            Connect with 50k+ beauty enthusiasts and pros.
                        </p>
                    </div>
                    <CustomButton
                        height="45px"
                        variant="outlinebrand"
                        fullWidth
                    >
                        follow
                    </CustomButton>
                </div>
            </div>
        </div>
    );
}
