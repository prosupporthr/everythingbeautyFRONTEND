"use client"

import { IoArrowBackOutline } from "react-icons/io5";
import { useParams, useRouter } from "next/navigation"
import { RiCalendar2Line } from "react-icons/ri";
import { CustomImage } from "@/components/custom";
import { useFetchData } from "@/hooks/useFetchData";
import { IBookingDetail, IOrderDetail } from "@/helper/model/business";
import { LoadingLayout, UserCard } from "@/components/shared";
import { formatNumber } from "@/helper/utils/numberFormat";
import { IUserDetail } from "@/helper/model/user";
import { FaTruck } from "react-icons/fa6";
import { dateTimeFormat } from "@/helper/utils/dateFormat";


export default function BookedServicesPage() {

    const router = useRouter()
    const param = useParams();

    const id = param.id as string;


    const { data, isLoading } = useFetchData<IBookingDetail>({
        endpoint: `/booking/${id}`, name: ["business", id]
    }) 


    return (
        <div className=" w-full min-h-[50vh] " >
            <LoadingLayout loading={isLoading} >
                <div className=" w-full flex flex-col py-6 lg:py-10 gap-10 h-full ">
                    <div className=" w-full flex flex-col px-6 lg:px-8 " >
                        <div className=" w-full max-w-[1276px] flex flex-col gap-4 pb-5 " >
                            <div className=" flex gap-3 items-center " >
                                <button onClick={() => router.back()} className=" w-12 h-12 rounded-full flex  border items-center justify-center border-gray-100 text-primary " >
                                    <IoArrowBackOutline size={"22px"} />
                                </button>
                                <p className=" text-lg lg:text-2xl font-bold capitalize " >My booking</p>
                            </div>

                            <div className=" w-full flex lg:flex-row flex-col gap-6 lg:gap-12 lg:p-4 " >
                                <div className=" w-full flex flex-col gap-4 " >
                                    <div className=" lg:flex hidden items-center gap-3 pb-3 border-b " >
                                        <div className=" w-fit " >
                                            <div className=" w-12 h-12 rounded-full flex  border items-center justify-center border-gray-100 text-primary " >
                                                <RiCalendar2Line size={"20px"} />
                                            </div>
                                        </div>
                                        <div className=" flex flex-col text-xs " >
                                            <p className=" font-bold " >{`You won't be charged until Vendors accepts your request.`}</p>
                                            <p className=" font-medium " >{`This usually takes up to 24 hours`}</p>
                                        </div>
                                    </div>
                                    <div className=" w-full flex gap-4 lg:flex-row flex-col lg:gap-2 lg:items-center pb-3 border-b " >
                                        <div className=" w-full lg:w-[123px] h-[200px] lg:h-[103px] rounded-2xl bg-gray-200 " >
                                            <CustomImage alt={data?.service?.name as string} style={{
                                                borderRadius: "16px"
                                            }}
                                                src={data?.service?.pictures[0] as string} fillContainer />
                                        </div>
                                        <div className=" lg:hidden flex items-center gap-3 pb-3 border-b " >
                                            <div className=" w-fit " >
                                                <div className=" w-12 h-12 rounded-full flex  border items-center justify-center border-gray-100 text-primary " >
                                                    <RiCalendar2Line size={"20px"} />
                                                </div>
                                            </div>
                                            <div className=" flex flex-col text-xs " >
                                                <p className=" font-bold " >{`You won't be charged until Vendors accepts your request.`}</p>
                                                <p className=" font-medium " >{`This usually takes up to 24 hours`}</p>
                                            </div>
                                        </div>
                                        <div className=" flex flex-col gap-1 text-sm " >
                                            <div className=" flex gap-4 items-center " >
                                                <p className=" text-secondary w-[100px] " >Service:</p>
                                                <p className=" font-bold text-left capitalize " >{data?.service?.name}</p>
                                            </div>
                                            <div className=" flex gap-4 items-center " >
                                                <p className=" text-secondary w-[100px] " >Time & Date:</p>
                                                <p className=" font-bold text-left " >{dateTimeFormat(data?.bookingDate as string)}</p>
                                            </div>
                                            <div className=" flex gap-4 items-center " >
                                                <p className=" text-secondary w-[100px] " >Price:</p>
                                                <p className=" font-bold text-left " >{formatNumber(Number(data?.service?.hourlyRate))}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className=" w-full flex-col flex gap-2 pb-3 border-b " >
                                        <p className=" font-semibold " >Business Information</p>
                                        <p className=" text-sm font-medium mt-3 " ><span className=" font-bold " >Address:</span> {data?.service?.business?.location}</p>
                                        <p className=" text-sm font-medium "><span className=" font-bold " >Phone Number:</span> {data?.service?.business?.creator?.phoneNumber}</p>
                                    </div>

                                    <div className=" w-full flex-col flex gap-2 pb-3 border-b " >
                                        <UserCard item={data?.service?.business?.creator as IUserDetail} showDetail />
                                    </div>
                                </div>
                                <div className=" lg:max-w-[500px] w-full flex flex-col gap-3 " >
                                    <div className=" flex gap-2 items-center text-[#0CC23A]  " >
                                        <FaTruck size={"20px"} />
                                        <p className=" font-bold " >Shipping on all orders:</p>
                                    </div>
                                    <div className=" flex flex-col text-sm font-medium " >
                                        <p>Seller-Fulfilled Shipping - The seller handles the entire shipping process and not Chasescroll. </p>
                                        <p>Verify that items are in good condition and meet the expected quality standards before authorizing payment.</p>
                                        <p>Please inform us if you encounter any issues at support@evertythingbeauty.com</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </LoadingLayout>
        </div>
    )
}