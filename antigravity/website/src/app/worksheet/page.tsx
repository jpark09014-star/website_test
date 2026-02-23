"use client";

import { useState, useEffect } from "react";
import { Printer, RefreshCw, Calculator, BookOpen, GraduationCap, ChevronDown, LogOut, ArrowLeft } from "lucide-react";
import { generateProblems, TOPICS_BY_GRADE } from "@/lib/problemGenerators";
import type { Problem } from "@/lib/problemGenerators";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";

export default function WorksheetPage() {
  const { user, signOut } = useAuth();
  const [selectedGrade, setSelectedGrade] = useState<number>(1);
  const [selectedTopic, setSelectedTopic] = useState<string>(TOPICS_BY_GRADE[1][0]);
  const [worksheet, setWorksheet] = useState<Problem[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line
    setWorksheet(generateProblems(1, TOPICS_BY_GRADE[1][0]));
  }, []);

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setWorksheet(generateProblems(selectedGrade, selectedTopic));
      setIsGenerating(false);
    }, 600);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleGradeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const grade = parseInt(e.target.value);
    setSelectedGrade(grade);
    setSelectedTopic(TOPICS_BY_GRADE[grade][0]);
  };

  return (
    <div className="min-h-screen bg-[#f8fbfa] font-sans selection:bg-[#2bee6c]/30">
      {/* 네비게이션 & 헤더 (인쇄 시 숨김) */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-10 print:hidden shadow-sm">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-[#2bee6c] p-2 rounded-xl text-white group-hover:scale-105 transition-transform">
              <Calculator size={24} />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-gray-800">Antigravity AI</h1>
          </Link>
          <div className="flex items-center gap-4 text-sm font-medium text-gray-500">
            {user && (
              <div className="flex items-center gap-3">
                <span className="text-gray-700 font-semibold hidden sm:block">{user.displayName}</span>
                <button
                  onClick={signOut}
                  className="flex items-center gap-1.5 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <LogOut size={16} />
                  로그아웃
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">
        {/* 컨트롤 패널 (인쇄 시 숨김) */}
        <aside className="w-full md:w-80 shrink-0 print:hidden space-y-6">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
              <BookOpen className="text-[#2bee6c]" size={20} />
              학습지 설정
            </h2>

            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-600 block">학년 선택</label>
                <div className="relative">
                  <select
                    value={selectedGrade}
                    onChange={handleGradeChange}
                    className="w-full appearance-none bg-gray-50 border border-gray-200 text-gray-800 px-4 py-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#2bee6c]/50 transition-all font-medium"
                  >
                    {[1, 2, 3, 4, 5, 6].map((g) => (
                      <option key={g} value={g}>
                        초등학교 {g}학년
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-600 block">단원 / 학습 주제</label>
                <div className="relative">
                  <select
                    value={selectedTopic}
                    onChange={(e) => setSelectedTopic(e.target.value)}
                    className="w-full appearance-none bg-gray-50 border border-gray-200 text-gray-800 px-4 py-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#2bee6c]/50 transition-all font-medium"
                  >
                    {TOPICS_BY_GRADE[selectedGrade].map((topic) => (
                      <option key={topic} value={topic}>
                        {topic}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col gap-3">
              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full bg-[#2bee6c] hover:bg-[#25dc63] text-white font-bold py-3.5 px-6 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-md shadow-[#2bee6c]/20 disabled:opacity-70 disabled:active:scale-100"
              >
                <RefreshCw size={20} className={isGenerating ? "animate-spin" : ""} />
                {isGenerating ? "생성 중..." : "새로운 문제 생성"}
              </button>

              <button
                onClick={handlePrint}
                className="w-full bg-white border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700 font-bold py-3.5 px-6 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
              >
                <Printer size={20} />
                학습지로 인쇄하기
              </button>
            </div>
          </div>

          <div className="bg-[#effef5] p-6 rounded-3xl border border-[#2bee6c]/20 text-sm text-[#1f8742] leading-relaxed">
            <h3 className="font-bold mb-2 flex items-center gap-2">
              <GraduationCap size={18} />
              학습 가이드
            </h3>
            <p>1. 원하는 학년과 단원을 선택하세요.</p>
            <p className="mt-1">2. <strong>&apos;새로운 문제 생성&apos;</strong>을 누르면 AI가 매번 새로운 문제를 만들어냅니다.</p>
            <p className="mt-1">3. 문제 풀이에 집중할 수 있게 인쇄해서 사용해보세요.</p>
          </div>
        </aside>

        {/* 학습지 표시 영역 (인쇄 시 전체 너비 사용) */}
        <section className="flex-1">
          <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-gray-100 print:shadow-none print:border-none print:p-0 min-h-[800px]">
            {/* 인쇄용 헤더 영역 */}
            <div className="border-b-2 border-gray-800 pb-4 mb-8 flex justify-between items-end">
              <div>
                <h2 className="text-3xl font-bold text-gray-800 font-serif tracking-tight">Antigravity AI 수학 학습지</h2>
                <p className="text-xl text-gray-600 mt-2 font-medium bg-[#2bee6c]/10 inline-block px-3 py-1 rounded-lg">
                  초등학교 {selectedGrade}학년 - {selectedTopic}
                </p>
              </div>
              <div className="text-right space-y-2">
                <div className="text-lg font-medium text-gray-700">이름: <span className="inline-block w-40 border-b border-gray-400"></span></div>
                <div className="text-lg font-medium text-gray-700">날짜: <span className="inline-block w-40 border-b border-gray-400"></span></div>
                <div className="text-lg font-medium text-gray-700">점수: <span className="inline-block w-40 border-b border-gray-400"></span></div>
              </div>
            </div>

            {/* 문제 리스트 (2단 구성) */}
            <div className={`grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 print:grid-cols-2 transition-opacity duration-300 ${isGenerating ? "opacity-40" : "opacity-100"}`}>
              {worksheet.length > 0
                ? worksheet.map((problem) => (
                    <div key={problem.id} className="group relative flex items-start gap-4 p-4 rounded-2xl hover:bg-gray-50 transition-colors print:hover:bg-transparent">
                      <div className="w-10 h-10 shrink-0 bg-[#2bee6c]/10 text-[#1f8742] rounded-full flex items-center justify-center font-bold text-lg font-mono print:bg-transparent print:border print:border-gray-300 print:text-gray-800">
                        {problem.id}
                      </div>
                      <div className="pt-1 w-full">
                        <div className="text-2xl font-medium text-gray-800 tracking-wider">{problem.question}</div>
                        <div className="h-24 md:h-32 w-full mt-4 border-b border-dashed border-gray-200 print:border-gray-300"></div>
                      </div>
                    </div>
                  ))
                : Array.from({ length: 10 }).map((_, i) => (
                    <div key={i} className="flex items-start gap-4 p-4 print:hidden">
                      <div className="w-10 h-10 shrink-0 bg-gray-100 rounded-full animate-pulse"></div>
                      <div className="pt-1 w-full space-y-4">
                        <div className="h-8 bg-gray-100 rounded w-1/2 animate-pulse"></div>
                        <div className="h-24 md:h-32 w-full border-b border-dashed border-gray-200"></div>
                      </div>
                    </div>
                  ))}
            </div>

            <div className="mt-16 pt-8 border-t border-gray-200 text-center text-gray-400 text-sm hidden print:block">
              Antigravity AI Math Generator | 본 학습지의 저작권은 작성자에게 있습니다.
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
