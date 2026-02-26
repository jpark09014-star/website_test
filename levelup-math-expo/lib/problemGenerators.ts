/**
 * 초등학교 수학 학습지 문제 생성 모듈
 *
 * [왜 이렇게 설계했는가]
 * - 교육과정에 맞게 학기 -> 단원 -> 세부 주제(받아올림 여부 등)로 구조를 세분화합니다.
 * - 시각적 표현(세로셈, 분수, 도형)을 독립된 타입으로 분리하여 UI 렌더링 책임을 명확히 합니다.
 * - Set을 사용해 문제가 절대 겹치지 않게 보장합니다.
 * - 난이도(easy/normal/hard)별로 숫자 범위와 연산 복잡도를 조절합니다.
 */

// 도형 문제 생성기 (별도 파일에서 분리)
import {
  gen3_shapeBasic,
  gen4_angleCalc,
  gen4_triangleType,
  gen5_area,
  gen6_circleArea,
  gen6_volume,
} from "./geometryGenerators";

export type Difficulty = "easy" | "normal" | "hard";
export type Language = "ko" | "en" | "ja";

/**
 * [I18N] 문제 지시문 및 공통 텍스트 번역 데이터
 */
const I18N_MAP: Record<Language, Record<string, string>> = {
  ko: {
    "add_3d": "세 자리 수의 덧셈을 하세요.",
    "sub_3d": "세 자리 수의 뺄셈을 하세요.",
    "mul_3d1d": "곱셈을 하세요.",
    "div_2d1d": "나머지가 없는 나눗셈을 하세요.",
    "div_2d1d_rem": "나머지가 있는 나눗셈을 하세요.",
    "frac_add": "분수의 덧셈을 하세요.",
    "frac_sub": "분수의 뺄셈을 하세요.",
    "frac_compare": "두 분수의 크기를 비교하여 > , = , < 를 써넣으세요.",
    "mixed_to_imp": "대분수를 가분수로 나타내어 보세요.",
    "imp_to_mixed": "가분수를 대분수로 나타내어 보세요.",
    "frac_intro": "색칠된 부분을 분수로 나타내세요.",
    "frac_intro_q": "색칠된 부분은 전체의 얼마인가요?",
    "large_read": "다음 수를 한글로 읽어 보세요.",
    "large_write": "다음 수를 숫자로 써 보세요.",
    "large_place": "빈칸에 알맞은 수를 쓰세요.",
    "round_100": "백의 자리에서 반올림하세요.",
    "round_10": "십의 자리에서 반올림하세요.",
    "approx_q": "약",
    "word_prob": "다음 문제를 풀어보세요.",
    "mul_3d2d": "곱셈을 하세요.",
    "add_math": "덧셈을 하세요.",
    "sub_math": "뺄셈을 하세요.",
    "mul_math": "곱셈을 하세요.",
    "mul_table": "곱셈구구를 구하세요.",
    "blank_num": "빈칸에 알맞은 수를 쓰세요.",
    "frac_div": "분수의 나눗셈을 하세요.",
    "dec_div": "소수의 나눗셈을 하세요.",
    "calc_order": "식을 계산하세요.",
    "simplify": "약분하세요.",
    "frac_mul": "분수의 곱셈을 하세요.",
    "dec_mul": "소수의 곱셈을 하세요.",
    "dec_add": "소수의 덧셈을 하세요.",
    "dec_sub": "소수의 뺄셈을 하세요.",
    "div_math": "나눗셈을 하세요.",
    "frac_add_diff": "분모가 다른 분수의 덧셈을 하세요."
  },
  en: {
    "add_3d": "Add the three-digit numbers.",
    "sub_3d": "Subtract the three-digit numbers.",
    "mul_3d1d": "Multiply the numbers.",
    "div_2d1d": "Divide the numbers (no remainder).",
    "div_2d1d_rem": "Divide the numbers (with remainder).",
    "frac_add": "Add the fractions.",
    "frac_sub": "Subtract the fractions.",
    "frac_compare": "Compare the fractions and write > , = , < .",
    "mixed_to_imp": "Convert the mixed number to an improper fraction.",
    "imp_to_mixed": "Convert the improper fraction to a mixed number.",
    "frac_intro": "Express the shaded part as a fraction.",
    "frac_intro_q": "How much of the whole is shaded?",
    "large_read": "Read the following number.",
    "large_write": "Write the following number in digits.",
    "large_place": "Fill in the blank with the correct number.",
    "round_100": "Round to the nearest hundred.",
    "round_10": "Round to the nearest ten.",
    "approx_q": "approx.",
    "word_prob": "Solve the problem below.",
    "mul_3d2d": "Multiply the numbers.",
    "add_math": "Solve the addition.",
    "sub_math": "Solve the subtraction.",
    "mul_math": "Solve the multiplication.",
    "mul_table": "Solve the multiplication table.",
    "blank_num": "Fill in the blank with the correct number.",
    "frac_div": "Divide the fractions.",
    "dec_div": "Divide the decimals.",
    "calc_order": "Calculate using order of operations.",
    "simplify": "Simplify the fraction.",
    "frac_mul": "Multiply the fractions.",
    "dec_mul": "Multiply the decimals.",
    "dec_add": "Add the decimals.",
    "dec_sub": "Subtract the decimals.",
    "div_math": "Solve the division.",
    "frac_add_diff": "Add the fractions with different denominators."
  },
  ja: {
    "add_3d": "3桁の足し算をしましょう。",
    "sub_3d": "3桁の引き算をしましょう。",
    "mul_3d1d": "掛け算をしましょう。",
    "div_2d1d": "割り切れる割り算をしましょう。",
    "div_2d1d_rem": "あまりのある割り算をしましょう。",
    "frac_add": "分数の足し算をしましょう。",
    "frac_sub": "分数の引き算をしましょう。",
    "frac_compare": "分数の大きさを比較して > , = , < を書き入れましょう。",
    "mixed_to_imp": "帯分数を仮分数に直しましょう。",
    "imp_to_mixed": "仮分数を帯分数に直しましょう。",
    "frac_intro": "色を塗った部分を分数で表しましょう。",
    "frac_intro_q": "色を塗った部分は全体のどれくらいですか？",
    "large_read": "次の数を読みましょう。",
    "large_write": "次の数を数字で書いてみましょう。",
    "large_place": "空欄に当てはまる数を書きましょう。",
    "round_100": "百の位で四捨五入しましょう。",
    "round_10": "十の位で四捨五入しましょう。",
    "approx_q": "約",
    "word_prob": "次の問題を解きましょう。",
    "mul_3d2d": "掛け算をしましょう。",
    "add_math": "足し算をしましょう。",
    "sub_math": "引き算をしましょう。",
    "mul_math": "掛け算をしましょう。",
    "mul_table": "九九の計算をしましょう。",
    "blank_num": "空欄に当てはまる数を書きましょう。",
    "frac_div": "分数の割り算をしましょう。",
    "dec_div": "小数の割り算をしましょう。",
    "calc_order": "式を計算しましょう。",
    "simplify": "約分しましょう。",
    "frac_mul": "分数のかけ算をしましょう。",
    "dec_mul": "小数のかけ算をしましょう。",
    "dec_add": "小数のたし算をしましょう。",
    "dec_sub": "小数のひき算をしましょう。",
    "div_math": "割り算をしましょう。",
    "frac_add_diff": "異分母分数のたし算をしましょう。"
  }
};

export function t(key: string, lang: Language): string {
  return I18N_MAP[lang]?.[key] || I18N_MAP['en']?.[key] || key;
}

export interface Problem {
  id: number;
  instruction?: string;
  question: string;
  answer: string;
  /** KaTeX 수식 문자열 (예: "\\frac{3}{4} + \\frac{1}{4}") */
  equation?: string;
  /** 객관식 선택지 (4~5지선다) */
  choices?: string[];
  visual?:
    | { type: "vertical_math"; operator: "+" | "-" | "×"; top: number; bottom: number }
    | { type: "fraction"; whole?: number; numerator: number; denominator: number }
    | { type: "clock"; hour: number; minute: number }
    | {
        type: "grouping";
        category: "group" | "split";
        total: number | "?";
        part1: number | "?";
        part2: number | "?";
      }
    | {
        // 도형 렌더링용 (직사각형, 삼각형, 원, 사다리꼴)
        type: "shape";
        shape: "rectangle" | "triangle" | "circle" | "trapezoid" | "rectangular_prism";
        dimensions: Record<string, number>;
        unit: string;
      };
}

