import React from 'react';
import Svg, { Rect, Text as SvgText, Polygon, Polyline, Line, Circle } from 'react-native-svg';
import { View } from 'react-native';

export interface ShapeVisual {
  shape: "rectangle" | "triangle" | "circle" | "trapezoid" | "rectangular_prism";
  dimensions: Record<string, number>;
  unit: string;
}

export interface FractionVisual {
  type: "fraction";
  whole?: number;
  numerator: number;
  denominator: number;
}

export interface GroupingVisual {
  type: "grouping";
  category: "group" | "split";
  total: number | "?";
  part1: number | "?";
  part2: number | "?";
}

interface ShapeRendererProps {
  visual: ShapeVisual | FractionVisual | GroupingVisual;
}

export default function ShapeRenderer({ visual }: ShapeRendererProps) {
  if ('type' in visual && visual.type === 'fraction') {
    return <FractionSVG fraction={visual as FractionVisual} />;
  }

  if ('type' in visual && visual.type === 'grouping') {
    return <GroupingSVG grouping={visual as GroupingVisual} />;
  }
  
  if (!('shape' in visual)) return null;

  const { shape, dimensions, unit } = visual as ShapeVisual;

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

// ─── 분수 그림 (도형 분할) ──────────────────────────────
function FractionSVG({ fraction }: { fraction: FractionVisual }) {
  const { numerator, denominator, whole = 0 } = fraction;
  const boxWidth = 100;
  const boxHeight = 24;
  const spacing = 10;
  const totalShapes = whole + 1;
  const svgWidth = totalShapes * boxWidth + (totalShapes - 1) * spacing;
  
  return (
    <View className="items-center justify-center my-4 w-full">
      <Svg viewBox={`0 0 ${svgWidth} ${boxHeight}`} width="100%" height={boxHeight * 1.5} style={{ maxWidth: svgWidth }}>
        {Array.from({ length: totalShapes }).map((_, shapeIdx) => {
          const isWhole = shapeIdx < whole;
          const xOffset = shapeIdx * (boxWidth + spacing);
          const cellWidth = boxWidth / denominator;
          
          return (
            <React.Fragment key={`shape-${shapeIdx}`}>
              {/* 테두리 */}
              <Rect
                x={xOffset} y={0}
                width={boxWidth} height={boxHeight}
                fill="none" stroke="#6b7280" strokeWidth={1.5} rx={2}
              />
              
              {/* 분할 및 색칠 */}
              {Array.from({ length: denominator }).map((_, cellIdx) => {
                const isFilled = isWhole || cellIdx < numerator;
                return (
                  <React.Fragment key={`cell-${shapeIdx}-${cellIdx}`}>
                    {isFilled && (
                      <Rect
                        x={xOffset + cellIdx * cellWidth} y={0}
                        width={cellWidth} height={boxHeight}
                        fill="rgba(59, 130, 246, 0.2)" // 파란색 반투명
                      />
                    )}
                    {/* 분할선 */}
                    {cellIdx > 0 && (
                      <Line
                        x1={xOffset + cellIdx * cellWidth} y1={0}
                        x2={xOffset + cellIdx * cellWidth} y2={boxHeight}
                        stroke="#9ca3af" strokeWidth={1}
                      />
                    )}
                  </React.Fragment>
                );
              })}
            </React.Fragment>
          );
        })}
      </Svg>
    </View>
  );
}

// ─── 가르기와 모으기 그림 ──────────────────────────────
function GroupingSVG({ grouping }: { grouping: GroupingVisual }) {
  const { category, total, part1, part2 } = grouping;
  const isSplit = category === "split"; // 가르기: 위(전체) -> 아래(부분)
  
  // 좌표 설정
  const topY = 25;
  const bottomY = 85;
  const centerX = 75;
  const leftX = 35;
  const rightX = 115;
  
  // 모으기는 방향이 반대: 위(부분) -> 아래(전체)
  const totalPos = isSplit ? { x: centerX, y: topY } : { x: centerX, y: bottomY };
  const p1Pos = isSplit ? { x: leftX, y: bottomY } : { x: leftX, y: topY };
  const p2Pos = isSplit ? { x: rightX, y: bottomY } : { x: rightX, y: topY };
  
  return (
    <View className="items-center justify-center my-4 w-full flex-row">
      <View className="items-center justify-center w-[150px] aspect-[4/3]">
        <Svg viewBox="0 0 150 110" width="100%" height="100%">
          {/* 연결선 */}
          <Line x1={totalPos.x} y1={totalPos.y} x2={p1Pos.x} y2={p1Pos.y} stroke="#9ca3af" strokeWidth={2} />
          <Line x1={totalPos.x} y1={totalPos.y} x2={p2Pos.x} y2={p2Pos.y} stroke="#9ca3af" strokeWidth={2} />
          
          {/* 전체 원 */}
          <Circle cx={totalPos.x} cy={totalPos.y} r={18} fill="white" stroke="#3b82f6" strokeWidth={2} />
          <SvgText x={totalPos.x} y={totalPos.y + 6} textAnchor="middle" fontSize={16} fill="#1f2937" fontWeight="bold">
            {total}
          </SvgText>
          
          {/* 부분 원 1 */}
          <Circle cx={p1Pos.x} cy={p1Pos.y} r={18} fill="white" stroke="#10b981" strokeWidth={2} />
          <SvgText x={p1Pos.x} y={p1Pos.y + 6} textAnchor="middle" fontSize={16} fill="#1f2937" fontWeight="bold">
            {part1}
          </SvgText>
          
          {/* 부분 원 2 */}
          <Circle cx={p2Pos.x} cy={p2Pos.y} r={18} fill="white" stroke="#10b981" strokeWidth={2} />
          <SvgText x={p2Pos.x} y={p2Pos.y + 6} textAnchor="middle" fontSize={16} fill="#1f2937" fontWeight="bold">
            {part2}
          </SvgText>
        </Svg>
      </View>
    </View>
  );
}

// ─── 직사각형/정사각형 ──────────────────────────────────
function RectangleSVG({ width, height, unit }: { width: number; height: number; unit: string }) {
  const svgW = 120;
  const svgH = 90;
  const padding = 20;
  const rW = svgW - padding * 2;
  const rH = svgH - padding * 2;

  return (
    <View className="items-center justify-center my-2 w-full max-w-[140px] aspect-[4/3]">
      <Svg viewBox={`0 0 ${svgW} ${svgH}`} width="100%" height="100%">
        <Rect
          x={padding} y={padding - 5}
          width={rW} height={rH}
          fill="none" stroke="#3b82f6" strokeWidth={1.5}
        />
        {/* 가로 치수 */}
        <SvgText x={svgW / 2} y={svgH - 2} textAnchor="middle" fontSize={9} fill="#374151" fontWeight="bold">
          {`${width}${unit}`}
        </SvgText>
        {/* 세로 치수 */}
        <SvgText x={7} y={svgH / 2} textAnchor="middle" fontSize={9} fill="#374151" fontWeight="bold"
          transform={`rotate(-90, 7, ${svgH / 2})`}>
          {`${height}${unit}`}
        </SvgText>
      </Svg>
    </View>
  );
}

// ─── 삼각형 ──────────────────────────────────────────────
function TriangleSVG({ dimensions, unit }: { dimensions: Record<string, number>; unit: string }) {
  const isRight = dimensions.isRight === 1;

  // 모양별 꼭짓점 설정
  const pts = isRight ? "20,85 110,85 20,20" : "20,85 110,85 65,15";

  // 1. 각도 문제: angle1, angle2 등 제공
  if (dimensions.angle1 !== undefined || dimensions.angleToFind !== undefined) {
    return (
       <View className="items-center justify-center my-2 w-full max-w-[140px] aspect-[13/10]">
         <Svg viewBox="0 0 130 100" width="100%" height="100%">
           <Polygon points={pts} fill="none" stroke="#3b82f6" strokeWidth={1.5} />
           
           {isRight && (
              <Polyline points="20,75 30,75 30,85" fill="none" stroke="#ef4444" strokeWidth={1} />
           )}

           {/* 각도 텍스트 */}
           {!isRight && dimensions.angle1 && (
              <SvgText x={26} y={80} fontSize={8} fill="#374151" fontWeight="bold">{`${dimensions.angle1}°`}</SvgText>
           )}
           {dimensions.angle2 && (
              <SvgText x={95} y={80} fontSize={8} fill="#374151" fontWeight="bold">{`${dimensions.angle2}°`}</SvgText>
           )}
           <SvgText x={isRight ? 26 : 60} y={isRight ? 35 : 28} fontSize={9} fill="#ef4444" fontWeight="bold">?</SvgText>
         </Svg>
       </View>
    );
  }

  // 2. 분류 문제 (이등변, 예각, 둔각 등 단순히 모양만 렌더링)
  if (dimensions.classifyMode === 1) {
    const angleType = dimensions.angleType || 0; // 0: 예각, 1: 직각, 2: 둔각
    let polyPts = "20,85 110,85 65,15"; // 예각/이등변
    let hasRightAngle = false;
    
    if (angleType === 1) {
       polyPts = "20,85 110,85 20,20";
       hasRightAngle = true;
    } else if (angleType === 2) {
       polyPts = "30,85 110,85 10,40"; // 둔각
    }

    return (
       <View className="items-center justify-center my-2 w-full max-w-[140px] aspect-[13/10]">
         <Svg viewBox="0 0 130 100" width="100%" height="100%">
           <Polygon points={polyPts} fill="#eef2ff" stroke="#3b82f6" strokeWidth={1.5} />
           {hasRightAngle && (
              <Polyline points="20,75 30,75 30,85" fill="none" stroke="#ef4444" strokeWidth={1} />
           )}
         </Svg>
       </View>
    );
  }

  // 3. 넓이 문제: base, height (기본값)
  const base = dimensions.base || 0;
  const height = dimensions.height || 0;

  return (
    <View className="items-center justify-center my-2 w-full max-w-[140px] aspect-[13/10]">
      <Svg viewBox="0 0 130 100" width="100%" height="100%">
        <Polygon points={pts} fill="none" stroke="#3b82f6" strokeWidth={1.5} />
        
        {!isRight && (
          <Line x1={65} y1={15} x2={65} y2={85} stroke="#9ca3af" strokeWidth={1} strokeDasharray="3,3" />
        )}
        {isRight && (
          <Polyline points="20,75 30,75 30,85" fill="none" stroke="#ef4444" strokeWidth={1} />
        )}

        {/* 밑변 치수 */}
        <SvgText x={65} y={97} textAnchor="middle" fontSize={9} fill="#374151" fontWeight="bold">
          {`${base}${unit}`}
        </SvgText>
        {/* 높이 치수 */}
        <SvgText x={isRight ? 10 : 75} y={55} textAnchor={isRight ? "end" : "start"} fontSize={9} fill="#374151" fontWeight="bold">
          {`${height}${unit}`}
        </SvgText>
      </Svg>
    </View>
  );
}

// ─── 원 ──────────────────────────────────────────────────
function CircleSVG({ radius, unit }: { radius: number; unit: string }) {
  const cx = 60;
  const cy = 50;
  const r = 35;

  return (
    <View className="items-center justify-center my-2 w-full max-w-[130px] aspect-[6/5]">
      <Svg viewBox="0 0 120 100" width="100%" height="100%">
        <Circle cx={cx} cy={cy} r={r} fill="none" stroke="#3b82f6" strokeWidth={1.5} />
        {/* 반지름선 */}
        <Line x1={cx} y1={cy} x2={cx + r} y2={cy} stroke="#ef4444" strokeWidth={1.5} />
        {/* 중심점 */}
        <Circle cx={cx} cy={cy} r={2} fill="#ef4444" />
        {/* 반지름 라벨 */}
        <SvgText x={cx + r / 2} y={cy - 5} textAnchor="middle" fontSize={9} fill="#374151" fontWeight="bold">
          {`r=${radius}${unit}`}
        </SvgText>
      </Svg>
    </View>
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
    <View className="items-center justify-center my-2 w-full max-w-[140px] aspect-[13/10]">
      <Svg viewBox="0 0 130 100" width="100%" height="100%">
        <Polygon
          points={`${20 + topOffset},20 ${110 - topOffset},20 110,80 20,80`}
          fill="none" stroke="#3b82f6" strokeWidth={1.5}
        />
        {/* 높이선 (점선) */}
        <Line x1={65} y1={20} x2={65} y2={80} stroke="#9ca3af" strokeWidth={1} strokeDasharray="3,3" />
        {/* 윗변 */}
        <SvgText x={65} y={15} textAnchor="middle" fontSize={8} fill="#374151" fontWeight="bold">
          {`${top}${unit}`}
        </SvgText>
        {/* 아랫변 */}
        <SvgText x={65} y={94} textAnchor="middle" fontSize={8} fill="#374151" fontWeight="bold">
          {`${bottom}${unit}`}
        </SvgText>
        {/* 높이 */}
        <SvgText x={75} y={53} fontSize={8} fill="#374151" fontWeight="bold">
          {`${height}${unit}`}
        </SvgText>
      </Svg>
    </View>
  );
}

// ─── 직육면체 (투시도) ───────────────────────────────────
function PrismSVG({ dimensions, unit }: { dimensions: Record<string, number>; unit: string }) {
  const w = dimensions.width || 0;
  const h = dimensions.height || 0;
  const d = dimensions.depth || 0;

  return (
    <View className="items-center justify-center my-2 w-full max-w-[150px] aspect-[14/11]">
      <Svg viewBox="0 0 140 110" width="100%" height="100%">
        {/* 앞면 */}
        <Rect x={15} y={30} width={70} height={55}
          fill="none" stroke="#3b82f6" strokeWidth={1.5} />
        {/* 윗면 */}
        <Polygon points="15,30 55,10 125,10 85,30"
          fill="none" stroke="#3b82f6" strokeWidth={1.5} />
        {/* 오른쪽 면 */}
        <Polygon points="85,30 125,10 125,65 85,85"
          fill="none" stroke="#3b82f6" strokeWidth={1.5} />
        {/* 숨겨진 모서리 (점선) */}
        <Line x1={15} y1={30} x2={55} y2={10} stroke="#3b82f6" strokeWidth={1} strokeDasharray="3,3" />
        {/* 치수 라벨 */}
        <SvgText x={50} y={96} textAnchor="middle" fontSize={8} fill="#374151" fontWeight="bold">
          {`${w}${unit}`}
        </SvgText>
        <SvgText x={3} y={60} textAnchor="middle" fontSize={8} fill="#374151" fontWeight="bold"
          transform="rotate(-90, 3, 60)">
          {`${h}${unit}`}
        </SvgText>
        <SvgText x={110} y={8} textAnchor="middle" fontSize={8} fill="#374151" fontWeight="bold">
          {`${d}${unit}`}
        </SvgText>
      </Svg>
    </View>
  );
}
