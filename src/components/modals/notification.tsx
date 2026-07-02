"use client";

import { useEffect, useMemo } from "react";
import { useAtom } from "jotai";

import { useFetchData } from "@/hooks/useFetchData";
import useMessage from "@/hooks/useMessage";

import { ModalLayout } from "../custom";
import { LoadingLayout } from "../shared";

import { userAtom } from "@/store/user";
import { URLS } from "@/helper/services/urls";
import { dateFormat } from "@/helper/utils/dateFormat";
import { INotification } from "@/helper/model/notification";

interface NotificationProps {
    isOpen: boolean;
    onClose: (by: boolean) => void;
    isRead: boolean;
    setIsRead: (by: boolean) => void;
}

export default function Notification({
    isOpen,
    onClose,
    isRead,
    setIsRead,
}: NotificationProps) {
    const [user] = useAtom(userAtom);

    const { updateNotificationStatus } = useMessage();

    const { data = [], isLoading } = useFetchData<INotification[]>({
        endpoint: URLS.NOTIFICATIONBYUSER(user?._id as string),
        name: ["notification", user?._id as string],
        enable: !!user?._id,
    });

    const unreadNotifications = useMemo(
        () => data.filter((item) => !item.isRead),
        [data]
    );

    const unreadIds = useMemo(
        () => unreadNotifications.map((item) => item._id),
        [unreadNotifications]
    );

    useEffect(() => {
        setIsRead(unreadNotifications.length === 0);
    }, [unreadNotifications, setIsRead]);

    useEffect(() => {
        if (
            !isOpen ||
            unreadIds.length === 0 ||
            updateNotificationStatus.isPending
        ) {
            return;
        }

        updateNotificationStatus.mutate({
            ids: unreadIds,
            userType: "user",
        });
    }, [isOpen, unreadIds, updateNotificationStatus]);

    return (
        <ModalLayout
            isOpen={isOpen}
            size="full"
            onClose={() => onClose(false)}
        >
            <div className="relative h-full w-full">
                <div className="sticky top-0 z-10 flex h-[80px] items-center border-b border-bordercolor bg-white px-4 lg:px-6">
                    <p className="text-2xl font-bold">Notification</p>
                </div>

                <div className="flex w-full flex-col items-center gap-4 py-10">
                    <LoadingLayout
                        loading={isLoading}
                        length={data.length}
                    >
                        {data.map((item) => (
                            <div
                                key={item._id}
                                className="relative flex h-fit w-full max-w-[740px] gap-4 rounded-2xl p-4 shadow lg:p-6"
                            >
                                <div className="flex flex-col">
                                    <p className="font-semibold lg:text-lg">
                                        {item.title}
                                    </p>

                                    <p className="-mt-1 text-sm text-[#444444]">
                                        {item.description}
                                    </p>

                                    <p className="mt-2 text-xs text-[#747474]">
                                        {dateFormat(item.createdAt)}
                                    </p>
                                </div>

                                {!item.isRead && (
                                    <div className="absolute top-4 right-4 h-2 w-2 rounded-full bg-brand" />
                                )}
                            </div>
                        ))}
                    </LoadingLayout>
                </div>
            </div>
        </ModalLayout>
    );
}