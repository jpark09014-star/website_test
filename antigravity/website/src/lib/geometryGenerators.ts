/**
 * 도형 문제 생성기
 *
 * [왜 별도 파일로 분리했는가]
 * - 도형 문제는 SVG 렌더링용 visual 데이터가 필요하여 산술 문제와 구조가 다릅니다.
 * - 각 학년별 교육과정에 맞는 독립적인 알고리즘으로 문제를 생성합니다.
 * - 3학년: 평면도형 기초 (직각, 삼각형/사각형 변의 수)
 * - 4학년: 각도 계산, 삼각형 분류
 * - 5학년: 다각형 넓이 (직사각형, 평행사변형, 삼각형)
 * - 6학년: 원의 넓이, 직육면체 부피
 */

import type { Problem, Difficulty } from "./problemGenerators";
import { randInt, generateDistractors, shuffleChoices } from "./problemGenerators";

// ─── 유틸리티 ────────────────────────────────────────────────

const pick = <T>(arr: T[]): T => arr[randInt(0, arr.length - 1)];

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
    const { key, ...rest } = generator();
    if (!seen.has(key)) {
      seen.add(key);
      problems.push({ id: problems.length + 1, ...rest });
    }
  }
  return problems;
}

// ══════════════════════════════════════════════════════════════
// 3학년: 평면도형 기초
// ══════════════════════════════════════════════════════════════

/**
 * 3학년 평면도형: 도형의 변과 꼭짓점 수, 직각 판별
 * - easy: 삼각형/사각형의 변 개수
 * - normal: 직각 포함 여부 판별
 * - hard: 정사각형 vs 직사각형 구분 + 둘레 계산
 */
export function gen3_shapeBasic(count: number, diff: Difficulty = "normal") {
  return generateUnique(count, () => {
    if (diff === "easy") {
      // 도형의 변과 꼭짓점 수 구하기
      const shapes = [
        { name: "삼각형", sides: 3, vertices: 3 },
        { name: "사각형", sides: 4, vertices: 4 },
        { name: "오각형", sides: 5, vertices: 5 },
        { name: "육각형", sides: 6, vertices: 6 },
      ];
      const shape = pick(shapes);
      const askType = pick(["변", "꼭짓점"]);
      const answer = askType === "변" ? shape.sides : shape.vertices;
      return {
        key: `shape_${shape.name}_${askType}`,
        instruction: "도형의 특징을 알아봅시다.",
        question: `${shape.name}의 ${askType}의 수는 몇 개인가요?`,
        answer: String(answer),
      };
    }

    if (diff === "normal") {
      // 직각삼각형이 아닌 두 각의 합 구하기
      const a1 = randInt(20, 70);
      const a2 = 90 - a1; // 직각삼각형의 나머지 각
      return {
        key: `rightangle_${a1}_${a2}`,
        instruction: "직각삼각형의 각도를 구해봅시다.",
        question: `직각삼각형에서 한 각이 ${a1}°일 때, 나머지 한 각은 몇 도인가요?`,
        answer: `${a2}`,
        equation: `90° - ${a1}° = ?`,
      };
    }

    // hard: 정사각형/직사각형 둘레 계산
    const isSquare = randInt(0, 1) === 0;
    if (isSquare) {
      const side = randInt(3, 15);
      const perimeter = side * 4;
      return {
        key: `sq_perimeter_${side}`,
        instruction: "정사각형의 둘레를 구하세요.",
        question: `한 변이 ${side}cm인 정사각형의 둘레는 몇 cm인가요?`,
        answer: `${perimeter}`,
        equation: `${side} \\times 4 = ?`,
        visual: {
          type: "shape" as const,
          shape: "rectangle" as const,
          dimensions: { width: side, height: side },
          unit: "cm",
        },
      };
    } else {
      const w = randInt(3, 12);
      const h = randInt(3, 12);
      const perimeter = (w + h) * 2;
      return {
        key: `rect_perimeter_${w}x${h}`,
        instruction: "직사각형의 둘레를 구하세요.",
        question: `가로 ${w}cm, 세로 ${h}cm인 직사각형의 둘레는 몇 cm인가요?`,
        answer: `${perimeter}`,
        equation: `(${w} + ${h}) \\times 2 = ?`,
        visual: {
          type: "shape" as const,
          shape: "rectangle" as const,
          dimensions: { width: w, height: h } as Record<string, number>,
          unit: "cm",
        },
      };
    }
  });
}

