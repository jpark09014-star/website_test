/**
 * 초등학교 수학 학습지 문제 생성 모듈
 *
 * [왜 이렇게 설계했는가]
 * - 각 학년/단원별로 독립적인 생성 함수를 두어 실제 교육과정에 맞는 난이도의 문제를 출제합니다.
 * - Set(문자열 키)를 사용하여 문제가 절대로 겹치지 않도록 보장합니다.
 *   예: "3+5" 와 "5+3" 은 덧셈에서는 같은 문제로 취급합니다.
 * - 무한 루프 방지를 위해 maxAttempts 를 두어, 가능한 문제 조합이 소진되면 안전하게 종료합니다.
 */

export interface Problem {
  id: number;
  question: string;
}

// ─── 유틸리티 ────────────────────────────────────────────────

/** 정수 난수 생성 (min~max 포함) */
const randInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

/** 배열에서 랜덤 요소 선택 */
const pick = <T>(arr: T[]): T => arr[randInt(0, arr.length - 1)];

/** 중복 없는 문제를 count개 생성하는 래퍼 */
function generateUnique(
  count: number,
  generator: () => { key: string; question: string },
  maxAttempts = 500
): Problem[] {
  const seen = new Set<string>();
  const problems: Problem[] = [];
  let attempts = 0;

  while (problems.length < count && attempts < maxAttempts) {
    attempts++;
    const { key, question } = generator();
    if (!seen.has(key)) {
      seen.add(key);
      problems.push({ id: problems.length + 1, question });
    }
  }
  return problems;
}

// ─── 1학년 ──────────────────────────────────────────────────

function grade1Addition() {
  // 1의 자리수 + 1의 자리수 (1~9)
  return generateUnique(10, () => {
    const a = randInt(1, 9);
    const b = randInt(1, 9);
    // 교환법칙 고려: 작은 수를 앞에 놓아 "3+5" 와 "5+3" 중복 방지
    const sorted = [Math.min(a, b), Math.max(a, b)];
    return {
      key: `${sorted[0]}+${sorted[1]}`,
      question: `${a} + ${b} = `,
    };
  });
}

function grade1Subtraction() {
  // 1의 자리수 뺄셈 (결과 ≥ 0)
  return generateUnique(10, () => {
    const a = randInt(2, 9);
    const b = randInt(1, a);
    return { key: `${a}-${b}`, question: `${a} - ${b} = ` };
  });
}

function grade1Grouping() {
  // 모으기와 가르기: "□ 와 □ 를 모으면?" 또는 "□ 를 □ 와 □ 로 가르면?"
  return generateUnique(10, () => {
    const total = randInt(3, 10);
    const part = randInt(1, total - 1);
    const type = randInt(0, 1);
    if (type === 0) {
      // 모으기
      return {
        key: `모${part}+${total - part}`,
        question: `${part} 와(과) ${total - part} 를 모으면? = `,
      };
    } else {
      // 가르기
      return {
        key: `가${total}=${part}`,
        question: `${total} 을(를) ${part} 와(과) ( ) 로 가르면? ( ) = `,
      };
    }
  });
}

function grade1Clock() {
  // 시계 보기: "몇 시 몇 분"
  return generateUnique(10, () => {
    const hour = randInt(1, 12);
    const minute = pick([0, 30]); // 1학년은 정각·30분 단위
    return {
      key: `${hour}:${minute}`,
      question: `시계가 ${hour}시 ${minute === 0 ? "정각" : "30분"}을 가리킵니다. 몇 시 몇 분인가요? = `,
    };
  });
}

// ─── 2학년 ──────────────────────────────────────────────────

function grade2Addition() {
  // 두 자리수 + 한/두 자리수
  return generateUnique(10, () => {
    const a = randInt(10, 99);
    const b = randInt(1, 99);
    return { key: `${a}+${b}`, question: `${a} + ${b} = ` };
  });
}

function grade2Subtraction() {
  // 두 자리수 - 한/두 자리수 (결과 ≥ 0)
  return generateUnique(10, () => {
    const a = randInt(10, 99);
    const b = randInt(1, a);
    return { key: `${a}-${b}`, question: `${a} - ${b} = ` };
  });
}

function grade2MultiplicationTable() {
  // 구구단 (2단~9단)
  return generateUnique(10, () => {
    const dan = randInt(2, 9);
    const num = randInt(1, 9);
    return {
      key: `${dan}x${num}`,
      question: `${dan} × ${num} = `,
    };
  });
}

