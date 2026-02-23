/**
 * 초등학교 수학 학습지 문제 생성 모듈
 *
 * [왜 이렇게 설계했는가]
 * - 각 학년/단원별로 독립적인 생성 함수를 두어 실제 교육과정에 맞는 난이도의 문제를 출제합니다.
 * - Set(문자열 키)를 사용하여 문제가 절대로 겹치지 않도록 보장합니다.
 * - 난이도(easy/normal/hard)에 따라 숫자 범위가 자동 조절됩니다.
 * - 모든 문제에 정답(answer)이 포함되어 정답 확인이 가능합니다.
 */

export type Difficulty = "easy" | "normal" | "hard";

export interface Problem {
  id: number;
  question: string;
  answer: string; // 정답 문자열
  visual?:
    | { type: "clock"; hour: number; minute: number }
    | {
        type: "grouping",
        category: "group" | "split",
        total: number | "?",
        part1: number | "?",
        part2: number | "?",
      };
}

// ─── 유틸리티 ────────────────────────────────────────────────

/** 정수 난수 생성 (min~max 포함) */
const randInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

/** 배열에서 랜덤 요소 선택 */
const pick = <T>(arr: T[]): T => arr[randInt(0, arr.length - 1)];

/** 최대공약수 */
const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));

/** 중복 없는 문제를 count개 생성하는 래퍼 */
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
    const { key, question, answer, visual } = generator();
    if (!seen.has(key)) {
      seen.add(key);
      problems.push({ id: problems.length + 1, question, answer, visual });
    }
  }
  return problems;
}

/**
 * 난이도에 따라 숫자 범위를 조절하는 헬퍼
 * easy: 원래 범위의 하한~중간
 * normal: 원래 범위 그대로
 * hard: 원래 범위의 중간~상한 확장
 */
function diffRange(
  difficulty: Difficulty,
  easyMin: number, easyMax: number,
  normalMin: number, normalMax: number,
  hardMin: number, hardMax: number
): [number, number] {
  switch (difficulty) {
    case "easy": return [easyMin, easyMax];
    case "hard": return [hardMin, hardMax];
    default: return [normalMin, normalMax];
  }
}

// ─── 1학년 ──────────────────────────────────────────────────

function grade1Addition(count: number, diff: Difficulty) {
  const [min, max] = diffRange(diff, 1, 5, 1, 9, 1, 9);
  return generateUnique(count, () => {
    const a = randInt(min, max);
    const b = randInt(min, max);
    const sorted = [Math.min(a, b), Math.max(a, b)];
    return {
      key: `${sorted[0]}+${sorted[1]}`,
      question: `${a} + ${b} = `,
      answer: String(a + b),
    };
  });
}

function grade1Subtraction(count: number, diff: Difficulty) {
  const [min, max] = diffRange(diff, 2, 5, 2, 9, 2, 9);
  return generateUnique(count, () => {
    const a = randInt(min, max);
    const b = randInt(1, a - (diff === "easy" ? 0 : 0));
    return {
      key: `${a}-${b}`,
      question: `${a} - ${b} = `,
      answer: String(a - b),
    };
  });
}

function grade1Grouping(count: number, diff: Difficulty) {
  const [min, max] = diffRange(diff, 3, 6, 3, 10, 5, 15);
  return generateUnique(count, () => {
    const total = randInt(min, max);
    const part = randInt(1, total - 1);
    const type = randInt(0, 1);
    if (type === 0) {
      return {
        key: `모${part}+${total - part}`,
        question: `빈칸에 알맞은 수를 써넣으세요.`,
        answer: String(total),
        visual: { type: "grouping", category: "group", total: "?", part1: part, part2: total - part },
      };
    } else {
      return {
        key: `가${total}=${part}`,
        question: `빈칸에 알맞은 수를 써넣으세요.`,
        answer: String(total - part),
        visual: { type: "grouping", category: "split", total: total, part1: part, part2: "?" },
      };
    }
  });
}

