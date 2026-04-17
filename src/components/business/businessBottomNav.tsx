"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useParams, usePathname, useRouter, useSearchParams } from "next/navigation";
import {
    Home,
    Briefcase,
    Shop,
    User,
} from "iconsax-reactjs";

export default function BusinessBottomNav() {
    const router = useRouter();
    const query = useSearchParams();
    const tab = query?.get("tab");
    const pathname = usePathname();
    const param = useParams();
    const id = param.id;

    const visible = pathname?.includes(`business/${id}/dashboard`);

    const tabs = [
        { label: "Overview", value: null, icon: Home },
        { label: "Services", value: "services", icon: Briefcase },
        { label: "Store", value: "store", icon: Shop },
        { label: "Profile", value: "profile", icon: User },
    ];

    const handleClick = (value: string | null) => {
        if (!value) router.push(`/business/${id}/dashboard`);
        else router.push(`/business/${id}/dashboard?tab=${value}`);
    };

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 120, damping: 18 }}
                    className="fixed bottom-0 left-0 right-0 z-20 lg:hidden"
                >
                    <div className="mx-3 mb-3 rounded-2xl bg-white/90 backdrop-blur-md border border-[#E7E7E7] shadow-md flex justify-between items-center px-2 py-2">
                        {tabs.map(({ label, value, icon: Icon }) => {
                            const isActive = tab === value || (!tab && value === null);

                            return (
                                <button
                                    key={label}
                                    onClick={() => handleClick(value)}
                                    className="relative flex flex-col items-center justify-center flex-1 py-2"
                                >
                                    <motion.div
                                        animate={{
                                            scale: isActive ? 1.2 : 1,
                                            y: isActive ? -4 : 0,
                                        }}
                                        transition={{ type: "spring", stiffness: 300 }}
                                    >
                                        <Icon
                                            size={22}
                                            variant={isActive ? "Bold" : "Linear"}
                                            color={isActive ? "#7C3AED" : "#6B7280"} // adjust to your brand color
                                        />
                                    </motion.div>

                                    <span
                                        className={`text-xs mt-1 ${
                                            isActive
                                                ? "text-brand font-semibold"
                                                : "text-gray-500"
                                        }`}
                                    >
                                        {label}
                                    </span>

                                    {isActive && (
                                        <motion.div
                                            layoutId="active-pill"
                                            className="absolute bottom-1 h-[3px] w-6 rounded-full bg-brand"
                                        />
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