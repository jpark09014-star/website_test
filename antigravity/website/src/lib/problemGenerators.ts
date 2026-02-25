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
  generator: () => Omit<Problem, "id"> & { key: string },
  maxAttempts = 2000
): Problem[] {
  const seen = new Set<string>();
  const problems: Problem[] = [];
  let attempts = 0;
  while (problems.length < count && attempts < maxAttempts) {
    attempts++;
    const { key, instruction, question, answer, visual, equation, choices } = generator() as Omit<Problem, "id"> & { key: string };
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
function gen1_counting(count: number) {
  return generateUnique(count, () => {
    const total = randInt(2, 9);
    const part1 = randInt(1, total - 1);
    const part2 = total - part1;
    return {
      key: `split_${total}_${part1}`,
      instruction: "□ 안에 알맞은 수를 쓰세요.",
      question: `${total} = ${part1} +`,
      answer: String(part2),
    };
  });
}

// 1학년 1학기: 한 자리 덧셈 (합 ≤ 9)
function gen1_addSingle(count: number) {
  return generateUnique(count, () => {
    const a = randInt(1, 8);
    const b = randInt(1, 9 - a);
    return {
      key: `${a}+${b}`,
      instruction: "덧셈을 하세요.",
      question: `${a} + ${b} = `,
      answer: String(a + b),
    };
  });
}

// 1학년 1학기: 한 자리 뺄셈
function gen1_subSingle(count: number) {
  return generateUnique(count, () => {
    const a = randInt(2, 9);
    const b = randInt(1, a - 1);
    return {
      key: `${a}-${b}`,
      instruction: "뺄셈을 하세요.",
      question: `${a} - ${b} = `,
      answer: String(a - b),
    };
  });
}

// 1학년 2학기: 덧셈과 뺄셈(1) - 받아올림 없는 (몇십)+(몇)
function gen1_addTensPlusOnes(count: number) {
  return generateUnique(count, () => {
    const tens = randInt(1, 8) * 10;
    const ones = randInt(1, 9);
    return {
      key: `${tens}+${ones}`,
      instruction: "덧셈을 하세요.",
      question: `${tens} + ${ones} = `,
      answer: String(tens + ones),
    };
  });
}

// 1학년 2학기: 덧셈과 뺄셈(2) - (몇십몇)+(몇) 받아올림 없음
function gen1_add2d1dNoCarry(count: number) {
  return generateUnique(count, () => {
    const tensA = randInt(1, 8);
    const onesA = randInt(1, 8);
    const b = randInt(1, 9 - onesA); // 받아올림 없도록
    const a = tensA * 10 + onesA;
    return {
      key: `${a}+${b}`,
      instruction: "덧셈을 하세요.",
      question: `${a} + ${b} = `,
      answer: String(a + b),
      visual: { type: "vertical_math" as const, operator: "+" as const, top: a, bottom: b },
    };
  });
}

// 1학년 2학기: 덧셈과 뺄셈(3) - (몇십몇)-(몇) 받아내림 없음
function gen1_sub2d1dNoBorrow(count: number) {
  return generateUnique(count, () => {
    const tensA = randInt(2, 9);
    const onesA = randInt(2, 9);
    const b = randInt(1, onesA); // 받아내림 없도록
    const a = tensA * 10 + onesA;
    return {
      key: `${a}-${b}`,
      instruction: "뺄셈을 하세요.",
      question: `${a} - ${b} = `,
      answer: String(a - b),
      visual: { type: "vertical_math" as const, operator: "-" as const, top: a, bottom: b },
    };
  });
}

// ══════════════════════════════════════════════════════════════
// 2학년 생성기
// ══════════════════════════════════════════════════════════════

// 숫자를 한글로 변환하는 헬퍼 함수 (최대 4자리)
function numToKorean4D(num: number): string {
  const digits = ["", "일", "이", "삼", "사", "오", "육", "칠", "팔", "구"];
  const th = Math.floor(num / 1000);
  const h = Math.floor((num % 1000) / 100);
  const t = Math.floor((num % 100) / 10);
  const o = num % 10;
  
  let str = "";
  if (th > 0) str += (th === 1 ? "" : digits[th]) + "천";
  if (h > 0) str += (h === 1 ? "" : digits[h]) + "백";
  if (t > 0) str += (t === 1 ? "" : digits[t]) + "십";
  if (o > 0) str += digits[o];
  return str || "영";
}

// 2학년 1학기: 세 자리 수 - 수 읽기/쓰기/자릿수
function gen2_threeDigitNum(count: number) {
  return generateUnique(count, () => {
    const hundreds = randInt(1, 9);
    const tens = randInt(0, 9);
    const ones = randInt(1, 9);
    const num = hundreds * 100 + tens * 10 + ones;
    const kor = numToKorean4D(num);
    const type = randInt(0, 2);

    if (type === 0) {
      return {
        key: `3digit_read_${num}`,
        instruction: "다음 수를 한글로 읽어 보세요.",
        question: `${num} = `,
        answer: kor,
      };
    } else if (type === 1) {
      return {
        key: `3digit_write_${num}`,
        instruction: "다음 수를 숫자로 써 보세요.",
        question: `[ ${kor} ] = `,
        answer: String(num),
      };
    } else {
      return {
        key: `3digit_place_${num}`,
        instruction: "빈칸에 알맞은 수를 쓰세요.",
        question: `100이 ${hundreds}개, 10이 ${tens}개, 1이 ${ones}개인 수 = `,
        answer: String(num),
      };
    }
  });
}

// 2학년 1학기: 덧셈 (받아올림 있음)
function gen2_add2dWithCarry(count: number) {
  return generateUnique(count, () => {
    const onesA = randInt(1, 9);
    const onesB = randInt(10 - onesA, 9);
    const tensA = randInt(1, 8);
    const tensB = randInt(1, 8 - tensA);
    const a = tensA * 10 + onesA;
    const b = tensB * 10 + onesB;
    return {
      key: `${a}+${b}`,
      instruction: "덧셈을 하세요.",
      question: `${a} + ${b} = `,
      answer: String(a + b),
      visual: { type: "vertical_math" as const, operator: "+" as const, top: a, bottom: b },
    };
  });
}

// 2학년 1학기: 뺄셈 (받아내림 있음)
function gen2_sub2dWithBorrow(count: number) {
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
      visual: { type: "vertical_math" as const, operator: "-" as const, top: a, bottom: b },
    };
  });
}

