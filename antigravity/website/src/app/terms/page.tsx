export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto prose prose-blue">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">서비스 이용약관</h1>
        
        <div className="space-y-6 text-gray-700">
          <p>
            <strong>시행일: {new Date().toLocaleDateString('ko-KR')}</strong>
          </p>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">1. 목적</h2>
            <p>
              본 약관은 Level-up AI(이하 &quot;회사&quot;)가 제공하는 AI 기반 초등 수학 학습지 생성 사이트(이하 &quot;서비스&quot;)의 이용 조건 및 절차, 이용자와 회사의 권리, 의무, 책임사항을 규정함을 목적으로 합니다.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">2. 약관의 효력 및 변경</h2>
            <ol className="list-decimal pl-5 mt-2 space-y-2">
              <li>본 약관은 서비스를 이용하고자 하는 모든 이용자에 대하여 그 효력을 발생합니다.</li>
              <li>회사는 필요하다고 인정되는 경우 법령을 위반하지 않는 범위 내에서 본 약관을 변경할 수 있습니다. 약관이 변경되는 경우 서비스 내에 공지합니다.</li>
            </ol>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">3. 서비스의 제공 및 변경</h2>
            <p>
              회사는 AI 모델을 기반으로 하여 수학 문제 생성 및 인쇄 기능, 오답 노트 기능 등을 제공합니다. 회사는 운영상, 기술상의 필요에 따라 제공하고 있는 서비스의 전부 또는 일부를 변경할 수 있습니다.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">4. 지적재산권</h2>
            <p>
              서비스를 통해 생성된 학습지 문제 데이터는 기본적으로 교육적 목적으로 자유롭게 사용 가능합니다. 단, 서비스의 시스템 아키텍처, UI 디자인, 로고 등에 대한 지적재산권은 회사에 있습니다.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">5. 면책조항</h2>
            <ol className="list-decimal pl-5 mt-2 space-y-2">
              <li>회사는 무료로 제공되는 서비스의 이용과 관련하여 분쟁이 발생한 경우, 고의 또는 중대한 과실이 없는 한 책임을 지지 않습니다.</li>
              <li>회사는 인공지능(AI)을 활용하여 콘텐츠를 제공하므로, 생성된 문제의 오류나 부적합한 내용에 대해 절대적인 무결성을 보장하지 아니합니다. 사용자는 출력물을 검토하여 사용할 책임이 있습니다.</li>
              <li>회사는 천재지변 등 불가항력이나 외부 요인으로 인하여 서비스를 제공할 수 없는 경우 책임을 지지 않습니다.</li>
            </ol>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">6. 외부 링크 및 광고 (AdSense)</h2>
            <p>
              서비스 내에는 제3자 웹사이트로의 링크나 광고(Google AdSense 등)가 포함될 수 있습니다. 회사는 이러한 외부 웹사이트의 내용이나 광고에 대해 어떠한 책임도 지지 않습니다.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">7. 관할법원</h2>
            <p>
              본 서비스 이용과 관련하여 발생한 분쟁에 대해 소송이 제기될 경우, 대한민국의 법령을 따르며 관할 법원은 민사소송법에 따릅니다.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
