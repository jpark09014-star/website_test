/**
 * 배너 광고 컴포넌트
 *
 * [왜 이렇게 설계했는가]
 * - AdMob은 네이티브(iOS/Android) 전용이므로 웹에서는 플레이스홀더를 보여줍니다.
 * - Platform.OS 분기로 네이티브 모듈 import가 웹 번들러에서 실행되지 않게 합니다.
 * - 개발 중에는 구글 공식 테스트 광고 ID를 사용하며,
 *   실 서비스 시 .env의 EXPO_PUBLIC_ADMOB_BANNER_ID로 교체됩니다.
 */
import React, { useState } from 'react';
import { View, Text, Platform } from 'react-native';
import { ADMOB_CONFIG } from '@/config/env';

/** 개발/테스트용 구글 공식 배너 광고 테스트 ID */
const TEST_BANNER_ID = 'ca-app-pub-3940256099942544/9214589741';

export default function AdBanner({ className = '' }: { className?: string }) {
  const [hasError, setHasError] = useState(false);

  // ── 웹: 레이아웃용 플레이스홀더 ────────────────────────────────
  if (Platform.OS === 'web') {
    return (
      <View
        className={`items-center justify-center bg-gray-100 border border-dashed border-gray-300 rounded-lg mx-4 my-2 ${className}`}
        style={{ height: 60 }}
      >
        <Text className="text-gray-400 text-xs">
          📢 광고 영역 (네이티브 빌드에서 실제 광고 표시)
        </Text>
      </View>
    );
  }

  // ── 네이티브: 실제 AdMob 배너 ─────────────────────────────────
  // 웹 번들러가 react-native-google-mobile-ads를 읽지 않도록
  // 조건부 동적 import를 사용합니다.
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { BannerAd, BannerAdSize } = require('react-native-google-mobile-ads');

  const adUnitId = __DEV__
    ? TEST_BANNER_ID
    : (ADMOB_CONFIG.bannerAdUnitId ?? TEST_BANNER_ID);

  if (hasError) return <View style={{ height: 0 }} />;

  return (
    <View className={`items-center my-2 ${className}`}>
      <BannerAd
        unitId={adUnitId}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        requestOptions={{ requestNonPersonalizedAdsOnly: false }}
        onAdFailedToLoad={(error: unknown) => {
          console.warn('[AdBanner] 광고 로딩 실패:', error);
          setHasError(true);
        }}
      />
    </View>
  );
}
