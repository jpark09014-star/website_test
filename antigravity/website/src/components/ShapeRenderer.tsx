"use client";

/**
 * ShapeRenderer — SVG 도형 렌더링 컴포넌트
 *
 * [왜 이 컴포넌트가 필요한가]
 * - 도형 문제에서 visual.type === "shape" 일 때 실제 도형을 시각적으로 보여줍니다.
 * - 직사각형, 삼각형, 원, 사다리꼴, 직육면체를 치수와 함께 SVG로 렌더링합니다.
 * - 인쇄 시에도 깨지지 않도록 벡터(SVG) 기반으로 구현합니다.
 */

interface ShapeVisual {
  shape: "rectangle" | "triangle" | "circle" | "trapezoid" | "rectangular_prism";
  dimensions: Record<string, number>;
  unit: string;
}

interface ShapeRendererProps {
  visual: ShapeVisual;
}

export default function ShapeRenderer({ visual }: ShapeRendererProps) {
  const { shape, dimensions, unit } = visual;

  switch (shape) {
    case "rectangle":
      return <RectangleSVG width={dimensions.width} height={dimensions.height} unit={unit} />;
    case "triangle":
      return <TriangleSVG dimensions={dimensions} unit={unit} />;
    case "circle":
      return <CircleSVG radius={dimensions.radius} unit={unit} />;
    case "trapezoid":
      return <TrapezoidSVG dimensions={dimensions} unit={unit} />;
    case "rectangular_prism":
      return <PrismSVG dimensions={dimensions} unit={unit} />;
    default:
      return null;
  }
}

// ─── 직사각형/정사각형 ──────────────────────────────────
function RectangleSVG({ width, height, unit }: { width: number; height: number; unit: string }) {
  const svgW = 120;
  const svgH = 90;
  const padding = 20;
  const rW = svgW - padding * 2;
  const rH = svgH - padding * 2;

  return (
    <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full max-w-[140px] h-auto">
      <rect
        x={padding} y={padding - 5}
        width={rW} height={rH}
        fill="none" stroke="#3b82f6" strokeWidth={1.5}
      />
      {/* 가로 치수 */}
      <text x={svgW / 2} y={svgH - 2} textAnchor="middle" fontSize={9} fill="#374151" fontWeight="bold">
        {width}{unit}
      </text>
      {/* 세로 치수 */}
      <text x={7} y={svgH / 2} textAnchor="middle" fontSize={9} fill="#374151" fontWeight="bold"
        transform={`rotate(-90, 7, ${svgH / 2})`}>
        {height}{unit}
      </text>
    </svg>
  );
}

// ─── 삼각형 ──────────────────────────────────────────────
function TriangleSVG({ dimensions, unit }: { dimensions: Record<string, number>; unit: string }) {
  // 각도 문제: angle1, angle2, angle3 형태
  if (dimensions.angle1 !== undefined) {
    return (
      <svg viewBox="0 0 130 100" className="w-full max-w-[140px] h-auto">
        <polygon
          points="20,85 110,85 65,15"
          fill="none" stroke="#3b82f6" strokeWidth={1.5}
        />
        {/* 각도 라벨 */}
        <text x={15} y={96} fontSize={8} fill="#374151" fontWeight="bold">{dimensions.angle1}°</text>
        <text x={100} y={96} fontSize={8} fill="#374151" fontWeight="bold">{dimensions.angle2}°</text>
        <text x={58} y={13} fontSize={8} fill="#ef4444" fontWeight="bold">?°</text>
      </svg>
    );
  }

  // 넓이 문제: base, height 형태
  const base = dimensions.base || 0;
  const height = dimensions.height || 0;

  return (
    <svg viewBox="0 0 130 100" className="w-full max-w-[140px] h-auto">
      <polygon
        points="15,85 115,85 65,15"
        fill="none" stroke="#3b82f6" strokeWidth={1.5}
      />
      {/* 높이선 (점선) */}
      <line x1={65} y1={15} x2={65} y2={85} stroke="#9ca3af" strokeWidth={1} strokeDasharray="3,3" />
      {/* 밑변 치수 */}
      <text x={65} y={97} textAnchor="middle" fontSize={9} fill="#374151" fontWeight="bold">
        {base}{unit}
      </text>
      {/* 높이 치수 */}
      <text x={75} y={55} fontSize={9} fill="#374151" fontWeight="bold">
        {height}{unit}
      </text>
    </svg>
  );
}

