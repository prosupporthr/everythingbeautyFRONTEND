"use client"
import { IChatMessage } from "@/helper/model/chat";
import { timeFormat } from "@/helper/utils/dateFormat";
import { textLimit } from "@/helper/utils/textlimit";
import { Avatar } from "@heroui/react";

export default function MessageCard (
    { showdate, item} : { showdate?: boolean, item: IChatMessage }
) {
    return(
        <div className=" w-full flex flex-col gap-4 " >
            {showdate && (
                <p className=" text-center " >Today</p>
            )}
            <div className=" w-[70%] flex gap-2 " >
                <div className=" w-fit h-fit rounded-full bg-gray-300 " >
                    <Avatar src={item?.sender?.profilePicture} name={item?.sender?.firstName} size="sm" />
                </div>
                <div className=" flex flex-col gap-1 " >
                    <p className=" text-lg font-medium capitalize " >{textLimit(item?.sender?.firstName+" "+item?.sender?.lastName, 20)}</p>
                    <p className=" text-secondary text-xs mt-1 " >{timeFormat(item?.createdAt)}</p>
                    <p className=" text-sm " >{item.message}</p>
                </div>
            </div>
        </div>
    )
}