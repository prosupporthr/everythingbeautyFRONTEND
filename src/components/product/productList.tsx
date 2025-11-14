"use client"
import { IProductDetail } from "@/helper/model/business"
import { useFetchData } from "@/hooks/useFetchData"
import { ProductCard } from "../cards"
import { LoadingLayout } from "../shared"

export default function ProductList(
    { title }: { title: string }
) {

    const { data, isLoading } = useFetchData<IProductDetail[]>({
        endpoint: `/product/filter`, name: ["product"]
    })

    console.log(data) 

    return (
        <div className=" w-full flex flex-col gap-6 " >
            <div className=" w-full flex justify-between items-center " >
                <p className=" text-2xl font-semibold " >{title}</p>
                <p className=" text-brand font-bold " >See all</p>
            </div>
            <LoadingLayout loading={isLoading} >
                <div className=" w-full grid grid-cols-4 gap-4 " >
                    {data?.map((item) => {
                        return (
                            <ProductCard item={item} key={item._id} />
                        )
                    })}
                </div>
            </LoadingLayout>
        </div>
    )
}