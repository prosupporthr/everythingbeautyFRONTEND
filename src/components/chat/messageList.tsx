import { forwardRef } from "react";
import { IChatMessage } from "@/helper/model/chat";
import { MessageCard } from "../cards";

const MessageList = forwardRef<HTMLDivElement, { chats: IChatMessage[] }>(
    ({ chats }, ref) => {
        
        return (
            <>
                {chats?.map((item, index) => { 

                    if (index === chats?.length-1) {
                        return (
                            <div className=" bg-red-400 " ref={ref} key={item?._id} >
                                <MessageCard  item={item} />
                            </div>
                        )
                    } else {
                        return (
                            <MessageCard key={item?._id} item={item} />
                        )
                    }
                })}
            </>
        );
    }
);

export default MessageList;
