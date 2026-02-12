"use client"
import useTransaction from "@/hooks/usetransaction";
import { CustomButton } from "../custom";
import { ModalLayout } from "../shared";
import { useEffect } from "react";
import { useAtom } from "jotai";
import { userAtom } from "@/store/user";
import { useFetchData } from "@/hooks/useFetchData";

export default function GetAccountNumber({
    isOpen,
    setIsOpen,
}: {
    isOpen: boolean;
    setIsOpen: (by: boolean) => void;
    amount?: number;
}) {

    const [user] = useAtom(userAtom);
    const { connectAccount, addAccount } = useTransaction();

    const { data, isLoading } = useFetchData<any>({
        endpoint: `/transactions/linked-accounts/${user?._id}`,
        name: ["account", user?._id as string],
        enable: user?._id ? true : false,
    });

    console.log(data);

    useEffect(() => {
        if (isOpen) {
            connectAccount.mutate(user?._id as string);
        }
    }, [isOpen]);

    return (
        <ModalLayout size="sm" title="Bank Accounts" isOpen={isOpen} onClose={() => setIsOpen(false)}>
            <div className=" w-full flex flex-col gap-6 pb-3 ">
                <div className=" w-full flex flex-col gap-3 ">
                    <div className=" flex w-full justify-between ">
                        <div className=" flex flex-col ">
                            <p className=" font-semibold text-lg ">John Doe</p>
                            <p className=" text-sm text-secondary ">
                                Union Bank
                            </p>
                        </div>
                        <p>1113421345</p>
                    </div>
                </div>
                <CustomButton onClick={()=> addAccount.mutate(user?._id as string)} >Add Account Number</CustomButton>
            </div>
        </ModalLayout>
    );
}
