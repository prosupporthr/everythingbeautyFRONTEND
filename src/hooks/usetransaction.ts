"use client";

import { IWithdraw } from "@/helper/model/business";
import { handleError } from "@/helper/services/errorHandler";
import httpService from "@/helper/services/httpService";
import { URLS } from "@/helper/services/urls";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react"; 

const useTransaction = () => { 

    const [isOpen, setIsOpen] = useState(false);  

    const verifyTransactionMutation = useMutation({
        mutationFn: (data: string) =>
            httpService.get(URLS.VERIFYTRANSACTION(data)),
        onError: handleError,
        onSuccess: (data) => {
            console.log(data);
        },
    });

    const connectAccount = useMutation({
        mutationFn: (data: string) =>
            httpService.post(URLS.CONNECTACCOUNT(data)),
        onError: handleError,
        onSuccess: (data) => {
            console.log(data);
        },
    });

    const withdrawal = useMutation({
        mutationFn: (data: IWithdraw) =>
            httpService.post(URLS.WITHDRAW, data),
        onError: handleError,
        onSuccess: (data) => {
            setIsOpen(false)
            console.log(data);
            
        },
    });
    
    const cancelSubscription = useMutation({
        mutationFn: (data: string) =>
            httpService.post(URLS.CANCELLATION, {
                userId: data
            }),
        onError: handleError,
        onSuccess: (data) => {
            // setLink(data?.data?.data?.url)
            window.location.href = data?.data?.data?.url;
            // window.open(data?.data?.data?.url, "_blank", "noopener,noreferrer");
            // console.log(data?.data?.data?.url);
        },
    });

    const addAccount = useMutation({
        mutationFn: (data: string) =>
            httpService.post(URLS.ADDACCOUNT(data), {
                refreshUrl: "https://example.com/reauth",
                returnUrl: "https://everythingbeauty-frontend.vercel.app/payment-success?type=withdraw",
            }),
        onError: handleError,
        onSuccess: (data) => {
            // setLink(data?.data?.data?.url)
            window.location.href = data?.data?.data?.url;
            // window.open(data?.data?.data?.url, "_blank", "noopener,noreferrer");
            // console.log(data?.data?.data?.url);
        },
    });

    const isLoading =
        verifyTransactionMutation?.isPending ||
        connectAccount?.isPending ||
        addAccount?.isPending ||
        cancelSubscription.isPending

    return {
        verifyTransactionMutation,
        connectAccount,
        addAccount,
        isLoading,
        cancelSubscription,
        isOpen,
        setIsOpen,
        withdrawal
    };
};

export default useTransaction;
