import type { Metadata } from "next";
import { Playfair_Display, Noto_Serif_KR } from "next/font/google";
import "./globals.css";
import FaqConsultant from "@/components/chat/FaqConsultant";
import Navbar from "@/components/ui/Navbar";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const notoSerifKR = Noto_Serif_KR({
  variable: "--font-noto-serif-kr",
  subsets: ["latin"],
  weight: ['200', '300', '400', '500', '600', '700', '900'],
});

export const metadata: Metadata = {
  title: "KNK | 본질에 집중한 우아한 루틴",
  description: "단 2개의 제품으로 완성되는 변치 않는 아름다움. KNK 프리미엄 스킨케어 듀오를 만나보세요.",
  keywords: ["스킨케어", "젠더리스 스킨케어", "선크림", "선스틱", "KNK", "프리미엄 뷰티"],
  openGraph: {
    title: "KNK | 본질에 집중한 우아한 루틴",
    description: "성별의 경계를 허물고 모두의 피부에 스며드는 감각적인 텍스처를 경험하세요.",
    url: "https://knk-skincare.com",
    siteName: "KNK Skincare",
    locale: "ko_KR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="scroll-smooth">
      <body
        className={`${playfair.variable} ${notoSerifKR.variable} font-sans antialiased bg-burgundy-900 text-rosegold-200 overflow-x-hidden`}
      >
        <Navbar />
        {children}
        <FaqConsultant />
      </body>
    </html>
  );
}

