import { RiSearch2Line, RiFilter2Line } from "react-icons/ri";
import { UserChatCard } from "../cards";
import { IChatList } from "@/helper/model/chat";

export default function ChatSidebar({ chat, selected, setSelected }: { chat: IChatList[], selected: IChatList, setSelected: (by: IChatList) => void }) {
    return (
        <div className=" w-fit h-full flex flex-col border-r relative overflow-y-auto " >
            <div className=" w-[400px] flex flex-col" >
                <div className=" w-full h-fit  sticky top-0 " >
                    <div className=" w-full h-[72px] flex justify-between px-6 border-b items-center bg-white" >
                        <p className=" text-xl font-medium " >Messages</p>
                        <div className=" flex gap-3 items-center " >
                            <button>
                                <RiSearch2Line size={"21px"} />
                            </button>
                            <button>
                                <RiFilter2Line size={"21px"} />
                            </button>
                        </div>
                    </div>
                </div>
                <div className=" w-full flex-1 flex p-6 flex-col gap-2 " >
                    {chat?.map((item, index) => {
                        return (
                            <button key={index} onClick={() => setSelected(item)} >
                                <UserChatCard item={item} selected={selected} />
                            </button>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}