// 2학년 1학기: 곱셈 개념 (같은 수 더하기 → 곱셈)
function gen2_mulIntro(count: number) {
  return generateUnique(count, () => {
    const a = randInt(2, 5);
    const b = randInt(2, 5);
    return {
      key: `mulintro_${a}x${b}`,
      instruction: "곱셈으로 나타내고 답을 구하세요.",
      question: `${a} × ${b} = `,
      answer: String(a * b),
    };
  });
}

// 2학년 2학기: 네 자리 수 - 수 읽기/쓰기/자릿수
function gen2_fourDigitNum(count: number) {
  return generateUnique(count, () => {
    const th = randInt(1, 9);
    const h = randInt(0, 9);
    const t = randInt(0, 9);
    const o = randInt(1, 9);
    const num = th * 1000 + h * 100 + t * 10 + o;
    const kor = numToKorean4D(num);
    const type = randInt(0, 2);

    if (type === 0) {
      return {
        key: `4digit_read_${num}`,
        instruction: "다음 수를 한글로 읽어 보세요.",
        question: `${num} = `,
        answer: kor,
      };
    } else if (type === 1) {
      return {
        key: `4digit_write_${num}`,
        instruction: "다음 수를 숫자로 써 보세요.",
        question: `[ ${kor} ] = `,
        answer: String(num),
      };
    } else {
      return {
        key: `4digit_place_${num}`,
        instruction: "빈칸에 알맞은 수를 쓰세요.",
        question: `1000이 ${th}개, 100이 ${h}개, 10이 ${t}개, 1이 ${o}개인 수 = `,
        answer: String(num),
      };
    }
  });
}

// 2학년 2학기: 곱셈구구 (특정 단)
function genMulTable(dan: number, count: number) {
  return generateUnique(count, () => {
    const b = randInt(1, 9);
    return {
      key: `${dan}x${b}`,
      instruction: `${dan}단 곱셈구구를 구하세요.`,
      question: `${dan} × ${b} = `,
      answer: String(dan * b),
    };
  });
}

// 2학년 2학기: 곱셈구구 전체 (2~9단 혼합)
function genMulTableMixed(count: number) {
  return generateUnique(count, () => {
    const a = randInt(2, 9);
    const b = randInt(2, 9);
    return {
      key: `mix_${a}x${b}`,
      instruction: "곱셈구구를 구하세요.",
      question: `${a} × ${b} = `,
      answer: String(a * b),
    };
  });
}

// ══════════════════════════════════════════════════════════════
// 3학년 생성기
// ══════════════════════════════════════════════════════════════

// 3학년 1학기: 세 자리 수 덧셈 — 난이도별 숫자 범위 차등
function gen3_add3digit(count: number, diff: Difficulty = "normal") {
  // easy: 100~299, normal: 100~499, hard: 100~999 (받아올림 多)
  const maxA = diff === "easy" ? 299 : diff === "normal" ? 499 : 999;
  const maxB = diff === "easy" ? 299 : diff === "normal" ? 499 : 999;

  return generateUnique(count, () => {
    const a = randInt(100, maxA);
    const b = randInt(100, maxB);

    // hard: 가끔 서술형 문장제
    if (diff === "hard" && randInt(0, 2) === 0) {
      const items = pick(["사과", "귤", "포도", "딸기", "연필", "지우개", "공책", "색연필"]);
      const items2 = pick(["사과", "귤", "포도", "딸기", "연필", "지우개", "공책", "색연필"].filter(x => x !== items));
      return {
        key: `word_${a}+${b}`,
        instruction: "다음 문제를 풀어보세요.",
        question: `${items} ${a}개와 ${items2} ${b}개를 합하면 모두 몇 개일까요?`,
        answer: String(a + b),
      };
    }

    return {
      key: `${a}+${b}`,
      instruction: "덧셈을 하세요.",
      question: `${a} + ${b} = `,
      answer: String(a + b),
      visual: { type: "vertical_math" as const, operator: "+" as const, top: a, bottom: b },
    };
  });
}

// 3학년 1학기: 세 자리 수 뺄셈 — 난이도별 범위
function gen3_sub3digit(count: number, diff: Difficulty = "normal") {
  const minA = diff === "easy" ? 200 : diff === "normal" ? 200 : 500;
  const maxA = diff === "easy" ? 500 : diff === "normal" ? 999 : 999;

  return generateUnique(count, () => {
    const a = randInt(minA, maxA);
    const b = randInt(100, a - 1);

    if (diff === "hard" && randInt(0, 2) === 0) {
      const item = pick(["구슬", "사탕", "스티커", "카드", "블록"]);
      return {
        key: `word_${a}-${b}`,
        instruction: "다음 문제를 풀어보세요.",
        question: `${item}이 ${a}개 있었는데 ${b}개를 사용했습니다. 남은 ${item}은 몇 개인가요?`,
        answer: String(a - b),
      };
    }

    return {
      key: `${a}-${b}`,
      instruction: "뺄셈을 하세요.",
      question: `${a} - ${b} = `,
      answer: String(a - b),
      visual: { type: "vertical_math" as const, operator: "-" as const, top: a, bottom: b },
    };
  });
}

