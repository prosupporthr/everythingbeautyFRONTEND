"use client"

import { usePathname } from "next/navigation";

export default function ScreenData ({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>){
    
    const pathname = usePathname()

    return(
        <div className={` ${pathname.includes("message") ? " overflow-hidden " : " "} w-full flex flex-col flex-1  `} >
          {children}
        </div>
    )
}