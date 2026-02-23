/**
 * 공통 네비게이션 바 컴포넌트
 *
 * [왜 분리했는가]
 * - worksheet, wrong-notes, mypage 등 여러 페이지에서 동일한 네비게이션을 사용하므로
 *   중복 코드를 줄이고 일관된 UX를 제공하기 위해 공통 컴포넌트로 추출합니다.
 */
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Calculator, LogOut, Menu, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";

const NAV_LINKS = [
  { href: "/worksheet", label: "학습지" },
  { href: "/wrong-notes", label: "오답노트" },
  { href: "/mypage", label: "마이페이지" },
];

export default function Navbar() {
  const { user, signOut } = useAuth();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="bg-white/80 backdrop-blur-lg border-b border-gray-100 sticky top-0 z-50 print:hidden shadow-sm">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* 로고 */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center bg-white border border-gray-100 shadow-sm group-hover:scale-105 transition-transform">
            {/* Added logo image */}
            <img src="/logo.png" alt="Level-up AI Logo" className="w-full h-full object-cover" />
          </div>
          <span className="text-xl font-extrabold tracking-tight">
            Level-up<span className="text-emerald-500"> AI</span>
          </span>
        </Link>

        {/* 데스크탑 네비게이션 */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? "bg-emerald-500/10 text-emerald-700"
                    : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* 우측: 유저 정보 + 모바일 메뉴 토글 */}
        <div className="flex items-center gap-3">
          {user && (
            <div className="hidden md:flex items-center gap-3">
              {user.photoURL && (
                <img
                  src={user.photoURL}
                  alt="프로필"
                  className="w-8 h-8 rounded-full border-2 border-gray-100"
                />
              )}
              <span className="text-sm font-semibold text-gray-700">{user.displayName}</span>
              <button
                onClick={signOut}
                className="flex items-center gap-1 text-sm text-gray-400 hover:text-red-500 transition-colors"
              >
                <LogOut size={16} />
              </button>
            </div>
          )}

          {/* 모바일 햄버거 */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* 모바일 드롭다운 메뉴 */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-3 space-y-1 animate-[fadeIn_0.15s_ease]">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`block px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? "bg-emerald-500/10 text-emerald-700"
                    : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"
                }`}
              >
                {link.label}
              </Link>
            );
          })}

          {user && (
            <div className="border-t border-gray-100 pt-3 mt-2 flex items-center justify-between px-4">
              <div className="flex items-center gap-2">
                {user.photoURL && (
                  <img
                    src={user.photoURL}
                    alt="프로필"
                    className="w-7 h-7 rounded-full border-2 border-gray-100"
                  />
                )}
                <span className="text-sm font-semibold text-gray-700">{user.displayName}</span>
              </div>
              <button
                onClick={() => { signOut(); setMobileOpen(false); }}
                className="flex items-center gap-1 text-sm text-gray-400 hover:text-red-500 transition-colors"
              >
                <LogOut size={16} />
                로그아웃
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