// 3학년 1학기: 나눗셈 기초
function gen3_divBasic(count: number) {
  return generateUnique(count, () => {
    const b = randInt(2, 9);
    const quotient = randInt(1, 9);
    const a = b * quotient;
    return {
      key: `${a}÷${b}`,
      instruction: "나눗셈을 하세요.",
      question: `${a} ÷ ${b} = `,
      answer: String(quotient),
    };
  });
}

// 3학년 1학기: 두 자리 × 한 자리 곱셈
function gen3_mul2d1d(count: number) {
  return generateUnique(count, () => {
    const a = randInt(11, 49);
    const b = randInt(2, 9);
    return {
      key: `${a}x${b}`,
      instruction: "곱셈을 하세요.",
      question: `${a} × ${b} = `,
      answer: String(a * b),
      visual: { type: "vertical_math" as const, operator: "×" as const, top: a, bottom: b },
    };
  });
}

// 3학년 2학기: 두 자리 × 두 자리 곱셈
function gen3_mul2d2d(count: number) {
  return generateUnique(count, () => {
    const a = randInt(11, 49);
    const b = randInt(11, 49);
    return {
      key: `${a}x${b}`,
      instruction: "곱셈을 하세요.",
      question: `${a} × ${b} = `,
      answer: String(a * b),
      visual: { type: "vertical_math" as const, operator: "×" as const, top: a, bottom: b },
    };
  });
}

// 3학년 2학기: 나머지 있는 나눗셈
function gen3_divWithRemainder(count: number) {
  return generateUnique(count, () => {
    const b = randInt(2, 9);
    const quotient = randInt(2, 9);
    const remainder = randInt(1, b - 1);
    const a = b * quotient + remainder;
    return {
      key: `${a}÷${b}r`,
      instruction: "나눗셈을 하고, 몫과 나머지를 구하세요.",
      question: `${a} ÷ ${b} = ···`,
      answer: `${quotient} ··· ${remainder}`,
    };
  });
}

// 3학년: 분수 (대분수 ↔ 가분수)
function convertMixedToImproper(count: number) {
  return generateUnique(count, () => {
    const denom = randInt(2, 9);
    const whole = randInt(1, 5);
    const numer = randInt(1, denom - 1);
    const improperNumer = whole * denom + numer;
    return {
      key: `${whole}_${numer}/${denom}`,
      instruction: "대분수를 가분수로 나타내어 보세요.",
      question: `${whole}과 ${numer}/${denom} = `,
      answer: `${improperNumer}/${denom}`,
      equation: `${whole}\\frac{${numer}}{${denom}} = `,
      visual: { type: "fraction" as const, whole, numerator: numer, denominator: denom },
    };
  });
}

function convertImproperToMixed(count: number) {
  return generateUnique(count, () => {
    const denom = randInt(2, 9);
    const whole = randInt(1, 5);
    const numer = randInt(1, denom - 1);
    const improperNumer = whole * denom + numer;
    return {
      key: `improper_${improperNumer}/${denom}`,
      instruction: "가분수를 대분수로 나타내어 보세요.",
      question: `${improperNumer}/${denom} = `,
      answer: `${whole}과 ${numer}/${denom}`,
      equation: `\\frac{${improperNumer}}{${denom}} = `,
      visual: { type: "fraction" as const, numerator: improperNumer, denominator: denom },
    };
  });
}

// 3학년 1학기: 분수와 소수 기초
function gen3_fracDecIntro(count: number) {
  return generateUnique(count, () => {
    const denom = randInt(2, 10);
    const numer = randInt(1, denom - 1);
    return {
      key: `fracintro_${numer}/${denom}`,
      instruction: "색칠된 부분을 분수로 나타내세요.",
      question: `전체 ${denom}칸 중 ${numer}칸 =`,
      answer: `${numer}/${denom}`,
    };
  });
}

// ══════════════════════════════════════════════════════════════
// 4학년 생성기
// ══════════════════════════════════════════════════════════════

// 4학년 1학기: 큰 수 - 읽기/쓰기 (만 단위)
function gen4_largeNumbers(count: number) {
  return generateUnique(count, () => {
    const man = randInt(10, 9999);
    const rest = randInt(1, 9999);
    const numStr = `${man}${String(rest).padStart(4, '0')}`;
    const korMan = numToKorean4D(man);
    const korRest = numToKorean4D(rest);
    const fullKor = `${korMan}만 ${korRest === "영" ? "" : korRest}`.trim();
    
    // 세 자리마다 콤마 찍은 형식
    const formattedNum = Number(numStr).toLocaleString('ko-KR');

    const type = randInt(0, 2);

    if (type === 0) {
      return {
        key: `big_read_${numStr}`,
        instruction: "다음 수를 한글로 읽어 보세요.",
        question: `${formattedNum} = `,
        answer: fullKor,
      };
    } else if (type === 1) {
      return {
        key: `big_write_${numStr}`,
        instruction: "다음 수를 숫자로 써 보세요.",
        question: `[ ${fullKor} ] = `,
        answer: formattedNum,
      };
    } else {
      return {
        key: `big_place_${numStr}`,
        instruction: "빈칸에 알맞은 수를 쓰세요.",
        question: `10000이 ${man}개, 1이 ${rest}개인 수 = `,
        answer: formattedNum,
      };
    }
  });
}

