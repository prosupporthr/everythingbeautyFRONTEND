"use client";
import { IChatMessage } from "@/helper/model/chat";
import { dateFormat, timeFormat } from "@/helper/utils/dateFormat";
import { textLimit } from "@/helper/utils/textlimit";
import { Avatar } from "@heroui/react";
import { useState } from "react";
import { RiDeleteBin5Line, RiReplyLine } from "react-icons/ri";
import { DeleteModal, EditMessageModal } from "../modals";
import { MdOutlineEdit } from "react-icons/md";

export default function MessageCard({
    showdate,
    item,
    self,
}: {
    showdate?: boolean;
    item: IChatMessage;
    self?: boolean;
}) {
    const [show, setShow] = useState<IChatMessage>({} as IChatMessage);
    const [isOpen, setIsOpen] = useState(false);
    const [isShow, setIsShow] = useState(false);

    return (
        <div className=" w-full flex flex-col gap-4 ">
            {showdate && (
                <p className=" text-center lg:text-base text-sm ">
                    {dateFormat(item?.createdAt)}
                </p>
            )}
            <div
                onMouseOver={() => setShow(item)}
                onMouseOut={() => setShow({} as IChatMessage)}
                className={` w-full ${!self ? " flex-row-reverse " : ""} flex items-center gap-4 justify-end  `}
            >
                {show?._id === item?._id && (
                    <div
                        className={` ${self ? " ml-auto " : " mr-auto "} h-fit flex justify-start w-fit gap-6`}
                    >
                        <button onClick={() => setIsShow(true)}>
                            <RiReplyLine size={"20px"} />
                        </button>
                        <button
                            className={` ${self ? " flex " : " hidden "} `}
                            onClick={() => setIsOpen(true)}
                        >
                            <RiDeleteBin5Line size={"20px"} />
                        </button>
                        <button
                            className={` ${self ? " flex " : " hidden "} `}
                            onClick={() => setIsShow(true)}
                        >
                            <MdOutlineEdit size={"20px"} />
                        </button>
                    </div>
                )}
                <div
                    className={` max-w-[70%] min-w-[40%] lg:min-w-[20%] ${self ? " bg-brand rounded-tr-none  text-white " : " bg-gray-300 rounded-tl-none "} flex gap-2 rounded-2xl p-3 lg:p-4 `}
                >
                    {!self && (
                        <div className=" w-fit h-fit rounded-full bg-gray-300 ">
                            <Avatar
                                src={item?.sender?.profilePicture}
                                name={item?.sender?.firstName}
                                size="sm"
                            />
                        </div>
                    )}
                    <div className=" flex flex-col gap-1 w-full">
                        {!self && (
                            <p className=" text-lg font-semibold capitalize ">
                                {textLimit(
                                    item?.sender?.firstName +
                                        " " +
                                        item?.sender?.lastName,
                                    20,
                                )}
                            </p>
                        )}
                        <p className=" text-sm font-medium  ">{item.message}</p>
                        <div className=" w-full flex justify-end ">
                            <p className=" text-xs mt-1 ">
                                {timeFormat(item?.createdAt)}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <DeleteModal
                name={item?.message}
                isOpen={isOpen}
                onClose={setIsOpen}
                type="Message"
                id={item?._id}
            />
            <EditMessageModal
                id={item?._id}
                item={item}
                isOpen={isShow}
                onClose={setIsShow}
            />
        </div>
    );
}
