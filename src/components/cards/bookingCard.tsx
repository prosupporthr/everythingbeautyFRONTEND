
export default function BookingCard() {

    let status = "PENDING"

    return (
        <div className=" w-full border rounded-2xl p-4 gap-3 flex flex-col " >
            <div className=" w-full h-[266px] rounded-2xl bg-gray-300 " />
            <div className=" w-full flex flex-col " >
                <div className=" flex justify-between items-center " >
                    <p className=" font-bold " >Hair Comb</p>
                    <div className=" text-sm flex items-center gap-2 " >
                        <p>4.0</p>
                    </div>
                </div>
                <p className=" font-bold " >$25</p>
                <div className=" pt-2 mt-2 border-t w-full flex justify-between items-center " >
                    <p className=" text-sm font-medium " >Order On 20-09</p>
                    <div className={` px-[10px] h-[27px] flex justify-center items-center rounded-full text-white ${status === "PENDIND" ? " bg-[#FF9500] " : " bg-[#14AE5C] "} `} >
                        <p className=" text-xs font-semibold " >{status === "PENDIND" ? "ONGOING" : "COMPLETED"}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}