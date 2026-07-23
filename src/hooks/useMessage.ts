"use client";

import { ICreateChat, ISendChat } from "@/helper/model/chat";
import { handleError } from "@/helper/services/errorHandler";
import httpService from "@/helper/services/httpService";
import { URLS } from "@/helper/services/urls";
import { Socket } from "@/helper/utils/socket-io";
import { messageData, messageDeleted } from "@/store/comment";
import { addToast } from "@heroui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useFormik } from "formik";
import { useAtom } from "jotai";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useUploadMutation } from "./useUpload";

const useMessage = () => {
    const router = useRouter();
    const queryClient = useQueryClient();
    const [loading, setIsLoading] = useState(false);
    const [_, setDeleteMessage] = useAtom(messageDeleted);
    const [, setMessage] = useAtom(messageData);
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);


    const uploadMutation = useUploadMutation((res: Array<string>) => {

        console.log({
            chatId: formik?.values?.chatId,
            senderId: formik?.values?.senderId,
            type: formik?.values?.type,
            message: formik?.values?.message,
            flies: [...res]
        });
        

        Socket.emit("chat", {
            chatId: formik?.values?.chatId,
            senderId: formik?.values?.senderId,
            type: formik?.values?.type,
            message: formik?.values?.message,
            files: [...res]
        });
        formik?.setFieldValue("message", "");
        queryClient.invalidateQueries({ queryKey: ["chatlist"] });
        queryClient.invalidateQueries({ queryKey: ["chatuserbyid"] });

        setIsLoading(false);
    });

    /** 🔹 Formik Instances */
    const formik = useFormik({
        initialValues: {
            chatId: "",
            senderId: "",
            type: "text_only",
            message: "", 
        },
        // validationSchema: businessSchema,
        onSubmit: (data) => {
            setIsLoading(true);
            // sendChatMutation.mutate(data)
            // files
            if (imageFiles.length > 0) {
                const formdata = new FormData();
                imageFiles.forEach((file) => {
                    formdata.append("file", file);
                });
                uploadMutation.mutate(formdata);
            } else {
                Socket.emit("chat", {
                    chatId: data.chatId,
                    senderId: data.senderId,
                    type: data.type,
                    message: data.message,
                });
                formik?.setFieldValue("message", "");
                queryClient.invalidateQueries({ queryKey: ["chatlist"] });
                queryClient.invalidateQueries({ queryKey: ["chatuserbyid"] });
    
                setIsLoading(false);
            }

        },
    });

    /** 🔹 Business */
    const sendChatMutation = useMutation({
        mutationFn: (data: ISendChat) => httpService.post(URLS.SENDCHAT, data),
        onError: handleError,
        onSuccess: (data) => {
            const chat = data?.data?.data;

            Socket.emit("chat", {
                chatId: chat.chatId,
                senderId: chat.senderId,
                type: chat.type,
                message: chat.message,
            });

            formik?.setFieldValue("message", "");
            setIsLoading(false);
        },
    });


    /** 🔹 Business */
    const readMessages = useMutation({
        mutationFn: (data: {
            ids : string[]
        }) => httpService.post(URLS.MESSAGEMARKREAD, data),
        onError: handleError,
        onSuccess: () => { 
            queryClient.invalidateQueries({ queryKey: ["chatuserbyid"] });
        },
    });

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
            });

            router.push(`/message?id=${res?.data?.data?._id}&first=true`);
        },
    });

    /** 🔹 Business */
    const deleteMessageMutation = useMutation({
        mutationFn: (data: string) =>
            httpService.delete(URLS.MESSAGEBYID(data)),
        onError: handleError,
        onSuccess: (res, id) => {
            console.log(id);
            setDeleteMessage((prev) => [...prev, id]);

            addToast({
                title: "Success",
                description: res?.data?.message,
                color: "success",
            });
        },
    });

    /** 🔹 Business */
    const editMessageMutation = useMutation({
        mutationFn: (data: {
            payload: {
                senderId: string;
                message: string;
            };
            id: string
        }) => httpService.patch(URLS.MESSAGEBYID(data?.id), data.payload),
        onError: handleError,
        onSuccess: (res) => {
            setMessage((prev) => {
                const clone = [...prev];
                const chatIndex = clone.findIndex(
                    (chat) => chat._id === res?.data?.data?._id
                );

                if (chatIndex !== -1) {
                    clone[chatIndex] = res?.data?.data;
                }

                return clone;
            });

            queryClient.invalidateQueries({ queryKey: ["chat-messages"] });

            // addToast({
            //     title: "Success",
            //     description: res?.data?.message,
            //     color: "success",
            // });

            // router.push(`/message?id=${res?.data?.data?._id}&first=true`);
        },
    });

    /** 🔹 Business */
    const deleteChatMutation = useMutation({
        mutationFn: (data: string) => httpService.delete(URLS.CHATDELETE(data)),
        onError: handleError,
        onSuccess: (res) => {
            addToast({
                title: "Success",
                description: res?.data?.message,
                color: "success",
            });
            queryClient.invalidateQueries({ queryKey: ["chatlist"] });
            router.push(`/message`);
        },
    });

    /** 🔹 Business */
    const updateNotificationStatus = useMutation({
        mutationFn: (data: { ids: string[]; userType: "user" | "admin" }) =>
            httpService.post(URLS.NOTIFICATIONSTATUS, data),
        onError: handleError,
        onSuccess: (res) => {
            addToast({
                title: "Success",
                description: res?.data?.message,
                color: "success",
            });
            queryClient.invalidateQueries({ queryKey: ["notification"] });
        },
    });

    const isLoading =
        createChatMutation?.isPending ||
        sendChatMutation?.isPending ||
        loading ||
        deleteChatMutation?.isPending ||
        updateNotificationStatus?.isPending;

    return {
        formik,
        createChatMutation,
        sendChatMutation,
        isLoading,
        deleteChatMutation,
        updateNotificationStatus,
        editMessageMutation,
        deleteMessageMutation,
        readMessages,
        imageFiles,
        setImageFiles,
        previews,
        setPreviews
    };
};

export default useMessage;
