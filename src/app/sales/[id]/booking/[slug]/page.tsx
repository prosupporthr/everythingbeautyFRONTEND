"use client"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { IoArrowBackOutline } from "react-icons/io5";
import { RiCalendar2Line } from "react-icons/ri";
import { IoIosCheckmarkCircle } from "react-icons/io";
import { Textarea } from "@heroui/input";
import { CustomButton, CustomImage } from "@/components/custom";
import { IBusinessDetails, IServiceDetail } from "@/helper/model/business";
import { useFetchData } from "@/hooks/useFetchData";
import { dateFormatMonthAndYear, dateTimeFormat } from "@/helper/utils/dateFormat";
import { formatNumber } from "@/helper/utils/numberFormat";
import { LoadingLayout } from "@/components/shared";
import useBooking from "@/hooks/useBooking";
import { useAtom } from "jotai";
import { userAtom } from "@/store/user";

export default function BookingPage() {

    const router = useRouter()
    const param = useParams();
    const id = param.id as string;
    const slug = param.slug as string;
    const query = useSearchParams();
    const date = query?.get('date') as string;
    const [userState] = useAtom(userAtom)

    const { data: user } = userState

    const { bookingMutation, isLoading: loadingBooking } = useBooking()

    const { data, isLoading } = useFetchData<IBusinessDetails>({
        endpoint: `/business/${id}`, name: "business"
    })

    const { data: services, isLoading: loading } = useFetchData<IServiceDetail>({
        endpoint: `/service/${slug}`, name: "service"
    })

    const handleClick = () => {
        bookingMutation.mutate({
            serviceId: slug,
            businessId: id,
            userId: user?._id as string,
            totalPrice: services?.hourlyRate as number,
            bookingDate: date
        })
    }

    return (
        <LoadingLayout loading={loading || isLoading} >
            <div className=" w-full flex flex-col gap-6 p-6 " >
                <div className=" flex items-center gap-2  " >
                    <button onClick={() => router.back()} className=" w-12 h-12 rounded-full flex  border items-center justify-center border-gray-100 text-primary " >
                        <IoArrowBackOutline size={"22px"} />
                    </button>
                    <p className=" text-2xl font-medium " >Request to book</p>
                </div>
                <div className=" w-full flex gap-12 p-4 " >
                    <div className=" w-full flex flex-col gap-4 " >
                        <div className=" flex items-center gap-3 pb-3 border-b " >
                            <div className=" w-12 h-12 rounded-full flex  border items-center justify-center border-gray-100 text-primary " >
                                <RiCalendar2Line size={"20px"} />
                            </div>
                            <div className=" flex flex-col text-xs " >
                                <p className=" font-bold " >{`You won't be charged until Vendors accepts your request.`}</p>
                                <p className=" font-medium " >{`This usually takes up to 24 hours`}</p>
                            </div>
                        </div>
                        <div className=" w-full flex gap-2 items-center pb-3 border-b " >
                            <div className=" w-[123px] h-[103px] rounded-2xl bg-gray-200 " >
                                <CustomImage alt={services?.name as string} style={{
                                    borderRadius: "16px"
                                }}
                                    src={services?.pictures[0] as string} fillContainer />
                            </div>
                            <div className=" flex flex-col gap-1 text-sm " >
                                <div className=" flex gap-4 items-center " >
                                    <p className=" text-secondary w-[100px] " >Service:</p>
                                    <p className=" font-bold text-left capitalize " >{services?.name}</p>
                                </div>
                                <div className=" flex gap-4 items-center " >
                                    <p className=" text-secondary w-[100px] " >Time & Date:</p>
                                    <p className=" font-bold text-left " >{dateTimeFormat(date)}</p>
                                </div>
                                <div className=" flex gap-4 items-center " >
                                    <p className=" text-secondary w-[100px] " >Price:</p>
                                    <p className=" font-bold text-left " >{formatNumber(Number(services?.hourlyRate))}</p>
                                </div>
                            </div>
                        </div>
                        <div className=" w-full flex-col flex gap-3 pb-3 border-b " >
                            <div className=" w-full flex justify-between items-center " >
                                <p >Payment schedule:</p>
                                <p className=" text-xs text-secondary " >Full payments</p>
                            </div>
                            <div className=" w-full flex justify-between items-center " >
                                <div className=" flex items-center gap-1 " >
                                    <IoIosCheckmarkCircle size={"25px"} color="#25C26E" />
                                    <p className=" text-sm font-bold text-secondary " >{formatNumber(Number(services?.hourlyRate) + 1)}</p>
                                </div>
                                <p className=" text-xs text-secondary " >Paid on {dateFormatMonthAndYear(date)}</p>
                            </div>
                            <p className=" underline text-brand text-xs " >see all</p>
                        </div>
                        <div className=" w-full flex-col flex gap-3 pb-3 border-b " >
                            <p className=" text-sm " >Leave a message for the vendor</p>
                            <Textarea />
                        </div>
                        <div className=" w-full flex-col flex gap-3 pb-3 border-b " >
                            <p className=" text-sm " >Cancellation policy</p>
                            <p className=" text-xs text-secondary " >Free cancellation up until 4 Apr . Cancel before check in on 10 Apr for a 50% refund. No refunds </p>
                        </div>
                        <div className=" w-[300px] " >
                            <CustomButton fullWidth onClick={handleClick} isLoading={loadingBooking} >Pay</CustomButton>
                        </div>
                    </div>
                    <div className=" w-fit " >
                        <div className=" w-[480px] flex flex-col gap-3 rounded-2xl border p-6 " >
                            <div className=" w-full flex items-center gap-2 pb-3 border-b " >
                                <div className=" w-fit " >
                                    <div className=" w-[96px] h-[94px] rounded-lg bg-gray-200 " >
                                        <CustomImage alt={data?.name as string} style={{
                                            borderRadius: "8px"
                                        }} src={data?.pictures[0] as string} fillContainer />
                                    </div>
                                </div>
                                <div className=" flex flex-col gap-1 " >
                                    <p className=" text-xl font-bold cap  " >{data?.name}</p>
                                    <p className=" text-sm " >{data?.location}</p>
                                </div>
                            </div>
                            <div className=" flex flex-col w-full gap-3 pb-3 border-b " >
                                <div className=" w-full flex justify-between items-center text-sm " >
                                    <p >Amount</p>
                                    <p>{formatNumber(Number(services?.hourlyRate) + 1)}</p>
                                </div>
                                <p className=" font-bold mt-3 " >Pricing</p>
                                <div className=" w-full flex justify-between items-center text-sm text-secondary " >
                                    <p >Taxes</p>
                                    <p>$1</p>
                                </div>
                            </div>
                            <div className=" w-full flex justify-between items-center text-sm " >
                                <p className=" font-medium " >Total</p>
                                <p className=" text-xl font-bold " >{formatNumber(Number(services?.hourlyRate) + 1)}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </LoadingLayout>
    )
}