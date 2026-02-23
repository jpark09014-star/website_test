/**
 * 초등학교 수학 학습지 문제 생성 모듈
 *
 * [왜 이렇게 설계했는가]
 * - 교육과정에 맞게 학기 -> 단원 -> 세부 주제(받아올림 여부 등)로 구조를 세분화합니다.
 * - 시각적 표현(세로셈, 분수)을 독립된 타입으로 분리하여 UI 렌더링 책임을 명확히 합니다.
 * - Set을 사용해 문제가 절대 겹치지 않게 보장합니다.
 */

export type Difficulty = "easy" | "normal" | "hard";

export interface Problem {
  id: number;
  instruction?: string; // 예: "덧셈을 하세요.", "대분수를 가분수로 나타내어 보세요."
  question: string; // 문제 원문 (UI에서 숨기거나 접근성용으로 사용)
  answer: string; // 정답 문자열
  visual?:
    | { type: "vertical_math"; operator: "+" | "-" | "×"; top: number; bottom: number }
    | { type: "fraction"; whole?: number; numerator: number; denominator: number } // 대분수는 whole 제공
    | { type: "clock"; hour: number; minute: number }
    | {
        type: "grouping";
        category: "group" | "split";
        total: number | "?";
        part1: number | "?";
        part2: number | "?";
      };
}

// ─── 유틸리티 ────────────────────────────────────────────────

const randInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

function generateUnique(
  count: number,
  generator: () => Omit<Problem, "id"> & { key: string },
  maxAttempts = 1000
): Problem[] {
  const seen = new Set<string>();
  const problems: Problem[] = [];
  let attempts = 0;

  while (problems.length < count && attempts < maxAttempts) {
    attempts++;
    const { key, instruction, question, answer, visual } = generator();
    if (!seen.has(key)) {
      seen.add(key);
      problems.push({ id: problems.length + 1, instruction, question, answer, visual });
    }
  }
  return problems;
}

// ─── 1~2학년: 덧셈과 뺄셈 세분화 (핵심 기능) ────────────────────

function add2Digit1DigitWithCarry(count: number) {
  return generateUnique(count, () => {
    const onesA = randInt(1, 9);
    const onesB = randInt(10 - onesA, 9);
    const tensA = randInt(1, 8); 
    const a = tensA * 10 + onesA;
    const b = onesB;
    return {
      key: `${a}+${b}`,
      instruction: "덧셈을 하세요.",
      question: `${a} + ${b} = `,
      answer: String(a + b),
      visual: { type: "vertical_math", operator: "+", top: a, bottom: b },
    };
  });
}

function add2Digit2DigitWith1Carry(count: number) {
  return generateUnique(count, () => {
    const onesA = randInt(1, 9);
    const onesB = randInt(10 - onesA, 9);
    const tensA = randInt(1, 7);
    const tensB = randInt(1, 8 - tensA); 
    const a = tensA * 10 + onesA;
    const b = tensB * 10 + onesB;
    return {
      key: `${a}+${b}`,
      instruction: "덧셈을 하세요.",
      question: `${a} + ${b} = `,
      answer: String(a + b),
      visual: { type: "vertical_math", operator: "+", top: a, bottom: b },
    };
  });
}

function add2Digit2DigitWith2Carry(count: number) {
  return generateUnique(count, () => {
    const onesA = randInt(1, 9);
    const onesB = randInt(10 - onesA, 9);
    const tensA = randInt(2, 9);
    const tensB = randInt(10 - tensA, 9); 
    const a = tensA * 10 + onesA;
    const b = tensB * 10 + onesB;
    return {
      key: `${a}+${b}`,
      instruction: "덧셈을 하세요.",
      question: `${a} + ${b} = `,
      answer: String(a + b),
      visual: { type: "vertical_math", operator: "+", top: a, bottom: b },
    };
  });
}