function grade1Clock(count: number) {
  return generateUnique(count, () => {
    const hour = randInt(1, 12);
    const minute = pick([0, 30]);
    return {
      key: `${hour}:${minute}`,
      question: `시계가 가리키는 시각을 적어보세요.`,
      answer: `${hour}시 ${minute === 0 ? "정각" : "30분"}`,
      visual: { type: "clock", hour, minute },
    };
  });
}

// ─── 2학년 ──────────────────────────────────────────────────

function grade2Addition(count: number, diff: Difficulty) {
  const [minA, maxA] = diffRange(diff, 10, 50, 10, 99, 10, 99);
  const [minB, maxB] = diffRange(diff, 1, 30, 1, 99, 10, 99);
  return generateUnique(count, () => {
    const a = randInt(minA, maxA);
    const b = randInt(minB, maxB);
    return {
      key: `${a}+${b}`,
      question: `${a} + ${b} = `,
      answer: String(a + b),
    };
  });
}

function grade2Subtraction(count: number, diff: Difficulty) {
  const [minA, maxA] = diffRange(diff, 10, 50, 10, 99, 20, 99);
  return generateUnique(count, () => {
    const a = randInt(minA, maxA);
    const b = randInt(1, a);
    return {
      key: `${a}-${b}`,
      question: `${a} - ${b} = `,
      answer: String(a - b),
    };
  });
}

function grade2MultiplicationTable(count: number, diff: Difficulty) {
  const [minDan, maxDan] = diffRange(diff, 2, 5, 2, 9, 2, 9);
  const [minNum, maxNum] = diffRange(diff, 1, 5, 1, 9, 1, 9);
  return generateUnique(count, () => {
    const dan = randInt(minDan, maxDan);
    const num = randInt(minNum, maxNum);
    return {
      key: `${dan}x${num}`,
      question: `${dan} × ${num} = `,
      answer: String(dan * num),
    };
  });
}

function grade2Length(count: number) {
  return generateUnique(count, () => {
    const type = randInt(0, 2);
    if (type === 0) {
      const cm = randInt(10, 99);
      return {
        key: `길이cm${cm}`,
        question: `${cm} cm 는 몇 cm 몇 mm 인가요? ( )cm ( )mm`,
        answer: `${cm}cm 0mm`,
      };
    } else if (type === 1) {
      const a = randInt(5, 30);
      const b = randInt(5, 30);
      return {
        key: `길이합${a}+${b}`,
        question: `${a} cm + ${b} cm = ( ) cm`,
        answer: `${a + b}cm`,
      };
    } else {
      const a = randInt(20, 50);
      const b = randInt(5, a - 1);
      return {
        key: `길이차${a}-${b}`,
        question: `${a} cm - ${b} cm = ( ) cm`,
        answer: `${a - b}cm`,
      };
    }
  });
}

// ─── 3학년 ──────────────────────────────────────────────────

function grade3Division(count: number, diff: Difficulty) {
  const [minD, maxD] = diffRange(diff, 2, 5, 2, 9, 2, 9);
  const [minQ, maxQ] = diffRange(diff, 1, 5, 1, 9, 2, 12);
  return generateUnique(count, () => {
    const divisor = randInt(minD, maxD);
    const quotient = randInt(minQ, maxQ);
    const dividend = divisor * quotient;
    return {
      key: `${dividend}÷${divisor}`,
      question: `${dividend} ÷ ${divisor} = `,
      answer: String(quotient),
    };
  });
}

