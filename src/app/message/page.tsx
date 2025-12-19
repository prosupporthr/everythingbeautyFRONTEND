"use client"
import { ChatArea, ChatSidebar } from "@/components/chat";
import { LoadingLayout } from "@/components/shared";
import { IChatList } from "@/helper/model/chat";
import { URLS } from "@/helper/services/urls";
import { useFetchData } from "@/hooks/useFetchData";
import { userAtom } from "@/store/user";
import { useAtom } from "jotai";
import { useState } from "react";

export default function MessagePage() {

    const [user] = useAtom(userAtom)

    const [selected, setSelectedChat] = useState<IChatList>({} as IChatList)

    const { data = [], isLoading } = useFetchData<IChatList[]>({
        endpoint: URLS.CHATLIST(user?._id as string), name: ["chatlist"]
    })

    console.log(data);

    return (
        <LoadingLayout loading={isLoading} >
            <div className=" w-full flex h-auto flex-1 overflow-hidden " >
                <ChatSidebar chat={data} selected={selected} setSelected={setSelectedChat} />
                <ChatArea chat={selected} />
            </div>
        </LoadingLayout>
    )
}