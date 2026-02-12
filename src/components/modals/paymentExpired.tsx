"use client"

import { useAtom } from "jotai";
import { ModalLayout, PaymentBtn } from "../shared"; 
import { Warning2 } from "iconsax-reactjs";
import { userAtom } from "@/store/user";
import { IUserDetail } from "@/helper/model/user";
import { useEffect, useState } from "react";

export default function PaymentExpired() { 

    const [ user ] = useAtom(userAtom)
    const [ isOpen, setIsOpen ] = useState(false)
    console.log(user?.plan);

    useEffect(()=>{
        if(user?.plan === "free") {
            setIsOpen(true)
        }
    } , [user?.plan])
    

    return (
        <ModalLayout size="xs" isOpen={isOpen} onClose={() => setIsOpen(false)}>
            <div className="flex flex-col gap-4 w-full pb-4 ">
                <div className="w-full flex flex-col gap-2 items-center">
                    <div className="w-20 h-20 rounded-full border-8 bg-yellow-300 border-yellow-100 flex justify-center items-center">
                        <Warning2 size={30} className="text-yellow-600" />
                    </div>

                    <p className="text-2xl mt-3 font-bold">Subscription Expired</p>

                    <p className="text-xs font-medium text-center text-secondary">
                        {`Your store's subscription has ended. Renew now to keep enjoying all features and avoid any service interruption.`}
                    </p>
                </div>

                <div className="flex flex-col gap-2 w-full"> 
                    <PaymentBtn title="Make Payment" fullWidth type={"monthly_subscription"} id={user?._id as string} amount={99} user={user as IUserDetail} />
                </div>
            </div>
        </ModalLayout>
    );
}