// ─── 유틸리티 ────────────────────────────────────────────────

export const randInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

/** 배열에서 랜덤 선택 */
const pick = <T>(arr: T[]): T => arr[randInt(0, arr.length - 1)];

/** 정답 근처에서 오답 선택지 생성 (숫자형) */
export function generateDistractors(answer: number, count: number = 4, range: number = 5): number[] {
  const distractors = new Set<number>();
  let attempts = 0;
  while (distractors.size < count && attempts < 100) {
    attempts++;
    const offset = randInt(1, range) * pick([-1, 1]);
    const d = answer + offset;
    if (d > 0 && d !== answer) distractors.add(d);
  }
  return Array.from(distractors).slice(0, count);
}

/** 선택지를 섞어서 반환 (정답 포함) */
export function shuffleChoices(answer: string, distractors: string[]): string[] {
  const all = [answer, ...distractors];
  // Fisher-Yates 셔플
  for (let i = all.length - 1; i > 0; i--) {
    const j = randInt(0, i);
    [all[i], all[j]] = [all[j], all[i]];
  }
  return all;
}

function generateUnique(
  count: number,
  generator: (lang: Language) => Omit<Problem, "id"> & { key: string },
  lang: Language = "ko",
  maxAttempts = 2000
): Problem[] {
  const seen = new Set<string>();
  const problems: Problem[] = [];
  let attempts = 0;
  while (problems.length < count && attempts < maxAttempts) {
    attempts++;
    const { key, instruction, question, answer, visual, equation, choices } = generator(lang) as Omit<Problem, "id"> & { key: string };
    if (!seen.has(key)) {
      seen.add(key);
      problems.push({ id: problems.length + 1, instruction, question, answer, visual, equation, choices });
    }
  }
  return problems;
}

// ══════════════════════════════════════════════════════════════
// 1학년 생성기
// ══════════════════════════════════════════════════════════════

// 1학년 1학기: 9까지의 수 - 가르기와 모으기
function gen1_counting(count: number, diff: Difficulty = "normal", lang: Language = "ko") {
  return generateUnique(count, (l) => {
    const total = randInt(2, 9);
    const part1 = randInt(1, total - 1);
    const part2 = total - part1;
    
    const isSplit = Math.random() < 0.5;
    let questionType;
    let answerNum;
    const visualTotal: number | "?" = isSplit ? total : "?";
    
    if (isSplit) {
      // 가르기: total은 알고, part1이나 part2 중 하나를 구함
      questionType = Math.random() < 0.5 ? 1 : 2;
      answerNum = questionType === 1 ? part1 : part2;
    } else {
      // 모으기: part1, part2를 알고 total을 구함
      questionType = 0;
      answerNum = total;
    }

    return {
      key: `split_gather_${total}_${part1}_${isSplit ? 'split' : 'gather'}_${questionType}`,
      instruction: l === 'ko' ? "빈칸에 알맞은 수를 쓰세요." : "Fill in the blank.",
      question: l === 'ko' ? (isSplit ? "몇과 몇으로 가를 수 있을까요?" : "두 수를 모으면 얼마일까요?") : (isSplit ? "Split the number." : "Combine the numbers."),
      answer: String(answerNum),
      visual: {
        type: "grouping",
        category: isSplit ? "split" : "group",
        total: visualTotal,
        part1: questionType === 1 ? "?" : part1,
        part2: questionType === 2 ? "?" : part2,
      },
    };
  }, lang);
}

// 1학년 1학기: 한 자리 덧셈 (합 ≤ 9)
function gen1_addSingle(count: number, diff: Difficulty = "normal", lang: Language = "ko") {
  return generateUnique(count, (l) => {
    const a = randInt(1, 8);
    const b = randInt(1, 9 - a);
    return {
      key: `${a}+${b}`,
      instruction: t("add_math", l), // Using a generic add key for simplicity
      question: `${a} + ${b} = `,
      answer: String(a + b),
    };
  }, lang);
}

// 1학년 1학기: 한 자리 뺄셈
function gen1_subSingle(count: number, diff: Difficulty = "normal", lang: Language = "ko") {
  return generateUnique(count, (l) => {
    const a = randInt(2, 9);
    const b = randInt(1, a - 1);
    return {
      key: `${a}-${b}`,
      instruction: t("sub_math", l),
      question: `${a} - ${b} = `,
      answer: String(a - b),
    };
  }, lang);
}

// 1학년 2학기: 덧셈과 뺄셈(1) - 받아올림 없는 (몇십)+(몇)
function gen1_addTensPlusOnes(count: number, diff: Difficulty = "normal", lang: Language = "ko") {
  return generateUnique(count, (l) => {
    const tens = randInt(1, 8) * 10;
    const ones = randInt(1, 9);
    return {
      key: `${tens}+${ones}`,
      instruction: t("add_math", l),
      question: `${tens} + ${ones} = `,
      answer: String(tens + ones),
    };
  }, lang);
}

// 1학년 2학기: 덧셈과 뺄셈(2) - (몇십몇)+(몇십몇) 받아올림 없음
function gen1_add2d2dNoCarry(count: number, diff: Difficulty = "normal", lang: Language = "ko") {
  return generateUnique(count, (l) => {
    const tensA = randInt(1, 8);
    const onesA = randInt(1, 8);
    const tensB = randInt(1, 9 - tensA); // 두 자리 수
    const onesB = randInt(1, 9 - onesA); // 받아올림 없도록
    const a = tensA * 10 + onesA;
    const b = tensB * 10 + onesB;
    return {
      key: `${a}+${b}`,
      instruction: t("add_math", l),
      question: `${a} + ${b} = `,
      answer: String(a + b),
      visual: { type: "vertical_math" as const, operator: "+" as const, top: a, bottom: b },
    };
  }, lang);
}

// 1학년 2학기: 덧셈과 뺄셈(3) - (몇십몇)-(몇십몇) 받아내림 없음
function gen1_sub2d2dNoBorrow(count: number, diff: Difficulty = "normal", lang: Language = "ko") {
  return generateUnique(count, (l) => {
    const tensA = randInt(2, 9);
    const onesA = randInt(2, 9);
    const tensB = randInt(1, tensA - 1); // 두 자리 수, 결과가 양수이도록
    const onesB = randInt(1, onesA); // 받아내림 없도록
    const a = tensA * 10 + onesA;
    const b = tensB * 10 + onesB;
    return {
      key: `${a}-${b}`,
      instruction: t("sub_math", l),
      question: `${a} - ${b} = `,
      answer: String(a - b),
      visual: { type: "vertical_math" as const, operator: "-" as const, top: a, bottom: b },
    };
  }, lang);
}

// ══════════════════════════════════════════════════════════════
// 2학년 생성기
// ══════════════════════════════════════════════════════════════

// 숫자를 한글로 변환하는 헬퍼 함수 (최대 4자리)
function numToKorean4D(num: number): string {
  const digits = ["", "일", "이", "삼", "사", "오", "육", "칠", "팔", "구"];
  const th = Math.floor(num / 1000);
  const h = Math.floor((num % 1000) / 100);
  const tens_d = Math.floor((num % 100) / 10);
  const o = num % 10;
  
  let str = "";
  if (th > 0) str += (th === 1 ? "" : digits[th]) + "천";
  if (h > 0) str += (h === 1 ? "" : digits[h]) + "백";
  if (tens_d > 0) str += (tens_d === 1 ? "" : digits[tens_d]) + "십";
  if (o > 0) str += digits[o];
  return str || "영";
}

// 2학년 1학기: 세 자리 수 - 수 읽기/쓰기/자릿수
function gen2_threeDigitNum(count: number, difficulty: Difficulty = "normal", lang: Language = "ko") {
  return generateUnique(count, (l) => {
    const hundreds = randInt(1, 9);
    const tens = randInt(0, 9);
    const ones = randInt(1, 9);
    const num = hundreds * 100 + tens * 10 + ones;
    const kor = numToKorean4D(num);
    const type = randInt(0, 2);

    if (type === 0) {
      return {
        key: `3digit_read_${num}`,
        instruction: l === 'ko' ? "다음 수를 한글로 읽어 보세요." : l === 'ja' ? "次の数を読んでみましょう。" : "Read the following number.",
        question: `${num} = `,
        answer: kor,
      };
    } else if (type === 1) {
      return {
        key: `3digit_write_${num}`,
        instruction: l === 'ko' ? "다음 수를 숫자로 써 보세요." : l === 'ja' ? "次の数を数字で書いてみましょう。" : "Write the following number in digits.",
        question: `[ ${kor} ] = `,
        answer: String(num),
      };
    } else {
      let q = l === 'ko' ? `100이 ${hundreds}개, 10이 ${tens}개, 1이 ${ones}개인 수 = ` : l === 'ja' ? `100が${hundreds}個、10が${tens}個、1が${ones}個の数 = ` : `The number with ${hundreds} hundreds, ${tens} tens, and ${ones} ones = `;
      return {
        key: `3digit_place_${num}`,
        instruction: t("blank_num", l),
        question: q,
        answer: String(num),
      };
    }
  }, lang);
}

