import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "개인정보처리방침 | 에스원이벤트",
  description: "에스원이벤트가 수집하는 개인정보의 항목, 이용 목적, 보유 기간 및 이용자의 권리를 안내합니다.",
  alternates: {
    canonical: "/privacy",
  },
  openGraph: {
    title: "개인정보처리방침 | 에스원이벤트",
    description: "에스원이벤트가 수집하는 개인정보의 항목, 이용 목적, 보유 기간 및 이용자의 권리를 안내합니다.",
    url: "https://www.s-one-event.co.kr/privacy",
  },
};

export default function PrivacyPage() {
  const sectionTitleClasses = "mt-10 mb-2.5 xl:text-[1.2rem]";
  const bodyPClasses = "text-[#555] xl:text-base";
  const bodyUlClasses = "mt-2.5";
  const bodyLiClasses = "text-[#555] xl:text-base";

  return (
    <article>
      <div className="px-[5%] py-20 xl:w-300 xl:mx-auto xl:px-0 xl:py-37.5">
        <div className="text-center mb-17.5 xl:mb-25 pb-17.5 xl:pb-25 border-b border-[#aaa]">
          <h2 className="xl:text-[2.3rem]">개인정보처리방침</h2>
          <p className="mt-5 xl:mt-7.5 text-[#555] xl:text-base">
            ㈜에스원이벤트(이하 &ldquo;회사&rdquo;)는 이용자의 개인정보를 중요시하며, 「개인정보 보호법」 등 관련 법령을 준수합니다.
            <br />
            회사는 다음과 같이 개인정보를 처리하고 있음을 알려드립니다.
          </p>
        </div>

        <section>
          <h3 className={sectionTitleClasses}>1. 수집하는 개인정보의 항목 및 수집방법</h3>
          <p className={bodyPClasses}>
            회사는 홈페이지 문의하기 게시판을 통해 상담 신청 시 아래와 같은 개인정보를 수집합니다.
          </p>
          <ul className={bodyUlClasses}>
            <li className={bodyLiClasses}>- 수집 항목 : 기관명, 연락처(전화번호), 행사 일자, 문의 내용, 첨부파일(선택)</li>
            <li className={bodyLiClasses}>- 수집 방법 : 홈페이지 문의하기 폼을 통한 이용자의 직접 입력</li>
          </ul>
        </section>

        <section>
          <h3 className={sectionTitleClasses}>2. 개인정보의 수집 및 이용목적</h3>
          <p className={bodyPClasses}>
            수집한 개인정보는 문의 상담 및 고객 응대, 행사 견적·진행 관련 안내를 위한 목적으로만 이용하며, 입력하신 문의 내용은 담당자에게
            문자(SMS/MMS)로 실시간 전달됩니다.
          </p>
        </section>

        <section>
          <h3 className={sectionTitleClasses}>3. 개인정보의 보유 및 이용기간</h3>
          <p className={bodyPClasses}>
            회사는 원칙적으로 개인정보 수집 및 이용목적이 달성된 후에는 해당 정보를 지체 없이 파기합니다. 문의 내용은 문의일로부터
            1년간 보관 후 즉시 파기하며, 첨부파일은 담당자에게 전달 완료 후 서버에서 즉시 삭제됩니다.
          </p>
        </section>

        <section>
          <h3 className={sectionTitleClasses}>4. 개인정보처리 위탁</h3>
          <p className={bodyPClasses}>
            회사는 원활한 문의 안내 업무를 위해 아래와 같이 개인정보 처리업무를 외부에 위탁하고 있으며, 위탁계약 시 개인정보가
            안전하게 관리될 수 있도록 필요한 사항을 규정하고 있습니다.
          </p>
          <ul className={bodyUlClasses}>
            <li className={bodyLiClasses}>- 수탁업체 : 솔라피(SOLAPI)</li>
            <li className={bodyLiClasses}>- 위탁업무 내용 : 문의 접수 내용의 문자(SMS/MMS) 발송</li>
          </ul>
        </section>

        <section>
          <h3 className={sectionTitleClasses}>5. 개인정보의 제3자 제공</h3>
          <p className={bodyPClasses}>
            회사는 이용자의 개인정보를 원칙적으로 외부에 제공하지 않습니다. 다만 이용자가 사전에 동의한 경우 또는 법령의 규정에
            의거한 경우에는 예외로 합니다.
          </p>
        </section>

        <section>
          <h3 className={sectionTitleClasses}>6. 이용자의 권리와 행사방법</h3>
          <p className={bodyPClasses}>
            이용자는 언제든지 등록되어 있는 자신의 개인정보를 조회, 수정하거나 삭제 및 처리정지를 요청할 수 있으며, 아래 &ldquo;8. 개인정보
            보호책임자&rdquo;의 연락처로 요청하시면 지체 없이 조치하겠습니다.
          </p>
        </section>

        <section>
          <h3 className={sectionTitleClasses}>7. 개인정보의 안전성 확보 조치</h3>
          <p className={bodyPClasses}>
            회사는 개인정보의 안전성 확보를 위해 개인정보 처리 담당자를 최소화하고, 전송 및 보관 구간에 대한 접근을 제한하는 등의
            기술적·관리적 조치를 취하고 있습니다.
          </p>
        </section>

        <section>
          <h3 className={sectionTitleClasses}>8. 개인정보 보호책임자</h3>
          <p className={bodyPClasses}>
            회사는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 이용자의 불만처리 및 피해구제 등을 위하여
            아래와 같이 개인정보 보호책임자를 지정하고 있습니다.
          </p>
          <ul className={bodyUlClasses}>
            <li className={bodyLiClasses}>- 상호명 : 에스원이벤트</li>
            <li className={bodyLiClasses}>- 대표자 : 최석현</li>
            <li className={bodyLiClasses}>- 대표번호 : 010-3546-9985</li>
            <li className={bodyLiClasses}>- 주소 : 충북 진천군 초평면 원댕이길 15번지 1층</li>
          </ul>
        </section>

        <section>
          <h3 className={sectionTitleClasses}>9. 고지의 의무</h3>
          <p className={bodyPClasses}>
            이 개인정보처리방침은 2026년 10월 14일부터 적용되며, 법령·방침에 따른 변경이 있을 경우 홈페이지를 통해 고지합니다.
          </p>
        </section>
      </div>
    </article>
  );
}
