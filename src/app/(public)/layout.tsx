import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FloatingShopBadge from "@/components/common/FloatingShopBadge";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen bg-transparent text-[#F1F3F6] selection:bg-[#38BDF8] selection:text-[#0B111E]">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <FloatingShopBadge />
    </div>
  );
}