// 2학년 1학기: 덧셈 (받아올림 있음)
function gen2_add2dWithCarry(count: number, difficulty: Difficulty = "normal", lang: Language = "ko") {
  return generateUnique(count, (l) => {
    const onesA = randInt(1, 9);
    const onesB = randInt(10 - onesA, 9);
    const tensA = randInt(1, 8);
    const tensB = randInt(1, 8 - tensA);
    const a = tensA * 10 + onesA;
    const b = tensB * 10 + onesB;
    return {
      key: `${a}+${b}`,
      instruction: t("add_math", l),
      question: `${a} + ${b} = `,
      answer: String(a + b),
      visual: { type: "vertical_math" as const, operator: "+" as const, top: a, bottom: b },
    };
  }, lang);
}

// 2학년 1학기: 뺄셈 (받아내림 있음)
function gen2_sub2dWithBorrow(count: number, difficulty: Difficulty = "normal", lang: Language = "ko") {
  return generateUnique(count, (l) => {
    const onesB = randInt(2, 9);
    const onesA = randInt(0, onesB - 1);
    const tensA = randInt(3, 9);
    const tensB = randInt(1, tensA - 1);
    const a = tensA * 10 + onesA;
    const b = tensB * 10 + onesB;
    return {
      key: `${a}-${b}`,
      instruction: t("sub_math", l),
      question: `${a} - ${b} = `,
      answer: String(a - b),
      visual: { type: "vertical_math" as const, operator: "-" as const, top: a, bottom: b },
    };
  }, lang);
}

// 2학년 1학기: 곱셈 개념 (같은 수 더하기 → 곱셈)
function gen2_mulIntro(count: number, difficulty: Difficulty = "normal", lang: Language = "ko") {
  return generateUnique(count, (l) => {
    const a = randInt(2, 5);
    const b = randInt(2, 5);
    return {
      key: `mulintro_${a}x${b}`,
      instruction: l === 'ko' ? "곱셈으로 나타내고 답을 구하세요." : "Express as multiplication and find the answer.",
      question: `${a} × ${b} = `,
      answer: String(a * b),
    };
  }, lang);
}

// 2학년 2학기: 네 자리 수 - 수 읽기/쓰기/자릿수
function gen2_fourDigitNum(count: number, difficulty: Difficulty = "normal", lang: Language = "ko") {
  return generateUnique(count, (l) => {
    const th_d = randInt(1, 9);
    const h_d = randInt(0, 9);
    const t_d = randInt(0, 9);
    const o_d = randInt(1, 9);
    const num = th_d * 1000 + h_d * 100 + t_d * 10 + o_d;
    const kor = numToKorean4D(num);
    const type = randInt(0, 2);

    if (type === 0) {
      return {
        key: `4digit_read_${num}`,
        instruction: l === 'ko' ? "다음 수를 한글로 읽어 보세요." : l === 'ja' ? "次の数を読んでみましょう。" : "Read the following number.",
        question: `${num} = `,
        answer: kor,
      };
    } else if (type === 1) {
      return {
        key: `4digit_write_${num}`,
        instruction: l === 'ko' ? "다음 수를 숫자로 써 보세요." : l === 'ja' ? "次の数を数字で書いてみましょう。" : "Write the following number in digits.",
        question: `[ ${kor} ] = `,
        answer: String(num),
      };
    } else {
      let q = l === 'ko' ? `1000이 ${th_d}개, 100이 ${h_d}개, 10이 ${t_d}개, 1이 ${o_d}개인 수 = ` : l === 'ja' ? `1000が${th_d}個、100が${h_d}個、10が${t_d}個、1が${o_d}個の数 = ` : `The number with ${th_d} thousands, ${h_d} hundreds, ${t_d} tens, and ${o_d} ones = `;
      return {
        key: `4digit_place_${num}`,
        instruction: t("blank_num", l),
        question: q,
        answer: String(num),
      };
    }
  }, lang);
}

// 2학년 2학기: 곱셈구구 (특정 단)
function genMulTable(dan: number, count: number, difficulty: Difficulty = "normal", lang: Language = "ko") {
  return generateUnique(count, (l) => {
    const b = randInt(1, 9);
    return {
      key: `${dan}x${b}`,
      instruction: l === 'ko' ? `${dan}단 곱셈구구를 구하세요.` : `Solve for the ${dan} times table.`,
      question: `${dan} × ${b} = `,
      answer: String(dan * b),
    };
  }, lang);
}

// 2학년 2학기: 곱셈구구 전체 (2~9단 혼합)
function genMulTableMixed(count: number, difficulty: Difficulty = "normal", lang: Language = "ko") {
  return generateUnique(count, (l) => {
    const a = randInt(2, 9);
    const b = randInt(2, 9);
    return {
      key: `mix_${a}x${b}`,
      instruction: t("mul_table", l),
      question: `${a} × ${b} = `,
      answer: String(a * b),
    };
  }, lang);
}

// ══════════════════════════════════════════════════════════════
// 3학년 생성기
// ══════════════════════════════════════════════════════════════

// 3학년 1학기: 세 자리 수 덧셈 — 난이도별 숫자 범위 차등
function gen3_add3digit(count: number, diff: Difficulty = "normal", lang: Language = "ko") {
  const maxA = diff === "easy" ? 299 : diff === "normal" ? 499 : 999;
  const maxB = diff === "easy" ? 299 : diff === "normal" ? 499 : 999;

  return generateUnique(count, (l) => {
    const a = randInt(100, maxA);
    const b = randInt(100, maxB);

    if (diff === "hard" && randInt(0, 2) === 0) {
      const items = l === 'ko' ? ["사과", "귤", "포도", "딸기"] : l === 'en' ? ["apples", "oranges", "grapes", "strawberries"] : ["りんご", "みかん", "ぶどう", "いちご"];
      const i1 = pick(items);
      const i2 = pick(items.filter(x => x !== i1));
      
      let q = "";
      if (l === 'ko') q = `${i1} ${a}개와 ${i2} ${b}개를 합하면 모두 몇 개일까요?`;
      else if (l === 'ja') q = `${i1}が${a}個と${i2}が${b}個あります。あわせると全部で何個ですか？`;
      else q = `There are ${a} ${i1} and ${b} ${i2}. How many are there in total?`;

      return {
        key: `word_${a}+${b}`,
        instruction: t("word_prob", l),
        question: q,
        answer: String(a + b),
      };
    }

    return {
      key: `${a}+${b}`,
      instruction: t("add_3d", l),
      question: `${a} + ${b} = `,
      answer: String(a + b),
      visual: { type: "vertical_math" as const, operator: "+" as const, top: a, bottom: b },
    };
  }, lang);
}

// 3학년 1학기: 세 자리 수 뺄셈 — 난이도별 범위
function gen3_sub3digit(count: number, diff: Difficulty = "normal", lang: Language = "ko") {
  const minA = diff === "easy" ? 200 : diff === "normal" ? 200 : 500;
  const maxA = diff === "easy" ? 500 : diff === "normal" ? 999 : 999;

  return generateUnique(count, (l) => {
    const a = randInt(minA, maxA);
    const b = randInt(100, a - 1);

    if (diff === "hard" && randInt(0, 2) === 0) {
      const items = l === 'ko' ? ["구슬", "사탕", "스티커"] : l === 'en' ? ["marbles", "candies", "stickers"] : ["おはじき", "キャンディー", "ステッカー"];
      const item = pick(items);
      
      let q = "";
      if (l === 'ko') q = `${item}이 ${a}개 있었는데 ${b}개를 사용했습니다. 남은 ${item}은 몇 개인가요?`;
      else if (l === 'ja') q = `${item}が${a}個ありましたが、${b}個使いました。残りは何個ですか？`;
      else q = `There were ${a} ${item}, and ${b} were used. How many ${item} are left?`;

      return {
        key: `word_${a}-${b}`,
        instruction: t("word_prob", l),
        question: q,
        answer: String(a - b),
      };
    }

    return {
      key: `${a}-${b}`,
      instruction: t("sub_3d", l),
      question: `${a} - ${b} = `,
      answer: String(a - b),
      visual: { type: "vertical_math" as const, operator: "-" as const, top: a, bottom: b },
    };
  }, lang);
}

