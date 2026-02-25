"use client";
import { CustomButton } from "../custom";
import useBooking from "@/hooks/useBooking";
import { IUserDetail } from "@/helper/model/user";
import { ModalLayout, StripePaymentForm } from ".";
import { useAtom } from "jotai";
import { userAtom } from "@/store/user";

interface IProps {
    type:
        | "wallet_top_up"
        | "booking"
        | "product"
        | "withdrawal"
        | "monthly_subscription";
    id: string;
    amount: number;
    user: IUserDetail;
    qty?: number;
    businessID?: string;
    ordered?: boolean;
    bookingDate?: string;
    title?: string;
    fullWidth?: true;
}

export default function PaymentBtn({
    type,
    id,
    amount, 
    qty,
    businessID,
    ordered,
    bookingDate,
    title,
    fullWidth,
}: IProps) {

    const [ user ] = useAtom(userAtom)

    const {
        orderMutation,
        isLoading,
        bookingMutation,
        intent,
        isOpen,
        setIsOpen,
        orderID,
        paymentID,
        transactionMutation,
    } = useBooking({
        type,
        amount,
        userID: user?._id as string,
    });

    const handleClick = () => {
        if (type === "product") {
            if (ordered) {
                transactionMutation.mutate({
                    userId: user?._id as string,
                    amount: amount ?? 0,
                    source: "stripe",
                    type: type,
                    flow: "inbound",
                    typeId: id,
                    currency: "usd",
                });
            } else {
                orderMutation.mutate({
                    userId: user?._id as string,
                    businessId: businessID as string,
                    productId: id,
                    quantity: qty as number,
                    totalPrice: amount ?? 0,
                    paymentStatus: "pending",
                    status: "PROCESSING",
                });
            }
        } else if (type === "booking") {
            if (ordered) {
                transactionMutation.mutate({
                    userId: user?._id as string,
                    amount: amount ?? 0,
                    source: "stripe",
                    type: type,
                    flow: "inbound",
                    typeId: id,
                    currency: "usd",
                });
            } else {
                bookingMutation.mutate({
                    userId: user?._id as string,
                    businessId: businessID as string,
                    serviceId: id,
                    totalPrice: amount ?? 0,
                    bookingDate: bookingDate as string,
                });
            }
        } else if (
            type === "wallet_top_up" ||
            type === "monthly_subscription"
        ) {
            transactionMutation.mutate({
                userId: user?._id as string,
                amount: amount ?? 0,
                source: "stripe",
                type: type,
                flow: "inbound",
                typeId: id,
                currency: "usd",
            });
        }
    };

    return (
        <div className={` w-full ${fullWidth ? "" : "lg:w-[300px]"} `}>
            <CustomButton fullWidth onClick={handleClick} isLoading={isLoading}>
                {title ?? "Pay"}
            </CustomButton>
            <ModalLayout isOpen={isOpen} onClose={() => setIsOpen(false)}>
                <StripePaymentForm
                    intent={intent}
                    id={paymentID}
                    linkID={ordered ? id : orderID}
                    amount={qty ? Number(amount * qty) : amount}
                    type={type}
                />
            </ModalLayout>
        </div>
    );
}