function grade3FractionDecimal(count: number) {
  return generateUnique(count, () => {
    const type = randInt(0, 1);
    if (type === 0) {
      const denom = randInt(2, 10);
      const numer = randInt(1, denom - 1);
      const val = (numer / denom).toFixed(2).replace(/0+$/, "").replace(/\.$/, "");
      return {
        key: `분수${numer}/${denom}`,
        question: `${numer}/${denom} 은(는) 소수로 얼마인가요? = `,
        answer: val,
      };
    } else {
      const d = randInt(3, 8);
      const n1 = randInt(1, d - 1);
      let n2 = randInt(1, d - 1);
      while (n2 === n1) n2 = randInt(1, d - 1);
      const sign = n1 > n2 ? ">" : n1 < n2 ? "<" : "=";
      return {
        key: `비교${n1}/${d}vs${n2}/${d}`,
        question: `${n1}/${d} ○ ${n2}/${d}  (○ 안에 >, <, = 를 넣으세요)`,
        answer: sign,
      };
    }
  });
}

function grade3Shapes(count: number) {
  const shapes = [
    { name: "삼각형", sides: 3, vertices: 3 },
    { name: "사각형", sides: 4, vertices: 4 },
    { name: "오각형", sides: 5, vertices: 5 },
    { name: "육각형", sides: 6, vertices: 6 },
  ];
  return generateUnique(count, () => {
    const s = pick(shapes);
    const type = randInt(0, 2);
    if (type === 0) {
      return {
        key: `도형변${s.name}`,
        question: `${s.name}의 변의 수는 몇 개인가요? = `,
        answer: String(s.sides),
      };
    } else if (type === 1) {
      return {
        key: `도형꼭${s.name}`,
        question: `${s.name}의 꼭짓점의 수는 몇 개인가요? = `,
        answer: String(s.vertices),
      };
    } else {
      const sideLen = randInt(2, 8);
      const perim = s.sides * sideLen;
      return {
        key: `둘레${s.name}${sideLen}`,
        question: `한 변의 길이가 ${sideLen}cm인 정${s.name}의 둘레는? = ( )cm`,
        answer: `${perim}cm`,
      };
    }
  });
}

function grade3Time(count: number) {
  return generateUnique(count, () => {
    const type = randInt(0, 2);
    if (type === 0) {
      const h = randInt(1, 11);
      const addH = randInt(1, 12 - h);
      return {
        key: `시간+${h}+${addH}`,
        question: `${h}시에서 ${addH}시간 후는 몇 시인가요? = `,
        answer: `${h + addH}시`,
      };
    } else if (type === 1) {
      const m = randInt(60, 300);
      const hours = Math.floor(m / 60);
      const mins = m % 60;
      return {
        key: `분→시${m}`,
        question: `${m}분은 몇 시간 몇 분인가요? = ( )시간 ( )분`,
        answer: `${hours}시간 ${mins}분`,
      };
    } else {
      const h = randInt(1, 5);
      const m = randInt(0, 59);
      return {
        key: `시→분${h}h${m}m`,
        question: `${h}시간 ${m}분은 몇 분인가요? = ( )분`,
        answer: `${h * 60 + m}분`,
      };
    }
  });
}

// ─── 4학년 ──────────────────────────────────────────────────

function grade4BigNumbers(count: number, diff: Difficulty) {
  return generateUnique(count, () => {
    const type = randInt(0, 2);
    if (type === 0) {
      const [min, max] = diffRange(diff, 100, 999, 1000, 9999, 10000, 99999);
      const n = randInt(min, max);
      const digits = String(n);
      const pos = randInt(0, digits.length - 1);
      const placeNames = ["일", "십", "백", "천", "만"];
      const placeName = placeNames[digits.length - 1 - pos] || "일";
      return {
        key: `큰수자리${n}${placeName}`,
        question: `${n.toLocaleString()}에서 ${placeName}의 자리 숫자는? = `,
        answer: digits[pos],
      };
    } else if (type === 1) {
      const [min, max] = diffRange(diff, 100, 9999, 1000, 99999, 10000, 999999);
      const a = randInt(min, max);
      const b = randInt(min, max);
      const sign = a > b ? ">" : a < b ? "<" : "=";
      return {
        key: `큰수비교${a}vs${b}`,
        question: `${a.toLocaleString()} ○ ${b.toLocaleString()}  (○ 안에 >, <, = )`,
        answer: sign,
      };
    } else {
      const [min, max] = diffRange(diff, 100, 999, 10000, 99999, 100000, 999999);
      const n = randInt(min, max);
      return {
        key: `읽기${n}`,
        question: `${n.toLocaleString()} 을(를) 한글로 읽으세요. = `,
        answer: String(n),
      };
    }
  });
}

