"use client"
import { Popover, PopoverTrigger, PopoverContent } from "@heroui/popover";
import { CustomImage, CustomButton } from "../custom";
import { RxHamburgerMenu } from "react-icons/rx"; 
import { usePathname, useRouter } from "next/navigation";

export default function Navbar() {

    const pathname = usePathname()
    const router = useRouter()

    console.log(pathname);

    return (
        <div className={` w-full h-fit ${pathname === "/" ? " fixed " : " !sticky "} z-30 top-0 inset-x-0 `} >
            <div className={` w-full ${(pathname?.includes("auth") || pathname?.includes("business/create")) ? "hidden" : "flex"} h-[93px] bg-white shadow px-6 justify-between items-center `} >
                <CustomImage src={"/images/logo.png"} alt="logo" width={92} height={43} />
                <div className=" flex gap-3 items-center " >
                    <CustomButton variant="outlinebrand" className=" text-primary " >Join as Stylist</CustomButton>

                    <Popover showArrow backdrop={"opaque"} offset={10} placement="top">
                        <PopoverTrigger>
                            <button className=" bg-white h-[50px] px-5 rounded-full border border-[#E8E7ED] hover:bg-white text-primary " >
                                <div className=" flex items-center gap-3 " >
                                    <p>Menu</p>
                                    <RxHamburgerMenu size={"20px"} />
                                </div>
                            </button>
                        </PopoverTrigger>

                        <PopoverContent className="w-[227px]">
                            <div className=" w-full flex flex-col gap-1 " >
                                <div className=" py-3 border-b border-[#E7E7E7] flex flex-col gap-2 " >
                                    <CustomButton onClick={() => router.push("/auth/signup")} height="40px" >Sign up</CustomButton>
                                    <CustomButton onClick={() => router.push("/auth")} variant="outline" height="40px" >Log in</CustomButton>
                                </div>
                                <div className=" py-1 border-b border-[#E7E7E7] flex flex-col gap-2 " >
                                    <button className=" h-[40px] flex w-full justify-center items-center text-sm font-medium " >FAQs</button>
                                </div>
                                <div className=" py-1 border-b border-[#E7E7E7] flex flex-col gap-2 " >
                                    <button className=" h-[40px] flex w-full justify-center items-center text-sm font-medium " >Join as a stylist</button>
                                </div>
                                <div className=" py-1 border-b border-[#E7E7E7] flex flex-col gap-2 " >
                                    <button className=" h-[40px] flex w-full justify-center items-center text-sm font-medium " >Market Place</button>
                                </div>
                                <div className=" py-1 flex flex-col gap-2 " >
                                    <button className=" h-[40px] flex w-full justify-center items-center text-sm font-medium " >Help and Support</button>
                                </div>
                            </div>

                            {/* <div className=" w-full flex flex-col gap-1 " >
                            <div className=" py-2 border-b border-[#E7E7E7] flex flex-col gap-2 " >
                                <button className=" h-[40px] flex w-full justify-center items-center text-xl font-bold " >Shield Archibong</button>
                            </div>
                            <div className=" py-1 border-b border-[#E7E7E7] flex flex-col gap-2 px-6 " >
                                {menulist.map((item, index) => {
                                    return (
                                        <button key={index} className=" h-[40px] flex w-full gap-2 items-center text-sm font-medium " >
                                            <div className=" w-5 h-5 bg-amber-300 rounded-md " >

                                            </div>
                                            {item?.title}
                                        </button>
                                    )
                                })} 
                                <button className=" h-[40px] flex w-full gap-2 items-center text-sm font-medium " > 
                                    FAQs
                                </button>
                            </div>
                            <div className=" py-1 border-b border-[#E7E7E7] flex flex-col gap-2 " >
                                <button className=" h-[40px] flex w-full justify-center items-center text-sm font-medium " >Join as a stylist</button>
                            </div>
                            <div className=" py-1 flex flex-col gap-2 " >
                                <button className=" h-[40px] flex w-full justify-center items-center text-sm font-medium " >Help and Support</button>
                            </div>
                        </div> */}
                        </PopoverContent>
                    </Popover>
                </div>
            </div>
        </div>
    )
}