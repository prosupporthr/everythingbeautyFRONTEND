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
import { IPostComment } from "@/helper/model/post";
import { uniqBy } from "lodash";
import { useAtom } from "jotai";
import { commentData as commentDataAtom, commentDeleted, replyData as replyDataAtom } from "@/store/comment";

const usePost = () => {
    const router = useRouter();
    const queryClient = useQueryClient();

    const [index, setIndex] = useState<string>("") 

    const [_, setOnDeleteComment] = useAtom(commentDeleted);
    const [commentId, setCommentId] = useState<string>("") 
    const [loading, setIsLoading] = useState(false);
    const [activeReply, setActiveReply] = useState("");
    const [, setCommentData] = useAtom(commentDataAtom);
    const [, setReplyData] = useAtom(replyDataAtom);
    const [currentComment, setCurrentComment] = useState({
        id: "",
        name: "",
        message: "",
    });

    const handleLikePost = async (postId: string) => {
        Socket.connect()
        const res = await Socket.emitWithAck("post:like", { postId });
        return res;
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

    /** 🔹 Formik Instances */
    const formikComment = useFormik<IPostComment>({
        initialValues: {
            body: "",
            isReply: false,
            commentId: "", 
        },
        // validationSchema: businessSchema,
        onSubmit: (data) => {  
            if(data?.commentId) {
                commentRelpyMutation.mutate(data)
                setIsLoading(false);
            } else {
                commentMutation.mutate(data)
                setIsLoading(false);
            }
        },
    });

    /** 🔹 Business */
    const commentMutation = useMutation({
        mutationFn: (data: IPostComment) =>
            httpService.post(URLS.POSTCOMMENTBYID(index), data),
        onError: handleError,
        onSuccess: (data) => { 
            console.log(data?.data?.data);
            setCommentData((prevComments) => uniqBy([data?.data?.data, ...prevComments], "_id"));
            formikComment?.resetForm(); 
            queryClient.invalidateQueries({ queryKey: ["comment"] });
            queryClient.invalidateQueries({ queryKey: ["reply"] }); 
        },
    });


    /** 🔹 Business */
    const commentRelpyMutation = useMutation({
        mutationFn: (data: IPostComment) =>
            httpService.post(URLS.POSTCOMMENTREPLYBYID(commentId), data),
        onError: handleError,
        onSuccess: (data) => { 
            setActiveReply(formikComment.values?.commentId)
            setCurrentComment({
                id: "",
                name: "",
                message: "",
            })
            setReplyData((prevReplies) => uniqBy([data?.data?.data, ...prevReplies], "_id"));
            formikComment?.resetForm(); 
            queryClient.invalidateQueries({ queryKey: ["comment"] });
            queryClient.invalidateQueries({ queryKey: ["reply"] }); 
        },
    });

    /** 🔹 Business */
    const likeCommentMutation = useMutation({
        mutationFn: (data: string) =>
            httpService.patch(URLS.POSTCOMMENTLIKEBYID(data)),
        onError: handleError,
        onSuccess: () => {  
            formikComment?.resetForm(); 
            queryClient.invalidateQueries({ queryKey: ["comment"] });
            queryClient.invalidateQueries({ queryKey: ["reply"] });
        },
    });

    /** 🔹 Business */
    const deleteCommentMutation = useMutation({
        mutationFn: (data: string) =>
            httpService.delete(URLS.POSTCOMMENTDELETEBYID(data)),
        onError: handleError,
        onSuccess: (data, variables) => {
            console.log(data);
            setOnDeleteComment((prevComments) => [...prevComments, variables]);
            queryClient.invalidateQueries({ queryKey: ["comment"] });
            queryClient.invalidateQueries({ queryKey: ["reply"] });
            formikComment?.resetForm();  
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
        commentMutation?.isPending ||
        commentRelpyMutation?.isPending ||
        loading ||
        deleteChatMutation?.isPending ||
        updateNotificationStatus?.isPending;

    return {
        formik,
        formikComment,
        createChatMutation,
        postCommentMutation,
        commentMutation,
        isLoading,
        deleteChatMutation,
        updateNotificationStatus,
        setCommentId,
        commentId,
        handleLikePost,
        setIndex,
        setCurrentComment,
        currentComment,
        activeReply,
        setActiveReply,
        deleteCommentMutation,
        likeCommentMutation
    };
};

export default usePost;
