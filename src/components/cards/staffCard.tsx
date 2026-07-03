"use client";
import { ISelectStaff, IStaffDetail } from "@/helper/model/business";
import { Clock, Star1, TickSquare } from "iconsax-reactjs";
import { useEffect, useState } from "react";
import { ModalLayout } from "../shared";
import { StaffForm } from "../forms";
import { CustomImage } from "../custom";
import { Popover, PopoverContent, PopoverTrigger } from "@heroui/popover";
import { IoIosMore } from "react-icons/io";
import { DeleteModal } from "../modals";

export default function StaffCard({
    item,
    type,
    selectStaff,
    setSelectStaff,
    isBusiness,
    isRefetching,
}: {
    item: IStaffDetail;
    type?: "user" | "admin";
    selectStaff?: ISelectStaff;
    setSelectStaff?: (by: ISelectStaff) => void;
    isBusiness?: boolean;
    isRefetching?: boolean;
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [show, setShow] = useState(false);
    const [isShow, setIsShow] = useState(false);
    const [ currentImage, setCurrentImage ] = useState("")

    const handleClick = (item: IStaffDetail) => {
        console.log(item);

        if (item?.name === selectStaff?.label) {
            setSelectStaff?.({
                label: "",
                value: "",
            });
        } else {
            setSelectStaff?.({
                label: item?.name,
                value: item?._id + "",
            });
        }
    }; 

    return (
        <div className=" w-fit relative ">
            <div
                style={{ boxShadow: "0px 8px 30px 0px #7D23E41A" }}
                className=" w-[283px] flex flex-col gap-4 justify-center items-center rounded-2xl py-5 px-3 border border-[#CEC2D84D] "
            >
                {!type && isBusiness && (
                    <div className=" absolute top-3 right-3 ">
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
                                            onClick={() => setIsOpen(true)}
                                            className=" h-[40px] flex w-full justify-center items-center text-sm font-medium "
                                        >
                                            Edit
                                        </button>
                                    </div>
                                    <div className=" py-1 flex flex-col gap-2 ">
                                        <button
                                            onClick={() => setIsShow(true)}
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

                {type && (
                    <div className=" absolute top-3 right-3 ">
                        {selectStaff?.value !== item?._id ? (
                            <button
                                onClick={() => handleClick(item)}
                                className=" w-5 h-5 rounded-lg border border-gray-300 "
                            ></button>
                        ) : (
                            <button onClick={() => handleClick(item)}>
                                <TickSquare
                                    size={"20px"}
                                    variant="Bold"
                                    className=" text-brand "
                                />
                            </button>
                        )}
                    </div>
                )}
                {!isRefetching && (
                    <div className=" w-21 h-21 rounded-2xl border-2 border-brand ">
                        <CustomImage
                            src={item?.image}
                            alt="staff"
                            fillContainer
                        />
                    </div>
                )}
                <p className=" font-semibold capitalize text-2xl ">
                    {item?.name}
                </p>
                <div className=" flex flex-col gap-1 items-center ">
                    <div className=" flex items-center gap-0.5 ">
                        <Clock size={12} />
                        <p className=" text-xs ">Full Time</p>
                    </div>
                    <p className=" text-xs font-medium ">
                        {item?.primarySpeciality}
                    </p>
                </div>
                <div className=" w-full flex flex-wrap gap-2 items-center justify-center ">
                    {item?.skills?.map((subitem, index) => {
                        return (
                            <div
                                key={index}
                                className=" w-fit px-2 h-[25px] border-[0.66px] bg-[#9747FF1A] flex justify-center items-center rounded-full border-[#9747FF33] "
                            >
                                <p className=" text-[10px] font-semibold text-brand ">
                                    {subitem}
                                </p>
                            </div>
                        );
                    })}
                </div>
                <div className=" flex items-center gap-1 ">
                    <Star1 variant="Bold" color="#EFD414" />
                    <p className=" text-sm font-bold ">4.9</p>
                </div>
            </div>

            <ModalLayout
                size="3xl"
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
            >
                <StaffForm
                    id={item?._id + ""}
                    isOpen={isOpen}
                    setIsOpen={setIsOpen}
                />
            </ModalLayout>

            <DeleteModal
                isOpen={isShow}
                onClose={setIsShow}
                type={"Staff"}
                id={item?._id}
                name={item?.name}
            />
        </div>
    );
}
