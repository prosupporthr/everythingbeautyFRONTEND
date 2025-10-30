import { CustomImage } from "../custom";


export default function AuthHeader() {
    return (
        <div className=" w-full lg:w-[423px] lg:h-[291px] rounded-2xl flex justify-center items-center flex-col bg-white " >
            <div className=" lg:w-[80%] flex flex-col lg:items-start items-center gap-4 " >
                <CustomImage src={"/images/logo.png"} width={82} height={38} alt="auth" />
                <div className=" flex flex-col max-w-[261px] lg:text-left text-center gap-0.5 lg:items-start items-center " >
                    <p className=" text-2xl font-bold " >Book Styles with Ease</p>
                    <p className=" text-sm leading-[16px] " >Seamlessly schedule appointments with just a few taps.</p>
                </div>
            </div>
        </div>
    )
}