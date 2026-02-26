const fs = require('fs');

const koTranslations = {
  g1: {
    u1: { title: "1학기 - 9까지의 수", t1: "가르기와 모으기" },
    u2: { title: "1학기 - 덧셈과 뺄셈", t1: "1) 한 자리 덧셈 (합 ≤ 9)", t2: "2) 한 자리 뺄셈" },
    u3: { title: "1학기 - 50까지의 수", t1: "수 세기와 크기 비교" },
    u4: { title: "2학기 - 100까지의 수", t1: "수 세기와 크기 비교" },
    u5: { title: "2학기 - 덧셈과 뺄셈(1)", t1: "1) (몇십) + (몇)", t2: "2) 한 자리 덧셈 (합 > 9)" },
    u6: { title: "2학기 - 덧셈과 뺄셈(2)", t1: "1) (몇십몇) + (몇) 받아올림 없음", t2: "2) (몇십몇) - (몇) 받아내림 없음" },
    u7: { title: "2학기 - 덧셈과 뺄셈(3)", t1: "1) 세 수의 덧셈", t2: "2) 세 수의 뺄셈" }
  },
  g2: {
    u1: { title: "1학기 - 세 자리 수", t1: "수 읽기와 쓰기" },
    u2: { title: "1학기 - 덧셈과 뺄셈", t1: "1) 두 자리 덧셈 (받아올림)", t2: "2) 두 자리 뺄셈 (받아내림)", t3: "📝 덧셈·뺄셈 서술형" },
    u3: { title: "1학기 - 곱셈", t1: "곱셈의 기초" },
    u4: { title: "2학기 - 네 자리 수", t1: "수 읽기와 쓰기" },
    u5: { title: "2학기 - 곱셈구구", t1: "1) 2단", t2: "2) 3단", t3: "3) 4단", t4: "4) 5단", t5: "5) 6~9단 혼합" }
  },
  g3: {
    u1: { title: "1학기 - 덧셈과 뺄셈", t1: "1) 세 자리 덧셈", t2: "2) 세 자리 뺄셈" },
    u2: { title: "1학기 - 평면도형", t1: "기본 평면도형" },
    u3: { title: "1학기 - 나눗셈", t1: "나눗셈 기초" },
    u4: { title: "1학기 - 곱셈", t1: "(두 자리) × (한 자리)", t2: "📝 곱셈 서술형" },
    u5: { title: "1학기 - 분수와 소수", t1: "분수·소수 기초" },
    u6: { title: "2학기 - 곱셈", t1: "(두 자리) × (두 자리)" },
    u7: { title: "2학기 - 나눗셈", t1: "나머지 있는 나눗셈" },
    u8: { title: "2학기 - 분수", t1: "1) 대분수를 가분수로", t2: "2) 가분수를 대분수로" }
  },
  g4: {
    u1: { title: "1학기 - 큰 수", t1: "만 단위 이상 수 읽기" },
    u2: { title: "1학기 - 곱셈과 나눗셈", t1: "1) 세 자리 × 두 자리 곱셈", t2: "2) 두~세 자리 나눗셈", t3: "📝 나눗셈 서술형" },
    u3: { title: "1학기 - 각도", t1: "각도 계산" },
    u4: { title: "1학기 - 삼각형", t1: "삼각형 분류" },
    u5: { title: "2학기 - 분수의 덧셈과 뺄셈", t1: "1) 같은 분모 분수 덧셈", t2: "2) 같은 분모 분수 뺄셈", t3: "📝 분수 서술형" },
    u6: { title: "2학기 - 소수의 덧셈과 뺄셈", t1: "1) 소수 덧셈", t2: "2) 소수 뺄셈" }
  },
  g5: {
    u1: { title: "1학기 - 자연수의 혼합 계산", t1: "곱셈·덧셈 혼합" },
    u2: { title: "1학기 - 약수와 배수", t1: "약수와 배수 구하기" },
    u3: { title: "1학기 - 약분과 통분", t1: "약분하기" },
    u4: { title: "1학기 - 분수의 덧셈과 뺄셈", t1: "이분모 분수의 덧셈", t2: "📝 분수 서술형" },
    u5: { title: "1학기 - 다각형의 넓이", t1: "넓이 계산" },
    u6: { title: "2학기 - 수의 범위와 어림하기", t1: "반올림하기" },
    u7: { title: "2학기 - 분수의 곱셈", t1: "(분수) × (자연수)" },
    u8: { title: "2학기 - 소수의 곱셈", t1: "(소수) × (자연수)" }
  },
  g6: {
    u1: { title: "1학기 - 분수의 나눗셈", t1: "(분수) ÷ (자연수)" },
    u2: { title: "1학기 - 소수의 나눗셈", t1: "(소수) ÷ (자연수)" },
    u3: { title: "1학기 - 비와 비율", t1: "비율을 분수로 나타내기" },
    u4: { title: "1학기 - 원의 넓이", t1: "원의 넓이와 둘레" },
    u5: { title: "1학기 - 직육면체의 부피", t1: "부피와 겉넓이" },
    u6: { title: "2학기 - 분수의 나눗셈", t1: "(분수) ÷ (자연수)" },
    u7: { title: "2학기 - 소수의 나눗셈", t1: "(소수) ÷ (소수)" },
    u8: { title: "2학기 - 비례식과 비례배분", t1: "비례식 풀기" }
  }
};