// ══════════════════════════════════════════════════════════════
// 4학년: 각도와 삼각형/사각형
// ══════════════════════════════════════════════════════════════

/**
 * 4학년 각도 계산:
 * - easy: 직각=90° 기본 문제
 * - normal: 삼각형 세 각의 합 = 180°, 나머지 각 구하기
 * - hard: 사각형 네 각의 합 = 360°, 나머지 각 구하기
 */
export function gen4_angleCalc(count: number, diff: Difficulty = "normal") {
  return generateUnique(count, () => {
    if (diff === "easy") {
      // 직각 기본 문제
      const angle = randInt(10, 80);
      const complement = 90 - angle;
      return {
        key: `comp_${angle}`,
        instruction: "각도를 구하세요.",
        question: `직각(90°)에서 ${angle}°를 빼면 몇 도인가요?`,
        answer: `${complement}`,
        equation: `90° - ${angle}° = ?`,
      };
    }

    if (diff === "normal") {
      // 삼각형 나머지 각 구하기
      const a1 = randInt(20, 80);
      const a2 = randInt(20, 160 - a1 - 10); // 나머지 각이 최소 10°
      const a3 = 180 - a1 - a2;
      return {
        key: `tri_angle_${a1}_${a2}`,
        instruction: "삼각형의 세 각의 합은 180°입니다.",
        question: `삼각형의 두 각이 ${a1}°와 ${a2}°일 때, 나머지 한 각은?`,
        answer: `${a3}`,
        equation: `180° - ${a1}° - ${a2}° = ?`,
        visual: {
          type: "shape" as const,
          shape: "triangle" as const,
          dimensions: { angle1: a1, angle2: a2, angle3: a3 },
          unit: "°",
        },
      };
    }

    // hard: 사각형 나머지 각
    const a1 = randInt(50, 120);
    const a2 = randInt(50, 120);
    const a3 = randInt(40, 360 - a1 - a2 - 30);
    const a4 = 360 - a1 - a2 - a3;
    return {
      key: `quad_angle_${a1}_${a2}_${a3}`,
      instruction: "사각형의 네 각의 합은 360°입니다.",
      question: `사각형의 세 각이 ${a1}°, ${a2}°, ${a3}°일 때, 나머지 한 각은?`,
      answer: `${a4}`,
      equation: `360° - ${a1}° - ${a2}° - ${a3}° = ?`,
    };
  });
}

/**
 * 4학년 삼각형 분류:
 * - 세 변의 길이로 삼각형 종류 판별 (정삼각형, 이등변삼각형, 부등변삼각형)
 * - 각도로 분류 (예각, 직각, 둔각 삼각형) — 객관식
 */
export function gen4_triangleType(count: number, diff: Difficulty = "normal") {
  return generateUnique(count, () => {
    if (diff === "hard") {
      // 각도로 삼각형 분류 (객관식)
      const types: Array<{ angles: [number, number, number]; answer: string }> = [
        { angles: [60, 70, 50], answer: "예각삼각형" },
        { angles: [90, 45, 45], answer: "직각삼각형" },
        { angles: [120, 30, 30], answer: "둔각삼각형" },
        { angles: [80, 60, 40], answer: "예각삼각형" },
        { angles: [90, 60, 30], answer: "직각삼각형" },
        { angles: [100, 50, 30], answer: "둔각삼각형" },
      ];
      const item = pick(types);
      return {
        key: `tritype_${item.angles.join("_")}`,
        instruction: "삼각형의 종류를 고르세요.",
        question: `세 각이 ${item.angles[0]}°, ${item.angles[1]}°, ${item.angles[2]}°인 삼각형은?`,
        answer: item.answer,
        choices: shuffleChoices(item.answer, ["예각삼각형", "직각삼각형", "둔각삼각형"].filter(x => x !== item.answer)),
      };
    }

    // easy/normal: 세 변의 길이로 분류
    const typeNum = randInt(0, 2);
    let sides: [number, number, number];
    let answer: string;

    if (typeNum === 0) {
      // 정삼각형
      const s = randInt(3, 10);
      sides = [s, s, s];
      answer = "정삼각형";
    } else if (typeNum === 1) {
      // 이등변삼각형
      const s1 = randInt(3, 10);
      const s2 = randInt(s1 + 1, s1 + 5);
      sides = [s1, s1, s2];
    answer = "이등변삼각형";
    } else {
      // 부등변삼각형 (삼각형 부등식 만족)
      const s1 = randInt(3, 7);
      const s2 = randInt(s1 + 1, s1 + 3);
      const s3 = randInt(s2 + 1, s1 + s2 - 1);
      sides = [s1, s2, s3];
      answer = "부등변삼각형";
    }

    return {
      key: `triclass_${sides.join("_")}`,
      instruction: "삼각형의 종류를 맞혀보세요.",
      question: `세 변의 길이가 ${sides[0]}cm, ${sides[1]}cm, ${sides[2]}cm인 삼각형은?`,
      answer,
      choices: shuffleChoices(answer, ["정삼각형", "이등변삼각형", "부등변삼각형"].filter(x => x !== answer)),
    };
  });
}

