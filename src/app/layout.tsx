import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import { Provider, ScreenData } from "../provider";
import { Navbar } from "@/components/landing";
import { Footer } from "@/components/shared";
import { BusinessSidebar } from "@/components/business";

const dmSans = DM_Sans({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "",
  description: "",
};

export const dynamic = "force-dynamic";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={dmSans.className}>
      <body className="antialiased">
        <Provider>
          <div className=" w-full h-screen flex flex-col overflow-y-auto bg-white " >
            <Navbar />
            <ScreenData>
              {children}
            </ScreenData>
            <Footer />
            <BusinessSidebar />
          </div>
        </Provider>
      </body>
    </html>
  );
}
