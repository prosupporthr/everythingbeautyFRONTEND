import { addToast } from "@heroui/toast";
import { HiOutlineShare } from "react-icons/hi2";

export default function ShareBtn({
    type,
    id,
}: {
    type: "product" | "services";
    id: string;
}) {
    const copyItem = () => {
        navigator.clipboard.writeText(
            `https://everythingbeauty-frontend.vercel.app/sales/${id}/${type}/opengraph`,
        );
        addToast({
            title: "copied successful",
            color: "success",
        });
    };

    return (
        <div className=" w-fit ">
            <button
                onClick={copyItem}
                className=" w-8 h-8 rounded-full flex justify-center items-center border "
            >
                <HiOutlineShare />
            </button>
        </div>
    );
}
