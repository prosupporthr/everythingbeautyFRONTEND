"use client";
import { CustomButton } from "../custom";
import useBooking from "@/hooks/useBooking";
import { IUserDetail } from "@/helper/model/user";
import { ModalLayout, StripePaymentForm } from ".";
import { useAtom } from "jotai";
import { userAtom } from "@/store/user";
import { paymentMethodAtom } from "@/store/paymentmethod";
import { useEffect } from "react";
import { SuccessModal } from "../modals";
import { IAddressDetail } from "@/helper/model/auth"; 
import { addToast } from "@heroui/toast"

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
    isClosable?: boolean;
    address?: IAddressDetail;
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
    isClosable,
    address,
}: IProps) {
    const [user] = useAtom(userAtom);
    const [paymentmethod, setPaymentMethod] = useAtom(paymentMethodAtom);

    const {
        orderMutation,
        isLoading,
        bookingMutation,
        intent,
        isOpen,
        setIsOpen,
        isShow,
        setIsShow,
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
                    source: paymentmethod,
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
                    addressId: address?._id+"",
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
                    source: paymentmethod,
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

    const checkMethod = () => {
         if (paymentmethod === "stripe") {
            setIsShow(false);
        } else {
            setIsShow(true);
        }

        if (!address?._id && type === "product") {
            addToast({
                title: "Warning",
                description: "Select an address for shipment",
                color: "warning",
            });
            console.log("no address");

        } else {
            console.log("address");
            handleClick();
        }
    };

    useEffect(() => {
        setPaymentMethod("stripe");
    }, []);

    console.log(address);

    return (
        <div className={` w-full ${fullWidth ? "" : "lg:w-[300px]"} `}>
            <CustomButton fullWidth onClick={checkMethod} isLoading={isLoading}>
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

            <SuccessModal
                linkID={ordered ? id : orderID}
                isloading={transactionMutation.isPending}
                isError={transactionMutation.isError}
                isSuccess={transactionMutation.isSuccess}
                type={type as string}
                isOpen={isShow}
                setIsOpen={setIsShow}
                isClosable={isClosable}
            />
        </div>
    );
}