function grade4MultiplyDivide(count: number, diff: Difficulty) {
  return generateUnique(count, () => {
    const type = randInt(0, 1);
    if (type === 0) {
      const [minA, maxA] = diffRange(diff, 12, 99, 12, 999, 100, 999);
      const [minB, maxB] = diffRange(diff, 2, 5, 2, 9, 3, 9);
      const a = randInt(minA, maxA);
      const b = randInt(minB, maxB);
      return {
        key: `곱${a}x${b}`,
        question: `${a} × ${b} = `,
        answer: String(a * b),
      };
    } else {
      const [minD, maxD] = diffRange(diff, 2, 5, 2, 9, 3, 9);
      const [minQ, maxQ] = diffRange(diff, 10, 30, 10, 99, 20, 150);
      const divisor = randInt(minD, maxD);
      const quotient = randInt(minQ, maxQ);
      const dividend = divisor * quotient;
      return {
        key: `나${dividend}÷${divisor}`,
        question: `${dividend} ÷ ${divisor} = `,
        answer: String(quotient),
      };
    }
  });
}

function grade4FractionAddSub(count: number, diff: Difficulty) {
  const [minD, maxD] = diffRange(diff, 3, 6, 3, 12, 5, 20);
  return generateUnique(count, () => {
    const denom = randInt(minD, maxD);
    const type = randInt(0, 1);
    if (type === 0) {
      const n1 = randInt(1, denom - 1);
      const n2 = randInt(1, denom - n1);
      const sum = n1 + n2;
      const g = gcd(sum, denom);
      return {
        key: `분덧${n1}/${denom}+${n2}/${denom}`,
        question: `${n1}/${denom} + ${n2}/${denom} = `,
        answer: g === denom ? String(sum / denom) : `${sum / g}/${denom / g}`,
      };
    } else {
      const n1 = randInt(2, denom - 1);
      const n2 = randInt(1, n1);
      const result = n1 - n2;
      if (result === 0) {
        return {
          key: `분뺄${n1}/${denom}-${n2}/${denom}`,
          question: `${n1}/${denom} - ${n2}/${denom} = `,
          answer: "0",
        };
      }
      const g = gcd(result, denom);
      return {
        key: `분뺄${n1}/${denom}-${n2}/${denom}`,
        question: `${n1}/${denom} - ${n2}/${denom} = `,
        answer: g === denom ? String(result / denom) : `${result / g}/${denom / g}`,
      };
    }
  });
}

function grade4Area(count: number, diff: Difficulty) {
  const [min, max] = diffRange(diff, 2, 8, 2, 15, 5, 25);
  return generateUnique(count, () => {
    const type = randInt(0, 1);
    if (type === 0) {
      const w = randInt(min, max);
      const h = randInt(min, max);
      return {
        key: `직넓${w}x${h}`,
        question: `가로 ${w}cm, 세로 ${h}cm 인 직사각형의 넓이는? = ( )cm²`,
        answer: `${w * h}cm²`,
      };
    } else {
      const s = randInt(min, max);
      return {
        key: `정넓${s}`,
        question: `한 변의 길이가 ${s}cm인 정사각형의 넓이는? = ( )cm²`,
        answer: `${s * s}cm²`,
      };
    }
  });
}

// ─── 5학년 ──────────────────────────────────────────────────

