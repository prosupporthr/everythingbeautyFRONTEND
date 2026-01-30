import { RiSearch2Line, RiCloseLine } from "react-icons/ri";
import { UserChatCard } from "../cards";
import { IChatList } from "@/helper/model/chat";
import { useRouter, useSearchParams } from "next/navigation";
import { CustomInput } from "../custom";
import { useState } from "react";
import { LoadingLayout } from "../shared";

export default function ChatSidebar({
    chat,
    selected,
    search,
    setSearch,
    loading,
}: {
    chat: IChatList[];
    selected: IChatList;
    search: string;
    setSearch: (by: string) => void;
    loading: boolean;
}) {
    const router = useRouter();
    const [show, setShow] = useState(false);
    const query = useSearchParams();
    const first = query?.get("first");
    const id = query?.get("id");

    const clickHandler = (item: IChatList) => {
        router.push(`/message?id=${item?._id}`);
    };

    return (
        <div
            className={` ${id ? " lg:flex hidden " : " flex "} w-full lg:w-fit h-full flex-col border-r relative overflow-y-auto `}
        >
            <div className=" w-full lg:w-[400px] flex flex-col">
                <div className=" w-full h-fit sticky top-0 ">
                    {!show && (
                        <div className=" w-full h-[72px] flex justify-between px-6 border-b items-center bg-white">
                            <p className=" text-xl font-medium ">Messages</p>
                            <div className=" flex gap-3 items-center ">
                                <button onClick={() => setShow(true)}>
                                    <RiSearch2Line size={"21px"} />
                                </button>
                            </div>
                        </div>
                    )}
                    {show && (
                        <div className=" w-full px-6 h-[72px] flex items-center gap-2 bg-white border-b ">
                            <CustomInput
                                startContent={<RiSearch2Line size={"20px"} />}
                                type="search"
                                name=""
                                notform
                                localValue={search}
                                setLocalValue={setSearch}
                            />
                            <button onClick={() => setShow(false)}>
                                <RiCloseLine size={"20px"} />
                            </button>
                        </div>
                    )}
                </div>

                <LoadingLayout loading={loading}>
                    <div className=" w-full flex-1 flex p-6 flex-col gap-2 ">
                        {selected && first && (
                            <UserChatCard item={selected} selected={selected} />
                        )}
                        {chat
                            ?.filter((item) =>
                                first ? item?._id !== selected?._id : item,
                            )
                            ?.map((item, index) => {
                                return (
                                    <button
                                        key={index}
                                        onClick={() => clickHandler(item)}
                                    >
                                        <UserChatCard
                                            item={item}
                                            selected={selected}
                                        />
                                    </button>
                                );
                            })}
                    </div>
                </LoadingLayout>
            </div>
        </div>
    );
}
