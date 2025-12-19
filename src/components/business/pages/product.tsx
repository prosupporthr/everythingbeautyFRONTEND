"use client"
import { BusinessProductCard } from "@/components/cards";
import { LoadingLayout } from "@/components/shared";
import { IProductDetail } from "@/helper/model/business";
import { useFetchData } from "@/hooks/useFetchData";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";


export default function Product( 
    { isProfile, businessId } : { isProfile?: boolean, businessId?: string }
) {

    const param = useParams();
    const id = param.id; 

    const [ productData, setProductData ] = useState<IProductDetail[]>([])

    const { data, isLoading } = useFetchData<IProductDetail[]>({
        endpoint: `/product/business/${businessId ?? id}`, name: ["product"],
        enable: !isProfile ? true : businessId ? true : false
    }) 

    useEffect(() => {
        if(data) {
            setProductData(data)
        }
    }, [data, isLoading]) 

    return (
        <LoadingLayout loading={isLoading} lenght={productData?.length} >
            <div className=" w-full grid lg:grid-cols-4 gap-4 " >
                {productData?.map((item) => {
                    return (
                        <BusinessProductCard  isProfile={isProfile} item={item} key={item?._id} />
                    )
                })}
            </div>
        </LoadingLayout>
    )
}