function grade2Length() {
  // 길이 재기: cm 단위 변환 및 비교
  return generateUnique(10, () => {
    const type = randInt(0, 2);
    if (type === 0) {
      const cm = randInt(10, 99);
      return {
        key: `길이cm${cm}`,
        question: `${cm} cm 는 몇 cm 몇 mm 인가요? ( )cm ( )mm`,
      };
    } else if (type === 1) {
      const a = randInt(5, 30);
      const b = randInt(5, 30);
      return {
        key: `길이합${a}+${b}`,
        question: `${a} cm + ${b} cm = ( ) cm`,
      };
    } else {
      const a = randInt(20, 50);
      const b = randInt(5, a - 1);
      return {
        key: `길이차${a}-${b}`,
        question: `${a} cm - ${b} cm = ( ) cm`,
      };
    }
  });
}

// ─── 3학년 ──────────────────────────────────────────────────

function grade3Division() {
  // 나눗셈 기초: 구구단 역산
  return generateUnique(10, () => {
    const divisor = randInt(2, 9);
    const quotient = randInt(1, 9);
    const dividend = divisor * quotient;
    return {
      key: `${dividend}÷${divisor}`,
      question: `${dividend} ÷ ${divisor} = `,
    };
  });
}

function grade3FractionDecimal() {
  // 분수와 소수 기초: 단위 분수, 진분수 크기 비교
  return generateUnique(10, () => {
    const type = randInt(0, 1);
    if (type === 0) {
      // 분수 표현
      const denom = randInt(2, 10);
      const numer = randInt(1, denom - 1);
      return {
        key: `분수${numer}/${denom}`,
        question: `${numer}/${denom} 은(는) 소수로 얼마인가요? = `,
      };
    } else {
      // 크기 비교
      const d = randInt(3, 8);
      const n1 = randInt(1, d - 1);
      let n2 = randInt(1, d - 1);
      while (n2 === n1) n2 = randInt(1, d - 1);
      return {
        key: `비교${n1}/${d}vs${n2}/${d}`,
        question: `${n1}/${d} ○ ${n2}/${d}  (○ 안에 >, <, = 를 넣으세요)`,
      };
    }
  });
}

function grade3Shapes() {
  // 평면도형: 변과 꼭짓점
  const shapes = [
    { name: "삼각형", sides: 3, vertices: 3 },
    { name: "사각형", sides: 4, vertices: 4 },
    { name: "오각형", sides: 5, vertices: 5 },
    { name: "육각형", sides: 6, vertices: 6 },
  ];
  return generateUnique(10, () => {
    const s = pick(shapes);
    const type = randInt(0, 2);
    if (type === 0) {
      return {
        key: `도형변${s.name}`,
        question: `${s.name}의 변의 수는 몇 개인가요? = `,
      };
    } else if (type === 1) {
      return {
        key: `도형꼭${s.name}`,
        question: `${s.name}의 꼭짓점의 수는 몇 개인가요? = `,
      };
    } else {
      const perim = s.sides * randInt(2, 8);
      return {
        key: `둘레${s.name}${perim}`,
        question: `한 변의 길이가 ${perim / s.sides}cm인 정${s.name}의 둘레는? = ( )cm`,
      };
    }
  });
}

function grade3Time() {
  // 시간과 시각: 시간 덧셈/뺄셈, 분 → 시간 변환
  return generateUnique(10, () => {
    const type = randInt(0, 2);
    if (type === 0) {
      const h = randInt(1, 11);
      const addH = randInt(1, 12 - h);
      return {
        key: `시간+${h}+${addH}`,
        question: `${h}시에서 ${addH}시간 후는 몇 시인가요? = `,
      };
    } else if (type === 1) {
      const m = randInt(60, 300);
      return {
        key: `분→시${m}`,
        question: `${m}분은 몇 시간 몇 분인가요? = ( )시간 ( )분`,
      };
    } else {
      const h = randInt(1, 5);
      const m = randInt(0, 59);
      return {
        key: `시→분${h}h${m}m`,
        question: `${h}시간 ${m}분은 몇 분인가요? = ( )분`,
      };
    }
  });
}

// ─── 4학년 ──────────────────────────────────────────────────

