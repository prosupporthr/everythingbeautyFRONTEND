"use client"
import { CustomInput, CustomButton } from "@/components/custom"
import { Loader } from "@/components/shared"
import useAuth from "@/hooks/useAuth"
import { FormikProvider } from "formik"
import { useRouter } from "next/navigation"

export default function LoginPage() {

    const { formik, isLoading, isSuccess } = useAuth()
    const router = useRouter()

    return (
        <Loader loading={isLoading || isSuccess} > 
            <FormikProvider value={formik} >
                <form onSubmit={formik.handleSubmit} className=" w-full max-w-[435px] flex flex-col items-center gap-6 " >
                    <div className=" w-fit flex-col flex gap-0.5 " >
                        <p className=" text-2xl font-medium " >Welcome to Everything Beauty</p>
                        <p className=" text-secondary text-sm w-[300px] text-center ">Find top stylists. Book with ease. Create your account to get started.</p>
                    </div>
                    <CustomInput label="Email" name="email" type="email" placeholder="Email Address" />
                    <CustomButton isLoading={isLoading} type="submit" fullWidth height="56px" >Continue</CustomButton>
                    <p >Don't have an account? <span onClick={() => router.push("/auth/signup")} className=" font-semibold text-brand cursor-pointer " >Register</span></p>
                    {/* <p className=" text-secondary " >OR</p>
                <div className=" flex flex-col gap-4 w-full " >
                    <CustomButton fullWidth variant="outline" height="56px" >Continue with Google</CustomButton>
                    <CustomButton fullWidth variant="outline" height="56px" >Continue with Facebook</CustomButton>
                    <CustomButton fullWidth variant="outline" height="56px" >Continue with Apple</CustomButton>
                </div> */}
                </form>
            </FormikProvider>
        </Loader>
    )
}