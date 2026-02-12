"use client";

import { handleError } from "@/helper/services/errorHandler";
import httpService from "@/helper/services/httpService";
import { URLS } from "@/helper/services/urls";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface ITransaction {
    userId: string;
    amount: number;
    source: "stripe" | "wallet";
    type:
        | "wallet_top_up"
        | "booking"
        | "product"
        | "withdrawal"
        | "monthly_subscription";
    flow: "inbound" | "outbound";
    typeId: string;
    currency: "usd";
}

const useTransaction = () => {
    // const queryClient = useQueryClient()
    const [isOpen, setIsOpen] = useState(false);

    const router = useRouter();

    /** 🔹 Transaction */
    const verifyTransactionMutation = useMutation({
        mutationFn: (data: string) =>
            httpService.post(URLS.VERIFYTRANSACTION(data)),
        onError: handleError,
        onSuccess: (data) => {
            console.log(data);
        },
    });

    /** 🔹 Transaction */
    const connectAccount = useMutation({
        mutationFn: (data: string) =>
            httpService.post(URLS.CONNECTACCOUNT(data)),
        onError: handleError,
        onSuccess: (data) => {
            console.log(data);
        },
    });

    /** 🔹 Transaction */
    const addAccount = useMutation({
        mutationFn: (data: string) =>
            httpService.post(URLS.ADDACCOUNT(data), {
                refreshUrl: "https://example.com/reauth",
                returnUrl: "https://example.com/success",
            }),
        onError: handleError,
        onSuccess: (data) => {
            window.open(data?.data?.data?.url, "_blank", "noopener,noreferrer");
            console.log(data?.data?.data?.url);
        },
    });

    const isLoading =
        verifyTransactionMutation?.isPending ||
        connectAccount?.isPending ||
        addAccount?.isPending;

    return {
        verifyTransactionMutation,
        connectAccount,
        addAccount,
        isLoading,
        isOpen,
        setIsOpen,
    };
};

export default useTransaction;
