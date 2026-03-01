'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, ChevronRight } from 'lucide-react';

// FAQ 데이터
const faqCategories = [
  {
    category: '제품 정보',
    items: [
      {
        q: 'KNK 선크림과 선스틱의 차이점은?',
        a: '선크림(AFTER-RAY)은 에센스 질감의 촉촉한 톤업 선크림(SPF42 PA+++)이고, 선스틱(Kúk)은 간편하게 덧바를 수 있는 뽀송한 스틱형 선케어(SPF50+ PA++++)입니다.',
      },
      {
        q: '민감성 피부도 사용 가능한가요?',
        a: '네, KNK 제품은 모두 저자극 테스트를 완료했으며, 민감성 피부에도 안심하고 사용하실 수 있습니다.',
      },
      {
        q: '남성도 사용할 수 있나요?',
        a: '물론입니다! KNK는 젠더리스(Genderless) 브랜드로, 성별에 관계없이 모든 피부 타입에 맞게 설계되었습니다.',
      },
    ],
  },
  {
    category: '주문/배송',
    items: [
      {
        q: '배송은 얼마나 걸리나요?',
        a: '주문 후 1~3영업일 이내에 출고되며, 출고 후 1~2일 내 수령 가능합니다.',
      },
      {
        q: '교환/환불 가능한가요?',
        a: '미개봉 제품에 한해 수령 후 7일 이내 교환/환불이 가능합니다. 고객센터로 문의해 주세요.',
      },
    ],
  },
  {
    category: '브랜드 철학',
    items: [
      {
        q: 'KNK는 어떤 브랜드인가요?',
        a: 'KNK는 "본질에 집중한, 모두를 위한 우아한 루틴"을 지향하는 프리미엄 스킨케어 브랜드입니다. 로즈골드와 와인 컬러는 우아함과 깊이를 상징합니다.',
      },
      {
        q: '로즈골드/와인 컬러의 의미는?',
        a: '와인(버건디)은 깊이 있는 신뢰와 무게감을, 로즈골드는 은은한 우아함과 세련됨을 표현합니다. KNK의 핵심 가치를 담은 시그니처 컬러입니다.',
      },
    ],
  },
];

export default function FaqConsultant() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedFaq, setSelectedFaq] = useState<{ q: string; a: string } | null>(null);

  const currentItems = faqCategories.find((c) => c.category === selectedCategory)?.items || [];

  return (
    <>
      {/* 플로팅 버튼 */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-24 right-8 z-50 w-14 h-14 rounded-full bg-burgundy-800 border border-rosegold-500/30 shadow-[0_0_20px_rgba(183,110,121,0.3)] flex items-center justify-center text-rosegold-300 hover:bg-burgundy-900 transition-colors"
      >
        {isOpen ? <X size={22} /> : <MessageCircle size={22} />}
      </motion.button>

      {/* 채팅 패널 */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="fixed bottom-40 right-8 z-50 w-80 md:w-96 max-h-[500px] rounded-2xl overflow-hidden bg-burgundy-900/95 backdrop-blur-xl border border-white/10 shadow-2xl flex flex-col"
          >
            {/* 헤더 */}
            <div className="p-4 border-b border-white/10 bg-burgundy-800/50">
              <h3 className="text-rosegold-200 font-light text-sm tracking-widest uppercase">KNK 고객센터</h3>
              <p className="text-rosegold-500/70 text-xs mt-1">궁금한 점을 확인해 보세요</p>
            </div>

            {/* 콘텐츠 */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2 min-h-[280px]">
              <AnimatePresence mode="wait">
                {selectedFaq ? (
                  /* 개별 FAQ 답변 */
                  <motion.div
                    key="answer"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <button
                      onClick={() => setSelectedFaq(null)}
                      className="text-rosegold-500 text-xs mb-3 hover:text-rosegold-300 transition-colors"
                    >
                      ← 목록으로 돌아가기
                    </button>
                    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                      <p className="text-rosegold-200 text-sm font-medium mb-3">{selectedFaq.q}</p>
                      <p className="text-rosegold-300/80 text-sm leading-relaxed font-light">{selectedFaq.a}</p>
                    </div>
                    <div className="mt-4 p-3 bg-rosegold-500/10 rounded-xl border border-rosegold-500/20">
                      <p className="text-rosegold-300 text-xs font-light">
                        더 궁금한 점은 <a href="/contact" className="text-rosegold-500 underline hover:text-rosegold-300">문의 게시판</a>을 이용해주세요!
                      </p>
                    </div>
                  </motion.div>
                ) : selectedCategory ? (
                  /* FAQ 목록 */
                  <motion.div
                    key="items"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <button
                      onClick={() => setSelectedCategory(null)}
                      className="text-rosegold-500 text-xs mb-3 hover:text-rosegold-300 transition-colors"
                    >
                      ← 카테고리로 돌아가기
                    </button>
                    {currentItems.map((item, i) => (
                      <button
                        key={i}
                        onClick={() => setSelectedFaq(item)}
                        className="w-full text-left p-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-rosegold-500/30 transition-all mb-2 flex items-center justify-between group"
                      >
                        <span className="text-sm text-rosegold-200/90 font-light">{item.q}</span>
                        <ChevronRight size={14} className="text-rosegold-500/50 group-hover:text-rosegold-300 transition-colors" />
                      </button>
                    ))}
                  </motion.div>
                ) : (
                  /* 카테고리 선택 */
                  <motion.div
                    key="categories"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <p className="text-rosegold-300/70 text-xs mb-4 font-light">어떤 내용이 궁금하신가요?</p>
                    {faqCategories.map((cat, i) => (
                      <button
                        key={i}
                        onClick={() => setSelectedCategory(cat.category)}
                        className="w-full text-left p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-rosegold-500/30 transition-all mb-2 flex items-center justify-between group"
                      >
                        <span className="text-sm text-rosegold-200 font-light">{cat.category}</span>
                        <span className="text-xs text-rosegold-500/50">{cat.items.length}개</span>
                      </button>
                    ))}
                    <a
                      href="/contact"
                      className="w-full mt-3 flex items-center justify-center gap-2 p-3 rounded-xl border border-rosegold-500/30 text-rosegold-500 text-sm hover:bg-rosegold-500/10 transition-colors"
                    >
                      <Send size={14} /> 직접 문의하기
                    </a>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
