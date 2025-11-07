"use client"
import { BusinessServiceCard } from "@/components/cards";
import { LoadingLayout } from "@/components/shared";
import { IServiceDetail } from "@/helper/model/business";
import { useFetchData } from "@/hooks/useFetchData";
import { useParams } from "next/navigation";


export default function Services() {

    const param = useParams();
    const id = param.id; 

    const { data, isLoading } = useFetchData<IServiceDetail[]>({
        endpoint: `/service/business/${id}`, name: "service"
    })

    return (
        <LoadingLayout loading={isLoading} lenght={data?.length} >
            <div className=" w-full grid grid-cols-4 gap-4 " >
                {data?.map((item) => {
                    return (
                        <BusinessServiceCard item={item} key={item?._id} />
                    )
                })}
            </div>
        </LoadingLayout>
    )
}