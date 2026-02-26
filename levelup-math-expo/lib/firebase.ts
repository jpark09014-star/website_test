/**
 * Firebase 설정 파일
 *
 * [왜 이렇게 설계했는가]
 * - 환경 변수(NEXT_PUBLIC_*)를 사용하여 API 키를 코드에 하드코딩하지 않습니다.
 * - .env.local 파일에 실제 Firebase 프로젝트 값을 넣으면 바로 동작합니다.
 */
import { initializeApp, getApps, getApp } from "firebase/app";
import { initializeAuth, getAuth } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || "YOUR_API_KEY",
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || "YOUR_PROJECT.firebaseapp.com",
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || "YOUR_PROJECT_ID",
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || "YOUR_PROJECT.appspot.com",
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "000000000000",
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || "1:000000000000:web:000000000000",
};

export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

let authInstance: any;
if (Platform.OS === 'web') {
  authInstance = getAuth(app);
} else {
  // Using require to prevent web bundlers from crashing on undefined exports
  const { getReactNativePersistence } = require("firebase/auth");
  authInstance = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
}

export const auth = authInstance;

