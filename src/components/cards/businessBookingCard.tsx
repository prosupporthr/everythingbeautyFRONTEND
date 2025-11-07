"use client"
import { Popover, PopoverTrigger, PopoverContent } from "@heroui/popover";
import { useState } from "react";
import { IoIosMore } from "react-icons/io";

export default function BusinessServiceCard() {

    const [isOpen, setOpen] = useState(false)

    const handleClick = (item: "edit" | "delete") => {
        setOpen(false)
    }

    return (
        <div className=" w-full flex flex-col border rounded-[10px] " >
            <div className=" w-full flex flex-col px-6 gap-4 border-b p-6 " >
                <p className=" text-sm font-semibold " >14 July | <span className=" text-secondary font-normal " >12:00PM</span></p>
                <div className=" flex gap-2 w-full " >
                    <div className=" w-fit " >
                        <div className=" w-[32px] h-[32px] rounded-full bg-red-400 " >

                        </div>
                    </div>
                    <div className=" flex-col flex w-full " >
                        <p className=" text-2xl font-semibold " >Jane Paul</p>
                        <div className=" w-full flex justify-between items-center " >
                            <p className=" text-sm text-secondary " >Hair Weaving</p>
                            <p className=" text-sm text-secondary " >$20</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className=" w-full h-[53px] flex justify-center items-center " >
                <button className=" text-sm font-semibold text-brand " >
                    Message
                </button>
            </div>
        </div>
    )
}