// 4학년 1학기: 세 자리 × 두 자리 곱셈 — 난이도별
function gen4_mul3d2d(count: number, diff: Difficulty = "normal") {
  const maxA = diff === "easy" ? 200 : diff === "normal" ? 300 : 500;
  const maxB = diff === "easy" ? 20 : diff === "normal" ? 30 : 50;

  return generateUnique(count, () => {
    const a = randInt(100, maxA);
    const b = randInt(11, maxB);

    if (diff === "hard" && randInt(0, 2) === 0) {
      const item = pick(["한 상자", "한 봉지", "한 묶음"]);
      return {
        key: `word_${a}x${b}`,
        instruction: "다음 문제를 풀어보세요.",
        question: `${item}에 ${a}개씩 ${b}상자이면 모두 몇 개인가요?`,
        answer: String(a * b),
      };
    }

    return {
      key: `${a}x${b}`,
      instruction: "곱셈을 하세요.",
      question: `${a} × ${b} = `,
      answer: String(a * b),
      visual: { type: "vertical_math" as const, operator: "×" as const, top: a, bottom: b },
    };
  });
}

// 4학년 1학기: 두~세 자리 나눗셈 — 난이도별
function gen4_divLong(count: number, diff: Difficulty = "normal") {
  const maxQ = diff === "easy" ? 30 : diff === "normal" ? 99 : 150;
  const maxDiv = diff === "easy" ? 5 : diff === "normal" ? 9 : 9;

  return generateUnique(count, () => {
    const b = randInt(2, maxDiv);
    const quotient = randInt(11, maxQ);
    const a = b * quotient;

    if (diff === "hard" && randInt(0, 2) === 0) {
      const item = pick(["사탕", "초콜릿", "카드", "연필", "스티커"]);
      return {
        key: `word_${a}÷${b}`,
        instruction: "다음 문제를 풀어보세요.",
        question: `${item} ${a}개를 ${b}명에게 똑같이 나누면 한 명에게 몇 개씩 줄 수 있나요?`,
        answer: String(quotient),
      };
    }

    return {
      key: `${a}÷${b}`,
      instruction: "나눗셈을 하세요.",
      question: `${a} ÷ ${b} = `,
      answer: String(quotient),
    };
  });
}

// 4학년 2학기: 분수의 덧셈 (같은 분모)
function gen4_fracAdd(count: number) {
  return generateUnique(count, () => {
    const denom = randInt(3, 9);
    const n1 = randInt(1, denom - 1);
    const n2 = randInt(1, denom - 1);
    return {
      key: `fracA_${n1}/${denom}+${n2}/${denom}`,
      instruction: "분수의 덧셈을 하세요.",
      question: `${n1}/${denom} + ${n2}/${denom} = `,
      answer: `${n1 + n2}/${denom}`,
      equation: `\\frac{${n1}}{${denom}} + \\frac{${n2}}{${denom}} = `,
    };
  });
}

// 4학년 2학기: 분수의 뺄셈 (같은 분모)
function gen4_fracSub(count: number) {
  return generateUnique(count, () => {
    const denom = randInt(3, 9);
    const n1 = randInt(2, denom - 1);
    const n2 = randInt(1, n1 - 1);
    return {
      key: `fracS_${n1}/${denom}-${n2}/${denom}`,
      instruction: "분수의 뺄셈을 하세요.",
      question: `${n1}/${denom} - ${n2}/${denom} = `,
      answer: `${n1 - n2}/${denom}`,
      equation: `\\frac{${n1}}{${denom}} - \\frac{${n2}}{${denom}} = `,
    };
  });
}

// 4학년 2학기: 소수의 덧셈
function gen4_decAdd(count: number) {
  return generateUnique(count, () => {
    const a = randInt(11, 99) / 10;
    const b = randInt(11, 99) / 10;
    const sum = Math.round((a + b) * 10) / 10;
    return {
      key: `decA_${a}+${b}`,
      instruction: "소수의 덧셈을 하세요.",
      question: `${a.toFixed(1)} + ${b.toFixed(1)} = `,
      answer: sum.toFixed(1),
    };
  });
}

// 4학년 2학기: 소수의 뺄셈
function gen4_decSub(count: number) {
  return generateUnique(count, () => {
    const a = randInt(50, 99) / 10;
    const b = randInt(11, Math.floor(a * 10) - 1) / 10;
    const diff = Math.round((a - b) * 10) / 10;
    return {
      key: `decS_${a}-${b}`,
      instruction: "소수의 뺄셈을 하세요.",
      question: `${a.toFixed(1)} - ${b.toFixed(1)} = `,
      answer: diff.toFixed(1),
    };
  });
}

// ══════════════════════════════════════════════════════════════
// 5학년 생성기
// ══════════════════════════════════════════════════════════════

// 5학년 1학기: 혼합 계산 — 난이도별 (easy: 2항, normal: 2항, hard: 3항+괄호)
function gen5_mixedOps(count: number, diff: Difficulty = "normal") {
  return generateUnique(count, () => {
    const a = randInt(2, 9);
    const b = randInt(2, 9);
    const c = randInt(1, 9);

    if (diff === "hard") {
      // 3항 + 괄호: (a + b) × c 또는 a × (b - c)
      const d = randInt(1, 5);
      const pattern = randInt(0, 1);
      if (pattern === 0) {
        return {
          key: `mix3_(${a}+${b})x${c}`,
          instruction: "계산 순서에 맞게 계산하세요.",
          question: `(${a} + ${b}) × ${c} = `,
          answer: String((a + b) * c),
        };
      } else {
        const big = Math.max(b, d);
        const small = Math.min(b, d);
        return {
          key: `mix3_${a}x(${big}-${small})+${c}`,
          instruction: "계산 순서에 맞게 계산하세요.",
          question: `${a} × (${big} - ${small}) + ${c} = `,
          answer: String(a * (big - small) + c),
        };
      }
    }

    // easy / normal: 2항
    const type = randInt(0, 1);
    if (type === 0) {
      return {
        key: `mix_${a}x${b}+${c}`,
        instruction: "계산 순서에 맞게 계산하세요.",
        question: `${a} × ${b} + ${c} = `,
        answer: String(a * b + c),
      };
    } else {
      return {
        key: `mix_${a}+${b}x${c}`,
        instruction: "계산 순서에 맞게 계산하세요.",
        question: `${a} + ${b} × ${c} = `,
        answer: String(a + b * c),
      };
    }
  });
}

