"use client";
import { LoadingLayout } from "@/components/shared";
import { ITransaction } from "@/helper/model/business";
import { URLS } from "@/helper/services/urls";
import { dateFormat } from "@/helper/utils/dateFormat";
import { formatNumber } from "@/helper/utils/numberFormat";
import { useFetchData } from "@/hooks/useFetchData";
import { userAtom } from "@/store/user";
import { MoneySend } from "iconsax-reactjs";
import { useAtom } from "jotai";

export default function WalletPage() {
    const [user] = useAtom(userAtom);

    const { data = [], isLoading } = useFetchData<ITransaction[]>({
        endpoint: URLS.TRANSACTIONBYUSERID(user?._id as string),
        name: ["transaction", user?._id as string],
    });

    console.log(data);

    return (
        <LoadingLayout loading={isLoading}>
            <div className=" w-full flex flex-col gap-4 ">
                {data?.map((item) => {
                    return (
                        <div key={item?._id} className=" w-full flex items-center gap-3 justify-between ">
                            <div className=" flex gap-3 ">
                                <div className=" w-[41px] h-[41px] rounded-full bg-brand flex items-center justify-center text-white ">
                                    <MoneySend size={"20px"} />
                                </div>
                                <div className=" flex flex-col ">
                                    <p className=" font-bold uppercase ">{item?.type?.replaceAll("_", " ")}</p>
                                    <p className=" text-sm ">{formatNumber(item?.amount)}</p>
                                </div>
                            </div>
                            <div className=" flex flex-col items-center ">
                                <div
                                    className={` w-[90px] rounded-3xl flex justify-center items-center h-[35px] ${item?.status === "success" ? " bg-[#CCFFDA] text-[#00B71DFC] " : " bg-[#F6E6D180] text-[#F78401] "} font-semibold text-[10px] `}
                                >
                                    <p>{item?.status === "success" ? "COMPLETE" : "IN-COMPLETE"}</p>
                                </div>
                                <p className=" text-xs text-right ">
                                    {dateFormat(item?.createdAt)}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </LoadingLayout>
    );
}