function grade4BigNumbers() {
  // 큰 수: 자릿값, 수 크기 비교
  return generateUnique(10, () => {
    const type = randInt(0, 2);
    if (type === 0) {
      const n = randInt(1000, 9999);
      const digit = pick(["천", "백", "십", "일"]);
      return {
        key: `큰수자리${n}${digit}`,
        question: `${n.toLocaleString()}에서 ${digit}의 자리 숫자는? = `,
      };
    } else if (type === 1) {
      const a = randInt(1000, 99999);
      const b = randInt(1000, 99999);
      return {
        key: `큰수비교${a}vs${b}`,
        question: `${a.toLocaleString()} ○ ${b.toLocaleString()}  (○ 안에 >, <, = )`,
      };
    } else {
      const n = randInt(10000, 99999);
      return {
        key: `읽기${n}`,
        question: `${n.toLocaleString()} 을(를) 한글로 읽으세요. = `,
      };
    }
  });
}

function grade4MultiplyDivide() {
  // 곱셈과 나눗셈 (두세 자리 × 한 자리, 두세 자리 ÷ 한 자리)
  return generateUnique(10, () => {
    const type = randInt(0, 1);
    if (type === 0) {
      const a = randInt(12, 999);
      const b = randInt(2, 9);
      return {
        key: `곱${a}x${b}`,
        question: `${a} × ${b} = `,
      };
    } else {
      const divisor = randInt(2, 9);
      const quotient = randInt(10, 99);
      const dividend = divisor * quotient;
      return {
        key: `나${dividend}÷${divisor}`,
        question: `${dividend} ÷ ${divisor} = `,
      };
    }
  });
}

function grade4FractionAddSub() {
  // 분수의 덧셈과 뺄셈 (동분모)
  return generateUnique(10, () => {
    const denom = randInt(3, 12);
    const type = randInt(0, 1);
    if (type === 0) {
      const n1 = randInt(1, denom - 1);
      const n2 = randInt(1, denom - n1);
      return {
        key: `분덧${n1}/${denom}+${n2}/${denom}`,
        question: `${n1}/${denom} + ${n2}/${denom} = `,
      };
    } else {
      const n1 = randInt(2, denom - 1);
      const n2 = randInt(1, n1);
      return {
        key: `분뺄${n1}/${denom}-${n2}/${denom}`,
        question: `${n1}/${denom} - ${n2}/${denom} = `,
      };
    }
  });
}

function grade4Area() {
  // 다각형의 넓이: 직사각형, 정사각형
  return generateUnique(10, () => {
    const type = randInt(0, 1);
    if (type === 0) {
      const w = randInt(2, 15);
      const h = randInt(2, 15);
      return {
        key: `직넓${w}x${h}`,
        question: `가로 ${w}cm, 세로 ${h}cm 인 직사각형의 넓이는? = ( )cm²`,
      };
    } else {
      const s = randInt(2, 15);
      return {
        key: `정넓${s}`,
        question: `한 변의 길이가 ${s}cm인 정사각형의 넓이는? = ( )cm²`,
      };
    }
  });
}

// ─── 5학년 ──────────────────────────────────────────────────

function grade5Factors() {
  // 약수와 배수
  return generateUnique(10, () => {
    const type = randInt(0, 2);
    if (type === 0) {
      const n = randInt(6, 36);
      return {
        key: `약수${n}`,
        question: `${n}의 약수를 모두 구하세요. = `,
      };
    } else if (type === 1) {
      const n = randInt(2, 12);
      const k = randInt(2, 5);
      return {
        key: `배수${n}x${k}`,
        question: `${n}의 배수를 작은 수부터 ${k}개 쓰세요. = `,
      };
    } else {
      const a = randInt(4, 18);
      const b = randInt(4, 18);
      return {
        key: `최대공${a},${b}`,
        question: `${a}와(과) ${b}의 최대공약수를 구하세요. = `,
      };
    }
  });
}

function grade5FractionSimplify() {
  // 약분과 통분
  return generateUnique(10, () => {
    const type = randInt(0, 1);
    if (type === 0) {
      // 약분
      const factor = randInt(2, 6);
      const numer = randInt(1, 5) * factor;
      const denom = randInt(numer / factor + 1, 8) * factor;
      return {
        key: `약분${numer}/${denom}`,
        question: `${numer}/${denom} 을(를) 약분하세요. = `,
      };
    } else {
      // 통분
      const d1 = randInt(2, 6);
      const d2 = randInt(2, 6);
      const n1 = randInt(1, d1 - 1);
      const n2 = randInt(1, d2 - 1);
      return {
        key: `통분${n1}/${d1}과${n2}/${d2}`,
        question: `${n1}/${d1} 과(와) ${n2}/${d2} 를 통분하세요. = `,
      };
    }
  });
}

