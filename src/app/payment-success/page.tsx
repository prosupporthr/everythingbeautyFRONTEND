"use client";

import { ModalLayout } from "@/components/shared";
import useTransaction from "@/hooks/usetransaction";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { HiMiniCheckBadge } from "react-icons/hi2";
import { Spinner } from "@heroui/react";
import { CustomButton } from "@/components/custom";
import { useAtom } from "jotai";
import { userAtom } from "@/store/user";

export default function PaymentSuccess() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [loading, setIsLoading] = useState(true);

    const id = searchParams.get("id");
    const linkID = searchParams.get("linkID");
    const type = searchParams.get("type");
    const [user] = useAtom(userAtom);

    const { verifyTransactionMutation } = useTransaction();

    const handleContinue = () => {
        if (!type) return;

        if (type === "product") {
            router.replace(`/myorder/${linkID}/product`);
        } else if (type === "booking") {
            router.replace(`/myorder/${linkID}/service`);
        } else if (type === "wallet_top_up") {
            router.replace(`/wallet`);
        } else if (type === "monthly_subscription") {
            router.replace(`/business/${user?.business?._id}/dashboard`);
        } else if (type === "firstpayment") {
            router.replace(`/business/create`);
        }
    };

    useEffect(() => {
        if (!id) return;
        verifyTransactionMutation.mutate(id);
        setIsLoading(false);
    }, [id]);

    return (
        <div className="w-full h-[50vh]">
            <ModalLayout size="sm" isOpen onClose={handleContinue}>
                <div className="w-full flex flex-col items-center gap-4 pb-4 text-center">
                    {(verifyTransactionMutation.isPending || loading) && (
                        <>
                            <Spinner size="lg" />
                            <p className="text-sm text-gray-500">
                                Verifying your payment…
                            </p>
                        </>
                    )}

                    {verifyTransactionMutation.isSuccess && (
                        <div className=" w-full flex flex-col gap-2 items-center ">
                            <HiMiniCheckBadge
                                size={140}
                                className="text-green-600"
                            />
                            <div className=" flex flex-col ">
                                <h2 className="text-xl font-semibold">
                                    {type === "wallet_top_up"
                                        ? "Funding successful"
                                        : "Payment successful"}
                                </h2>
                                <p className="text-sm text-gray-500 max-w-xs">
                                    Your payment has been confirmed
                                    successfully. You can now continue to view
                                    your order details.
                                </p>
                            </div>

                            <CustomButton
                                fullWidth
                                className="mt-4"
                                onClick={handleContinue}
                            >
                                Continue
                            </CustomButton>
                        </div>
                    )}

                    {verifyTransactionMutation.isError && (
                        <>
                            <p className="text-sm text-red-600">
                                Payment verification failed. Please contact
                                support.
                            </p>

                            <CustomButton
                                fullWidth
                                variant="outline"
                                onClick={() => router.push("/support")}
                            >
                                Contact Support
                            </CustomButton>
                        </>
                    )}
                </div>
            </ModalLayout>
        </div>
    );
}
