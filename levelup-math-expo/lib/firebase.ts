/**
 * Firebase 초기화 파일
 *
 * [왜 이렇게 설계했는가]
 * - API 키는 config/env.ts에서 중앙 관리합니다.
 * - 실제 값은 .env 파일에만 작성하고 git에 커밋하지 않습니다.
 * - .env.example 파일을 참고해 .env를 생성하세요.
 */
import { initializeApp, getApps, getApp } from "firebase/app";
import { initializeAuth, getAuth } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";
import { FIREBASE_CONFIG, validateEnv } from "@/config/env";

// 앱 시작 시 필수 환경 변수 누락 여부 경고 출력
validateEnv();

export const app =
  getApps().length === 0 ? initializeApp(FIREBASE_CONFIG) : getApp();

let authInstance: any;
if (Platform.OS === "web") {
  authInstance = getAuth(app);
} else {
  // Native 환경에서는 AsyncStorage 기반 영속성 설정
  const { getReactNativePersistence } = require("firebase/auth");
  authInstance = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
}

export const auth = authInstance;
