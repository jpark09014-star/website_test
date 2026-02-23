export default function ClockFace({ hour, minute }: { hour: number; minute: number }) {
  // SVG 시계: 100x100 크기로 렌더링
  const cx = 50;
  const cy = 50;
  const radius = 45;

  // 분침 각도 (0 = 12시, 시계 방향)
  const minAngle = (minute / 60) * 360;
  // 시침 각도 (분침 위치에 비례하여 조금씩 이동)
  const hrAngle = ((hour % 12) + minute / 60) * 30;

  // 각도를 SVG 라인의 끝 좌표(x, y)로 변환하는 함수 (수직 위가 0도)
  const polarToCartesian = (cx: number, cy: number, r: number, angleInDegrees: number) => {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
    return {
      x: cx + r * Math.cos(angleInRadians),
      y: cy + r * Math.sin(angleInRadians),
    };
  };

  const minHand = polarToCartesian(cx, cy, 32, minAngle);
  const hrHand = polarToCartesian(cx, cy, 22, hrAngle);

  // 시계 숫자를 둥글게 배치하기
  const ticks = Array.from({ length: 12 }, (_, i) => i + 1);

  return (
    <div className="w-24 h-24 print:w-20 print:h-20 shrink-0 mx-auto mt-2 mb-2">
      <svg viewBox="0 0 100 100" className="w-full h-full text-gray-800">
        {/* 시계 바탕와 테두리 */}
        <circle cx={cx} cy={cy} r={radius} fill="white" stroke="currentColor" strokeWidth="3" />
        
        {/* 시간 숫자 (1~12) */}
        {ticks.map((num) => {
          const numAngle = num * 30;
          const pos = polarToCartesian(cx, cy, 34, numAngle);
          return (
            <text
              key={num}
              x={pos.x}
              y={pos.y}
              fontSize="10"
              fontWeight="bold"
              textAnchor="middle"
              dominantBaseline="central"
              fill="currentColor"
            >
              {num}
            </text>
          );
        })}

        {/* 시침 (짧고 굵게) */}
        <line
          x1={cx}
          y1={cy}
          x2={hrHand.x}
          y2={hrHand.y}
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
        />
        
        {/* 분침 (길고 얇게) */}
        <line
          x1={cx}
          y1={cy}
          x2={minHand.x}
          y2={minHand.y}
          stroke="#ef4444" // 빨간색 분침으로 초등학생들이 구별하기 쉽게 함
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        
        {/* 가운데 중심 축 (돌림쇠) */}
        <circle cx={cx} cy={cy} r={3} fill="#ef4444" />
      </svg>
    </div>
  );
}
