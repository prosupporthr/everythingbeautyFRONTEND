"use client"
import { BusinessProductCard } from "@/components/cards";
import { LoadingLayout } from "@/components/shared";
import { IProductDetail } from "@/helper/model/business";
import { useFetchData } from "@/hooks/useFetchData";
import { useParams } from "next/navigation";


export default function Product() {

    const param = useParams();
    const id = param.id; 

    const { data, isLoading } = useFetchData<IProductDetail[]>({
        endpoint: `/product/business/${id}`, name: ["product"]
    }) 

    return (
        <LoadingLayout loading={isLoading} lenght={data?.length} >
            <div className=" w-full grid lg:grid-cols-4 gap-4 " >
                {data?.map((item) => {
                    return (
                        <BusinessProductCard item={item} key={item?._id} />
                    )
                })}
            </div>
        </LoadingLayout>
    )
}