"use client";

import { useRouter } from "next/navigation";
import { BiChevronLeft } from "react-icons/bi";

export default function SettingHeader() {
    
    const router = useRouter()

    return (
        <div className=" w-full h-[77px] flex px-6 gap-2 items-center border-b ">
            <button onClick={()=> router.back()} >
                <BiChevronLeft size={"25px"} />
            </button>
            <p className=" text-2xl font-semibold ">
                {"Wallet"}
            </p>
        </div>
    );
}
