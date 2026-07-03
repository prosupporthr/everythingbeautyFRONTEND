"use client";
import { IServiceDetail } from "@/helper/model/business";
import { Popover, PopoverTrigger, PopoverContent } from "@heroui/popover";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { IoIosMore } from "react-icons/io";
import { ImageCarousel } from "../custom";
import { DeleteModal } from "../modals"; 
import { formatNumber } from "@/helper/utils/numberFormat";

export default function ServiceCard({
    item,
    option = true,
    setSelected,
    selected, 
}: {
    item: IServiceDetail;
    option?: boolean;
    setSelected?: (by: string) => void;
    selected?: string; 
}) {
    const [show, setShow] = useState(false);
    const router = useRouter();
    const param = useParams();
    const id = param.id as string;
    const [isOpen, setIsOpen] = useState(false);

    const handleEdit = (data: "edit" | "delete") => {
        setShow(false);
        if (data === "edit") {
            router.push(`/business/${id}/edit/${item?._id}/services`);
        } else {
            setIsOpen(true);
        }
    };

    const handleClick = () => {
        if (option) {
            // router.push(`/business/${id}/edit/${item?._id}/services`)
        } else if (setSelected) {
            setSelected(item?._id);
        }
    };

    return (
        <div
            onClick={handleClick}
            className={` cursor-pointer flex flex-col border ${option ? " w-full " : selected === item?._id ? " bg-brand text-white w-full " : "  w-full "} rounded-[10px] text-left h-full justify-center p-2 `}
        >
            <div className=" w-full h-[180px]  relative ">
                <ImageCarousel
                    images={item?.pictures}
                    className="w-full h-[180px]"
                />

                {option && (
                    <div className=" w-fit absolute top-2 right-2 flex justify-center items-center ">
                        <Popover
                            showArrow
                            isOpen={show}
                            onOpenChange={setShow}
                            backdrop={"opaque"}
                            offset={10}
                            placement="top"
                        >
                            <PopoverTrigger>
                                <button className=" w-8 h-8 rounded-full flex justify-center items-center bg-[#FCFCFC] ">
                                    <IoIosMore size={"20px"} />
                                </button>
                            </PopoverTrigger>

                            <PopoverContent className="w-[100px]">
                                <div className=" w-full flex flex-col gap-1 ">
                                    <div className=" py-1 border-b border-[#E7E7E7] flex flex-col gap-2 ">
                                        <button
                                            onClick={() => handleEdit("edit")}
                                            className=" h-[40px] flex w-full justify-center items-center text-sm font-medium "
                                        >
                                            Edit
                                        </button>
                                    </div>
                                    <div className=" py-1 flex flex-col gap-2 ">
                                        <button
                                            onClick={() => handleEdit("delete")}
                                            className=" h-[40px] text-[#FF554A] flex w-full justify-center items-center text-sm font-medium "
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </PopoverContent>
                        </Popover>
                    </div>
                )}
            </div>
            <div className=" w-full flex justify-between pt-2 pb-3 ">
                <div className=" w-full flex flex-col items-start ">
                    <div className=" flex items-center gap-2 justify-between w-full ">
                        <p className=" font-semibold capitalize ">
                            {item?.name}
                        </p>
                        <p className=" text-sm text-brand font-bold ">
                            {formatNumber(Number(item?.hourlyRate))}
                        </p>
                    </div>
                    <p className=" text-secondary text-sm line-clamp-2 ">
                        {item?.description}
                    </p>
                </div>
            </div>
            <DeleteModal
                isOpen={isOpen}
                onClose={setIsOpen}
                type={"Service"}
                id={item?._id}
                name={item?.name}
            />
        </div>
    );
}
