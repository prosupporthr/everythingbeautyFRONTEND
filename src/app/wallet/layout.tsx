import { WalletCard, WalletHeader } from "@/components/wallet";

export default function SettingsLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className=" w-full min-h-[50vh] bg-[#F9F9F9] lg:p-8 ">
            <div className=" w-full flex h-full flex-col rounded-lg bg-white ">
                <WalletHeader />
                <div className=" w-full p-4 lg:p-6 h-full ">
                    <WalletCard>{children}</WalletCard>
                </div>
            </div>
        </div>
    );
}
