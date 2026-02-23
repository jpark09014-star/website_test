/**
 * Firebase 인증 컨텍스트
 *
 * [왜 이렇게 설계했는가]
 * - React Context + Provider 패턴으로 앱 전체에서 로그인 상태를 공유합니다.
 * - onAuthStateChanged 리스너로 새로고침해도 로그인이 유지됩니다.
 */
"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import {
  User,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signInWithGoogle: async () => {},
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    // 1. 인앱 브라우저 감지 (카카오톡, 네이버, 인스타그램 등)
    const userAgent = navigator.userAgent.toLowerCase();
    const isKakao = userAgent.match(/kakaotalk/i);
    const isInApp = userAgent.match(/inapp|naver|snapchat|line|kakaostory|band|instagram|facebook/i);

    // 2. 카카오톡 내부 브라우저인 경우 강제로 외부 브라우저 호출
    if (isKakao) {
      window.location.href = `kakaotalk://web/openExternal?url=${encodeURIComponent(window.location.href)}`;
      return;
    } 
    // 3. 그 외 인앱 브라우저인 경우 사용자에게 안내
    else if (isInApp) {
      alert(
        "보안 정책(403)으로 인해 현재 앱 내부에서는 구글 로그인을 할 수 없습니다.\n\n" +
        "오른쪽 상단 또는 하단의 [⠇] 메뉴를 눌러 '다른 브라우저(Safari/Chrome)로 열기'를 선택해주세요!"
      );
      return;
    }

    // 4. 정상적인 시스템 외부 브라우저일 때만 팝업 실행
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Google 로그인 실패:", error);
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error("로그아웃 실패:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
