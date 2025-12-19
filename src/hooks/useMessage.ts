"use client"

import { ICreateChat, ISendChat } from "@/helper/model/chat"
import { handleError } from "@/helper/services/errorHandler"
import httpService from "@/helper/services/httpService"
import { URLS } from "@/helper/services/urls"
import { Socket } from "@/helper/utils/socket-io"
import { addToast } from "@heroui/react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useFormik } from "formik"
import { useRouter } from "next/navigation"
import { useState } from "react"


const useMessage = () => {

    const router = useRouter()
    const queryClient = useQueryClient()
    const [ loading, setIsLoading ] = useState(false)
    
    /** 🔹 Formik Instances */
    const formik = useFormik({
        initialValues: {
            "chatId": "",
            "senderId": "",
            "type": "text_only",
            "message": ""
        },
        // validationSchema: businessSchema,
        onSubmit: (data) => {

            setIsLoading(true)
            // sendChatMutation.mutate(data)


            Socket.emit("chat", {
                chatId: data.chatId,
                senderId: data.senderId,
                type: data.type,
                message: data.message,
            });

            formik?.setFieldValue("message", "")
            queryClient.invalidateQueries({ queryKey: ["chatlist"] }) 

            setIsLoading(false)

        },
    })

    /** 🔹 Business */
    const sendChatMutation = useMutation({
        mutationFn: (data: ISendChat) =>
            httpService.post(URLS.SENDCHAT, data),
        onError: handleError,
        onSuccess: (data) => {  

            const chat = data?.data?.data 

            Socket.emit("chat", {
                chatId: chat.chatId,
                senderId: chat.senderId,
                type: chat.type,
                message: chat.message,
            });

            formik?.setFieldValue("message", "")
            setIsLoading(false)
        },
    })

    /** 🔹 Business */
    const createChatMutation = useMutation({
        mutationFn: (data: ICreateChat) =>
            httpService.post(URLS.CREATECHAT, data),
        onError: handleError,
        onSuccess: (res) => {
            addToast({
                title: "Success",
                description: res?.data?.message,
                color: "success",
            })
            router.push(`/message`)
        },
    })

    const isLoading = createChatMutation?.isPending || sendChatMutation?.isPending || loading

    return {
        formik,
        createChatMutation,
        sendChatMutation,
        isLoading
    }
}

export default useMessage