function grade5Factors(count: number, diff: Difficulty) {
  return generateUnique(count, () => {
    const type = randInt(0, 2);
    if (type === 0) {
      const [min, max] = diffRange(diff, 6, 20, 6, 36, 12, 60);
      const n = randInt(min, max);
      // 약수 계산
      const factors: number[] = [];
      for (let i = 1; i <= n; i++) {
        if (n % i === 0) factors.push(i);
      }
      return {
        key: `약수${n}`,
        question: `${n}의 약수를 모두 구하세요. = `,
        answer: factors.join(", "),
      };
    } else if (type === 1) {
      const [min, max] = diffRange(diff, 2, 6, 2, 12, 5, 15);
      const n = randInt(min, max);
      const k = randInt(2, 5);
      const multiples = Array.from({ length: k }, (_, i) => n * (i + 1));
      return {
        key: `배수${n}x${k}`,
        question: `${n}의 배수를 작은 수부터 ${k}개 쓰세요. = `,
        answer: multiples.join(", "),
      };
    } else {
      const [min, max] = diffRange(diff, 4, 12, 4, 18, 6, 36);
      const a = randInt(min, max);
      const b = randInt(min, max);
      return {
        key: `최대공${a},${b}`,
        question: `${a}와(과) ${b}의 최대공약수를 구하세요. = `,
        answer: String(gcd(a, b)),
      };
    }
  });
}

function grade5FractionSimplify(count: number) {
  return generateUnique(count, () => {
    const type = randInt(0, 1);
    if (type === 0) {
      const factor = randInt(2, 6);
      const numer = randInt(1, 5) * factor;
      const denom = randInt(Math.floor(numer / factor) + 1, 8) * factor;
      const g = gcd(numer, denom);
      return {
        key: `약분${numer}/${denom}`,
        question: `${numer}/${denom} 을(를) 약분하세요. = `,
        answer: `${numer / g}/${denom / g}`,
      };
    } else {
      const d1 = randInt(2, 6);
      const d2 = randInt(2, 6);
      const n1 = randInt(1, d1 - 1);
      const n2 = randInt(1, d2 - 1);
      // 최소공배수 계산
      const lcm = (d1 * d2) / gcd(d1, d2);
      const nn1 = n1 * (lcm / d1);
      const nn2 = n2 * (lcm / d2);
      return {
        key: `통분${n1}/${d1}과${n2}/${d2}`,
        question: `${n1}/${d1} 과(와) ${n2}/${d2} 를 통분하세요. = `,
        answer: `${nn1}/${lcm} 과(와) ${nn2}/${lcm}`,
      };
    }
  });
}

function grade5Cuboid(count: number, diff: Difficulty) {
  const [min, max] = diffRange(diff, 2, 5, 2, 10, 3, 15);
  return generateUnique(count, () => {
    const type = randInt(0, 2);
    if (type === 0) {
      const l = randInt(min, max);
      const w = randInt(min, max);
      const h = randInt(min, max);
      return {
        key: `부피${l}x${w}x${h}`,
        question: `가로 ${l}cm, 세로 ${w}cm, 높이 ${h}cm인 직육면체의 부피는? = ( )cm³`,
        answer: `${l * w * h}cm³`,
      };
    } else if (type === 1) {
      const s = randInt(min, max);
      return {
        key: `정부피${s}`,
        question: `한 모서리의 길이가 ${s}cm인 정육면체의 부피는? = ( )cm³`,
        answer: `${s * s * s}cm³`,
      };
    } else {
      const l = randInt(min, max);
      const w = randInt(min, max);
      const h = randInt(min, max);
      const area = 2 * (l * w + w * h + l * h);
      return {
        key: `겉넓이${l}x${w}x${h}`,
        question: `가로 ${l}, 세로 ${w}, 높이 ${h}인 직육면체의 겉넓이는? = ( )cm²`,
        answer: `${area}cm²`,
      };
    }
  });
}

