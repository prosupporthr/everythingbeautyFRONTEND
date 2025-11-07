
"use client"
import { RiStarFill } from "react-icons/ri";
import { StarRating } from "../shared";

export default function BusinessServiceCard() {


    const ServiceCard = () => {
        return (
            <div className=" w-full flex flex-col gap-2 py-1 " >
                <div className=" w-full flex font-semibold justify-between text-sm items-center " >
                    <p>Hair breading  55 min</p>
                    <p>$30</p>
                </div>
                <div className=" w-full grid grid-cols-5 gap-3 " >
                    <div className=" w-full border border-brand flex justify-center items-center h-[35px] font-semibold text-brand text-xs rounded-xl" >
                        10:00
                    </div>
                    <div className=" w-full border border-brand flex justify-center items-center h-[35px] font-semibold text-brand text-xs rounded-xl" >
                        10:00
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className=" w-full flex flex-col gap-2 rounded-[10px] pb-4 " >
            <div className=" w-full h-[200px] relative rounded-lg rounded-bl-lg bg-gray-200 " >
                {/* <CustomImage style={{ borderRadius: "8px" }} src={item?.pictures[0]} fillContainer alt={item?.name} />  */}
            </div>
            <div className=" w-full flex border-b flex-col gap-1 px-2 py-2 " >
                <div className=" w-full flex font-bold items-center justify-between " >
                    <p className=" text-lg font-bold capitalize " >Beauty lounge Salon  </p>
                    <p className=" font-bold text-sm " >2.1 KM</p>
                </div>
                <StarRating />
                <p className=" font-medium " >Alanta, USA</p>
            </div>
            <div className=" w-full flex-col flex gap-2 " > 
            <ServiceCard />
            <ServiceCard />
            </div>
        </div>
    )
}