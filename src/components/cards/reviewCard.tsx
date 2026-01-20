import { IRating, IRatingDetails } from "@/helper/model/business";
import { dateFormatMonthAndYear } from "@/helper/utils/dateFormat";
import { HiStar } from "react-icons/hi2";
import { UserCard } from "../shared";

export default function ReviewCard(
    props : IRatingDetails 
) {

    const {
        business,
        rating,
        description,
        user
    } = props

    return (
        <div className=" w-fit " > 
            <div style={{ boxShadow: "0px 20px 70px 0px #C2C2C21A" }} className=" w-[365px] h-[430px] flex flex-col gap-3 px-6 py-12 justify-center rounded-xl border border-[#EAEBEDCC] bg-[#F2F2F299]  " >
                <div className=" flex items-center gap-3 " >
                    <HiStar size={"16px"} className={` ${rating >= 1 ? " text-amber-400 " : " text-gray-300 "} `} />
                    <HiStar size={"16px"}  className={` ${rating >= 2 ? " text-amber-400 " : " text-gray-300 "} `} />
                    <HiStar size={"16px"}  className={` ${rating >= 3 ? " text-amber-400 " : " text-gray-300 "} `} />
                    <HiStar size={"16px"}  className={` ${rating >= 4 ? " text-amber-400 " : " text-gray-300 "} `} />
                    <HiStar size={"16px"}  className={` ${rating === 5 ? " text-amber-400 " : " text-gray-300 "} `} />
                </div>
                <p className=" text-2xl font-bold max-w-[266px] capitalize " >{business?.name}</p>
                <p className=" text-sm text-secondary capitalize " >{description}</p>
                <div className=" flex gap-3 items-center mt-auto " >
                    <UserCard item={user} showDetail size="lg" /> 
                </div>
            </div>
        </div>
    )
}