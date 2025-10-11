"use client"
import { CustomButton } from "@/components/custom"
import useAuth from "@/hooks/useAuth"  
import { AccountVerified } from "@/modals";
import {InputOtp} from "@heroui/input-otp";
import { FormikProvider } from "formik"
import { useRouter } from "next/navigation";
import { useState } from "react";
import { BsArrowLeftCircle } from "react-icons/bs";



export default function VerificationPage() {

    const { formik } = useAuth()
    const [value, setValue] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter()

    return (
        <FormikProvider value={formik} >
            <div className=" w-full max-w-[435px] flex flex-col items-center gap-6 " >
                <div className=" w-fit flex-col flex gap-4 " >
                    <div className=" flex gap-3 items-center " >
                        <button onClick={() => router.back()} >
                            <BsArrowLeftCircle size={"40px"} />
                        </button>
                        <p className=" text-2xl font-medium " >Enter Authentication Code</p>
                    </div>
                    <p className=" text-secondary text-sm w-[300px] text-center ">Enter the 6_digit code we sent to the Email Address otue***gmail.com</p>
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
                <CustomButton fullWidth height="56px" onClick={()=> setIsOpen(true)} >Continue</CustomButton>
            </div>
            <AccountVerified isOpen={isOpen} setIsOpen={setIsOpen} />
        </FormikProvider>
    )
}