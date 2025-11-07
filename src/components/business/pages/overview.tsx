"use client"
import { BusinessBookingCard } from "@/components/cards";
import { CustomButton, CustomSelect } from "@/components/custom";
import { useParams } from "next/navigation";
import { useState } from "react";


export default function Overview() {

    const [schedule, setSchedule] = useState("")
    const [selectedTab, setSelectedTab] = useState("incoming")

    const param = useParams();
    const id = param.id; 

    return (
        <div className=" w-full flex-col flex gap-6 " >
            <div className=" border-b flex items-end justify-center gap-6 " >
                <div className=" py-2 px-6 bg-[#F5EEFF] text-brand rounded-t-2xl " >
                    <p className=" text-sm font-medium " >Dashboard</p>
                </div>
                <div className=" py-4 w-[190px] px-4 flex flex-col gap-2 bg-brand text-white rounded-t-2xl " >
                    <p className=" font-semibold " >0</p>
                    <p className=" text-sm font-semibold " >Booking for this week</p>
                </div>
                <div className=" py-4 w-[190px] px-4 flex flex-col gap-2 bg-brand text-white rounded-t-2xl " >
                    <p className=" font-semibold " >0</p>
                    <p className=" text-sm font-semibold " >Total Earnings</p>
                </div>
                <div className=" py-4 w-[190px] px-4 flex flex-col gap-2 bg-brand text-white rounded-t-2xl " >
                    <p className=" font-semibold " >0</p>
                    <p className=" text-sm font-semibold " >Booking Completed</p>
                </div>
            </div>
            <div className=" w-full flex items-center justify-between " >
                <p className=" text-2xl font-medium " >Schedule</p>
                <div className=" flex items-center gap-4 " >
                    <div className=" w-[160px] " >
                        <CustomSelect notform={true} onchange={setSchedule} value={schedule} rounded="999px" placeholder="Select Schedule" options={[
                            {
                                value: "Availability",
                                label: "Availability"
                            }
                        ]} name={"schedule"} />
                    </div>
                    <CustomButton variant="outline" >Show calendar</CustomButton>
                </div>
            </div>
            <div className=" w-full overflow-x-auto " >
                <div className=" w-fit flex gap-1 items-center " >
                    {Array.from({ length: 30 }).map((item) => {
                        return (
                            <div key={item+""} className=" w-[128px]  flex flex-col hover:text-brand hover:border-brand rounded-2xl h-[128px] border p-2 " >
                                <div className=" w-full flex items-center justify-between " >
                                    <p className=" text-xs font-medium " >12</p>
                                    <p className=" text-xs " >Today</p>
                                </div>
                                <p className=" text-xs mt-auto text-primary " >No bookings</p>
                            </div>
                        )
                    })}
                </div>
            </div>
            <div className=" w-full flex flex-col gap-4 mt-4 " >
                <p className=" text-2xl font-medium " >Bookings</p>
                <div className=" w-full flex gap-4 " >
                    <CustomButton onClick={() => setSelectedTab("incoming")} variant={selectedTab === "incoming" ? "primary" : "outline"} height="40px" className={` !font-medium ${selectedTab === "incoming" ? "!bg-[#F7F2FF] !text-brand  " : ""} `} >Incoming Bookings</CustomButton>
                    <CustomButton onClick={() => setSelectedTab("completed")} variant={selectedTab === "completed" ? "primary" : "outline"} height="40px" className={` !font-medium  ${selectedTab === "completed" ? "!bg-[#F7F2FF] !text-brand  " : ""}  `}>Completed</CustomButton>
                </div>
                <div className=" w-full grid grid-cols-4 gap-4 " >
                    <BusinessBookingCard />
                </div>
            </div>
        </div>
    )
}