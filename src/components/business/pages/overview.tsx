"use client"
import { CustomButton, CustomSelect } from "@/components/custom"; 
import { useParams } from "next/navigation";
import { lazy, Suspense, useState } from "react";
import { SchedularList } from "..";


export default function Overview() {
 
    const [selectedTab, setSelectedTab] = useState("incoming")

    const param = useParams();
    const id = param.id as string;


    const OrderList = lazy(() => import("@/components/order").then(module => ({ default: module.OrderList })));
    const BookingList = lazy(() => import("@/components/order").then(module => ({ default: module.BookingList })));

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
            </div>
            <SchedularList />
            <div className=" w-full flex flex-col gap-4 mt-4 " >
                <p className=" text-2xl font-medium " >Bookings</p>
                <div className=" w-full flex gap-4 " >
                    <CustomButton onClick={() => setSelectedTab("incoming")} variant={selectedTab === "incoming" ? "primary" : "outline"} height="40px" className={` !font-medium ${selectedTab === "incoming" ? "!bg-[#F7F2FF] !text-brand  " : ""} `} >Incoming Bookings</CustomButton>
                    <CustomButton onClick={() => setSelectedTab("completed")} variant={selectedTab === "completed" ? "primary" : "outline"} height="40px" className={` !font-medium  ${selectedTab === "completed" ? "!bg-[#F7F2FF] !text-brand  " : ""}  `}>Incoming Orders</CustomButton>
                </div>

                <Suspense fallback={<div className="text-center ">Loading...</div>}>
                    <div className=" w-full pt-8 flex flex-col " >
                        {selectedTab === "incoming"  && (
                            <BookingList id={id} />
                        )}
                        {selectedTab === "completed" && (
                            <OrderList id={id} />
                        )}
                    </div>
                </Suspense> 
            </div>
        </div>
    )
}