"use client";
import { useSearchParams } from "next/navigation";
import { lazy, Suspense } from "react";

// Lazy load tab components
const ProfilePage = lazy(() =>
    import("@/components/user").then((module) => ({
        default: module.ProfilePage,
    })),
);

// Lazy load tab components
const MyOrderPage = lazy(() =>
    import("@/components/user").then((module) => ({
        default: module.MyorderPage,
    })),
);


const BusinessProduct = lazy(() =>
    import("@/components/business").then((module) => ({
        default: module.BusinessProduct,
    })),
);  
const BookmarkList = lazy(() =>
    import("@/components/user").then((module) => ({
        default: module.BookmarkList,
    })),
);
const BusinessPost = lazy(() =>
    import("@/components/business").then((module) => ({
        default: module.BusinessPost,
    })),
);

export default function BusinessDashboardPage() {
    const query = useSearchParams();
    const tab = query?.get("tab");

    return (
        <Suspense
            fallback={
                <div className=" py-4 lg:p-4 text-center ">Loading...</div>
            }
        >
            <div className=" flex flex-col w-full lg:pr-[100px]  ">
                {!tab && <MyOrderPage />} 
                {tab === "post" && <BusinessPost />} 
                {tab === "favourite" && <BookmarkList />}
                {tab === "profile" && <ProfilePage dashboard />}
            </div>
        </Suspense>
    );
}
