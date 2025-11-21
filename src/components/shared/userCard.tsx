"use client"
import { IUserDetail } from "@/helper/model/user";
import { dateFormat } from "@/helper/utils/dateFormat";
import { Avatar } from "@heroui/react"; 


export default function UserCard({ item, showDetail, size }: { item: IUserDetail, showDetail?: boolean, size?: "sm" | "md" | "lg" }) { 

    return (
        <button className=" flex gap-2 items-center " >
            <Avatar size={size ?? "md"} src={item?.profilePicture} name={item?.firstName} />
            {showDetail && ( 
                <div className=" flex flex-col items-start " >
                    <div className=" flex items-center gap-1 " >
                        <p className=" text-sm font-semibold capitalize " >{item?.firstName + " " + item?.lastName}</p>
                    </div>
                    <p className=" text-secondary text-xs " >Joined {dateFormat(item?.createdAt)}</p>
                </div>
            )}
        </button>
    )
}