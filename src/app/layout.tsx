import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css"; 
import { Provider } from "../provider";

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
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
