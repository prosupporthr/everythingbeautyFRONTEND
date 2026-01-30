"use client"
import { CustomButton } from "../custom"; 
import useBooking from "@/hooks/useBooking";
import { IUserDetail } from "@/helper/model/user";
import { ModalLayout, StripePaymentForm } from ".";

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
    bookingDate?: string;
    title?: string
}

export default function PaymentBtn({
    type,
    id,
    amount,
    user, 
    qty,
    businessID,
    bookingDate,
    title
}: IProps) {
    const { orderMutation, isLoading, bookingMutation, intent, isOpen, setIsOpen, orderID, paymentID, transactionMutation } = useBooking({
        type,
        amount,
        userID: user?._id as string,
    });

    const handleClick = () => {
        if(type === "product") {
            orderMutation.mutate({
                userId: user?._id as string,
                businessId: businessID as string,
                productId: id,
                quantity: qty as number,
                totalPrice: amount ?? 0,
                paymentStatus: "pending",
                status: "PROCESSING",
            });
        } else if(type === "booking"){
            bookingMutation.mutate({
                userId: user?._id as string,
                businessId: businessID as string,
                serviceId: id, 
                totalPrice: amount ?? 0,
                bookingDate: bookingDate as string
            });
        } else if (type === "wallet_top_up") {
            transactionMutation.mutate({
                userId: user?._id,
                amount: amount ?? 0,
                source: "stripe",
                type: "wallet_top_up",
                flow: "inbound",
                typeId: id,
                currency: "usd"
            })
        }
    }; 

    return (
        <div className=" w-full lg:w-[300px] ">
            <CustomButton
                fullWidth
                onClick={handleClick}
                isLoading={isLoading}
            >
                {title ?? "Pay"}
            </CustomButton>
            <ModalLayout isOpen={isOpen} onClose={()=> setIsOpen(false)} >
                <StripePaymentForm intent={intent} id={paymentID} linkID={orderID} amount={qty ? Number(amount * qty) : amount} type={type} />
            </ModalLayout>
        </div>
    );
}
