import { SignedIn } from "@clerk/nextjs";
import type { Metadata } from "next";
import localFont from "next/font/local";
import "../globals.css";
import Header from "./_components/header";
import SideNav from "./_components/side-nav";
const geistSans = localFont({
  src: "../fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "../fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SignedIn>
          <div className="flex flex-col min-h-screen">
            <Header />
            <div className="flex">
              {" "}
              {/* Container for Sidenav and main content */}
              <SideNav />
              <main className="flex-1 p-6 overflow-auto">{children}</main>
            </div>
          </div>
        </SignedIn>
      </body>
    </html>
  );
}
