"use client"
import { useFetchData } from "@/hooks/useFetchData";
import { ReviewCard } from "../cards";
import { IRatingDetails } from "@/helper/model/business";
import { URLS } from "@/helper/services/urls";
import { LoadingLayout } from "../shared";

export default function ReviewSection(
    {
        businessId
    }: {
        businessId?: string
    }
) {

    const { data = [], isLoading } = useFetchData<IRatingDetails[]>({
        endpoint: URLS.REVIEWBYBUSINESSID(businessId as string), name: ["reviewbusiness"], enable: businessId ? true : false
    }) 
 
    return (
        <div className=" w-full flex flex-col gap-3 " >
            <p className=" text-xl lg:text-3xl font-bold " >Reviews</p>
            <LoadingLayout loading={isLoading} length={data?.length} >
                <div className=" w-full overflow-x-auto " >
                    <div className=" w-auto flex gap-4 " >
                        {data?.map((item, index) => {
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