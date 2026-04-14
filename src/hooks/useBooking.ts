"use client";
import { handleError } from "@/helper/services/errorHandler";
import httpService from "@/helper/services/httpService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { URLS } from "@/helper/services/urls";
import { IBooking, IOrder } from "@/helper/model/business";
import { useState } from "react";
import { useAtom } from "jotai";
import { paymentMethodAtom } from "@/store/paymentmethod";

interface IProps {
    type:
        | "wallet_top_up"
        | "booking"
        | "product"
        | "withdrawal"
        | "monthly_subscription";
    amount: number;
    userID: string;
}

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

const useBooking = ({ amount, type, userID }: IProps) => {
    // const queryClient = useQueryClient()

    const [paymentmethod] = useAtom(paymentMethodAtom);
    const [isOpen, setIsOpen] = useState(false);
    const [isShow, setIsShow] = useState(false);
    const [intent, setIntent] = useState("");
    const [orderID, setOrderID] = useState("");
    const [paymentID, setPaymentID] = useState(""); 

    const queryClient = useQueryClient()

    /** 🔹 Business */
    const bookingMutation = useMutation({
        mutationFn: (data: IBooking) => httpService.post(URLS.BOOKING, data),
        onError: handleError,
        onSuccess: (res) => { 

            setIsShow(true);
            transactionMutation.mutate({
                userId: userID,
                amount: amount,
                source: "stripe",
                type: type,
                flow: "outbound",
                typeId: res?.data?.data?._id,
                currency: "usd",
            });
            setOrderID(res?.data?.data?._id);
            // router.push(`/myorder/${res?.data?.data?._id}/service`);
        },
    });

    /** 🔹 Product */
    const orderMutation = useMutation({
        mutationFn: (data: IOrder) => httpService.post(URLS.ORDER, data),
        onError: handleError,
        onSuccess: (res) => { 
            setIsShow(true);

            transactionMutation.mutate({
                userId: userID,
                amount: amount,
                source: "stripe",
                type: type,
                flow: "outbound",
                typeId: res?.data?.data?._id,
                currency: "usd",
            });
            setOrderID(res?.data?.data?._id);

            // router.push(`/myorder/${res?.data?.data?._id}/product`);
            // router.push("/")
        },
    });

    /** 🔹 Transaction */
    const transactionMutation = useMutation({
        mutationFn: (data: ITransaction) =>
            httpService.post(URLS.TRANSACTION, data),
        onError: handleError,
        onSuccess: (data) => { 

            if (paymentmethod === "stripe") {
                setPaymentID(data?.data?.data?.paymentId);
                setIntent(data?.data?.data?.clientSecret);
                setIsOpen(true);
            } else {
                queryClient.invalidateQueries({ queryKey: ["order"] })
                queryClient.invalidateQueries({ queryKey: ["booking"] })
            }
        },
    });

    const isLoading =
        bookingMutation.isPending ||
        orderMutation.isPending ||
        transactionMutation.isPending;

    return {
        isLoading,
        bookingMutation,
        orderMutation,
        transactionMutation,
        isOpen,
        setIsOpen,
        isShow,
        setIsShow,
        intent,
        orderID,
        paymentID,
    };
};

export default useBooking;
