"use client"
import { IBusinessDetails } from "@/helper/model/business"
import { useFetchData } from "@/hooks/useFetchData"
import { BusinessCard } from "../cards"
import { LoadingLayout } from "../shared"
import { useRouter } from "next/navigation"

export default function BusinessList(
    { title }: { title: string }
) {

    const router = useRouter()
    const { data, isLoading } = useFetchData<IBusinessDetails[]>({
        endpoint: `/business/filter`, name: ["business"]
    }) 

    return (
        <div className=" w-full flex flex-col gap-6 " >
            <div className=" w-full flex justify-between items-center " >
                <p className=" text-2xl font-semibold " >{title}</p>
                <button onClick={()=> router.push("/businesslist")} className=" text-brand font-bold " >See all</button>
            </div>
            <LoadingLayout loading={isLoading} lenght={data?.length} >
                <div className=" w-full grid grid-cols-4 gap-4 " >
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