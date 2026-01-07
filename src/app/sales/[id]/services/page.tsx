"use client"
import { CustomButton, CustomImage, CustomSelect, CustomTimePicker } from "@/components/custom";
import CustomDateTimePicker from "@/components/custom/customDatePicker";
import { LoadingLayout, MessageBtn, StarRating } from "@/components/shared";
import { useEffect, useState } from "react";
import { IoMdHeartEmpty } from "react-icons/io";
import { RiShareLine } from "react-icons/ri";
import { PiClockLight } from "react-icons/pi";
import { useFetchData } from "@/hooks/useFetchData";
import { useParams, useRouter } from "next/navigation";
import { IBusinessDetails, IServiceDetail } from "@/helper/model/business";
import { convertDataForSelect } from "@/helper/utils/convertDataForSelect";
import { days } from "@/helper/utils/databank";
import { isBusinessOpen } from "@/helper/utils/dateStatus";
import { formatNumber } from "@/helper/utils/numberFormat";
import { BusinessServiceCard } from "@/components/cards";
import UserCard from "@/components/shared/userCard";
import { IUserDetail } from "@/helper/model/user";
import { IoArrowBackOutline } from "react-icons/io5";
import { userAtom } from "@/store/user";
import { useAtom } from "jotai";
import { MapView } from "@/components/map_component";
import { ProductList } from "@/components/product";
import ReviewSection from "@/components/landing/reviewsection"; 

