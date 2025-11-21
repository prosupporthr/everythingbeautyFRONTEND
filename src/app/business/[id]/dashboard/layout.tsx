import { BusinessHeader } from "@/components/business";


export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className=" w-full flex-1 relative flex flex-col py-6 px-6 lg:px-8 items-center  " >
            <div className=" max-w-[1329px] w-full h-full flex flex-col gap-4 " >
                <BusinessHeader />
                <div className=" w-full h-auto " >
                    {children}
                </div>
            </div>
        </div>
    );
}
