"use client"
import { Tabs, Tab } from "@heroui/tabs"
import { useState } from "react"

export default function MyOrderPage() {


    const [tab, setTab] = useState("")

    const tablink = [
        {
            label: "Service",
            key: ""
        },
        {
            label: "Product",
            key: "product"
        },
    ]

    return (
        <div className=" w-full flex flex-col py-10 gap-10 h-full ">
            <div className=" w-full flex flex-col items-center px-8 " >
                <div className=" w-full max-w-[1276px] flex flex-col gap-4 pb-5 " >
                    <div className=" w-full flex flex-col " >
                        <p className=" font-semibold text-3xl " >My order</p>
                        <p className=" text-sm " >See all orders  on Everything Beauty</p>
                    </div>
                </div>
                <div className=" w-fit flex justify-start " >
                    <Tabs selectedKey={tab ? tab : ""} aria-label="Tabs" variant={"underlined"}
                        classNames={{
                            tabContent:
                                "group-data-[selected=true]:text-brand group-data-[selected=true]:font-bold text-gray-500 font-medium transition-colors",
                            cursor: "bg-brand",
                        }} >
                        {tablink?.map((item) => {
                            return (
                                <Tab key={item?.key} onClick={() => setTab(item?.key)} title={item?.label} />
                            )
                        })}
                    </Tabs>
                </div>
            </div>
        </div>
    )
}