import { IUser } from "@/helper/model/auth";
import { IUserDetail } from "@/helper/model/user";
import { Avatar } from "@heroui/react";
import { useRouter } from "next/navigation";


export default function UserCard({ item, showDetail }: { item: IUserDetail, showDetail?: boolean }) {

    const router = useRouter()

    return (
        <button className=" flex gap-2 items-center " >
            <Avatar src={item?.profilePicture} name={item?.firstName} />
            {showDetail && ( 
                <div className=" flex flex-col items-start " >
                    <div className=" flex items-center gap-1 " >
                        <p className=" text-sm font-semibold capitalize " >{item?.firstName + " " + item?.lastName}</p>
                    </div>
                    <p className=" text-violet-300 text-xs " >{item?.email}</p>
                </div>
            )}
        </button>
    )
}