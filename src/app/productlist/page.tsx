"use client";
import { ProductCard } from "@/components/cards";
import { CustomInput, CustomSelect } from "@/components/custom";
import { LoadingLayout } from "@/components/shared";
import { IProductDetail, ITransaction } from "@/helper/model/business";
import { IPagination } from "@/helper/model/pagination";
import { URLS } from "@/helper/services/urls";
import { paginationLimit } from "@/helper/utils/databank";
import { useInfiniteScroller } from "@/hooks/useCustomGetScroller";
import { useFetchData } from "@/hooks/useFetchData";
import { Pagination } from "@heroui/react";
import { useEffect, useState } from "react";
import { RiCloseLine, RiSearch2Line } from "react-icons/ri";

export default function BusinessListPage() {
    const [show, setShow] = useState(false);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState<number>(1);
    const [limit, setLimit] = useState<string>("20");
    const [dataInfo, setDataInfo] = useState<IProductDetail[]>([]);

    // const { data, isLoading } = useFetchData<IPagination<IProductDetail>>({
    //     endpoint: URLS.PRODUCTFILTER,
    //     name: ["productfilter"],
    //     pagination: true,
    //     params: {
    //         q: search,
    //         limit: Number(limit),
    //         page: page,
    //     },
    // });

    const { items, ref, isLoading, isFetchingMore } = useInfiniteScroller<IProductDetail>({
        queryKeyBase: "productfilter",
        endpoint: URLS.PRODUCTFILTER,
        limit: 10,
        params: {
            q: search, 
        },
    });

    useEffect(() => {
        if (!show) {
            setSearch("");
        }
    }, [show]);

    return (
        <div className=" w-full flex gap-6 pt-1  ">
            <div className=" w-full flex flex-col pb-6 gap-6 h-full overflow-y-auto ">
                <div className=" w-full h-fit bg-white top-0 px-6 ">
                    <div
                        className={` ${!show ? " lg:hidden flex " : " hidden "}  w-full h-[72px] justify-between border-b items-center bg-white `}
                    >
                        <p className=" text-xl font-medium ">Product</p>
                        <div className=" flex gap-3 items-center ">
                            <button onClick={() => setShow(true)}>
                                <RiSearch2Line size={"21px"} />
                            </button>
                            {/* <button>
                                <RiFilter2Line size={"21px"} />
                            </button> */}
                        </div>
                    </div>
                    <div
                        className={` ${show ? " flex " : " lg:flex hidden "} w-full h-[72px] justify-between items-center gap-2 bg-white border-b `}
                    >
                        <p className=" text-xl font-medium lg:block hidden ">
                            Product
                        </p>
                        <div className=" w-full max-w-[400px] ">
                            <CustomInput
                                startContent={<RiSearch2Line size={"20px"} />}
                                type="search"
                                placeholder="Search for Product..."
                                name=""
                                notform
                                localValue={search}
                                setLocalValue={setSearch}
                            />
                        </div>
                        <button
                            className=" lg:hidden flex "
                            onClick={() => setShow(false)}
                        >
                            <RiCloseLine size={"20px"} />
                        </button>
                    </div>
                </div>
                <LoadingLayout loading={isLoading} refetching={isFetchingMore} lenght={items?.length}>
                    <div className=" w-full grid lg:grid-cols-3 gap-6 px-6 ">
                        {items?.map((item, index) => {
                            if (items.length === index + 1) {
                                return (
                                    <div ref={ref} key={item._id}>
                                        <ProductCard
                                            item={item} 
                                        />
                                    </div>
                                );
                            } else {
                                return (
                                    <ProductCard item={item} key={item._id} />
                                );
                            }
                        })}
                    </div>
                </LoadingLayout>
            </div>
        </div>
    );
}
