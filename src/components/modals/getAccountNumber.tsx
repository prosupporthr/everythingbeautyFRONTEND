"use client";
import useTransaction from "@/hooks/usetransaction";
import { CustomButton } from "../custom";
import { LoadingLayout, ModalLayout } from "../shared";
import { useEffect } from "react";
import { useAtom } from "jotai";
import { userAtom } from "@/store/user";
import { useFetchData } from "@/hooks/useFetchData";
import { IBank } from "@/helper/model/business";

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

    const { data, isLoading } = useFetchData<IBank[]>({
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
        <ModalLayout
            size="sm"
            title="Bank Accounts"
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
        >
            <LoadingLayout loading={isLoading}>
                <div className=" w-full flex flex-col gap-6 pb-3 ">
                    <div className=" w-full flex max-h-[60vh] flex-col gap-3 ">
                        {data?.map((item) => {
                            return (
                                <button className=" flex w-full justify-between items-center border rounded-2xl p-4 ">
                                    <div className=" flex flex-col ">
                                        <p className=" font-semibold ">
                                            {item?.bankName}
                                        </p>
                                        <p className=" text-sm text-left text-secondary ">
                                            {item?.last4}
                                        </p>
                                    </div>
                                    {item?.isDefault && (
                                        <div className=" w-fit px-3 h-[35px] rounded-full flex items-center justify-center uppercases text-sm font-bold border ">
                                            Default
                                        </div>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                    <div className=" w-full flex flex-col gap-3 ">
                        <CustomButton
                            onClick={() =>
                                addAccount.mutate(user?._id as string)
                            }
                        >
                            Withdraw
                        </CustomButton>
                        <CustomButton
                            variant="outline"
                            onClick={() =>
                                addAccount.mutate(user?._id as string)
                            }
                        >
                            Add Account Number
                        </CustomButton>
                    </div>
                </div>
            </LoadingLayout>
        </ModalLayout>
    );
}
