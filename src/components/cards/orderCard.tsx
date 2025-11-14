"use client"
import { IOrderDetail } from "@/helper/model/business"
import { formatNumber } from "@/helper/utils/numberFormat"
import { CustomImage } from "../custom"
import { RiStarFill } from "react-icons/ri";
import { dateFormatMonthDay } from "@/helper/utils/dateFormat";
import { useRouter } from "next/navigation";

export default function OrderCard(
    { item }: { item: IOrderDetail }
) { 

    const router = useRouter()

    return (
        <div onClick={()=> router.push(`/myorder/${item?._id}/product`)} className=" w-full border rounded-2xl p-4 gap-3 flex flex-col " >
            <div className=" w-full h-[266px] rounded-2xl bg-gray-300 " >
                <CustomImage src={item?.product?.pictures[0]} style={{ borderRadius: "16px" }} alt={item?.product?.name} fillContainer />
            </div>
            <div className=" w-full flex flex-col " >
                <div className=" flex justify-between items-center " >
                    <p className=" font-bold capitalize " >{item?.product?.name}</p>
                    <div className=" text-sm flex items-center gap-1 " >
                        <RiStarFill size={"16px"} color="#EFD414" />
                        <p>{item?.business?.rating}</p>
                    </div>
                </div>
                <p className=" font-bold " >{formatNumber(item?.product?.price)}</p>
                <div className=" pt-2 mt-2 border-t w-full flex justify-between items-center " >
                    <p className=" text-sm font-medium " >Order On {dateFormatMonthDay(item?.createdAt)}</p>
                    <div className={` px-[10px] h-[27px] flex justify-center items-center rounded-full text-white ${item?.status === "PROCESSING" ? " bg-[#FF9500] " : " bg-[#14AE5C] "} `} >
                        <p className=" text-xs font-semibold " >{item?.status === "PROCESSING" ? "ONGOING" : "COMPLETED"}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}