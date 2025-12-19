"use client"
import { CustomButton } from "@/components/custom"
import { AccountVerified } from "@/components/modals";
import useAuth from "@/hooks/useAuth"   
import {InputOtp} from "@heroui/input-otp"; 
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { BsArrowLeftCircle } from "react-icons/bs";



export default function VerificationPage() {

    const { verifyMutation, isOpen, setIsOpen, isSuccess, isLoading } = useAuth()
    const [value, setValue] = useState("");
    const router = useRouter()

    const query = useSearchParams();
    const email = query?.get('email');

    const clickHandler = () => {
        verifyMutation.mutate({
            code: value
        })
    }

    return (
        <>
            <div className=" w-full max-w-[435px] flex flex-col items-center gap-6 " >
                <div className=" w-fit flex-col flex gap-4 " >
                    <div className=" flex gap-3 items-center " >
                        <button onClick={() => router.back()} >
                            <BsArrowLeftCircle size={"40px"} />
                        </button>
                        <p className=" text-2xl font-medium " >Enter Authentication Code</p>
                    </div>
                    <p className=" text-secondary text-sm w-[300px] text-center ">Enter the 6_digit code we sent to the Email Address {email}</p>
                </div> 
                {/* OTP Input */}
                <InputOtp
                    length={6}
                    value={value}
                    size="lg" 
                    allowedKeys="^[a-zA-Z0-9]*$" // restricts to letters
                    onValueChange={setValue}
                /> 
                <p className=" text-sm text-secondary " >Waiting to resend OTP in  <span className=" font-medium text-primary cursor-pointer " >59 Secs</span></p>
                <CustomButton isDisabled={value.length >= 6 ? false : true} fullWidth height="56px" onClick={clickHandler} >Continue</CustomButton>
            </div>
            <AccountVerified isOpen={isLoading || isSuccess || isOpen} setIsOpen={setIsOpen} />
        </>
    )
}