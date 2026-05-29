"use client";

import { ICreateChat, ISendChat } from "@/helper/model/chat";
import { handleError } from "@/helper/services/errorHandler";
import httpService from "@/helper/services/httpService";
import { URLS } from "@/helper/services/urls";
import { Socket } from "@/helper/utils/socket-io";
import { addToast } from "@heroui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import { useState } from "react";

const usePost = () => {
    const router = useRouter();
    const queryClient = useQueryClient();
    const [loading, setIsLoading] = useState(false);

    const handleLikePost = async (postId: string) => {
        const res = await Socket.emitWithAck("post:like", { postId });
        return res 
    }; 

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
            // postCommentMutation.mutate(data)

            Socket.emit("chat", {
                chatId: data.chatId,
                senderId: data.senderId,
                type: data.type,
                message: data.message,
            });

            formik?.setFieldValue("message", "");
            queryClient.invalidateQueries({ queryKey: ["chatlist"] });

            setIsLoading(false);
        },
    });

    /** 🔹 Business */
    const postCommentMutation = useMutation({
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
        postCommentMutation?.isPending ||
        loading ||
        deleteChatMutation?.isPending ||
        updateNotificationStatus?.isPending;

    return {
        formik,
        createChatMutation,
        postCommentMutation,
        isLoading,
        deleteChatMutation,
        updateNotificationStatus,
        handleLikePost
    };
};

export default usePost;
