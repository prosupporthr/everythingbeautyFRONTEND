"use client"
import { Popover, PopoverTrigger, PopoverContent } from "@heroui/popover";
import { CustomImage, CustomButton } from "../custom";
import { RxHamburgerMenu } from "react-icons/rx";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { menulist } from "@/helper/services/databank";
import { textLimit } from "@/helper/utils/textlimit";
import { IoChevronDown } from "react-icons/io5";
import UserCard from "../shared/userCard";
import Cookies from "js-cookie";
import { useUserStore } from "@/hooks/user";
import { userAtom } from "@/store/user";

export default function Navbar() {

    const router = useRouter()
    const pathname = usePathname()
    const param = useParams();
    const id = param.id;
    const [show, setShow] = useState(false)

    const { data, isLoading } = useUserStore();
    const [_, setUser] = useAtom(userAtom)

    useEffect(()=> {
        if(data?._id) {
            setUser(data)
        }
    }, [data])

    const handleClick = (item: "dashboard" | "logout") => {
        if (item === "dashboard") {
            router.push(data?._id ? `/business/${data?.business?._id}/dashboard` : "/business")
        } else if (item === "logout") {
            // Cookies.set("accesstoken", "")
            // Cookies.set("userid", "")
            localStorage.clear()
            router.push("/auth")
        }
        setShow(false)
    }

    const HandleRouter = (item: string) => {
        router.push(item)
        setShow(false)
    }

    return (
        <div className={` w-full h-fit ${pathname === "/" ? " fixed " : " !sticky "} z-30 top-0 inset-x-0 `} >
            <div className={` w-full ${(pathname?.includes("auth") || pathname?.includes(`business/${id}/create`) || pathname?.includes(`business/${id}/edit`)) ? "hidden" : "flex"} h-[93px] bg-white shadow px-6 justify-between items-center `} >
                <button onClick={() => router.push("/")} >
                    <CustomImage nopopup src={"/images/logo.png"} alt="logo" width={92} height={43} />
                </button>
                {!isLoading && (

                    <div className=" flex gap-3 items-center " >
                        {!data?.business?._id && (
                            <CustomButton onClick={() => router.push("/business")} variant="outlinebrand" className=" text-primary " >Join as Stylist</CustomButton>
                        )}

                        <Popover isOpen={show} onOpenChange={setShow} showArrow backdrop={"opaque"} offset={10} placement="top">
                            <PopoverTrigger>
                                <div className={` z-50 bg-white h-[50px] ${data?.firstName ? " px-3 " : " px-5 "} rounded-full flex items-center justify-center border border-[#E8E7ED] hover:bg-white text-primary cursor-pointer `} >
                                    {data?.firstName && (
                                        <div className=" flex items-center gap-3 " >
                                            <UserCard item={data} />
                                            <IoChevronDown size={"17px"} />
                                        </div>
                                    )}
                                    {!data?.firstName && (
                                        <div className=" flex items-center gap-3 " >
                                            <p>Menu</p>
                                            <RxHamburgerMenu size={"20px"} />
                                        </div>
                                    )}
                                </div>
                            </PopoverTrigger>

                            <PopoverContent className="w-[227px]">
                                {!data?.firstName && (
                                    <div className=" w-full flex flex-col gap-1 " >
                                        <div className=" py-3 border-b border-[#E7E7E7] flex flex-col gap-2 " >
                                            <CustomButton onClick={() => HandleRouter("/auth/signup")} height="40px" >Sign up</CustomButton>
                                            <CustomButton onClick={() => HandleRouter("/auth")} variant="outline" height="40px" >Log in</CustomButton>
                                        </div>
                                        <div className=" py-1 border-b border-[#E7E7E7] flex flex-col gap-2 " >
                                            <button className=" h-[40px] flex w-full justify-center items-center text-sm font-medium " >FAQs</button>
                                        </div>
                                        <div className=" py-1 border-b border-[#E7E7E7] flex flex-col gap-2 " >
                                            <button onClick={() => HandleRouter("/business")} className=" h-[40px] flex w-full justify-center items-center text-sm font-medium " >Join as a stylist</button>
                                        </div>
                                        <div className=" py-1 border-b border-[#E7E7E7] flex flex-col gap-2 " >
                                            <button className=" h-[40px] flex w-full justify-center items-center text-sm font-medium " >Market Place</button>
                                        </div>
                                        <div className=" py-1 flex flex-col gap-2 " >
                                            <button className=" h-[40px] flex w-full justify-center items-center text-sm font-medium " >Help and Support</button>
                                        </div>
                                    </div>
                                )}

                                {data?.firstName && (
                                    <div className=" w-full flex flex-col gap-1 " >
                                        <div className=" py-2 border-b border-[#E7E7E7] flex flex-col gap-2 " >
                                            <button className=" h-[40px] flex w-full justify-center items-center text-xl font-bold capitalize " >{textLimit(data?.firstName + " " + data?.lastName, 20)}</button>
                                        </div>
                                        <div className=" py-1 border-b border-[#E7E7E7] flex flex-col gap-2 px-6 " >
                                            {menulist.map((item, index) => {
                                                if (item?.title === "Logout") {
                                                    return (
                                                        <button onClick={() => handleClick("logout")} key={index} className=" h-[40px] flex w-full gap-2 items-center text-sm font-medium " >
                                                            <div className=" w-5 h-5  rounded-md " >
                                                                <item.icon size={"20px"} />
                                                            </div>
                                                            {item?.title}
                                                        </button>
                                                    )
                                                } else {
                                                    return (
                                                        <button onClick={()=> HandleRouter(item?.link)} key={index} className=" h-[40px] flex w-full gap-2 items-center text-sm font-medium " >
                                                            <div className=" w-5 h-5  rounded-md " >
                                                                <item.icon size={"20px"} />
                                                            </div>
                                                            {item?.title}
                                                        </button>
                                                    )
                                                }
                                            })}
                                            <button className=" h-[40px] flex w-full gap-2 items-center text-sm font-medium " >
                                                FAQs
                                            </button>
                                        </div>
                                        {data?.business?._id && (
                                            <div className=" py-1 border-b border-[#E7E7E7] flex flex-col gap-2 " >
                                                <button onClick={() => handleClick("dashboard")} className=" h-[40px] flex w-full justify-center items-center text-sm font-medium " >{data?._id ? "Dashboard" : "Join as a stylist"}</button>
                                            </div>
                                        )}
                                        <div className=" py-1 flex flex-col gap-2 " >
                                            <button className=" h-[40px] flex w-full justify-center items-center text-sm font-medium " >Help and Support</button>
                                        </div>
                                    </div>
                                )}

                            </PopoverContent>
                        </Popover>
                    </div>
                )}
            </div>
        </div>
    )
}