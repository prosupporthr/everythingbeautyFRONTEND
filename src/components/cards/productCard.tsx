"use client";
import { IProductDetail } from "@/helper/model/business";
import { ImageCarousel } from "../custom";
import { textLimit } from "@/helper/utils/textlimit";
import { useRouter } from "next/navigation";
import { ModalLayout, StarRating, Verified } from "../shared";
import { useState } from "react";

export default function ProductCard({
    item,
    post,
}: {
    item: IProductDetail;
    post?: boolean;
}) {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState("");

    return (
        <div
            role="button"
            tabIndex={0}
            onClick={() => router.push(`/sales/${item?._id}/product`)}
            onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    //   onClick?.(e as unknown as React.MouseEvent<HTMLDivElement>);
                }
            }}
            className="w-full border rounded-2xl p-2 shadow flex flex-col gap-3 cursor-pointer"
        >
            <div
                className={` rounded-t-lg w-full ${post ? " h-[200px] " : " h-[266px] "} relative `}
            > 
                <ImageCarousel
                    images={item?.pictures}
                    className="w-full h-full"
                />
                <Verified item={item?.business} />
            </div>
            <div
                className={` w-full flex justify-between ${post ? "" : " px-3"} pb-3 `}
            >
                <div className=" flex flex-col items-start ">
                    <p className=" font-bold capitalize text-black ">
                        {textLimit(item?.name + " test ", 20)}
                        {item?.name.length > 20 && (
                            <span
                                onClick={() => setIsOpen(item?._id)}
                                className=" font-semibold text-xs cursor-pointer text-brand "
                            >
                                show more
                            </span>
                        )}
                    </p>
                    <p className=" text-secondary text-sm ">
                        {textLimit(item?.business?.location, 20)}
                    </p>
                </div>
                <StarRating rating={Number(item?.business?.rating)} />
            </div>
            <ModalLayout
                isOpen={item?._id === isOpen}
                onClose={() => setIsOpen("")}
            >
                <div className=" text-sm ">{item?.name}</div>
            </ModalLayout>
        </div>
    );
}
