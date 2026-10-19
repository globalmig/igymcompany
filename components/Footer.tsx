"use client";
import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  const handleScroll = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const lineClasses =
    "xl:relative xl:m-0 xl:pr-3.75 xl:mr-3.75 xl:after:content-[''] xl:after:absolute xl:after:top-1/2 xl:after:right-0 xl:after:-translate-y-[40%] xl:after:w-px xl:after:h-[10px] xl:after:bg-[#aaa]";

  return (
    <footer className="relative bg-[#222]">
      <div className="w-full px-[5%] py-20 xl:w-300 xl:mx-auto xl:px-0 xl:pt-12.5 xl:pb-20">
        <div className="fixed right-[5%] bottom-20 xl:right-[10%] xl:bottom-25">
          <div className="mb-2.5 cursor-pointer">
            <Link href="tel:010-3546-9985">
              <Image
                src="/icons/tel.png"
                alt="문의하기"
                width={100}
                height={100}
                className="w-12.5 h-auto xl:w-15"
              />
            </Link>
          </div>
          <div onClick={handleScroll} className="cursor-pointer">
            <Image
              src="/icons/top.png"
              alt="맨위로 이동"
              width={100}
              height={100}
              className="w-12.5 h-auto xl:w-15"
            />
          </div>
        </div>
        <div className="absolute top-5 right-[3%] xl:top-7.5 xl:right-7.5">
          <Link href="/admin">
            <Image
              src="/icons/admin-edit.png"
              alt="관리자페이지 이동"
              width={30}
              height={30}
              className="w-3.75 h-3.75 opacity-40"
            />
          </Link>
        </div>
        <div>
          <div className="mb-7.5 border-b border-[#ccc] pb-5">
            <button>
              <Link
                href="/inquire"
                className="rounded-[40px] border border-white bg-white px-6.25 py-1.25 hover:bg-[#222] hover:text-white"
              >
                문의하기
              </Link>
            </button>
            <p className="mt-5 text-white xl:text-base">운영시간 : 평일 09:00~ 18:00 (주말 및 공휴일 제외)</p>
          </div>
          <ul className="xl:relative xl:flex xl:w-187.5 xl:flex-wrap">
            <li className={`my-1.25 text-[#aaa] xl:text-base ${lineClasses}`}>상호명 : 에스원이벤트</li>
            <li className={`my-1.25 text-[#aaa] xl:text-base ${lineClasses}`}>사업자번호 : 723-87-02984</li>
            <li className="my-1.25 text-[#aaa] xl:m-0 xl:text-base">대표자 : 최석현</li>
            <li className={`my-1.25 text-[#aaa] xl:text-base ${lineClasses}`}>대표번호 : 010-3546-9985</li>
            <li className="my-1.25 text-[#aaa] xl:m-0 xl:text-base">
              주소 : 충북 진천군 초평면 원댕이길 15번지 1층 (에스원이벤트)
            </li>
          </ul>
          <p className="mt-10">
            <Link href="/privacy" className=" text-white/50 underline xl:text-base">개인정보처리방침</Link>
          </p>
          <p className="mt-2.5 text-[#aaa] xl:text-base">@2025 에스원이벤트. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
