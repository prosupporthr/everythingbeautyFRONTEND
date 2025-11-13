"use client"
import { SalesServiceCard } from "@/components/cards";
import { MapView } from "@/components/map_component";
import { LoadingLayout } from "@/components/shared";
import { IBusinessDetails, IServiceDetail } from "@/helper/model/business";
import { useFetchData } from "@/hooks/useFetchData";
import { useState } from "react";


export default function BusinessListPage() {


    const [marker, setMarker] = useState({} as google.maps.LatLngLiteral | null)
    const { data = [], isLoading } = useFetchData<IBusinessDetails[]>({
        endpoint: `/business`, name: ["business"]
    })

    console.log(marker);


    return (
        <div className=" w-full flex gap-6 " >
            <div className=" w-fit flex flex-col p-6 gap-6 h-[80vh] overflow-y-auto " >
                <div className=" w-full flex items-center " >
                    <p className=" text-sm font-medium text-secondary " >41 venues within map area</p>
                </div>
                <LoadingLayout loading={isLoading} >
                    <div className=" w-[400px] flex flex-col gap-6 pl-4 " >
                        {data?.map((item) => {
                            return (
                                <SalesServiceCard location={marker} setLocation={setMarker} item={item} key={item?._id} />
                            )
                        })}
                    </div>
                </LoadingLayout>
                <div className=" w-full h-10 bg-amber-300 " />
            </div>
            <div className=" flex flex-1 h-[80vh] p-4 justify-center items-center " >
                <MapView hidesearch={true} marker={marker} setMarker={setMarker} outclick={true} height="75vh" />
            </div>
        </div>
    )
}