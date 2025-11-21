import { FaAward } from "react-icons/fa6";
import { HiOutlineTag } from "react-icons/hi";
import { HiOutlineUserGroup } from "react-icons/hi2";
import { BsShop } from "react-icons/bs";

export default function AboutSection() {

    const services = [
        {
            name: "Hairstylists",
            icon: HiOutlineTag
        },
        {
            name: "Salon Owners",
            icon: FaAward
        },
        {
            name: "Beauty Product Sellers & Merchants",
            icon: HiOutlineUserGroup
        },
        {
            name: "Buy and sell on Product",
            icon: BsShop
        },
    ]

    return (
        <div className=" w-full flex flex-col gap-6 " >
            <div className=" w-full flex flex-col gap-3 " >
                <p className=" text-xl lg:text-2xl font-bold " >Who can join?</p>
                <p className=" text-secondary text-sm " >Everything Beauty is designed for a diverse range of users in the hair and beauty ecosystem — whether you're a stylist, salon owner, product seller, or just someone looking for the perfect hairstyle.</p>
            </div>
            <div className=" w-full grid lg:grid-cols-4 gap-4 " >
                {services.map((item) => {
                    return (
                        <div key={item?.name} className=" w-full h-[96px] rounded-3xl px-5 flex items-center border gap-4 border-[#EAEBEDCC] shadow " >
                            <div className=" w-fit " >
                                <div className=" w-14 h-14 rounded-full flex items-center justify-center border border-brand text-brand " >
                                    <item.icon size={"23px"} />
                                </div>
                            </div>
                            <p className=" text-secondary font-medium text-sm " >{item?.name}</p>
                        </div>
                    )
                })}
            </div>
            <div className=" w-full flex flex-col gap-3 " >
                <p className=" text-xl lg:text-2xl font-bold " >Why Everything Beauty?</p>
                <span className=" font-bold " >Too many people have dreams, but no clear roadmap to achieve them.</span>
                <p className=" text-secondary text-sm " >
                    Everything Beauty is designed for a diverse range of users in the hair and beauty ecosystem — whether you're a stylist, salon owner, product seller, or just someone looking for the perfect hairstyle.
                </p>
            </div>
        </div>
    )
}