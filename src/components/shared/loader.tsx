"use client";

import { Spinner } from "@heroui/react";
import { ReactNode } from "react";

interface LoaderProps {
    loading: boolean;
    children: ReactNode;
}

export default function Loader({ loading, children }: LoaderProps) {
    return (
        <>
            {/* Wrapped content */}
            {/* {!loading && ( */}
                <>
                    {children}
                </>
            {/* )} */}
 
            {/* Overlay when loading */}
            {loading && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/70 backdrop-blur-sm z-[1000000]">
                    <Spinner size="lg" color="primary" />
                </div>
            )}
        </>
    );
}
