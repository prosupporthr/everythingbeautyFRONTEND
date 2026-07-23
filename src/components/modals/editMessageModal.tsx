"use client";
import { IChatMessage } from "@/helper/model/chat";
import { ModalLayout } from "../shared";
import { Input } from "@heroui/input";
import { useEffect, useState } from "react";
import useMessage from "@/hooks/useMessage";
import { useAtom } from "jotai";
import { userAtom } from "@/store/user";
import { CustomButton } from "../custom";

export default function EditMessageModal({
    isOpen,
    onClose,
    id,
    item,
}: {
    isOpen: boolean;
    onClose: (by: boolean) => void;
    id: string;
    item: IChatMessage;
}) {
    const { editMessageMutation } = useMessage();
    const [message, setMessage] = useState("");
    const [user] = useAtom(userAtom);

    useEffect(() => {
        setMessage(item?.message ?? "");
    }, [item]);

    const trimmedMessage = message.trim();
    const isUnchanged = trimmedMessage === (item?.message ?? "").trim();

    const onSubmit = () => {
        if (!trimmedMessage || isUnchanged) return;

        editMessageMutation.mutate(
            {
                payload: {
                    senderId: user?._id as string,
                    message: trimmedMessage,
                },
                id: id,
            },
            {
                onSuccess: () => {
                    onClose(false);
                },
            }
        );
    };

    return (
        <ModalLayout
            title="Edit Message"
            size="sm"
            isOpen={isOpen}
            onClose={() => onClose(false)}
        >
            <div className="flex flex-col gap-3">
                <Input
                    placeholder={""}
                    type={"text"}
                    classNames={{
                        inputWrapper:
                            "rounded-xl bg-[#FDFDFD] border border-[#EAEBEDCC] h-[45px]",
                        input: "text-gray-900 h-full w-full text-sm outline-none",
                    }}
                    value={message}
                    onValueChange={(value) => setMessage(value)}
                />
                <CustomButton
                    onClick={onSubmit}
                    isDisabled={!trimmedMessage || isUnchanged || editMessageMutation.isPending}
                    isLoading={editMessageMutation.isPending}
                >
                    Edit Message
                </CustomButton>
            </div>
        </ModalLayout>
    );
}