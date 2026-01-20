"use client"
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

    const [user] = useAtom(userAtom)

    const query = useSearchParams();
    const id = query?.get('id');

    const [selected, setSelectedChat] = useState<IChatList>({} as IChatList)

    const { data = [], isLoading } = useFetchData<IChatList[]>({
        endpoint: URLS.CHATLIST(user?._id as string), name: ["chatlist"]
    }) 

    return (
        <LoadingLayout loading={isLoading} >
            <div className=" w-full flex h-auto flex-1 overflow-hidden " >
                <ChatSidebar chat={data} selected={selected} setSelected={setSelectedChat} />
                <ChatArea id={id as string} chat={selected} user={user as IUserDetail} />
            </div>
        </LoadingLayout>
    )
}