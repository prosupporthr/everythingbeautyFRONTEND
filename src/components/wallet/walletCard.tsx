"use client";
import { IWallet } from "@/helper/model/user";
import { URLS } from "@/helper/services/urls";
import { walletList } from "@/helper/utils/databank";
import { useFetchData } from "@/hooks/useFetchData";
import { userAtom } from "@/store/user";
import { useAtom } from "jotai";
import { usePathname, useRouter } from "next/navigation";
import { IoEye, IoEyeOff } from "react-icons/io5";
import { LoadingLayout } from "../shared";
import { useEffect, useState } from "react";
import { formatNumber } from "@/helper/utils/numberFormat";
import { walletAtom } from "@/store/wallet";

export default function WalletCard({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const pathname = usePathname();
    const [show, setShow] = useState(false);

    const [user] = useAtom(userAtom);
    const [_, setAmount] = useAtom(walletAtom);

    const { data, isLoading } = useFetchData<IWallet>({
        endpoint: URLS.WALLETBYUSERID(user?._id as string),
        name: ["wallet", user?._id as string],
    }); 

    useEffect(()=> {
        if(data?._id) {
            setAmount(data?._id)
        }
    }, [data?._id])

    return (
        <LoadingLayout loading={isLoading}>
            <div className=" w-full flex flex-col gap-6 ">
                <div>
                    <p className=" text-sm text-secondary ">Hello</p>
                    <p className=" text-xl font-semibold capitalize ">
                        {user?._id
                            ? user?.firstName + " " + user?.lastName
                            : ""}
                    </p>
                </div>
                <div className=" w-full flex justify-center ">
                    <div className=" w-full lg:w-fit flex flex-col gap-8 ">
                        <div
                            style={{ boxShadow: "0px 8px 25px 8px #00000005" }}
                            className=" bg-[#DFE3FF] w-full lg:w-[435px] flex flex-col gap-2 rounded-2xl "
                        >
                            <div className=" rounded-2xl rounded-tr-[3px] rounded-bl-[3px] w-fit px-3 lg:px-4 bg-[#EFF1FB] h-[28px] flex justify-center items-center ">
                                <p className=" text-xs lg:text-sm text-brand font-semibold ">
                                    Balance
                                </p>
                            </div>
                            <div className=" p-3 flex w-full flex-col gap-7">
                                <div className=" bg-[#EFF1FB] font-medium py-2 px-4 w-fit rounded-4xl lg:text-base text-xs flex justify-center items-center ">
                                    USD Dollar
                                </div>
                                <div className=" w-full flex flex-col gap-1 lg:px-4 ">
                                    <div className=" flex items-center gap-3 ">
                                        <p className=" text-xl lg:text-3xl font-semibold ">
                                            {!show ? formatNumber(data?.balance ?? 0) : "$***"}
                                        </p>
                                        <button onClick={()=> setShow((prev)=> !prev)} >
                                            {!show ? (
                                                <IoEyeOff size={"20px"} />
                                            ) : (
                                                <IoEye size={"20px"} />
                                            )}
                                        </button>
                                    </div>
                                    {/* <div className=" flex items-center gap-3 w-full border-b border-b-[#EFF1FE] pb-5 ">
                                        <p className=" text-xs lg:text-sm text-secondary font-medium ">
                                            67*****43459
                                        </p>
                                        <IoCopyOutline size={"16px"} />
                                    </div> */}
                                </div>
                            </div>
                            <div className=" w-full grid grid-cols-3 pb-5 px-4 lg:px-8 ">
                                {walletList.map((item) => {
                                    return (
                                        <button
                                            key={item.label}
                                            className=" w-full flex flex-col gap-[6px] items-center "
                                            onClick={() =>
                                                router.push(item?.link)
                                            }
                                        >
                                            <div
                                                className={` ${pathname === item.link ? " border-brand " : " border-white "}  border w-10 h-10 rounded-full bg-white flex justify-center items-center `}
                                            >
                                                <item.icon
                                                    size={"20px"}
                                                    color={"#9747FF"}
                                                />
                                            </div>
                                            <p
                                                className={` text-[10px] font-medium ${pathname === item.link ? " text-brand " : " "}  `}
                                            >
                                                {item?.label}
                                            </p>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                        <div className="  lg:w-[435px] flex flex-col gap-5 ">
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        </LoadingLayout>
    );
}
