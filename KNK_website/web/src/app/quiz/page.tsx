'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { GlassCard } from '@/components/ui/GlassCard';
import { ShoppingBag, Share2, RotateCcw } from 'lucide-react';

// 퀴즈 질문 데이터
const questions = [
  {
    id: 1,
    question: '아침에 일어났을 때 피부 상태는?',
    options: [
      { text: '☀️ 번들번들하고 유분기가 많아요', type: 'sunstick', weight: 2 },
      { text: '🏜️ 당기고 건조한 느낌이에요', type: 'suncream', weight: 2 },
      { text: '✨ 부분적으로 번들거려요 (T존)', type: 'sunstick', weight: 1 },
      { text: '💧 촉촉하고 편안해요', type: 'suncream', weight: 1 },
    ],
  },
  {
    id: 2,
    question: '외출 준비에 투자하는 시간은?',
    options: [
      { text: '⚡ 5분 이내! 빠르게 끝내요', type: 'sunstick', weight: 2 },
      { text: '🪞 10~15분 정도 꼼꼼히', type: 'suncream', weight: 2 },
      { text: '🏃 상황에 따라 달라요', type: 'sunstick', weight: 1 },
      { text: '🧖 20분 이상, 루틴을 즐겨요', type: 'suncream', weight: 1 },
    ],
  },
  {
    id: 3,
    question: '자외선 차단제를 고를 때 가장 중요하게 생각하는 것은?',
    options: [
      { text: '🎒 휴대성과 덧바르기 편리함', type: 'sunstick', weight: 3 },
      { text: '💎 촉촉함과 톤업 효과', type: 'suncream', weight: 3 },
      { text: '🛡️ 자외선 차단 지수(SPF)', type: 'suncream', weight: 1 },
      { text: '🍃 끈적이지 않는 마무리감', type: 'sunstick', weight: 2 },
    ],
  },
  {
    id: 4,
    question: '평소 메이크업 스타일은?',
    options: [
      { text: '🚫 노메이크업 또는 선크림만', type: 'sunstick', weight: 2 },
      { text: '💄 베이스 메이크업까지 꼼꼼히', type: 'suncream', weight: 2 },
      { text: '🌿 가볍게 톤업 정도만', type: 'suncream', weight: 1 },
      { text: '😎 자외선 차단만 확실히!', type: 'sunstick', weight: 1 },
    ],
  },
  {
    id: 5,
    question: '당신의 라이프스타일은?',
    options: [
      { text: '🏋️ 활동적, 야외 활동 많음', type: 'sunstick', weight: 3 },
      { text: '💻 실내 생활 위주, 오피스 근무', type: 'suncream', weight: 3 },
      { text: '🚶 출퇴근 도보 + 실내 생활', type: 'suncream', weight: 1 },
      { text: '🌊 주말에는 밖에 나가요', type: 'sunstick', weight: 1 },
    ],
  },
];

// 결과 데이터
const results = {
  suncream: {
    title: '촉촉한 빛의 수호자',
    subtitle: 'KNK Solution AFTER-RAY',
    emoji: '✨',
    description: '당신은 피부에 깊은 수분감과 은은한 광채를 원하는 타입! 에센스처럼 스며드는 KNK 선크림이 백탁 없이 촉촉한 톤업을 선사합니다.',
    features: ['SPF 42 PA+++', '에센스 질감', '톤업 효과', '보습 지속'],
    color: 'from-rosegold-500/20 to-burgundy-800/40',
  },
  sunstick: {
    title: '뽀송한 루틴의 마스터',
    subtitle: 'KNK Kúk Sun Stick',
    emoji: '🛡️',
    description: '당신은 빠르고 간편한 루틴을 선호하는 실용주의 뷰티 러버! KNK 선스틱의 밀착 포뮬러가 어디서든 한 번의 터치로 완벽한 자외선 차단을 완성합니다.',
    features: ['SPF50+ PA++++', '세범 컨트롤', '초밀착 포뮬러', '휴대 간편'],
    color: 'from-burgundy-800/40 to-rosegold-500/20',
  },
};