// 5학년 1학기: 약수와 배수
function gen5_factorsMultiples(count: number) {
  return generateUnique(count, () => {
    const n = randInt(6, 36);
    const type = randInt(0, 1);
    if (type === 0) {
      // 약수 구하기
      const factors: number[] = [];
      for (let i = 1; i <= n; i++) { if (n % i === 0) factors.push(i); }
      return {
        key: `factors_${n}`,
        instruction: "약수를 모두 구하세요.",
        question: `${n}의 약수 = `,
        answer: factors.join(", "),
      };
    } else {
      // 배수 구하기
      const base = randInt(2, 9);
      const multiples = [1,2,3,4,5].map(i => base * i);
      return {
        key: `multiples_${base}`,
        instruction: "배수를 처음 5개 구하세요.",
        question: `${base}의 배수 = `,
        answer: multiples.join(", "),
      };
    }
  });
}

// 5학년 1학기: 약분과 통분
function gen5_simplify(count: number) {
  return generateUnique(count, () => {
    const factor = randInt(2, 5);
    const numer = randInt(1, 5);
    const denom = randInt(numer + 1, 8);
    return {
      key: `simp_${numer*factor}/${denom*factor}`,
      instruction: "약분하세요.",
      question: `${numer * factor}/${denom * factor} = `,
      answer: `${numer}/${denom}`,
    };
  });
}

// 5학년 1학기: 분수의 덧셈과 뺄셈 (이분모)
function gen5_fracAddDiffDenom(count: number) {
  return generateUnique(count, () => {
    const d1 = randInt(2, 5);
    const d2 = d1 * randInt(2, 3); // d2는 d1의 배수
    const n1 = randInt(1, d1 - 1);
    const n2 = randInt(1, d2 - 1);
    const commonD = d2;
    const commonN1 = n1 * (d2 / d1);
    const result = commonN1 + n2;
    return {
      key: `fracDiff_${n1}/${d1}+${n2}/${d2}`,
      instruction: "통분하여 분수의 덧셈을 하세요.",
      question: `${n1}/${d1} + ${n2}/${d2} = `,
      answer: `${result}/${commonD}`,
      equation: `\\frac{${n1}}{${d1}} + \\frac{${n2}}{${d2}} = `,
    };
  });
}

// 5학년 2학기: 수의 범위와 어림하기
function gen5_estimation(count: number) {
  return generateUnique(count, () => {
    const num = randInt(100, 9999);
    const place = randInt(0, 1); // 0: 반올림 백의 자리, 1: 반올림 십의 자리
    if (place === 0) {
      const rounded = Math.round(num / 100) * 100;
      return {
        key: `round100_${num}`,
        instruction: "백의 자리에서 반올림하세요.",
        question: `${num} → 약`,
        answer: String(rounded),
      };
    } else {
      const rounded = Math.round(num / 10) * 10;
      return {
        key: `round10_${num}`,
        instruction: "십의 자리에서 반올림하세요.",
        question: `${num} → 약`,
        answer: String(rounded),
      };
    }
  });
}

// 5학년 2학기: 분수의 곱셈
function gen5_fracMul(count: number) {
  return generateUnique(count, () => {
    const n1 = randInt(1, 5);
    const d1 = randInt(n1 + 1, 9);
    const whole = randInt(2, 6);
    const resultN = n1 * whole;
    return {
      key: `fracMul_${n1}/${d1}x${whole}`,
      instruction: "분수의 곱셈을 하세요.",
      question: `${n1}/${d1} × ${whole} = `,
      answer: `${resultN}/${d1}`,
      equation: `\\frac{${n1}}{${d1}} \\times ${whole} = `,
    };
  });
}

// 5학년 2학기: 소수의 곱셈
function gen5_decMul(count: number) {
  return generateUnique(count, () => {
    const a = randInt(11, 99) / 10;
    const b = randInt(2, 9);
    const result = Math.round(a * b * 10) / 10;
    return {
      key: `decMul_${a}x${b}`,
      instruction: "소수의 곱셈을 하세요.",
      question: `${a.toFixed(1)} × ${b} = `,
      answer: result.toFixed(1),
    };
  });
}

// ══════════════════════════════════════════════════════════════
// 6학년 생성기
// ══════════════════════════════════════════════════════════════

// 6학년: 분수의 나눗셈 (분수 ÷ 자연수)
function gen6_fracDiv(count: number) {
  return generateUnique(count, () => {
    const divisor = randInt(2, 5);
    const numer = randInt(2, 8) * divisor; // 나누어 떨어지도록
    const denom = randInt(3, 9);
    return {
      key: `fracDiv_${numer}/${denom}÷${divisor}`,
      instruction: "분수의 나눗셈을 하세요.",
      question: `${numer}/${denom} ÷ ${divisor} = `,
      answer: `${numer / divisor}/${denom}`,
      equation: `\\frac{${numer}}{${denom}} \\div ${divisor} = `,
    };
  });
}

// 6학년: 소수의 나눗셈
function gen6_decDiv(count: number) {
  return generateUnique(count, () => {
    const b = randInt(2, 9);
    const quotient = randInt(11, 99) / 10;
    const a = Math.round(quotient * b * 10) / 10;
    return {
      key: `decDiv_${a}÷${b}`,
      instruction: "소수의 나눗셈을 하세요.",
      question: `${a.toFixed(1)} ÷ ${b} = `,
      answer: quotient.toFixed(1),
    };
  });
}

