"use client";
import { IChatList } from "@/helper/model/chat";
import { URLS } from "@/helper/services/urls";
import { dateFormatMonthDay, timeFormat } from "@/helper/utils/dateFormat";
import { textLimit } from "@/helper/utils/textlimit";
import { useFetchData } from "@/hooks/useFetchData";
import { userAtom } from "@/store/user";
import { Avatar } from "@heroui/react";
import { Spinner } from "@heroui/spinner";
import { useAtom } from "jotai";

export default function MessageCard({
    item,
    selected,
}: {
    item: IChatList;
    selected: IChatList;
}) {
    const [user] = useAtom(userAtom);

    console.log(item);

    const { data: count, isLoading: loading } = useFetchData<{
        count: number;
    }>({
        endpoint: URLS.MESSAGEUSERCOUNT(item?._id as string),
        name: ["chatuserbyid", item?._id as string],
    });

    console.log(count);

    return (
        <>
            {item?.recipient?._id !== user?._id ? (
                <div
                    className={` w-full flex gap-3 rounded-2xl shadow px-3 py-4 ${item?._id === selected?._id ? " bg-brand text-white " : " bg-[#FAFAFAF5] "} `}
                >
                    <div className=" w-fit h-fit ">
                        <Avatar
                            src={item?.recipient?.profilePicture}
                            name={item?.recipient?.firstName}
                            size="md"
                        />
                    </div>
                    <div className=" flex flex-col text-left ">
                        <p className=" font-medium capitalize ">
                            {textLimit(
                                item?.recipient?.firstName +
                                    " " +
                                    item?.recipient?.lastName,
                                20,
                            )}
                        </p>
                        <p
                            className={` text-xs ${item?._id === selected?._id ? " text-white " : " text-secondary "} `}
                        >
                            {dateFormatMonthDay(item?.updatedAt)}
                        </p>
                    </div>
                </div>
            ) : (
                <div
                    className={` w-full flex gap-3 rounded-2xl shadow px-3 py-4 ${item?._id === selected?._id ? " bg-brand text-white " : " bg-[#FAFAFAF5] "} `}
                >
                    <div className=" w-fit h-fit ">
                        <Avatar
                            src={item?.sender?.profilePicture}
                            name={item?.sender?.firstName}
                            size="md"
                        />
                    </div>
                    <div className=" flex flex-col text-left ">
                        <p className=" font-medium capitalize ">
                            {textLimit(
                                item?.sender?.firstName +
                                    " " +
                                    item?.sender?.lastName,
                                20,
                            )}
                        </p>
                        {user?._id === item?.lastMessage?.senderId ? (
                            <p
                                className={` text-xs ${item?._id === selected?._id ? " text-white " : " text-secondary "} `}
                            >
                                {dateFormatMonthDay(
                                    item?.lastMessage?.createdAt,
                                )}{" "}
                                {timeFormat(item?.lastMessage?.createdAt)}
                            </p>
                        ) : (
                            <p
                                className={` text-xs ${item?._id === selected?._id ? " text-white " : " text-secondary "} `}
                            >
                                {item?.lastMessage?.message}
                            </p>
                        )}
                    </div>
                    {count && count?.count > 0 && (
                        <div className=" w-5 h-5 rounded-full bg-red-600 ml-auto flex justify-center items-center text-xs font-semibold text-white ">
                            {!loading && count?.count}
                            {loading && <Spinner color="white" />}
                        </div>
                    )}
                </div>
            )}
        </>
    );
}
