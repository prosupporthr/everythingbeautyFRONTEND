"use client";
import { CustomButton, CustomInput } from "@/components/custom";
import { GetAccountNumber } from "@/components/modals"; 
import { useState } from "react";

export default function WithdrawPage() {
    const [value, setValue] = useState("");
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className=" w-full flex flex-col gap-4 ">
            <CustomInput
                type="number"
                label="Enter Amount"
                name=""
                notform
                localValue={value}
                setLocalValue={setValue}
            />
            <CustomButton
                onClick={() => setIsOpen(true)}
                isDisabled={!value || Number(value) === 0 ? true : false}
            >
                Withdraw
            </CustomButton>
            <GetAccountNumber isOpen={isOpen} setIsOpen={setIsOpen} amount={Number(value)} />
        </div>
    );
}
