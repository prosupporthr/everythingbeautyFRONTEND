import { CustomImage } from "@/components/custom";

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
                    <div className=" w-[423px] h-[291px] rounded-2xl flex justify-center items-center flex-col bg-white " >
                        <div className=" w-[80%] flex flex-col gap-4 " >
                            <CustomImage src={"/images/logo.png"} width={82} height={38} alt="auth" />
                            <div className=" flex flex-col gap-0.5 " >
                                <p className=" text-2xl font-bold " >Book Styles with Ease</p>
                                <p className=" text-sm leading-[16px] " >Seamlessly schedule appointments with just a few taps.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className=" w-full h-screen flex justify-center items-center " >
                {children}
            </div>
        </div>
    );
}
