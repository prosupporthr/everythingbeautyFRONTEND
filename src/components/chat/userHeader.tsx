"use client"
import { IChatList } from "@/helper/model/chat";
import { Avatar } from "@heroui/react";
import { RiDeleteBin2Line, RiDeleteBinLine, RiMoreLine } from "react-icons/ri";
import moment from "moment"
import { Popover, PopoverContent, PopoverTrigger, } from "@heroui/popover";
import { CustomButton } from "../custom";
import { useState } from "react";
import { ModalLayout } from "../shared";
import useMessage from "@/hooks/useMessage";


export default function UserHeader(
    { selected }: { selected: IChatList }
) {

    const [show, setShow] = useState(false)
    const [isOpen, setIsOpen] = useState(false)

    const { deleteChatMutation, isLoading } = useMessage()

    const openHandler = () => {
        setShow(false)
        setIsOpen(true)
    }

    return (
        <div className=" w-full h-[72px] sticky top-0 flex justify-between px-6 border-b items-center bg-white " >
            <div className=" flex items-center gap-2 " >
                <div className=" w-10 h-10 rounded-full bg-gray-300 " >
                    <Avatar src={selected?.recipient?.profilePicture} name={selected?.recipient?.firstName} />
                </div>
                <div className=" flex-col flex " >
                    <p className=" text-xl font-medium capitalize " >
                        {selected?.recipient?.firstName + " " + selected?.recipient?.lastName}
                    </p>
                    <p className=" text-xs text-secondary " >
                        Last seen {moment(selected?.updatedAt + "").fromNow()}
                    </p>
                </div>
            </div>

            <Popover isOpen={show} onOpenChange={setShow} showArrow backdrop={"opaque"} offset={10} placement="bottom">
                <PopoverTrigger>
                    <button>
                        <RiMoreLine size={"24px"} />
                    </button>
                </PopoverTrigger>

                <PopoverContent className="w-[227px]">
                    <div className=" w-full flex flex-col gap-1 " >
                        <button onClick={openHandler} className=" py-4 font-medium " >Delete Chat</button>
                    </div>
                </PopoverContent>
            </Popover>

            <ModalLayout size="sm" isOpen={isOpen} onClose={() => setIsOpen(false)} >
                <div className=" w-full flex flex-col gap-4 items-center py-4 " >
                    <div className=" w-[80px] h-[80px] flex justify-center items-center text-red-600 rounded-full bg-red-200 " >
                        <RiDeleteBinLine size={"40px"} />
                    </div>
                    <div className=" flex flex-col text-center items-center " >
                        <p className=" text-2xl font-bold " >Delete Chat</p>
                        <p className=" text-sm leading-tight max-w-[80%] " >This will permanently delete the chat. Are you sure you want to continue?</p>
                    </div>
                    <div className=" w-full flex flex-col mt-3 gap-2 " >
                        <CustomButton isLoading={isLoading} onClick={()=> deleteChatMutation.mutate(selected?._id)} variant="customDanger" height="40px" >Delete Chat</CustomButton>
                        <CustomButton onClick={()=> setIsOpen(false)} variant="outline" height="40px" >Cancel</CustomButton>
                    </div>
                </div>
            </ModalLayout>
        </div>
    )
}