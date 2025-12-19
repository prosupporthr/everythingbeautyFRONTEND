import { IChatList } from "@/helper/model/chat";
import { Avatar } from "@heroui/react";
import { RiMoreLine } from "react-icons/ri";
import moment from "moment"


export default function UserHeader(
    { selected } : { selected: IChatList }
) {
    return(
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
            <button>
                <RiMoreLine size={"24px"} />
            </button>
        </div>
    )
}