export default function QuizPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [scores, setScores] = useState({ suncream: 0, sunstick: 0 });
  const [showResult, setShowResult] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const handleAnswer = (type: 'suncream' | 'sunstick', weight: number, optionIndex: number) => {
    setSelectedOption(optionIndex);

    setTimeout(() => {
      setScores((prev) => ({ ...prev, [type]: prev[type] + weight }));
      setSelectedOption(null);

      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion((prev) => prev + 1);
      } else {
        setShowResult(true);
      }
    }, 400);
  };

  const resultType = scores.suncream >= scores.sunstick ? 'suncream' : 'sunstick';
  const result = results[resultType];

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setScores({ suncream: 0, sunstick: 0 });
    setShowResult(false);
    setSelectedOption(null);
  };

  const handleShare = async () => {
    const text = `나의 스킨케어 타입은 "${result.title}" 🧴✨ 나도 진단받기 →`;
    if (navigator.share) {
      await navigator.share({ title: 'KNK 스킨케어 루틴 진단', text, url: window.location.href });
    } else {
      await navigator.clipboard.writeText(`${text} ${window.location.href}`);
      alert('링크가 클립보드에 복사되었습니다!');
    }
  };

  return (
    <main className="min-h-screen bg-burgundy-900 text-rosegold-200 flex flex-col items-center justify-center px-4 pt-28 pb-12">

      <AnimatePresence mode="wait">
        {!showResult ? (
          /* Quiz Questions */
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-lg"
          >
            {/* Progress */}
            <div className="mb-8">
              <div className="flex justify-between text-xs text-rosegold-500 mb-2">
                <span>Q{currentQuestion + 1} / {questions.length}</span>
                <span>{Math.round(((currentQuestion) / questions.length) * 100)}%</span>
              </div>
              <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-rosegold-500 rounded-full"
                  initial={{ width: `${((currentQuestion) / questions.length) * 100}%` }}
                  animate={{ width: `${((currentQuestion) / questions.length) * 100}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>

            <GlassCard>
              <h2 className="text-xl md:text-2xl font-light text-rosegold-200 mb-8 leading-relaxed">
                {questions[currentQuestion].question}
              </h2>
              <div className="space-y-3">
                {questions[currentQuestion].options.map((option, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleAnswer(option.type as 'suncream' | 'sunstick', option.weight, index)}
                    className={`w-full text-left p-4 rounded-xl border transition-all ${
                      selectedOption === index
                        ? 'border-rosegold-500 bg-rosegold-500/20'
                        : 'border-white/10 bg-white/5 hover:border-rosegold-500/40 hover:bg-white/10'
                    }`}
                  >
                    <span className="text-sm md:text-base font-light">{option.text}</span>
                  </motion.button>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        ) : (
          /* Result */
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-lg"
          >
            <GlassCard className={`bg-gradient-to-br ${result.color} text-center`}>
              <div className="text-6xl mb-4">{result.emoji}</div>
              <span className="text-xs font-bold tracking-widest text-rosegold-500 uppercase">Your Skincare Type</span>
              <h2 className="text-3xl md:text-4xl font-light text-rosegold-200 mt-3 mb-2">{result.title}</h2>
              <p className="text-sm text-rosegold-500 tracking-widest uppercase mb-6">{result.subtitle}</p>
              <p className="text-rosegold-300/90 leading-relaxed mb-8 font-light">{result.description}</p>

              <div className="grid grid-cols-2 gap-3 mb-8">
                {result.features.map((f, i) => (
                  <div key={i} className="text-xs bg-white/10 rounded-lg py-2 px-3 text-rosegold-200/80">
                    {f}
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-3">
                <Link
                  href="/"
                  className="flex items-center justify-center gap-2 bg-rosegold-500 hover:bg-rosegold-300 text-burgundy-900 py-3 rounded-full font-semibold tracking-widest uppercase text-sm transition-colors hover:scale-105 active:scale-95"
                >
                  <ShoppingBag size={18} /> 제품 보러가기
                </Link>
                <motion.button
                  onClick={handleShare}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center justify-center gap-2 border border-rosegold-500/30 text-rosegold-300 py-3 rounded-full text-sm tracking-widest uppercase hover:bg-white/5 transition-colors"
                >
                  <Share2 size={18} /> 결과 공유하기
                </motion.button>
                <button
                  onClick={resetQuiz}
                  className="flex items-center justify-center gap-2 text-rosegold-500/60 hover:text-rosegold-300 text-xs mt-2 transition-colors"
                >
                  <RotateCcw size={14} /> 다시 진단하기
                </button>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
