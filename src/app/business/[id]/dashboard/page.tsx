"use client"
import { useSearchParams } from "next/navigation";
import { lazy, Suspense } from "react";

// Lazy load tab components
const BusinessServices = lazy(() => import("@/components/business").then(module => ({ default: module.BusinessServices })));
const BusinessProduct = lazy(() => import("@/components/business").then(module => ({ default: module.BusinessProduct })));
const BusinessOverview = lazy(() => import("@/components/business").then(module => ({ default: module.BusinessOverview })));
const DashboardProfile = lazy(() => import("@/components/business").then(module => ({ default: module.DashboardProfile })));

export default function BusinessDashboardPage() {

    const query = useSearchParams();
    const tab = query?.get("tab");

    return (
        <Suspense fallback={<div className=" py-4 lg:p-4 text-center ">Loading...</div>}>
            <div className=" flex flex-col w-full pr-[100px]  " >
                {!tab && (
                    <BusinessOverview />
                )}
                {tab === "services" && (
                    <BusinessServices />
                )}
                {tab === "store" && (
                    <BusinessProduct />
                )}
                {tab === "profile" && (
                    <DashboardProfile />
                )}
            </div>
        </Suspense>
    )
}