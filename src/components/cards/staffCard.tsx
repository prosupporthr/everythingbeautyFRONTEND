import { ISelectStaff, IStaffDetail } from "@/helper/model/business";
import { Clock, Edit2, Star1, TickSquare } from "iconsax-reactjs";
import { useState } from "react";
import { ModalLayout } from "../shared";
import { StaffForm } from "../forms";
import { CustomImage } from "../custom";

export default function StaffCard({
    item,
    type,
    selectStaff,
    setSelectStaff,
    isBusiness
}: {
    item: IStaffDetail;
    type?: "user" | "admin";
    selectStaff?: ISelectStaff;
    setSelectStaff?: (by: ISelectStaff) => void;
    isBusiness?: boolean
}) {
    const [isOpen, setIsOpen] = useState(false);

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
                {(!type && isBusiness) && (
                    <button
                        onClick={() => setIsOpen(true)}
                        className=" absolute top-3 right-3 "
                    >
                        <Edit2 size={"20px"} />
                    </button>
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
                <div className=" w-21 h-21 rounded-2xl border-2 border-brand ">
                    <CustomImage src={item?.image} alt="staff" fillContainer />
                </div>
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
                {/* {type && (
                    <button
                        onClick={onclick}
                        className=" w-full flex justify-center items-center "
                    >
                        <p className=" text-sm font-bold text-brand ">
                            {type === "admin"
                                ? "Transfer"
                                : type === "user"
                                  ? "Select"
                                  : "View"}
                        </p>
                    </button>
                )} */}
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
        </div>
    );
}
