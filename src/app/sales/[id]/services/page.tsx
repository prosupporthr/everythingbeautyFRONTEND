"use client"
import { CustomButton, CustomImage, CustomSelect, CustomTimePicker } from "@/components/custom";
import CustomDateTimePicker from "@/components/custom/customDatePicker";
import { LoadingLayout, StarRating } from "@/components/shared";
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

export default function SaleServicePage() {

    const param = useParams();
    const id = param.id;

    const router = useRouter()

    const { data, isLoading } = useFetchData<IBusinessDetails>({
        endpoint: `/business/${id}`, name: "business"
    })

    const [status, setStatus] = useState(false)

    const { data: services = [], isLoading: loading } = useFetchData<IServiceDetail[]>({
        endpoint: `/service/business/${id}`, name: "service"
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
    console.log(data);


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

    useEffect(()=> {
        if(selectedOption) {
            const newdate = mergeDateAndTime(selectedOption?.date, selectedOption.time)
            setSelectedDate(newdate+"")
        }
    }, [selectedOption])

    const handleClick = () => {
        router.push(`/sales/${id}/booking/${selectedOption.service}?date=${selectedDate}`)
    }

    return (
        <LoadingLayout loading={isLoading || loading} >
            <div className=" w-full flex flex-col gap-4 p-10 " >
                <div className=" w-full flex items-center justify-between " >
                    <p className=" text-2xl font-bold capitalize " >{data?.name}</p>
                    <div className=" flex gap-4 items-center " >
                        <button className=" w-10 h-10 rounded-full flex justify-center items-center border " >
                            <RiShareLine size={"24px"} />
                        </button>
                        <button className=" w-10 h-10 rounded-full flex justify-center items-center border " >
                            <IoMdHeartEmpty size={"24px"} />
                        </button>
                    </div>
                </div>
                <p className=" text-sm font-medium capitalize " >Home • Services • {data?.name}</p>
                <div className=" w-full flex gap-3 " >
                    <StarRating />
                    <p className=" font-medium " >{data?.location} • <span className={` ${status ? " text-success-500 " : "text-red-500"}  `} >{status ? "Open Now" : "Closed"}</span> • <span className=" text-brand " >Get directions</span></p>
                </div>
                <div className=" w-full h-[350px] rounded-2xl bg-gray-300 " >
                    <CustomImage alt={data?.name as string} style={{
                        borderRadius: "16px"
                    }} fillContainer src={data?.pictures[0] as string} />
                </div>
                <div className=" w-full flex " >
                    <div className=" flex-1 flex flex-col gap-4 p-6 " >
                        <p className=" text-2xl font-semibold " >Service offered</p>
                        <div className=" w-full flex border-b pb-4 flex-wrap gap-4" >
                            {options.map((item) => {
                                return (
                                    <CustomButton key={item?.value} height="45px" variant="outline" >{item?.label}</CustomButton>
                                )
                            })}
                        </div>
                        <div className=" pb-4 border-b w-full flex flex-col gap-3 " >
                            {/* <UserCard item={} /> */}
                            <div className=" pl-10 flex flex-col gap-3 " >
                                <p className=" text-sm " >Norem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputatelibero et velit interdum, ac aliquet odio mattis.</p>
                                <div className=" w-full flex gap-2 " >
                                    <CustomButton variant="outlinebrand" height="45px" >View Profile</CustomButton>
                                    <CustomButton height="45px" >View Profile</CustomButton>
                                </div>
                            </div>
                        </div>
                        <div className=" w-full flex flex-col pb-4 border-b gap-4 " >
                            <p className=" text-xl font-bold " >About this salon</p>
                            <p className=" text-sm " >Norem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputatelibero et velit interdum, ac aliquet odio mattis. Class aptent taciti sociosquad litora torquent per conubia nostra, per inceptos himenaeos. Norem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputatelibero et velit interdum, ac aliquet odio mattis. Class aptent taciti sociosquad litora torquent per conubia nostra, per inceptos himenaeos.</p>
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
                    </div>
                    <div className=" w-fit " >
                        <div className=" w-[413px] rounded-2xl border p-6 flex flex-col gap-4 " >
                            <p className=" text-2xl font-bold " >Checkout</p>
                            <div className=" w-full border rounded-t-xl " >
                                <div className=" w-full h-fit border-b px-4 py-2 " >
                                    <CustomSelect placeholder="Select Services " name="service" onchange={(item: string) => setSelectedOption({ ...selectedOption, service: item })} value={selectedOption?.service} borderWidth="0px" label="Select Service" notform={true} options={options} />
                                </div>
                                <div className=" w-full flex py-2 " >
                                    <div className=" w-full border-r px-4 " >
                                        <CustomDateTimePicker borderWidth="0px" withTime={false} label="Service Date" useFormik={false} name="date" onChange={(item: string) => setSelectedOption({ ...selectedOption, date: item })} value={selectedOption?.date} />
                                    </div>
                                    <div className=" w-full px-4 " >
                                        <CustomTimePicker useFormik={false} label="Service Time" onChange={(item: string) => setSelectedOption({ ...selectedOption, time: item })} value={selectedOption?.time} borderWidth="0px" />
                                    </div>
                                </div>
                            </div>
                            <CustomButton onClick={handleClick} isDisabled={(selectedOption.service && selectedDate) ? false : true} >Book Now</CustomButton>
                            <div className=" w-full flex justify-center border-b pb-3 font-medium " >
                                You won't be charged yet
                            </div>
                            <div className=" w-full flex justify-between items-center " >
                                <p className=" text-xl font-medium " >Total</p>
                                <p className=" text-xl font-bold " >$36</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </LoadingLayout>
    )
}