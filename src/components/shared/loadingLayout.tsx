"use client";

import { Spinner } from "@heroui/react";
import React, { ReactNode, forwardRef } from "react";
import { CgFileDocument } from "react-icons/cg";

interface LoaderProps {
    loading: boolean;
    children: ReactNode;
    length?: number;
    refetching?: boolean;
}

const LoadingLayout = forwardRef<HTMLDivElement, LoaderProps>(
    ({ loading, children, length = 1, refetching }, ref) => {
        return (
            <>
                {!loading && length > 0 && (
                    < >
                        {children}

                        {/* Only render observer div if ref exists */}
                        {ref && <div ref={ref} />}

                        {refetching && (
                            <div className="w-full flex items-center justify-center">
                                <Spinner size="sm" color="primary" />
                            </div>
                        )}
                    </>
                )}

                {!loading && length === 0 && (
                    <div className="w-full flex flex-col justify-center items-center py-7">
                        <CgFileDocument size="30px" />
                        <p className="text-sm font-semibold">No activity</p>
                    </div>
                )}

                {loading && (
                    <div className="py-8 flex items-center w-full justify-center bg-white/70 backdrop-blur-sm z-10">
                        <Spinner size="lg" color="primary" />
                    </div>
                )}
            </>
        );
    },
);

LoadingLayout.displayName = "LoadingLayout";

export default LoadingLayout;