function grade5Cuboid() {
  // 직육면체: 부피, 꼭짓점, 모서리
  return generateUnique(10, () => {
    const type = randInt(0, 2);
    if (type === 0) {
      const l = randInt(2, 10);
      const w = randInt(2, 10);
      const h = randInt(2, 10);
      return {
        key: `부피${l}x${w}x${h}`,
        question: `가로 ${l}cm, 세로 ${w}cm, 높이 ${h}cm인 직육면체의 부피는? = ( )cm³`,
      };
    } else if (type === 1) {
      const s = randInt(2, 10);
      return {
        key: `정부피${s}`,
        question: `한 모서리의 길이가 ${s}cm인 정육면체의 부피는? = ( )cm³`,
      };
    } else {
      const l = randInt(2, 8);
      const w = randInt(2, 8);
      const h = randInt(2, 8);
      return {
        key: `겉넓이${l}x${w}x${h}`,
        question: `가로 ${l}, 세로 ${w}, 높이 ${h}인 직육면체의 겉넓이는? = ( )cm²`,
      };
    }
  });
}

function grade5Average() {
  // 평균과 가능성
  return generateUnique(10, () => {
    const type = randInt(0, 1);
    if (type === 0) {
      const count = randInt(3, 5);
      const nums = Array.from({ length: count }, () => randInt(50, 100));
      const key = `평균${nums.join(",")}`;
      return {
        key,
        question: `${nums.join(", ")} 의 평균을 구하세요. = `,
      };
    } else {
      const total = randInt(200, 500);
      const count = randInt(4, 6);
      return {
        key: `평균역${total}/${count}`,
        question: `${count}명의 점수 합계가 ${total}점입니다. 평균은? = `,
      };
    }
  });
}

// ─── 6학년 ──────────────────────────────────────────────────

function grade6FractionDivision() {
  // 분수의 나눗셈: (분수) ÷ (자연수), (분수) ÷ (분수)
  return generateUnique(10, () => {
    const type = randInt(0, 1);
    if (type === 0) {
      const denom = randInt(2, 9);
      const numer = randInt(1, denom * 3);
      const divisor = randInt(2, 5);
      return {
        key: `분나${numer}/${denom}÷${divisor}`,
        question: `${numer}/${denom} ÷ ${divisor} = `,
      };
    } else {
      const d1 = randInt(2, 8);
      const n1 = randInt(1, d1 * 2);
      const d2 = randInt(2, 8);
      const n2 = randInt(1, d2);
      return {
        key: `분분나${n1}/${d1}÷${n2}/${d2}`,
        question: `${n1}/${d1} ÷ ${n2}/${d2} = `,
      };
    }
  });
}

function grade6DecimalDivision() {
  // 소수의 나눗셈
  return generateUnique(10, () => {
    const type = randInt(0, 1);
    if (type === 0) {
      // 소수 ÷ 자연수
      const decimal = (randInt(10, 99) / 10).toFixed(1);
      const divisor = randInt(2, 5);
      return {
        key: `소나${decimal}÷${divisor}`,
        question: `${decimal} ÷ ${divisor} = `,
      };
    } else {
      // 소수 ÷ 소수
      const a = (randInt(10, 99) / 10).toFixed(1);
      const b = (randInt(2, 9) / 10).toFixed(1);
      return {
        key: `소소나${a}÷${b}`,
        question: `${a} ÷ ${b} = `,
      };
    }
  });
}

function grade6Ratio() {
  // 비와 비율
  return generateUnique(10, () => {
    const type = randInt(0, 2);
    if (type === 0) {
      const a = randInt(1, 12);
      const b = randInt(1, 12);
      return {
        key: `비값${a}:${b}`,
        question: `${a} : ${b} 의 비의 값을 구하세요. = `,
      };
    } else if (type === 1) {
      // 백분율 변환
      const numer = randInt(1, 19);
      const denom = 20;
      return {
        key: `백분율${numer}/${denom}`,
        question: `${numer}/${denom} 을(를) 백분율로 나타내세요. = ( )%`,
      };
    } else {
      // 비율 문장제
      const total = randInt(20, 100);
      const part = randInt(5, total - 5);
      return {
        key: `비율문${part}of${total}`,
        question: `전체 ${total}개 중 ${part}개의 비율을 분수로 나타내세요. = `,
      };
    }
  });
}

