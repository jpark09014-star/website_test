"use client";

import { useState, useEffect, useMemo } from "react";
import {
  BarChart3, Trophy, Target, Flame,
  TrendingUp, Calendar, BookOpen,
} from "lucide-react";
import { getStudyRecords, getStudyStats } from "@/lib/studyStorage";
import type { StudyRecord, StudyStats } from "@/lib/studyStorage";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";

export default function MyPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<StudyStats | null>(null);
  const [records, setRecords] = useState<StudyRecord[]>([]);

  useEffect(() => {
    setStats(getStudyStats());
    setRecords(getStudyRecords().sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
  }, []);

  // 학년별 진행률 (각 학년에서 몇 번 학습했는지)
  const gradeProgress = useMemo(() => {
    if (!stats) return [];
    return [1, 2, 3, 4, 5, 6].map((grade) => ({
      grade,
      count: stats.gradeDistribution[grade] || 0,
    }));
  }, [stats]);

  const maxGradeCount = Math.max(...gradeProgress.map((g) => g.count), 1);

  // 최근 7일 학습량
  const weeklyActivity = useMemo(() => {
    const days: { label: string; count: number }[] = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateStr = date.toDateString();
      const count = records.filter((r) => new Date(r.date).toDateString() === dateStr).length;
      const label = ["일", "월", "화", "수", "목", "금", "토"][date.getDay()];
      days.push({ label, count });
    }
    return days;
  }, [records]);

  const maxWeeklyCount = Math.max(...weeklyActivity.map((d) => d.count), 1);

  if (!stats) {
    return (
      <div className="min-h-screen bg-[#f8fbfa] font-sans">
        <Navbar />
        <div className="flex items-center justify-center h-[60vh]">
          <div className="w-8 h-8 border-4 border-[#2bee6c] border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fbfa] font-sans">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* 프로필 헤더 */}
        <div className="bg-white rounded-3xl border border-gray-100 p-8 mb-8">
          <div className="flex items-center gap-5">
            {user?.photoURL ? (
              <img
                src={user.photoURL}
                alt="프로필"
                className="w-20 h-20 rounded-2xl border-4 border-[#2bee6c]/20 shadow-md"
              />
            ) : (
              <div className="w-20 h-20 rounded-2xl bg-[#2bee6c]/10 flex items-center justify-center">
                <span className="text-3xl">👤</span>
              </div>
            )}
            <div>
              <h1 className="text-2xl font-black text-gray-900">
                {user?.displayName || "학습자"}님의 학습 현황
              </h1>
              <p className="text-gray-400 text-sm mt-1">
                {user?.email || "게스트 모드"}
              </p>
            </div>
          </div>
        </div>

        {/* 요약 카드 4개 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            {
              icon: <BookOpen size={22} />,
              label: "총 학습 세션",
              value: stats.totalSessions,
              suffix: "회",
              color: "bg-blue-50 text-blue-600",
            },
            {
              icon: <Target size={22} />,
              label: "풀이한 문제",
              value: stats.totalProblems,
              suffix: "문제",
              color: "bg-purple-50 text-purple-600",
            },
            {
              icon: <Trophy size={22} />,
              label: "정답률",
              value: stats.accuracy,
              suffix: "%",
              color: "bg-amber-50 text-amber-600",
            },
            {
              icon: <Flame size={22} />,
              label: "연속 학습",
              value: stats.streakDays,
              suffix: "일",
              color: "bg-red-50 text-red-500",
            },
          ].map((card, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md transition-shadow">
              <div className={`w-10 h-10 ${card.color} rounded-xl flex items-center justify-center mb-3`}>
                {card.icon}
              </div>
              <div className="text-3xl font-black text-gray-900">
                {card.value}<span className="text-lg font-bold text-gray-400 ml-0.5">{card.suffix}</span>
              </div>
              <div className="text-xs text-gray-400 mt-1 font-medium">{card.label}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* 주간 활동 차트 */}
          <div className="bg-white rounded-3xl border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
              <Calendar className="text-[#2bee6c]" size={20} />
              주간 학습 활동
            </h2>
            <div className="flex items-end justify-between gap-2 h-40">
              {weeklyActivity.map((day, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full flex flex-col items-center justify-end h-28">
                    {day.count > 0 && (
                      <span className="text-xs font-bold text-[#1a8a3e] mb-1">{day.count}</span>
                    )}
                    <div
                      className="w-full rounded-xl transition-all duration-500"
                      style={{
                        height: `${Math.max((day.count / maxWeeklyCount) * 100, day.count > 0 ? 15 : 4)}%`,
                        backgroundColor: day.count > 0 ? "#2bee6c" : "#f3f4f6",
                      }}
                    />
                  </div>
                  <span className={`text-xs font-semibold ${i === 6 ? "text-[#2bee6c]" : "text-gray-400"}`}>
                    {day.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 학년별 진행률 */}
          <div className="bg-white rounded-3xl border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
              <BarChart3 className="text-[#2bee6c]" size={20} />
              학년별 학습 분포
            </h2>
            <div className="space-y-4">
              {gradeProgress.map((item) => (
                <div key={item.grade} className="flex items-center gap-3">
                  <span className="text-sm font-bold text-gray-600 w-12">{item.grade}학년</span>
                  <div className="flex-1 bg-gray-100 rounded-full h-6 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#2bee6c] to-[#25dc63] rounded-full transition-all duration-700 flex items-center justify-end pr-2"
                      style={{ width: `${Math.max((item.count / maxGradeCount) * 100, item.count > 0 ? 10 : 0)}%` }}
                    >
                      {item.count > 0 && (
                        <span className="text-xs font-bold text-white">{item.count}</span>
                      )}
                    </div>
                  </div>
                  <span className="text-xs text-gray-400 w-10 text-right">{item.count}회</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 최근 학습 이력 */}
        <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <TrendingUp className="text-[#2bee6c]" size={20} />
              최근 학습 이력
            </h2>
            <span className="text-sm text-gray-400">최근 20개</span>
          </div>

          {records.length === 0 ? (
            <div className="py-16 text-center">
              <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen size={32} className="text-gray-300" />
              </div>
              <p className="text-gray-400 font-medium">아직 학습 이력이 없어요</p>
              <p className="text-gray-300 text-sm mt-1">학습지에서 채점하면 여기에 기록됩니다</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {records.slice(0, 20).map((record) => {
                const accuracy = Math.round((record.correctCount / record.totalCount) * 100);
                return (
                  <div key={record.id} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50/50 transition-colors">
                    {/* 점수 뱃지 */}
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl shrink-0 ${
                      accuracy >= 80
                        ? "bg-green-50 text-green-600"
                        : accuracy >= 50
                          ? "bg-amber-50 text-amber-600"
                          : "bg-red-50 text-red-500"
                    }`}>
                      {accuracy}
                    </div>

                    {/* 정보 */}
                    <div className="flex-1 min-w-0">
                      <div className="text-base font-bold text-gray-800 truncate">
                        {record.grade}학년 · {record.topic}
                      </div>
                      <div className="flex items-center gap-3 mt-1 text-sm text-gray-400">
                        <span>{record.totalCount}문제 중 {record.correctCount}개 정답</span>
                        <span>·</span>
                        <span>{record.difficulty === "easy" ? "쉬움" : record.difficulty === "hard" ? "어려움" : "보통"}</span>
                      </div>
                    </div>

                    {/* 날짜 */}
                    <div className="text-sm text-gray-300 shrink-0">
                      {new Date(record.date).toLocaleDateString("ko-KR", {
                        month: "short",
                        day: "numeric",
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
