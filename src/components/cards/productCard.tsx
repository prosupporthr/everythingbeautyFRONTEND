import { HiStar } from "react-icons/hi2";

export default function ProductCard() {
    return (
        <div className=" w-full flex flex-col gap-3 " >
            <div className=" rounded-tl-2xl w-full h-[266px] bg-amber-400 " >

            </div>
            <div className=" w-full flex justify-between " >
                <div className=" flex flex-col " >
                    <p className=" font-bold " >Niaomi hair Palour </p>
                    <p className=" text-secondary text-sm " >Alanta </p>
                </div>
                <div className=" flex items-center gap-1 " >
                    <HiStar size={"16px"} color="#EFD414" />
                    <p className=" text-[15px] font-bold " >4.0</p>
                </div>
            </div>
        </div>
    )
}