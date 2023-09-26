import { ClerkProvider } from "@clerk/nextjs";
import "../globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Topbar from "@/components/Shared/Topbar";
import LeftSidebar from "@/components/Shared/LeftSidebar";
import RightSidebar from "@/components/Shared/RightSidebar";
import Bottombar from "@/components/Shared/Bottombar";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Echo",
  description: "A Next.js 13 Meta echo Application created by Rohan Karki",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <Topbar />
          <main className="flex flex-row">
            <LeftSidebar />
            <section className="main-container">
              <div className="w-full max-w-4xl ">{children}</div>
            </section>
            <RightSidebar />
          </main>
          <Bottombar />
        </body>
      </html>
    </ClerkProvider>
  );
}
