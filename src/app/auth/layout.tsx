import { CustomImage } from "@/components/custom";
import { AuthHeader } from "@/components/shared";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className=" w-full h-screen flex  bg-white " >
            <div className=" w-full h-screen lg:flex hidden relative " >
                <CustomImage src={"/images/auth.png"} fillContainer alt="auth" />
                <div className=" bg-[#00000066] !z-20 absolute inset-0 flex justify-center items-center " >
                    <AuthHeader />
                </div>
            </div>
            <div className=" w-full h-screen flex flex-col justify-center items-center lg:px-6 px-4 " >
                <div className=" w-full lg:w-fit items-center rounded-2xl lg:shadow-none shadow-sm p-4 flex-col flex gap-6 " >
                    <div className=" lg:hidden " >
                        <AuthHeader />
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
}
