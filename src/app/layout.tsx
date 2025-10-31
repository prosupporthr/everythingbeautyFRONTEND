import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import { Provider } from "../provider";
import { Navbar } from "@/components/dashboard";
import { Footer } from "@/components/shared";

const dmSans = DM_Sans({
  variable: "--font-dms-sans",
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
    <html lang="en">
      <body
        className={`${dmSans.variable} antialiased`}
      >
        <Provider>
          <div className=" w-full h-screen flex flex-col overflow-y-auto bg-white " >
            <Navbar />
            <div className=" w-full flex flex-col h-auto " >
              {children}
            </div>
            <Footer />
          </div>
        </Provider>
      </body>
    </html>
  );
}
