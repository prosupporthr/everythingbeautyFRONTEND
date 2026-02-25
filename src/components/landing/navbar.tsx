"use client";
import { Popover, PopoverTrigger, PopoverContent } from "@heroui/popover";
import { CustomImage, CustomButton } from "../custom";
import { RxHamburgerMenu } from "react-icons/rx";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { menulist } from "@/helper/services/databank";
import { textLimit } from "@/helper/utils/textlimit";
import { IoChevronDown } from "react-icons/io5";
import UserCard from "../shared/userCard";
import { useUserStore } from "@/hooks/user";
import { userAtom } from "@/store/user";
import { useQueryClient } from "@tanstack/react-query";
import useRating from "@/hooks/useRating";
import { Notification, RatingBusinessModal } from "../modals";
import { useFetchData } from "@/hooks/useFetchData";
import { IRating } from "@/helper/model/business";
import { URLS } from "@/helper/services/urls";
import { IUserDetail } from "@/helper/model/user";
import { RiNotification2Fill } from "react-icons/ri";
import { Spinner } from "@heroui/spinner";

export default function Navbar() {
    const router = useRouter();
    const pathname = usePathname();
    const param = useParams();
    const id = param.id;
    const [show, setShow] = useState(false);
    const queryClient = useQueryClient();

    const [showNotification, setShowNotification] = useState(false);
    const [isRead, setIsRead] = useState(true);

    const showreview =
        typeof window !== "undefined" ? sessionStorage.getItem("show") : null;

    const { data, isLoading, refetch } = useUserStore();

    const [user, setUser] = useAtom(userAtom);

    const { data: review = [] } = useFetchData<IRating[]>({
        endpoint: URLS.REVIEWBYUSERID(user?._id as string),
        name: ["review"],
        enable: user?._id ? true : false,
    });

    const { formik, isLoading: loading, isOpen, setIsOpen, tab } = useRating();

    useEffect(() => {
        if (data?._id) {
            setUser(data);
        } else if (
            data === null &&
            (!pathname.includes("sale") || !pathname.includes("profile"))
        ) {
            router.push("/");
        }
    }, [data, isLoading]);

    const handleClick = (item: "dashboard" | "logout") => {
        if (item === "dashboard") {
            router.push(
                user?._id
                    ? `/business/${user?.business?._id}/dashboard`
                    : "/business",
            );
        } else if (item === "logout") {
            localStorage.clear();
            refetch();
            router.push("/");
            setUser(null);
            queryClient.invalidateQueries({ queryKey: ["user"] });
        }
        setShow(false);
    };

    const HandleRouter = (item: string) => {
        router.push(item);
        setShow(false);
    };

    useEffect(() => {
        if (
            review[0]?.business?._id &&
            user?._id &&
            !showreview &&
            pathname === "/"
        ) {
            formik.setFieldValue("businessId", review[0]?.business?._id);
            formik.setFieldValue("userId", user?._id);

            setIsOpen(true);
            sessionStorage.setItem("show", "true");
        }
    }, [review]);

    return (
        <div
            className={` w-full h-fit ${pathname === "/" ? " !sticky " : " !sticky "} z-50 top-0 inset-x-0 `}
        >
            <div
                className={` w-full ${pathname?.includes("auth") || pathname?.includes(`business/${id}/create`) || pathname?.includes(`business/${id}/edit`) ? "hidden" : pathname?.includes(`/sales/${id}/services`) || pathname?.includes(`/sales/${id}/product`) ? " lg:flex hidden " : "flex"} h-[93px] bg-white shadow px-6 justify-between items-center `}
            >
                <button onClick={() => router.push("/")}>
                    <CustomImage
                        nopopup
                        src={"/images/logo.png"}
                        alt="logo"
                        width={92}
                        height={43}
                    />
                </button>
                {isLoading && (
                    <div className=" flex h-full justify-center items-center ">
                        <Spinner size="sm" />
                    </div>
                )}
                {!isLoading && (
                    <div className=" flex gap-3 items-center ">
                        {user?.business === null && (
                            <div className=" w-[120px] ">
                                <CustomButton
                                    onClick={() => router.push("/business")}
                                    fullWidth
                                    variant="outlinebrand"
                                    fontSize="12px"
                                    height="45px"
                                    className=" text-primary lg:flex hidden "
                                >
                                    Create Business
                                </CustomButton>
                            </div>
                        )}

                        {user?._id && (
                            <button
                                className=" relative  "
                                onClick={() => setShowNotification(true)}
                            >
                                <div className={` ${!isRead ? " rotate-15" : ""} `}>
                                    <RiNotification2Fill size={"25px"} />
                                </div>
                                {!isRead && (
                                    <div className=" absolute top-0 right-0 bg-brand w-3 h-3 rounded-full " />
                                )}
                            </button>
                        )}

                        <Popover
                            isOpen={show}
                            onOpenChange={setShow}
                            showArrow
                            backdrop={"opaque"}
                            offset={10}
                            placement="top"
                        >
                            <PopoverTrigger>
                                <div
                                    className={` z-50 bg-white h-[45px] text-xs ${user?._id ? " px-2 " : " px-5 "} rounded-[14px] lg:rounded-full flex items-center justify-center border border-[#E8E7ED] hover:bg-white text-primary cursor-pointer `}
                                >
                                    {user?._id && (
                                        <div className=" flex items-center gap-3 ">
                                            <UserCard
                                                size="sm"
                                                item={data as IUserDetail}
                                            />
                                            <IoChevronDown size={"17px"} />
                                        </div>
                                    )}
                                    {!user?._id && (
                                        <div className=" flex items-center gap-2 ">
                                            <p className=" lg:flex hidden ">
                                                Menu
                                            </p>
                                            <RxHamburgerMenu size={"20px"} />
                                        </div>
                                    )}
                                </div>
                            </PopoverTrigger>

                            <PopoverContent className="w-[227px]">
                                {!user?._id && (
                                    <div className=" w-full flex flex-col gap-1 ">
                                        <div className=" py-3 border-b border-[#E7E7E7] flex flex-col gap-2 ">
                                            <CustomButton
                                                onClick={() =>
                                                    HandleRouter("/auth/signup")
                                                }
                                                height="40px"
                                            >
                                                Sign up
                                            </CustomButton>
                                            <CustomButton
                                                onClick={() =>
                                                    HandleRouter("/auth")
                                                }
                                                variant="outline"
                                                height="40px"
                                            >
                                                Log in
                                            </CustomButton>
                                        </div>
                                        <div className=" py-1 border-b border-[#E7E7E7] flex flex-col gap-2 ">
                                            <button className=" h-[40px] flex w-full justify-center items-center text-sm font-medium ">
                                                FAQs
                                            </button>
                                        </div>
                                        <div className=" py-1 border-b border-[#E7E7E7] flex flex-col gap-2 ">
                                            <button
                                                onClick={() =>
                                                    HandleRouter("/business")
                                                }
                                                className=" h-[40px] flex w-full justify-center items-center text-sm font-medium "
                                            >
                                                Join as a stylist
                                            </button>
                                        </div>
                                        <div className=" py-1 border-b border-[#E7E7E7] flex flex-col gap-2 ">
                                            <button className=" h-[40px] flex w-full justify-center items-center text-sm font-medium ">
                                                Market Place
                                            </button>
                                        </div>
                                        <div className=" py-1 flex flex-col gap-2 ">
                                            <button className=" h-[40px] flex w-full justify-center items-center text-sm font-medium ">
                                                Help and Support
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {user?._id && (
                                    <div className=" w-full flex flex-col gap-1 ">
                                        <div className=" py-2 border-b border-[#E7E7E7] flex flex-col gap-2 ">
                                            <button className=" h-[40px] flex w-full justify-center items-center text-xl font-bold capitalize ">
                                                {textLimit(
                                                    user?.firstName +
                                                        " " +
                                                        user?.lastName,
                                                    20,
                                                )}
                                            </button>
                                        </div>
                                        <div className=" py-1 border-b border-[#E7E7E7] flex flex-col gap-2 px-6 ">
                                            {menulist.map((item, index) => {
                                                if (item?.title === "Logout") {
                                                    return (
                                                        <button
                                                            onClick={() =>
                                                                handleClick(
                                                                    "logout",
                                                                )
                                                            }
                                                            key={index}
                                                            className=" h-[40px] flex w-full gap-2 items-center text-sm font-medium "
                                                        >
                                                            <div className=" w-5 h-5  rounded-md ">
                                                                <item.icon
                                                                    size={
                                                                        "20px"
                                                                    }
                                                                />
                                                            </div>
                                                            {item?.title}
                                                        </button>
                                                    );
                                                } else {
                                                    return (
                                                        <button
                                                            onClick={() =>
                                                                HandleRouter(
                                                                    item?.title ===
                                                                        "My Profile"
                                                                        ? item?.link +
                                                                              "/" +
                                                                              user?._id
                                                                        : item?.link,
                                                                )
                                                            }
                                                            key={index}
                                                            className=" h-[40px] flex w-full gap-2 items-center text-sm font-medium "
                                                        >
                                                            <div className=" w-5 h-5  rounded-md ">
                                                                <item.icon
                                                                    size={
                                                                        "20px"
                                                                    }
                                                                />
                                                            </div>
                                                            {item?.title}
                                                        </button>
                                                    );
                                                }
                                            })}
                                            <button className=" h-[40px] flex w-full gap-2 items-center text-sm font-medium ">
                                                FAQs
                                            </button>
                                        </div>
                                        {user?.business?._id && (
                                            <div className=" py-1 border-b border-[#E7E7E7] flex flex-col gap-2 ">
                                                <button
                                                    onClick={() =>
                                                        handleClick("dashboard")
                                                    }
                                                    className=" h-[40px] flex w-full justify-center items-center text-sm font-medium "
                                                >
                                                    {user?._id
                                                        ? "Dashboard"
                                                        : "Join as a stylist"}
                                                </button>
                                            </div>
                                        )}
                                        <div className=" py-1 flex flex-col gap-2 ">
                                            <button className=" h-[40px] flex w-full justify-center items-center text-sm font-medium ">
                                                Help and Support
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </PopoverContent>
                        </Popover>
                    </div>
                )}
            </div>
            <RatingBusinessModal
                tab={tab}
                open={isOpen}
                setOpen={setIsOpen}
                data={review[0]?.business}
                formik={formik}
                loading={loading}
            />

            <Notification
                isOpen={showNotification}
                onClose={setShowNotification}
                isRead={isRead}
                setIsRead={setIsRead}
            />
        </div>
    );
}
