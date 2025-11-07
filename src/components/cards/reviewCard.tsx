import { HiStar } from "react-icons/hi2";

export default function ReviewCard() {
    return (
        <div className=" w-fit " > 
            <div style={{ boxShadow: "0px 20px 70px 0px #C2C2C21A" }} className=" w-[365px] h-[430px] flex flex-col gap-3 px-6 justify-center rounded-xl border border-[#EAEBEDCC] bg-[#F2F2F299]  " >
                <div className=" flex items-center gap-3 " >
                    <HiStar size={"16px"} color="#EFD414" />
                    <HiStar size={"16px"} color="#EFD414" />
                    <HiStar size={"16px"} color="#EFD414" />
                    <HiStar size={"16px"} color="#EFD414" />
                    <HiStar size={"16px"} color="#EFD414" />
                </div>
                <p className=" text-2xl font-bold max-w-[266px] " >{`Exceptional service. Can't be faulted ”`}</p>
                <p className=" text-sm text-secondary " >Norem ipsum dolor sit amet, consectetur adipiscing elit.Nunc vulputatelibero et velit interdum, ac aliquet odio mattis.Class aptent taciti sociosquad litora torquent per</p>
                <div className=" flex gap-3 items-center mt-10 " >
                    <div className=" w-14 h-14 rounded-full bg-amber-400 " >

                    </div>
                    <div className=" flex flex-col " >
                        <p className=" text-xl font-bold " >Kristie</p>
                        <p className=" text-sm text-secondary " >Jun 2022</p>
                    </div>
                </div>
            </div>
        </div>
    )
}