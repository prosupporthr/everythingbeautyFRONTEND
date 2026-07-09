"use client";
import { Tabs, Tab } from "@heroui/tabs";
import { lazy, Suspense, useState } from "react";

export default function MyOrderPage() {
    const [tab, setTab] = useState("");

    const tablink = [
        {
            label: "Service",
            key: "",
        },
        {
            label: "Product",
            key: "product",
        },
    ];

    const OrderList = lazy(() =>
        import("@/components/order").then((module) => ({
            default: module.OrderList,
        })),
    );
    const BookingList = lazy(() =>
        import("@/components/order").then((module) => ({
            default: module.BookingList,
        })),
    );

    return (
        <>
            <div className=" w-full pb-6 border-b ">
                <Tabs
                    selectedKey={tab ? tab : ""}
                    aria-label="Tabs"
                    variant={"underlined"}
                    classNames={{
                        tabContent:
                            "group-data-[selected=true]:text-brand group-data-[selected=true]:font-bold text-gray-500 font-medium transition-colors",
                        cursor: "bg-brand",
                    }}
                >
                    {tablink?.map((item) => {
                        return (
                            <Tab
                                key={item?.key}
                                onClick={() => setTab(item?.key)}
                                title={item?.label}
                            />
                        );
                    })}
                </Tabs>
            </div>
            <Suspense
                fallback={<div className="p-4 text-center ">Loading...</div>}
            >
                <div className=" w-full pt-8 flex flex-col ">
                    {!tab && <BookingList />}
                    {tab === "product" && <OrderList />}
                </div>
            </Suspense>
        </>
    );
}
