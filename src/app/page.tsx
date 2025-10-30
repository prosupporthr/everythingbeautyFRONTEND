import { Aboutsection, Navbar, Productsection, Reviewsection } from "@/components/dashboard";
import HeroSection from "@/components/dashboard/herosection"; 

export default function Home() {
  return (
    <div className=" w-full flex flex-col pb-10 gap-10 h-full ">
      <div className=" w-full flex flex-col " >
        <HeroSection />
      </div>
      <div className=" w-full flex flex-col items-center px-8 " >
        <div className=" w-full max-w-[1276px] flex flex-col gap-10 " >
          <Productsection />
          <Aboutsection />
          <Reviewsection />
        </div>
      </div> 
    </div>
  );
}
