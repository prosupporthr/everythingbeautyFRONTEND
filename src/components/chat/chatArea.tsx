import UserHeader from "./userHeader";
import { MessageForm } from "../forms";
import { IChatList } from "@/helper/model/chat";
import { RiWechatLine } from "react-icons/ri";
import { LoadingLayout } from "../shared";
import { Spinner } from "@heroui/react";
import { MessageCard } from "../cards";
import { useChatScroller } from "@/hooks/useChatScroller";
import { IUserDetail } from "@/helper/model/user";
import { useEffect } from "react";

export default function ChatArea({ chat, id, user, loading }: { chat: IChatList, id: string, user: IUserDetail, loading: boolean }) {

    const {
        messages,
        isLoading,
        isRefetching,
        scrollRef,
        ref,
        setPage
    } = useChatScroller(chat?._id, 20);

    useEffect(() => {
        setPage(1)

        const el = scrollRef ? scrollRef.current : null;
        if (el) {
            el.scrollTo({
                top: el.scrollHeight,
                behavior: "smooth",
            });
        }
    }, [id])

    return (
        <div className={` ${id ? " flex " : " lg:flex hidden " } w-full h-full flex flex-1 `} >
            <LoadingLayout loading={isLoading || loading} >
                <div className="w-full h-full ">
                    {!id && <EmptyState />}

                    {id && (
                        <LoadingLayout loading={isLoading && messages.length === 0 || loading}>
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
                                        )?.map((item, index, arr) => {

                                            const currentDate = new Date(item.createdAt).toDateString();
                                            const nextDate =
                                                index < arr.length - 1
                                                    ? new Date(arr[index + 1].createdAt).toDateString()
                                                    : null;

                                            // show date ONLY on the last message of that day
                                            const showDate = index === arr.length - 1 || currentDate !== nextDate;

                                            if (index === messages?.length - 1) {
                                                return (
                                                    <div ref={ref} key={item?._id} >
                                                        <MessageCard showdate={showDate} self={item.sender?._id === user?._id} item={item} />
                                                    </div>
                                                )
                                            } else {
                                                return (
                                                    <MessageCard showdate={showDate} self={item.sender?._id === user?._id} key={item?._id} item={item} />
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
            </LoadingLayout>
        </div>
    );
}

const EmptyState = () => {
    return (
        <div className="w-full h-full flex-1 flex flex-col gap-1 justify-center items-center">
            <div className="w-20 h-20 rounded-full shadow bg-white flex justify-center items-center">
                <RiWechatLine size="24px" />
            </div>
            <p className="text-xs">Select a chat from the left side to continue</p>
        </div>
    );
};
