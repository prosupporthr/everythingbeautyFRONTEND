"use client"
import { LoadingLayout } from "@/components/shared";
import { dateFormat } from "@/helper/utils/dateFormat";
import { useUserStore } from "@/hooks/user";
import { Avatar } from "@heroui/react";
import router from "next/router";
import { IoArrowBackOutline } from "react-icons/io5";

export default function ProfilePage() {

    const { data, isLoading } = useUserStore();

    return (
        <div className=" w-full min-h-[50vh] " >
            <LoadingLayout loading={isLoading} >
                <div className=" w-full flex flex-col py-10 gap-10 h-full ">
                    <div className=" w-full flex flex-col px-8 " >
                        <div className=" w-full max-w-[1276px] flex flex-col gap-4 pb-5 " >
                            <div className=" flex gap-3 pb-4 border-b items-center " >
                                <button onClick={() => router.back()} className=" w-12 h-12 rounded-full flex  border items-center justify-center border-gray-100 text-primary " >
                                    <IoArrowBackOutline size={"22px"} />
                                </button>
                                <p className=" text-2xl font-bold capitalize " >My Profile</p>
                            </div>
                            <div className=" w-full flex flex-col gap-4 " >
                                <div className=" w-full flex items-center gap-4 " >
                                    <Avatar src={data?.profilePicture} className=" w-[150px] h-[150px] " name={data?.firstName} />
                                    <div className=" flex flex-col items-start gap-1 " >
                                        <div className=" flex items-center gap-1 " >
                                            <p className=" text-2xl font-semibold capitalize " >{data?.firstName + " " + data?.lastName}</p>
                                        </div>
                                        <p className=" text-sm font-medium " >{data?.email}</p>
                                        <p className=" text-secondary text-xs " >Joined {dateFormat(data?.createdAt ?? "")}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </LoadingLayout>
        </div>
    )
}