// 6학년: 비와 비율
function gen6_ratio(count: number) {
  return generateUnique(count, () => {
    const a = randInt(1, 9);
    const b = randInt(1, 9);
    return {
      key: `ratio_${a}:${b}`,
      instruction: "비율을 분수로 나타내세요.",
      question: `${a} : ${b} =`,
      answer: `${a}/${b}`,
    };
  });
}

// 6학년: 비례식과 비례배분 — 난이도별
function gen6_proportion(count: number, diff: Difficulty = "normal") {
  const maxK = diff === "easy" ? 3 : diff === "normal" ? 5 : 9;
  const maxBase = diff === "easy" ? 4 : diff === "normal" ? 6 : 9;

  return generateUnique(count, () => {
    const a = randInt(2, maxBase);
    const b = randInt(2, maxBase);
    const k = randInt(2, maxK);

    if (diff === "hard" && randInt(0, 2) === 0) {
      // 비례배분 서술형
      const total = (a + b) * k;
      return {
        key: `propword_${a}:${b}_${total}`,
        instruction: "다음 문제를 풀어보세요.",
        question: `${total}개를 ${a} : ${b}로 나누면 큰 쪽은 몇 개인가요?`,
        answer: String(Math.max(a, b) * k),
      };
    }

    return {
      key: `prop_${a}:${b}=${a*k}:?`,
      instruction: "비례식에서의 값을 구하세요.",
      question: `${a} : ${b} = ${a * k} :`,
      answer: String(b * k),
    };
  });
}

// ══════════════════════════════════════════════════════════════
// 서술형(문장제) 생성기 — 학년별 주요 연산에 상황 문제 템플릿 적용
// ══════════════════════════════════════════════════════════════

/** 2학년: 두 자리 덧셈/뺄셈 서술형 */
function gen2_wordAdd2d(count: number, diff: Difficulty = "normal") {
  const items = ["사과", "귤", "딸기", "바나나", "포도"];
  const containers = ["바구니", "상자", "봉지"];
  const maxA = diff === "easy" ? 40 : diff === "normal" ? 70 : 99;
  const maxB = diff === "easy" ? 30 : diff === "normal" ? 50 : 99;

  return generateUnique(count, () => {
    const isAdd = randInt(0, 1) === 0;
    const item = pick(items);
    const container = pick(containers);

    if (isAdd) {
      const a = randInt(11, maxA);
      const b = randInt(11, maxB);
      return {
        key: `word2a_${a}+${b}`,
        instruction: "다음 문제를 읽고 답을 구하세요.",
        question: `${container}에 ${item}이(가) ${a}개 있고, 또 ${b}개를 더 넣었습니다. 모두 몇 개인가요?`,
        answer: String(a + b),
      };
    } else {
      const a = randInt(30, maxA);
      const b = randInt(11, a - 5);
      return {
        key: `word2s_${a}-${b}`,
        instruction: "다음 문제를 읽고 답을 구하세요.",
        question: `${item}이(가) ${a}개 있었는데 ${b}개를 먹었습니다. 남은 ${item}은 몇 개인가요?`,
        answer: String(a - b),
      };
    }
  });
}

/** 3학년: 곱셈 서술형 */
function gen3_wordMul(count: number, diff: Difficulty = "normal") {
  const contexts = [
    { unit: "한 줄에", counter: "줄", suffix: "명" },
    { unit: "한 봉지에", counter: "봉지", suffix: "개" },
    { unit: "한 상자에", counter: "상자", suffix: "개" },
    { unit: "한 묶음에", counter: "묶음", suffix: "자루" },
  ];
  const maxA = diff === "easy" ? 20 : diff === "normal" ? 50 : 99;
  const maxB = diff === "easy" ? 5 : diff === "normal" ? 9 : 9;

  return generateUnique(count, () => {
    const ctx = pick(contexts);
    const a = randInt(11, maxA);
    const b = randInt(2, maxB);
    return {
      key: `word3m_${a}x${b}`,
      instruction: "다음 문제를 읽고 답을 구하세요.",
      question: `${ctx.unit} ${a}${ctx.suffix}씩 ${b}${ctx.counter}이면 모두 몇 ${ctx.suffix}인가요?`,
      answer: String(a * b),
    };
  });
}

/** 4학년: 나눗셈 서술형 */
function gen4_wordDiv(count: number, diff: Difficulty = "normal") {
  const items = ["연필", "사탕", "초콜릿", "카드", "스티커", "공책"];
  const maxQ = diff === "easy" ? 20 : diff === "normal" ? 50 : 99;
  const maxDiv = diff === "easy" ? 5 : diff === "normal" ? 9 : 9;

  return generateUnique(count, () => {
    const item = pick(items);
    const b = randInt(2, maxDiv);
    const q = randInt(5, maxQ);
    const a = b * q; // 나누어 떨어지도록
    const people = randInt(0, 1) === 0 ? `${b}명` : `${b}묶음`;
    return {
      key: `word4d_${a}÷${b}`,
      instruction: "다음 문제를 읽고 답을 구하세요.",
      question: `${item} ${a}개를 ${people}으로 똑같이 나누면 한 곳에 몇 개씩인가요?`,
      answer: String(q),
    };
  });
}