// 3학년 1학기: 나눗셈 기초
function gen3_divBasic(count: number, diff: Difficulty = "normal", lang: Language = "ko") {
  return generateUnique(count, (l) => {
    const b = randInt(2, 9);
    const quotient = randInt(1, 9);
    const a = b * quotient;
    return {
      key: `${a}÷${b}`,
      instruction: t("div_2d1d", l),
      question: `${a} ÷ ${b} = `,
      answer: String(quotient),
    };
  }, lang);
}

// 3학년 1학기: 두 자리 × 한 자리 곱셈
function gen3_mul2d1d(count: number, difficulty: Difficulty = "normal", lang: Language = "ko") {
  return generateUnique(count, (l) => {
    const a = randInt(11, 49);
    const b = randInt(2, 9);
    return {
      key: `${a}x${b}`,
      instruction: t("mul_math", l),
      question: `${a} × ${b} = `,
      answer: String(a * b),
      visual: { type: "vertical_math" as const, operator: "×" as const, top: a, bottom: b },
    };
  }, lang);
}

// 3학년 2학기: 두 자리 × 두 자리 곱셈
function gen3_mul2d2d(count: number, difficulty: Difficulty = "normal", lang: Language = "ko") {
  return generateUnique(count, (l) => {
    const a = randInt(11, 49);
    const b = randInt(11, 49);
    return {
      key: `${a}x${b}`,
      instruction: t("mul_math", l),
      question: `${a} × ${b} = `,
      answer: String(a * b),
      visual: { type: "vertical_math" as const, operator: "×" as const, top: a, bottom: b },
    };
  }, lang);
}

// 3학년 2학기: 나머지 있는 나눗셈
function gen3_divWithRemainder(count: number, difficulty: Difficulty = "normal", lang: Language = "ko") {
  return generateUnique(count, (l) => {
    const b = randInt(2, 9);
    const quotient = randInt(2, 9);
    const remainder = randInt(1, b - 1);
    const a = b * quotient + remainder;
    return {
      key: `${a}÷${b}r`,
      instruction: l === 'ko' ? "나눗셈을 하고, 몫과 나머지를 구하세요." : "Solve the division and find the quotient and remainder.",
      question: `${a} ÷ ${b} = ···`,
      answer: `${quotient} ··· ${remainder}`,
    };
  }, lang);
}

// 3학년: 분수 (대분수 ↔ 가분수)
function convertMixedToImproper(count: number, diff: Difficulty = "normal", lang: Language = "ko") {
  return generateUnique(count, (l) => {
    const denom = randInt(2, 9);
    const whole = randInt(1, 5);
    const numer = randInt(1, denom - 1);
    const improperNumer = whole * denom + numer;
    return {
      key: `${whole}_${numer}/${denom}`,
      instruction: t("mixed_to_imp", l),
      question: l === 'ko' ? `${whole}과 ${numer}/${denom} = ` : l === 'ja' ? `${whole}と ${numer}/${denom} = ` : `${whole} and ${numer}/${denom} = `,
      answer: `${improperNumer}/${denom}`,
      equation: l === 'ko' ? `${whole}\\frac{${numer}}{${denom}} = ` : `${whole}\\frac{${numer}}{${denom}} = `,
      visual: { type: "fraction" as const, whole, numerator: numer, denominator: denom },
    };
  }, lang);
}

function convertImproperToMixed(count: number, diff: Difficulty = "normal", lang: Language = "ko") {
  return generateUnique(count, (l) => {
    const denom = randInt(2, 9);
    const whole = randInt(1, 5);
    const numer = randInt(1, denom - 1);
    const improperNumer = whole * denom + numer;
    return {
      key: `improper_${improperNumer}/${denom}`,
      instruction: t("imp_to_mixed", l),
      question: `${improperNumer}/${denom} = `,
      answer: l === 'ko' ? `${whole}과 ${numer}/${denom}` : l === 'ja' ? `${whole}と ${numer}/${denom}` : `${whole} and ${numer}/${denom}`,
      equation: `\\frac{${improperNumer}}{${denom}} = `,
      visual: { type: "fraction" as const, numerator: improperNumer, denominator: denom },
    };
  }, lang);
}

// 3학년 1학기: 분수와 소수 기초
function gen3_fracDecIntro(count: number, difficulty: Difficulty = "normal", lang: Language = "ko") {
  return generateUnique(count, (l) => {
    const denom = randInt(2, 10);
    const numer = randInt(1, denom - 1);
    return {
      key: `fracintro_${numer}/${denom}`,
      instruction: t("frac_intro", l),
      question: t("frac_intro_q", l),
      answer: `${numer}/${denom}`,
      visual: { type: "fraction" as const, numerator: numer, denominator: denom },
    };
  }, lang);
}

// ══════════════════════════════════════════════════════════════
// 4학년 생성기
// ══════════════════════════════════════════════════════════════

// 4학년 1학기: 큰 수 - 읽기/쓰기 (만 단위)
function gen4_largeNumbers(count: number, difficulty: Difficulty = "normal", lang: Language = "ko") {
  return generateUnique(count, (l) => {
    const man = randInt(10, 9999);
    const rest = randInt(1, 9999);
    const numStr = `${man}${String(rest).padStart(4, '0')}`;
    // Simplified reading for localization
    let fullReading = "";
    if (l === 'ko') {
      const korMan = numToKorean4D(man);
      const korRest = numToKorean4D(rest);
      fullReading = `${korMan}만 ${korRest === "영" ? "" : korRest}`.trim();
    } else if (l === 'ja') {
      fullReading = `${man}万 ${rest}`; // Simplified JA reading
    } else {
      const total = man * 10000 + rest;
      fullReading = total.toLocaleString('en-US'); // Standard grouping for EN
    }
    
    const locale = l === 'ko' ? 'ko-KR' : l === 'ja' ? 'ja-JP' : 'en-US';
    const formattedNum = Number(numStr).toLocaleString(locale);
    const type = randInt(0, 2);

    if (type === 0) {
      return {
        key: `big_read_${numStr}`,
        instruction: l === 'ko' ? "다음 수를 한글로 읽어 보세요." : l === 'ja' ? "次の数を読んでみましょう。" : "Read the following number.",
        question: `${formattedNum} = `,
        answer: fullReading,
      };
    } else if (type === 1) {
      return {
        key: `big_write_${numStr}`,
        instruction: l === 'ko' ? "다음 수를 숫자로 써 보세요." : l === 'ja' ? "次の数を数字で書いてみましょう。" : "Write the following number in digits.",
        question: `[ ${fullReading} ] = `,
        answer: formattedNum,
      };
    } else {
      let q = l === 'ko' ? `10000이 ${man}개, 1이 ${rest}개인 수 = ` : l === 'ja' ? `10000が${man}個、1が${rest}個の数 = ` : `The number with ${man} ten-thousands and ${rest} ones = `;
      return {
        key: `big_place_${numStr}`,
        instruction: t("blank_num", l),
        question: q,
        answer: formattedNum,
      };
    }
  }, lang);
}

// 4학년 1학기: 세 자리 × 두 자리 곱셈 — 난이도별
function gen4_mul3d2d(count: number, diff: Difficulty = "normal", lang: Language = "ko") {
  const maxA = diff === "easy" ? 200 : diff === "normal" ? 300 : 500;
  const maxB = diff === "easy" ? 20 : diff === "normal" ? 30 : 50;

  return generateUnique(count, (l) => {
    const a = randInt(100, maxA);
    const b = randInt(11, maxB);

    if (diff === "hard" && randInt(0, 2) === 0) {
      const itemsMap: Record<Language, string[]> = {
        ko: ["한 상자", "한 봉지", "한 묶음"],
        en: ["box", "bag", "bundle"],
        ja: ["箱", "袋", "束"]
      };
      const item = pick(itemsMap[l]);
      let q = "";
      if (l === 'ko') q = `${item}에 ${a}개씩 ${b}상자이면 모두 몇 개인가요?`;
      else if (l === 'ja') q = `1${item}に${a}個ずつ${b}${item}あると、全部で何個ですか？`;
      else q = `If there are ${a} items in each ${item}, and you have ${b} ${item}s, how many items are there in total?`;

      return {
        key: `word_${a}x${b}`,
        instruction: t("word_prob", l),
        question: q,
        answer: String(a * b),
      };
    }

    return {
      key: `${a}x${b}`,
      instruction: t("mul_math", l),
      question: `${a} × ${b} = `,
      answer: String(a * b),
      visual: { type: "vertical_math" as const, operator: "×" as const, top: a, bottom: b },
    };
  }, lang);
}

