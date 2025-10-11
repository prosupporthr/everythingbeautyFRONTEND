"use client"
import { CustomButton, CustomInput, CustomPhoneInput, CustomSelect } from "@/components/custom"
import CustomDateTimePicker from "@/components/custom/customDatePicker"
import useAuth from "@/hooks/useAuth"
import { FormikProvider } from "formik"
import { useRouter, useSearchParams } from "next/navigation"
import { FaUser } from "react-icons/fa6";

export default function LoginPage() {

    const { formik } = useAuth()
    const router = useRouter()
    const query = useSearchParams();
    const tab = query?.get('tab') as string;

    const gender = [
        {
            label: "male",
            value: "male",
        },
        {
            label: "female",
            value: "female",
        },
    ]

    return (
        <FormikProvider value={formik} >
            <>
                {!tab && (
                    <div className=" w-full max-w-[435px] flex flex-col items-center gap-6 " >
                        <div className=" w-fit flex-col flex gap-0.5 " >
                            <p className=" text-2xl font-medium " >Finish signing up</p>
                        </div>
                        <div className=" w-full flex flex-col gap-3 " >
                            <CustomInput label="First name" name="email" placeholder="Enter your full Name" />
                            <CustomPhoneInput label="Enter your mobile number" name="email" placeholder="Mobile number" />
                            <div className=" flex gap-2 " >
                                <CustomDateTimePicker label="Date Of Birth" name="email" placeholder="fe" withTime={false} />
                                <CustomSelect label="Gender" placeholder="Select Gender" name="email" options={gender} />
                            </div>
                        </div>
                        <CustomButton onClick={() => router.push("/auth/signup?tab=photo")} fullWidth height="56px" >Continue</CustomButton>
                        <p >Already have an account? <span onClick={() => router.push("/auth")} className=" font-semibold text-brand cursor-pointer " >Log in</span></p>
                    </div>
                )}
                {tab && (
                    <div className=" w-full max-w-[502px] flex flex-col gap-6 items-center justify-center    " >
                        <div className=" w-[120px] h-[120px] flex rounded-full justify-center items-center border border-gray-50 bg-[#FAFAFA] " >
                            <FaUser size={"35px"} color="#444444" />
                        </div>
                        <p className=" text-2xl font-semibold " >Add a profile photo</p>
                        <div className=" w-full h-[180px] border border-dashed rounded-2xl flex justify-center items-center " >
                            <p className=" text-secondary " >Upload a picture</p>
                        </div>
                        <div className=" gap-4 flex w-full " >
                            <CustomButton onClick={() => router.push("/auth")} variant="outline" fullWidth height="56px" >Submit</CustomButton>
                            <CustomButton onClick={() => router.push("/auth")} fullWidth height="56px" >Submit</CustomButton>
                        </div>
                    </div>
                )}
            </>
        </FormikProvider>
    )
}