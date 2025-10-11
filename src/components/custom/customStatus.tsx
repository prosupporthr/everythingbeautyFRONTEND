import React from "react" 

interface IProps { 
    status: string,
}

export default function CustomMarker(
    { status }: IProps
) {
    return (
        <div className={` ${(status === "Ongoing" || status === "Submitted") ? " bg-blue-50 text-neonblue-600 " : status === "Pending" ? " bg-[#F5F5F5] text-[#686184] text " : " bg-success-50 text-success-800 "} px-2 w-fit rounded-full py-[3px] text-xs font-medium `} >
            {status}
        </div>
    )
}