"use client"
import { useParams, usePathname } from "next/navigation"

export default function Footer() {

    const pathname = usePathname()
    const param = useParams();
    const id = param.id; 

    return (
        <div className={` w-full bg-[#FCFAFF] ${(pathname?.includes("auth") || pathname?.includes("sale") || pathname?.includes(`business/${id}/create`) || pathname?.includes(`business/${id}/edit`) || pathname?.includes(`business/${id}/dashboard`) ||  pathname?.includes(`message`)) ? "hidden" : "flex"} justify-center pt-[100px] pb-10 px-8 `} >
            <div className=" max-w-[1276px] w-full flex flex-col gap-6 " >
                <div className=" w-full flex lg:flex-row flex-col gap-6 justify-between " >
                    <div className=" flex flex-col gap-1 max-w-[308px] " >
                        <p className=" text-xl font-bold text-brand " >Everything Beauty</p>
                        <p className=" text-sm text-secondary " >Bringing the military community together to share homes, rooms, and spaces. </p>
                    </div>
                    <div className=" flex lg:flex-row flex-col gap-6 lg:gap-0" >
                        <div className=" w-[134px] flex flex-col gap-4 " >
                            <p className=" text-xl font-bold text-brand " >Links</p>
                            <p className=" text-sm " >Home</p>
                            <p className=" text-sm " >Add my Place</p>
                            <p className=" text-sm " >Favorites</p>
                            <p className=" text-sm " >About</p>
                        </div>
                        <div className=" w-[180px] flex flex-col gap-4 " >
                            <p className=" text-xl font-bold text-brand " >Help</p>
                            <p className=" text-sm " >Terms & Conditions</p>
                            <p className=" text-sm " >Privacy policy</p>
                            <p className=" text-sm " >{`FAQ's`}</p>
                        </div>
                    </div>
                </div>
                <div className=" w-full border-t border-[#EAEBEDCC] h-[40px] flex justify-center items-end " >
                    <p className=" text-sm " >© 2025 Manemap.llc All Rights Reserved</p>
                </div>
            </div>
        </div>
    )
}