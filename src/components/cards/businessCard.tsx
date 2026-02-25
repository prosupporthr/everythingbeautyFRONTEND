"use client"
import { IBusinessDetails } from "@/helper/model/business"; 
import { CustomImage } from "../custom";
import { textLimit } from "@/helper/utils/textlimit";
import { useRouter } from "next/navigation";
import { StarRating, Verified } from "../shared";

export default function BusinessCard(
    { item }: { item: IBusinessDetails}
) {

    const router = useRouter()

    return (
        <button onClick={()=> router.push(`/sales/${item?._id}/services`)} className=" w-full flex flex-col gap-3 " >
            <div className=" rounded-tl-2xl w-full h-[266px] bg-gray-200 relative " >
                <CustomImage nopopup alt={item?.name} style={{
                    borderTopLeftRadius: "16px"  
                }} src={item?.pictures[0]} fillContainer />
                <Verified item={item} />
            </div>
            <div className=" w-full flex justify-between " >
                <div className=" flex flex-col items-start " >
                    <p className=" font-bold capitalize " >{item?.name}</p>
                    <p className=" text-secondary text-sm " >{textLimit(item?.location, 20)}</p>
                </div>
                <StarRating rating={Number(item?.rating)} />
            </div>
        </button>
    )
}