function grade5Average(count: number) {
  return generateUnique(count, () => {
    const type = randInt(0, 1);
    if (type === 0) {
      const numCount = randInt(3, 5);
      const nums = Array.from({ length: numCount }, () => randInt(50, 100));
      const avg = nums.reduce((a, b) => a + b, 0) / numCount;
      return {
        key: `평균${nums.join(",")}`,
        question: `${nums.join(", ")} 의 평균을 구하세요. = `,
        answer: Number.isInteger(avg) ? String(avg) : avg.toFixed(1),
      };
    } else {
      const total = randInt(200, 500);
      const numCount = randInt(4, 6);
      const avg = total / numCount;
      return {
        key: `평균역${total}/${numCount}`,
        question: `${numCount}명의 점수 합계가 ${total}점입니다. 평균은? = `,
        answer: Number.isInteger(avg) ? String(avg) : avg.toFixed(1),
      };
    }
  });
}

// ─── 6학년 ──────────────────────────────────────────────────

function grade6FractionDivision(count: number) {
  return generateUnique(count, () => {
    const type = randInt(0, 1);
    if (type === 0) {
      const denom = randInt(2, 9);
      const numer = randInt(1, denom * 3);
      const divisor = randInt(2, 5);
      // (numer/denom) ÷ divisor = numer / (denom * divisor)
      const rn = numer;
      const rd = denom * divisor;
      const g = gcd(rn, rd);
      return {
        key: `분나${numer}/${denom}÷${divisor}`,
        question: `${numer}/${denom} ÷ ${divisor} = `,
        answer: rd / g === 1 ? String(rn / g) : `${rn / g}/${rd / g}`,
      };
    } else {
      const d1 = randInt(2, 8);
      const n1 = randInt(1, d1 * 2);
      const d2 = randInt(2, 8);
      const n2 = randInt(1, d2);
      // (n1/d1) ÷ (n2/d2) = (n1*d2) / (d1*n2)
      const rn = n1 * d2;
      const rd = d1 * n2;
      const g = gcd(rn, rd);
      return {
        key: `분분나${n1}/${d1}÷${n2}/${d2}`,
        question: `${n1}/${d1} ÷ ${n2}/${d2} = `,
        answer: rd / g === 1 ? String(rn / g) : `${rn / g}/${rd / g}`,
      };
    }
  });
}

function grade6DecimalDivision(count: number) {
  return generateUnique(count, () => {
    const type = randInt(0, 1);
    if (type === 0) {
      const decimal = parseFloat((randInt(10, 99) / 10).toFixed(1));
      const divisor = randInt(2, 5);
      const result = decimal / divisor;
      return {
        key: `소나${decimal}÷${divisor}`,
        question: `${decimal} ÷ ${divisor} = `,
        answer: Number.isInteger(result) ? String(result) : result.toFixed(2).replace(/0+$/, "").replace(/\.$/, ""),
      };
    } else {
      const a = parseFloat((randInt(10, 99) / 10).toFixed(1));
      const b = parseFloat((randInt(2, 9) / 10).toFixed(1));
      const result = a / b;
      return {
        key: `소소나${a}÷${b}`,
        question: `${a} ÷ ${b} = `,
        answer: Number.isInteger(result) ? String(result) : result.toFixed(2).replace(/0+$/, "").replace(/\.$/, ""),
      };
    }
  });
}

function grade6Ratio(count: number) {
  return generateUnique(count, () => {
    const type = randInt(0, 2);
    if (type === 0) {
      const a = randInt(1, 12);
      const b = randInt(1, 12);
      const val = a / b;
      return {
        key: `비값${a}:${b}`,
        question: `${a} : ${b} 의 비의 값을 구하세요. = `,
        answer: Number.isInteger(val) ? String(val) : val.toFixed(2).replace(/0+$/, "").replace(/\.$/, ""),
      };
    } else if (type === 1) {
      const numer = randInt(1, 19);
      const denom = 20;
      const pct = (numer / denom) * 100;
      return {
        key: `백분율${numer}/${denom}`,
        question: `${numer}/${denom} 을(를) 백분율로 나타내세요. = ( )%`,
        answer: `${pct}%`,
      };
    } else {
      const total = randInt(20, 100);
      const part = randInt(5, total - 5);
      const g = gcd(part, total);
      return {
        key: `비율문${part}of${total}`,
        question: `전체 ${total}개 중 ${part}개의 비율을 분수로 나타내세요. = `,
        answer: `${part / g}/${total / g}`,
      };
    }
  });
}

