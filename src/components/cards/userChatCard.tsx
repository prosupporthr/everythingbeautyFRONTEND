"use client"
import { IChatList } from "@/helper/model/chat";
import { dateFormatMonthDay } from "@/helper/utils/dateFormat";
import { textLimit } from "@/helper/utils/textlimit";
import { userAtom } from "@/store/user";
import { Avatar } from "@heroui/react";
import { useAtom } from "jotai";


export default function MessageCard(
    { item, selected }: { item: IChatList, selected: IChatList }
) {

    const [user] = useAtom(userAtom)

    return (
        <>
            {item?.recipient?._id !== user?._id ? (
                <div className={` w-full flex gap-3 rounded-2xl shadow px-3 py-4 ${item?._id === selected?._id ? " bg-brand text-white " : " bg-[#FAFAFAF5] "} `} >
                    <div className=" w-fit h-fit " >
                        <Avatar src={item?.recipient?.profilePicture} name={item?.recipient?.firstName} size="md" />
                    </div>
                    <div className=" flex flex-col text-left " >
                        <p className=" font-medium capitalize " >{textLimit(item?.recipient?.firstName + " " + item?.recipient?.lastName, 20)}</p>
                        <p className={` text-xs ${item?._id === selected?._id ? " text-white " : " text-secondary "} `} >{dateFormatMonthDay(item?.updatedAt)}</p>
                    </div>
                </div>
            ) : (
                <div className={` w-full flex gap-3 rounded-2xl shadow px-3 py-4 ${item?._id === selected?._id ? " bg-brand text-white " : " bg-[#FAFAFAF5] "} `} >
                    <div className=" w-fit h-fit " >
                        <Avatar src={item?.sender?.profilePicture} name={item?.sender?.firstName} size="md" />
                    </div>
                    <div className=" flex flex-col text-left " >
                        <p className=" font-medium capitalize " >{textLimit(item?.sender?.firstName + " " + item?.sender?.lastName, 20)}</p>
                        <p className={` text-xs ${item?._id === selected?._id ? " text-white " : " text-secondary "} `} >{dateFormatMonthDay(item?.updatedAt)}</p>
                    </div>
                </div>
            )}
        </>
    )
}