// ══════════════════════════════════════════════════════════════
// 5학년: 다각형의 넓이
// ══════════════════════════════════════════════════════════════

/**
 * 5학년 넓이 계산:
 * - easy: 직사각형 넓이 (가로 × 세로)
 * - normal: 삼각형 넓이 (밑변 × 높이 ÷ 2)
 * - hard: 사다리꼴 넓이 ((윗변 + 아랫변) × 높이 ÷ 2)
 */
export function gen5_area(count: number, diff: Difficulty = "normal") {
  return generateUnique(count, () => {
    if (diff === "easy") {
      // 직사각형 넓이
      const w = randInt(3, 15);
      const h = randInt(3, 15);
      const area = w * h;
      return {
        key: `rect_area_${w}x${h}`,
        instruction: "직사각형의 넓이를 구하세요.",
        question: `가로 ${w}cm, 세로 ${h}cm인 직사각형의 넓이는?`,
        answer: `${area}`,
        equation: `${w} \\times ${h} = ?\\;\\text{cm}^2`,
        visual: {
          type: "shape" as const,
          shape: "rectangle" as const,
          dimensions: { width: w, height: h } as Record<string, number>,
          unit: "cm",
        },
      };
    }

    if (diff === "normal") {
      // 삼각형 넓이
      const base = randInt(4, 16);
      const height = randInt(3, 12);
      // 넓이가 정수가 되도록 보정
      const adjustedBase = base % 2 === 0 ? base : base + 1;
      const area = (adjustedBase * height) / 2;
      return {
        key: `tri_area_${adjustedBase}x${height}`,
        instruction: "삼각형의 넓이를 구하세요.",
        question: `밑변 ${adjustedBase}cm, 높이 ${height}cm인 삼각형의 넓이는?`,
        answer: `${area}`,
        equation: `${adjustedBase} \\times ${height} \\div 2 = ?\\;\\text{cm}^2`,
        visual: {
          type: "shape" as const,
          shape: "triangle" as const,
          dimensions: { base: adjustedBase, height } as Record<string, number>,
          unit: "cm",
        },
      };
    }

    // hard: 사다리꼴 넓이
    const top = randInt(3, 10);
    const bottom = randInt(top + 2, top + 10);
    const height = randInt(3, 10);
    // 넓이가 정수가 되도록 (윗변+아랫변) 짝수 보정
    const adjustedTop = (top + bottom) % 2 === 0 ? top : top + 1;
    const area = ((adjustedTop + bottom) * height) / 2;
    return {
      key: `trap_area_${adjustedTop}_${bottom}_${height}`,
      instruction: "사다리꼴의 넓이를 구하세요.",
      question: `윗변 ${adjustedTop}cm, 아랫변 ${bottom}cm, 높이 ${height}cm인 사다리꼴의 넓이는?`,
      answer: `${area}`,
      equation: `(${adjustedTop} + ${bottom}) \\times ${height} \\div 2 = ?\\;\\text{cm}^2`,
      visual: {
        type: "shape" as const,
        shape: "trapezoid" as const,
        dimensions: { top: adjustedTop, bottom, height },
        unit: "cm",
      },
    };
  });
}

// ══════════════════════════════════════════════════════════════
// 6학년: 원의 넓이, 직육면체 부피
// ══════════════════════════════════════════════════════════════

/**
 * 6학년 원의 넓이:
 * - easy: 원의 지름으로 반지름 구하기
 * - normal: 반지름이 주어진 원의 넓이 (π = 3.14)
 * - hard: 원의 둘레 + 넓이 혼합 문제
 */
