"use client";
import { CustomButton, CustomImage, ImageCarousel } from "@/components/custom";
import { DeleteModal } from "@/components/modals";
import { LoadingLayout } from "@/components/shared";
import { IProductDetail, IServiceDetail } from "@/helper/model/business";
import { formatNumber } from "@/helper/utils/numberFormat";
import useBusiness from "@/hooks/useBusiness";
import { useFetchData } from "@/hooks/useFetchData";
import { userAtom } from "@/store/user";
import { useAtom } from "jotai";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { HiStar } from "react-icons/hi2";

interface IBookmark {
    _id: string;
    isDeleted: boolean;
    userId: string;
    productId?: IProductDetail;
    product?: {
        data: IProductDetail
    };
    service: {
        data: IServiceDetail
    };
    serviceId: IServiceDetail;
    type: "product" | "service";
    createdAt: string;
    updatedAt: string;
}

export default function BookmarkList() {
    const [user] = useAtom(userAtom);
    const router = useRouter();
    const [selected, setSelected] = useState<{
        id: string;
        name: string;
    }>({
        id: "",
        name: "",
    });
    const [isOpen, setIsOpen] = useState(false);

    const { data, isLoading } = useFetchData<IBookmark[]>({
        endpoint: `/bookmarks/user/${user?._id}`,
        name: ["bookmarks"],
    });

    const deleteHandler = (name: string, id: string) => {
        setSelected({
            name,
            id,
        });
        setIsOpen(true);
    };

    return (
        <LoadingLayout loading={isLoading} length={data?.length}>
            <div className=" w-full grid grid-cols-1 lg:grid-cols-3 gap-4 ">
                {data?.map((item) => {
                    return (
                        <>
                            {item?.type === "product" && (
                                <div className=" w-full flex flex-col p-4 rounded-2xl shadow gap-2 ">
                                    <div className=" w-full flex h-[170px] bg-gray-400 rounded-md ">
                                        <ImageCarousel
                                            images={
                                                item?.product?.data?.pictures ?? []
                                            }
                                            className="w-full h-full"
                                        />
                                    </div>
                                    <div className=" flex flex-col w-full gap-1 ">
                                        <div className=" w-full flex items-center justify-between ">
                                            <p className=" text-sm font-bold capitalize ">
                                                {item?.product?.data?.name}
                                            </p>
                                            {item?.product?.data?.allowReview && (
                                                <div className=" flex items-center gap-1 ">
                                                    <HiStar
                                                        size={"16px"}
                                                        color="#EFD414"
                                                    />
                                                    <p className=" text-[15px] font-bold ">
                                                        {"0"}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                        <p className=" text-xs ">
                                            {formatNumber(
                                                Number(item?.product?.data?.price),
                                            )}
                                        </p>
                                        <p className=" text-xs text-secondary ">
                                            {formatNumber(
                                                Number(item?.product?.data?.quantity),
                                                "",
                                            )}{" "}
                                            left
                                        </p>
                                    </div>
                                    <div className=" w-full flex flex-col lg:flex-row gap-3 ">
                                        <CustomButton
                                            onClick={() =>
                                                router.push(
                                                    `/sales/${item?.product?.data?._id}/product`,
                                                )
                                            }
                                            height="45px"
                                            fullWidth
                                        >
                                            Buy
                                        </CustomButton>
                                        <CustomButton
                                            height="45px"
                                            onClick={() =>
                                                deleteHandler(
                                                    item?.product?.data?.name as string,
                                                    item?._id,
                                                )
                                            }
                                            variant="customDanger"
                                            fullWidth
                                        >
                                            Remove
                                        </CustomButton>
                                    </div>
                                </div>
                            )}

                            {item?.type === "service" && (
                                <div className=" w-full flex flex-col p-4 rounded-2xl shadow gap-2 ">
                                    <div className=" w-full flex h-[170px] ">
                                        <ImageCarousel
                                            images={
                                                item?.service?.data?.pictures ?? []
                                            }
                                            className="w-full h-full"
                                        />
                                    </div>
                                    <div className=" flex flex-col w-full gap-1 ">
                                        <div className=" w-full flex items-center justify-between ">
                                            <p className=" text-sm font-bold capitalize ">
                                                {item?.service?.data?.name}
                                            </p>
                                            {item?.service?.data?.allowReview && (
                                                <div className=" flex items-center gap-1 ">
                                                    <HiStar
                                                        size={"16px"}
                                                        color="#EFD414"
                                                    />
                                                    <p className=" text-[15px] font-bold ">
                                                        {"0"}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                        <p className=" text-xs ">
                                            {formatNumber(
                                                Number(
                                                    item?.service?.data?.hourlyRate,
                                                ),
                                            )}
                                        </p>
                                    </div>
                                    <div className=" w-full flex flex-col lg:flex-row gap-3 mt-auto ">
                                        <CustomButton
                                            height="45px"
                                            onClick={() =>
                                                router.push(
                                                    `/sales/${item?.service?.data?.businessId}/services`,
                                                )
                                            }
                                            fullWidth
                                        >
                                            Book
                                        </CustomButton>
                                        <CustomButton
                                            height="45px"
                                            onClick={() =>
                                                deleteHandler(
                                                    item?.service?.data?.name,
                                                    item?._id,
                                                )
                                            }
                                            variant="customDanger"
                                            fullWidth
                                        >
                                            Remove
                                        </CustomButton>
                                    </div>
                                </div>
                            )}
                        </>
                    );
                })}

                <DeleteModal
                    isOpen={isOpen}
                    onClose={setIsOpen}
                    type={"Bookmark"}
                    id={selected?.id as string}
                    name={selected?.name as string}
                />
            </div>
        </LoadingLayout>
    );
}
