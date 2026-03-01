'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { GlassCard } from '@/components/ui/GlassCard';
import { ShoppingBag, Sparkles } from 'lucide-react';

// Dynamically import the 3D Scene to disable SSR (canvas uses WebGL)
const Scene = dynamic(() => import('@/components/canvas/Scene'), {
  ssr: false,
});

export default function Home() {
  return (
    <main className="relative min-h-screen bg-burgundy-900 text-rosegold-200 selection:bg-rosegold-500 selection:text-white pb-32">
      
      {/* SECTION 1: HERO - Interactive 3D Model */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
        {/* Abstract Gradient Blob Background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] bg-burgundy-800 rounded-full blur-[100px] opacity-80 z-0"></div>

        {/* 3D Canvas */}
        <div className="absolute inset-0 z-10 w-full h-full cursor-grab active:cursor-grabbing">
          <Suspense fallback={
            <div className="w-full h-full flex flex-col items-center justify-center gap-4">
              <div className="w-10 h-10 border-4 border-rosegold-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-rosegold-300 font-medium tracking-widest text-sm uppercase">Loading Experience</p>
            </div>
          }>
            <Scene />
          </Suspense>
        </div>

        {/* Hero Overlay */}
        <div className="absolute inset-0 z-20 pointer-events-none flex flex-col items-center justify-between py-12">
          {/* Logo / Header */}
          <motion.header 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="text-center mt-8"
          >
            <h1 className="text-4xl md:text-6xl font-light tracking-[0.2em] text-rosegold-300 uppercase">
              KNK
            </h1>
            <p className="tracking-[0.4em] text-rosegold-500 text-xs mt-4 uppercase">Skincare</p>
          </motion.header>

          {/* Scroll Indicator */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="flex flex-col items-center gap-2 mb-12"
          >
            <span className="text-xs tracking-widest uppercase text-rosegold-500/80">Scroll to Explore</span>
            <motion.div 
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              className="w-px h-12 bg-gradient-to-b from-rosegold-500 to-transparent"
            />
          </motion.div>
        </div>
      </section>

      {/* SECTION 2: BRAND PHILOSOPHY */}
      <section className="relative z-20 py-32 px-6 md:px-12 max-w-5xl mx-auto flex flex-col items-center justify-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <span className="text-sm font-semibold tracking-[0.3em] text-rosegold-500 uppercase mb-6 block">Our Philosophy</span>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-light leading-snug tracking-wide text-rosegold-200 mb-8">
            본질에 집중한, <br className="hidden md:block"/>모두를 위한 우아한 루틴.
          </h2>
          <p className="text-base md:text-lg text-rosegold-300/80 max-w-2xl mx-auto leading-relaxed font-light">
            단 2개의 제품으로 완성되는 변치 않는 아름다움. 성별의 경계를 허물고 모두의 피부에 스며드는 감각적인 텍스처를 경험하세요.
          </p>
        </motion.div>
      </section>

      {/* SECTION 3: PRODUCT DETAILS (Glassmorphism) */}
      <section className="relative z-20 py-24 px-6 md:px-12 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <GlassCard className="h-full flex flex-col justify-center">
              <span className="text-xs font-bold tracking-widest text-rosegold-500 uppercase mb-4">Step 01</span>
              <h3 className="text-2xl md:text-3xl font-light text-rosegold-200 mb-6">KNK Suncream</h3>
              <p className="text-rosegold-300/80 leading-relaxed mb-8 font-light">
                로즈골드 캡의 섬세함이 더해진 프리미엄 선크림. 백탁 없이 촉촉하게 스며드는 에센스 질감으로 매일 바르고 싶은 가벼움을 선사합니다.
              </p>
              <ul className="space-y-4 mb-10">
                <li className="flex items-center text-sm text-rosegold-200/90 font-light">
                  <div className="w-1.5 h-1.5 rounded-full bg-rosegold-500 mr-4"></div>
                  빠르고 끈적임 없는 흡수력
                </li>
                <li className="flex items-center text-sm text-rosegold-200/90 font-light">
                  <div className="w-1.5 h-1.5 rounded-full bg-rosegold-500 mr-4"></div>
                  히알루론산 10중 보습 컴플렉스
                </li>
                <li className="flex items-center text-sm text-rosegold-200/90 font-light">
                  <div className="w-1.5 h-1.5 rounded-full bg-rosegold-500 mr-4"></div>
                  SPF50+ PA++++ 강력한 자외선 차단
                </li>
              </ul>
              <button className="self-start mt-auto flex items-center gap-2 text-sm font-medium tracking-widest uppercase text-rosegold-500 hover:text-rosegold-300 transition-colors pointer-events-auto">
                Discover More <span className="text-lg">→</span>
              </button>
            </GlassCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <GlassCard className="h-full flex flex-col justify-center border-rosegold-500/20">
              <span className="text-xs font-bold tracking-widest text-rosegold-500 uppercase mb-4">Step 02</span>
              <h3 className="text-2xl md:text-3xl font-light text-rosegold-200 mb-6">KNK Sunstick</h3>
              <p className="text-rosegold-300/80 leading-relaxed mb-8 font-light">
                버건디 바디의 묵직함이 느껴지는 포터블 선스틱. 바른 듯 안 바른 듯 뽀송한 마무리감으로 메이크업 위에서도 뭉침 없이 부드럽게.
              </p>
              <ul className="space-y-4 mb-10">
                <li className="flex items-center text-sm text-rosegold-200/90 font-light">
                  <div className="w-1.5 h-1.5 rounded-full bg-rosegold-500 mr-4"></div>
                  세범 컨트롤 파우더 포뮬러
                </li>
                <li className="flex items-center text-sm text-rosegold-200/90 font-light">
                  <div className="w-1.5 h-1.5 rounded-full bg-rosegold-500 mr-4"></div>
                  굴곡진 피부에도 빈틈없는 초밀착
                </li>
                <li className="flex items-center text-sm text-rosegold-200/90 font-light">
                  <div className="w-1.5 h-1.5 rounded-full bg-rosegold-500 mr-4"></div>
                  SPF50+ PA++++ 강력한 자외선 차단
                </li>
              </ul>
              <Link href="/product" className="self-start mt-auto flex items-center gap-2 text-sm font-medium tracking-widest uppercase text-rosegold-500 hover:text-rosegold-300 transition-colors pointer-events-auto">
                Discover More <span className="text-lg">→</span>
              </Link>
            </GlassCard>
          </motion.div>

        </div>
      </section>

      {/* SECTION 4: QUIZ CTA */}
      <section className="relative z-20 py-24 px-6 md:px-12 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <GlassCard className="text-center bg-gradient-to-br from-rosegold-500/10 to-burgundy-800/30">
            <Sparkles className="mx-auto text-rosegold-500 mb-4" size={32} />
            <h3 className="text-2xl md:text-3xl font-light text-rosegold-200 mb-4">나에게 맞는 KNK는?</h3>
            <p className="text-rosegold-300/80 font-light mb-8 max-w-md mx-auto">
              5가지 간단한 질문으로 당신의 스킨케어 타입을 진단하고, 딱 맞는 KNK 제품을 추천받으세요.
            </p>
            <Link
              href="/quiz"
              className="inline-flex items-center gap-2 bg-rosegold-500 hover:bg-rosegold-300 text-burgundy-900 px-8 py-3 rounded-full font-semibold tracking-widest uppercase text-sm transition-colors"
            >
              <Sparkles size={16} /> 루틴 진단 시작하기
            </Link>
          </GlassCard>
        </motion.div>
      </section>

      {/* FOOTER */}
      <footer className="relative z-20 py-12 px-6 md:px-12 max-w-6xl mx-auto border-t border-white/10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <p className="text-rosegold-300 text-lg tracking-[0.2em] uppercase font-light">KNK</p>
            <p className="text-rosegold-500/60 text-xs mt-1">본질에 집중한, 모두를 위한 우아한 루틴</p>
          </div>
          <div className="flex gap-6 text-sm text-rosegold-500/70">
            <Link href="/quiz" className="hover:text-rosegold-300 transition-colors">루틴 진단</Link>
            <Link href="/contact" className="hover:text-rosegold-300 transition-colors">문의하기</Link>
          </div>
          <p className="text-rosegold-500/40 text-xs">© 2025 KNK Skincare. All rights reserved.</p>
        </div>
      </footer>

      {/* FLOATING ACTION BUTTON - Sticky Checkout */}
      <motion.button 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.5, duration: 0.5 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-8 right-8 z-50 flex items-center gap-3 bg-rosegold-500 hover:bg-rosegold-300 text-burgundy-900 px-6 py-4 rounded-full shadow-[0_0_20px_rgba(183,110,121,0.4)] transition-all pointer-events-auto"
      >
        <ShoppingBag size={20} strokeWidth={2.5} />
        <span className="font-semibold tracking-widest uppercase text-sm">Shop Now</span>
      </motion.button>
      
    </main>
  );
}
