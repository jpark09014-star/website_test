const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");
const path = require("path");

const config = getDefaultConfig(__dirname);

// 웹 빌드 시 react-native-google-mobile-ads를 빈 mock으로 교체
// (AdMob은 네이티브 전용이므로 웹 번들러가 모듈을 해석하면 오류 발생)
const originalResolveRequest = config.resolver?.resolveRequest;
config.resolver = {
  ...config.resolver,
  resolveRequest: (context, moduleName, platform) => {
    if (
      platform === "web" &&
      moduleName === "react-native-google-mobile-ads"
    ) {
      return {
        filePath: path.resolve(__dirname, "mocks/react-native-google-mobile-ads.js"),
        type: "sourceFile",
      };
    }
    if (originalResolveRequest) {
      return originalResolveRequest(context, moduleName, platform);
    }
    return context.resolveRequest(context, moduleName, platform);
  },
};

module.exports = withNativeWind(config, { input: "./global.css" });

