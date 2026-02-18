import { SettingHeader } from "@/components/settings"; 

export default function SettingsLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return(
        <div className=" w-full min-h-[50vh] bg-[#F9F9F9] lg:p-8 " >
            <div className=" w-full flex h-full flex-col rounded-lg bg-white " >
                <SettingHeader />
                <div className=" px-4 py-6 lg:p-6 h-full min-h-[60vh] " >
                    {children}
                </div>
            </div>
        </div>
    )
}