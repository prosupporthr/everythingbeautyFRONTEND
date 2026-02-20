"use client"

import { useFormik } from "formik"
import { addToast } from "@heroui/toast"
import { unsecureHttpService } from "@/helper/services/httpService"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { ILogin, IAuth } from "@/helper/model/auth"
import { emailSchema } from "@/helper/services/validation"
import { handleError } from "@/helper/services/errorHandler"
import { URLS } from "@/helper/services/urls"
import { useEffect, useState } from "react" 

const useAuth = () => {

    const [isOpen, setIsOpen] = useState(false);
    const queryClient = useQueryClient()
    const [initialTime, setInitialTime] = useState(0);
    const [startTimer, setStartTimer] = useState(false);  

    useEffect(() => {
        if (initialTime > 0) {
            setTimeout(() => {
                setInitialTime(initialTime - 1);
            }, 1000);
        }

        if (initialTime === 0 && startTimer) {
            console.log("done");
            setStartTimer(false);
        }
    }, [initialTime, startTimer]); 

    const router = useRouter()
    /** 🔹 Login */
    const loginMutation = useMutation({
        mutationFn: (data: ILogin) =>
            unsecureHttpService.post(URLS.LOGIN, data),
        onError: handleError,
        onSuccess: (res) => {
            addToast({
                title: "Success",
                description: res?.data?.message,
                color: "success",
            })
            router.push(`/auth/verification?email=${formik.values.email}`)
        },
    })

    /** 🔹 Signup */
    const signupMutation = useMutation({
        mutationFn: (data: IAuth) =>
            unsecureHttpService.post(URLS.SIGNUP, data),
        onError: handleError,
        onSuccess: (res) => {
            addToast({
                title: "Success",
                description: res?.data?.message,
                color: "success",
            })
            router.push(`/auth/verification?email=${formikSignup.values.email}`)
        },
    })

    /** 🔹 Verify OTP */
    const verifyMutation = useMutation({
        mutationFn: (data: { code: string }) =>
            unsecureHttpService.post(URLS.VERIFY, data),
        onError: handleError,
        onSuccess: (res) => {
            const { token, user } = res.data.data

            localStorage.setItem("accesstoken", token)
            localStorage.setItem("userid", user?._id)

            addToast({
                title: "Success",
                description: res?.data?.message,
                color: "success",
            })
            if (user?.firstName) {
                setIsOpen(true)
                queryClient.invalidateQueries({ queryKey: ["user"] })
                router.push(`/?id=${user?._id}`)
            } else {
                router.push("/auth/onboarding")
            }
        },
    })

    /** 🔹 Verify OTP */
    const resendOTPMutation = useMutation({
        mutationFn: (data: { email: string }) =>
            unsecureHttpService.post(URLS.RESENDOTP, data),
        onError: handleError,
        onSuccess: (res) => { 
            addToast({
                title: "Success",
                description: res?.data?.message,
                color: "success",
            }) 
            setStartTimer(true)
            setInitialTime(59)
        },
    })

    /** 🔹 Formik Instances */
    const formik = useFormik<ILogin>({
        initialValues: { email: "" },
        validationSchema: emailSchema,
        onSubmit: (data) => loginMutation.mutate(data),
    })

    const formikSignup = useFormik<IAuth>({
        initialValues: { email: "" },
        validationSchema: emailSchema,
        onSubmit: (data) => signupMutation.mutate(data),
    })

    /** 🔹 Loading State */
    const isLoading =
        loginMutation.isPending ||
        signupMutation.isPending ||
        verifyMutation.isPending  

    /** 🔹 Loading State */
    const isSuccess =
        loginMutation.isSuccess ||
        signupMutation.isSuccess ||
        verifyMutation.isSuccess  

    return {
        formik,
        formikSignup,
        isLoading,
        isSuccess,
        verifyMutation,
        isOpen,
        setIsOpen,
        initialTime,
        resendOTPMutation
    }
}

export default useAuth
