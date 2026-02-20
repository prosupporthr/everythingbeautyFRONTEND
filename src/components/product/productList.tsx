"use client"
import { IProductDetail } from "@/helper/model/business"
import { useFetchData } from "@/hooks/useFetchData"
import { ProductCard } from "../cards"
import { LoadingLayout } from "../shared"
import { useRouter } from "next/navigation"

export default function ProductList(
    { title, businessId }: { title: string, businessId?: string }
) {

    const router = useRouter()

    const { data = [], isLoading } = useFetchData<IProductDetail[]>({
        endpoint: businessId ? `/product/business/${businessId}` :`/product/filter`, name: ["product"], params: {
            limit: 4
        }
    })

    return (
        <div className=" w-full flex flex-col gap-6 " >
            <div className=" w-full flex justify-between items-center " >
                <p className=" text-lg lg:text-2xl font-semibold " >{title}</p>
                <button onClick={()=> router.push("/productlist")} className=" text-brand font-bold " >See all</button>
            </div>
            <LoadingLayout loading={isLoading} lenght={data?.length} >
                <div className=" w-full grid lg:grid-cols-4 gap-4 " >
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