import React from "react"
import { RiCheckboxCircleFill, RiCheckboxCircleLine } from "react-icons/ri"

interface IProps {
    children: React.ReactNode,
    status?: string,
}

export default function CustomMarker(
    { children, status }: IProps
) {
    return (
        <div className=" flex items-center gap-2 text-xs font-medium " >
            <div className=" w-fit " >
                {!status && (
                    <RiCheckboxCircleLine className=" text-neonblue-500 " size={"16px"} />
                )}
                {status === "done" && (
                    <RiCheckboxCircleFill className=" text-success-600 " size={"16px"} />
                )}
            </div>
            {children}
        </div>
    )
}