// 4학년 1학기: 두~세 자리 나눗셈 — 난이도별
function gen4_divLong(count: number, diff: Difficulty = "normal", lang: Language = "ko") {
  const maxQ = diff === "easy" ? 30 : diff === "normal" ? 99 : 150;
  const maxDiv = diff === "easy" ? 5 : diff === "normal" ? 9 : 9;

  return generateUnique(count, (l) => {
    const b = randInt(2, maxDiv);
    const quotient = randInt(11, maxQ);
    const a = b * quotient;

    if (diff === "hard" && randInt(0, 2) === 0) {
      const itemsMap: Record<Language, {items: string[], unit: string, people: string}> = {
        ko: { items: ["사탕", "초콜릿", "카드", "연필", "스티커"], unit: "개", people: "명" },
        en: { items: ["candies", "chocolates", "cards", "pencils", "stickers"], unit: "", people: "people" },
        ja: { items: ["アメ", "チョコ", "カード", "鉛筆", "ステッカー"], unit: "個", people: "人" }
      };
      const cfg = itemsMap[l];
      const item = pick(cfg.items);
      let q = "";
      if (l === 'ko') q = `${item} ${a}개를 ${b}명에게 똑같이 나누면 한 명에게 몇 개씩 줄 수 있나요?`;
      else if (l === 'ja') q = `${item}${a}${cfg.unit}を${b}${cfg.people}に同じように分けると、一人に何${cfg.unit}ずつ譲れますか？`;
      else q = `If you share ${a} ${item} equally among ${b} ${cfg.people}, how many ${item} would each person get?`;

      return {
        key: `word_${a}÷${b}`,
        instruction: t("word_prob", l),
        question: q,
        answer: String(quotient),
      };
    }

    return {
      key: `${a}÷${b}`,
      instruction: t("div_math", l),
      question: `${a} ÷ ${b} = `,
      answer: String(quotient),
    };
  }, lang);
}

// 4학년 2학기: 분수의 덧셈 (같은 분모)
function gen4_fracAdd(count: number, difficulty: Difficulty = "normal", lang: Language = "ko") {
  return generateUnique(count, (l) => {
    const denom = randInt(3, 9);
    const n1 = randInt(1, denom - 1);
    const n2 = randInt(1, denom - 1);
    return {
      key: `fracA_${n1}/${denom}+${n2}/${denom}`,
      instruction: t("frac_add", l),
      question: `${n1}/${denom} + ${n2}/${denom} = `,
      answer: `${n1 + n2}/${denom}`,
      equation: `\\frac{${n1}}{${denom}} + \\frac{${n2}}{${denom}} = `,
    };
  }, lang);
}

// 4학년 2학기: 분수의 뺄셈 (같은 분모)
function gen4_fracSub(count: number, difficulty: Difficulty = "normal", lang: Language = "ko") {
  return generateUnique(count, (l) => {
    const denom = randInt(3, 9);
    const n1 = randInt(2, denom - 1);
    const n2 = randInt(1, n1 - 1);
    return {
      key: `fracS_${n1}/${denom}-${n2}/${denom}`,
      instruction: t("frac_sub", l),
      question: `${n1}/${denom} - ${n2}/${denom} = `,
      answer: `${n1 - n2}/${denom}`,
      equation: `\\frac{${n1}}{${denom}} - \\frac{${n2}}{${denom}} = `,
    };
  }, lang);
}

// 4학년 2학기: 소수의 덧셈
function gen4_decAdd(count: number, difficulty: Difficulty = "normal", lang: Language = "ko") {
  return generateUnique(count, (l) => {
    const a = randInt(11, 99) / 10;
    const b = randInt(11, 99) / 10;
    const sum = Math.round((a + b) * 10) / 10;
    return {
      key: `decA_${a}+${b}`,
      instruction: t("dec_add", l),
      question: `${a.toFixed(1)} + ${b.toFixed(1)} = `,
      answer: sum.toFixed(1),
    };
  }, lang);
}

// 4학년 2학기: 소수의 뺄셈
function gen4_decSub(count: number, difficulty: Difficulty = "normal", lang: Language = "ko") {
  return generateUnique(count, (l) => {
    const a = randInt(50, 99) / 10;
    const b = randInt(11, Math.floor(a * 10) - 1) / 10;
    const diff = Math.round((a - b) * 10) / 10;
    return {
      key: `decS_${a}-${b}`,
      instruction: t("dec_sub", l),
      question: `${a.toFixed(1)} - ${b.toFixed(1)} = `,
      answer: diff.toFixed(1),
    };
  }, lang);
}

// ══════════════════════════════════════════════════════════════
// 5학년 생성기
// ══════════════════════════════════════════════════════════════

// 5학년 1학기: 혼합 계산 — 난이도별 (easy: 2항, normal: 2항, hard: 3항+괄호)
function gen5_mixedOps(count: number, diff: Difficulty = "normal", lang: Language = "ko") {
  return generateUnique(count, (l) => {
    const a = randInt(2, 9);
    const b = randInt(2, 9);
    const c = randInt(1, 9);

    if (diff === "hard") {
      const d = randInt(1, 5);
      const pattern = randInt(0, 1);
      if (pattern === 0) {
        return {
          key: `mix3_(${a}+${b})x${c}`,
          instruction: t("calc_order", l),
          question: `(${a} + ${b}) × ${c} = `,
          answer: String((a + b) * c),
        };
      } else {
        const big = Math.max(b, d);
        const small = Math.min(b, d);
        return {
          key: `mix3_${a}x(${big}-${small})+${c}`,
          instruction: t("calc_order", l),
          question: `${a} × (${big} - ${small}) + ${c} = `,
          answer: String(a * (big - small) + c),
        };
      }
    }

    const type = randInt(0, 1);
    if (type === 0) {
      return {
        key: `mix_${a}x${b}+${c}`,
        instruction: t("calc_order", l),
        question: `${a} × ${b} + ${c} = `,
        answer: String(a * b + c),
      };
    } else {
      return {
        key: `mix_${a}+${b}x${c}`,
        instruction: t("calc_order", l),
        question: `${a} + ${b} × ${c} = `,
        answer: String(a + b * c),
      };
    }
  }, lang);
}

// 5학년 1학기: 약수와 배수
function gen5_factorsMultiples(count: number, difficulty: Difficulty = "normal", lang: Language = "ko") {
  return generateUnique(count, (l) => {
    const n = randInt(6, 36);
    const type = randInt(0, 1);
    if (type === 0) {
      const factors: number[] = [];
      for (let i = 1; i <= n; i++) { if (n % i === 0) factors.push(i); }
      let q = l === 'ko' ? `${n}의 약수 = ` : l === 'ja' ? `${n}の約数 = ` : `Factors of ${n} = `;
      return {
        key: `factors_${n}`,
        instruction: l === 'ko' ? "약수를 모두 구하세요." : "Find all factors.",
        question: q,
        answer: factors.join(", "),
      };
    } else {
      const base = randInt(2, 9);
      const multiples = [1,2,3,4,5].map(i => base * i);
      let q = l === 'ko' ? `${base}의 배수 = ` : l === 'ja' ? `${base}の倍数 = ` : `Multiples of ${base} = `;
      return {
        key: `multiples_${base}`,
        instruction: l === 'ko' ? "배수를 처음 5개 구하세요." : "Find the first 5 multiples.",
        question: q,
        answer: multiples.join(", "),
      };
    }
  }, lang);
}

// 5학년 1학기: 약분과 통분
function gen5_simplify(count: number, difficulty: Difficulty = "normal", lang: Language = "ko") {
  return generateUnique(count, (l) => {
    const factor = randInt(2, 5);
    const numer = randInt(1, 5);
    const denom = randInt(numer + 1, 8);
    return {
      key: `simp_${numer*factor}/${denom*factor}`,
      instruction: t("simplify", l),
      question: `${numer * factor}/${denom * factor} = `,
      answer: `${numer}/${denom}`,
    };
  }, lang);
}

