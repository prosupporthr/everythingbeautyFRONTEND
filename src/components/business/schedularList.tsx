"use client"
import { IBookingDetail } from "@/helper/model/business";
import { timeFormat } from "@/helper/utils/dateFormat";
import { useFetchData } from "@/hooks/useFetchData";
import { userAtom } from "@/store/user";
import { useAtom } from "jotai";
import moment from "moment";
import { useParams, useRouter } from "next/navigation";
import { LoadingLayout } from "../shared";
import { textLimit } from "@/helper/utils/textlimit";


export default function ScheduleList() {

    const param = useParams();
    const id = param.id as string;

    const router = useRouter()
    const [user] = useAtom(userAtom)

    const { data = [], isLoading } = useFetchData<IBookingDetail[]>({
        endpoint: id ? `/booking/business/${id}` : `/booking/user/${user?._id}`, name: ["service"]
    })

    return (
        <LoadingLayout loading={isLoading} length={data?.length} >
            <div className={` w-full overflow-x-auto `}  >
                <div className=" w-fit flex gap-1 items-center " >
                    {data?.map((item, index) => {
                        return (
                            <div onClick={() => router.push(`/myorder/${item?._id}/service`)} key={index} className={` w-[128px] ${new Date() >= new Date(item?.bookingDate) ? " bg-brand text-white border-brand " : " hover:text-brand hover:border-brand "} flex flex-col rounded-2xl h-[128px] border p-2 `} >
                                <div className=" w-full flex flex-col" >
                                    <p className=" text-sm font-medium " >{moment(item?.bookingDate).format("Do, MMM")}</p>
                                    <p className=" text-xs " >{timeFormat(item?.bookingDate)}</p>
                                </div>
                                <p className=" text-xs mt-auto capitalize " >{textLimit(item?.user?.firstName + " " + item?.user?.lastName, 14)}</p>
                            </div>
                        )
                    })}
                </div>
            </div>
        </LoadingLayout>
    )
}