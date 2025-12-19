"use client"
import { BusinessServiceCard } from "@/components/cards";
import { LoadingLayout } from "@/components/shared";
import { IServiceDetail } from "@/helper/model/business";
import { useFetchData } from "@/hooks/useFetchData";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";


export default function Services(
    { isProfile, businessId } : { isProfile?: boolean, businessId?: string }
) {

    const param = useParams();
    const id = param.id; 

    const [ serviceData, setServiceData ] = useState<IServiceDetail[]>([])

    const { data, isLoading } = useFetchData<IServiceDetail[]>({
        endpoint: `/service/business/${businessId ?? id}`, name: ["service"],
        enable: !isProfile ? true : businessId ? true : false
    })

    useEffect(() => {
        if(data) {
            setServiceData(data)
        }
    }, [data, isLoading]) 
    
    return (
        <LoadingLayout loading={isLoading} lenght={serviceData?.length} >
            <div className=" w-full grid lg:grid-cols-4 gap-4 " >
                {serviceData?.map((item) => {
                    return (
                        <BusinessServiceCard item={item} option={isProfile} key={item?._id} />
                    )
                })}
            </div>
        </LoadingLayout>
    )
}