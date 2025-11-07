"use client"
import { IServiceDetail } from "@/helper/model/business"; 
import { Popover, PopoverTrigger, PopoverContent } from "@heroui/popover";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { IoIosMore } from "react-icons/io"; 
import { CustomImage } from "../custom";
import { DeleteModal } from "../modals";

export default function BusinessServiceCard(
    { item }: { item: IServiceDetail }
) {

    const [show, setShow] = useState(false)
    const router = useRouter()
    const param = useParams();
    const id = param.id as string;
    const [isOpen, setIsOpen] = useState(false)

    const handleClick = (data: "edit" | "delete") => {
        setShow(false)
        if (data === "edit") {
            router.push(`/business/${id}/edit/${item?._id}/services`)
        } else {
            setIsOpen(true)
        }
    }

    return (
        <div className=" w-full flex flex-col border rounded-[10px] " >
            <div className=" w-full flex px-6 gap-3 border-b items-center h-[102px] " >
                <div className=" w-[63px] h-[54px] rounded-lg bg-gray-200 " >
                    <CustomImage style={{ borderRadius: "8px" }} src={item?.pictures[0]} fillContainer alt={item?.name} />
                </div>
                <div className=" flex-col flex " >
                    <p className=" text-xl font-semibold " >{item?.name}</p>
                    <p className=" text-sm text-secondary " >${item?.hourlyRate}</p>
                </div>
            </div>
            <div className=" w-full h-[68px] flex justify-center items-center " >

                <Popover showArrow isOpen={show} onOpenChange={setShow} backdrop={"opaque"} offset={10} placement="top">
                    <PopoverTrigger>
                        <button className=" w-8 h-8 rounded-full flex justify-center items-center bg-[#FCFCFC] " >
                            <IoIosMore size={"20px"} />
                        </button>
                    </PopoverTrigger>

                    <PopoverContent className="w-[100px]">
                        <div className=" w-full flex flex-col gap-1 " >
                            <div className=" py-1 border-b border-[#E7E7E7] flex flex-col gap-2 " >
                                <button onClick={() => handleClick("edit")} className=" h-[40px] flex w-full justify-center items-center text-sm font-medium " >Edit</button>
                            </div>
                            <div className=" py-1 flex flex-col gap-2 " >
                                <button onClick={() => handleClick("delete")} className=" h-[40px] text-[#FF554A] flex w-full justify-center items-center text-sm font-medium " >Delete</button>
                            </div>
                        </div>
                    </PopoverContent>
                </Popover>
            </div>
            <DeleteModal isOpen={isOpen} onClose={setIsOpen} type={"Service"} id={item?._id} name={item?.name} />
        </div>
    )
}