"use client";

import { ProductCard } from "@/components/cards";
import { CustomInput } from "@/components/custom";
import { LoadingLayout } from "@/components/shared";
import { IProductDetail } from "@/helper/model/business";
import { URLS } from "@/helper/services/urls";
import { useInfiniteScroller } from "@/hooks/useCustomGetScroller";
import { useEffect, useState } from "react";
import { RiCloseLine, RiSearch2Line } from "react-icons/ri";

export default function BusinessListPage() {
    const [showSearch, setShowSearch] = useState(false);
    const [search, setSearch] = useState("");

    const {
        items = [],
        ref,
        isLoading,
        isFetchingMore,
    } = useInfiniteScroller<IProductDetail>({
        queryKeyBase: "productfilter",
        endpoint: URLS.PRODUCTFILTER,
        limit: 10,
        params: { q: search },
    });

    useEffect(() => {
        if (!showSearch) setSearch("");
    }, [showSearch]);

    return (
        <div className="w-full flex gap-6 pt-1">
            <div className="w-full flex flex-col pb-6 gap-6 h-full overflow-y-auto">
                {/* Header */}
                <div className="w-full bg-white px-6">
                    {/* Mobile collapsed header */}
                    {!showSearch && (
                        <div className="lg:hidden flex w-full h-[72px] justify-between items-center border-b">
                            <p className="text-xl font-medium">Product</p>
                            <button onClick={() => setShowSearch(true)}>
                                <RiSearch2Line size={21} />
                            </button>
                        </div>
                    )}

                    {/* Search bar */}
                    <div
                        className={`${
                            showSearch ? "flex" : "hidden lg:flex"
                        } w-full h-[72px] justify-between items-center gap-2 border-b`}
                    >
                        <p className="text-xl font-medium hidden lg:block">
                            Product
                        </p>

                        <div className="w-full max-w-[400px]">
                            <CustomInput
                                startContent={<RiSearch2Line size={20} />}
                                type="search"
                                placeholder="Search for Product..."
                                notform
                                localValue={search}
                                setLocalValue={setSearch}
                                name={"search"}
                            />
                        </div>

                        <button
                            className="lg:hidden"
                            onClick={() => setShowSearch(false)}
                        >
                            <RiCloseLine size={20} />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <LoadingLayout
                    loading={isLoading}
                    refetching={isFetchingMore}
                    length={items.length}
                    ref={ref}
                >
                    <div className="w-full grid lg:grid-cols-3 gap-6 px-6">
                        {items.map((item, index) => {
                            return <ProductCard key={index} item={item} />;
                        })}
                    </div>
                </LoadingLayout>
            </div>
        </div>
    );
}
