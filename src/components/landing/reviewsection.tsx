"use client"
import { useFetchData } from "@/hooks/useFetchData";
import { ReviewCard } from "../cards";
import { IRatingDetails } from "@/helper/model/business";
import { URLS } from "@/helper/services/urls";
import { LoadingLayout } from "../shared";
import { useEffect, useState } from "react";

export default function ReviewSection(
    {
        businessId
    }: {
        businessId?: string
    }
) {


    const [ review, setReview ] = useState<IRatingDetails[]>([])

    const { data = [], isLoading } = useFetchData<IRatingDetails[]>({
        endpoint: !businessId ? URLS.REVIEW : URLS.REVIEWBYBUSINESSID(businessId as string), name: ["reviewbusiness"], enable: businessId ? true : false
    }) 

    useEffect(()=> {
        if(data[0]?._id){
            setReview(data)
        }
    }, [data])
 
    return (
        <div className=" w-full flex flex-col gap-3 " >
            <p className=" text-xl lg:text-3xl font-bold " >Reviews</p>
            <LoadingLayout loading={isLoading} length={data?.length} >
                <div className=" w-full overflow-x-auto " >
                    <div className=" w-auto flex gap-4 " >
                        {review?.map((item, index) => {
                            return (
                                <div key={index} >
                                    <ReviewCard {...item} />
                                </div>
                            )
                        })}
                    </div>
                </div>
            </LoadingLayout>
        </div>
    )
}