const enTranslations = {
  g1: {
    u1: { title: "Sem 1 - Numbers Up to 9", t1: "Splitting and Gathering" },
    u2: { title: "Sem 1 - Addition & Subtraction", t1: "1) 1-Digit Add (Sum <= 9)", t2: "2) 1-Digit Subtract" },
    u3: { title: "Sem 1 - Numbers Up to 50", t1: "Counting & Comparing" },
    u4: { title: "Sem 2 - Numbers Up to 100", t1: "Counting & Comparing" },
    u5: { title: "Sem 2 - Add & Sub (1)", t1: "1) Tens + Ones", t2: "2) 1-Digit Add (Sum > 9)" },
    u6: { title: "Sem 2 - Add & Sub (2)", t1: "1) 2-Digit + 1-Digit (No Carry)", t2: "2) 2-Digit - 1-Digit (No Borrow)" },
    u7: { title: "Sem 2 - Add & Sub (3)", t1: "1) Three Numbers Add", t2: "2) Three Numbers Sub" }
  },
  g2: {
    u1: { title: "Sem 1 - 3-Digit Numbers", t1: "Reading & Writing Numbers" },
    u2: { title: "Sem 1 - Add & Subtraction", t1: "1) 2-Digit Add (Carry)", t2: "2) 2-Digit Sub (Borrow)", t3: "Word Problems" },
    u3: { title: "Sem 1 - Multiplication", t1: "Basics of Multiplication" },
    u4: { title: "Sem 2 - 4-Digit Numbers", t1: "Reading & Writing Numbers" },
    u5: { title: "Sem 2 - Times Tables", t1: "1) x2", t2: "2) x3", t3: "3) x4", t4: "4) x5", t5: "5) x6 to x9 Mixed" }
  },
  g3: {
    u1: { title: "Sem 1 - Add & Subtraction", t1: "1) 3-Digit Add", t2: "2) 3-Digit Sub" },
    u2: { title: "Sem 1 - Plane Figures", t1: "Basic Plane Figures" },
    u3: { title: "Sem 1 - Division", t1: "Basics of Division" },
    u4: { title: "Sem 1 - Multiplication", t1: "2-Digit x 1-Digit", t2: "Word Problems" },
    u5: { title: "Sem 1 - Fractions & Decimals", t1: "Basics" },
    u6: { title: "Sem 2 - Multiplication", t1: "2-Digit x 2-Digit" },
    u7: { title: "Sem 2 - Division", t1: "Division with Remainders" },
    u8: { title: "Sem 2 - Fractions", t1: "1) Mixed to Improper", t2: "2) Improper to Mixed" }
  },
  g4: {
    u1: { title: "Sem 1 - Large Numbers", t1: "Reading >10,000 Numbers" },
    u2: { title: "Sem 1 - Multiply & Divide", t1: "1) 3-Digit x 2-Digit", t2: "2) Long Division", t3: "Word Problems" },
    u3: { title: "Sem 1 - Angles", t1: "Calculating Angles" },
    u4: { title: "Sem 1 - Triangles", t1: "Triangle Types" },
    u5: { title: "Sem 2 - Fractions Add/Sub", t1: "1) Add Same Denom", t2: "2) Sub Same Denom", t3: "Word Problems" },
    u6: { title: "Sem 2 - Decimals Add/Sub", t1: "1) Decimal Add", t2: "2) Decimal Sub" }
  },
  g5: {
    u1: { title: "Sem 1 - Mixed Operations", t1: "Multiply & Add Together" },
    u2: { title: "Sem 1 - Factors & Multiples", t1: "GCF & LCM" },
    u3: { title: "Sem 1 - Fractions Simp/Comm", t1: "Simplifying Fractions" },
    u4: { title: "Sem 1 - Fractions Add/Sub", t1: "Unlike Denoms Add", t2: "Word Problems" },
    u5: { title: "Sem 1 - Polygon Area", t1: "Area Calculation" },
    u6: { title: "Sem 2 - Number Ranges", t1: "Rounding" },
    u7: { title: "Sem 2 - Fraction Multiply", t1: "Fraction x Whole Number" },
    u8: { title: "Sem 2 - Decimal Multiply", t1: "Decimal x Whole Number" }
  },
  g6: {
    u1: { title: "Sem 1 - Fraction Divide", t1: "Fraction / Whole Number" },
    u2: { title: "Sem 1 - Decimal Divide", t1: "Decimal / Whole Number" },
    u3: { title: "Sem 1 - Ratios", t1: "Ratio to Fraction" },
    u4: { title: "Sem 1 - Circles", t1: "Circle Area & Perimeter" },
    u5: { title: "Sem 1 - Cuboid Volume", t1: "Volume & Surface Area" },
    u6: { title: "Sem 2 - Fraction Divide 2", t1: "Fraction / Fraction" },
    u7: { title: "Sem 2 - Decimal Divide 2", t1: "Decimal / Decimal" },
    u8: { title: "Sem 2 - Proportions", t1: "Solving Proportions" }
  }
};

