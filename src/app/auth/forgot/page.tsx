"use client"
import { CustomButton, CustomInput } from "@/components/custom"
import useAuth from "@/hooks/useAuth"
import { InputOtp } from "@heroui/react"
import { FormikProvider } from "formik"
import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"
import { BsArrowLeftCircle } from "react-icons/bs"

export default function LoginPage() {

    const { formik } = useAuth()
    const router = useRouter()
    const query = useSearchParams();
    const [value, setValue] = useState("");
    const tab = query?.get('tab') as string;

    return (
        <FormikProvider value={formik} >
            {!tab && (
                <div className=" w-full max-w-[435px] flex flex-col items-center gap-6 " >
                    <div className=" w-fit flex-col flex gap-0.5 " >
                        <div className=" flex gap-3 items-center " >
                            <button onClick={() => router.back()} >
                                <BsArrowLeftCircle size={"40px"} />
                            </button>
                            <p className=" text-2xl font-medium " >Enter Authentication Code</p>
                        </div>
                    </div>
                    <CustomInput label="Email/Username" name="email" placeholder="Email Address" />
                    <CustomButton onClick={() => router.push("/auth/forgot?tab=verify")} fullWidth height="56px" >Send Code</CustomButton>
                </div>
            )}
            {tab === "verify" && (
                <div className=" w-full max-w-[435px] flex flex-col items-center gap-6 " >
                    <div className=" w-fit flex-col flex gap-4 " >
                        <div className=" flex gap-3 items-center " >
                            <button onClick={() => router.back()} >
                                <BsArrowLeftCircle size={"40px"} />
                            </button>
                            <p className=" text-2xl font-medium " >Reset your password</p>
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
                    <p className=" text-sm text-secondary max-w-[381px] " >Please also check your spam or junk mail folder in case the verification code was filtered there.</p>
                    <CustomButton fullWidth height="56px" onClick={() => router.push("/auth/forgot?tab=password")} >verify</CustomButton>
                </div>
            )}

            {tab === "password" && (
                <div className=" w-full max-w-[435px] flex flex-col items-center gap-6 " >
                    <div className=" w-fit flex-col flex gap-0.5 " >
                        <div className=" flex gap-3 items-center " >
                            <button onClick={() => router.back()} >
                                <BsArrowLeftCircle size={"40px"} />
                            </button>
                            <p className=" text-2xl font-medium " >Set New Password</p>
                        </div>
                    </div>
                    <div className=" w-full flex flex-col gap-3 " >
                        <CustomInput label="Password" name="email" type="password" placeholder="Email Address" />
                        <CustomInput label="Confirm Password" name="email" type="password" placeholder="Email Address" />
                    </div>
                    <CustomButton onClick={() => router.push("/auth/forgot?tab=verify")} fullWidth height="56px" >Submit</CustomButton>
                </div>
            )}
        </FormikProvider>
    )
}