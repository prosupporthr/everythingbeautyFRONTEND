"use client";

import { useAtom } from "jotai";
import { ModalLayout } from "../shared";
import { Warning2 } from "iconsax-reactjs";
import { userAtom } from "@/store/user"; 
import { useState } from "react";
import { CustomButton } from "../custom";
import useTransaction from "@/hooks/usetransaction";

export default function CancelSubscriptionBtn() {
    
    const [user] = useAtom(userAtom);
    const [isOpen, setIsOpen] = useState(false);

    const { isLoading, cancelSubscription } = useTransaction()

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className=" text-red-600 font-semibold mt-5 "
            >
                Cancel Subscription
            </button>
            <ModalLayout
                size="xs"
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
            >
                <div className="flex flex-col gap-4 w-full pb-4 ">
                    <div className="w-full flex flex-col gap-2 items-center">
                        <div className="w-20 h-20 rounded-full border-8 bg-red-300 border-red-100 flex justify-center items-center">
                            <Warning2 size={30} className="text-red-600" />
                        </div>

                        <p className="text-xl mt-3 text-center  font-bold">
                            Subscription Cancellation
                        </p>

                        <div className=" flex flex-col items-center ">
                            <p className="text-xs font-medium text-center text-secondary">
                                {`Are you sure you want to cancel your subscription? Cancelling will remove access to premium features at the end of your current billing period.`}
                            </p> 
                        </div>
                    </div>

                    <div className="flex flex-col gap-2 w-full">
                        <CustomButton isLoading={isLoading} onClick={()=> cancelSubscription.mutate(user?._id as string)} >Confirm</CustomButton>
                        <CustomButton variant="outline" onClick={()=> setIsOpen(false)} >Not Yet</CustomButton>
                    </div>
                </div>
            </ModalLayout>
        </>
    );
}
