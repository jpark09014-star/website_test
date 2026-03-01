'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '@/components/ui/GlassCard';
import Link from 'next/link';
import { Send, CheckCircle, ArrowLeft } from 'lucide-react';

// 문의 유형
const categories = ['제품 문의', '주문/배송 문의', '교환/환불', '제휴/협업', '기타'];

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    category: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Firebase Firestore에 저장 또는 API 호출
    console.log('문의 접수:', form);
    setSubmitted(true);
  };

  return (
    <main className="min-h-screen bg-burgundy-900 text-rosegold-200 flex flex-col items-center px-4 pt-28 pb-12">

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="w-full max-w-lg"
      >
        {!submitted ? (
          <GlassCard>
            <h2 className="text-2xl font-light text-rosegold-200 mb-2">문의하기</h2>
            <p className="text-rosegold-300/70 text-sm font-light mb-8">
              궁금한 점이나 건의사항을 남겨주세요. 24시간 이내에 답변드리겠습니다.
            </p>
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* 이름 */}
              <div>
                <label className="block text-xs text-rosegold-500 tracking-widest uppercase mb-2">이름</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-rosegold-200 placeholder-rosegold-500/40 focus:outline-none focus:border-rosegold-500/50 transition-colors"
                  placeholder="이름을 입력해주세요"
                />
              </div>

              {/* 이메일 */}
              <div>
                <label className="block text-xs text-rosegold-500 tracking-widest uppercase mb-2">이메일</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-rosegold-200 placeholder-rosegold-500/40 focus:outline-none focus:border-rosegold-500/50 transition-colors"
                  placeholder="example@email.com"
                />
              </div>

              {/* 문의 유형 */}
              <div>
                <label className="block text-xs text-rosegold-500 tracking-widest uppercase mb-2">문의 유형</label>
                <select
                  required
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-rosegold-200 focus:outline-none focus:border-rosegold-500/50 transition-colors appearance-none"
                >
                  <option value="" className="bg-burgundy-900">선택해주세요</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat} className="bg-burgundy-900">{cat}</option>
                  ))}
                </select>
              </div>

              {/* 메시지 */}
              <div>
                <label className="block text-xs text-rosegold-500 tracking-widest uppercase mb-2">문의 내용</label>
                <textarea
                  required
                  rows={5}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-rosegold-200 placeholder-rosegold-500/40 focus:outline-none focus:border-rosegold-500/50 transition-colors resize-none"
                  placeholder="문의 내용을 자세히 적어주세요..."
                />
              </div>

              {/* 제출 */}
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center justify-center gap-2 bg-rosegold-500 hover:bg-rosegold-300 text-burgundy-900 py-3 rounded-full font-semibold tracking-widest uppercase text-sm transition-colors"
              >
                <Send size={16} /> 문의 접수
              </motion.button>
            </form>
          </GlassCard>
        ) : (
          /* 제출 완료 */
          <GlassCard className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 10 }}
            >
              <CheckCircle size={64} className="text-rosegold-500 mx-auto mb-6" />
            </motion.div>
            <h2 className="text-2xl font-light text-rosegold-200 mb-3">접수 완료</h2>
            <p className="text-rosegold-300/80 font-light mb-8">
              문의가 정상적으로 접수되었습니다.<br />
              24시간 이내에 입력하신 이메일로 답변드리겠습니다.
            </p>
            <div className="flex flex-col gap-3">
              <Link
                href="/"
                className="flex items-center justify-center gap-2 bg-rosegold-500 hover:bg-rosegold-300 text-burgundy-900 py-3 rounded-full font-semibold tracking-widest uppercase text-sm transition-colors"
              >
                <ArrowLeft size={16} /> 홈으로 돌아가기
              </Link>
              <button
                onClick={() => { setSubmitted(false); setForm({ name: '', email: '', category: '', message: '' }); }}
                className="text-rosegold-500/60 hover:text-rosegold-300 text-xs transition-colors"
              >
                추가 문의하기
              </button>
            </div>
          </GlassCard>
        )}
      </motion.div>
    </main>
  );
}
