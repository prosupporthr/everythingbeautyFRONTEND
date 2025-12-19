"use client";

import { Spinner } from "@heroui/react";
import { ReactNode } from "react";
import { CgFileDocument } from "react-icons/cg";

interface LoaderProps {
    loading: boolean;
    children: ReactNode;
    lenght?: number
}

export default function LoadingLayout({ loading, children, lenght = 1 }: LoaderProps) {
    return (
        <>
            {/* Wrapped content */}
            {(!loading && lenght > 0) && (
                <>
                    {children}
                </>
            )}

            {(!loading && lenght === 0) && (
                <div className=" w-full flex flex-col justify-center items-center py-7 " >
                    <CgFileDocument size={"30px"} />
                    <p className=" text-sm font-semibold " >No activity</p>
                </div>
            )}
 
            {/* Overlay when loading */}
            {loading && (
                <div className=" py-8 flex items-center w-full justify-center bg-white/70 backdrop-blur-sm z-10">
                    <Spinner size="lg" color="primary" />
                </div>
            )}
        </>
    );
}
