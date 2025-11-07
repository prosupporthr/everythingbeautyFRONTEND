import { RiStarFill } from "react-icons/ri";

export default function StarRating() {
    return ( 
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
    )
}