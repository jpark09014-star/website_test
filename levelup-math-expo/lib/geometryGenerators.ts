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

import type { Problem, Difficulty, Language } from "./problemGenerators";
import { randInt, shuffleChoices, t } from "./problemGenerators";

// ─── 유틸리티 ────────────────────────────────────────────────

const pick = <T>(arr: T[]): T => arr[randInt(0, arr.length - 1)];

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
    const { key, ...rest } = generator(lang);
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
export function gen3_shapeBasic(count: number, diff: Difficulty = "normal", lang: Language = "ko") {
  return generateUnique(count, (l) => {
    if (diff === "easy") {
      const shapesMap: Record<Language, Array<{name: string, sides: number, vertices: number}>> = {
        ko: [{ name: "삼각형", sides: 3, vertices: 3 }, { name: "사각형", sides: 4, vertices: 4 }, { name: "오각형", sides: 5, vertices: 5 }],
        en: [{ name: "triangle", sides: 3, vertices: 3 }, { name: "quadrilateral", sides: 4, vertices: 4 }, { name: "pentagon", sides: 5, vertices: 5 }],
        ja: [{ name: "三角形", sides: 3, vertices: 3 }, { name: "四角形", sides: 4, vertices: 4 }, { name: "五角形", sides: 5, vertices: 5 }]
      };
      const shape = pick(shapesMap[l]);
      const askType = l === 'ko' ? pick(["변", "꼭짓점"]) : l === 'en' ? pick(["sides", "vertices"]) : pick(["辺", "頂点"]);
      const answer = (askType === "변" || askType === "sides" || askType === "辺") ? shape.sides : shape.vertices;
      
      let q = "";
      if (l === 'ko') q = `${shape.name}의 ${askType}의 수는 몇 개인가요?`;
      else if (l === 'ja') q = `${shape.name}の${askType}の数は何個ですか？`;
      else q = `How many ${askType} does a ${shape.name} have?`;

      return {
        key: `shape_${shape.name}_${askType}`,
        instruction: t("word_prob", l),
        question: q,
        answer: String(answer),
      };
    }

    if (diff === "normal") {
      const a1 = randInt(20, 70);
      const a2 = 90 - a1; 
      let quest = "";
      if (l === 'ko') quest = `직각삼각형에서 한 각이 ${a1}°일 때, 나머지 한 각은 몇 도인가요?`;
      else if (l === 'ja') quest = `直角三角形で、一つの角が${a1}°のとき、もう一つの角は何度ですか？`;
      else quest = `In a right triangle, if one angle is ${a1}°, what is the other angle?`;

      return {
        key: `rightangle_${a1}_${a2}`,
        instruction: l === 'ko' ? "직각삼각형의 각도를 구해봅시다." : "Find the angle of the right triangle.",
        question: quest,
        answer: `${a2}`,
        equation: `90° - ${a1}° = ?`,
      };
    }

    const isSquare = randInt(0, 1) === 0;
    if (isSquare) {
      const side = randInt(3, 15);
      const perimeter = side * 4;
      let q = l === 'ko' ? `한 변이 ${side}cm인 정사각형의 둘레는 몇 cm인가요?` : l === 'ja' ? `一辺が${side}cmの正方形の周りの長さは何cmですか？` : `What is the perimeter of a square with a side of ${side}cm?`;
      return {
        key: `sq_perimeter_${side}`,
        instruction: l === 'ko' ? "정사각형의 둘레를 구하세요." : "Find the perimeter of the square.",
        question: q,
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
      let q = l === 'ko' ? `가로 ${w}cm, 세로 ${h}cm인 직사각형의 둘레는 몇 cm인가요?` : l === 'ja' ? `横${w}cm、縦${h}cmの長方形の周りの長さは何cmですか？` : `What is the perimeter of a rectangle with width ${w}cm and height ${h}cm?`;
      return {
        key: `rect_perimeter_${w}x${h}`,
        instruction: l === 'ko' ? "직사각형의 둘레를 구하세요." : "Find the perimeter of the rectangle.",
        question: q,
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
  }, lang);
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
export function gen4_angleCalc(count: number, diff: Difficulty = "normal", lang: Language = "ko") {
  return generateUnique(count, (l) => {
    if (diff === "easy") {
      const angle = randInt(10, 80);
      const complement = 90 - angle;
      let q = l === 'ko' ? `직각(90°)에서 ${angle}°를 빼면 몇 도인가요?` : l === 'ja' ? `直角(90°)から${angle}°を引くと、何度ですか？` : `If you subtract ${angle}° from a right angle (90°), what is the angle?`;
      return {
        key: `comp_${angle}`,
        instruction: l === 'ko' ? "각도를 구하세요." : "Calculate the angle.",
        question: q,
        answer: `${complement}`,
        equation: `90° - ${angle}° = ?`,
      };
    }

    if (diff === "normal") {
      const a1 = randInt(20, 80);
      const a2 = randInt(20, 160 - a1 - 10);
      const a3 = 180 - a1 - a2;
      let q = l === 'ko' ? `삼각형의 두 각이 ${a1}°와 ${a2}°일 때, 나머지 한 각은?` : l === 'ja' ? `三角形の二つの角が${a1}°と${a2}°のとき、もう一つの角は？` : `If two angles of a triangle are ${a1}° and ${a2}°, what is the third angle?`;
      return {
        key: `tri_angle_${a1}_${a2}`,
        instruction: l === 'ko' ? "삼각형의 세 각의 합은 180°입니다." : "The sum of the three angles in a triangle is 180°.",
        question: q,
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

    const a1 = randInt(50, 120);
    const a2 = randInt(50, 120);
    const a3 = randInt(40, 360 - a1 - a2 - 30);
    const a4 = 360 - a1 - a2 - a3;
    let q = l === 'ko' ? `사각형의 세 각이 ${a1}°, ${a2}°, ${a3}°일 때, 나머지 한 각은?` : l === 'ja' ? `四角形の三つの角が${a1}°、${a2}°、${a3}°のとき、もう一つの角は？` : `If three angles of a quadrilateral are ${a1}°, ${a2}°, and ${a3}°, what is the fourth angle?`;
    return {
      key: `quad_angle_${a1}_${a2}_${a3}`,
      instruction: l === 'ko' ? "사각형의 네 각의 합은 360°입니다." : "The sum of the four angles in a quadrilateral is 360°.",
      question: q,
      answer: `${a4}`,
      equation: `360° - ${a1}° - ${a2}° - ${a3}° = ?`,
    };
  }, lang);
}

/**
 * 4학년 삼각형 분류:
 * - 세 변의 길이로 삼각형 종류 판별 (정삼각형, 이등변삼각형, 부등변삼각형)
 * - 각도로 분류 (예각, 직각, 둔각 삼각형) — 객관식
 */
export function gen4_triangleType(count: number, diff: Difficulty = "normal", lang: Language = "ko") {
  return generateUnique(count, (l) => {
    const triangleMap: Record<Language, Record<string, string>> = {
      ko: { acute: "예각삼각형", right: "직각삼각형", obtuse: "둔각삼각형", equi: "정삼각형", iso: "이등변삼각형", scalene: "부등변삼각형" },
      en: { acute: "Acute triangle", right: "Right triangle", obtuse: "Obtuse triangle", equi: "Equilateral triangle", iso: "Isosceles triangle", scalene: "Scalene triangle" },
      ja: { acute: "鋭角三角形", right: "直角三角形", obtuse: "鈍角三角形", equi: "正三角形", iso: "二等辺三角形", scalene: "不等辺三角形" }
    };
    const tMap = triangleMap[l];

    if (diff === "hard") {
      const types: { angles: [number, number, number]; type: string }[] = [
        { angles: [60, 70, 50], type: "acute" },
        { angles: [90, 45, 45], type: "right" },
        { angles: [120, 30, 30], type: "obtuse" },
      ];
      const item = pick(types);
      const answer = tMap[item.type];
      let q = l === 'ko' ? `세 각이 ${item.angles[0]}°, ${item.angles[1]}°, ${item.angles[2]}°인 삼각형은?` : l === 'ja' ? `三つの角が${item.angles[0]}°、${item.angles[1]}°、${item.angles[2]}°である三角形は？` : `A triangle with angles ${item.angles[0]}°, ${item.angles[1]}°, and ${item.angles[2]}° is a(n)?`;
      return {
        key: `tritype_${item.angles.join("_")}`,
        instruction: l === 'ko' ? "삼각형의 종류를 고르세요." : "Choose the type of triangle.",
        question: q,
        answer: answer,
        choices: shuffleChoices(answer, [tMap.acute, tMap.right, tMap.obtuse].filter(x => x !== answer)),
      };
    }

    const typeNum = randInt(0, 2);
    let sides: [number, number, number];
    let typeKey: string;

    if (typeNum === 0) {
      const s = randInt(3, 10);
      sides = [s, s, s];
      typeKey = "equi";
    } else if (typeNum === 1) {
      const s1 = randInt(3, 10);
      const s2 = randInt(s1 + 1, s1 + 5);
      sides = [s1, s1, s2];
      typeKey = "iso";
    } else {
      const s1 = randInt(3, 7);
      const s2 = randInt(s1 + 1, s1 + 3);
      const s3 = randInt(s2 + 1, s1 + s2 - 1);
      sides = [s1, s2, s3];
      typeKey = "scalene";
    }
    const answer = tMap[typeKey];
    let q = l === 'ko' ? `세 변의 길이가 ${sides[0]}cm, ${sides[1]}cm, ${sides[2]}cm인 삼각형은?` : l === 'ja' ? `三辺の長さが${sides[0]}cm、${sides[1]}cm、${sides[2]}cmである三角形は？` : `A triangle with side lengths ${sides[0]}cm, ${sides[1]}cm, and ${sides[2]}cm is a(n)?`;

    return {
      key: `triclass_${sides.join("_")}`,
      instruction: l === 'ko' ? "삼각형의 종류분류" : "Triangle classification",
      question: q,
      answer,
      choices: shuffleChoices(answer, [tMap.equi, tMap.iso, tMap.scalene].filter(x => x !== answer)),
    };
  }, lang);
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
export function gen5_area(count: number, diff: Difficulty = "normal", lang: Language = "ko") {
  return generateUnique(count, (l) => {
    if (diff === "easy") {
      const w = randInt(3, 15);
      const h = randInt(3, 15);
      const area = w * h;
      let q = l === 'ko' ? `가로 ${w}cm, 세로 ${h}cm인 직사각형의 넓이는?` : l === 'ja' ? `横${w}cm、縦${h}cmの長方形の面積は？` : `What is the area of a rectangle with width ${w}cm and height ${h}cm?`;
      return {
        key: `rect_area_${w}x${h}`,
        instruction: l === 'ko' ? "직사각형의 넓이를 구하세요." : "Find the area of the rectangle.",
        question: q,
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
      const base = randInt(4, 16);
      const height = randInt(3, 12);
      const adjustedBase = base % 2 === 0 ? base : base + 1;
      const area = (adjustedBase * height) / 2;
      let q = l === 'ko' ? `밑변 ${adjustedBase}cm, 높이 ${height}cm인 삼각형의 넓이는?` : l === 'ja' ? `底辺${adjustedBase}cm、高さ${height}cmの三角形の面積は？` : `What is the area of a triangle with base ${adjustedBase}cm and height ${height}cm?`;
      return {
        key: `tri_area_${adjustedBase}x${height}`,
        instruction: l === 'ko' ? "삼각형의 넓이를 구하세요." : "Find the area of the triangle.",
        question: q,
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

    const top = randInt(3, 10);
    const bottom = randInt(top + 2, top + 10);
    const height = randInt(3, 10);
    const adjustedTop = (top + bottom) % 2 === 0 ? top : top + 1;
    const area = ((adjustedTop + bottom) * height) / 2;
    let q = l === 'ko' ? `윗변 ${adjustedTop}cm, 아랫변 ${bottom}cm, 높이 ${height}cm인 사다리꼴의 넓이는?` : l === 'ja' ? `上辺${adjustedTop}cm、下辺${bottom}cm、高さ${height}cmの台形の面積は？` : `What is the area of a trapezoid with top base ${adjustedTop}cm, bottom base ${bottom}cm and height ${height}cm?`;
    return {
      key: `trap_area_${adjustedTop}_${bottom}_${height}`,
      instruction: l === 'ko' ? "사다리꼴의 넓이를 구하세요." : "Find the area of the trapezoid.",
      question: q,
      answer: `${area}`,
      equation: `(${adjustedTop} + ${bottom}) \\times ${height} \\div 2 = ?\\;\\text{cm}^2`,
      visual: {
        type: "shape" as const,
        shape: "trapezoid" as const,
        dimensions: { top: adjustedTop, bottom, height },
        unit: "cm",
      },
    };
  }, lang);
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
export function gen6_circleArea(count: number, diff: Difficulty = "normal", lang: Language = "ko") {
  return generateUnique(count, (l) => {
    if (diff === "easy") {
      const d = randInt(2, 20) * 2;
      const r = d / 2;
      let q = l === 'ko' ? `지름이 ${d}cm인 원의 반지름은 몇 cm인가요?` : l === 'ja' ? `直径が${d}cmの円の半径は何cmですか？` : `What is the radius of a circle with a diameter of ${d}cm?`;
      return {
        key: `circle_radius_${d}`,
        instruction: l === 'ko' ? "원의 반지름을 구하세요." : "Find the radius of the circle.",
        question: q,
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
      const r = randInt(2, 10);
      const area = Math.round(r * r * 3.14 * 100) / 100;
      let q = l === 'ko' ? `반지름이 ${r}cm인 원의 넓이는? (π = 3.14)` : l === 'ja' ? `半径が${r}cmの円の面積は？ (π = 3.14)` : `What is the area of a circle with radius ${r}cm? (π = 3.14)`;
      return {
        key: `circle_area_${r}`,
        instruction: l === 'ko' ? "원의 넓이를 구하세요. (π = 3.14)" : "Find the area of the circle. (π = 3.14)",
        question: q,
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

    const r = randInt(2, 10);
    const circumference = Math.round(2 * r * 3.14 * 100) / 100;
    let q = l === 'ko' ? `반지름이 ${r}cm인 원의 둘레는? (π = 3.14)` : l === 'ja' ? `半径が${r}cmの円の周りの長さは？ (π = 3.14)` : `What is the circumference of a circle with radius ${r}cm? (π = 3.14)`;
    return {
      key: `circle_circ_${r}`,
      instruction: l === 'ko' ? "원의 둘레를 구하세요. (π = 3.14)" : "Find the circumference of the circle. (π = 3.14)",
      question: q,
      answer: `${circumference}`,
      equation: `2 \\times ${r} \\times 3.14 = ?\\;\\text{cm}`,
      visual: {
        type: "shape" as const,
        shape: "circle" as const,
        dimensions: { radius: r },
        unit: "cm",
      },
    };
  }, lang);
}

/**
 * 6학년 직육면체 부피:
 * - easy: 정육면체 부피 (한 모서리³)
 * - normal: 직육면체 부피 (가로×세로×높이)
 * - hard: 직육면체 겉넓이
 */
export function gen6_volume(count: number, diff: Difficulty = "normal", lang: Language = "ko") {
  return generateUnique(count, (l) => {
    if (diff === "easy") {
      const s = randInt(2, 8);
      const vol = s * s * s;
      let q = l === 'ko' ? `한 모서리가 ${s}cm인 정육면체의 부피는?` : l === 'ja' ? `一辺が${s}cmの正六面体の体積は？` : `What is the volume of a cube with edge ${s}cm?`;
      return {
        key: `cube_vol_${s}`,
        instruction: l === 'ko' ? "정육면체의 부피를 구하세요." : "Find the volume of the cube.",
        question: q,
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
      const vol = w * h * d;
      let q = l === 'ko' ? `가로 ${w}cm, 세로 ${h}cm, 높이 ${d}cm인 직육면체의 부피는?` : l === 'ja' ? `横${w}cm、縦${h}cm、高さ${d}cmの直方体の体積は？` : `What is the volume of a rectangular prism with width ${w}cm, height ${h}cm, and depth ${d}cm?`;
      return {
        key: `prism_vol_${w}x${h}x${d}`,
        instruction: l === 'ko' ? "직육면체의 부피를 구하세요." : "Find the volume of the rectangular prism.",
        question: q,
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

    const surfaceArea = 2 * (w * h + h * d + w * d);
    let q = l === 'ko' ? `가로 ${w}cm, 세로 ${h}cm, 높이 ${d}cm인 직육면체의 겉넓이는?` : l === 'ja' ? `横${w}cm、縦${h}cm、高さ${d}cmの直方体の表面積は？` : `What is the surface area of a rectangular prism with width ${w}cm, height ${h}cm, and depth ${d}cm?`;
    return {
      key: `prism_sa_${w}x${h}x${d}`,
      instruction: l === 'ko' ? "직육면체의 겉넓이를 구하세요." : "Find the surface area of the rectangular prism.",
      question: q,
      answer: `${surfaceArea}`,
      equation: `2 \\times (${w} \\times ${h} + ${h} \\times ${d} + ${w} \\times ${d}) = ?\\;\\text{cm}^2`,
      visual: {
        type: "shape" as const,
        shape: "rectangular_prism" as const,
        dimensions: { width: w, height: h, depth: d },
        unit: "cm",
      },
    };
  }, lang);
}
