"use client"
import { SalesServiceCard } from "@/components/cards";
import { IBusinessDetails, IServiceDetail } from "@/helper/model/business";
import { useFetchData } from "@/hooks/useFetchData";


export default function BusinessSalesPage() {


    const { data = [], isLoading: loading } = useFetchData<IBusinessDetails[]>({
        endpoint: `/business`, name: ["business"]
    })

    console.log(data);
    

    return (
        <div className=" w-full flex gap-6 " >
            <div className=" w-fit flex flex-col p-6 gap-6  h-[80vh] overflow-y-auto " >
                <div className=" w-full flex items-center " >
                    <p className=" text-sm font-medium text-secondary " >41 venues within map area</p>
                </div>
                <div className=" w-[400px] flex flex-col gap-4 " >
                    {data?.map((item) => {
                        return(
                            <SalesServiceCard item={item} key={item?._id} /> 
                        )
                    })}
                </div>
            </div>
            <div className=" flex flex-1 h-[80vh] " >
                
            </div>
        </div>
    )
}