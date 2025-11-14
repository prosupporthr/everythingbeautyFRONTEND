"use client"
import { IBookingDetail } from "@/helper/model/business";
import { dateFormatMonthDay, timeFormat } from "@/helper/utils/dateFormat";
import { formatNumber } from "@/helper/utils/numberFormat"; 
import { CustomImage } from "../custom";
import { useRouter } from "next/navigation";

export default function BusinessServiceCard(
    { item, admin = true }: { item: IBookingDetail, admin?: boolean }
) {

    const router = useRouter()

    return (
        <div  onClick={()=> router.push(`/myorder/${item?._id}/service`)} className=" w-full flex cursor-pointer flex-col border rounded-[10px] " >
            <div className={` w-full flex flex-col p-6 gap-4 ${admin ? "border-b" : ""} `} >
                <p className=" text-sm font-semibold " >{dateFormatMonthDay(item?.createdAt)} | <span className=" text-secondary font-normal " >{timeFormat(item?.createdAt)}</span></p>
                <div className=" flex gap-2 w-full " >
                    <div className=" w-fit " >
                        <div className=" w-12 h-12 rounded-full bg-gray-300 " >
                            <CustomImage src={item?.service?.pictures[0]} alt={item?.service?.name} fillContainer style={{ borderRadius: "999px" }} />
                        </div>
                    </div>
                    <div className=" flex-col flex w-full " >
                        <p className=" font-semibold capitalize " >{item?.user?.firstName + " " + item?.user?.lastName}</p>
                        <div className=" w-full flex justify-between items-center " >
                            <p className=" text-sm text-secondary " >{item?.service?.name}</p>
                            <p className=" text-sm text-secondary " >{formatNumber(item?.service?.hourlyRate)}</p>
                        </div>
                    </div>
                </div>
            </div>
            {admin && (
                <div className=" w-full h-[53px] flex justify-center items-center " >
                    <button className=" text-sm font-semibold text-brand " >
                        Message
                    </button>
                </div>
            )}
        </div>
    )
}