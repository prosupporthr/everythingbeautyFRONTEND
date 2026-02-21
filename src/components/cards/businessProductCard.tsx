"use client"
import { IProductDetail } from "@/helper/model/business";
import { Popover, PopoverTrigger, PopoverContent } from "@heroui/popover";
import { useState } from "react";
import { IoIosMore } from "react-icons/io";
import { useParams, useRouter } from "next/navigation";
import { CustomImage } from "../custom";
import { DeleteModal } from "../modals";
import { formatNumber } from "@/helper/utils/numberFormat";

export default function BusinessProductCard(
    { item, isProfile = true }: { item: IProductDetail, isProfile?: boolean }
) {

    const [show, setShow] = useState(false)
    const router = useRouter()
    const param = useParams();
    const id = param.id as string;
    const [isOpen, setIsOpen] = useState(false)

    const handleClick = (data: "edit" | "delete") => {
        setShow(false)
        if (data === "edit") {
            router.push(`/business/${id}/edit/${item?._id}/product`)
        } else {
            setIsOpen(true)
        }
    }

    return (
        <div className=" w-full flex flex-col rounded-[10px] border " >
            <div className=" w-full h-[180px] relative rounded-lg rounded-bl-lg bg-gray-200 " >
                <CustomImage style={{ borderTopRightRadius: "10px", borderTopLeftRadius: "10px" }} src={item?.pictures[0]} fillContainer alt={item?.name} />
                {isProfile && (
                    <Popover showArrow isOpen={show} onOpenChange={setShow} backdrop={"opaque"} offset={10} placement="top">

                        <PopoverTrigger>
                            <button className=" w-8 h-8 absolute z-10 top-3 right-3 rounded-full flex justify-center items-center bg-[#FCFCFC] " >
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
                )}

            </div>
            <div className=" w-full flex flex-col gap-1 px-2 py-2 " >
                <div className=" w-full flex font-bold items-center justify-between " >
                    <p className=" capitalize " >{item?.name}</p>
                    <p>{formatNumber(item?.price)}</p>
                </div>
                <p className=" text-secondary text-sm " >{(Number(item?.quantity) > 0) ? formatNumber(Number(item?.quantity), "") : "Sold Out"} Remaining</p>
            </div>
            <DeleteModal isOpen={isOpen} onClose={setIsOpen} type={"Store"} id={item?._id} name={item?.name} />
        </div>
    )
}