function grade6Solids() {
  // 원기둥, 원뿔, 구
  return generateUnique(10, () => {
    const type = randInt(0, 2);
    if (type === 0) {
      // 원기둥 부피
      const r = randInt(2, 8);
      const h = randInt(3, 12);
      return {
        key: `원기둥${r}x${h}`,
        question: `반지름 ${r}cm, 높이 ${h}cm인 원기둥의 부피는? (π 사용) = `,
      };
    } else if (type === 1) {
      // 원의 넓이
      const r = randInt(2, 10);
      return {
        key: `원넓이${r}`,
        question: `반지름이 ${r}cm인 원의 넓이를 구하세요. (π 사용) = `,
      };
    } else {
      // 원둘레
      const r = randInt(2, 10);
      return {
        key: `원둘레${r}`,
        question: `반지름이 ${r}cm인 원의 둘레를 구하세요. (π 사용) = `,
      };
    }
  });
}

// ─── 메인 라우터 ─────────────────────────────────────────────

/** 학년별/단원별 문제 생성 함수 매핑 테이블 */
const GENERATOR_MAP: Record<string, () => Problem[]> = {
  // 1학년
  "1-1의 자리수 덧셈": grade1Addition,
  "1-1의 자리수 뺄셈": grade1Subtraction,
  "1-모으기와 가르기": grade1Grouping,
  "1-시계 보기": grade1Clock,
  // 2학년
  "2-2의 자리수 덧셈": grade2Addition,
  "2-2의 자리수 뺄셈": grade2Subtraction,
  "2-구구단": grade2MultiplicationTable,
  "2-길이 재기": grade2Length,
  // 3학년
  "3-나눗셈 기초": grade3Division,
  "3-분수와 소수 기초": grade3FractionDecimal,
  "3-평면도형": grade3Shapes,
  "3-시간과 시간": grade3Time,
  // 4학년
  "4-큰 수": grade4BigNumbers,
  "4-곱셈과 나눗셈": grade4MultiplyDivide,
  "4-분수의 덧셈과 뺄셈": grade4FractionAddSub,
  "4-다각형의 넓이": grade4Area,
  // 5학년
  "5-약수와 배수": grade5Factors,
  "5-약분과 통분": grade5FractionSimplify,
  "5-직육면체": grade5Cuboid,
  "5-평균과 가능성": grade5Average,
  // 6학년
  "6-분수의 나눗셈": grade6FractionDivision,
  "6-소수의 나눗셈": grade6DecimalDivision,
  "6-비와 비율": grade6Ratio,
  "6-원기둥, 원뿔, 구": grade6Solids,
};

/**
 * 학년과 단원을 받아 10개의 고유한 문제를 생성합니다.
 * @param grade - 학년 (1~6)
 * @param topic - 단원 이름
 */
export function generateProblems(grade: number, topic: string): Problem[] {
  const key = `${grade}-${topic}`;
  const generator = GENERATOR_MAP[key];

  if (generator) {
    return generator();
  }

  // 매핑이 없는 경우 기본 폴백 (안전장치)
  return Array.from({ length: 10 }, (_, i) => ({
    id: i + 1,
    question: `문제 준비중 (${topic})`,
  }));
}

/** 단원 목록 (page.tsx에서도 사용) */
export const TOPICS_BY_GRADE: Record<number, string[]> = {
  1: ["1의 자리수 덧셈", "1의 자리수 뺄셈", "모으기와 가르기", "시계 보기"],
  2: ["2의 자리수 덧셈", "2의 자리수 뺄셈", "구구단", "길이 재기"],
  3: ["나눗셈 기초", "분수와 소수 기초", "평면도형", "시간과 시간"],
  4: ["큰 수", "곱셈과 나눗셈", "분수의 덧셈과 뺄셈", "다각형의 넓이"],
  5: ["약수와 배수", "약분과 통분", "직육면체", "평균과 가능성"],
  6: ["분수의 나눗셈", "소수의 나눗셈", "비와 비율", "원기둥, 원뿔, 구"],
};