// 5학년 1학기: 분수의 덧셈과 뺄셈 (이분모)
function gen5_fracAddDiffDenom(count: number, difficulty: Difficulty = "normal", lang: Language = "ko") {
  return generateUnique(count, (l) => {
    const d1 = randInt(2, 5);
    const d2 = d1 * randInt(2, 3);
    const n1 = randInt(1, d1 - 1);
    const n2 = randInt(1, d2 - 1);
    const commonD = d2;
    const commonN1 = n1 * (d2 / d1);
    const result = commonN1 + n2;
    return {
      key: `fracDiff_${n1}/${d1}+${n2}/${d2}`,
      instruction: t("frac_add_diff", l),
      question: `${n1}/${d1} + ${n2}/${d2} = `,
      answer: `${result}/${commonD}`,
      equation: `\\frac{${n1}}{${d1}} + \\frac{${n2}}{${d2}} = `,
    };
  }, lang);
}

// 5학년 2학기: 수의 범위와 어림하기
function gen5_estimation(count: number, difficulty: Difficulty = "normal", lang: Language = "ko") {
  return generateUnique(count, (l) => {
    const num = randInt(100, 9999);
    const place = randInt(0, 1);
    if (place === 0) {
      const rounded = Math.round(num / 100) * 100;
      return {
        key: `round100_${num}`,
        instruction: l === 'ko' ? "백의 자리에서 반올림하세요." : l === 'ja' ? "百の位で四捨五入してください。" : "Round to the nearest hundred.",
        question: l === 'ko' ? `${num} → 약` : l === 'ja' ? `${num} → 約` : `${num} ≈`,
        answer: String(rounded),
      };
    } else {
      const rounded = Math.round(num / 10) * 10;
      return {
        key: `round10_${num}`,
        instruction: l === 'ko' ? "십의 자리에서 반올림하세요." : l === 'ja' ? "十の位で四捨五入してください。" : "Round to the nearest ten.",
        question: l === 'ko' ? `${num} → 약` : l === 'ja' ? `${num} → 約` : `${num} ≈`,
        answer: String(rounded),
      };
    }
  }, lang);
}

// 5학년 2학기: 분수의 곱셈
function gen5_fracMul(count: number, difficulty: Difficulty = "normal", lang: Language = "ko") {
  return generateUnique(count, (l) => {
    const n1 = randInt(1, 5);
    const d1 = randInt(n1 + 1, 9);
    const whole = randInt(2, 6);
    const resultN = n1 * whole;
    return {
      key: `fracMul_${n1}/${d1}x${whole}`,
      instruction: t("frac_mul", l),
      question: `${n1}/${d1} × ${whole} = `,
      answer: `${resultN}/${d1}`,
      equation: `\\frac{${n1}}{${d1}} \\times ${whole} = `,
    };
  }, lang);
}

// 5학년 2학기: 소수의 곱셈
function gen5_decMul(count: number, difficulty: Difficulty = "normal", lang: Language = "ko") {
  return generateUnique(count, (l) => {
    const a = randInt(11, 99) / 10;
    const b = randInt(2, 9);
    const result = Math.round(a * b * 10) / 10;
    return {
      key: `decMul_${a}x${b}`,
      instruction: t("dec_mul", l),
      question: `${a.toFixed(1)} × ${b} = `,
      answer: result.toFixed(1),
    };
  }, lang);
}

// ══════════════════════════════════════════════════════════════
// 6학년 생성기
// ══════════════════════════════════════════════════════════════

// 6학년: 분수의 나눗셈 (분수 ÷ 자연수)
function gen6_fracDiv(count: number, difficulty: Difficulty = "normal", lang: Language = "ko") {
  return generateUnique(count, (l) => {
    const divisor = randInt(2, 5);
    const numer = randInt(2, 8) * divisor; // 나누어 떨어지도록
    const denom = randInt(3, 9);
    return {
      key: `fracDiv_${numer}/${denom}÷${divisor}`,
      instruction: t("frac_div", l),
      question: `${numer}/${denom} ÷ ${divisor} = `,
      answer: `${numer / divisor}/${denom}`,
      equation: `\\frac{${numer}}{${denom}} \\div ${divisor} = `,
    };
  }, lang);
}

// 6학년: 소수의 나눗셈
function gen6_decDiv(count: number, difficulty: Difficulty = "normal", lang: Language = "ko") {
  return generateUnique(count, (l) => {
    const b = randInt(2, 9);
    const quotient = randInt(11, 99) / 10;
    const a = Math.round(quotient * b * 10) / 10;
    return {
      key: `decDiv_${a}÷${b}`,
      instruction: t("dec_div", l),
      question: `${a.toFixed(1)} ÷ ${b} = `,
      answer: quotient.toFixed(1),
    };
  }, lang);
}

// 6학년: 비와 비율
function gen6_ratio(count: number, diff: Difficulty = "normal", lang: Language = "ko") {
  return generateUnique(count, (l) => {
    const a = randInt(1, 9);
    const b = randInt(1, 9);
    return {
      key: `ratio_${a}:${b}`,
      instruction: t("frac_intro", l),
      question: `${a} : ${b} =`,
      answer: `${a}/${b}`,
    };
  }, lang);
}

// 6학년: 비례식과 비례배분 — 난이도별
function gen6_proportion(count: number, diff: Difficulty = "normal", lang: Language = "ko") {
  const maxK = diff === "easy" ? 3 : diff === "normal" ? 5 : 9;
  const maxBase = diff === "easy" ? 4 : diff === "normal" ? 6 : 9;

  return generateUnique(count, (l) => {
    const a = randInt(2, maxBase);
    const b = randInt(2, maxBase);
    const k = randInt(2, maxK);

    if (diff === "hard" && randInt(0, 2) === 0) {
      // 비례배분 서술형
      const total = (a + b) * k;
      let q = "";
      if (l === 'ko') q = `${total}개를 ${a} : ${b}로 나누면 큰 쪽은 몇 개인가요?`;
      else if (l === 'ja') q = `${total}個を${a} : ${b}の比で分けると、大きい方は何個ですか？`;
      else q = `If you divide ${total} into a ratio of ${a} : ${b}, how many are in the larger part?`;

      return {
        key: `propword_${a}:${b}_${total}`,
        instruction: t("word_prob", l),
        question: q,
        answer: String(Math.max(a, b) * k),
      };
    }

    return {
      key: `prop_${a}:${b}=${a*k}:?`,
      instruction: l === 'ko' ? "비례식에서의 값을 구하세요." : "Find the value in the proportion.",
      question: `${a} : ${b} = ${a * k} :`,
      answer: String(b * k),
    };
  }, lang);
}

// ══════════════════════════════════════════════════════════════
// 서술형(문장제) 생성기 — 학년별 주요 연산에 상황 문제 템플릿 적용
// ══════════════════════════════════════════════════════════════

/** 2학년: 두 자리 덧셈/뺄셈 서술형 */
function gen2_wordAdd2d(count: number, diff: Difficulty = "normal", lang: Language = "ko") {
  const maxA = diff === "easy" ? 40 : diff === "normal" ? 70 : 99;
  const maxB = diff === "easy" ? 30 : diff === "normal" ? 50 : 99;

  return generateUnique(count, (l) => {
    const isAdd = randInt(0, 1) === 0;
    const items = l === 'ko' ? ["사과", "귤", "딸기"] : l === 'en' ? ["apples", "oranges", "strawberries"] : ["りんご", "みかん", "いちご"];
    const containers = l === 'ko' ? ["바구니", "상자"] : l === 'en' ? ["basket", "box"] : ["かご", "箱"];
    const item = pick(items);
    const container = pick(containers);

    if (isAdd) {
      const a = randInt(11, maxA);
      const b = randInt(11, maxB);
      let q = "";
      if (l === 'ko') q = `${container}에 ${item}이(가) ${a}개 있고, 또 ${b}개를 더 넣었습니다. 모두 몇 개인가요?`;
      else if (l === 'ja') q = `${container}に${item}が${a}個あり、さらに${b}個入れました。全部で何個ですか？`;
      else q = `There are ${a} ${item} in the ${container}, and ${b} more were added. How many are there in total?`;

      return {
        key: `word2a_${a}+${b}`,
        instruction: t("word_prob", l),
        question: q,
        answer: String(a + b),
      };
    } else {
      const a = randInt(30, maxA);
      const b = randInt(11, a - 5);
      let q = "";
      if (l === 'ko') q = `${item}이(가) ${a}개 있었는데 ${b}개를 먹었습니다. 남은 ${item}은 몇 개인가요?`;
      else if (l === 'ja') q = `${item}が${a}個ありましたが、${b}個食べました。残りは何個ですか？`;
      else q = `There were ${a} ${item}, and ${b} were eaten. How many ${item} are left?`;

      return {
        key: `word2s_${a}-${b}`,
        instruction: t("word_prob", l),
        question: q,
        answer: String(a - b),
      };
    }
  }, lang);
}

