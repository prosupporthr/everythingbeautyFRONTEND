"use client"
import { CustomButton, CustomSearch } from "@/components/custom";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { IoMdAdd } from "react-icons/io";

export default function BusinessHeader() {

    const query = useSearchParams();
    const tab = query?.get("tab");
    const router = useRouter()
    const param = useParams();
    const id = param.id; 

    const handleClick = () => {
        if (tab === "services") {
            router.push(`/business/${id}/create/services`)
        } else if (tab === "store") {
            router.push(`/business/${id}/create/product`)
        }
    }

    return (
        <div className=" w-full flex h-fit py-6 justify-between items-center " >
            <div className=" flex items-center gap-3 " >
                <p className=" text-2xl font-medium capitalize " >{tab === "store" ? "My Store" : tab ? tab : "Welcome, Shield"}</p>
                {/* {(tab === "services" || tab === "store") && (
                    <div className=" w-[41px] h-[34px] rounded-3xl bg-[#E9F4FC] flex justify-center items-center " >
                        <p className=" text-sm text-brand " >4</p>
                    </div>
                )} */}
            </div>
            <div className=" flex items-center gap-3 " >
                {/* {(tab === "services" || tab === "store") && (
                    <CustomSearch />
                )} */}
                <div className=" w-fit " > 
                <CustomButton onClick={handleClick} height="40px" className=" w-[150px] " startIcon={<IoMdAdd color="white" size={"18px"} />} >
                    Add {tab === "services" ? "Services" : "Products"}
                </CustomButton>
                </div>
            </div>
        </div>
    )
}