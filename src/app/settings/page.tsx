"use client"
import { DeleteModal } from "@/components/modals";
import { settingsList } from "@/helper/services/databank"; 
import { userAtom } from "@/store/user";
import { useAtom } from "jotai";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { IoChevronForward } from "react-icons/io5";

export default function Settings() {

    const [ isOpen, setIsOpen ] = useState(false)
    const [ user ] = useAtom(userAtom)
    const router = useRouter()

    const handleOpen = (item: string, link?: string) => {
        if(item.includes("Delete")) {
            setIsOpen(true)
        } else {
            router.push(link ?? "")
        }
    }

    return (
        <div className=" w-full h-full flex flex-col items-center justify-center ">
            <div className=" lg:max-w-[320px] w-full flex flex-col gap-4 ">
                {settingsList.map((item) => {
                    return (
                        <button
                            key={item.label}
                            className=" w-full flex items-center justify-between "
                            onClick={()=> handleOpen(item?.label, item?.link)}
                        >
                            <div className=" w-full flex items-center gap-2 ">
                                <div className=" w-11 h-11 flex items-center justify-center ">
                                    <item.icon size={"25px"} color={item?.iconcolor} />
                                </div>
                                <div className=" text-left flex flex-col items-start ">
                                    <p className=" font-semibold text-brand ">
                                        {item?.label}
                                    </p>
                                    <p className=" text-secondary text-xs ">
                                        {item?.details}
                                    </p>
                                </div>
                            </div>
                            <IoChevronForward size={"25px"} />
                        </button>
                    );
                })}
            </div>
            <DeleteModal type="user" id="" name={user?.firstName+" "+user?.lastName} isOpen={isOpen} onClose={setIsOpen} />
        </div>
    );
}