/** 3학년: 곱셈 서술형 */
function gen3_wordMul(count: number, diff: Difficulty = "normal", lang: Language = "ko") {
  const maxA = diff === "easy" ? 20 : diff === "normal" ? 50 : 99;
  const maxB = diff === "easy" ? 5 : diff === "normal" ? 9 : 9;

  return generateUnique(count, (l) => {
    const a = randInt(11, maxA);
    const b = randInt(2, maxB);
    let q = "";
    if (l === 'ko') q = `한 상자에 ${a}개씩 들어있는 사과가 ${b}상자 있습니다. 사과는 모두 몇 개인가요?`;
    else if (l === 'ja') q = `1箱に${a}個ずつのりんごが${b}箱あります。りんごは全部で何個ですか？`;
    else q = `There are ${b} boxes of apples, and each box has ${a} apples. How many apples are there in total?`;

    return {
      key: `word3m_${a}x${b}`,
      instruction: t("word_prob", l),
      question: q,
      answer: String(a * b),
    };
  }, lang);
}

/** 4학년: 나눗셈 서술형 */
function gen4_wordDiv(count: number, diff: Difficulty = "normal", lang: Language = "ko") {
  const maxQ = diff === "easy" ? 20 : diff === "normal" ? 50 : 99;
  const maxDiv = diff === "easy" ? 5 : diff === "normal" ? 9 : 9;

  return generateUnique(count, (l) => {
    const b = randInt(2, maxDiv);
    const q = randInt(5, maxQ);
    const a = b * q; 
    let quest = "";
    if (l === 'ko') quest = `연필 ${a}자루를 ${b}명에게 똑같이 나누어 주면 한 명에게 몇 자루씩 줄 수 있나요?`;
    else if (l === 'ja') quest = `鉛筆${a}本を${b}人に同じ数ずつ分けると、1人分は何本になりますか？`;
    else quest = `If you divide ${a} pencils equally among ${b} people, how many pencils does each person get?`;

    return {
      key: `word4d_${a}÷${b}`,
      instruction: t("word_prob", l),
      question: quest,
      answer: String(q),
    };
  }, lang);
}

/** 5학년: 분수 서술형 */
function gen5_wordFrac(count: number, diff: Difficulty = "normal", lang: Language = "ko") {
  return generateUnique(count, (l) => {
    const foods = l === 'ko' ? ["피자", "케이크"] : l === 'en' ? ["pizza", "cake"] : ["ピザ", "ケーキ"];
    const food = pick(foods);
    const denom = diff === "easy" ? pick([4, 8]) : pick([3, 4, 5, 6, 8]);
    const n1 = randInt(Math.floor(denom / 2) + 1, denom - 1);
    const n2 = randInt(1, n1 - 1);
    const isAdd = randInt(0, 1) === 0;

    if (isAdd && n1 + n2 <= denom) {
      let q = "";
      if (l === 'ko') q = `${food} ${n1}/${denom}에 ${n2}/${denom}를 더 먹으면 모두 얼마인가요?`;
      else if (l === 'ja') q = `${food}を${n1}/${denom}食べて、さらに${n2}/${denom}食べると、全部でどれくらいですか？`;
      else q = `If you eat ${n1}/${denom} of a ${food} and then ${n2}/${denom} more, how much did you eat in total?`;

      return {
        key: `word5f_${n1}/${denom}+${n2}/${denom}`,
        instruction: t("word_prob", l),
        question: q,
        answer: `${n1 + n2}/${denom}`,
      };
    }

    let q = "";
    if (l === 'ko') q = `${food}의 ${n1}/${denom}에서 ${n2}/${denom}를 먹었습니다. 남은 양은?`;
    else if (l === 'ja') q = `${food}の${n1}/${denom}から${n2}/${denom}食べました。残りはどれくらいですか？`;
    else q = `There was ${n1}/${denom} of a ${food}, and ${n2}/${denom} was eaten. How much is left?`;

    return {
      key: `word5f_${n1}/${denom}-${n2}/${denom}`,
      instruction: t("word_prob", l),
      question: q,
      answer: `${n1 - n2}/${denom}`,
    };
  }, lang);
}

// ══════════════════════════════════════════════════════════════
// 커리큘럼 데이터 구조 (학년 -> 학기단원 -> 세부주제)
// ══════════════════════════════════════════════════════════════

export type CurriculumMap = Record<
  number,
  {
    termUnit: string;
    topics: {
      name: string;
      generator: (count: number, diff: Difficulty, lang: Language) => Problem[];
    }[];
  }[]
>;

