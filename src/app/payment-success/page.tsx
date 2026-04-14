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
import { SuccessModal } from "@/components/modals";

export default function PaymentSuccess() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [loading, setIsLoading] = useState(true);
    const isOpen = true

    const id = searchParams.get("id");
    const linkID = searchParams.get("linkID");
    const type = searchParams.get("type");

    const { verifyTransactionMutation } = useTransaction();

    useEffect(() => {
        if (!id) return;
        verifyTransactionMutation.mutate(id);
        setIsLoading(false);
    }, [id]);

    return (
        <div className="w-full h-[50vh]">
            <SuccessModal
                linkID={linkID as string}
                isloading={loading || verifyTransactionMutation.isPending}
                isError={verifyTransactionMutation.isError}
                isSuccess={verifyTransactionMutation.isSuccess}
                type={type as string} 
                isOpen={isOpen} 
             />
        </div>
    );
}
