import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-emerald-50 to-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
            수학 실력을 키우는 가장 빠른 방법, <span className="text-emerald-600">Level-up AI</span>
          </h1>
          <p className="mt-6 text-xl text-gray-600">
            Level-up AI는 최신 인공지능 기술을 활용하여 초등학생의 수준에 맞는 수학 문제를 무한히 생성하여, 실력을 매번 한 단계씩 레벨업 시켜주는 서비스입니다.
          </p>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">만든 목적</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              시중에 많은 문제집이 있지만, 아이가 특정 유형에서 계속 틀릴 때 똑같은 문제를 더 구해오기란 쉽지 않습니다. 
              부모님이나 선생님이 직접 숫자를 바꿔가며 문제를 내는 수고로움을 덜어드리고자 시작된 프로젝트입니다.
            </p>
            <p className="text-gray-600 leading-relaxed">
              최신 생성형 AI 모델인 Google Gemini를 활용하여, 단순히 저장된 문제 은행에서 꺼내는 것이 아니라 교육과정에 맞게 매번 새로운 문제를 실시간으로 만들어냅니다.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">핵심 기능</h2>
            <ul className="space-y-4">
              <li className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-emerald-100 flex items-center justify-center border border-emerald-200 mt-1">
                  <ArrowRight className="h-4 w-4 text-emerald-600" />
                </div>
                <p className="ml-3 text-gray-600">
                  <strong className="text-gray-900 block">무한 문제 생성</strong>
                  원하는 학년, 단원, 난이도 및 개수를 선택하면 AI가 즉석에서 맞춤형 학습지를 생성합니다.
                </p>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-emerald-100 flex items-center justify-center border border-emerald-200 mt-1">
                  <ArrowRight className="h-4 w-4 text-emerald-600" />
                </div>
                <p className="ml-3 text-gray-600">
                  <strong className="text-gray-900 block">채점 및 오답노트</strong>
                  스마트 화면에서 직접 채점하고, 틀린 문제는 나만의 오답노트에 저장하여 완벽하게 마스터할 수 있습니다.
                </p>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-emerald-100 flex items-center justify-center border border-emerald-200 mt-1">
                  <ArrowRight className="h-4 w-4 text-emerald-600" />
                </div>
                <p className="ml-3 text-gray-600">
                  <strong className="text-gray-900 block">학습 데이터 분석</strong>
                  마이페이지에서 정답률, 누적 푼 문제 수 등 내 아이의 학습 현황을 한눈에 파악할 수 있습니다.
                </p>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 text-center">
          <Link
            href="/worksheet"
            className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-emerald-500 hover:bg-emerald-600 md:text-lg transition-transform hover:scale-105 active:scale-95 shadow-md"
          >
            지금 무료로 시작하기
          </Link>
        </div>
      </div>
    </div>
  );
}
