import { useFetchData } from "@/hooks/useFetchData";
import { ModalLayout } from "../custom";
import { useAtom } from "jotai";
import { userAtom } from "@/store/user";
import { INotification } from "@/helper/model/notification";
import { LoadingLayout } from "../shared";
import { dateFormat } from "@/helper/utils/dateFormat";

export default function Notification({
    isOpen,
    onClose,
}: {
    isOpen: boolean;
    onClose: (by: boolean) => void;
}) {
    const [user] = useAtom(userAtom);

    const { data = [], isLoading } = useFetchData<INotification[]>({
        endpoint: `/notifications/user/${user?._id}`,
        name: ["notification", user?._id as string],
        enable: user?._id ? true : false,
    });

    return (
        <ModalLayout
            isOpen={isOpen}
            size={"full"}
            onClose={() => onClose(false)}
        >
            <div className=" w-full h-full relative ">
                <div className=" w-full h-[80px] top-0 sticky px-6 border-b border-bordercolor flex items-center ">
                    <p className=" text-2xl font-bold ">Notification</p>
                </div>
                <div className=" w-full h-full flex justify-center py-10 ">
                    <LoadingLayout loading={isLoading} lenght={data?.length}>
                        {data?.map((item) => {
                            return (
                                <div
                                    key={item?._id}
                                    className=" max-w-[740px] h-fit relative flex gap-4 p-6 rounded-2xl w-full border-bordercolor border-b "
                                >
                                    <div className=" w-fit ">
                                        <div className=" w-[42px] h-[42px] rounded-full bg-amber-300 " />
                                    </div>
                                    <div className=" flex flex-col ">
                                        <p className=" text-lg font-semibold ">
                                            {item?.title}
                                        </p>
                                        <p className=" text-sm text-[#444444] -mt-1 ">
                                            {item?.description}
                                        </p>
                                        <p className=" text-xs mt-2 text-[#747474] ">
                                            {dateFormat(item?.createdAt)}
                                        </p>
                                    </div>
                                    {!item?.isRead && (
                                        <div className=" w-2 h-2 rounded-full bg-brand absolute top-4 right-4 " />
                                    )}
                                </div>
                            );
                        })}
                    </LoadingLayout>
                </div>
            </div>
        </ModalLayout>
    );
}
