"use client";
import useTransaction from "@/hooks/usetransaction";
import { CustomButton } from "../custom";
import { LoadingLayout, ModalLayout } from "../shared";
import { useEffect, useState } from "react";
import { useAtom } from "jotai";
import { userAtom } from "@/store/user";
import { useFetchData } from "@/hooks/useFetchData";
import { IBank } from "@/helper/model/business";
import { IoCheckboxOutline } from "react-icons/io5";

export default function GetAccountNumber({
    isOpen,
    setIsOpen,
    amount,
}: {
    isOpen: boolean;
    setIsOpen: (by: boolean) => void;
    amount: number;
    setAmount: (by: string) => void;
}) {
    const [user] = useAtom(userAtom);
    const { connectAccount, addAccount, withdrawal } = useTransaction();
    const [ selected, setSelected ] = useState("")

    const { data = [], isLoading } = useFetchData<IBank[]>({
        endpoint: `/transactions/linked-accounts/${user?._id}`,
        name: ["account", user?._id as string],
        enable: user?._id ? true : false,
    });

    useEffect(() => {
        if (isOpen) {
            connectAccount.mutate(user?._id as string);
        }
    }, [isOpen]);


    useEffect(() => {
        if(data?.length === 1) {
            setSelected(data[0].id)
        }
    }, [ data, isLoading ])

    return (
        <>
            <ModalLayout
                size={"sm"}
                title={"Bank Accounts"}
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
            >
                <div className=" w-full flex flex-col gap-6 pb-3 ">
                    <LoadingLayout loading={isLoading} length={data?.length}>
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
                                        {selected === item?.id && (
                                            <IoCheckboxOutline size={"25px"} className=" text-brand " />
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </LoadingLayout>
                    <div className=" w-full flex flex-col gap-3 ">
                        <CustomButton
                            isLoading={withdrawal.isPending}
                            isDisabled={!selected}
                            onClick={() =>
                                withdrawal.mutate({
                                    userId: user?._id as string,
                                    amount: amount,
                                    bankAccountId: selected as string,
                                    currency: "usd",
                                })
                            }
                        >
                            Withdraw
                        </CustomButton>
                        <CustomButton
                            isLoading={addAccount.isPending}
                            variant="outline"
                            onClick={() =>
                                addAccount.mutate(user?._id as string)
                            }
                        >
                            Add Account Number
                        </CustomButton>
                    </div>
                </div>
            </ModalLayout>
        </>
    );
}
