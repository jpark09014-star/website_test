/**
 * react-native-google-mobile-ads 웹 플랫폼용 Mock
 *
 * [왜 필요한가]
 * - react-native-google-mobile-ads는 네이티브(iOS/Android) 전용 패키지입니다.
 * - 웹 번들러(Metro)가 이 패키지를 그대로 읽으면 모듈 해석 오류가 발생합니다.
 * - metro.config.js에서 웹 빌드 시 이 mock 파일로 대체합니다.
 */

// 실제 AdMob 기능은 아무 동작도 하지 않는 빈 구현체로 대체
const BannerAd = () => null;
const InterstitialAd = { createForAdRequest: () => ({ load: () => {}, show: () => {} }) };
const RewardedAd = { createForAdRequest: () => ({ load: () => {}, show: () => {} }) };
const BannerAdSize = { ANCHORED_ADAPTIVE_BANNER: 'ANCHORED_ADAPTIVE_BANNER', BANNER: 'BANNER' };
const TestIds = { BANNER: '', INTERSTITIAL: '', REWARDED: '' };
const AdEventType = {};
const RewardedAdEventType = {};

module.exports = {
  BannerAd,
  InterstitialAd,
  RewardedAd,
  BannerAdSize,
  TestIds,
  AdEventType,
  RewardedAdEventType,
};
