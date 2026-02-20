"use client"
import { IBusinessDetails } from "@/helper/model/business"
import { useFetchData } from "@/hooks/useFetchData"
import { BusinessCard } from "../cards"
import { LoadingLayout } from "../shared"
import { useRouter } from "next/navigation"
import { URLS } from "@/helper/services/urls"

export default function BusinessList(
    { title }: { title: string }
) {

    const router = useRouter()
    const { data = [], isLoading } = useFetchData<IBusinessDetails[]>({
        endpoint: URLS.BUSINESSFILTER, name: ["business"],
        params: {
            limit: 4
        }
    })  

    return (
        <div className=" w-full flex flex-col gap-6 " >
            <div className=" w-full flex justify-between items-center " >
                <p className=" text-lg lg:text-2xl font-semibold " >{title}</p>
                <button onClick={()=> router.push("/businesslist")} className=" text-brand font-bold " >See all</button>
            </div>
            <LoadingLayout loading={isLoading} length={data?.length} >
                <div className=" w-full grid lg:grid-cols-4 gap-4 " >
                    {data?.map((item) => {
                        return (
                            <BusinessCard item={item} key={item._id} />
                        )
                    })}
                </div>
            </LoadingLayout>
        </div>
    )
}