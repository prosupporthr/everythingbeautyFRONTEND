"use client"
import { Spinner } from "@heroui/spinner";
import { ModalLayout } from "../shared";
import { HiMiniCheckBadge } from "react-icons/hi2";
import { CustomButton } from "../custom";
import { useRouter } from "next/navigation";
import { useAtom } from "jotai";
import { userAtom } from "@/store/user";

interface IProps {
    isOpen: boolean;
    isloading: boolean;
    setIsOpen?: (by: boolean) => void;
    isSuccess: boolean;
    isError: boolean;
    errorMessage?: string;
    type: string;
    linkID: string;
    isClosable?: boolean;
}

export default function SuccessModal({
    isOpen,
    isloading,
    setIsOpen,
    isSuccess,
    errorMessage,
    isError,
    type,
    linkID,
    isClosable,
}: IProps) {
    const router = useRouter();
    const [user] = useAtom(userAtom);

    const handleContinue = () => {
        if (isClosable) {
            setIsOpen?.(false);
            return;
        }

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
        } else if (type === "withdraw") {
            router.replace("/wallet/withdraw");
        }
    };

    return (
        <ModalLayout size="sm" isOpen={isOpen} onClose={handleContinue}>
            <div className="w-full flex flex-col items-center gap-4 pb-4 text-center">
                {isloading && (
                    <>
                        <Spinner size="lg" />
                        <p className="text-sm text-gray-500">
                            Verifying your payment…
                        </p>
                    </>
                )}

                {isSuccess && (
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
                                Your payment has been confirmed successfully.
                                You can now continue to view your order details.
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

                {isError && (
                    <div className=" flex flex-col gap-6 ">
                        <p className=" font-semibold text-red-600">
                            {errorMessage ??
                                "Payment verification failed. Please try again or contact support."}
                        </p>
                        <div className=" flex flex-col gap-2 w-full ">
                            <CustomButton
                                fullWidth
                                variant="customDanger"
                                onClick={() => setIsOpen?.(false)}
                            >
                                Close
                            </CustomButton>
                            <CustomButton
                                fullWidth
                                variant="outline"
                                onClick={() => router.push("/support")}
                            >
                                Contact Support
                            </CustomButton>
                        </div>
                    </div>
                )}
            </div>
        </ModalLayout>
    );
}
