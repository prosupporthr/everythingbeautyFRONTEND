"use client";
import { SalesServiceCard } from "@/components/cards";
import { CustomInput } from "@/components/custom"; 
import { LoadingLayout } from "@/components/shared";
import { IBusinessDetails } from "@/helper/model/business"; 
import { URLS } from "@/helper/services/urls";
import { useInfiniteScroller } from "@/hooks/useCustomGetScroller"; 
import { useEffect, useState } from "react";
import { RiCloseLine, RiSearch2Line } from "react-icons/ri";

export default function BusinessListPage() {
    const [show, setShow] = useState(false); 
    const [search, setSearch] = useState("");

    const [marker, setMarker] = useState(
        {} as google.maps.LatLngLiteral | null,
    ); 

    const {
        items = [],
        ref,
        isLoading,
        isFetchingMore,
    } = useInfiniteScroller<IBusinessDetails>({
        queryKeyBase: "productfilter",
        endpoint: URLS.BUSINESSFILTER,
        limit: 10,
        params: { q: search },
    });

    useEffect(() => {
        if (!show) setSearch("");
    }, [show]); 

    return (
        <div className=" w-full flex gap-6 pt-1  ">
            <div className=" w-full flex flex-col pb-6 gap-6 h-full overflow-y-auto ">
                <div className=" w-full h-fit bg-white z-50 top-0 px-6 ">
                    <div
                        className={` ${!show ? " lg:hidden flex " : " hidden "}  w-full h-[72px] justify-between border-b items-center bg-white `}
                    >
                        <p className=" text-xl font-medium ">Business</p>
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
                            Business
                        </p>
                        <div className=" w-full max-w-[400px] ">
                            <CustomInput
                                startContent={<RiSearch2Line size={"20px"} />}
                                placeholder="Search for Business..."
                                type="search"
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
                <LoadingLayout loading={isLoading} ref={ref} refetching={isFetchingMore} length={items?.length}>
                    <div className=" w-full grid grid-cols-3 gap-6 lg:px-6 ">
                        {items?.map((item) => {
                            return (
                                <SalesServiceCard
                                    location={marker}
                                    setLocation={setMarker}
                                    item={item}
                                    key={item?._id} 
                                />
                            );
                        })}
                    </div>
                </LoadingLayout>
            </div>
            {/* <ModalLayout
                size="2xl"
                isOpen={open ? false : false}
                onClose={() => setOpen(false)}
            >
                <MapView
                    hidesearch={true}
                    marker={marker}
                    setMarker={setMarker}
                    outclick={true}
                    height="75vh"
                />
            </ModalLayout> */}
        </div>
    );
}
