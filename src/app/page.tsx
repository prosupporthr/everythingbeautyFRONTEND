import { Aboutsection, Navbar, Productsection, Reviewsection } from "@/components/landing";
import HeroSection from "@/components/landing/herosection"; 

export default function Home() {
  return (
    <div className=" w-full flex flex-col pb-10 gap-6 lg:gap-10 h-full ">
      <div className=" w-full flex flex-col " >
        <HeroSection />
      </div>
      <div className=" w-full flex flex-col items-center px-6 lg:px-8 " >
        <div className=" w-full flex flex-col  gap-6 lg:gap-10 " >
          <Productsection />
          <Aboutsection />
          <Reviewsection />
        </div>
      </div> 
    </div>
  );
}
