"use client";
import { useFetchData } from "@/hooks/useFetchData";
import { IBusinessDetails } from "@/helper/model/business";
import { CustomButton, CustomImage } from "../custom";
import { textLimit } from "@/helper/utils/textlimit";
import { ResponsiveCarousel, StarRating, Verified } from "../shared";
import { useAtom } from "jotai";
import { userAtom } from "@/store/user";
import { useRouter } from "next/navigation";
import LandingBusinessCard from "../cards/landingBusinessCard";

export default function HeroSection() {

    const { data, isLoading } = useFetchData<IBusinessDetails[]>({
        endpoint: `/business/filter`,
        name: ["business"],
    });

    const router = useRouter()

    const [user] = useAtom(userAtom);

    // Map data to carousel items
    const items = data?.map((item) => (
        <div key={item?._id} >
            <LandingBusinessCard item={item} />
        </div>
    ));

    return (
        <div
            className=" w-full flex flex-col relative justify-center  items-center "
            style={{ height: "calc(100vh - 93px)" }}
        >
            {!user?._id && (
                <p className=" lg:px-0 px-3 lg:max-w-[781px] text-center font-bold text-[40px] leading-[50px] lg:text-[65px] text-white z-20 lg:leading-[70px] ">
                    Your Hair. Your Style. Your Map to the Perfect Stylist.
                </p>
            )}
            <div className=" absolute top-0 bottom-0 inset-x-0 z-0  ">
                <img
                    src={
                        user?._id
                            ? "/images/secondhero.png"
                            : "/images/herobg.png"
                    }
                    alt="bg"
                    className=" w-full h-full object-cover "
                />
            </div>
            <div
                style={{
                    background:
                        "linear-gradient(0deg, rgba(151, 71, 255, 0.05), rgba(151, 71, 255, 0.05)),linear-gradient(0deg, rgba(0, 0, 0, 0.15), rgba(0, 0, 0, 0.15))",
                }}
                className=" absolute inset-0 z-[2] "
            />
            {user?._id && (
                <div className=" absolute bottom-0 z-[3] inset-x-0 ">
                    {!isLoading && items && items.length > 0 && (
                        <ResponsiveCarousel items={items} />
                    )}
                </div>
            )}
        </div>
    );
}
