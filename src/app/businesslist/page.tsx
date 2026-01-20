"use client"
import { SalesServiceCard } from "@/components/cards";
import { CustomInput } from "@/components/custom";
import { MapView } from "@/components/map_component";
import { LoadingLayout } from "@/components/shared";
import { IBusinessDetails, IServiceDetail } from "@/helper/model/business";
import { IPagination } from "@/helper/model/pagination";
import { URLS } from "@/helper/services/urls";
import { useFetchData } from "@/hooks/useFetchData";
import { userAtom } from "@/store/user";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { RiCloseLine, RiSearch2Line } from "react-icons/ri";


export default function BusinessListPage() {

    const [show, setShow] = useState(false)
    const [search, setSearch] = useState("")

    const [marker, setMarker] = useState({} as google.maps.LatLngLiteral | null)
    const { data, isLoading } = useFetchData<IPagination<IBusinessDetails>>({
        endpoint: URLS.BUSINESSFILTER, name: ["business"], pagination: true,
        params: {
            q: search
        }
    })

    return (
        <div className=" w-full flex gap-6 pt-1  " >
            <div className=" w-full lg:w-fit flex flex-col pb-6 gap-6 h-[80vh] overflow-y-auto " >
                <div className=" lg:w-[400px] w-full h-fit sticky bg-white z-50 top-0 px-6 " >
                    {!show && (
                        <div className=" w-full h-[72px] flex justify-between border-b items-center bg-white" >
                            <p className=" text-xl font-medium " >Business</p>
                            <div className=" flex gap-3 items-center " >
                                <button onClick={() => setShow(true)} >
                                    <RiSearch2Line size={"21px"} />
                                </button>
                                {/* <button>
                                <RiFilter2Line size={"21px"} />
                            </button> */}
                            </div>
                        </div>
                    )}
                    {show && (
                        <div className=" w-full h-[72px] flex items-center gap-2 bg-white border-b " >
                            <CustomInput startContent={<RiSearch2Line size={"20px"} />} type="search" name="" notform localValue={search} setLocalValue={setSearch} />
                            <button onClick={() => setShow(false)} >
                                <RiCloseLine size={"20px"} />
                            </button>
                        </div>
                    )}
                </div>
                <LoadingLayout loading={isLoading} lenght={data?.data?.length} >
                    <div className=" w-full lg:w-[400px] flex flex-col gap-6 lg:px-6 " >
                        {data?.data?.map((item) => {
                            return (
                                <SalesServiceCard location={marker} setLocation={setMarker} item={item} key={item?._id} />
                            )
                        })}
                    </div>
                </LoadingLayout> 
            </div>
            <div className=" hidden lg:flex flex-1 h-[80vh] p-4 justify-center items-center " >
                <MapView hidesearch={true} marker={marker} setMarker={setMarker} outclick={true} height="75vh" />
            </div>
        </div>
    )
}