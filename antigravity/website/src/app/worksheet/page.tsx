"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Printer, RefreshCw, BookOpen, GraduationCap,
  ChevronDown, Eye, EyeOff, CheckCircle, XCircle,
  ClipboardCheck, RotateCcw, Sparkles,
} from "lucide-react";
import { generateProblems, TOPICS_BY_GRADE } from "@/lib/problemGenerators";
import type { Problem, Difficulty } from "@/lib/problemGenerators";
import { saveStudyRecord, saveWrongNotes } from "@/lib/studyStorage";
import Navbar from "@/components/Navbar";

// 난이도 설정 UI 라벨 + 스타일
const DIFFICULTY_OPTIONS: { value: Difficulty; label: string; emoji: string }[] = [
  { value: "easy", label: "쉬움", emoji: "🌱" },
  { value: "normal", label: "보통", emoji: "📘" },
  { value: "hard", label: "어려움", emoji: "🔥" },
];

// 문제 수 옵션
const COUNT_OPTIONS = [5, 10, 20];

export default function WorksheetPage() {
  const [selectedGrade, setSelectedGrade] = useState<number>(1);
  const [selectedTopic, setSelectedTopic] = useState<string>(TOPICS_BY_GRADE[1][0]);
  const [difficulty, setDifficulty] = useState<Difficulty>("normal");
  const [problemCount, setProblemCount] = useState<number>(10);
  const [worksheet, setWorksheet] = useState<Problem[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showAnswers, setShowAnswers] = useState(false);

  // 채점 모드 관련 상태
  const [gradingMode, setGradingMode] = useState(false);
  const [graded, setGraded] = useState<Record<number, "correct" | "wrong">>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  // 초기 문제 생성
  useEffect(() => {
    setWorksheet(generateProblems(1, TOPICS_BY_GRADE[1][0], 10, "normal"));
  }, []);

  const handleGenerate = useCallback(() => {
    setIsGenerating(true);
    // 채점 상태 리셋
    setGradingMode(false);
    setGraded({});
    setIsSubmitted(false);
    setShowAnswers(false);

    setTimeout(() => {
      setWorksheet(generateProblems(selectedGrade, selectedTopic, problemCount, difficulty));
      setIsGenerating(false);
    }, 600);
  }, [selectedGrade, selectedTopic, problemCount, difficulty]);

  const handlePrint = () => window.print();

  const handleGradeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const grade = parseInt(e.target.value);
    setSelectedGrade(grade);
    setSelectedTopic(TOPICS_BY_GRADE[grade][0]);
  };

  // 채점 토글 (문제별 ✓ / ✗)
  const toggleGrading = (problemId: number) => {
    if (isSubmitted) return; // 이미 제출 완료면 변경 불가
    setGraded((prev) => {
      const current = prev[problemId];
      if (!current) return { ...prev, [problemId]: "correct" };
      if (current === "correct") return { ...prev, [problemId]: "wrong" };
      // wrong → 삭제 (다시 미채점)
      const next = { ...prev };
      delete next[problemId];
      return next;
    });
  };

  // 채점 결과 제출 (학습 이력, 오답 저장)
  const handleSubmitGrading = () => {
    const correctCount = Object.values(graded).filter((v) => v === "correct").length;
    const wrongProblems = worksheet.filter((p) => graded[p.id] === "wrong");

    // 학습 이력 저장
    saveStudyRecord(selectedGrade, selectedTopic, difficulty, worksheet.length, correctCount);

    // 오답 저장
    if (wrongProblems.length > 0) {
      saveWrongNotes(selectedGrade, selectedTopic, wrongProblems);
    }

    setIsSubmitted(true);
  };

  // 채점 완료 여부 확인 (모든 문제가 채점되었는지)
  const allGraded = worksheet.length > 0 && Object.keys(graded).length === worksheet.length;
  const correctCount = Object.values(graded).filter((v) => v === "correct").length;
  const wrongCount = Object.values(graded).filter((v) => v === "wrong").length;

  return (
    <div className="min-h-screen bg-[#f8fbfa] font-sans selection:bg-[#2bee6c]/30">
      {/* 공통 네비게이션 */}
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8">
        {/* ─── 컨트롤 패널 (인쇄 시 숨김) ─── */}
        <aside className="w-full lg:w-80 shrink-0 print:hidden space-y-6">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
              <BookOpen className="text-[#2bee6c]" size={20} />
              학습지 설정
            </h2>

            <div className="space-y-5">
              {/* 학년 선택 */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-600 block">학년 선택</label>
                <div className="relative">
                  <select
                    value={selectedGrade}
                    onChange={handleGradeChange}
                    className="w-full appearance-none bg-gray-50 border border-gray-200 text-gray-800 px-4 py-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#2bee6c]/50 transition-all font-medium"
                  >
                    {[1, 2, 3, 4, 5, 6].map((g) => (
                      <option key={g} value={g}>초등학교 {g}학년</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
                </div>
              </div>

              {/* 단원 선택 */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-600 block">단원 / 학습 주제</label>
                <div className="relative">
                  <select
                    value={selectedTopic}
                    onChange={(e) => setSelectedTopic(e.target.value)}
                    className="w-full appearance-none bg-gray-50 border border-gray-200 text-gray-800 px-4 py-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#2bee6c]/50 transition-all font-medium"
                  >
                    {TOPICS_BY_GRADE[selectedGrade].map((topic) => (
                      <option key={topic} value={topic}>{topic}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
                </div>
              </div>

              {/* 난이도 선택 */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-600 block">난이도</label>
                <div className="grid grid-cols-3 gap-2">
                  {DIFFICULTY_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setDifficulty(opt.value)}
                      className={`py-2.5 rounded-xl text-sm font-semibold transition-all ${
                        difficulty === opt.value
                          ? "bg-[#2bee6c] text-white shadow-md shadow-[#2bee6c]/20"
                          : "bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200"
                      }`}
                    >
                      {opt.emoji} {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 문제 수 선택 */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-600 block">문제 수</label>
                <div className="grid grid-cols-3 gap-2">
                  {COUNT_OPTIONS.map((cnt) => (
                    <button
                      key={cnt}
                      onClick={() => setProblemCount(cnt)}
                      className={`py-2.5 rounded-xl text-sm font-semibold transition-all ${
                        problemCount === cnt
                          ? "bg-[#2bee6c] text-white shadow-md shadow-[#2bee6c]/20"
                          : "bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200"
                      }`}
                    >
                      {cnt}문제
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 액션 버튼들 */}
            <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col gap-3">
              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full bg-[#2bee6c] hover:bg-[#25dc63] text-white font-bold py-3.5 px-6 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-md shadow-[#2bee6c]/20 disabled:opacity-70"
              >
                <RefreshCw size={20} className={isGenerating ? "animate-spin" : ""} />
                {isGenerating ? "생성 중..." : "새로운 문제 생성"}
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setShowAnswers(!showAnswers)}
                  className="bg-white border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700 font-bold py-3 px-4 rounded-2xl flex items-center justify-center gap-1.5 transition-all active:scale-[0.98] text-sm"
                >
                  {showAnswers ? <EyeOff size={18} /> : <Eye size={18} />}
                  {showAnswers ? "정답 숨기기" : "정답 보기"}
                </button>

                <button
                  onClick={handlePrint}
                  className="bg-white border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700 font-bold py-3 px-4 rounded-2xl flex items-center justify-center gap-1.5 transition-all active:scale-[0.98] text-sm"
                >
                  <Printer size={18} />
                  인쇄
                </button>
              </div>

              {/* 채점 모드 */}
              {!gradingMode ? (
                <button
                  onClick={() => { setGradingMode(true); setGraded({}); setIsSubmitted(false); }}
                  className="w-full bg-amber-50 border-2 border-amber-200 hover:bg-amber-100 text-amber-700 font-bold py-3 px-6 rounded-2xl flex items-center justify-center gap-2 transition-all text-sm"
                >
                  <ClipboardCheck size={18} />
                  채점 모드 시작
                </button>
              ) : (
                <button
                  onClick={() => { setGradingMode(false); setGraded({}); setIsSubmitted(false); }}
                  className="w-full bg-gray-50 border-2 border-gray-200 hover:bg-gray-100 text-gray-600 font-bold py-3 px-6 rounded-2xl flex items-center justify-center gap-2 transition-all text-sm"
                >
                  <RotateCcw size={18} />
                  채점 모드 종료
                </button>
              )}
            </div>
          </div>

          {/* 채점 결과 카드 (채점 모드일 때만) */}
          {gradingMode && (
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
              <h3 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2">
                <ClipboardCheck className="text-amber-500" size={18} />
                채점 현황
              </h3>
              <div className="grid grid-cols-3 gap-3 text-center mb-4">
                <div className="bg-gray-50 p-3 rounded-2xl">
                  <div className="text-2xl font-black text-gray-800">{Object.keys(graded).length}</div>
                  <div className="text-xs text-gray-400 mt-1">채점완료</div>
                </div>
                <div className="bg-green-50 p-3 rounded-2xl">
                  <div className="text-2xl font-black text-green-600">{correctCount}</div>
                  <div className="text-xs text-green-500 mt-1">정답</div>
                </div>
                <div className="bg-red-50 p-3 rounded-2xl">
                  <div className="text-2xl font-black text-red-500">{wrongCount}</div>
                  <div className="text-xs text-red-400 mt-1">오답</div>
                </div>
              </div>

              {!isSubmitted ? (
                <button
                  onClick={handleSubmitGrading}
                  disabled={!allGraded}
                  className={`w-full font-bold py-3 px-6 rounded-2xl flex items-center justify-center gap-2 transition-all text-sm ${
                    allGraded
                      ? "bg-[#2bee6c] text-white shadow-md shadow-[#2bee6c]/20 hover:bg-[#25dc63]"
                      : "bg-gray-100 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  <Sparkles size={18} />
                  {allGraded ? "채점 결과 저장하기" : `${worksheet.length - Object.keys(graded).length}개 남음`}
                </button>
              ) : (
                <div className="bg-[#effef5] p-4 rounded-2xl text-center">
                  <div className="text-3xl font-black text-[#1a8a3e]">
                    {Math.round((correctCount / worksheet.length) * 100)}점
                  </div>
                  <p className="text-sm text-[#1f8742] mt-1">
                    {worksheet.length}문제 중 {correctCount}개 정답!
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
                    ✅ 학습 이력 저장됨 {wrongCount > 0 && `| 📝 오답 ${wrongCount}개 저장됨`}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* 학습 가이드 (채점 모드 아닐 때) */}
          {!gradingMode && (
            <div className="bg-[#effef5] p-6 rounded-3xl border border-[#2bee6c]/20 text-sm text-[#1f8742] leading-relaxed">
              <h3 className="font-bold mb-2 flex items-center gap-2">
                <GraduationCap size={18} />
                학습 가이드
              </h3>
              <p>1. 학년, 단원, 난이도, 문제 수를 선택하세요.</p>
              <p className="mt-1">2. <strong>&apos;새로운 문제 생성&apos;</strong>을 누르면 매번 새로운 문제가 만들어집니다.</p>
              <p className="mt-1">3. <strong>&apos;채점 모드&apos;</strong>로 맞은 문제와 틀린 문제를 기록할 수 있어요.</p>
              <p className="mt-1">4. 오답은 자동으로 <strong>오답노트</strong>에 저장됩니다.</p>
            </div>
          )}
        </aside>

        {/* ─── 학습지 표시 영역 ─── */}
        <section className="flex-1">
          <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-gray-100 print:shadow-none print:border-none print:p-0 min-h-[800px]">
            {/* 인쇄용 헤더 */}
            <div className="border-b-2 border-gray-800 pb-4 mb-8 flex justify-between items-end">
              <div>
                <h2 className="text-3xl font-bold text-gray-800 font-serif tracking-tight">Antigravity AI 수학 학습지</h2>
                <p className="text-xl text-gray-600 mt-2 font-medium bg-[#2bee6c]/10 inline-block px-3 py-1 rounded-lg">
                  초등학교 {selectedGrade}학년 - {selectedTopic}
                  <span className="ml-2 text-sm text-gray-400">
                    ({DIFFICULTY_OPTIONS.find(d => d.value === difficulty)?.label} · {problemCount}문제)
                  </span>
                </p>
              </div>
              <div className="text-right space-y-2">
                <div className="text-lg font-medium text-gray-700">이름: <span className="inline-block w-40 border-b border-gray-400"></span></div>
                <div className="text-lg font-medium text-gray-700">날짜: <span className="inline-block w-40 border-b border-gray-400"></span></div>
                <div className="text-lg font-medium text-gray-700">점수: <span className="inline-block w-40 border-b border-gray-400"></span></div>
              </div>
            </div>

            {/* 문제 리스트 */}
            <div className={`grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 print:grid-cols-2 transition-opacity duration-300 ${isGenerating ? "opacity-40" : "opacity-100"}`}>
              {worksheet.length > 0
                ? worksheet.map((problem) => (
                    <div
                      key={problem.id}
                      className={`group relative flex items-start gap-4 p-4 rounded-2xl transition-colors print:hover:bg-transparent ${
                        gradingMode
                          ? graded[problem.id] === "correct"
                            ? "bg-green-50 border border-green-200"
                            : graded[problem.id] === "wrong"
                              ? "bg-red-50 border border-red-200"
                              : "hover:bg-gray-50 border border-transparent"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      {/* 문제 번호 */}
                      <div className="w-10 h-10 shrink-0 bg-[#2bee6c]/10 text-[#1f8742] rounded-full flex items-center justify-center font-bold text-lg font-mono print:bg-transparent print:border print:border-gray-300 print:text-gray-800">
                        {problem.id}
                      </div>

                      <div className="pt-1 w-full">
                        <div className="text-2xl font-medium text-gray-800 tracking-wider">{problem.question}</div>

                        {/* 정답 표시 영역 */}
                        {showAnswers && (
                          <div className="mt-2 text-lg font-bold text-[#2bee6c] bg-[#effef5] px-3 py-1.5 rounded-xl inline-block print:hidden transition-all animate-[fadeIn_0.2s_ease]">
                            정답: {problem.answer}
                          </div>
                        )}

                        {/* 풀이 공간 */}
                        <div className="h-20 md:h-24 w-full mt-3 border-b border-dashed border-gray-200 print:border-gray-300"></div>
                      </div>

                      {/* 채점 버튼 (채점 모드일 때만) */}
                      {gradingMode && !isSubmitted && (
                        <button
                          onClick={() => toggleGrading(problem.id)}
                          className="shrink-0 mt-1 print:hidden"
                          title="클릭하여 채점 (✓ → ✗ → 미채점)"
                        >
                          {graded[problem.id] === "correct" ? (
                            <CheckCircle size={28} className="text-green-500" />
                          ) : graded[problem.id] === "wrong" ? (
                            <XCircle size={28} className="text-red-500" />
                          ) : (
                            <div className="w-7 h-7 rounded-full border-2 border-gray-300 hover:border-gray-400 transition-colors" />
                          )}
                        </button>
                      )}

                      {/* 제출 후 채점 결과 표시 */}
                      {gradingMode && isSubmitted && (
                        <div className="shrink-0 mt-1 print:hidden">
                          {graded[problem.id] === "correct" ? (
                            <CheckCircle size={28} className="text-green-500" />
                          ) : (
                            <XCircle size={28} className="text-red-500" />
                          )}
                        </div>
                      )}
                    </div>
                  ))
                : Array.from({ length: problemCount }).map((_, i) => (
                    <div key={i} className="flex items-start gap-4 p-4 print:hidden">
                      <div className="w-10 h-10 shrink-0 bg-gray-100 rounded-full animate-pulse"></div>
                      <div className="pt-1 w-full space-y-4">
                        <div className="h-8 bg-gray-100 rounded w-1/2 animate-pulse"></div>
                        <div className="h-20 md:h-24 w-full border-b border-dashed border-gray-200"></div>
                      </div>
                    </div>
                  ))}
            </div>

            {/* 인쇄 전용 푸터 */}
            <div className="mt-16 pt-8 border-t border-gray-200 text-center text-gray-400 text-sm hidden print:block">
              Antigravity AI Math Generator | 본 학습지의 저작권은 작성자에게 있습니다.
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