/** 5학년: 분수 서술형 */
function gen5_wordFrac(count: number, diff: Difficulty = "normal") {
  const foods = ["피자", "케이크", "파이", "빵"];

  return generateUnique(count, () => {
    const food = pick(foods);
    const denom = diff === "easy" ? pick([4, 8]) : pick([3, 4, 5, 6, 8]);
    const n1 = randInt(Math.floor(denom / 2) + 1, denom - 1);
    const n2 = randInt(1, n1 - 1);
    const isAdd = randInt(0, 1) === 0;

    if (isAdd && n1 + n2 <= denom) {
      return {
        key: `word5f_${n1}/${denom}+${n2}/${denom}`,
        instruction: "다음 문제를 읽고 답을 구하세요.",
        question: `${food} ${n1}/${denom}에 ${n2}/${denom}를 더 먹으면 모두 얼마인가요?`,
        answer: `${n1 + n2}/${denom}`,
      };
    }

    return {
      key: `word5f_${n1}/${denom}-${n2}/${denom}`,
      instruction: "다음 문제를 읽고 답을 구하세요.",
      question: `${food}의 ${n1}/${denom}에서 ${n2}/${denom}를 먹었습니다. 남은 양은?`,
      answer: `${n1 - n2}/${denom}`,
    };
  });
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
      generator: (count: number, diff: Difficulty) => Problem[];
    }[];
  }[]
>;

