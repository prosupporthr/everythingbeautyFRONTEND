import { CustomButton } from "@/components/custom";
import { Switch } from "@heroui/switch";

export default function Settings() {
    function CustomSwitch({
        title,
        description,
    }: {
        title: string;
        description: string;
    }) {
        return (
            <div className=" w-full flex items-center justify-between gap-6 ">
                <div className=" max-w-[275px] flex flex-col gap-2 ">
                    <p className=" font-medium ">{title}</p>
                    <p className=" text-xs text-secondary ">{description}</p>
                </div>
                <Switch />
            </div>
        );
    }

    return (
        <div className=" w-full lg:flex-row flex-col flex gap-6 ">
            <div className=" w-full flex flex-col gap-6 shadow py-8 px-6 rounded-2xl ">
                <div className=" w-full flex flex-col gap-2 ">
                    <p className=" font-bold text-2xl ">My notifications</p>
                    <p className=" text-sm text-secondary ">
                        We will send you updates about your appointments, news
                        and offers.
                    </p>
                </div>
                <div className=" w-full flex flex-col gap-3 ">
                    <CustomSwitch
                        title="Text message Booking notifications"
                        description="Receive texts based on your sender's settings"
                    />
                    <CustomSwitch
                        title="Email marketing notifications"
                        description="Receive offers and news via email"
                    />
                    <CustomSwitch
                        title="Text message marketing notifications"
                        description="If you opted out previously by texting STOP, please reply with START to opt back in"
                    />
                </div>
                <div className=" max-w-[350px] mt-4 ">
                    <CustomButton variant="customDanger">
                        Cancel Subscription
                    </CustomButton>
                </div>
            </div>
            <div className=" w-full h-fit flex flex-col gap-6 shadow py-8 px-6 rounded-2xl ">
                <div className=" flex flex-col ">
                    <p className=" font-semibold ">My social logins</p>
                    <p className=" text-secondary text-sm ">
                        Link social profiles for easier access to your account.
                    </p>
                </div>
                <div className=" flex items-center gap-5 " >
                    <div className=" w-8 h-8 rounded-lg bg-blue-600 " />
                    <p className=" font-semibold text-sm " >Connect</p>
                </div>
                <div className=" flex items-center gap-5 " >
                    <div className=" w-8 h-8 rounded-lg bg-blue-600 " />
                    <p className=" font-semibold text-sm " >Connect</p>
                </div>
            </div>
        </div>
    );
}
