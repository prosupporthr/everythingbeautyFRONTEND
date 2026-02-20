"use client"
import { CustomButton, CustomImage } from "@/components/custom"
import { DeleteModal } from "@/components/modals"
import { LoadingLayout } from "@/components/shared"
import { IProductDetail, IServiceDetail } from "@/helper/model/business"
import { formatNumber } from "@/helper/utils/numberFormat"
import useBusiness from "@/hooks/useBusiness"
import { useFetchData } from "@/hooks/useFetchData"
import { userAtom } from "@/store/user"
import { useAtom } from "jotai"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { HiStar } from "react-icons/hi2"

interface IBookmark {
    "_id": string,
    "isDeleted": boolean,
    "userId": string,
    "productId"?: IProductDetail,
    "product"?: IProductDetail,
    "service": IServiceDetail,
    serviceId: IServiceDetail,
    "type": "product" | "service",
    "createdAt": string,
    "updatedAt": string,

}

export default function Bookmark() {

    const [user] = useAtom(userAtom)
    const router = useRouter()
    const [selected, setSelected] = useState<{
        id: string,
        name: string
    }>({
        id: "",
        name: ""
    })
    const [isOpen, setIsOpen] = useState(false)

    const { data, isLoading } = useFetchData<IBookmark[]>({
        endpoint: `/bookmarks/user/${user?._id}`, name: ["bookmarks"],
    })

    const deleteHandler = (name: string, id: string) => {
        setSelected({
            name,
            id
        })
        setIsOpen(true)
    }

    return (
        <div className=" w-full flex-1 relative flex flex-col py-6 px-6 gap-8 lg:px-8 items-center  " >
            <div className=" w-full flex flex-col gap-4 " >
                <div className=" flex flex-col " >
                    <p className=" text-2xl font-medium capitalize " >Favourite</p>
                    <p className=" text-sm " >See all orders  on Everything Beauty</p>
                </div>
            </div>
            <LoadingLayout loading={isLoading} length={data?.length} >
                <div className=" w-full grid grid-cols-1 lg:grid-cols-3 gap-4 " >
                    {data?.map((item) => {
                        return (
                            <>
                                {item?.type === "product" && (
                                    <div className=" w-full flex flex-col p-4 rounded-2xl shadow gap-2 " >
                                        <div className=" w-full flex h-[170px] bg-gray-400 rounded-md " >
                                            <CustomImage alt={(item?.product?.name) as string} style={{
                            borderRadius: "16px"
                        }} fillContainer src={(item?.product?.pictures[0]) as string} />
                                        </div>
                                        <div className=" flex flex-col w-full gap-1 " >
                                            <div className=" w-full flex items-center justify-between " >
                                                <p className=" text-sm font-bold capitalize " >{item?.product?.name}</p>
                                                {item?.product?.allowReview && (
                                                    <div className=" flex items-center gap-1 " >
                                                        <HiStar size={"16px"} color="#EFD414" />
                                                        <p className=" text-[15px] font-bold " >{"0"}</p>
                                                    </div>
                                                )}
                                            </div>
                                            <p className=" text-xs " >{formatNumber(Number(item?.product?.price))}</p>
                                            <p className=" text-xs text-secondary " >{formatNumber(Number(item?.product?.quantity), "")} left</p>
                                        </div>
                                        <div className=" w-full flex flex-col lg:flex-row gap-3 " >
                                            <CustomButton onClick={() => router.push(`/sales/${item?.product?._id}/product`)} height="45px" fullWidth >Buy</CustomButton>
                                            <CustomButton height="45px" onClick={() => deleteHandler(item?.product?.name as string, item?._id)} variant="customDanger" fullWidth >Remove</CustomButton>
                                        </div>
                                    </div>
                                )}

                                {item?.type === "service" && (
                                    <div className=" w-full flex flex-col p-4 rounded-2xl shadow gap-2 " >
                                        <div className=" w-full flex h-[170px] bg-gray-400 rounded-md " >
                                                <CustomImage alt={(item?.service?.name) as string} style={{
                                borderRadius: "16px"
                            }} fillContainer src={(item?.service?.pictures[0]) as string} />
                                        </div>
                                        <div className=" flex flex-col w-full gap-1 " >
                                            <div className=" w-full flex items-center justify-between " >
                                                <p className=" text-sm font-bold capitalize " >{item?.service?.name}</p>
                                                {item?.service?.allowReview && (
                                                    <div className=" flex items-center gap-1 " >
                                                        <HiStar size={"16px"} color="#EFD414" />
                                                        <p className=" text-[15px] font-bold " >{"0"}</p>
                                                    </div>
                                                )}
                                            </div>
                                            <p className=" text-xs " >{formatNumber(Number(item?.service?.hourlyRate))}</p>
                                        </div>
                                        <div className=" w-full flex flex-col lg:flex-row gap-3 mt-auto " >
                                            <CustomButton height="45px" onClick={() => router.push(`/sales/${item?.service?.businessId}/services`)} fullWidth >Buy</CustomButton>
                                            <CustomButton height="45px" onClick={() => deleteHandler(item?.service?.name, item?._id)} variant="customDanger" fullWidth >Remove</CustomButton>
                                        </div>
                                    </div>
                                )}
                            </>
                        )
                    })}

                    <DeleteModal isOpen={isOpen} onClose={setIsOpen} type={"Bookmark"} id={selected?.id as string} name={selected?.name as string} />
                </div>
            </LoadingLayout>
        </div>
    )
}