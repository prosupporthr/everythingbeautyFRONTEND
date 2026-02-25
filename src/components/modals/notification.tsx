"use client"
import { useFetchData } from "@/hooks/useFetchData";
import { ModalLayout } from "../custom";
import { useAtom } from "jotai";
import { userAtom } from "@/store/user";
import { INotification } from "@/helper/model/notification";
import { LoadingLayout } from "../shared";
import { dateFormat } from "@/helper/utils/dateFormat";
import { useEffect, useState } from "react";
import { URLS } from "@/helper/services/urls";
import useMessage from "@/hooks/useMessage";
import { uniqBy } from "lodash";

export default function Notification({
    isOpen,
    onClose,
    isRead,
    setIsRead
}: {
    isOpen: boolean;
    onClose: (by: boolean) => void;
    isRead: boolean
    setIsRead: (by: boolean) => void;
}) {
    const [user] = useAtom(userAtom);

    const { updateNotificationStatus, isLoading: loading } = useMessage()
    const [ unReadData, setUnReadData ] = useState<string[]>([])

    const { data = [], isLoading } = useFetchData<INotification[]>({
        endpoint: URLS.NOTIFICATIONBYUSER(user?._id as string),
        name: ["notification", user?._id as string],
        enable: user?._id ? true : false,
    }); 

    useEffect(() => {
        data?.map((item) => {
            if(item?.readBy){
                setIsRead(false)
                setUnReadData((prev)=>  uniqBy([...prev, item?._id], ""))
            }   
        })
    }, [data])

    console.log(unReadData);
    
    useEffect(()=>{
        if(isOpen && !isRead){
            updateNotificationStatus.mutate({
                ids: unReadData,
                userType: "user"
            })
        }
    }, [isRead, isOpen])

    
    return (
        <ModalLayout
            isOpen={isOpen}
            size={"full"}
            onClose={() => onClose(false)}
        >
            <div className=" w-full h-full relative ">
                <div className=" w-full h-[80px] top-0 sticky px-4 lg:px-6 bg-white z-10 border-b border-bordercolor flex items-center ">
                    <p className=" text-2xl font-bold ">Notification</p>
                </div>
                <div className=" w-full h-fit flex flex-col gap-4 items-center py-10 ">
                    <LoadingLayout loading={isLoading} length={data?.length}>
                        {data?.map((item) => {
                            return (
                                <div
                                    key={item?._id}
                                    className=" w-full! max-w-[740px] h-fit relative flex gap-4 py-4 p-4 lg:p-6 rounded-2xl shadow "
                                >
                                    <div className=" flex flex-col ">
                                        <p className=" lg:not-only:text-lg font-semibold ">
                                            {item?.title}
                                        </p>
                                        <p className=" text-sm text-[#444444] -mt-1 ">
                                            {item?.description}
                                        </p>
                                        <p className=" text-xs mt-2 text-[#747474] ">
                                            {dateFormat(item?.createdAt)}
                                        </p>
                                    </div>
                                    {!item?.isRead && (
                                        <div className=" w-2 h-2 rounded-full bg-brand absolute top-4 right-4 " />
                                    )}
                                </div>
                            );
                        })}
                    </LoadingLayout>
                </div>
            </div>
        </ModalLayout>
    );
}
