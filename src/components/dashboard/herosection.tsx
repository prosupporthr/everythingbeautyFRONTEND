
export default function HeroSection() {
    return (
        <div className=" w-full h-screen flex flex-col justify-center pt-[93px] items-center relative " >
            <p className=" max-w-[781px] text-center font-bold text-[65px] text-white z-20 leading-[70px] " >Your Hair. Your Style. Your Map to the Perfect Stylist.</p>
            <div className=" absolute bottom-0 top-[93px] inset-x-0 z-0  " >
                <img src="/images/herobg.png" alt="bg" className=" w-full h-full object-cover " />
            </div>
            <div  style={{background: "linear-gradient(0deg, rgba(151, 71, 255, 0.05), rgba(151, 71, 255, 0.05)),linear-gradient(0deg, rgba(0, 0, 0, 0.15), rgba(0, 0, 0, 0.15))"}} className=" absolute inset-0 z-10 " />
        </div>
    )
}