export const CURRICULUM_HIERARCHY: CurriculumMap = {
  1: [
    {
      termUnit: "curriculum.g1.u1.title",
      topics: [
        { name: "curriculum.g1.u1.t1", generator: (c, d, l) => gen1_counting(c, d, l) },
      ],
    },
    {
      termUnit: "curriculum.g1.u2.title",
      topics: [
        { name: "curriculum.g1.u2.t1", generator: (c, d, l) => gen1_addSingle(c, d, l) },
        { name: "curriculum.g1.u2.t2", generator: (c, d, l) => gen1_subSingle(c, d, l) },
      ],
    },
    {
      termUnit: "curriculum.g1.u3.title",
      topics: [
        { name: "curriculum.g1.u3.t1", generator: (c, d, l) => gen1_counting(c, d, l) },
      ],
    },
    {
      termUnit: "curriculum.g1.u4.title",
      topics: [
        { name: "curriculum.g1.u4.t1", generator: (c, d, l) => gen1_counting(c, d, l) },
      ],
    },
    {
      termUnit: "curriculum.g1.u5.title",
      topics: [
        { name: "curriculum.g1.u5.t1", generator: (c, d, l) => gen1_addTensPlusOnes(c, d, l) },
        { name: "curriculum.g1.u5.t2", generator: (c, d, l) => gen1_addSingle(c, d, l) },
      ],
    },
    {
      termUnit: "curriculum.g1.u6.title",
      topics: [
        { name: "curriculum.g1.u6.t1", generator: (c, d, l) => gen1_add2d2dNoCarry(c, d, l) },
        { name: "curriculum.g1.u6.t2", generator: (c, d, l) => gen1_sub2d2dNoBorrow(c, d, l) },
      ],
    },
    {
      termUnit: "curriculum.g1.u7.title",
      topics: [
        { name: "curriculum.g1.u7.t1", generator: (c, d, l) => gen1_addSingle(c, d, l) },
        { name: "curriculum.g1.u7.t2", generator: (c, d, l) => gen1_subSingle(c, d, l) },
      ],
    },
  ],
  2: [
    {
      termUnit: "curriculum.g2.u1.title",
      topics: [
        { name: "curriculum.g2.u1.t1", generator: (c, d, l) => gen2_threeDigitNum(c, d, l) },
      ],
    },
    {
      termUnit: "curriculum.g2.u2.title",
      topics: [
        { name: "curriculum.g2.u2.t1", generator: (c, d, l) => gen2_add2dWithCarry(c, d, l) },
        { name: "curriculum.g2.u2.t2", generator: (c, d, l) => gen2_sub2dWithBorrow(c, d, l) },
        { name: "curriculum.g2.u2.t3", generator: (c, d, l) => gen2_wordAdd2d(c, d, l) },
      ],
    },
    {
      termUnit: "curriculum.g2.u3.title",
      topics: [
        { name: "curriculum.g2.u3.t1", generator: (c, d, l) => gen2_mulIntro(c, d, l) },
      ],
    },
    {
      termUnit: "curriculum.g2.u4.title",
      topics: [
        { name: "curriculum.g2.u4.t1", generator: (c, d, l) => gen2_fourDigitNum(c, d, l) },
      ],
    },
    {
      termUnit: "curriculum.g2.u5.title",
      topics: [
        { name: "curriculum.g2.u5.t1", generator: (c, d, l) => genMulTable(2, c, d, l) },
        { name: "curriculum.g2.u5.t2", generator: (c, d, l) => genMulTable(3, c, d, l) },
        { name: "curriculum.g2.u5.t3", generator: (c, d, l) => genMulTable(4, c, d, l) },
        { name: "curriculum.g2.u5.t4", generator: (c, d, l) => genMulTable(5, c, d, l) },
        { name: "curriculum.g2.u5.t5", generator: (c, d, l) => genMulTableMixed(c, d, l) },
      ],
    },
  ],
  3: [
    {
      termUnit: "curriculum.g3.u1.title",
      topics: [
        { name: "curriculum.g3.u1.t1", generator: (c, d, l) => gen3_add3digit(c, d, l) },
        { name: "curriculum.g3.u1.t2", generator: (c, d, l) => gen3_sub3digit(c, d, l) },
      ],
    },
    {
      termUnit: "curriculum.g3.u2.title",
      topics: [
        { name: "curriculum.g3.u2.t1", generator: (c, d, l) => gen3_shapeBasic(c, d, l) },
      ],
    },
    {
      termUnit: "curriculum.g3.u3.title",
      topics: [
        { name: "curriculum.g3.u3.t1", generator: (c, d, l) => gen3_divBasic(c, d, l) },
      ],
    },
    {
      termUnit: "curriculum.g3.u4.title",
      topics: [
        { name: "curriculum.g3.u4.t1", generator: (c, d, l) => gen3_mul2d1d(c, d, l) },
        { name: "curriculum.g3.u4.t2", generator: (c, d, l) => gen3_wordMul(c, d, l) },
      ],
    },
    {
      termUnit: "curriculum.g3.u5.title",
      topics: [
        { name: "curriculum.g3.u5.t1", generator: (c, d, l) => gen3_fracDecIntro(c, d, l) },
      ],
    },
    {
      termUnit: "curriculum.g3.u6.title",
      topics: [
        { name: "curriculum.g3.u6.t1", generator: (c, d, l) => gen3_mul2d2d(c, d, l) },
      ],
    },
    {
      termUnit: "curriculum.g3.u7.title",
      topics: [
        { name: "curriculum.g3.u7.t1", generator: (c, d, l) => gen3_divWithRemainder(c, d, l) },
      ],
    },
    {
      termUnit: "curriculum.g3.u8.title",
      topics: [
        { name: "curriculum.g3.u8.t1", generator: (c, d, l) => convertMixedToImproper(c, d, l) },
        { name: "curriculum.g3.u8.t2", generator: (c, d, l) => convertImproperToMixed(c, d, l) },
      ],
    },
  ],
  4: [
    {
      termUnit: "curriculum.g4.u1.title",
      topics: [
        { name: "curriculum.g4.u1.t1", generator: (c, d, l) => gen4_largeNumbers(c, d, l) },
      ],
    },
    {
      termUnit: "curriculum.g4.u2.title",
      topics: [
        { name: "curriculum.g4.u2.t1", generator: (c, d, l) => gen4_mul3d2d(c, d, l) },
        { name: "curriculum.g4.u2.t2", generator: (c, d, l) => gen4_divLong(c, d, l) },
        { name: "curriculum.g4.u2.t3", generator: (c, d, l) => gen4_wordDiv(c, d, l) },
      ],
    },
    {
      termUnit: "curriculum.g4.u3.title",
      topics: [
        { name: "curriculum.g4.u3.t1", generator: (c, d, l) => gen4_angleCalc(c, d, l) },
      ],
    },
    {
      termUnit: "curriculum.g4.u4.title",
      topics: [
        { name: "curriculum.g4.u4.t1", generator: (c, d, l) => gen4_triangleType(c, d, l) },
      ],
    },
    {
      termUnit: "curriculum.g4.u5.title",
      topics: [
        { name: "curriculum.g4.u5.t1", generator: (c, d, l) => gen4_fracAdd(c, d, l) },
        { name: "curriculum.g4.u5.t2", generator: (c, d, l) => gen4_fracSub(c, d, l) },
      ],
    },
    {
      termUnit: "curriculum.g4.u6.title",
      topics: [
        { name: "curriculum.g4.u6.t1", generator: (c, d, l) => gen4_decAdd(c, d, l) },
        { name: "curriculum.g4.u6.t2", generator: (c, d, l) => gen4_decSub(c, d, l) },
      ],
    },
  ],
  5: [
    {
      termUnit: "curriculum.g5.u1.title",
      topics: [
        { name: "curriculum.g5.u1.t1", generator: (c, d, l) => gen5_mixedOps(c, d, l) },
      ],
    },
    {
      termUnit: "curriculum.g5.u2.title",
      topics: [
        { name: "curriculum.g5.u2.t1", generator: (c, d, l) => gen5_factorsMultiples(c, d, l) },
      ],
    },
    {
      termUnit: "curriculum.g5.u3.title",
      topics: [
        { name: "curriculum.g5.u3.t1", generator: (c, d, l) => gen5_simplify(c, d, l) },
      ],
    },
    {
      termUnit: "curriculum.g5.u4.title",
      topics: [
        { name: "curriculum.g5.u4.t1", generator: (c, d, l) => gen5_fracAddDiffDenom(c, d, l) },
        { name: "curriculum.g5.u4.t2", generator: (c, d, l) => gen5_wordFrac(c, d, l) },
      ],
    },
    {
      termUnit: "curriculum.g5.u5.title",
      topics: [
        { name: "curriculum.g5.u5.t1", generator: (c, d, l) => gen5_area(c, d, l) },
      ],
    },
    {
      termUnit: "curriculum.g5.u6.title",
      topics: [
        { name: "curriculum.g5.u6.t1", generator: (c, d, l) => gen5_estimation(c, d, l) },
      ],
    },
    {
      termUnit: "curriculum.g5.u7.title",
      topics: [
        { name: "curriculum.g5.u7.t1", generator: (c, d, l) => gen5_fracMul(c, d, l) },
      ],
    },
    {
      termUnit: "curriculum.g5.u8.title",
      topics: [
        { name: "curriculum.g5.u8.t1", generator: (c, d, l) => gen5_decMul(c, d, l) },
      ],
    },
  ],
  6: [
    {
      termUnit: "curriculum.g6.u1.title",
      topics: [
        { name: "curriculum.g6.u1.t1", generator: (c, d, l) => gen6_fracDiv(c, d, l) },
      ],
    },
    {
      termUnit: "curriculum.g6.u2.title",
      topics: [
        { name: "curriculum.g6.u2.t1", generator: (c, d, l) => gen6_decDiv(c, d, l) },
      ],
    },
    {
      termUnit: "curriculum.g6.u3.title",
      topics: [
        { name: "curriculum.g6.u3.t1", generator: (c, d, l) => gen6_ratio(c, d, l) },
      ],
    },
    {
      termUnit: "curriculum.g6.u4.title",
      topics: [
        { name: "curriculum.g6.u4.t1", generator: (c, d, l) => gen6_circleArea(c, d, l) },
      ],
    },
    {
      termUnit: "curriculum.g6.u5.title",
      topics: [
        { name: "curriculum.g6.u5.t1", generator: (c, d, l) => gen6_volume(c, d, l) },
      ],
    },
    {
      termUnit: "curriculum.g6.u6.title",
      topics: [
        { name: "curriculum.g6.u6.t1", generator: (c, d, l) => gen6_fracDiv(c, d, l) },
      ],
    },
    {
      termUnit: "curriculum.g6.u7.title",
      topics: [
        { name: "curriculum.g6.u7.t1", generator: (c, d, l) => gen6_decDiv(c, d, l) },
      ],
    },
    {
      termUnit: "curriculum.g6.u8.title",
      topics: [
        { name: "curriculum.g6.u8.t1", generator: (c, d, l) => gen6_proportion(c, d, l) },
      ],
    },
  ],
};

/**
 * 주어진 학년, 학기/단원, 세부 주제를 바탕으로 문제를 생성합니다.
 */
export function generateProblems(
  grade: number,
  termUnit: string,
  topicName: string,
  count: number = 10,
  difficulty: Difficulty = "normal",
  lang: Language = "ko"
): Problem[] {
  const gradeUnits = CURRICULUM_HIERARCHY[grade] || [];
  const unit = gradeUnits.find((u) => u.termUnit === termUnit);
  if (!unit) return [];

  const topic = unit.topics.find((t) => t.name === topicName);
  if (!topic) return [];

  // generator가 (count, diff, lang)을 받도록 호출
  return (topic.generator as any)(count, difficulty, lang);
}
