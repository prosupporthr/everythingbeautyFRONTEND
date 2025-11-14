"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useParams, usePathname, useRouter, useSearchParams } from "next/navigation";

export default function BusinessSidebar() {
    const router = useRouter();
    const query = useSearchParams();
    const tab = query?.get("tab");
    const pathname = usePathname();
    const param = useParams();
    const id = param.id;

    const visible = pathname?.includes(`business/${id}/dashboard`);

    const tabs = [
        { label: "Overview", value: null },
        // { label: "Calendar", value: "calendar" },
        { label: "Services", value: "services" },
        { label: "My Store", value: "store" },
        { label: "Settings", value: "settings" },
        { label: "Profile", value: "profile" },
    ];

    const handleClick = (value: string | null) => {
        if (!value) router.push(`/business/${id}/dashboard`);
        else router.push(`/business/${id}/dashboard?tab=${value}`);
    };

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    initial={{ x: 100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: 100, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 120, damping: 18 }}
                    className="fixed z-10 right-0 top-1/2 -translate-y-1/2 w-[100px] flex justify-center items-center"
                >
                    <div
                        style={{ boxShadow: "0px 4px 8px 3px #0000000F" }}
                        className="w-full flex flex-col bg-white border border-[#E7E7E7] rounded-l-2xl"
                    >
                        {tabs.map(({ label, value }) => {
                            const isActive = tab === value || (!tab && value === null);

                            return (
                                <button
                                    key={label}
                                    onClick={() => handleClick(value)}
                                    className={`w-full h-[70px] cursor-pointer ${label === "Profile" ? "" : "border-b"} border-[#E7E7E7] flex flex-col justify-center items-center gap-1`}
                                >
                                    <p
                                        className={`text-sm font-semibold ${isActive ? "text-brand" : ""}`}
                                    >
                                        {label}
                                    </p>
                                    {isActive && (
                                        <div className="h-[2px] w-[30px] rounded-[1px] bg-brand" />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