// ─── 원 ──────────────────────────────────────────────────
function CircleSVG({ radius, unit }: { radius: number; unit: string }) {
  const cx = 60;
  const cy = 50;
  const r = 35;

  return (
    <svg viewBox="0 0 120 100" className="w-full max-w-[130px] h-auto">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#3b82f6" strokeWidth={1.5} />
      {/* 반지름선 */}
      <line x1={cx} y1={cy} x2={cx + r} y2={cy} stroke="#ef4444" strokeWidth={1.5} />
      {/* 중심점 */}
      <circle cx={cx} cy={cy} r={2} fill="#ef4444" />
      {/* 반지름 라벨 */}
      <text x={cx + r / 2} y={cy - 5} textAnchor="middle" fontSize={9} fill="#374151" fontWeight="bold">
        r={radius}{unit}
      </text>
    </svg>
  );
}

// ─── 사다리꼴 ────────────────────────────────────────────
function TrapezoidSVG({ dimensions, unit }: { dimensions: Record<string, number>; unit: string }) {
  const top = dimensions.top || 0;
  const bottom = dimensions.bottom || 0;
  const height = dimensions.height || 0;

  // 비율 기반 좌표 계산
  const svgW = 130;
  const topOffset = (svgW - 40) * (1 - top / bottom) / 2;

  return (
    <svg viewBox="0 0 130 100" className="w-full max-w-[140px] h-auto">
      <polygon
        points={`${20 + topOffset},20 ${110 - topOffset},20 110,80 20,80`}
        fill="none" stroke="#3b82f6" strokeWidth={1.5}
      />
      {/* 높이선 (점선) */}
      <line x1={65} y1={20} x2={65} y2={80} stroke="#9ca3af" strokeWidth={1} strokeDasharray="3,3" />
      {/* 윗변 */}
      <text x={65} y={15} textAnchor="middle" fontSize={8} fill="#374151" fontWeight="bold">
        {top}{unit}
      </text>
      {/* 아랫변 */}
      <text x={65} y={94} textAnchor="middle" fontSize={8} fill="#374151" fontWeight="bold">
        {bottom}{unit}
      </text>
      {/* 높이 */}
      <text x={75} y={53} fontSize={8} fill="#374151" fontWeight="bold">
        {height}{unit}
      </text>
    </svg>
  );
}

// ─── 직육면체 (투시도) ───────────────────────────────────
function PrismSVG({ dimensions, unit }: { dimensions: Record<string, number>; unit: string }) {
  const w = dimensions.width || 0;
  const h = dimensions.height || 0;
  const d = dimensions.depth || 0;

  return (
    <svg viewBox="0 0 140 110" className="w-full max-w-[150px] h-auto">
      {/* 앞면 */}
      <rect x={15} y={30} width={70} height={55}
        fill="none" stroke="#3b82f6" strokeWidth={1.5} />
      {/* 윗면 */}
      <polygon points="15,30 55,10 125,10 85,30"
        fill="none" stroke="#3b82f6" strokeWidth={1.5} />
      {/* 오른쪽 면 */}
      <polygon points="85,30 125,10 125,65 85,85"
        fill="none" stroke="#3b82f6" strokeWidth={1.5} />
      {/* 숨겨진 모서리 (점선) */}
      <line x1={15} y1={30} x2={55} y2={10} stroke="#3b82f6" strokeWidth={1} strokeDasharray="3,3" />
      {/* 치수 라벨 */}
      <text x={50} y={96} textAnchor="middle" fontSize={8} fill="#374151" fontWeight="bold">
        {w}{unit}
      </text>
      <text x={3} y={60} fontSize={8} fill="#374151" fontWeight="bold"
        transform="rotate(-90, 3, 60)">
        {h}{unit}
      </text>
      <text x={110} y={8} fontSize={8} fill="#374151" fontWeight="bold">
        {d}{unit}
      </text>
    </svg>
  );
}
