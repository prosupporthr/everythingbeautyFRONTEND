"use client"
import { IProductDetail } from "@/helper/model/business"; 
import { CustomImage, ImageCarousel } from "../custom";
import { textLimit } from "@/helper/utils/textlimit";
import { useRouter } from "next/navigation";
import { ModalLayout, StarRating, Verified } from "../shared";
import { useState } from "react";

export default function ProductCard(
    { item }: { item: IProductDetail }
) {

    const router = useRouter()
    const [ isOpen, setIsOpen ] = useState("")

    return (
        <button onClick={() => router.push(`/sales/${item?._id}/product`)} className=" w-full border rounded-lg shadow flex flex-col gap-3 " >
            <div className=" rounded-t-lg w-full h-[266px] border-b bg-gray-200 relative " >
                {/* <CustomImage nopopup alt={item?.name} style={{
                    borderTopLeftRadius: "8px",
                    borderTopRightRadius: "8px"
                }} src={item?.pictures[0]} fillContainer /> */}
                <ImageCarousel images={item?.pictures} className="w-full h-[266px]" />
                <Verified item={item?.business} />
            </div>
            <div className=" w-full flex justify-between px-3 pb-3 " >
                <div className=" flex flex-col items-start " >
                    <p className=" font-bold capitalize " >{textLimit(item?.name, 20)}{item?.name.length > 20 && <span onClick={()=> setIsOpen(item?._id)} className=" font-semibold text-xs cursor-pointer text-brand " >show more</span>}</p>
                    <p className=" text-secondary text-sm " >{textLimit(item?.business?.location, 20)}</p>
                </div>
                <StarRating rating={Number(item?.business?.rating)} />
            </div>
            <ModalLayout isOpen={item?._id === isOpen} onClose={()=> setIsOpen("")} >
                <div className=" text-sm " >
                    {item?.name}
                </div>
            </ModalLayout>
        </button>
    )
}