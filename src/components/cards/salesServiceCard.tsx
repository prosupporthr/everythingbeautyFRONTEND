
"use client" 
import { IBusinessDetails } from "@/helper/model/business";
import { StarRating } from "../shared";
import { CustomImage } from "../custom";
import { useRouter } from "next/navigation";
import { textLimit } from "@/helper/utils/textlimit";

export default function BusinessServiceCard(
    { item, setLocation} : { item: IBusinessDetails, setLocation?: (location: google.maps.LatLngLiteral | null) => void, location?: google.maps.LatLngLiteral | null }
) {

    const router = useRouter()

    const ServiceCard = () => {
        return (
            <div className=" w-full flex flex-col gap-2 py-1 " >
                <div className=" w-full flex font-semibold justify-between text-sm items-center " >
                    <p>Hair breading  55 min</p>
                    <p>$30</p>
                </div>
                <div className=" w-full grid grid-cols-5 gap-3 " >
                    <div className=" w-full border border-brand flex justify-center items-center h-[35px] font-semibold text-brand text-xs rounded-xl" >
                        {item?.openingTime}
                    </div>
                    <div className=" w-full border border-brand flex justify-center items-center h-[35px] font-semibold text-brand text-xs rounded-xl" >
                        {item?.closingTime}
                    </div>
                </div>
            </div>
        )
    }

    // const handleClick = (e: React.MouseEvent<HTMLParagraphElement>) => { 

    //     if (setLocation) {
    //         setLocation({
    //             lat: typeof item?.lat === "string" ? parseFloat(item.lat) : item?.lat ?? 0,
    //             lng: typeof item?.long === "string" ? parseFloat(item.long) : item?.long ?? 0
    //         });
    //         setOpen(true)
    //     }
    // }

    return (
        <div 
            onClick={() => router.push(`/sales/${item?._id}/services`)}
            className={` w-full flex flex-col gap-2 rounded-[10px] shadow p-4`}
        >
            <div className="w-full h-[200px] relative rounded-lg rounded-bl-lg bg-gray-200">
                <CustomImage style={{ borderRadius: "8px" }} src={item?.pictures[0]} fillContainer alt={item?.name} />
            </div>
            <div className="w-full flex border-b flex-col gap-1 px-2 py-2">
                <div className=" w-full flex font-bold items-center justify-between " >
                    <p className=" text-lg font-bold capitalize " >{item?.name}</p>
                    {/* <p className=" font-bold text-sm " >2.1 KM</p> */}
                </div>
                <StarRating rating={item?.rating} />
                <p 
                    // onClick={(e) => handleClick(e)} 
                    className=" font-medium text-brand cursor-pointer " >{textLimit(item?.location, 20)}</p>
            </div>
            <div className=" w-full flex-col flex gap-2 " > 
            <ServiceCard />
            <ServiceCard />
            </div>
        </div>
    )
}