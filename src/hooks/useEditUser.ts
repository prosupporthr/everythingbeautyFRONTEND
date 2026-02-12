"use client"
import { handleError } from "@/helper/services/errorHandler"
import httpService from "@/helper/services/httpService"
import { addToast } from "@heroui/toast"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useFormik } from "formik" 
import { useUploadMutation } from "./useUpload"
import { URLS } from "@/helper/services/urls"
import { useState } from "react"
import { IAddress, IUser } from "@/helper/model/auth" 
import { profileSchema } from "@/helper/services/validation"


const useEditUser = () => {

    const [open, setOpen] = useState(false) 
    const userId =  typeof window !== "undefined"
      ? localStorage.getItem("userid") as string
      : ""; 


    const [imageFile, setImageFile] = useState<File | string | null>("");
    const queryClient = useQueryClient()

    const userMutation = useMutation({
        mutationFn: (data: IUser) =>
            httpService.patch(URLS.USERUPDATE(userId), data),
        onError: handleError,
        onSuccess: (res) => {
            addToast({
                title: "Success",
                description: res?.data?.message,
                color: "success",
            }) 
            queryClient.invalidateQueries({ queryKey: ["user"] })
        },
    })

    const addressMutation = useMutation({
        mutationFn: (data: IAddress) =>
            httpService.post(URLS.ADDRESS, data),
        onError: handleError,
        onSuccess: (res) => {
            addToast({
                title: "Success",
                description: res?.data?.message,
                color: "success",
            })
            setOpen(false)
            queryClient.invalidateQueries({ queryKey: ["address"] })
        },
    })

    const editAddressMutation = useMutation({
        mutationFn: (data: {
            id: string,
            payload: IAddress
        }) =>
            httpService.patch(URLS.ADDRESSBYID(data?.id), data.payload),
        onError: handleError,
        onSuccess: (res) => {
            addToast({
                title: "Success",
                description: res?.data?.message,
                color: "success",
            })
            setOpen(false)
            queryClient.invalidateQueries({ queryKey: ["address"] })
        },
    })

    const deleteAddressMutation = useMutation({
        mutationFn: (data: string) =>
            httpService.delete(URLS.ADDRESSBYID(data)),
        onError: handleError,
        onSuccess: (res) => {
            addToast({
                title: "Success",
                description: res?.data?.message,
                color: "success",
            })
            setOpen(false)
            queryClient.invalidateQueries({ queryKey: ["address"] })
        },
    })

    const uploadMutation = useUploadMutation((res) => {

        const payload = { ...formik.values, profilePicture: res + "" }

        userMutation.mutate(payload)
    })

    /** 🔹 Formik Instances */
    const formik = useFormik({
        initialValues: {
            "firstName": "",
            "lastName": "",
            "phoneNumber": "",
            "dateOfBirth": "",
            "gender": "", 
            "about": "",
            "homeAddress": "",
            "state": "",
            "officeAddress": "",
            "country": ""
        },
        validationSchema: profileSchema,
        onSubmit: (data) => {
            if (imageFile) {
                const formdata = new FormData()
                formdata.append("file", imageFile)
                uploadMutation.mutate(formdata)
            } else {
                userMutation.mutate(data)
            }
        },
    })

    const isLoading = uploadMutation.isPending || userMutation.isPending || addressMutation?.isPending || editAddressMutation?.isPending || deleteAddressMutation.isPending

    return {
        formik,
        isLoading, 
        setImageFile,
        addressMutation,
        editAddressMutation,
        deleteAddressMutation,
        imageFile,
        open, 
        setOpen
    }
}

export default useEditUser