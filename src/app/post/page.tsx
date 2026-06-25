"use client";
import { PostCard } from "@/components/cards";
import LandingBusinessCard from "@/components/cards/landingBusinessCard";
import { CustomButton } from "@/components/custom";
import { PostForm } from "@/components/forms";
import { LoadingLayout, ModalLayout } from "@/components/shared";
import { IBusinessDetails, IPostDetail } from "@/helper/model/business";
import { URLS } from "@/helper/services/urls";
import useBusiness from "@/hooks/useBusiness";
import { useInfiniteScroller } from "@/hooks/useCustomGetScroller";
import { useFetchData } from "@/hooks/useFetchData";
import usePost from "@/hooks/usePost";
import { userAtom } from "@/store/user";
import { Spinner } from "@heroui/spinner";
import { addToast } from "@heroui/toast";
import { Gallery, People, Send } from "iconsax-reactjs";
import { useAtom } from "jotai";
import { useRouter } from "next/navigation";
import { useState } from "react";

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

    const { data, isLoading: loading } = useFetchData<IBusinessDetails[]>({
        endpoint: `/business/filter`,
        name: ["business"],
    });

    const { handleLikePost } = usePost();

    const [user] = useAtom(userAtom);
    const router = useRouter();

    const [open, setOpen] = useState(false);

    const {
        formikPost,
        imageFiles,
        setImageFiles,
        setPreviews,
        isLoading: loadingPost,
    } = useBusiness({
        post: true,
    });

    const handleClick = () => {
        if (user?.business?._id) {
            setOpen(true);
        } else {
            addToast({
                title: "Warning",
                description: "Join as a Stylist to create post",
                color: "warning",
            });
        }
    };

    const handleSubmit = () => {
        if (user?.business?._id) {
            formikPost.handleSubmit()
        } else {
            addToast({
                title: "Warning",
                description: "Join as a Stylist to create post",
                color: "warning",
            });
        }
    };

    const business = data
        ?.filter((_, index) => index < 4)
        ?.map((item) => (
            <div key={item?._id}>
                <LandingBusinessCard small item={item} />
            </div>
        ));

    return (
        <div className=" w-full flex-1 lg:flex-row flex-col flex gap-6 lg:overflow-hidden ">
            <div className=" w-full h-auto lg:flex-1 flex items-center flex-col p-4 lg:p-6 lg:pr-0 gap-4 lg:overflow-auto ">
                <div className=" lg:max-w-[500px] w-full flex flex-col gap-4 ">
                    <div className=" w-full flex flex-col gap-2 items-center ">
                        <div className=" w-full flex border border-[#CFC2D6CC] p-2 rounded-full items-center "> 
                            <input
                                value={formikPost.values?.body}
                                onChange={(e) =>
                                    formikPost.setFieldValue(
                                        "body",
                                        e.target.value,
                                    )
                                }
                                className="w-full h-full border-0 rounded-r-full text-sm px-3 outline-none focus:outline-none focus:ring-0"
                                placeholder="What is on your mind today?"
                            />
                            <button onClick={handleSubmit} className=" w-fit px-3 h-full flex justify-center items-center ">
                                {loadingPost ? 
                                <Spinner size="sm" /> : 
                                <Send size={"25px"} className=" text-brand " />
                                }
                            </button>
                        </div>
                        <button onClick={()=> handleClick()} className=" flex justify-center items-center w-fit rounded-2xl gap-2 px-3 py-[6px] bg-[#E0B0FF] text-black ">
                            <Gallery size={25} />
                            <p>Add Photos/Video in your post</p>
                        </button>
                    </div>
                    <div className=" w-full flex flex-col gap-4 ">
                        <LoadingLayout
                            loading={isLoading}
                            refetching={isFetchingMore}
                            length={items?.length}
                            ref={ref}
                        >
                            {items?.map((item, index) => {
                                return (
                                    <PostCard
                                        click={handleLikePost}
                                        key={index}
                                        item={item}
                                    />
                                );
                            })}
                        </LoadingLayout>
                    </div>
                </div>
            </div>
            <div className=" max-w-[470px] w-full lg:flex hidden pl-0 p-6 flex-col gap-6 lg:overflow-auto "> 
                <div className=" flex w-full flex-col gap-4 ">
                    <div className=" w-full flex justify-between items-center ">
                        <p className=" font-bold ">Discovery</p>
                        <button
                            onClick={() => router.push("/businesslist")}
                            className=" font-bold text-xs "
                        >
                            View All
                        </button>
                    </div>
                    <LoadingLayout loading={loading} length={data?.length}>
                        <div className=" w-full grid grid-cols-2 gap-4 text-white ">
                            {business}
                        </div>
                    </LoadingLayout>
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
            <ModalLayout isOpen={open} onClose={() => setOpen(false)}>
                <PostForm
                    modal
                    setPreviews={setPreviews}
                    formik={formikPost}
                    imageFiles={imageFiles}
                    isLoading={loadingPost}
                    setImageFiles={setImageFiles}
                />
            </ModalLayout>
        </div>
    );
}
