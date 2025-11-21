"use client"
import { useFetchData } from "@/hooks/useFetchData";
import { OrderCard } from "../cards";
import { useAtom } from "jotai";
import { userAtom } from "@/store/user";
import { LoadingLayout } from "../shared";
import { IOrderDetail } from "@/helper/model/business";

export default function OrderList(
    {id} : { id?: string }
) {

    const [user] = useAtom(userAtom)

    const { data = [], isLoading } = useFetchData<IOrderDetail[]>({
        endpoint: id ? `/order/business/${id}` : `/order/user/${user?._id}`, name: ["order", user?._id as string]
    }) 

    return (
        <LoadingLayout loading={isLoading} lenght={data?.length} >
            <div className=" w-full grid lg:grid-cols-4 gap-4 " >
                {data?.map((item) => {
                    return (
                        <OrderCard item={item} />
                    )
                })}
            </div>
        </LoadingLayout>
    )
}