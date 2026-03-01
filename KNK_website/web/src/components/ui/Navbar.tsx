import React from 'react';
import Link from 'next/link';
import { Search, ShoppingBag, User } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-burgundy-900/80 backdrop-blur-md border-b border-white/5 py-4 px-6 md:px-12 flex items-center justify-between transition-all">
      {/* Logo */}
      <Link href="/" className="text-xl font-light tracking-[0.2em] text-rosegold-300 uppercase flex items-center gap-2">
        <span className="text-rosegold-500">✷</span> KNK
      </Link>

      {/* Center Links (Desktop) */}
      <div className="hidden md:flex items-center gap-8 text-sm text-rosegold-200/80 font-light tracking-wide">
        <Link href="/" className="hover:text-rosegold-400 transition-colors">Brand</Link>
        <Link href="/product" className="hover:text-rosegold-400 text-rosegold-300 transition-colors">Sun Care</Link>
        <Link href="/product" className="hover:text-rosegold-400 transition-colors">Shop</Link>
        <Link href="/contact" className="hover:text-rosegold-400 transition-colors">Journal</Link>
      </div>

      {/* Right Icons */}
      <div className="flex items-center gap-6 text-rosegold-200/80">
        <button className="hover:text-rosegold-400 transition-colors hidden md:block">
          <Search size={18} />
        </button>
        <button className="hover:text-rosegold-400 transition-colors relative">
          <ShoppingBag size={18} />
          <span className="absolute -top-2 -right-2 bg-rosegold-500 text-burgundy-900 text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
            0
          </span>
        </button>
        <button className="hidden md:flex items-center gap-2 bg-rosegold-500/10 hover:bg-rosegold-500/20 text-rosegold-400 px-4 py-1.5 rounded-full text-sm font-medium transition-colors border border-rosegold-500/30">
          Log In <User size={14} />
        </button>
      </div>
    </nav>
  );
}