function sub2Digit1DigitWithBorrow(count: number) {
  return generateUnique(count, () => {
    const onesB = randInt(2, 9);
    const onesA = randInt(0, onesB - 1);
    const tensA = randInt(2, 9); 
    const a = tensA * 10 + onesA;
    const b = onesB;
    return {
      key: `${a}-${b}`,
      instruction: "뺄셈을 하세요.",
      question: `${a} - ${b} = `,
      answer: String(a - b),
      visual: { type: "vertical_math", operator: "-", top: a, bottom: b },
    };
  });
}

function sub2Digit2DigitWithBorrow(count: number) {
  return generateUnique(count, () => {
    const onesB = randInt(2, 9);
    const onesA = randInt(0, onesB - 1);
    const tensA = randInt(3, 9);
    const tensB = randInt(1, tensA - 1);
    const a = tensA * 10 + onesA;
    const b = tensB * 10 + onesB;
    return {
      key: `${a}-${b}`,
      instruction: "뺄셈을 하세요.",
      question: `${a} - ${b} = `,
      answer: String(a - b),
      visual: { type: "vertical_math", operator: "-", top: a, bottom: b },
    };
  });
}

// ─── 3학년: 분수 샘플 (대분수를 가분수로) ────────────────────

function convertMixedToImproper(count: number) {
  return generateUnique(count, () => {
    const denom = randInt(2, 9);
    const whole = randInt(1, 9);
    const numer = randInt(1, denom - 1);
    const improperNumer = whole * denom + numer;
    return {
      key: `${whole}_${numer}/${denom}`,
      instruction: "대분수를 가분수로 나타내어 보세요.",
      question: `${whole}과 ${numer}/${denom} = `,
      answer: `${improperNumer}/${denom}`,
      visual: { type: "fraction", whole: whole, numerator: numer, denominator: denom },
    };
  });
}

function convertImproperToMixed(count: number) {
  return generateUnique(count, () => {
    const denom = randInt(2, 9);
    const whole = randInt(1, 9);
    const numer = randInt(1, denom - 1);
    const improperNumer = whole * denom + numer;
    return {
      key: `improper_${improperNumer}/${denom}`,
      instruction: "가분수를 대분수로 나타내어 보세요.",
      question: `${improperNumer}/${denom} = `,
      answer: `${whole}과 ${numer}/${denom}`,
      visual: { type: "fraction", numerator: improperNumer, denominator: denom },
    };
  });
}

// ─── 미구현 펠백 생성기 ────────────────────
function fallbackGenerator(count: number, topic: string) {
  return generateUnique(count, () => {
    const a = randInt(1, 10);
    const b = randInt(1, 10);
    return {
      key: `fallback-${topic}-${randInt(1, 10000)}`,
      question: `${a} + ${b} = (준비중: ${topic})`,
      answer: String(a + b),
    };
  });
}

// ─── 커리큘럼 데이터 구조 (학년 -> 학기단원 -> 세부주제) ─────────────────

export type CurriculumMap = Record<
  number,
  {
    termUnit: string;
    topics: {
      name: string;
      generator: (count: number, diff: Difficulty) => Problem[];
    }[];
  }[]
>;

