import { BusinessBottomNav, BusinessHeader } from "@/components/business";


export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {


    return (
        <div className=" w-full flex-1 relative flex flex-col py-6 px-4 lg:px-8 items-center  " >
            <div className=" max-w-[1329px] w-full h-full flex flex-col gap-4 " >
                <BusinessHeader />
                <div className=" w-full h-auto lg:pb-0 pb-20 " >
                    {children}
                </div>
                <BusinessBottomNav />
            </div>
        </div>
    );
}
