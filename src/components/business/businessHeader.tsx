"use client";
import { CustomButton } from "@/components/custom";
import { userAtom } from "@/store/user";
import { useAtom } from "jotai";
import {
    useParams,
    usePathname,
    useRouter,
    useSearchParams,
} from "next/navigation";
import { IoMdAdd } from "react-icons/io";

export default function BusinessHeader() {
    const query = useSearchParams();
    const tab = query?.get("tab");
    const router = useRouter();
    const param = useParams();
    const id = param.id;

    const pathname = usePathname();

    const [user] = useAtom(userAtom);

    const handleClick = () => {
        if (tab === "services") {
            router.push(`/business/${id}/create/services`);
        } else if (tab === "store") {
            router.push(`/business/${id}/create/product`);
        } else if (tab === "post") {
            if (!pathname.includes("business")) {
                router.push(`/dashboard/post/create`);
            } else {
                router.push(`/business/${id}/create/post`);
            }
        } else {
            router.push(`/business/${id}/edit`);
        }
    };

    return (
        <div
            className={` ${tab === "profile" ? "hidden" : " flex "} w-full  lg:flex-row flex-col h-fit lg:gap-0 gap-3 py-6 justify-between lg:items-center `}
        >
            <div className=" flex items-center gap-3 ">
                <p className=" text-2xl font-semibold capitalize ">
                    {tab === "store"
                        ? "My Store"
                        : tab
                          ? tab
                          : `Welcome, ${(user?.firstName ?? "") + " " + (user?.lastName ?? "")}`}
                </p>
            </div>
            <div className=" flex items-center gap-3 lg:mr-20 ">
                {(!tab || tab === "staff") && pathname.includes("business") && (
                    <div className=" w-fit text-xs font-semibold ">
                        <button
                            onClick={() =>
                                router.push(`/business/${id}/dashboard`)
                            }
                            className={` ${!tab ? " bg-[#EADFF8] " : ""} w-[100px] h-[40px] rounded-l-full text-brand shadow `}
                        >
                            Appointment
                        </button>
                        <button
                            onClick={() =>
                                router.push(
                                    `/business/${id}/dashboard?tab=staff`,
                                )
                            }
                            className={` ${tab === "appointment" ? " bg-[#EADFF8] " : ""}  w-[100px] h-[40px] rounded-r-full text-brand shadow `}
                        >
                            My Staff
                        </button>
                    </div>
                )}
                {(tab === "services" || tab === "store" || tab === "post") && (
                    <div className=" w-fit lg:ml-0 ml-auto ">
                        <CustomButton
                            onClick={handleClick}
                            height="40px"
                            className=" w-[150px] "
                            startIcon={<IoMdAdd color="white" size={"18px"} />}
                        >
                            {tab === "services"
                                ? "Add Services"
                                : tab === "store"
                                  ? "Add Products"
                                  : tab === "post"
                                    ? "Add Post"
                                    : "Edit Business"}
                        </CustomButton>
                    </div>
                )}
            </div>
        </div>
    );
}
