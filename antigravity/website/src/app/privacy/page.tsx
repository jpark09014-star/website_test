export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto prose prose-blue">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">개인정보처리방침</h1>
        
        <div className="space-y-6 text-gray-700">
          <p>
            <strong>시행일: {new Date().toLocaleDateString('ko-KR')}</strong>
          </p>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">1. 개인정보의 처리 목적</h2>
            <p>
              Antigravity AI (이하 &quot;회사&quot;)는 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 원칙적으로 이용되지 않으며 이용 목적이 변경되는 경우에는 사전 동의를 구합니다.
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>홈페이지 회원가입 및 관리: 구글 로그인을 통한 사용자 식별, 오답노트 저장 및 학습 내역 관리</li>
              <li>서비스 제공: AI 기반 맞춤형 학습지 생성, 서비스 개선 및 맞춤형 서비스 제공</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">2. 수집하는 개인정보의 항목 및 수집 방법</h2>
            <p>회사는 서비스 제공을 위해 아래와 같은 개인정보를 수집하고 있습니다.</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li><strong>필수 항목:</strong> 이름, 이메일 주소, 프로필 사진 (구글 소셜 로그인 시 제공되는 정보)</li>
              <li><strong>서비스 이용 중 수집 항목:</strong> 사용자가 생성한 문제 텍스트, 정답 여부, 작성 이력</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">3. 개인정보의 보유 및 이용기간</h2>
            <p>
              원칙적으로, 회사는 개인정보 수집 및 이용목적이 달성된 후에는 해당 정보를 지체 없이 파기합니다. 단, 사용자 탈퇴 시까지 서비스 제공 목적으로 보관합니다.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">4. 제3자 제공 및 위탁</h2>
            <p>
              회사는 이용자의 개인정보를 원칙적으로 외부에 제공하지 않습니다. 다만, 이용자가 사전에 동의한 경우나 법령의 규정에 의거한 경우에만 예외로 합니다.<br/>
              회사는 원활한 서비스 제공을 위해 아래와 같이 업무를 위탁하고 있습니다.
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>인증 및 데이터 보관: Google Firebase</li>
              <li>웹 호스팅: Vercel (또는 그 외 적용 중인 호스팅)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">5. 개인정보 자동 수집 장치의 설치/운영 및 거부에 관한 사항</h2>
            <p>
              회사는 이용자에게 개별적인 맞춤서비스를 제공하기 위해 이용정보를 저장하고 수시로 불러오는 &lsquo;쿠키(cookie)&rsquo; 및 &apos;로컬 스토리지(localStorage)&apos;를 사용합니다. 
              사용자는 웹 브라우저의 옵션을 설정함으로써 쿠키 및 로컬 스토리지 저장을 거부할 수 있으나, 이 경우 오답노트 등 일부 서비스 이용에 어려움이 있을 수 있습니다.
            </p>
            <p className="mt-2">
              또한, 웹사이트 운영 및 최적화를 위해 Google Analytics, Google AdSense 등의 제3자 서비스가 사용될 수 있으며, 해당 서비스에서 쿠키를 수집할 수 있습니다.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">6. 문의처</h2>
            <p>
              개인정보 보호 관련 문의사항이 있으실 경우 다음 연락처로 문의해 주시기 바랍니다.
            </p>
            <p className="mt-2">
              <strong>이메일:</strong> jpark09014@gmail.com
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
