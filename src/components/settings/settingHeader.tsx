"use client";

import { usePathname, useRouter } from "next/navigation";
import { BiChevronLeft } from "react-icons/bi";

export default function SettingHeader() {
    const pathname = usePathname();
    const router = useRouter()

    return (
        <div className=" w-full h-[77px] flex px-4 lg:px-6 gap-2 items-center border-b ">
            <button onClick={() => router.back()}>
                <BiChevronLeft size={"25px"} />
            </button>
            <p className=" text-xl lg:text-2xl font-semibold ">
                {pathname === "/settings"
                    ? "Settings"
                    : pathname.includes("security")
                      ? "Security"
                      : ""}
            </p>
        </div>
    );
}
