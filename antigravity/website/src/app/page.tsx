"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import {
  Calculator,
  Sparkles,
  Printer,
  Brain,
  ChevronRight,
  CheckCircle2,
  Star,
  GraduationCap,
  Users,
  Zap,
  ArrowRight,
} from "lucide-react";

export default function LandingPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-white font-sans text-gray-800 overflow-x-hidden">
      {/* ─── 네비게이션 바 ─── */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="bg-[#2bee6c] p-2 rounded-xl text-white group-hover:scale-105 transition-transform">
              <Calculator size={22} />
            </div>
            <span className="text-xl font-extrabold tracking-tight">Antigravity<span className="text-[#2bee6c]"> AI</span></span>
          </Link>
          <div className="flex items-center gap-3">
            {user ? (
              <Link
                href="/worksheet"
                className="bg-[#2bee6c] hover:bg-[#25dc63] text-white font-bold py-2.5 px-5 rounded-xl transition-all text-sm flex items-center gap-1.5"
              >
                학습지 생성하기 <ArrowRight size={16} />
              </Link>
            ) : (
              <Link
                href="/login"
                className="bg-[#2bee6c] hover:bg-[#25dc63] text-white font-bold py-2.5 px-5 rounded-xl transition-all text-sm"
              >
                무료로 시작하기
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* ─── 히어로 섹션 ─── */}
      <section className="relative pt-20 pb-28 px-4">
        {/* 배경 장식 */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
          <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-[#2bee6c]/5 rounded-full blur-3xl" />
          <div className="absolute top-60 -left-40 w-[400px] h-[400px] bg-blue-50 rounded-full blur-3xl" />
        </div>

        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-[#effef5] text-[#1a8a3e] px-4 py-2 rounded-full text-sm font-semibold mb-8 border border-[#2bee6c]/20">
            <Sparkles size={16} />
            AI가 매번 새로운 문제를 만들어요
          </div>

          <h1 className="text-5xl md:text-6xl font-black leading-tight tracking-tight text-gray-900">
            우리 아이 수학 실력,
            <br />
            <span className="text-[#2bee6c]">AI 학습지</span>로 키워요
          </h1>

          <p className="mt-6 text-lg md:text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
            초등학교 1학년부터 6학년까지, 교육과정에 맞춘 수학 문제를
            <br className="hidden md:block" />
            버튼 하나로 무한 생성하고 바로 인쇄하세요.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={user ? "/worksheet" : "/login"}
              className="bg-[#2bee6c] hover:bg-[#25dc63] text-white font-bold py-4 px-8 rounded-2xl text-lg transition-all shadow-lg shadow-[#2bee6c]/25 hover:shadow-xl hover:shadow-[#2bee6c]/30 flex items-center justify-center gap-2"
            >
              지금 바로 시작하기
              <ChevronRight size={20} />
            </Link>
            <Link
              href="#features"
              className="bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold py-4 px-8 rounded-2xl text-lg transition-all border border-gray-200 flex items-center justify-center gap-2"
            >
              더 알아보기
            </Link>
          </div>

          {/* 신뢰 지표 */}
          <div className="mt-14 flex flex-wrap justify-center gap-6 text-sm text-gray-400">
            <span className="flex items-center gap-1.5"><CheckCircle2 size={16} className="text-[#2bee6c]" /> 회원가입 10초 완료</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 size={16} className="text-[#2bee6c]" /> 매번 새로운 문제</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 size={16} className="text-[#2bee6c]" /> 프린트 최적화</span>
          </div>
        </div>
      </section>

      {/* ─── 기능 소개 섹션 ─── */}
      <section id="features" className="py-24 bg-gray-50/70">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black tracking-tight">왜 Antigravity AI인가요?</h2>
            <p className="mt-4 text-gray-500 text-lg">학부모님과 선생님들이 가장 많이 선택하는 이유</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Brain size={28} />,
                title: "AI 맞춤 문제 생성",
                desc: "학년과 단원만 선택하면 Antigravity AI가 교육과정에 맞는 10문제를 즉시 생성합니다. 매번 다른 문제!",
                color: "bg-purple-50 text-purple-600",
              },
              {
                icon: <Printer size={28} />,
                title: "원클릭 인쇄",
                desc: "A4 용지에 딱 맞는 깔끔한 학습지 레이아웃. 이름·날짜·점수 칸까지 자동으로 포함됩니다.",
                color: "bg-blue-50 text-blue-600",
              },
              {
                icon: <GraduationCap size={28} />,
                title: "전 학년 교육과정 반영",
                desc: "초등 1~6학년, 학기별 주요 단원을 모두 커버합니다. 덧셈부터 비와 비율까지, 체계적으로 학습하세요.",
                color: "bg-amber-50 text-amber-600",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="bg-white p-8 rounded-3xl border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
              >
                <div className={`w-14 h-14 ${feature.color} rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-500 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 학년 커버리지 섹션 ─── */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black tracking-tight">초등 전 학년을 커버해요</h2>
            <p className="mt-4 text-gray-500 text-lg">학년별 교육과정에 딱 맞춘 24가지 단원</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { grade: 1, topics: ["1의 자리수 덧셈·뺄셈", "모으기와 가르기", "시계 보기"], emoji: "🌱" },
              { grade: 2, topics: ["2의 자리수 연산", "구구단", "길이 재기"], emoji: "🌿" },
              { grade: 3, topics: ["나눗셈 기초", "분수·소수", "평면도형"], emoji: "🌳" },
              { grade: 4, topics: ["큰 수", "곱셈·나눗셈", "다각형 넓이"], emoji: "🏔️" },
              { grade: 5, topics: ["약수·배수", "약분·통분", "직육면체"], emoji: "🚀" },
              { grade: 6, topics: ["분수·소수 나눗셈", "비와 비율", "원기둥·원뿔·구"], emoji: "⭐" },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-white border border-gray-100 rounded-2xl p-6 hover:border-[#2bee6c]/50 hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">{item.emoji}</span>
                  <h3 className="text-lg font-bold">{item.grade}학년</h3>
                </div>
                <ul className="space-y-1.5 text-sm text-gray-500">
                  {item.topics.map((topic, j) => (
                    <li key={j} className="flex items-center gap-2">
                      <CheckCircle2 size={14} className="text-[#2bee6c] shrink-0" />
                      {topic}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 사용자 후기 섹션 ─── */}
      <section className="py-24 bg-gray-50/70">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black tracking-tight">학부모님들의 이야기</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "김민지 학부모",
                grade: "초1 자녀",
                review: "매일 아침 1장씩 인쇄해서 풀리고 있어요. 숫자가 매번 바뀌어서 아이가 실력이 늘었어요!",
              },
              {
                name: "박현수 학부모",
                grade: "초3 자녀",
                review: "학원 안 다니고 이거랑 인강만으로 준비 중인데, 구구단이랑 나눗셈 성적이 확 올랐습니다.",
              },
              {
                name: "이수진 선생님",
                grade: "초등 교사",
                review: "시험지 만들기 귀찮았는데 이제 클릭 한 번이면 끝. 단원별로 쪽지시험이 바로 나와요.",
              },
            ].map((review, i) => (
              <div key={i} className="bg-white p-8 rounded-3xl border border-gray-100">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star key={j} size={18} className="text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-gray-600 leading-relaxed mb-6">&ldquo;{review.review}&rdquo;</p>
                <div>
                  <p className="font-bold text-sm">{review.name}</p>
                  <p className="text-xs text-gray-400">{review.grade}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA 섹션 ─── */}
      <section className="py-24">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <div className="bg-gradient-to-br from-[#2bee6c] to-[#1ec95c] p-12 md:p-16 rounded-[2rem] text-white">
            <Zap size={40} className="mx-auto mb-6 opacity-80" />
            <h2 className="text-3xl md:text-4xl font-black mb-4">지금 바로 시작하세요</h2>
            <p className="text-white/80 text-lg mb-8">
              구글 계정으로 10초 만에 가입하고,
              <br />
              우리 아이에게 딱 맞는 수학 학습지를 만들어 보세요.
            </p>
            <Link
              href={user ? "/worksheet" : "/login"}
              className="inline-flex items-center gap-2 bg-white text-[#1a8a3e] font-bold py-4 px-10 rounded-2xl text-lg hover:bg-gray-50 transition-all shadow-lg"
            >
              무료로 시작하기 <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── 푸터 ─── */}
      <footer className="border-t border-gray-100 py-12">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="bg-[#2bee6c] p-1.5 rounded-lg text-white">
              <Calculator size={16} />
            </div>
            <span className="font-bold text-sm">Antigravity AI</span>
          </div>
          <p className="text-sm text-gray-400">© 2026 Antigravity AI. All rights reserved.</p>
          <div className="flex gap-4 text-sm text-gray-400">
            <Users size={16} />
            <span>문의: support@antigravity.ai</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