export default function SaleServicePage() {

    const param = useParams();
    const id = param.id as string;

    const router = useRouter()

    const { data, isLoading } = useFetchData<IBusinessDetails>({
        endpoint: `/business/${id}`, name: ["business"]
    })

    const [user] = useAtom(userAtom)

    const [status, setStatus] = useState(false)
    const [marker, setMarker] = useState({} as google.maps.LatLngLiteral | null)
    const [index, setIndex] = useState<number>()

    const { data: services = [], isLoading: loading } = useFetchData<IServiceDetail[]>({
        endpoint: `/service/business/${id}`, name: ["service"]
    })

    function mergeDateAndTime(dateISO: string, time: string) {
        if (!dateISO || !time) return null;

        const [hour, minute] = time.split(":").map(Number);

        // Extract the date part only (YYYY-MM-DD)
        const datePart = dateISO.split("T")[0];

        // Build a full datetime string in local time (no shifting)
        const localDateTime = `${datePart}T${hour.toString().padStart(2, "0")}:${minute
            .toString()
            .padStart(2, "0")}:00`;

        // Convert to Date so you can send ISO
        const date = new Date(localDateTime);

        return date.toISOString();
    }

    const options = convertDataForSelect(services, ["name", "_id"]);


    const [selectedOption, setSelectedOption] = useState({
        service: "",
        time: "",
        date: "",
    })

    const [selectedDate, setSelectedDate] = useState("")

    useEffect(() => {

        if (data?._id && !isLoading) {
            const isStatus = data?.days && data?.openingTime && data?.closingTime
                ? isBusinessOpen({
                    days: data.days,
                    openingTime: data.openingTime,
                    closingTime: data.closingTime
                })
                : false;
            setStatus(isStatus)
        }

    }, [data, isLoading])

    useEffect(() => {
        if (selectedOption?.date && selectedOption?.time) {
            const newdate = mergeDateAndTime(selectedOption?.date, selectedOption.time)
            setSelectedDate(newdate + "")
        }
    }, [selectedOption])

    useEffect(() => {
        setMarker({
            lat: Number(data?.lat ?? 0),
            lng: Number(data?.long ?? 0)
        })

    }, [data, isLoading, setMarker])

    const handleClick = () => {
        router.push(`/sales/${id}/booking/${selectedOption.service}?date=${selectedDate}`)
    }

    const handleChange = (item: string) => {
        setSelectedOption({ ...selectedOption, service: item });

        const id = services.findIndex(service => service?._id + "" === item + "");
        setIndex(id)
    } 

    return (
        <LoadingLayout loading={isLoading || loading} >
            <div className=" w-full flex flex-col gap-4 lg:py-10 py-0 lg:p-10 " >
                <div className=" w-full hidden lg:flex items-center justify-between " >
                    <div className=" flex gap-3 items-center " >
                        <button onClick={() => router.back()} className=" w-12 h-12 rounded-full flex  border items-center justify-center border-gray-100 text-primary " >
                            <IoArrowBackOutline size={"22px"} />
                        </button>
                        <p className=" text-2xl font-bold capitalize " >{data?.name}</p>
                    </div>
                    <div className=" flex gap-4 items-center " >
                        <button className=" w-10 h-10 lg:rounded-full flex justify-center items-center border " >
                            <RiShareLine size={"24px"} />
                        </button>
                        <button className=" w-10 h-10 rounded-full flex justify-center items-center border " >
                            <IoMdHeartEmpty size={"24px"} />
                        </button>
                    </div>
                </div>
                <p className=" hidden lg:flex text-sm font-medium capitalize " >Home • Services • {data?.name}</p>
                <div className=" hidden lg:flex w-full gap-3 " >
                    <StarRating />
                    <p className=" font-medium " >{data?.location} • <span className={` ${status ? " text-success-500 " : "text-red-500"}  `} >{status ? "Open Now" : "Closed"}</span> • <span className=" text-brand " >Get directions</span></p>
                </div>
                <div className=" w-full h-[350px] relative rounded-b-2xl lg:rounded-2xl bg-gray-300 " >
                    <button onClick={() => router.back()} className=" w-13 h-13 rounded-lg lg:hidden bg-white flex absolute top-4 left-6  border items-center justify-center z-10  " >
                        <IoArrowBackOutline size={"24px"} />
                    </button>
                    <div className=" w-full lg:flex hidden h-[350px] " >
                        <CustomImage alt={data?.name as string} style={{
                            borderRadius: "16px"
                        }} fillContainer src={data?.pictures[0] as string} />
                    </div>
                    <div className=" w-full lg:hidden flex h-[350px] " >
                        <CustomImage alt={data?.name as string} style={{
                            borderBottomLeftRadius: "16px",
                            borderBottomRightRadius: "16px"
                        }} fillContainer src={data?.pictures[0] as string} />
                    </div>
                </div>
                <div className=" w-full flex lg:flex-row flex-col " >
                    <div className=" flex-1 flex flex-col gap-6 p-6 " >
                        <div className=" w-full lg:hidden flex items-center justify-between " >
                            <div className=" flex gap-3 items-center " >
                                <p className=" text-2xl font-bold capitalize " >{data?.name}</p>
                            </div>
                            <div className=" flex gap-4 items-center " >
                                <button className=" w-10 h-10 rounded-full flex justify-center items-center border " >
                                    <RiShareLine size={"24px"} />
                                </button>
                                {/* <button className=" w-10 h-10 rounded-full flex justify-center items-center border " >
                                    <IoMdHeartEmpty size={"24px"} />
                                </button> */}
                            </div>
                        </div>
                        <p className=" text-xl lg:text-2xl font-semibold " >Service offered</p>
                        <div className=" w-full flex border-b pb-4 gap-4 overflow-x-auto " >
                            {services.map((item, index) => {
                                return ( 
                                    <div className=" w-fit " key={index} >
                                        <BusinessServiceCard bookmark={true} selected={selectedOption?.service} setSelected={(item) => handleChange(item)} item={item} key={item?._id} option={false} />
                                    </div>
                                )
                            })}
                        </div>
                        <div className=" pb-4 border-b w-full flex flex-col gap-3 " >
                            <UserCard item={data?.creator as IUserDetail} showDetail />
                            <div className=" pl-10 flex flex-col gap-3 " >
                                {/* <p className=" text-sm " >Norem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputatelibero et velit interdum, ac aliquet odio mattis.</p> */}
                                <div className=" w-full flex gap-2 " >
                                <CustomButton onClick={()=> router.push(`/profile/${data?.creator?._id}`)} variant="outlinebrand" height="40px" >View Profile</CustomButton>
                                    <MessageBtn user={user as IUserDetail} business={data as IBusinessDetails} creator={data?.creator as IUserDetail} />
                                </div>
                            </div>
                        </div>
                        <div className=" w-full flex flex-col pb-4 border-b gap-4 " >
                            {selectedOption?.service && (
                                <div className=" flex flex-col gap-3 " >
                                    <p className=" text-xl font-bold " >About this service</p>
                                    <p className=" text-sm " >{services[Number(index)]?.description}</p>
                                </div>
                            )}
                            <div className=" w-full flex justify-between gap-4 " >
                                <div className=" flex w-full flex-col gap-4 " >
                                    <div className=" flex items-center gap-2 " >
                                        <PiClockLight size={"25px"} />
                                        <p className=" font-bold " >Opening Time</p>
                                    </div>
                                    <div className=" mt-3 w-full flex flex-col gap-4 " >
                                        {data?.days.map((item) => {
                                            return (
                                                <div key={item} className=" flex items-center gap-2 text-sm  " >
                                                    <PiClockLight size={"25px"} />
                                                    <p className=" font-medium " >{days[item]}</p>
                                                    <p className=" ml-auto " >{data?.openingTime}-{data?.closingTime}</p>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className=" w-full lg:hidden flex gap-6 flex-col pb-8" >
                            <ProductList title={"Product Available"} businessId={id} />
                            {marker?.lat && (
                                <div className=" flex flex-col gap-6 w-full " >
                                    <p className=" text-lg lg:text-2xl font-semibold " >Location and surroundings</p>
                                    <MapView hidesearch={true} marker={marker} latlng={marker} setMarker={setMarker} outclick={true} height="460px" />
                                </div>
                            )}
                            <ReviewSection />
                        </div>
                    </div>
                    {user?._id !== data?.creator?._id && (
                        <div className=" lg:w-fit p-3 lg:relative sticky bottom-0 inset-x-0 lg:z-0 z-30 " >
                            <div className=" w-full bg-white lg:w-[413px] rounded-2xl border p-6 flex flex-col gap-4 " >
                                <p className=" text-2xl font-bold " >Checkout</p>
                                <div className=" w-full border rounded-t-xl " >
                                    <div className=" w-full h-fit border-b px-4 py-2 " >
                                        <CustomSelect placeholder="Select Services " name="service" onchange={(item: string) => handleChange(item)} value={selectedOption?.service} borderWidth="0px" label="Select Service" notform={true} options={options} />
                                    </div>
                                    <div className={` w-full ${selectedOption.service ? " flex " : " lg:flex hidden "} py-2 `} >
                                        <div className=" w-full border-r px-4 " >
                                            <CustomDateTimePicker borderWidth="0px" withTime={false} label="Service Date" useFormik={false} name="date" onChange={(item: string) => setSelectedOption({ ...selectedOption, date: item })} value={selectedOption?.date} />
                                        </div>
                                        <div className=" w-full px-4 " >
                                            <CustomTimePicker useFormik={false} label="Service Time" onChange={(item: string) => setSelectedOption({ ...selectedOption, time: item })} value={selectedOption?.time} borderWidth="0px" />
                                        </div>
                                    </div>
                                </div>
                                <CustomButton onClick={handleClick} isDisabled={(selectedOption.service && selectedDate) ? false : true} >Book Now</CustomButton>
                                <div className=" w-full flex justify-center font-medium " >
                                    You won't be charged yet
                                </div>
                                {selectedOption?.service && (
                                    <div className=" w-full flex justify-between  border-t pt-3 items-center " >
                                        <p className=" text-xl font-medium " >Total</p>
                                        {services?.map((item) => {
                                            if (item?._id === selectedOption?.service) {
                                                return (
                                                    <p key={item?._id} className=" text-xl font-bold " >{formatNumber(item?.hourlyRate)}</p>
                                                )
                                            }
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
                <div className=" w-full lg:flex hidden gap-6 flex-col pb-8" >
                    <ProductList title={"Product Available"} businessId={id} />
                    {marker?.lat && (
                        <div className=" flex flex-col gap-6 w-full px-6 " >
                            <p className=" text-lg lg:text-2xl font-semibold " >Location and surroundings</p>
                            <MapView hidesearch={true} marker={marker} setMarker={setMarker} outclick={true} height="460px" />
                        </div>
                    )}
                    <ReviewSection />
                </div>
            </div>
        </LoadingLayout>
    )
}