function grade6Solids(count: number) {
  return generateUnique(count, () => {
    const type = randInt(0, 2);
    if (type === 0) {
      const r = randInt(2, 8);
      const h = randInt(3, 12);
      return {
        key: `원기둥${r}x${h}`,
        question: `반지름 ${r}cm, 높이 ${h}cm인 원기둥의 부피는? (π 사용) = `,
        answer: `${r * r * h}π cm³`,
      };
    } else if (type === 1) {
      const r = randInt(2, 10);
      return {
        key: `원넓이${r}`,
        question: `반지름이 ${r}cm인 원의 넓이를 구하세요. (π 사용) = `,
        answer: `${r * r}π cm²`,
      };
    } else {
      const r = randInt(2, 10);
      return {
        key: `원둘레${r}`,
        question: `반지름이 ${r}cm인 원의 둘레를 구하세요. (π 사용) = `,
        answer: `${2 * r}π cm`,
      };
    }
  });
}

// ─── 메인 라우터 ─────────────────────────────────────────────

/** 학년별/단원별 문제 생성 함수 매핑 테이블 */
type GeneratorFn = (count: number, diff: Difficulty) => Problem[];

const GENERATOR_MAP: Record<string, GeneratorFn> = {
  // 1학년
  "1-1의 자리수 덧셈": grade1Addition,
  "1-1의 자리수 뺄셈": grade1Subtraction,
  "1-모으기와 가르기": grade1Grouping,
  "1-시계 보기": (count) => grade1Clock(count),
  // 2학년
  "2-2의 자리수 덧셈": grade2Addition,
  "2-2의 자리수 뺄셈": grade2Subtraction,
  "2-구구단": grade2MultiplicationTable,
  "2-길이 재기": (count) => grade2Length(count),
  // 3학년
  "3-나눗셈 기초": grade3Division,
  "3-분수와 소수 기초": (count) => grade3FractionDecimal(count),
  "3-평면도형": (count) => grade3Shapes(count),
  "3-시간과 시간": (count) => grade3Time(count),
  // 4학년
  "4-큰 수": grade4BigNumbers,
  "4-곱셈과 나눗셈": grade4MultiplyDivide,
  "4-분수의 덧셈과 뺄셈": grade4FractionAddSub,
  "4-다각형의 넓이": grade4Area,
  // 5학년
  "5-약수와 배수": grade5Factors,
  "5-약분과 통분": (count) => grade5FractionSimplify(count),
  "5-직육면체": grade5Cuboid,
  "5-평균과 가능성": (count) => grade5Average(count),
  // 6학년
  "6-분수의 나눗셈": (count) => grade6FractionDivision(count),
  "6-소수의 나눗셈": (count) => grade6DecimalDivision(count),
  "6-비와 비율": (count) => grade6Ratio(count),
  "6-원기둥, 원뿔, 구": (count) => grade6Solids(count),
};

/**
 * 학년과 단원을 받아 고유한 문제를 생성합니다.
 * @param grade - 학년 (1~6)
 * @param topic - 단원 이름
 * @param count - 문제 수 (기본 10)
 * @param difficulty - 난이도 (기본 normal)
 */
export function generateProblems(
  grade: number,
  topic: string,
  count: number = 10,
  difficulty: Difficulty = "normal"
): Problem[] {
  const key = `${grade}-${topic}`;
  const generator = GENERATOR_MAP[key];

  if (generator) {
    return generator(count, difficulty);
  }

  // 매핑이 없는 경우 기본 폴백 (안전장치)
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    question: `문제 준비중 (${topic})`,
    answer: "-",
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