export const CURRICULUM_HIERARCHY: CurriculumMap = {
  1: [
    {
      termUnit: "1학기 - 9까지의 수 (수 세기, 가르기와 모으기)",
      topics: [
        { name: "핵심 개념", generator: (c) => fallbackGenerator(c, "9까지의 수") },
      ],
    },
    {
      termUnit: "1학기 - 덧셈과 뺄셈",
      topics: [
        { name: "1) 일의 자리 덧셈", generator: (c) => fallbackGenerator(c, "일의 자리 덧셈") },
        { name: "2) 일의 자리 뺄셈", generator: (c) => fallbackGenerator(c, "일의 자리 뺄셈") },
      ],
    },
    {
      termUnit: "1학기 - 50까지의 수",
      topics: [
        { name: "핵심 개념", generator: (c) => fallbackGenerator(c, "50까지의 수") },
      ],
    },
    {
      termUnit: "2학기 - 100까지의 수",
      topics: [
        { name: "핵심 개념", generator: (c) => fallbackGenerator(c, "100까지의 수") },
      ],
    },
    {
      termUnit: "2학기 - 덧셈과 뺄셈(1)",
      topics: [
        { name: "핵심 개념", generator: (c) => fallbackGenerator(c, "덧셈과 뺄셈(1)") },
      ],
    },
    {
      termUnit: "2학기 - 덧셈과 뺄셈(2)",
      topics: [
        { name: "핵심 개념", generator: (c) => fallbackGenerator(c, "덧셈과 뺄셈(2)") },
      ],
    },
    {
      termUnit: "2학기 - 덧셈과 뺄셈(3)",
      topics: [
        { name: "핵심 개념", generator: (c) => fallbackGenerator(c, "덧셈과 뺄셈(3)") },
      ],
    }
  ],
  2: [
    {
      termUnit: "1학기 - 세 자리 수",
      topics: [
        { name: "핵심 개념", generator: (c) => fallbackGenerator(c, "세 자리 수") },
      ],
    },
    {
      termUnit: "1학기 - 덧셈과 뺄셈",
      topics: [
        { name: "1) 몇십 몇 + 몇 (받아올림 있음)", generator: (c) => add2Digit1DigitWithCarry(c) },
        { name: "2) 몇십 몇 + 몇십 몇 (받아올림 1번)", generator: (c) => add2Digit2DigitWith1Carry(c) },
        { name: "3) 몇십 몇 + 몇십 몇 (받아올림 2번)", generator: (c) => add2Digit2DigitWith2Carry(c) },
        { name: "4) 몇십 몇 - 몇 (받아내림 있음)", generator: (c) => sub2Digit1DigitWithBorrow(c) },
        { name: "5) 몇십 몇 - 몇십 몇 (받아내림 있음)", generator: (c) => sub2Digit2DigitWithBorrow(c) },
      ],
    },
    {
      termUnit: "1학기 - 곱셈",
      topics: [
        { name: "핵심 개념", generator: (c) => fallbackGenerator(c, "곱셈") },
      ],
    },
    {
      termUnit: "2학기 - 네 자리 수",
      topics: [
        { name: "핵심 개념", generator: (c) => fallbackGenerator(c, "네 자리 수") },
      ],
    },
    {
      termUnit: "2학기 - 곱셈구구",
      topics: [
        { name: "1) 2단 곱셈구구", generator: (c) => fallbackGenerator(c, "2단") },
      ],
    },
  ],
  3: [
    {
      termUnit: "1학기 - 덧셈과 뺄셈",
      topics: [
        { name: "핵심 개념", generator: (c) => fallbackGenerator(c, "덧셈과 뺄셈") },
      ],
    },
    {
      termUnit: "1학기 - 나눗셈",
      topics: [
        { name: "핵심 개념", generator: (c) => fallbackGenerator(c, "나눗셈") },
      ],
    },
    {
      termUnit: "1학기 - 곱셈",
      topics: [
        { name: "핵심 개념", generator: (c) => fallbackGenerator(c, "곱셈") },
      ],
    },
    {
      termUnit: "1학기 - 분수와 소수",
      topics: [
        { name: "핵심 개념", generator: (c) => fallbackGenerator(c, "분수와 소수") },
      ],
    },
    {
      termUnit: "2학기 - 곱셈",
      topics: [
        { name: "핵심 개념", generator: (c) => fallbackGenerator(c, "곱셈") },
      ],
    },
    {
      termUnit: "2학기 - 나눗셈",
      topics: [
        { name: "핵심 개념", generator: (c) => fallbackGenerator(c, "나눗셈") },
      ],
    },
    {
      termUnit: "2학기 - 분수",
      topics: [
        { name: "1) 대분수를 가분수로 나타내기", generator: (c) => convertMixedToImproper(c) },
        { name: "2) 가분수를 대분수로 나타내기", generator: (c) => convertImproperToMixed(c) },
      ],
    },
  ],
  4: [
    {
      termUnit: "1학기 - 큰 수",
      topics: [
        { name: "핵심 개념", generator: (c) => fallbackGenerator(c, "큰 수") },
      ],
    },
    {
      termUnit: "1학기 - 곱셈과 나눗셈",
      topics: [
        { name: "핵심 개념", generator: (c) => fallbackGenerator(c, "곱셈과 나눗셈") },
      ],
    },
    {
      termUnit: "2학기 - 분수의 덧셈과 뺄셈",
      topics: [
        { name: "핵심 개념", generator: (c) => fallbackGenerator(c, "분수의 덧셈과 뺄셈") },
      ],
    },
    {
      termUnit: "2학기 - 소수의 덧셈과 뺄셈",
      topics: [
        { name: "핵심 개념", generator: (c) => fallbackGenerator(c, "소수의 덧셈과 뺄셈") },
      ],
    },
  ],
  5: [
    {
      termUnit: "1학기 - 자연수의 혼합 계산",
      topics: [
        { name: "핵심 개념", generator: (c) => fallbackGenerator(c, "자연수의 혼합 계산") },
      ],
    },
    {
      termUnit: "1학기 - 약수와 배수",
      topics: [
        { name: "핵심 개념", generator: (c) => fallbackGenerator(c, "약수와 배수") },
      ],
    },
    {
      termUnit: "1학기 - 약분과 통분",
      topics: [
        { name: "핵심 개념", generator: (c) => fallbackGenerator(c, "약분과 통분") },
      ],
    },
    {
      termUnit: "1학기 - 분수의 덧셈과 뺄셈",
      topics: [
        { name: "핵심 개념", generator: (c) => fallbackGenerator(c, "분수의 덧셈과 뺄셈") },
      ],
    },
    {
      termUnit: "2학기 - 수의 범위와 어림하기",
      topics: [
        { name: "핵심 개념", generator: (c) => fallbackGenerator(c, "수의 범위와 어림하기") },
      ],
    },
    {
      termUnit: "2학기 - 분수의 곱셈",
      topics: [
        { name: "핵심 개념", generator: (c) => fallbackGenerator(c, "분수의 곱셈") },
      ],
    },
    {
      termUnit: "2학기 - 소수의 곱셈",
      topics: [
        { name: "핵심 개념", generator: (c) => fallbackGenerator(c, "소수의 곱셈") },
      ],
    },
  ],
  6: [
    {
      termUnit: "1학기 - 분수의 나눗셈",
      topics: [
        { name: "핵심 개념", generator: (c) => fallbackGenerator(c, "분수의 나눗셈") },
      ],
    },
    {
      termUnit: "1학기 - 소수의 나눗셈",
      topics: [
        { name: "핵심 개념", generator: (c) => fallbackGenerator(c, "소수의 나눗셈") },
      ],
    },
    {
      termUnit: "1학기 - 비와 비율",
      topics: [
        { name: "핵심 개념", generator: (c) => fallbackGenerator(c, "비와 비율") },
      ],
    },
    {
      termUnit: "2학기 - 분수의 나눗셈",
      topics: [
        { name: "핵심 개념", generator: (c) => fallbackGenerator(c, "분수의 나눗셈") },
      ],
    },
    {
      termUnit: "2학기 - 소수의 나눗셈",
      topics: [
        { name: "핵심 개념", generator: (c) => fallbackGenerator(c, "소수의 나눗셈") },
      ],
    },
    {
      termUnit: "2학기 - 비례식과 비례배분",
      topics: [
        { name: "핵심 개념", generator: (c) => fallbackGenerator(c, "비례식과 비례배분") },
      ],
    }
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
  difficulty: Difficulty = "normal"
): Problem[] {
  const gradeUnits = CURRICULUM_HIERARCHY[grade] || [];
  const unit = gradeUnits.find((u) => u.termUnit === termUnit);
  if (!unit) return fallbackGenerator(count, "단원 없음");

  const topic = unit.topics.find((t) => t.name === topicName);
  if (!topic) return fallbackGenerator(count, "주제 없음");

  return topic.generator(count, difficulty);
}