export const CURRICULUM_HIERARCHY: CurriculumMap = {
  1: [
    {
      termUnit: "1학기 - 9까지의 수",
      topics: [
        { name: "가르기와 모으기", generator: (c) => gen1_counting(c) },
      ],
    },
    {
      termUnit: "1학기 - 덧셈과 뺄셈",
      topics: [
        { name: "1) 한 자리 덧셈 (합 ≤ 9)", generator: (c) => gen1_addSingle(c) },
        { name: "2) 한 자리 뺄셈", generator: (c) => gen1_subSingle(c) },
      ],
    },
    {
      termUnit: "1학기 - 50까지의 수",
      topics: [
        { name: "수 세기와 크기 비교", generator: (c) => gen1_counting(c) },
      ],
    },
    {
      termUnit: "2학기 - 100까지의 수",
      topics: [
        { name: "수 세기와 크기 비교", generator: (c) => gen1_counting(c) },
      ],
    },
    {
      termUnit: "2학기 - 덧셈과 뺄셈(1)",
      topics: [
        { name: "1) (몇십) + (몇)", generator: (c) => gen1_addTensPlusOnes(c) },
        { name: "2) 한 자리 덧셈 (합 > 9)", generator: (c) => gen1_addSingle(c) },
      ],
    },
    {
      termUnit: "2학기 - 덧셈과 뺄셈(2)",
      topics: [
        { name: "1) (몇십몇) + (몇) 받아올림 없음", generator: (c) => gen1_add2d1dNoCarry(c) },
        { name: "2) (몇십몇) - (몇) 받아내림 없음", generator: (c) => gen1_sub2d1dNoBorrow(c) },
      ],
    },
    {
      termUnit: "2학기 - 덧셈과 뺄셈(3)",
      topics: [
        { name: "1) 세 수의 덧셈", generator: (c) => gen1_addSingle(c) },
        { name: "2) 세 수의 뺄셈", generator: (c) => gen1_subSingle(c) },
      ],
    },
  ],
  2: [
    {
      termUnit: "1학기 - 세 자리 수",
      topics: [
        { name: "수 읽기와 쓰기", generator: (c) => gen2_threeDigitNum(c) },
      ],
    },
    {
      termUnit: "1학기 - 덧셈과 뺄셈",
      topics: [
        { name: "1) 두 자리 덧셈 (받아올림)", generator: (c) => gen2_add2dWithCarry(c) },
        { name: "2) 두 자리 뺄셈 (받아내림)", generator: (c) => gen2_sub2dWithBorrow(c) },
        { name: "📝 덧셈·뺄셈 서술형", generator: (c, d) => gen2_wordAdd2d(c, d) },
      ],
    },
    {
      termUnit: "1학기 - 곱셈",
      topics: [
        { name: "곱셈의 기초", generator: (c) => gen2_mulIntro(c) },
      ],
    },
    {
      termUnit: "2학기 - 네 자리 수",
      topics: [
        { name: "수 읽기와 쓰기", generator: (c) => gen2_fourDigitNum(c) },
      ],
    },
    {
      termUnit: "2학기 - 곱셈구구",
      topics: [
        { name: "1) 2단", generator: (c) => genMulTable(2, c) },
        { name: "2) 3단", generator: (c) => genMulTable(3, c) },
        { name: "3) 4단", generator: (c) => genMulTable(4, c) },
        { name: "4) 5단", generator: (c) => genMulTable(5, c) },
        { name: "5) 6~9단 혼합", generator: (c) => genMulTableMixed(c) },
      ],
    },
  ],
  3: [
    {
      termUnit: "1학기 - 덧셈과 뺄셈",
      topics: [
        { name: "1) 세 자리 덧셈", generator: (c, d) => gen3_add3digit(c, d) },
        { name: "2) 세 자리 뺄셈", generator: (c, d) => gen3_sub3digit(c, d) },
      ],
    },
    {
      termUnit: "1학기 - 나눗셈",
      topics: [
        { name: "나누어 떨어지는 나눗셈", generator: (c) => gen3_divBasic(c) },
      ],
    },
    {
      termUnit: "1학기 - 곱셈",
      topics: [
        { name: "(두 자리) × (한 자리)", generator: (c) => gen3_mul2d1d(c) },
        { name: "📝 곱셈 서술형", generator: (c, d) => gen3_wordMul(c, d) },
      ],
    },
    {
      termUnit: "1학기 - 평면도형",
      topics: [
        { name: "도형의 변과 꼭짓점", generator: (c, d) => gen3_shapeBasic(c, d) },
      ],
    },
    {
      termUnit: "1학기 - 분수와 소수",
      topics: [
        { name: "분수의 기초 개념", generator: (c) => gen3_fracDecIntro(c) },
      ],
    },
    {
      termUnit: "2학기 - 곱셈",
      topics: [
        { name: "(두 자리) × (두 자리)", generator: (c) => gen3_mul2d2d(c) },
      ],
    },
    {
      termUnit: "2학기 - 나눗셈",
      topics: [
        { name: "나머지 있는 나눗셈", generator: (c) => gen3_divWithRemainder(c) },
      ],
    },
    {
      termUnit: "2학기 - 분수",
      topics: [
        { name: "1) 대분수를 가분수로", generator: (c) => convertMixedToImproper(c) },
        { name: "2) 가분수를 대분수로", generator: (c) => convertImproperToMixed(c) },
      ],
    },
  ],
  4: [
    {
      termUnit: "1학기 - 큰 수",
      topics: [
        { name: "만 단위 이상 수 읽기", generator: (c) => gen4_largeNumbers(c) },
      ],
    },
    {
      termUnit: "1학기 - 곱셈과 나눗셈",
      topics: [
        { name: "1) 세 자리 × 두 자리 곱셈", generator: (c, d) => gen4_mul3d2d(c, d) },
        { name: "2) 두~세 자리 나눗셈", generator: (c, d) => gen4_divLong(c, d) },
        { name: "📝 나눗셈 서술형", generator: (c, d) => gen4_wordDiv(c, d) },
      ],
    },
    {
      termUnit: "1학기 - 각도",
      topics: [
        { name: "각도 계산", generator: (c, d) => gen4_angleCalc(c, d) },
      ],
    },
    {
      termUnit: "1학기 - 삼각형",
      topics: [
        { name: "삼각형 분류", generator: (c, d) => gen4_triangleType(c, d) },
      ],
    },
    {
      termUnit: "2학기 - 분수의 덧셈과 뺄셈",
      topics: [
        { name: "1) 같은 분모 분수 덧셈", generator: (c) => gen4_fracAdd(c) },
        { name: "2) 같은 분모 분수 뺄셈", generator: (c) => gen4_fracSub(c) },
      ],
    },
    {
      termUnit: "2학기 - 소수의 덧셈과 뺄셈",
      topics: [
        { name: "1) 소수 덧셈", generator: (c) => gen4_decAdd(c) },
        { name: "2) 소수 뺄셈", generator: (c) => gen4_decSub(c) },
      ],
    },
  ],
  5: [
    {
      termUnit: "1학기 - 자연수의 혼합 계산",
      topics: [
        { name: "곱셈·덧셈 혼합", generator: (c, d) => gen5_mixedOps(c, d) },
      ],
    },
    {
      termUnit: "1학기 - 약수와 배수",
      topics: [
        { name: "약수와 배수 구하기", generator: (c) => gen5_factorsMultiples(c) },
      ],
    },
    {
      termUnit: "1학기 - 약분과 통분",
      topics: [
        { name: "약분하기", generator: (c) => gen5_simplify(c) },
      ],
    },
    {
      termUnit: "1학기 - 분수의 덧셈과 뺄셈",
      topics: [
        { name: "이분모 분수의 덧셈", generator: (c) => gen5_fracAddDiffDenom(c) },
        { name: "📝 분수 서술형", generator: (c, d) => gen5_wordFrac(c, d) },
      ],
    },
    {
      termUnit: "1학기 - 다각형의 넓이",
      topics: [
        { name: "넓이 계산", generator: (c, d) => gen5_area(c, d) },
      ],
    },
    {
      termUnit: "2학기 - 수의 범위와 어림하기",
      topics: [
        { name: "반올림하기", generator: (c) => gen5_estimation(c) },
      ],
    },
    {
      termUnit: "2학기 - 분수의 곱셈",
      topics: [
        { name: "(분수) × (자연수)", generator: (c) => gen5_fracMul(c) },
      ],
    },
    {
      termUnit: "2학기 - 소수의 곱셈",
      topics: [
        { name: "(소수) × (자연수)", generator: (c) => gen5_decMul(c) },
      ],
    },
  ],
  6: [
    {
      termUnit: "1학기 - 분수의 나눗셈",
      topics: [
        { name: "(분수) ÷ (자연수)", generator: (c) => gen6_fracDiv(c) },
      ],
    },
    {
      termUnit: "1학기 - 소수의 나눗셈",
      topics: [
        { name: "(소수) ÷ (자연수)", generator: (c) => gen6_decDiv(c) },
      ],
    },
    {
      termUnit: "1학기 - 비와 비율",
      topics: [
        { name: "비율을 분수로 나타내기", generator: (c) => gen6_ratio(c) },
      ],
    },
    {
      termUnit: "1학기 - 원의 넓이",
      topics: [
        { name: "원의 넓이와 둘레", generator: (c, d) => gen6_circleArea(c, d) },
      ],
    },
    {
      termUnit: "1학기 - 직육면체의 부피",
      topics: [
        { name: "부피와 겉넓이", generator: (c, d) => gen6_volume(c, d) },
      ],
    },
    {
      termUnit: "2학기 - 분수의 나눗셈",
      topics: [
        { name: "(분수) ÷ (자연수)", generator: (c) => gen6_fracDiv(c) },
      ],
    },
    {
      termUnit: "2학기 - 소수의 나눗셈",
      topics: [
        { name: "(소수) ÷ (자연수)", generator: (c) => gen6_decDiv(c) },
      ],
    },
    {
      termUnit: "2학기 - 비례식과 비례배분",
      topics: [
        { name: "비례식 풀기", generator: (c, d) => gen6_proportion(c, d) },
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
  difficulty: Difficulty = "normal"
): Problem[] {
  const gradeUnits = CURRICULUM_HIERARCHY[grade] || [];
  const unit = gradeUnits.find((u) => u.termUnit === termUnit);
  if (!unit) return [];

  const topic = unit.topics.find((t) => t.name === topicName);
  if (!topic) return [];

  return topic.generator(count, difficulty);
}
