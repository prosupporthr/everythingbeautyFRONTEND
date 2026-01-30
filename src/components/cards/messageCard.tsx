"use client"
import { IChatMessage } from "@/helper/model/chat";
import { dateFormat, timeFormat } from "@/helper/utils/dateFormat";
import { textLimit } from "@/helper/utils/textlimit";
import { Avatar } from "@heroui/react";

export default function MessageCard(
    { showdate, item, self }: { showdate?: boolean, item: IChatMessage, self?: boolean }
) {
    return (
        <div className=" w-full flex flex-col gap-4 " >
            {showdate && (
                <p className=" text-center lg:text-base text-sm " >{dateFormat(item?.createdAt)}</p>
            )}
            <div className={` max-w-[70%] min-w-[40%] lg:min-w-[20%] ${self ? " bg-brand rounded-tr-none ml-auto text-white " : " bg-gray-300 rounded-tl-none mr-auto "} flex gap-2 rounded-2xl p-3 lg:p-4 `} >
                {!self && (
                    <div className=" w-fit h-fit rounded-full bg-gray-300 " >
                        <Avatar src={item?.sender?.profilePicture} name={item?.sender?.firstName} size="sm" />
                    </div>
                )}
                <div className=" flex flex-col gap-1 w-full" >
                    {!self && (
                        <p className=" text-lg font-semibold capitalize " >{textLimit(item?.sender?.firstName + " " + item?.sender?.lastName, 20)}</p>
                    )}
                    <p className=" text-sm font-medium  " >{item.message}</p>
                    <div className=" w-full flex justify-end " >
                        <p className=" text-xs mt-1 " >{timeFormat(item?.createdAt)}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}