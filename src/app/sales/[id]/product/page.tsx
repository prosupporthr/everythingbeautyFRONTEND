"use client"
import { CustomButton, CustomImage } from "@/components/custom";
import { LoadingLayout, MessageBtn, StarRating } from "@/components/shared";
import { useEffect, useState } from "react";
import { RiAddFill } from "react-icons/ri";
import { useFetchData } from "@/hooks/useFetchData";
import { useParams, useRouter } from "next/navigation";
import { IBusinessDetails, IProductDetail } from "@/helper/model/business";
import { isBusinessOpen } from "@/helper/utils/dateStatus";
import { RxMinus } from "react-icons/rx";
import { formatNumber } from "@/helper/utils/numberFormat";
import { URLS } from "@/helper/services/urls";
import UserCard from "@/components/shared/userCard";
import { IUserDetail } from "@/helper/model/user";
import { IoArrowBackOutline } from "react-icons/io5";
import ReviewSection from "@/components/landing/reviewsection";
import { MapView } from "@/components/map_component";
import { useAtom } from "jotai";
import { userAtom } from "@/store/user";
import { TiTick } from "react-icons/ti";
import useBusiness from "@/hooks/useBusiness";
import { Spinner } from "@heroui/spinner";
import { IoMdHeartEmpty } from "react-icons/io";

