import UserHeader from "./userHeader";
import { MessageForm } from "../forms";
import MessageList from "./messageList";
import { URLS } from "@/helper/services/urls";
import { useFetchData } from "@/hooks/useFetchData";
import { IChatList, IChatMessage } from "@/helper/model/chat";
import { RiWechatLine } from "react-icons/ri";
import { LoadingLayout } from "../shared";
import { useEffect, useRef, useState } from "react";
import { uniqBy } from "lodash";
import { Socket } from "@/helper/utils/socket-io";
import { IPagination } from "@/helper/model/pagination";
import { Spinner } from "@heroui/react";
import { MessageCard } from "../cards";
import { useChatScroller } from "@/hooks/useChatScroller";

export default function ChatArea({ chat }: { chat: IChatList }) { 

    const {
        messages,
        isLoading,
        isRefetching,
        scrollRef,
        ref
      } = useChatScroller(chat?._id, 20); 
 

    return (
        <div className="w-full flex flex-1">
            {!chat?._id && <EmptyState />}

            {chat?._id && (
                <LoadingLayout loading={isLoading && messages.length === 0}>
                    <div className="h-full flex flex-1 flex-col relative">
                        <UserHeader selected={chat} />

                        {!messages.length ? (
                            <EmptyState />
                        ) : (
                            <div ref={scrollRef} className="w-full flex-1 flex flex-col-reverse gap-4 p-6 overflow-auto">
                                {/* <MessageList ref={top} chats={[...messages].sort(
                                    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                                )} /> */}

                                {[...messages].sort(
                                    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                                )?.map((item, index) => {

                                    if (index === messages?.length - 1) { 

                                        return (
                                            <div ref={ref} key={item?._id} >
                                                <MessageCard item={item} />
                                            </div>
                                        )
                                    } else {
                                        return (
                                            <MessageCard key={item?._id} item={item} />
                                        )
                                    }
                                })}
                                {isRefetching && (
                                    <div className=" w-full flex justify-center items-center " >
                                        <Spinner size="sm" />
                                    </div>
                                )}
                            </div>
                        )}

                        <MessageForm selected={chat} />
                    </div>
                </LoadingLayout>
            )}
        </div>
    );
}

const EmptyState = () => {
    return (
        <div className="w-full flex-1 flex flex-col gap-1 justify-center items-center">
            <div className="w-20 h-20 rounded-full shadow bg-white flex justify-center items-center">
                <RiWechatLine size="24px" />
            </div>
            <p className="text-xs">Select a chat from the left side to continue</p>
        </div>
    );
};
