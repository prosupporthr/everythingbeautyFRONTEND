"use client";
import { PostCard, ProductCard } from "@/components/cards";
import LandingBusinessCard from "@/components/cards/landingBusinessCard";
import { PostForm } from "@/components/forms";
import { LoadingLayout, ModalLayout } from "@/components/shared";
import {
    IBusinessDetails,
    IPostDetail,
    IProductDetail,
} from "@/helper/model/business";
import { URLS } from "@/helper/services/urls";
import useBusiness from "@/hooks/useBusiness";
import { useInfiniteScroller } from "@/hooks/useCustomGetScroller";
import { useFetchData } from "@/hooks/useFetchData";
import usePost from "@/hooks/usePost";
import { postData, postDeleted } from "@/store/post";
import { userAtom } from "@/store/user";
import { Spinner } from "@heroui/spinner";
import { Gallery, Send } from "iconsax-reactjs";
import { useAtom, useAtomValue } from "jotai";
import { uniqBy } from "lodash";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const DISCOVERY_LIMIT = 4;

export default function PostPage() {
    const {
        items = [],
        ref,
        isLoading,
        isFetchingMore,
    } = useInfiniteScroller<IPostDetail>({
        queryKeyBaseArray: ["post"],
        endpoint: URLS.POST,
        limit: 10,
        noCache: true,
    });

    const { data: businesses, isLoading: loadingBusinesses } = useFetchData<
        IBusinessDetails[]
    >({
        endpoint: `/business/filter`,
        name: ["business"],
    });

    const { data: product = [], isLoading: loadingProduct } = useFetchData<
        IProductDetail[]
    >({
        endpoint: `/product/filter`,
        name: ["product"],
        params: {
            limit: 4,
        },
    });

    const { handleLikePost } = usePost();

    const [user] = useAtom(userAtom);
    const [posts, setPosts] = useAtom(postData);
    const deletedPosts = useAtomValue(postDeleted);
    const [loading, setLoading] = useState(false);

    const router = useRouter();

    const {
        formikPost,
        imageFiles,
        isOpen,
        setIsOpen,
        setImageFiles,
        setPreviews,
        isLoading: loadingPost,
    } = useBusiness({
        post: true,
        noredirect: true,
    });

    const handleOpenComposer = () => setIsOpen(true);
    const handleSubmitPost = () => formikPost.handleSubmit();

    useEffect(() => {
        if (items.length === 0) return;

        setLoading(true);
        setPosts((prev) => {
            const merged = uniqBy([...prev, ...items], "_id");
            return merged.length === prev.length ? prev : merged;
        });
        setLoading(false);
    }, [items, setPosts]);

    const visiblePosts = posts?.filter(
        (item) => !deletedPosts.includes(item?._id),
    );

    return (
        <div className="w-full flex-1 lg:flex-row flex-col flex gap-6 lg:overflow-hidden">
            <div className="w-full h-auto lg:flex-1 flex items-center flex-col p-4 lg:p-6 lg:pr-0 gap-4 lg:overflow-auto">
                <div className="lg:max-w-[500px] w-full flex flex-col gap-4">
                    <div className="w-full flex flex-col gap-2 items-center">
                        <div className="w-full flex border border-[#CFC2D6CC] p-2 rounded-full items-center">
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
                            <button
                                onClick={handleSubmitPost}
                                disabled={
                                    !formikPost?.values?.body || loadingPost
                                }
                                className="w-fit px-3 disabled:opacity-30 disabled:cursor-not-allowed! h-full flex justify-center items-center"
                            >
                                {loadingPost ? (
                                    <Spinner size="sm" />
                                ) : (
                                    <Send size={25} className="text-brand" />
                                )}
                            </button>
                        </div>
                        <button
                            onClick={handleOpenComposer}
                            className="flex justify-center items-center w-fit rounded-2xl gap-2 px-3 py-[6px] bg-[#E0B0FF] text-black"
                        >
                            <Gallery size={25} />
                            <p>Add Photos/Video in your post</p>
                        </button>
                    </div>

                    <div className="w-full flex flex-col gap-4">
                        <LoadingLayout
                            loading={isLoading || loading}
                            refetching={isFetchingMore}
                            length={visiblePosts?.length}
                            ref={ref}
                        >
                            {visiblePosts?.map((item, index) => {
                                const showExtra = (index + 1) % 10 === 0;
                                const sectionIndex = Math.floor(
                                    (index + 1) / 10,
                                );
                                const showDiscovery = sectionIndex % 2 === 1;

                                return (
                                    <React.Fragment key={item?._id}>
                                        <PostCard
                                            click={handleLikePost}
                                            item={item}
                                            isProfile={
                                                user?._id === item?.userId
                                            }
                                        />

                                        {showExtra &&
                                            (showDiscovery ? (
                                                <div className="w-full lg:hidden flex flex-col gap-4 p-6 pl-0">
                                                    <div className="w-full flex justify-between items-center">
                                                        <p className="font-bold">
                                                            Discovery
                                                        </p>
                                                        <button
                                                            onClick={() =>
                                                                router.push(
                                                                    "/businesslist",
                                                                )
                                                            }
                                                            className="font-bold text-xs"
                                                        >
                                                            View All
                                                        </button>
                                                    </div>

                                                    <LoadingLayout
                                                        loading={
                                                            loadingBusinesses
                                                        }
                                                        length={
                                                            businesses?.length
                                                        }
                                                    >
                                                        <div className="w-full min-w-0 flex overflow-x-auto gap-4 text-white">
                                                            {businesses?.map(
                                                                (business) => (
                                                                    <div
                                                                        className="w-[200px] shrink-0"
                                                                        key={
                                                                            business._id
                                                                        }
                                                                    >
                                                                        <LandingBusinessCard
                                                                            small
                                                                            item={
                                                                                business
                                                                            }
                                                                        />
                                                                    </div>
                                                                ),
                                                            )}
                                                        </div>
                                                    </LoadingLayout>
                                                </div>
                                            ) : (
                                                <div className="w-full flex flex-col gap-4">
                                                    <div className="w-full flex justify-between items-center">
                                                        <p className="font-bold">
                                                            Products
                                                        </p>
                                                        <button
                                                            onClick={() =>
                                                                router.push(
                                                                    "/productlist",
                                                                )
                                                            }
                                                            className="font-bold text-xs"
                                                        >
                                                            View All
                                                        </button>
                                                    </div>

                                                    <LoadingLayout
                                                        loading={
                                                            loadingProduct
                                                        }
                                                        length={
                                                            product?.length
                                                        }
                                                    >
                                                        <div className="w-full min-w-0 flex overflow-x-auto gap-4 text-white">
                                                            {product?.map(
                                                                (
                                                                    productItem,
                                                                ) => (
                                                                    <div
                                                                        className="shrink-0"
                                                                        key={
                                                                            productItem._id
                                                                        }
                                                                    >
                                                                        <ProductCard
                                                                            item={
                                                                                productItem
                                                                            }
                                                                            post
                                                                        />
                                                                    </div>
                                                                ),
                                                            )}
                                                        </div>
                                                    </LoadingLayout>
                                                </div>
                                            ))}
                                    </React.Fragment>
                                );
                            })}
                        </LoadingLayout>
                    </div>
                </div>
            </div>

            <div className="max-w-[470px] w-full lg:flex hidden flex-col gap-6 p-6 pl-0 lg:overflow-auto">
                <div className="flex w-full flex-col gap-4">
                    <div className="w-full flex justify-between items-center">
                        <p className="font-bold">Discovery</p>
                        <button
                            onClick={() => router.push("/businesslist")}
                            className="font-bold text-xs"
                        >
                            View All
                        </button>
                    </div>
                    <LoadingLayout
                        loading={loadingBusinesses}
                        length={businesses?.length}
                    >
                        <div className="w-full grid grid-cols-2 gap-4 text-white">
                            {businesses
                                ?.slice(0, DISCOVERY_LIMIT)
                                ?.map((item) => (
                                    <div key={item?._id}>
                                        <LandingBusinessCard
                                            small
                                            item={item}
                                        />
                                    </div>
                                ))}
                        </div>
                    </LoadingLayout>
                </div>

                <div className="flex w-full flex-col gap-4">
                    <div className="w-full flex justify-between items-center">
                        <p className="font-bold">Products</p>
                        <button
                            onClick={() => router.push("/productlist")}
                            className="font-bold text-xs"
                        >
                            View All
                        </button>
                    </div>
                    <LoadingLayout
                        loading={loadingProduct}
                        length={product?.length}
                    >
                        <div className="w-full grid grid-cols-2 gap-4 text-white">
                            {product
                                ?.slice(0, DISCOVERY_LIMIT)
                                ?.map((item) => (
                                    <div key={item?._id}>
                                        <ProductCard item={item} post />
                                    </div>
                                ))}
                        </div>
                    </LoadingLayout>
                </div>
            </div>

            <ModalLayout isOpen={isOpen} onClose={() => setIsOpen(false)}>
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