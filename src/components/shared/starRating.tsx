import { HiStar } from "react-icons/hi2";
import { RiStarFill } from "react-icons/ri";

interface IProps {
    rating: number;
    other?: boolean
}

export default function StarRating(
    {
        rating,
        other
    }: IProps
) {
    return (
        <>
            {!other && (
                <div className=" flex items-center gap-1 " >
                    <HiStar size={"16px"} color="#EFD414" />
                    <p className=" text-[12px] font-bold " >{rating?.toFixed(1)}</p>
                </div>
            )}
            {other && (
                <div className=" flex items-center gap-3 " >
                    <p className=" text-sm " >4.8</p>
                    <div className=" flex gap-1 " >
                        <RiStarFill size={"15px"} color="#EFD414" />
                        <RiStarFill size={"15px"} color="#EFD414" />
                        <RiStarFill size={"15px"} color="#EFD414" />
                        <RiStarFill size={"15px"} color="#EFD414" />
                        <RiStarFill size={"15px"} color="#EFD414" />
                    </div>
                </div>
            )}
        </>
    )
}