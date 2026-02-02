"use client";
import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  const handleScroll = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer>
      <div>
        <div>
          <div>
            <Link href="tel:010-3546-9985">
              <Image src="/icons/tel.png" alt="문의하기" width={100} height={100} />
            </Link>
          </div>
          <div onClick={handleScroll}>
            <Image src="/icons/top.png" alt="맨위로 이동" width={100} height={100} />
          </div>
        </div>
        <div>
          <Link href="/admin">
            <Image src="/icons/admin-edit.png" alt="관리자페이지 이동" width={30} height={30} />
          </Link>
        </div>
        <div>
          <div>
            <button>
              <Link href="/inquire">문의하기</Link>
            </button>
            <p>운영시간 : 평일 09:00~ 18:00 (주말 및 공휴일 제외)</p>
          </div>
          <ul>
            <li className="line">상호명 : 에스원이벤트</li>
            <li className="line">사업자번호 : 723-87-02984</li>
            <li>대표자 : 최석현</li>
            <li className="line">대표번호 : 010-3546-9985</li>
            <li>주소 : 충북 진천군 초평면 원댕이길 15번지 1층 (에스원이벤트)</li>
          </ul>
          <p>@2025 에스원이벤트. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
