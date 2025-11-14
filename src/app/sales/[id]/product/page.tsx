"use client"
import { CustomButton, CustomImage } from "@/components/custom";
import { LoadingLayout, StarRating } from "@/components/shared";
import { useEffect, useState } from "react";
import { RiAddFill } from "react-icons/ri";
import { useFetchData } from "@/hooks/useFetchData";
import { useParams, useRouter } from "next/navigation";
import { IProductDetail } from "@/helper/model/business";
import { isBusinessOpen } from "@/helper/utils/dateStatus";
import { RxMinus } from "react-icons/rx";
import { formatNumber } from "@/helper/utils/numberFormat";
import { URLS } from "@/helper/services/urls";
import UserCard from "@/components/shared/userCard";
import { IUserDetail } from "@/helper/model/user";
import { IoArrowBackOutline } from "react-icons/io5";

export default function SaleProductPage() {

    const param = useParams();
    const id = param.id as string;

    const router = useRouter()

    const { data, isLoading } = useFetchData<IProductDetail>({
        endpoint: URLS.PRODUCTBYID(id), name: ["product"]
    })

    const [status, setStatus] = useState(false)

    const [qty, setQty] = useState(0)

    useEffect(() => {

        if (data?._id && !isLoading) {
            const isStatus = data?.business?.days && data?.business?.openingTime && data?.business?.closingTime
                ? isBusinessOpen({
                    days: data?.business.days,
                    openingTime: data?.business.openingTime,
                    closingTime: data?.business.closingTime
                })
                : false;
            setStatus(isStatus)
        }

    }, [data, isLoading])

    const handleClick = () => {
        router.push(`/sales/${data?.businessId}/order/${id}?qty=${qty}`)
    }

    return (
        <LoadingLayout loading={isLoading} >
            <div className=" w-full flex flex-col gap-4 p-10 " >
                <div className=" flex gap-3 items-center " >
                    <button onClick={() => router.back()} className=" w-12 h-12 rounded-full flex  border items-center justify-center border-gray-100 text-primary " >
                        <IoArrowBackOutline size={"22px"} />
                    </button>
                    <p className=" text-2xl font-bold capitalize " >Product</p>
                </div>
                <p className=" text-sm font-medium capitalize " >Home • Product • {data?.name}</p>
                <div className=" w-full flex gap-6 " >
                    <div className=" flex-1 flex flex-col gap-4 px-4 " >

                        <div className=" w-full h-[350px] rounded-2xl bg-gray-300 " >
                            <CustomImage alt={data?.name as string} style={{
                                borderRadius: "16px"
                            }} fillContainer src={data?.pictures[0] as string} />
                        </div>
                        <div className=" pb-4 border-b w-full flex flex-col gap-3 " >
                            <UserCard item={data?.business?.creator as IUserDetail} showDetail />
                            <div className=" pl-10 flex flex-col gap-3 " >
                                {/* <p className=" text-sm " >Norem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputatelibero et velit interdum, ac aliquet odio mattis.</p> */}
                                <div className=" w-full flex gap-2 " >
                                    <CustomButton variant="outlinebrand" height="40px" >View Profile</CustomButton>
                                    <CustomButton height="40px" >Message</CustomButton>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className=" w-fit " >
                        <div className=" w-full max-w-[562px] flex flex-col gap-4 " >
                            <div className=" w-full pb-4 border-b " >
                                <p className=" text-2xl font-semibold capitalize " >{data?.name}</p>
                            </div>
                            <div className=" w-full flex gap-3 " >
                                <StarRating />
                                <p className=" font-medium text-sm " >{data?.business?.rating} Ratings • <span className={` ${status ? " text-success-500 " : "text-red-500"}  `} >0 Reviews</span> • <span className=" text-brand " >0 sold</span></p>
                            </div>
                            <p className=" font-semibold text-3xl " >$45</p>
                            <div className=" flex flex-col gap-1 " >
                                <p className=" font-semibold " >Choose color:</p>
                                <div className=" w-full flex items-center gap-2 " >
                                    <div className=" w-8 h-8 rounded-full  bg-amber-200 " />
                                    <div className=" w-8 h-8 rounded-full  bg-amber-200 " />
                                    <div className=" w-8 h-8 rounded-full  bg-amber-200 " />
                                </div>
                            </div>
                            <div className=" w-full flex flex-col gap-2 " >
                                <p className=" font-semibold " >Details</p>
                                <p className=" text-sm " >{data?.description}</p>
                            </div>
                            <div className=" w-[413px] rounded-2xl border p-6 flex flex-col gap-4 " >
                                <p className=" text-2xl font-bold " >Checkout</p>
                                <div className=" w-full flex items-center justify-center gap-4 " >
                                    <button disabled={qty === 0} onClick={() => setQty(qty - 1)} className=" w-10 h-10 rounded-full bg-gray-200 flex justify-center items-center " >
                                        <RxMinus />
                                    </button>
                                    {qty}
                                    <button onClick={() => setQty(qty + 1)} className=" w-10 h-10 rounded-full bg-gray-200 flex justify-center items-center " >
                                        <RiAddFill />
                                    </button>
                                </div>
                                <CustomButton onClick={handleClick} isDisabled={(qty > 0) ? false : true} >Check out</CustomButton>
                                <div className=" w-full flex justify-center border-b pb-3 font-medium " >
                                    You won't be charged yet
                                </div>
                                <div className=" w-full flex justify-between items-center " >
                                    <p className=" text-xl font-medium " >Total</p>
                                    <p className=" text-xl font-bold " >{formatNumber(data?.price ?? 0)}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </LoadingLayout>
    )
}