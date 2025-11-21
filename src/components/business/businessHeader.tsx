"use client"
import { CustomButton, CustomSearch } from "@/components/custom";
import { userAtom } from "@/store/user";
import { useAtom } from "jotai";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { IoMdAdd } from "react-icons/io";

export default function BusinessHeader() {

    const query = useSearchParams();
    const tab = query?.get("tab");
    const router = useRouter()
    const param = useParams();
    const id = param.id;

    const [user] = useAtom(userAtom)

    const handleClick = () => {
        if (tab === "services") {
            router.push(`/business/${id}/create/services`)
        } else if (tab === "store") {
            router.push(`/business/${id}/create/product`)
        }
    }

    return (
        <div className=" w-full flex lg:flex-row flex-col h-fit lg:gap-0 gap-3 py-6 justify-between lg:items-center " >
            <div className=" flex items-center gap-3 " >
                <p className=" text-2xl font-medium capitalize " >{tab === "store" ? "My Store" : tab ? tab : `Welcome, ${user?.firstName + " " + user?.lastName}`}</p>
            </div>
            <div className=" flex items-center gap-3 " >
                {(tab === "services" || tab === "store") && (
                    <div className=" w-fit lg:ml-0 ml-auto " >
                        <CustomButton onClick={handleClick} height="40px" className=" w-[150px] " startIcon={<IoMdAdd color="white" size={"18px"} />} >
                            Add {tab === "services" ? "Services" : "Products"}
                        </CustomButton>
                    </div>
                )}
            </div>
        </div>
    )
}