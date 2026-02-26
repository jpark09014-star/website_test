/**
 * 환경 변수 중앙 관리 파일
 *
 * [왜 이렇게 관리하는가]
 * - API 키를 코드에 직접 하드코딩하면 GitHub 등에 노출될 위험이 있습니다.
 * - 이 파일은 환경 변수를 타입 안전하게 가져오는 창구 역할을 합니다.
 * - 실제 값은 반드시 .env 파일에만 작성하고, .gitignore에 등록되어야 합니다.
 *
 * [사용 방법]
 * 1. 프로젝트 루트에 .env 파일을 생성하세요 (없으면 .env.example 참고)
 * 2. .env.example에 있는 키들을 복사해서 실제 값으로 채우세요
 * 3. .env 파일은 절대로 git에 커밋하지 마세요!
 */

// ── Firebase 설정 ──────────────────────────────────────────────
export const FIREBASE_CONFIG = {
  apiKey:            process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain:        process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId:         process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket:     process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId:             process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
  measurementId:     process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// ── Google AdMob 설정 (광고 추가 시 사용) ──────────────────────
export const ADMOB_CONFIG = {
  /** Android 앱 ID: Google AdMob 콘솔에서 발급 */
  androidAppId: process.env.EXPO_PUBLIC_ADMOB_ANDROID_APP_ID,
  /** iOS 앱 ID: Google AdMob 콘솔에서 발급 */
  iosAppId:     process.env.EXPO_PUBLIC_ADMOB_IOS_APP_ID,

  // 광고 단위 ID (각 광고 형식별로 발급, 테스트 시 테스트 ID 사용)
  bannerAdUnitId:       process.env.EXPO_PUBLIC_ADMOB_BANNER_ID,
  interstitialAdUnitId: process.env.EXPO_PUBLIC_ADMOB_INTERSTITIAL_ID,
  rewardedAdUnitId:     process.env.EXPO_PUBLIC_ADMOB_REWARDED_ID,
};

// ── 환경 검증 함수 ─────────────────────────────────────────────
/**
 * 앱 시작 시 필수 환경 변수가 설정되었는지 확인합니다.
 * 누락된 키가 있으면 콘솔에 경고를 출력하여 빠르게 파악할 수 있습니다.
 */
export function validateEnv(): void {
  const REQUIRED_KEYS: string[] = [
    "EXPO_PUBLIC_FIREBASE_API_KEY",
    "EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN",
    "EXPO_PUBLIC_FIREBASE_PROJECT_ID",
    "EXPO_PUBLIC_FIREBASE_APP_ID",
  ];

  const missing = REQUIRED_KEYS.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    console.warn(
      `⚠️  [env] 누락된 환경 변수가 있습니다:\n${missing.map((k) => `   - ${k}`).join("\n")}\n` +
      `   .env 파일을 확인해 주세요. (.env.example 참고)`
    );
  }
}
