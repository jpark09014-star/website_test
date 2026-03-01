'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { GlassCard } from '@/components/ui/GlassCard';
import { Heart, ArrowRight, Leaf, ShieldCheck, Zap } from 'lucide-react';

export default function ProductPage() {
  const handleAddToCart = () => {
    alert("장바구니에 상품을 담았습니다! 🥂");
  };

  return (
    <main className="min-h-screen bg-[#2A0E13] text-[#F3E5DF] pt-20">
      
      {/* 1. HERO SECTION (Split Layout) */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-24 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Left: Text */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-start"
        >
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif leading-tight text-[#E5C3B5] mb-6">
            The Ultimate <br />
            <span className="text-[#DCA58C]">Sun Protection</span> <br />
            Duo
          </h1>
          <p className="text-sm md:text-base text-[#DCA58C]/80 font-light leading-relaxed max-w-md mb-10">
            Experience the pinnacle of sun care. Our tone-up cream and portable sun stick blend high-performance protection with elegant aesthetics for the modern professional.
          </p>
          <div className="flex gap-4">
            <button 
              onClick={handleAddToCart}
              className="bg-[#B76E79] hover:bg-[#DCA58C] text-[#2A0E13] px-8 py-3 rounded-md text-sm font-semibold tracking-wide transition-colors"
            >
              Shop Collection
            </button>
            <button className="bg-transparent border border-[#B76E79]/30 hover:border-[#B76E79] text-[#DCA58C] px-8 py-3 rounded-md text-sm font-medium tracking-wide transition-colors flex items-center gap-2">
              Learn More <ArrowRight size={16} />
            </button>
          </div>
        </motion.div>

        {/* Right: Image Hero */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative aspect-[4/5] md:aspect-square w-full rounded-2xl overflow-hidden bg-gradient-to-br from-[#EAE1D0] to-[#C8B6A6] shadow-2xl flex items-center justify-center"
        >
          {/* Mock Product Image / Placeholder */}
          <div className="flex items-end justify-center w-full h-full pb-16 relative">
            <div className="w-64 h-64 bg-white/20 blur-3xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"></div>
            <div className="flex gap-4 z-10 relative">
              <div className="w-24 h-48 bg-gradient-to-b from-[#F5AB40] to-[#E58514] rounded-t-xl rounded-b-md shadow-lg border border-[#F5AB40]/50 relative after:content-[''] after:absolute after:bottom-[-8px] after:left-1/2 after:-translate-x-1/2 after:w-16 after:h-4 after:bg-[#EEEEEE] after:rounded-b-xl"></div>
              <div className="w-24 h-48 bg-gradient-to-b from-[#F5AB40] to-[#E58514] rounded-t-xl rounded-b-md shadow-lg border border-[#F5AB40]/50 relative after:content-[''] after:absolute after:bottom-[-8px] after:left-1/2 after:-translate-x-1/2 after:w-16 after:h-4 after:bg-[#EEEEEE] after:rounded-b-xl"></div>
            </div>
            {/* Podium Base */}
            <div className="absolute top-[65%] w-[80%] h-8 bg-[#EFEDE6] rounded-[100%] shadow-[inset_0_-4px_10px_rgba(0,0,0,0.1)]"></div>
          </div>
          
          {/* Badge */}
          <div className="absolute bottom-10 left-10 bg-[#1A1F35] border border-white/10 p-4 rounded text-left shadow-xl">
            <span className="text-[10px] text-[#DCA58C] font-semibold tracking-[0.2em] uppercase block mb-1">Bestseller</span>
            <span className="text-[#F3E5DF] text-lg font-serif">Tone-Up Series</span>
          </div>
        </motion.div>
      </section>

      {/* 2. PRODUCT GRID */}
      <section className="bg-[#301015] py-24">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <span className="text-[10px] text-[#A68A7D] font-bold tracking-[0.2em] uppercase mb-4 block">Refined Protection</span>
              <h2 className="text-3xl md:text-4xl font-serif text-[#F3E5DF] mb-4">Sun Care as Art</h2>
              <p className="text-[#A68A7D] text-sm md:text-base font-light max-w-xl">
                Designed for the modern professional, our products blend high-performance protection with elegant aesthetics. Skincare that looks as good as it feels.
              </p>
            </div>
            <Link href="/" className="text-[#A68A7D] hover:text-[#DCA58C] text-sm flex items-center gap-2 transition-colors">
              View All Products <ArrowRight size={14} />
            </Link>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Product 1: Suncream */}
            <motion.div 
              whileHover={{ y: -5 }}
              className="group"
            >
              <div className="relative aspect-[4/3] bg-[#EACCAD] rounded-xl overflow-hidden mb-6 flex items-center justify-center p-12">
                {/* Wishlist Button */}
                <button className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-[#1A1F35] flex items-center justify-center text-white/50 hover:text-red-400 transition-colors">
                  <Heart size={16} />
                </button>
                {/* 3D-ish Swatch Mockup */}
                <div className="w-full h-1/2 bg-white/90 rounded-full blur-[2px] shadow-2xl opacity-90 rotate-[-5deg] scale-x-125 translate-y-4"></div>
              </div>
              
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-xl font-semibold text-[#F3E5DF]">Tone-Up Sun Cream</h3>
                <span className="text-lg text-[#F3E5DF]">$45.00</span>
              </div>
              <p className="text-[#A68A7D] text-sm min-h-[40px] mb-4 font-light">
                Non-sticky bright finish perfect for daily wear. Creates a perfect canvas for makeup.
              </p>
              <div className="flex gap-2 mb-6">
                <span className="text-[10px] bg-[#3B131A] text-[#DCA58C] px-2 py-1 border border-[#B76E79]/20 rounded">SPF 50+</span>
                <span className="text-[10px] bg-[#1A1F35] text-[#93A5C3] px-2 py-1 border border-[#93A5C3]/20 rounded">Brighten</span>
              </div>
              <button 
                onClick={handleAddToCart}
                className="w-full py-3 border border-[#B76E79]/30 hover:border-[#B76E79] hover:bg-[#B76E79]/5 text-[#F3E5DF] transition-all rounded text-sm font-medium">
                Add to Cart
              </button>
            </motion.div>

            {/* Product 2: Sunstick */}
            <motion.div 
              whileHover={{ y: -5 }}
              className="group"
            >
              <div className="relative aspect-[4/3] bg-[#0E3524] rounded-xl overflow-hidden mb-6 flex items-end justify-center pt-12">
                {/* Wishlist Button */}
                <button className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-[#1A1F35] flex items-center justify-center text-white/50 hover:text-red-400 transition-colors">
                  <Heart size={16} />
                </button>
                {/* 3D-ish Stick Mockup */}
                <div className="w-16 h-full relative z-10">
                  <div className="w-full h-12 bg-[#DCA58C] rounded-t-md"></div>
                  <div className="w-full h-full bg-[#111111] border-l border-white/20"></div>
                </div>
                {/* reflection */}
                <div className="w-full h-1/2 bg-white/5 absolute bottom-0"></div>
              </div>
              
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-xl font-semibold text-[#F3E5DF]">Sun Stick</h3>
                <span className="text-lg text-[#F3E5DF]">$38.00</span>
              </div>
              <p className="text-[#A68A7D] text-sm min-h-[40px] mb-4 font-light">
                Portable, sleek design for effortless application on the go. Matte finish with zero white cast.
              </p>
              <div className="flex gap-2 mb-6">
                <span className="text-[10px] bg-[#3B131A] text-[#DCA58C] px-2 py-1 border border-[#B76E79]/20 rounded">Portable</span>
                <span className="text-[10px] bg-[#1A1F35] text-[#93A5C3] px-2 py-1 border border-[#93A5C3]/20 rounded">Matte Finish</span>
              </div>
              <button 
                onClick={handleAddToCart}
                className="w-full py-3 border border-[#B76E79]/30 hover:border-[#B76E79] hover:bg-[#B76E79]/5 text-[#F3E5DF] transition-all rounded text-sm font-medium">
                Add to Cart
              </button>
            </motion.div>

          </div>
        </div>
      </section>

      {/* 3. FEATURE HIGHLIGHTS */}
      <section className="bg-gradient-to-b from-[#301015] to-[#250910] py-24 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <GlassCard className="text-center bg-[#3B131A]/40 border-[#B76E79]/10 pt-10 pb-8">
            <div className="w-12 h-12 mx-auto bg-[#B76E79]/20 rounded-full flex items-center justify-center mb-6 text-[#DCA58C]">
              <Leaf size={20} />
            </div>
            <h4 className="text-lg font-semibold text-[#F3E5DF] mb-3">Skin-First Formula</h4>
            <p className="text-[#A68A7D] text-xs leading-relaxed px-4">
              Enriched with calming ingredients to nurture your skin while protecting it.
            </p>
          </GlassCard>

          <GlassCard className="text-center bg-[#3B131A]/40 border-[#B76E79]/10 pt-10 pb-8">
            <div className="w-12 h-12 mx-auto bg-[#B76E79]/20 rounded-full flex items-center justify-center mb-6 text-[#DCA58C]">
              <ShieldCheck size={20} />
            </div>
            <h4 className="text-lg font-semibold text-[#F3E5DF] mb-3">Proven Efficacy</h4>
            <p className="text-[#A68A7D] text-xs leading-relaxed px-4">
              Clinically tested SPF ratings ensuring you get the protection promised.
            </p>
          </GlassCard>

          <GlassCard className="text-center bg-[#3B131A]/40 border-[#B76E79]/10 pt-10 pb-8">
            <div className="w-12 h-12 mx-auto bg-[#B76E79]/20 rounded-full flex items-center justify-center mb-6 text-[#DCA58C]">
              <Zap size={20} />
            </div>
            <h4 className="text-lg font-semibold text-[#F3E5DF] mb-3">Eco-Conscious</h4>
            <p className="text-[#A68A7D] text-xs leading-relaxed px-4">
              Reef-safe formulations and recyclable packaging for a cleaner planet.
            </p>
          </GlassCard>
        </div>
      </section>

      {/* 4. BOTTOM CTA */}
      <section className="relative py-32 bg-[#4A1523] overflow-hidden flex items-center justify-center text-center">
        {/* Subtle background element mimicking the laptop/desk shape in original */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#20050A] to-transparent z-0"></div>
        <div className="relative z-10 max-w-2xl px-6">
          <h2 className="text-3xl md:text-5xl font-serif text-[#F3E5DF] mb-6">Elevate Your Daily Ritual</h2>
          <p className="text-[#A68A7D] text-sm md:text-base mb-10">
            Secure your skin&apos;s future with KNK. Join thousands who have upgraded their sun care routine.
          </p>
          <button 
            onClick={handleAddToCart}
            className="bg-white hover:bg-gray-100 text-[#4A1523] px-8 py-3 rounded-md text-sm font-semibold tracking-wide transition-colors"
          >
            Seamless Purchase
          </button>
        </div>
      </section>

      {/* 5. FOOTER */}
      <footer className="bg-[#20050A] pt-20 pb-10 border-t border-white/5 text-sm">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="text-xl font-light tracking-[0.2em] text-[#E5C3B5] uppercase flex items-center gap-2 mb-6">
              <span className="text-[#B76E79]">✷</span> KNK
            </Link>
            <p className="text-[#A68A7D] font-light text-xs leading-relaxed pr-4">
              Premium sun care for the modern individual. Protecting your glow, every single day.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h5 className="text-[#F3E5DF] font-semibold tracking-widest text-[10px] uppercase mb-6">Shop</h5>
            <ul className="space-y-4 text-[#A68A7D] text-xs font-light">
              <li><Link href="/product" className="hover:text-[#DCA58C] transition-colors">All Products</Link></li>
              <li><Link href="/product" className="hover:text-[#DCA58C] transition-colors">Tone-Up Cream</Link></li>
              <li><Link href="/product" className="hover:text-[#DCA58C] transition-colors">Sun Stick</Link></li>
              <li><Link href="/product" className="hover:text-[#DCA58C] transition-colors">Gift Sets</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h5 className="text-[#F3E5DF] font-semibold tracking-widest text-[10px] uppercase mb-6">Company</h5>
            <ul className="space-y-4 text-[#A68A7D] text-xs font-light">
              <li><Link href="/contact" className="hover:text-[#DCA58C] transition-colors">Our Story</Link></li>
              <li><Link href="/contact" className="hover:text-[#DCA58C] transition-colors">Journal</Link></li>
              <li><Link href="/contact" className="hover:text-[#DCA58C] transition-colors">Careers</Link></li>
              <li><Link href="/contact" className="hover:text-[#DCA58C] transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h5 className="text-[#F3E5DF] font-semibold tracking-widest text-[10px] uppercase mb-6">Newsletter</h5>
            <p className="text-[#A68A7D] text-xs font-light mb-4">
              Subscribe for exclusive offers and skincare tips.
            </p>
            <form className="flex gap-2">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="bg-white/5 border border-white/10 rounded px-3 py-2 text-xs w-full text-[#F3E5DF] focus:outline-none focus:border-[#B76E79]"
              />
              <button type="submit" className="bg-[#8A2B3C] hover:bg-[#A9344A] text-white px-4 py-2 rounded text-xs transition-colors">
                Join
              </button>
            </form>
          </div>
        </div>

        {/* Bottom */}
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-center gap-4 text-[#A68A7D] text-[10px] font-light">
          <p>© 2026 KNK Skincare. All rights reserved.</p>
          <div className="flex items-center gap-2">
            <span>🌐 EN</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
