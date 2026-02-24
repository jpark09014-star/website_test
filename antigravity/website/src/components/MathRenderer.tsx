"use client";

/**
 * MathRenderer — KaTeX 수식 렌더링 컴포넌트
 *
 * [왜 이 컴포넌트가 필요한가]
 * - 분수, 거듭제곱, 수학 기호 등을 일반 텍스트 대신 수식으로 표시합니다.
 * - KaTeX를 사용하여 서버/클라이언트 모두에서 빠르게 렌더링합니다.
 * - 인쇄 시에도 깨끗하게 출력됩니다.
 */

import { useMemo } from "react";
import katex from "katex";
import "katex/dist/katex.min.css";

interface MathRendererProps {
  /** KaTeX 수식 문자열 (예: "\\frac{3}{4} + \\frac{1}{4}") */
  equation: string;
  /** display 모드 (블록) vs inline 모드 */
  displayMode?: boolean;
  /** 추가 CSS 클래스 */
  className?: string;
}

export default function MathRenderer({
  equation,
  displayMode = false,
  className = "",
}: MathRendererProps) {
  // useMemo로 렌더링 결과를 캐시하여 불필요한 재렌더링 방지
  const html = useMemo(() => {
    try {
      return katex.renderToString(equation, {
        displayMode,
        throwOnError: false, // 수식 파싱 실패 시 빨간 에러 텍스트로 대체
        strict: false,
        trust: true,
      });
    } catch {
      // 혹시 모를 에러 시 원본 텍스트 반환
      return equation;
    }
  }, [equation, displayMode]);

  return (
    <span
      className={`math-renderer ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
