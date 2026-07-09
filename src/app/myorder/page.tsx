"use client"
import { MyorderPage } from "@/components/user" 

export default function MyOrderPage() {

    return (
        <div className=" w-full flex flex-col py-6 lg:py-10 gap-10 h-full ">
            <div className=" w-full flex flex-col min-h-[50vh] px-6 lg:px-8 " >
                <div className=" w-full max-w-[1276px] flex flex-col gap-4 pb-5 " >
                    <div className=" w-full flex flex-col " >
                        <p className=" font-semibold text-3xl " >My order</p>
                        <p className=" text-sm " >See all orders  on Everything Beauty</p>
                    </div>
                </div>
                <MyorderPage />
            </div>
        </div>
    )
}