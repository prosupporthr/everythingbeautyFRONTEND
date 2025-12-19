"use client"
import { IServiceDetail } from "@/helper/model/business";
import { Popover, PopoverTrigger, PopoverContent } from "@heroui/popover";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { IoIosMore, IoMdHeartEmpty } from "react-icons/io";
import { CustomImage } from "../custom";
import { DeleteModal } from "../modals";
import useBusiness from "@/hooks/useBusiness";
import { userAtom } from "@/store/user";
import { useAtom } from "jotai";
import { Spinner } from "@heroui/spinner";

export default function BusinessServiceCard(
    { item, option = true, setSelected, selected, bookmark }: { item: IServiceDetail, option?: boolean, setSelected?: (by: string) => void, selected?: string, bookmark?: boolean }
) {

    const [show, setShow] = useState(false)
    const router = useRouter()
    const param = useParams();
    const id = param.id as string;
    const [isOpen, setIsOpen] = useState(false)

    const [user] = useAtom(userAtom)
    const { bookmarkMutation } = useBusiness({})

    const handleEdit = (data: "edit" | "delete") => {
        setShow(false)
        if (data === "edit") {
            router.push(`/business/${id}/edit/${item?._id}/services`)
        } else {
            setIsOpen(true)
        }
    }

    const handleClick = () => {
        if (option) {
            // router.push(`/business/${id}/edit/${item?._id}/services`)
        } else if (setSelected) {
            setSelected(item?._id)
        }
    }

    return (
        <div onClick={handleClick} className={` cursor-pointer flex flex-col border ${option ? " w-full " : selected === item?._id ? " bg-brand text-white lg:w-full w-[200px] " : "  lg:w-full w-[200px] "} rounded-[10px] text-left `} >
            <div className={` w-full flex gap-3 ${option ? "border-b h-[102px] px-6 " : " p-3 "} items-center  `} >
                <div className=" w-[63px] h-[54px] rounded-lg bg-gray-200 " >
                    <CustomImage style={{ borderRadius: "8px" }} src={item?.pictures[0]} fillContainer alt={item?.name} />
                </div>
                <div className=" flex-col flex " >
                    <p className={` capitalize font-semibold `} >{item?.name}</p>
                    <p className=" text-sm " >${item?.hourlyRate}</p>
                </div>
                {bookmark && (
                    <button onClick={()=> bookmarkMutation.mutate({
                        userId: user?._id as string,
                        type: "service",
                        serviceId: item?._id
                    })} disabled={bookmarkMutation?.isPending} className=" w-8 h-8 rounded-full flex justify-center items-center border " >
                        {bookmarkMutation?.isPending ? (
                            <Spinner size="sm" />
                        ): (
                            <IoMdHeartEmpty size={"16px"} />
                        )}
                    </button>
                )}
            </div>
            {option && (
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
                                    <button onClick={() => handleEdit("edit")} className=" h-[40px] flex w-full justify-center items-center text-sm font-medium " >Edit</button>
                                </div>
                                <div className=" py-1 flex flex-col gap-2 " >
                                    <button onClick={() => handleEdit("delete")} className=" h-[40px] text-[#FF554A] flex w-full justify-center items-center text-sm font-medium " >Delete</button>
                                </div>
                            </div>
                        </PopoverContent>
                    </Popover>
                </div>
            )}
            <DeleteModal isOpen={isOpen} onClose={setIsOpen} type={"Service"} id={item?._id} name={item?.name} />
        </div>
    )
}