const jaTranslations = {
  g1: {
    u1: { title: "1学期 - 9までの数", t1: "分けること・集めること" },
    u2: { title: "1学期 - たし算とひき算", t1: "1) 1桁の足し算 (和<=9)", t2: "2) 1桁の引き算" },
    u3: { title: "1学期 - 50までの数", t1: "数えること・比べること" },
    u4: { title: "2学期 - 100までの数", t1: "数えること・比べること" },
    u5: { title: "2学期 - たし算とひき算(1)", t1: "1) 10のまとまり + 端数", t2: "2) 1桁の足し算 (和>9)" },
    u6: { title: "2学期 - たし算とひき算(2)", t1: "1) 繰り上がりのない足し算", t2: "2) 繰り下がりのない引き算" },
    u7: { title: "2学期 - たし算とひき算(3)", t1: "1) 3つの数の足し算", t2: "2) 3つの数の引き算" }
  },
  g2: {
    u1: { title: "1学期 - 3桁の数", t1: "数の読み書き" },
    u2: { title: "1学期 - たし算とひき算", t1: "1) 繰り上がりのある足し算", t2: "2) 繰り下がりのある引き算", t3: "文章題" },
    u3: { title: "1学期 - かけ算", t1: "かけ算の基礎" },
    u4: { title: "2学期 - 4桁の数", t1: "数の読み書き" },
    u5: { title: "2学期 - かけ算九九", t1: "1) 2の段", t2: "2) 3の段", t3: "3) 4の段", t4: "4) 5の段", t5: "5) 6〜9の段(混合)" }
  },
  g3: {
    u1: { title: "1学期 - たし算とひき算", t1: "1) 3桁の足し算", t2: "2) 3桁の引き算" },
    u2: { title: "1学期 - 平面図形", t1: "基本の平面図形" },
    u3: { title: "1学期 - わり算", t1: "わり算の基礎" },
    u4: { title: "1学期 - かけ算", t1: "2桁 x 1桁", t2: "文章題" },
    u5: { title: "1学期 - 分数と小数", t1: "基礎" },
    u6: { title: "2学期 - かけ算", t1: "2桁 x 2桁" },
    u7: { title: "2学期 - わり算", t1: "あまりのあるわり算" },
    u8: { title: "2学期 - 分数", t1: "1) 帯分数から仮分数へ", t2: "2) 仮分数から帯分数へ" }
  },
  g4: {
    u1: { title: "1学期 - 大きな数", t1: "万以上の数の読み方" },
    u2: { title: "1学期 - かけ算とわり算", t1: "1) 3桁 x 2桁", t2: "2) 筆算のわり算", t3: "文章題" },
    u3: { title: "1学期 - 角度", t1: "角度の計算" },
    u4: { title: "1学期 - 三角形", t1: "三角形の分類" },
    u5: { title: "2学期 - 分数のたし算とひき算", t1: "1) 同分母の足し算", t2: "2) 同分母の引き算", t3: "文章題" },
    u6: { title: "2学期 - 小数のたし算とひき算", t1: "1) 小数の足し算", t2: "2) 小数の引き算" }
  },
  g5: {
    u1: { title: "1学期 - 自然数の混合計算", t1: "かけ算・たし算の混合" },
    u2: { title: "1学期 - 約数と倍数", t1: "最大公約数と最小公倍数" },
    u3: { title: "1学期 - 約分と通分", t1: "約分する" },
    u4: { title: "1学期 - 分数のたし算とひき算", t1: "異分母の足し算", t2: "文章題" },
    u5: { title: "1学期 - 多角形の面積", t1: "面積の計算" },
    u6: { title: "2学期 - 数の範囲と概数", t1: "四捨五入" },
    u7: { title: "2学期 - 分数のかけ算", t1: "分数 x 整数" },
    u8: { title: "2学期 - 小数のかけ算", t1: "小数 x 整数" }
  },
  g6: {
    u1: { title: "1学期 - 分数のわり算", t1: "分数 / 整数" },
    u2: { title: "1学期 - 小数のわり算", t1: "小数 / 整数" },
    u3: { title: "1学期 - 比と割合", t1: "割合を分数で表す" },
    u4: { title: "1学期 - 円の面積", t1: "円の面積と円周" },
    u5: { title: "1学期 - 直方体の体積", t1: "体積と表面積" },
    u6: { title: "2学期 - 分数のわり算(2)", t1: "分数 / 分数" },
    u7: { title: "2学期 - 小数のわり算(2)", t1: "小数 / 小数" },
    u8: { title: "2学期 - 比例式と比例配分", t1: "比例式を解く" }
  }
};

const code = fs.readFileSync('lib/i18n.ts', 'utf-8');

const koString = JSON.stringify(koTranslations, null, 6).replace(/\n/g, '\n      ');
const enString = JSON.stringify(enTranslations, null, 6).replace(/\n/g, '\n      ');
const jaString = JSON.stringify(jaTranslations, null, 6).replace(/\n/g, '\n      ');

const finalCode = code
  .replace(/(ko: \{\s*translation: \{\s*)("home": \{)/, `$1"curriculum": ${koString},\n      $2`)
  .replace(/(en: \{\s*translation: \{\s*)("home": \{)/, `$1"curriculum": ${enString},\n      $2`)
  .replace(/(ja: \{\s*translation: \{\s*)("home": \{)/, `$1"curriculum": ${jaString},\n      $2`);

fs.writeFileSync('lib/i18n.ts', finalCode);
console.log('Successfully patched i18n.ts');
