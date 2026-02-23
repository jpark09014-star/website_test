"use client";

import { useState, useEffect, useMemo } from "react";
import { BookX, Trash2, RotateCcw, Filter, ChevronDown, AlertCircle } from "lucide-react";
import { getWrongNotes, removeWrongNote, clearAllWrongNotes } from "@/lib/studyStorage";
import type { WrongNote } from "@/lib/studyStorage";
import Navbar from "@/components/Navbar";

export default function WrongNotesPage() {
  const [notes, setNotes] = useState<WrongNote[]>([]);
  const [filterGrade, setFilterGrade] = useState<number | "all">("all");
  const [showConfirmClear, setShowConfirmClear] = useState(false);

  // 클라이언트에서만 localStorage 접근
  useEffect(() => {
    setNotes(getWrongNotes());
  }, []);

  // 필터 적용
  const filteredNotes = useMemo(() => {
    const sorted = [...notes].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    if (filterGrade === "all") return sorted;
    return sorted.filter((n) => n.grade === filterGrade);
  }, [notes, filterGrade]);

  // 학년별 그룹핑
  const groupedByGrade = useMemo(() => {
    const map: Record<string, WrongNote[]> = {};
    filteredNotes.forEach((n) => {
      const key = `${n.grade}학년 - ${n.topic}`;
      if (!map[key]) map[key] = [];
      map[key].push(n);
    });
    return map;
  }, [filteredNotes]);

  // 개별 삭제
  const handleRemove = (id: string) => {
    removeWrongNote(id);
    setNotes(getWrongNotes());
  };

  // 전체 삭제
  const handleClearAll = () => {
    clearAllWrongNotes();
    setNotes([]);
    setShowConfirmClear(false);
  };

  // "다시 풀기" — 해당 오답들을 워크시트 형태로 보여주기
  const handleRetry = (groupNotes: WrongNote[]) => {
    // 오답 데이터를 sessionStorage에 넣고 worksheet로 이동
    const retryData = groupNotes.map((n, i) => ({
      id: i + 1,
      question: n.question,
      answer: n.answer,
    }));
    sessionStorage.setItem("retryProblems", JSON.stringify(retryData));
    sessionStorage.setItem("retryMeta", JSON.stringify({
      grade: groupNotes[0].grade,
      topic: groupNotes[0].topic,
    }));
    window.location.href = "/worksheet?mode=retry";
  };

  // 사용 가능한 학년 목록
  const availableGrades = useMemo(() => {
    const grades = new Set(notes.map((n) => n.grade));
    return Array.from(grades).sort();
  }, [notes]);

  return (
    <div className="min-h-screen bg-[#f8fbfa] font-sans">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* 헤더 */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-gray-900 flex items-center gap-3">
              <div className="bg-red-50 p-2.5 rounded-2xl text-red-500">
                <BookX size={28} />
              </div>
              오답 노트
            </h1>
            <p className="text-gray-500 mt-2">
              틀린 문제를 모아보고 다시 풀어볼 수 있어요
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* 학년 필터 */}
            {availableGrades.length > 0 && (
              <div className="relative">
                <select
                  value={filterGrade}
                  onChange={(e) => setFilterGrade(e.target.value === "all" ? "all" : parseInt(e.target.value))}
                  className="appearance-none bg-white border border-gray-200 text-gray-700 px-4 py-2.5 pr-10 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#2bee6c]/50"
                >
                  <option value="all">전체 학년</option>
                  {availableGrades.map((g) => (
                    <option key={g} value={g}>{g}학년</option>
                  ))}
                </select>
                <Filter className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
              </div>
            )}

            {/* 전체 삭제 */}
            {notes.length > 0 && (
              <button
                onClick={() => setShowConfirmClear(true)}
                className="text-sm text-gray-400 hover:text-red-500 transition-colors flex items-center gap-1 px-3 py-2.5 rounded-xl hover:bg-red-50"
              >
                <Trash2 size={16} />
                전체 삭제
              </button>
            )}
          </div>
        </div>

        {/* 전체 삭제 확인 모달 */}
        {showConfirmClear && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl">
              <div className="text-center">
                <div className="bg-red-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertCircle size={32} className="text-red-500" />
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">오답 노트 전체 삭제</h3>
                <p className="text-sm text-gray-500 mb-6">모든 오답 기록이 삭제됩니다. 이 작업은 되돌릴 수 없어요.</p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowConfirmClear(false)}
                    className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 font-semibold hover:bg-gray-50 transition-all"
                  >
                    취소
                  </button>
                  <button
                    onClick={handleClearAll}
                    className="flex-1 py-3 rounded-xl bg-red-500 text-white font-semibold hover:bg-red-600 transition-all"
                  >
                    삭제하기
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 오답 목록 */}
        {filteredNotes.length === 0 ? (
          <div className="text-center py-24">
            <div className="bg-gray-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
              <BookX size={40} className="text-gray-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-400 mb-2">
              {notes.length === 0 ? "아직 오답이 없어요!" : "해당 학년의 오답이 없어요"}
            </h3>
            <p className="text-gray-400 text-sm">
              {notes.length === 0
                ? "학습지에서 채점 모드를 사용하면 틀린 문제가 여기에 자동 저장돼요."
                : "다른 학년을 선택해보세요."}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedByGrade).map(([groupKey, groupNotes]) => (
              <div key={groupKey} className="bg-white rounded-3xl border border-gray-100 overflow-hidden">
                {/* 그룹 헤더 */}
                <div className="flex items-center justify-between px-6 py-4 bg-gray-50/50 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold text-gray-800">{groupKey}</span>
                    <span className="bg-red-100 text-red-600 text-xs font-bold px-2.5 py-1 rounded-full">
                      {groupNotes.length}문제
                    </span>
                  </div>
                  <button
                    onClick={() => handleRetry(groupNotes)}
                    className="flex items-center gap-1.5 bg-[#2bee6c] hover:bg-[#25dc63] text-white font-semibold py-2 px-4 rounded-xl text-sm transition-all"
                  >
                    <RotateCcw size={16} />
                    다시 풀기
                  </button>
                </div>

                {/* 문제 목록 */}
                <div className="divide-y divide-gray-50">
                  {groupNotes.map((note) => (
                    <div key={note.id} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50/50 transition-colors">
                      <div className="flex-1 min-w-0">
                        <div className="text-lg font-medium text-gray-800 truncate">{note.question}</div>
                        <div className="flex items-center gap-3 mt-1.5">
                          <span className="text-sm font-semibold text-[#2bee6c]">정답: {note.answer}</span>
                          <span className="text-xs text-gray-300">
                            {new Date(note.date).toLocaleDateString("ko-KR")}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemove(note.id)}
                        className="shrink-0 p-2 rounded-xl text-gray-300 hover:text-red-500 hover:bg-red-50 transition-all"
                        title="이 오답 삭제"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 통계 요약 바 */}
        {notes.length > 0 && (
          <div className="mt-8 bg-white rounded-2xl border border-gray-100 px-6 py-4 flex items-center justify-between text-sm">
            <span className="text-gray-500">
              총 <strong className="text-gray-800">{notes.length}</strong>개의 오답
            </span>
            <span className="text-gray-400">
              {availableGrades.length}개 학년에서 수집
            </span>
          </div>
        )}
      </main>
    </div>
  );
}
