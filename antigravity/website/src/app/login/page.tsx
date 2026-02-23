"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Calculator, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const { user, loading, signInWithGoogle } = useAuth();
  const router = useRouter();

  // 이미 로그인된 사용자는 학습지 페이지로 리다이렉트
  useEffect(() => {
    if (!loading && user) {
      router.push("/worksheet");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fbfa]">
        <div className="w-8 h-8 border-4 border-[#2bee6c] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fbfa] flex flex-col items-center justify-center px-4 relative">
      {/* 배경 장식 */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
        <div className="absolute -top-40 right-0 w-[500px] h-[500px] bg-[#2bee6c]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 -left-40 w-[400px] h-[400px] bg-blue-50 rounded-full blur-3xl" />
      </div>

      {/* 뒤로가기 */}
      <Link
        href="/"
        className="absolute top-6 left-6 flex items-center gap-2 text-gray-400 hover:text-gray-700 transition-colors text-sm font-medium"
      >
        <ArrowLeft size={18} />
        홈으로
      </Link>

      {/* 로그인 카드 */}
      <div className="w-full max-w-md">
        {/* 로고 */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="bg-[#2bee6c] p-3 rounded-2xl text-white shadow-md shadow-[#2bee6c]/20">
              <Calculator size={32} />
            </div>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-gray-900">
            Antigravity <span className="text-[#2bee6c]">AI</span>
          </h1>
          <p className="text-gray-500 mt-2 text-lg">AI 수학 학습지 생성기</p>
        </div>

        {/* 메인 카드 */}
        <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/60 border border-gray-100 p-8 md:p-10">
          <h2 className="text-2xl font-bold text-center mb-2 text-gray-800">
            시작하기
          </h2>
          <p className="text-center text-gray-400 mb-8 text-sm">
            구글 계정으로 간편하게 로그인하세요
          </p>

          {/* 구글 로그인 버튼 */}
          <button
            onClick={signInWithGoogle}
            className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold py-4 px-6 rounded-2xl transition-all active:scale-[0.98] group"
          >
            {/* Google G 로고 (SVG) */}
            <svg viewBox="0 0 24 24" width="22" height="22">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            <span>Google로 계속하기</span>
          </button>

          {/* 카카오 로그인 버튼 (UI만 - 추후 연동) */}
          <button
            onClick={() => alert("카카오 로그인은 Firebase 콘솔에서 커스텀 OAuth 설정 후 이용 가능합니다.")}
            className="w-full mt-3 flex items-center justify-center gap-3 bg-[#FEE500] hover:bg-[#fcd800] text-[#3C1E1E] font-semibold py-4 px-6 rounded-2xl transition-all active:scale-[0.98]"
          >
            {/* 카카오 로고 */}
            <svg viewBox="0 0 24 24" width="22" height="22" fill="#3C1E1E">
              <path d="M12 3C6.48 3 2 6.36 2 10.5c0 2.53 1.66 4.77 4.16 6.14l-1.06 3.87c-.08.29.26.52.5.33l4.4-2.93c.64.09 1.31.14 2 .14 5.52 0 10-3.36 10-7.55C22 6.36 17.52 3 12 3z" />
            </svg>
            <span>카카오로 계속하기</span>
          </button>

          {/* 구분선 */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-gray-100"></div>
            <span className="text-xs text-gray-300 font-medium">또는</span>
            <div className="flex-1 h-px bg-gray-100"></div>
          </div>

          {/* 게스트 모드 */}
          <Link
            href="/worksheet"
            className="w-full block text-center text-gray-400 hover:text-gray-600 text-sm font-medium py-3 rounded-2xl hover:bg-gray-50 transition-all"
          >
            로그인 없이 체험하기 →
          </Link>
        </div>

        {/* 하단 안내 */}
        <p className="text-center text-xs text-gray-300 mt-6 leading-relaxed">
          로그인 시 <span className="underline">이용약관</span> 및 <span className="underline">개인정보처리방침</span>에 동의하는 것으로 간주합니다.
        </p>
      </div>
    </div>
  );
}
