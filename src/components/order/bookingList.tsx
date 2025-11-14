import { useFetchData } from "@/hooks/useFetchData";
import { userAtom } from "@/store/user";
import { useAtom } from "jotai";
import { BusinessBookingCard } from "../cards";
import { LoadingLayout } from "../shared";
import { IBookingDetail } from "@/helper/model/business";


export default function BookingListPage(
    { id } : { id?: string }
) {

    const [user] = useAtom(userAtom)

    const { data = [], isLoading } = useFetchData<IBookingDetail[]>({
        endpoint: id ? `/booking/business/${id}` :`/booking/user/${user?._id}`, name: ["service"]
    })

    return (
        <LoadingLayout loading={isLoading} >
            <div className=" w-full grid grid-cols-4 gap-4 " >
                {data?.map((item) => {
                    return (
                        <BusinessBookingCard key={item?._id} item={item} admin={false} />
                    )
                })}
            </div>
        </LoadingLayout>
    )
}