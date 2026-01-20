"use client"
import { SalesServiceCard } from "@/components/cards";
import { MapView } from "@/components/map_component";
import { LoadingLayout } from "@/components/shared";
import { IBusinessDetails, IServiceDetail } from "@/helper/model/business";
import { IPagination } from "@/helper/model/pagination";
import { useFetchData } from "@/hooks/useFetchData";
import { useState } from "react";


export default function BusinessListPage() {


    const [marker, setMarker] = useState({} as google.maps.LatLngLiteral | null)
    const { data, isLoading } = useFetchData<IPagination<IBusinessDetails>>({
        endpoint: `/business/filter`, name: ["business"], pagination: true
    })

    return (
        <LoadingLayout loading={isLoading} lenght={data?.data?.length} >
            <div className=" w-full flex gap-6 " >
                <div className=" w-fit flex flex-col p-6 gap-6 h-[80vh] overflow-y-auto " >
                    <div className=" w-full flex items-center " >
                        <p className=" text-sm font-medium text-secondary " >total number of business is {data?.total}</p>
                    </div>
                    <div className=" w-[400px] flex flex-col gap-6 pl-4 " >
                        {data?.data?.map((item) => {
                            return (
                                <SalesServiceCard location={marker} setLocation={setMarker} item={item} key={item?._id} />
                            )
                        })}
                    </div>
                </div>
                <div className=" flex flex-1 h-[80vh] p-4 justify-center items-center " >
                    <MapView hidesearch={true} marker={marker} setMarker={setMarker} outclick={true} height="75vh" />
                </div>
            </div>
        </LoadingLayout>
    )
}