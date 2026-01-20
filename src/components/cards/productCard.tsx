"use client"
import { IProductDetail } from "@/helper/model/business"; 
import { CustomImage } from "../custom";
import { textLimit } from "@/helper/utils/textlimit";
import { useRouter } from "next/navigation";
import { StarRating } from "../shared";

export default function ProductCard(
    { item }: { item: IProductDetail }
) {

    const router = useRouter()

    return (
        <button onClick={() => router.push(`/sales/${item?._id}/product`)} className=" w-full flex flex-col gap-3 " >
            <div className=" rounded-tl-2xl w-full h-[266px] bg-gray-200 " >
                <CustomImage nopopup alt={item?.name} style={{
                    borderTopLeftRadius: "16px"
                }} src={item?.pictures[0]} fillContainer />
            </div>
            <div className=" w-full flex justify-between " >
                <div className=" flex flex-col items-start " >
                    <p className=" font-bold capitalize " >{item?.name}</p>
                    <p className=" text-secondary text-sm " >{textLimit(item?.business?.location, 20)}</p>
                </div>
                <StarRating rating={Number(item?.business?.rating)} />
            </div>
        </button>
    )
}