export default function SaleProductPage() {

    const param = useParams();
    const id = param.id as string;

    const router = useRouter()

    const [marker, setMarker] = useState({} as google.maps.LatLngLiteral | null)
    const { data, isLoading } = useFetchData<IProductDetail>({
        endpoint: URLS.PRODUCTBYID(id), name: ["product"]
    })

    const { bookmarkMutation } = useBusiness({})
    const [user] = useAtom(userAtom)

    const [status, setStatus] = useState(false)

    const [qty, setQty] = useState(0)
    const [color, setColor] = useState<{
        label: string,
        color: string
    }>({
        label: "",
        color: ""
    })

    const isLightColor = (hex: string) => {
        const c = hex.replace("#", "");
        const r = parseInt(c.substring(0, 2), 16);
        const g = parseInt(c.substring(2, 4), 16);
        const b = parseInt(c.substring(4, 6), 16);

        // Perceived brightness formula
        const brightness = (r * 299 + g * 587 + b * 114) / 1000;
        return brightness > 155;
    };


    useEffect(() => {

        if (data?._id && !isLoading) {
            const isStatus = data?.business?.days && data?.business?.openingTime && data?.business?.closingTime
                ? isBusinessOpen({
                    days: data?.business.days,
                    openingTime: data?.business.openingTime,
                    closingTime: data?.business.closingTime
                })
                : false;
            setStatus(isStatus)
        }

    }, [data, isLoading])

    useEffect(() => {
        setMarker({
            lat: Number(data?.business?.lat ?? 0),
            lng: Number(data?.business?.long ?? 0)
        })

    }, [data, isLoading, setMarker])

    const handleClick = () => {
        router.push(`/sales/${data?.businessId}/order/${id}?qty=${qty}&color=${color?.label}`)
    }

    const CheckOutCard = () => {
        return (
            <div className=" w-full h-fit bg-white lg:w-[413px] rounded-2xl border p-6 flex flex-col gap-4 " >
                <p className=" text-2xl font-bold " >Checkout</p>
                <div className=" w-full flex items-center justify-center gap-4 " >
                    <button disabled={qty === 0} onClick={() => setQty(qty - 1)} className=" w-10 h-10 rounded-full bg-gray-200 flex justify-center items-center " >
                        <RxMinus />
                    </button>
                    {qty}
                    <button onClick={() => setQty(qty + 1)} className=" w-10 h-10 rounded-full bg-gray-200 flex justify-center items-center " >
                        <RiAddFill />
                    </button>
                </div>
                {!data?.colors[0]?.label && (
                    <CustomButton onClick={handleClick} isDisabled={(qty > 0) ? false : true} >Check out</CustomButton>
                )}
                {data?.colors[0]?.label && (
                    <CustomButton onClick={handleClick} isDisabled={(qty > 0 && color.label) ? false : true} >Check out</CustomButton>
                )}
                <div className=" w-full flex justify-center border-b pb-3 font-medium " >
                    You won't be charged yet
                </div>
                <div className=" w-full flex justify-between items-center " >
                    <p className=" text-xl font-medium " >Total</p>
                    <p className=" text-xl font-bold " >{formatNumber(data?.price ?? 0)}</p>
                </div>
            </div>
        )
    }

    return (
        <LoadingLayout loading={isLoading} >
            <div className=" w-full flex flex-col gap-4 lg:py-10 pt-6 lg:p-10  " >
                <div className=" gap-3 items-center lg:flex hidden " >
                    <button onClick={() => router.back()} className=" w-12 h-12 rounded-full flex  border items-center justify-center border-gray-100 text-primary " >
                        <IoArrowBackOutline size={"22px"} />
                    </button>
                    <p className=" text-2xl font-bold capitalize " >Product</p>
                </div>
                <p className=" text-sm font-medium capitalize lg:flex hidden  " >Home • Product • {data?.name}</p>
                <div className=" w-full flex gap-6 lg:flex-row  flex-col-reverse " >
                    <div className=" w-full flex flex-col gap-4 px-4 " >
                        <div className=" w-full h-[350px] lg:flex hidden rounded-2xl bg-gray-300 " >
                            <CustomImage alt={data?.name as string} style={{
                                borderRadius: "16px"
                            }} fillContainer src={data?.pictures[0] as string} />
                        </div>
                        <div className=" pb-4 border-b w-full flex flex-col gap-3 " >
                            <UserCard item={data?.business?.creator as IUserDetail} showDetail />
                            <div className=" pl-10 flex flex-col gap-3 " >
                                {/* <p className=" text-sm " >Norem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputatelibero et velit interdum, ac aliquet odio mattis.</p> */}
                                <div className=" w-full flex gap-2 " >
                                    <CustomButton onClick={() => router.push(`/profile/${data?.business?.creator?._id}`)} variant="outlinebrand" height="40px" >View Profile</CustomButton>
                                    <MessageBtn user={user as IUserDetail} business={data?.business as IBusinessDetails} creator={data?.business?.creator as IUserDetail} />
                                </div>
                            </div>
                        </div>
                        <div className=" w-full lg:hidden flex gap-6 flex-col pb-8" >
                            {marker?.lat && (
                                <div className=" flex flex-col gap-6 w-full " >
                                    <p className=" text-lg lg:text-2xl font-semibold " >Location and surroundings</p>
                                    <MapView hidesearch={true} marker={marker} setMarker={setMarker} outclick={true} height="460px" />
                                </div>
                            )}
                            <ReviewSection />
                        </div>
                    </div>
                    <div className=" lg:w-[80%] w-full flex gap-6 " >
                        <div className=" w-full flex flex-col gap-4 lg:px-0 px-4 " >
                            <div className=" w-full h-[350px] lg:hidden relative rounded-2xl bg-gray-300 " >
                                <button onClick={() => router.back()} className=" w-13 h-13 rounded-lg lg:hidden bg-white flex absolute top-4 left-6  border items-center justify-center z-10  " >
                                    <IoArrowBackOutline size={"24px"} />
                                </button>
                                <CustomImage alt={data?.name as string} style={{
                                    borderRadius: "16px"
                                }} fillContainer src={data?.pictures[0] as string} />
                            </div>
                            <div className=" w-full pb-4 border-b flex justify-between " >
                                <p className=" text-xl font-semibold capitalize max-w-[70%] " >{data?.name}</p>

                                <button onClick={() => bookmarkMutation.mutate({
                                    userId: user?._id as string,
                                    type: "product", 
                                    productId: data?._id
                                })} disabled={bookmarkMutation?.isPending} className=" w-8 h-8 rounded-full flex justify-center items-center border " >
                                    {bookmarkMutation?.isPending ? (
                                        <Spinner size="sm" />
                                    ) : (
                                        <IoMdHeartEmpty size={"16px"} />
                                    )}
                                </button>
                            </div>
                            <div className=" w-full flex gap-3 " >
                                <StarRating />
                                <p className=" font-medium text-sm " >{data?.business?.rating} Ratings • <span className={` ${status ? " text-success-500 " : "text-red-500"}  `} >0 Reviews</span> • <span className=" text-brand " >0 sold</span></p>
                            </div>
                            <p className=" font-semibold text-3xl " >{formatNumber(data?.price ?? 0)}</p>
                            {data?.colors[0]?.label && (
                                <div className=" flex flex-col gap-1 " >
                                    <p className=" font-semibold " >Choose color:</p>
                                    <div className=" w-full flex flex-wrap items-center gap-2 " >
                                        {data?.colors?.map((item) => {

                                            const isSelected = color.color === item?.color;
                                            const tickColor = isLightColor(item?.color) ? "#000" : "#fff";

                                            return (
                                                <button
                                                    onClick={() => setColor(item)}
                                                    style={{ backgroundColor: item?.color }} className={` w-8 h-8 rounded-full flex justify-center items-center text-gray-200 `} >
                                                    {isSelected &&
                                                        <TiTick size={"20px"} color={tickColor} />
                                                    }
                                                </button>
                                            )
                                        })}
                                    </div>
                                </div>
                            )}
                            <div className=" w-full flex flex-col gap-2 " >
                                <p className=" font-semibold " >Details</p>
                                <p className=" text-sm " >{data?.description}</p>
                            </div>
                            {user?._id !== data?.business?.creator?._id && (
                                <div className=" w-full lg:flex hidden " >
                                    <CheckOutCard />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className=" w-full lg:flex hidden gap-6 flex-col pb-8" >
                    {marker?.lat && (
                        <div className=" flex flex-col gap-6 w-full " >
                            <p className=" text-lg lg:text-2xl font-semibold " >Location and surroundings</p>
                            <MapView hidesearch={true} marker={marker} latlng={marker} setMarker={setMarker} outclick={true} height="460px" />
                        </div>
                    )}
                    <ReviewSection />
                </div>
                {user?._id !== data?.business?.creator?._id && (
                    <div className=" lg:hidden p-3 lg:relative sticky bottom-0 inset-x-0 lg:z-0 z-30" >
                        <CheckOutCard />
                    </div>
                )}
            </div>
        </LoadingLayout>
    )
}