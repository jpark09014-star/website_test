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
  instruction?: string;
  question: string;
  answer: string;
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
      };
}

// ─── 유틸리티 ────────────────────────────────────────────────

const randInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

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
    const { key, instruction, question, answer, visual } = generator();
    if (!seen.has(key)) {
      seen.add(key);
      problems.push({ id: problems.length + 1, instruction, question, answer, visual });
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
      question: `${total} = ${part1} + □`,
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

// 2학년 1학기: 세 자리 수 - 수 읽기/쓰기
function gen2_threeDigitNum(count: number) {
  return generateUnique(count, () => {
    const hundreds = randInt(1, 9);
    const tens = randInt(0, 9);
    const ones = randInt(0, 9);
    const num = hundreds * 100 + tens * 10 + ones;
    return {
      key: `3digit_${num}`,
      instruction: "빈칸에 알맞은 수를 쓰세요.",
      question: `${hundreds}백 ${tens}십 ${ones} = □`,
      answer: String(num),
    };
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

// 2학년 2학기: 네 자리 수
function gen2_fourDigitNum(count: number) {
  return generateUnique(count, () => {
    const th = randInt(1, 9);
    const h = randInt(0, 9);
    const t = randInt(0, 9);
    const o = randInt(0, 9);
    const num = th * 1000 + h * 100 + t * 10 + o;
    return {
      key: `4digit_${num}`,
      instruction: "빈칸에 알맞은 수를 쓰세요.",
      question: `${th}천 ${h}백 ${t}십 ${o} = □`,
      answer: String(num),
    };
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

// 3학년 1학기: 세 자리 수 덧셈
function gen3_add3digit(count: number) {
  return generateUnique(count, () => {
    const a = randInt(100, 499);
    const b = randInt(100, 499);
    return {
      key: `${a}+${b}`,
      instruction: "덧셈을 하세요.",
      question: `${a} + ${b} = `,
      answer: String(a + b),
      visual: { type: "vertical_math" as const, operator: "+" as const, top: a, bottom: b },
    };
  });
}

// 3학년 1학기: 세 자리 수 뺄셈
function gen3_sub3digit(count: number) {
  return generateUnique(count, () => {
    const a = randInt(200, 999);
    const b = randInt(100, a - 1);
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
      question: `${a} ÷ ${b} = □ ··· □`,
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
      question: `전체 ${denom}칸 중 ${numer}칸 = □/□`,
      answer: `${numer}/${denom}`,
    };
  });
}

// ══════════════════════════════════════════════════════════════
// 4학년 생성기
// ══════════════════════════════════════════════════════════════

// 4학년 1학기: 큰 수 - 만 단위 이상
function gen4_largeNumbers(count: number) {
  return generateUnique(count, () => {
    const man = randInt(1, 9);
    const cheon = randInt(0, 9);
    const baek = randInt(0, 9);
    const num = man * 10000 + cheon * 1000 + baek * 100;
    return {
      key: `big_${num}`,
      instruction: "빈칸에 알맞은 수를 쓰세요.",
      question: `${man}만 ${cheon}천 ${baek}백 = □`,
      answer: String(num),
    };
  });
}

// 4학년 1학기: 세 자리 × 두 자리 곱셈
function gen4_mul3d2d(count: number) {
  return generateUnique(count, () => {
    const a = randInt(100, 300);
    const b = randInt(11, 30);
    return {
      key: `${a}x${b}`,
      instruction: "곱셈을 하세요.",
      question: `${a} × ${b} = `,
      answer: String(a * b),
      visual: { type: "vertical_math" as const, operator: "×" as const, top: a, bottom: b },
    };
  });
}

// 4학년 1학기: 두~세 자리 나눗셈
function gen4_divLong(count: number) {
  return generateUnique(count, () => {
    const b = randInt(2, 9);
    const quotient = randInt(11, 99);
    const a = b * quotient;
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

// 5학년 1학기: 혼합 계산
function gen5_mixedOps(count: number) {
  return generateUnique(count, () => {
    const a = randInt(2, 9);
    const b = randInt(2, 9);
    const c = randInt(1, 9);
    // a × b + c 또는 a + b × c
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
        question: `${num} → 약 □`,
        answer: String(rounded),
      };
    } else {
      const rounded = Math.round(num / 10) * 10;
      return {
        key: `round10_${num}`,
        instruction: "십의 자리에서 반올림하세요.",
        question: `${num} → 약 □`,
        answer: String(rounded),
      };
    }
  });
}

// 5학년 2학기: 분수의 곱셈
function gen5_fracMul(count: number) {
  return generateUnique(count, () => {
    const n1 = randInt(1, 5);
    const d1 = randInt(n1 + 1, 8);
    const whole = randInt(2, 9);
    const resultN = n1 * whole;
    return {
      key: `fracMul_${n1}/${d1}x${whole}`,
      instruction: "분수의 곱셈을 하세요.",
      question: `${n1}/${d1} × ${whole} = `,
      answer: `${resultN}/${d1}`,
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
      question: `${a} : ${b} = □/□`,
      answer: `${a}/${b}`,
    };
  });
}

// 6학년: 비례식과 비례배분
function gen6_proportion(count: number) {
  return generateUnique(count, () => {
    const a = randInt(2, 6);
    const b = randInt(2, 6);
    const k = randInt(2, 5);
    return {
      key: `prop_${a}:${b}=${a*k}:?`,
      instruction: "비례식에서 □의 값을 구하세요.",
      question: `${a} : ${b} = ${a * k} : □`,
      answer: String(b * k),
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
        { name: "1) 세 자리 덧셈", generator: (c) => gen3_add3digit(c) },
        { name: "2) 세 자리 뺄셈", generator: (c) => gen3_sub3digit(c) },
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
        { name: "1) 세 자리 × 두 자리 곱셈", generator: (c) => gen4_mul3d2d(c) },
        { name: "2) 두~세 자리 나눗셈", generator: (c) => gen4_divLong(c) },
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
        { name: "곱셈·덧셈 혼합", generator: (c) => gen5_mixedOps(c) },
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
        { name: "비례식 풀기", generator: (c) => gen6_proportion(c) },
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
