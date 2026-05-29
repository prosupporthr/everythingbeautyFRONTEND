"use client";
import { LoadingLayout, ModalLayout } from "@/components/shared";
import { useFetchData } from "@/hooks/useFetchData";
import { ISelectStaff, IStaffDetail } from "../../helper/model/business";
import { URLS } from "../../helper/services/urls";
import { StaffCard } from "@/components/cards";
import { CustomButton } from "../custom";
import useBusiness from "@/hooks/useBusiness";

interface IProps {
    id: string;
    isOpen: boolean;
    onClose: (by: boolean) => void;
    selectStaff: ISelectStaff;
    setSelectStaff: (by: ISelectStaff) => void;
    type: "user" | "admin";
    currentId?: string
}

export default function SelectStaffModal({ id, isOpen, onClose, selectStaff, setSelectStaff, currentId }: IProps) {
    const { data: staff, isLoading } = useFetchData<IStaffDetail[]>({
        endpoint: URLS.STAFFBYBUSINESSID(id),
        name: ["staff", id],
    });

    const { changeStaffMutation } = useBusiness({})

    const handleClick = () => {
        if(currentId !== selectStaff?.value) {
            changeStaffMutation.mutate({
                newStaffId: selectStaff?.value
            }, {
                onSuccess: () => {
                    onClose(false)
                }
            })
        } else {
            onClose(false)
        }
    }

    return (
        <ModalLayout size="5xl" isOpen={isOpen} onClose={() => onClose(false)}>
            <div className=" w-full flex flex-col gap-6 overflow-hidden ">
                <div className=" w-full flex flex-col ">
                    <p className=" text-2xl font-semibold ">Staff Details</p>
                    <p className=" text-sm ">Please select stylist</p>
                </div>
                <LoadingLayout loading={isLoading} length={staff?.length}>
                    <div className=" w-full flex justify-center py-3 max-h-[70vh] overflow-y-auto " >  
                    <div className=" w-fit grid grid-cols-3 gap-3 ">
                        {staff?.map((item, index) => {
                            return <StaffCard setSelectStaff={setSelectStaff} selectStaff={selectStaff} type="user" item={item} key={index} />;
                        })} 
                    </div>
                    </div>
                </LoadingLayout>
                <div className=" w-full flex justify-end " >
                    <CustomButton isLoading={changeStaffMutation.isPending} height="45px" onClick={handleClick} >Confirm</CustomButton>
                </div>
            </div>
        </ModalLayout>
    );
}
