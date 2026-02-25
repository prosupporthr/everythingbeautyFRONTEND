import { IBusinessDetails } from "@/helper/model/business";
import { BiSolidCheckShield } from "react-icons/bi";
import { TbRosetteDiscountCheckFilled } from "react-icons/tb";

export default function Verified({ item }: { item: IBusinessDetails }) {
    return (
        <>
            {item?.licenseStatus === "LICENSED" && (
                <div
                    className="absolute top-3 right-3 z-50
                flex items-center justify-center
                w-8 h-8 rounded-full
                bg-gradient-to-br from-[#B983FF] via-[#9747FF] to-[#6E2BFF]
                shadow-lg shadow-[#9747FF]/40
                text-[#F3E8FF]
                transition-transform duration-200 hover:scale-120"
                >
                    <TbRosetteDiscountCheckFilled className="w-5 h-5 drop-shadow-sm" />
                </div>
            )}
        </>
    );
}
