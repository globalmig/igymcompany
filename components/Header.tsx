"use client";
import { CATEGORY_MAP } from "@/data/category";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function Header() {
  const pathname = usePathname();
  const isFocus = pathname.split("/")[1] || null;
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isSticky, setIsSticky] = useState<boolean>(false);
  const horizontalRef = useRef<HTMLDivElement>(null);

  // mobile gnb : about, inquire 제외
  const excludeNot = ["about", "inquire"];
  const categoryMenu = Object.entries(CATEGORY_MAP)
    .filter(([key]) => !excludeNot.includes(key))
    .map(([key, value]) => ({
      key,
      ...value,
    }));

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 268);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const el = horizontalRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        el.scrollLeft += e.deltaY;
      }
    };
    el.addEventListener("wheel", onWheel, { passive: false });

    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  return (
    <>
      <header className="bg-white border-b border-[#ccc] xl:border-b-0">
        <div className="relative px-[5%] py-3.75 xl:px-0 xl:pt-5 xl:pb-7.5">
          <div className="xl:border-b xl:border-[#ccc] xl:pb-5">
            <div className="flex justify-between xl:relative xl:mx-auto xl:w-334">
              <h1>
                <Link href="/">에스원이벤트</Link>
              </h1>
              <div className="my-auto cursor-pointer xl:hidden" onClick={() => setIsOpen(true)}>
                <Image src="/icons/nav.png" alt="메뉴열기" width={35} height={29} className="h-auto w-5" />
              </div>
              <div className="hidden xl:flex xl:absolute xl:top-1/2 xl:right-0 xl:-translate-y-1/2 xl:gap-5 xl:pointer-events-auto">
                <Link href="/about" className="xl:font-bold">회사소개</Link>
                <Link href="/inquire" className="xl:font-bold">문의하기</Link>
              </div>
            </div>
          </div>

          <div
            className={`${isOpen ? "block" : "hidden"} absolute top-0 left-0 z-50 h-screen w-full overflow-y-auto bg-white xl:static xl:block xl:mx-auto xl:h-auto xl:w-334`}
          >
            <nav className="px-[5%] py-3.75 xl:h-auto xl:border-b-2 xl:border-black xl:px-0 xl:pt-5 xl:pb-0">
              <div className="mb-7.5 flex justify-between xl:hidden">
                <h3>카테고리</h3>
                <div className="my-auto cursor-pointer" onClick={() => setIsOpen(false)}>
                  <Image src="/icons/nav-close.png" alt="메뉴닫기" width={30} height={30} className="h-auto w-3.75" />
                </div>
              </div>
              {/* 모바일 전용: 카드형 메뉴 (라벨을 이미지 아래로 분리) */}
              <ul className="flex flex-wrap justify-between xl:hidden">
                {categoryMenu.map((c) => (
                  <li key={c.key} className="mb-5 w-[47%]">
                    <Link href={`/${c.key}`} onClick={() => setIsOpen(false)} className="block">
                      <div
                        className={`overflow-hidden rounded-2xl border ${
                          isFocus === c.key ? "border-2 border-black" : "border-[#eee]"
                        }`}
                      >
                        <Image
                          src={c.menu_img}
                          alt={c.title}
                          width={148}
                          height={148}
                          className="h-auto w-full object-cover"
                        />
                      </div>
                      <p
                        className={`mt-2.5 text-center text-sm font-semibold ${
                          isFocus === c.key ? "text-black" : "text-[#555]"
                        }`}
                      >
                        {c.title}
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>

              {/* 데스크톱 전용: 기존 이미지+뱃지 오버레이 메뉴 */}
              <ul className="hidden xl:flex xl:justify-between">
                {categoryMenu.map((c) => (
                  <li
                    key={c.key}
                    className={`relative mb-5 w-35 rounded-[18px] rounded-b-[30px] border ${
                      isFocus === c.key ? "border-black border-2" : "border-[#eee]"
                    }`}
                  >
                    <Link href={`/${c.key}`} onClick={() => setIsOpen(false)}>
                      <div>
                        <Image
                          src={c.menu_img}
                          alt={c.title}
                          width={148}
                          height={148}
                          className="h-auto w-full rounded-[15px] rounded-b-[30px] object-cover"
                        />
                      </div>
                      <p
                        className={`absolute -bottom-[1.5px] left-0 w-full rounded-[50px] px-1.25 py-2 text-center text-[0.7rem] ${
                          isFocus === c.key ? "bg-black text-white" : "bg-[#eee] text-[#555]"
                        }`}
                      >
                        {c.title}
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="mt-5 flex justify-center gap-5 rounded-[15px] px-3.75 py-7.5 shadow-[0_0_13px_#eee] xl:hidden">
                <div className="flex justify-start gap-2.5">
                  <section>
                    <div className="relative h-12.5 w-12.5 rounded-full shadow-[0_0_8px_#eee]">
                      <Link href="/about" onClick={() => setIsOpen(false)}>
                        <Image
                          src="/icons/about.png"
                          alt="회사소개"
                          width={62}
                          height={56}
                          className="absolute top-1/2 left-1/2 h-auto w-7.5 -translate-x-1/2 -translate-y-1/2"
                        />
                      </Link>
                    </div>
                    <p className="mt-2.5 text-center text-[0.9rem]">회사소개</p>
                  </section>
                  <section>
                    <div className="relative h-12.5 w-12.5 rounded-full shadow-[0_0_8px_#eee]">
                      <Link href="/inquire" onClick={() => setIsOpen(false)}>
                        <Image
                          src="/icons/inquire.png"
                          alt="문의하기"
                          width={66}
                          height={62}
                          className="absolute top-1/2 left-1/2 h-auto w-7.5 -translate-x-1/2 -translate-y-1/2"
                        />
                      </Link>
                    </div>
                    <p className="mt-2.5 text-center text-[0.9rem]">문의하기</p>
                  </section>
                </div>
                <div className="my-auto">
                  <p className="mb-1.25 text-[0.9rem] font-bold text-[#FFA600]">운영시간</p>
                  <ul>
                    <li className="text-[0.9rem] text-[#555]">09:00 ~ 18:00</li>
                    <li className="text-[0.9rem] text-[#555]">주말 및 공휴일 제외</li>
                  </ul>
                </div>
              </div>
              <div className="mt-12.5 xl:mt-0">
                <ul className="xl:hidden">
                  <li className="my-2">대표번호 : 010-3546-9985</li>
                  <li className="my-2">충정북도 진천군 초평면 원댕이길 15, 에스원이벤트창고</li>
                </ul>
              </div>
            </nav>
          </div>
        </div>
      </header>
      <div
        className={`${isSticky ? "fixed top-0 left-0 w-full" : "sticky top-0"} z-10 border-b border-[#eee] bg-white pt-2.5 pb-2.5 pl-[5%] xl:fixed xl:top-0 xl:left-0 xl:w-full xl:px-0 xl:py-5 ${
          isSticky ? "xl:block" : "xl:hidden"
        }`}
      >
        <div
          ref={horizontalRef}
          className="overflow-x-auto overflow-y-hidden [scrollbar-width:none] xl:mx-auto xl:w-341.5 xl:overflow-x-visible"
        >
          <ul className="flex justify-start gap-2 whitespace-nowrap [&::-webkit-scrollbar]:hidden xl:justify-between">
            {categoryMenu.map((c) => (
              <li
                key={c.key}
                onClick={() => setIsOpen(false)}
                className={`shrink-0 rounded-[50px] px-5 py-1.25 text-base xl:px-5.75 ${
                  isFocus === c.key ? "bg-black" : "bg-[#eee]"
                }`}
              >
                <Link
                  href={`/${c.key}`}
                  className={`text-center whitespace-nowrap ${isFocus === c.key ? "text-white" : "text-[#555]"}`}
                >
                  {c.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="fixed top-0 left-0 z-20 h-screen w-full bg-white" style={{ display: isOpen ? "block" : "none" }}></div>
    </>
  );
}
