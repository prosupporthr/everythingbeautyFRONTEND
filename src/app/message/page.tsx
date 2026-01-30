"use client";
import { ChatArea, ChatSidebar } from "@/components/chat";
import { LoadingLayout } from "@/components/shared";
import { IChatList } from "@/helper/model/chat";
import { IUserDetail } from "@/helper/model/user";
import { URLS } from "@/helper/services/urls";
import { useFetchData } from "@/hooks/useFetchData";
import { userAtom } from "@/store/user";
import { useAtom } from "jotai";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

export default function MessagePage() {
    const [user] = useAtom(userAtom);

    const [search, setSearch] = useState("");
    const query = useSearchParams();
    const id = query?.get("id");

    const { data = [], isLoading } = useFetchData<IChatList[]>({
        endpoint: URLS.CHATLIST(user?._id as string),
        name: ["chatlist"],
        params: {
            search: search,
        },
    });

    const { data: userChat, isLoading: loading } = useFetchData<IChatList>({
        endpoint: URLS.CHATLISTBYID(id as string),
        name: ["chatlistbyid", id as string],
        enable: id ? true : false,
    });

    return (
        <div className=" w-full flex h-auto flex-1 overflow-hidden ">
            <ChatSidebar
                search={search}
                setSearch={setSearch}
                chat={data}
                loading={isLoading}
                selected={userChat as IChatList}
            />
            <ChatArea
                id={id as string}
                chat={userChat as IChatList}
                user={user as IUserDetail}
                loading={loading}
            />
        </div>
    );
}
