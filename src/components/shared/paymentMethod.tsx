"use client"
import { paymentMethodAtom } from "@/store/paymentmethod";
import { Bank, Card, Icon } from "iconsax-reactjs";
import { useAtom } from "jotai"; 

interface IProps {
    name:  "stripe" | "wallet",
    icon: Icon
}

export default function PaymentMethod() {

    const [type, setType] = useAtom(paymentMethodAtom); 

    const method: Array<IProps> = [
        {
            name: "stripe",
            icon: Card,
        },
        {
            name: "wallet",
            icon: Bank,
        },
    ]; 

    const handleClick = (item: "stripe" | "wallet") => { 
        setType(item)
    }

    return (
        <div className=" w-full flex flex-col gap-4 ">
            <p className=" text-sm ">Select payment method</p>
            <div className=" w-full flex gap-4 ">
                {method.map((item) => {
                    return (
                        <button
                            key={item?.name}
                            onClick={() => handleClick(item?.name)}
                            className={` w-[148px] h-[90px] rounded-[10px] p-3 ${type === item?.name ? "bg-[#D2B0FF33] text-brand " : ""} flex flex-col border `}
                        >
                            <div className=" w-full flex justify-between ">
                                <item.icon size="32" />
                                <div
                                    className={` w-4 h-4 rounded-full border ${type === item?.name ? "border-brand" : ""}  p-[2px] `}
                                >
                                    <div
                                        className={` ${type === item?.name ? "bg-brand" : ""} w-full h-full rounded-full `}
                                    />
                                </div>
                            </div>
                            <p className=" text-sm capitalize font-semibold text-left mt-auto ">
                                {item?.name}
                            </p>
                        </button>
                    );
                })} 
            </div>
        </div>
    );
}
