import { Mail, MessageSquare } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            문의하기
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            서비스 이용 중 궁금하신 점이나 제안 사항이 있다면 언제든 편하게 연락 부탁드립니다.
          </p>
        </div>

        <div className="bg-white shadow-sm rounded-2xl overflow-hidden border border-gray-100">
          <div className="px-6 py-8 sm:p-10">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <MessageSquare className="h-6 w-6 text-blue-600 mr-2" />
              피드백 및 서비스 제안
            </h3>
            <p className="text-gray-600 leading-relaxed mb-8">
              &quot;이런 단원이 추가되면 좋겠어요&quot;, &quot;난이도가 너무 어려운 편이에요&quot; 등의 
              학습 관련 피드백부터 사이트 이용 시 발생하는 버그, 광고 제휴 문의까지 
              모든 목소리에 귀 기울이겠습니다.
            </p>

            <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
              <div className="flex items-center">
                <Mail className="h-8 w-8 text-blue-600 mr-4" />
                <div>
                  <p className="text-sm text-gray-500 mb-1">이메일 문의</p>
                  <a href="mailto:jpark09014@gmail.com" className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                    jpark09014@gmail.com
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-100">
            <p className="text-sm text-gray-500 text-center">
              문의가 확인되는 대로 최대한 빠르게 답변해 드리겠습니다. (영업일 기준 1~2일 소요)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
