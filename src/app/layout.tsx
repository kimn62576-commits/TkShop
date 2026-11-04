import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import AtmosphericBackground from "@/components/common/AtmosphericBackground";
import SmoothScroll from "@/components/motion/SmoothScroll";
import CustomCursor from "@/components/motion/CustomCursor";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "TKSHOP.VN | Shop Model Roblox Giá Rẻ Uy Tín #1",
  description: "Hệ thống sàn thương mại điện tử cung cấp các Framework ACS, Luau Scripts, Hệ thống RPG, UI Kits và Bản đồ chất lượng cao dành cho Roblox Studio.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const savedTheme = localStorage.getItem('tkshop_theme');
                if (savedTheme === 'light') {
                  document.documentElement.classList.remove('dark');
                } else {
                  document.documentElement.classList.add('dark');
                }
              } catch (e) {
                document.documentElement.classList.add('dark');
              }
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased text-slate-800 dark:text-slate-100 relative min-h-screen selection:bg-blue-500 selection:text-white transition-colors duration-300`}
      >
        <SmoothScroll>
          {/* Con trỏ chuột tương tác tuỳ biến (Custom Cursor) */}
          <CustomCursor />

          {/* Nền Đồ Họa Tự Động Thích Ứng Theo Chế Độ Dark / Light Mode */}
          <AtmosphericBackground />
          
          {/* Nội Dung Trang Web Nằm Nổi Phía Trên */}
          <div className="relative z-10 flex flex-col min-h-screen">
            {children}
          </div>
        </SmoothScroll>
      </body>
    </html>
  );
}
