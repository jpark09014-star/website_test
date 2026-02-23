/**
 * 학습 이력 및 오답 노트 저장 유틸리티
 *
 * [왜 localStorage를 사용하는가]
 * - Firebase DB를 아직 도입하지 않은 상태이므로, 클라이언트 측 localStorage로 데이터를 보관합니다.
 * - 추후 Firebase Firestore 연동 시, 이 레이어의 인터페이스만 교체하면 됩니다.
 */

import type { Problem, Difficulty } from "./problemGenerators";

// ─── 타입 정의 ────────────────────────────────────────────────

export interface StudyRecord {
  id: string;              // 고유 ID (timestamp 기반)
  date: string;            // ISO 날짜 문자열
  grade: number;           // 학년
  topic: string;           // 단원
  difficulty: Difficulty;  // 난이도
  totalCount: number;      // 총 문제 수
  correctCount: number;    // 정답 수
  wrongCount: number;      // 오답 수
}

export interface WrongNote {
  id: string;              // 고유 ID
  date: string;            // 저장 날짜
  grade: number;           // 학년
  topic: string;           // 단원
  question: string;        // 문제
  answer: string;          // 정답
}

export interface StudyStats {
  totalSessions: number;   // 총 학습 세션 수
  totalProblems: number;   // 총 풀이 문제 수
  totalCorrect: number;    // 총 정답 수
  accuracy: number;        // 정답률 (0~100)
  streakDays: number;      // 연속 학습 일수
  gradeDistribution: Record<number, number>; // 학년별 학습 횟수
}

// ─── 상수 ────────────────────────────────────────────────────

const STUDY_RECORDS_KEY = "antigravity_study_records";
const WRONG_NOTES_KEY = "antigravity_wrong_notes";

// ─── 학습 이력 함수 ──────────────────────────────────────────

/** 학습 이력 저장 */
export function saveStudyRecord(
  grade: number,
  topic: string,
  difficulty: Difficulty,
  totalCount: number,
  correctCount: number,
): void {
  const records = getStudyRecords();
  const record: StudyRecord = {
    id: `sr_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    date: new Date().toISOString(),
    grade,
    topic,
    difficulty,
    totalCount,
    correctCount,
    wrongCount: totalCount - correctCount,
  };
  records.push(record);
  localStorage.setItem(STUDY_RECORDS_KEY, JSON.stringify(records));
}

/** 전체 이력 조회 (최신순) */
export function getStudyRecords(): StudyRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STUDY_RECORDS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/** 학습 통계 계산 */
export function getStudyStats(): StudyStats {
  const records = getStudyRecords();

  if (records.length === 0) {
    return {
      totalSessions: 0,
      totalProblems: 0,
      totalCorrect: 0,
      accuracy: 0,
      streakDays: 0,
      gradeDistribution: {},
    };
  }

  const totalProblems = records.reduce((sum, r) => sum + r.totalCount, 0);
  const totalCorrect = records.reduce((sum, r) => sum + r.correctCount, 0);

  // 학년별 분포 계산
  const gradeDistribution: Record<number, number> = {};
  records.forEach((r) => {
    gradeDistribution[r.grade] = (gradeDistribution[r.grade] || 0) + 1;
  });

  // 연속 학습 일수 계산 (오늘부터 거슬러 올라가며)
  const uniqueDays = new Set(
    records.map((r) => new Date(r.date).toDateString())
  );
  let streakDays = 0;
  const today = new Date();
  for (let i = 0; i < 365; i++) {
    const checkDate = new Date(today);
    checkDate.setDate(today.getDate() - i);
    if (uniqueDays.has(checkDate.toDateString())) {
      streakDays++;
    } else if (i > 0) {
      // i=0일 때 오늘 아직 안 풀었으면 어제부터 체크
      break;
    }
  }

  return {
    totalSessions: records.length,
    totalProblems,
    totalCorrect,
    accuracy: totalProblems > 0 ? Math.round((totalCorrect / totalProblems) * 100) : 0,
    streakDays,
    gradeDistribution,
  };
}

// ─── 오답 노트 함수 ──────────────────────────────────────────

/** 오답 저장 (여러 개 한꺼번에) */
export function saveWrongNotes(
  grade: number,
  topic: string,
  problems: Problem[]
): void {
  const notes = getWrongNotes();
  const newNotes: WrongNote[] = problems.map((p) => ({
    id: `wn_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    date: new Date().toISOString(),
    grade,
    topic,
    question: p.question,
    answer: p.answer,
  }));
  notes.push(...newNotes);
  localStorage.setItem(WRONG_NOTES_KEY, JSON.stringify(notes));
}

/** 전체 오답 조회 (최신순) */
export function getWrongNotes(): WrongNote[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(WRONG_NOTES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/** 특정 오답 삭제 */
export function removeWrongNote(noteId: string): void {
  const notes = getWrongNotes().filter((n) => n.id !== noteId);
  localStorage.setItem(WRONG_NOTES_KEY, JSON.stringify(notes));
}

/** 오답 전체 삭제 */
export function clearAllWrongNotes(): void {
  localStorage.setItem(WRONG_NOTES_KEY, JSON.stringify([]));
}

/** 학년별 오답 필터 */
export function getWrongNotesByGrade(grade: number): WrongNote[] {
  return getWrongNotes().filter((n) => n.grade === grade);
}
