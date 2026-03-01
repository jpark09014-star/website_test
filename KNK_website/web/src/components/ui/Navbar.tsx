'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, ShoppingBag, User, LogOut } from 'lucide-react';
import { auth } from '@/lib/firebase';
import { GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';

export default function Navbar() {
  const [user, setUser] = useState<FirebaseUser | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Login failed", error);
      alert("로그인 중 오류가 발생했습니다. 구글 로그인 팝업을 허용해주세요!");
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-burgundy-900/80 backdrop-blur-md border-b border-white/5 py-4 px-6 md:px-12 flex items-center justify-between transition-all">
      {/* Logo */}
      <Link href="/" className="text-xl font-serif tracking-[0.2em] text-rosegold-300 uppercase flex items-center gap-2">
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
        <button 
          onClick={() => alert("장바구니 기능은 준비 중입니다 🛒")}
          className="hover:text-rosegold-400 transition-colors relative"
        >
          <ShoppingBag size={18} />
          <span className="absolute -top-2 -right-2 bg-rosegold-500 text-burgundy-900 text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
            0
          </span>
        </button>
        
        {user ? (
          <button 
            onClick={handleLogout}
            className="hidden md:flex items-center gap-2 bg-rosegold-500/10 hover:bg-rosegold-500/20 text-rosegold-400 px-4 py-1.5 rounded-full text-sm font-medium transition-colors border border-rosegold-500/30"
          >
            {user.displayName?.split(' ')[0] || "User"} <LogOut size={14} />
          </button>
        ) : (
          <button 
            onClick={handleLogin}
            className="hidden md:flex items-center gap-2 bg-rosegold-500/10 hover:bg-rosegold-500/20 text-rosegold-400 px-4 py-1.5 rounded-full text-sm font-medium transition-colors border border-rosegold-500/30"
          >
            Log In <User size={14} />
          </button>
        )}
      </div>
    </nav>
  );
}