export function gen6_circleArea(count: number, diff: Difficulty = "normal") {
  return generateUnique(count, () => {
    if (diff === "easy") {
      // 지름 → 반지름
      const d = randInt(2, 20) * 2; // 짝수 지름
      const r = d / 2;
      return {
        key: `circle_radius_${d}`,
        instruction: "원의 반지름을 구하세요.",
        question: `지름이 ${d}cm인 원의 반지름은 몇 cm인가요?`,
        answer: `${r}`,
        visual: {
          type: "shape" as const,
          shape: "circle" as const,
          dimensions: { radius: r },
          unit: "cm",
        },
      };
    }

    if (diff === "normal") {
      // 원의 넓이
      const r = randInt(2, 10);
      const area = Math.round(r * r * 3.14 * 100) / 100;
      return {
        key: `circle_area_${r}`,
        instruction: "원의 넓이를 구하세요. (π = 3.14)",
        question: `반지름이 ${r}cm인 원의 넓이는? (π = 3.14)`,
        answer: `${area}`,
        equation: `${r} \\times ${r} \\times 3.14 = ?\\;\\text{cm}^2`,
        visual: {
          type: "shape" as const,
          shape: "circle" as const,
          dimensions: { radius: r },
          unit: "cm",
        },
      };
    }

    // hard: 원의 둘레
    const r = randInt(2, 10);
    const circumference = Math.round(2 * r * 3.14 * 100) / 100;
    return {
      key: `circle_circ_${r}`,
      instruction: "원의 둘레를 구하세요. (π = 3.14)",
      question: `반지름이 ${r}cm인 원의 둘레는? (π = 3.14)`,
      answer: `${circumference}`,
      equation: `2 \\times ${r} \\times 3.14 = ?\\;\\text{cm}`,
      visual: {
        type: "shape" as const,
        shape: "circle" as const,
        dimensions: { radius: r },
        unit: "cm",
      },
    };
  });
}

/**
 * 6학년 직육면체 부피:
 * - easy: 정육면체 부피 (한 모서리³)
 * - normal: 직육면체 부피 (가로×세로×높이)
 * - hard: 직육면체 겉넓이
 */
export function gen6_volume(count: number, diff: Difficulty = "normal") {
  return generateUnique(count, () => {
    if (diff === "easy") {
      // 정육면체 부피
      const s = randInt(2, 8);
      const vol = s * s * s;
      return {
        key: `cube_vol_${s}`,
        instruction: "정육면체의 부피를 구하세요.",
        question: `한 모서리가 ${s}cm인 정육면체의 부피는?`,
        answer: `${vol}`,
        equation: `${s} \\times ${s} \\times ${s} = ?\\;\\text{cm}^3`,
        visual: {
          type: "shape" as const,
          shape: "rectangular_prism" as const,
          dimensions: { width: s, height: s, depth: s },
          unit: "cm",
        },
      };
    }

    const w = randInt(2, 10);
    const h = randInt(2, 10);
    const d = randInt(2, 10);

    if (diff === "normal") {
      // 직육면체 부피
      const vol = w * h * d;
      return {
        key: `prism_vol_${w}x${h}x${d}`,
        instruction: "직육면체의 부피를 구하세요.",
        question: `가로 ${w}cm, 세로 ${h}cm, 높이 ${d}cm인 직육면체의 부피는?`,
        answer: `${vol}`,
        equation: `${w} \\times ${h} \\times ${d} = ?\\;\\text{cm}^3`,
        visual: {
          type: "shape" as const,
          shape: "rectangular_prism" as const,
          dimensions: { width: w, height: h, depth: d },
          unit: "cm",
        },
      };
    }

    // hard: 직육면체 겉넓이
    const surfaceArea = 2 * (w * h + h * d + w * d);
    return {
      key: `prism_sa_${w}x${h}x${d}`,
      instruction: "직육면체의 겉넓이를 구하세요.",
      question: `가로 ${w}cm, 세로 ${h}cm, 높이 ${d}cm인 직육면체의 겉넓이는?`,
      answer: `${surfaceArea}`,
      equation: `2 \\times (${w} \\times ${h} + ${h} \\times ${d} + ${w} \\times ${d}) = ?\\;\\text{cm}^2`,
      visual: {
        type: "shape" as const,
        shape: "rectangular_prism" as const,
        dimensions: { width: w, height: h, depth: d },
        unit: "cm",
      },
    };
  });
}
