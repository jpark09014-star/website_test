"use client";

import { useState, useCallback } from "react";
import {
  Printer, RefreshCw, BookOpen,
  ChevronDown, Eye, EyeOff, CheckCircle, XCircle,
  ClipboardCheck, RotateCcw, Sparkles,
} from "lucide-react";
import { generateProblems, CURRICULUM_HIERARCHY } from "@/lib/problemGenerators";
import type { Problem, Difficulty } from "@/lib/problemGenerators";
import { saveStudyRecord, saveWrongNotes } from "@/lib/studyStorage";
import Navbar from "@/components/Navbar";

const DIFFICULTY_OPTIONS: { value: Difficulty; label: string; emoji: string }[] = [
  { value: "easy", label: "쉬움", emoji: "🌱" },
  { value: "normal", label: "보통", emoji: "📘" },
  { value: "hard", label: "어려움", emoji: "🔥" },
];

const COUNT_OPTIONS = [10, 20, 30];

export default function WorksheetPage() {
  const [selectedGrade, setSelectedGrade] = useState<number>(2);

  // Lazy initialize term/unit and topic to avoid mount-time cascading renders
  const [selectedTermUnit, setSelectedTermUnit] = useState<string>(() => {
    const units = CURRICULUM_HIERARCHY[2] || [];
    return units.length > 0 ? units[0].termUnit : "";
  });
  const [selectedTopic, setSelectedTopic] = useState<string>(() => {
    const units = CURRICULUM_HIERARCHY[2] || [];
    return units.length > 0 && units[0].topics.length > 0 ? units[0].topics[0].name : "";
  });
  
  const [difficulty, setDifficulty] = useState<Difficulty>("normal");
  const [problemCount, setProblemCount] = useState<number>(20);
  
  // Lazy initialize the worksheet right away instead of updating via effect
  const [worksheet, setWorksheet] = useState<Problem[]>(() => {
    const units = CURRICULUM_HIERARCHY[2] || [];
    const term = units.length > 0 ? units[0].termUnit : "";
    const topic = units.length > 0 && units[0].topics.length > 0 ? units[0].topics[0].name : "";
    if (term && topic) {
      return generateProblems(2, term, topic, 20, "normal");
    }
    return [];
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [showAnswers, setShowAnswers] = useState(false);

  const [gradingMode, setGradingMode] = useState(false);
  const [graded, setGraded] = useState<Record<number, "correct" | "wrong">>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  // 학년 변경 시 단원/주제 동기화 
  const syncTopicHierarchy = useCallback((grade: number) => {
    const units = CURRICULUM_HIERARCHY[grade] || [];
    if (units.length > 0) {
      setSelectedTermUnit(units[0].termUnit);
      if (units[0].topics.length > 0) {
        setSelectedTopic(units[0].topics[0].name);
      }
    } else {
      setSelectedTermUnit("");
      setSelectedTopic("");
    }
  }, []);

  const handleGradeTabClick = (grade: number) => {
    setSelectedGrade(grade);
    syncTopicHierarchy(grade);
  };

  // 단원 변경 시 주제 동기화
  const handleTermUnitChange = (termUnit: string) => {
    setSelectedTermUnit(termUnit);
    const units = CURRICULUM_HIERARCHY[selectedGrade] || [];
    const unit = units.find((u: { termUnit: string }) => u.termUnit === termUnit);
    if (unit && unit.topics.length > 0) {
      setSelectedTopic(unit.topics[0].name);
    }
  };

  const handleGenerate = useCallback(() => {
    if (!selectedTermUnit || !selectedTopic) return;
    setIsGenerating(true);
    setGradingMode(false);
    setGraded({});
    setIsSubmitted(false);
    setShowAnswers(false);

    setTimeout(() => {
      setWorksheet(generateProblems(selectedGrade, selectedTermUnit, selectedTopic, problemCount, difficulty));
      setIsGenerating(false);
    }, 600);
  }, [selectedGrade, selectedTermUnit, selectedTopic, problemCount, difficulty]);

  const handlePrint = () => window.print();

  const toggleGrading = (problemId: number) => {
    if (isSubmitted) return; 
    setGraded((prev) => {
      const current = prev[problemId];
      if (!current) return { ...prev, [problemId]: "correct" };
      if (current === "correct") return { ...prev, [problemId]: "wrong" };
      const next = { ...prev };
      delete next[problemId];
      return next;
    });
  };

  const handleSubmitGrading = () => {
    const correctCount = Object.values(graded).filter((v) => v === "correct").length;
    const wrongProblems = worksheet.filter((p) => graded[p.id] === "wrong");

    saveStudyRecord(selectedGrade, `${selectedTermUnit} - ${selectedTopic}`, difficulty, worksheet.length, correctCount);

    if (wrongProblems.length > 0) {
      saveWrongNotes(selectedGrade, `${selectedTermUnit} - ${selectedTopic}`, wrongProblems);
    }
    setIsSubmitted(true);
  };

  const allGraded = worksheet.length > 0 && Object.keys(graded).length === worksheet.length;
  const correctCount = Object.values(graded).filter((v) => v === "correct").length;
  const wrongCount = Object.values(graded).filter((v) => v === "wrong").length;

  const currentUnits = CURRICULUM_HIERARCHY[selectedGrade] || [];
  const currentTopics = currentUnits.find((u: { termUnit: string }) => u.termUnit === selectedTermUnit)?.topics || [];

  // 공통 지시문 추출 (첫 번째 문제 기준)
  const commonInstruction = worksheet.length > 0 ? worksheet[0].instruction : "";

  return (
    <div className="min-h-screen bg-[#f8fbfa] font-sans selection:bg-[#2bee6c]/30">
      <Navbar />

      {/* 학년 선택 탭 (가로 형태) - 인쇄 시 숨김 */}
      <div className="bg-white border-b border-gray-200 print:hidden overflow-x-auto">
        <div className="max-w-6xl mx-auto px-4 flex">
          {[1, 2, 3, 4, 5, 6].map((grade) => (
            <button
              key={grade}
              onClick={() => handleGradeTabClick(grade)}
              className={`px-6 py-4 font-bold whitespace-nowrap transition-colors border-b-4 ${
                selectedGrade === grade 
                  ? "border-[#2bee6c] text-[#1f8742] bg-[#effef5]/50" 
                  : "border-transparent text-gray-500 hover:text-gray-800 hover:bg-gray-50"
              }`}
            >
              {grade}학년
            </button>
          ))}
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8">
        
        {/* ─── 컨트롤 패널 (인쇄 시 숨김) ─── */}
        <aside className="w-full lg:w-80 shrink-0 print:hidden space-y-6">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
              <BookOpen className="text-[#2bee6c]" size={20} />
              학습지 상세 설정
            </h2>

            <div className="space-y-5">
              
              {/* 학기 / 단원 선택 */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-600 block">학기 및 단원</label>
                <div className="relative">
                  <select
                    value={selectedTermUnit}
                    onChange={(e) => handleTermUnitChange(e.target.value)}
                    className="w-full appearance-none bg-gray-50 border border-gray-200 text-gray-800 px-4 py-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#2bee6c]/50 transition-all font-medium text-sm"
                  >
                    {currentUnits.map((unit: { termUnit: string }) => (
                      <option key={unit.termUnit} value={unit.termUnit}>{unit.termUnit}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
                </div>
              </div>

              {/* 세부 주제 선택 */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-600 block">세부 학습 주제</label>
                <div className="relative">
                  <select
                    value={selectedTopic}
                    onChange={(e) => setSelectedTopic(e.target.value)}
                    className="w-full appearance-none bg-gray-50 border border-gray-200 text-gray-800 px-4 py-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#2bee6c]/50 transition-all font-medium text-sm"
                  >
                    {currentTopics.map((topic: { name: string }) => (
                      <option key={topic.name} value={topic.name}>{topic.name}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
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
                      className={`py-2 rounded-xl text-sm font-semibold transition-all ${
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
                      className={`py-2 rounded-xl text-sm font-semibold transition-all ${
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

          {/* 채점 결과 카드 */}
          {gradingMode && (
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
               {/* ... (생략 없이 작성) ... */}
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
        </aside>

        {/* ─── 학습지 표시 영역 ─── */}
        <section className="flex-1 w-full max-w-[800px] print:max-w-none print:w-full mx-auto">
          <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-gray-100 print:shadow-none print:border-none print:p-0 min-h-[1000px]">
            
            {/* 인쇄용 학습지 헤더 */}
            <div className="border border-gray-800 p-4 mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex items-center gap-4">
                <div className="text-center font-bold font-serif leading-tight">
                  <div className="text-3xl tracking-tighter">Level-up AI</div>
                  <div className="text-sm tracking-widest text-gray-500 mt-1">levelup-ai.com</div>
                </div>
                <div className="border-l border-gray-300 pl-4">
                  <div className="text-sm text-gray-500">{selectedGrade}학년 {selectedTermUnit}</div>
                  <div className="text-xl font-bold text-gray-800 mt-1">{selectedTopic}</div>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="text-lg font-medium text-gray-700 flex items-center gap-2">점수: <span className="inline-block w-20 border-b border-gray-400"></span></div>
                <div className="text-lg font-medium text-gray-700 flex items-center gap-2">이름: <span className="inline-block w-24 border-b border-gray-400"></span></div>
              </div>
            </div>

            {/* 공통 지시문 */}
            {commonInstruction && (
              <h3 className="text-xl font-bold text-gray-800 mb-8 print:mb-6">
                {commonInstruction}
              </h3>
            )}

            {/* 문제 리스트 (Grid) */}
            <div className={`grid grid-cols-2 lg:grid-cols-4 gap-y-12 gap-x-6 print:grid-cols-4 transition-opacity duration-300 ${isGenerating ? "opacity-40" : "opacity-100"}`}>
              {worksheet.length > 0
                ? worksheet.map((problem) => (
                    <div
                      key={problem.id}
                      className={`group relative flex flex-col items-center p-2 rounded-xl transition-colors print:p-0 ${
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
                      <div className="absolute top-0 left-0 w-6 h-6 flex items-center justify-center rounded-full border border-gray-300 text-xs font-bold text-gray-500 bg-white">
                        {problem.id}
                      </div>

                      {/* 수학 렌더링 영역 */}
                      <div className="mt-4 flex flex-col items-center justify-center h-32 w-full text-2xl font-medium text-gray-800 font-serif">
                        
                        {/* 1. 세로셈 렌더링 */}
                        {problem.visual?.type === "vertical_math" && (
                          <div className="flex flex-col items-end text-3xl tracking-[0.2em] leading-tight w-24">
                            <div>{problem.visual.top}</div>
                            <div className="flex w-full justify-between items-center border-b-[3px] border-gray-800 pb-1 mb-2">
                              <span>{problem.visual.operator}</span>
                              <span>{problem.visual.bottom}</span>
                            </div>
                            {/* 정답 표시용 공간 혹은 정답 텍스트 */}
                            {showAnswers ? (
                              <div className="text-[#2bee6c] w-full text-right">{problem.answer}</div>
                            ) : (
                              <div className="h-8"></div> // 풀이 여백
                            )}
                          </div>
                        )}

                        {/* 2. 분수 렌더링 */}
                        {problem.visual?.type === "fraction" && (
                          <div className="flex items-center gap-2 text-2xl">
                            {problem.visual.whole && (
                              <div className="text-3xl">{problem.visual.whole}</div>
                            )}
                            <div className="flex flex-col items-center text-xl font-bold px-1">
                              <div>{problem.visual.numerator}</div>
                              <div className="w-full h-px bg-gray-800 my-0.5"></div>
                              <div>{problem.visual.denominator}</div>
                            </div>
                            <div className="mx-2">=</div>
                            {showAnswers ? (
                              <div className="text-[#2bee6c]">{problem.answer}</div>
                            ) : (
                              <div className="w-16 h-8 border-b border-dashed border-gray-400"></div>
                            )}
                          </div>
                        )}

                        {/* 3. 기타 렌더링 영역 (시계 등) - 기존 형태 유지 */}
                        {(!problem.visual || (problem.visual.type !== "vertical_math" && problem.visual.type !== "fraction")) && (
                           <div className="w-full text-center">
                              {problem.question}
                              {showAnswers ? (
                                <div className="text-[#2bee6c] mt-2 text-lg inline-block px-2 py-0.5 bg-[#effef5] rounded">{problem.answer}</div>
                              ) : (
                                <div className="mt-4 border-b border-dashed border-gray-300 w-full h-8"></div>
                              )}
                           </div>
                        )}
                      </div>

                      {/* 채점 버튼 (마우스 오버나 채점 모드 시 표시) */}
                      {gradingMode && !isSubmitted && (
                        <div className="mt-2 flex gap-2 print:hidden">
                           <button
                             onClick={() => toggleGrading(problem.id)}
                             className="shrink-0"
                             title="채점"
                           >
                             {graded[problem.id] === "correct" ? (
                               <CheckCircle size={24} className="text-green-500" />
                             ) : graded[problem.id] === "wrong" ? (
                               <XCircle size={24} className="text-red-500" />
                             ) : (
                               <div className="w-6 h-6 rounded-full border-2 border-gray-300 hover:border-gray-400" />
                             )}
                           </button>
                        </div>
                      )}
                    </div>
                  ))
                : 
                // 생성 중일 때 스켈레톤 UI
                Array.from({ length: 20 }).map((_, i) => (
                    <div key={i} className="flex flex-col items-center p-2 opacity-50 print:hidden">
                      <div className="w-6 h-6 self-start bg-gray-200 rounded-full mb-4"></div>
                      <div className="w-20 h-8 bg-gray-200 rounded mb-2"></div>
                      <div className="w-24 border-b-4 border-gray-200 mb-2"></div>
                      <div className="w-16 h-8 bg-gray-200 rounded"></div>
                    </div>
                  ))}
            </div>

            {/* 인쇄 전용 푸터 */}
            <div className="mt-16 pt-4 border-t border-gray-300 text-center text-gray-500 text-xs hidden print:block">
              Level-up AI Math Generator | 본 학습지의 저작권은 작성자에게 있습니다.
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
