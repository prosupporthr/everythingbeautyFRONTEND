"use client";
 
import { handleError } from "@/helper/services/errorHandler";
import httpService from "@/helper/services/httpService";
import { URLS } from "@/helper/services/urls"; 
import { useMutation } from "@tanstack/react-query"; 
import { useState } from "react";

interface ITransaction {
    userId: string;
    amount: number;
    source: "stripe" | "wallet";
    type: "wallet_top_up" | "booking" | "product" | "withdrawal" | "monthly_subscription";
    flow: "inbound" | "outbound";
    typeId: string;
    currency: "usd";
}

const useTransaction = () => {
    // const queryClient = useQueryClient()
    const [isOpen, setIsOpen] = useState(false);

    /** 🔹 Transaction */
    const verifyTransactionMutation = useMutation({
        mutationFn: (data: string) =>
            httpService.get(URLS.VERIFYTRANSACTION(data)),
        onError: handleError,
        onSuccess: (data) => {
            console.log(data);
        },
    });

    const isLoading = verifyTransactionMutation?.isPending;

    return {
        verifyTransactionMutation,
        isLoading,
        isOpen,
        setIsOpen,
    };
};

export default useTransaction;
