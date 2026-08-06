"use client"

import { usePathname } from "next/navigation";

export default function ScreenData ({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>){
    
    const pathname = usePathname()

    return(
        <div className={` ${pathname.includes("post") ? " lg:overflow-hidden " :pathname.includes("message") ? " overflow-hidden " : " "} flex flex-col relative flex-1  `} >
          {children}
        </div>
    )
}