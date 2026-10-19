"use client";
import EventList from "@/components/EventList";
import EventSolution from "@/components/EventSolution";
import MainSlide from "@/components/MainSlide";
import ProductPreview from "@/components/ProductPreview";
import Aos from "aos";
import Link from "next/link";
import { useEffect, useRef } from "react";
import Image from "next/image";

interface SlideHandle {
  next: () => void;
  prev: () => void;
}

export default function HomePage() {
  const slideRef = useRef<SlideHandle>(null);

  useEffect(() => {
    Aos.init();
    Aos.refresh();
  }, []);

  const heroH3Classes = "font-sb-l text-[1.2rem] mt-[10px] mb-[10px] xl:text-[1.7rem] xl:mt-5";

  return (
    <>
      <main className="h-162.5">
        <div className="relative">
          <MainSlide ref={slideRef} />
          <div className="hidden xl:absolute xl:top-[45%] xl:left-1/2 xl:z-5 xl:flex xl:w-325 xl:-translate-x-1/2 xl:-translate-y-1/2 xl:justify-between xl:pointer-events-auto">
            <button onClick={() => slideRef.current?.prev()} className="xl:cursor-pointer xl:opacity-70 xl:hover:opacity-100">
              <Image src="/icons/prev.png" alt="이전" width={35} height={85} />
            </button>
            <button onClick={() => slideRef.current?.next()} className="xl:cursor-pointer xl:opacity-70 xl:hover:opacity-100">
              <Image src="/icons/next.png" alt="다음" width={35} height={85} />
            </button>
          </div>
          <div className="absolute top-[60%] left-1/2 w-4/5 -translate-x-1/2 -translate-y-1/2 text-center text-white xl:top-[65%]">
            <h3
              className={heroH3Classes}
              data-aos="fade-up"
              data-aos-easing="ease-out"
              data-aos-duration="1000"
              data-aos-once="true"
            >
              에스원이벤트와 함께
            </h3>
            <div data-aos="fade-up" data-aos-easing="ease-out" data-aos-duration="1000" data-aos-once="true">
              <h2 className="font-sb-l text-[2.5rem] xl:text-[3rem]">행사가 더 즐거워집니다.</h2>
              <h3 className={heroH3Classes}>행사문의 : 010-3546-9985 / 카카오톡 ID : event.9985</h3>
            </div>
            <div className="mt-30 text-center xl:mt-37.5">
              <div className="relative h-17.5">
                <span className="after:content-[''] after:block after:mx-auto after:my-1.25 after:h-15 after:w-0.5 after:animate-mouse-pulse after:bg-white after:opacity-50"></span>
              </div>
              <p className="mt-5 font-sb-m text-[0.8rem] text-white">SCROLL DOWN</p>
            </div>
          </div>
        </div>
      </main>

      <article className="bg-[#F8F7F7]">
        <div className="px-[5%] py-20 xl:w-300 xl:mx-auto xl:px-0 xl:py-37.5">
          <div className="text-center mb-12.5">
            <h2 className="font-sb-l md:text-[2rem] xl:text-[2.5rem]">EVENT SOLUTION</h2>
            <p className="mt-2.5 md:mt-3.75">전문적인 기획과 실행으로 완성하는 행사 솔루션을 제공합니다.</p>
          </div>

          <EventSolution />
        </div>
      </article>

      <article className="pb-0 md:-mb-10">
        <div className="px-[5%] py-20 xl:w-300 xl:mx-auto xl:px-0 xl:py-37.5">
          <div className="text-center mb-12.5 xl:mb-17.5">
            <h2 className="font-sb-l md:text-[2rem] xl:text-[2.5rem]">PRODUCT PREVIEW</h2>
          </div>
          <div>
            <ProductPreview name="조립식무대/트러스" category="truss" />
            <ProductPreview name="천막/테이블/의자/행사용품" category="rental" />
            <ProductPreview name="워터슬라이드" category="waterslide" />
            <ProductPreview name="놀이기구" category="amusement" />
            <ProductPreview name="체험놀이" category="experience" />
          </div>
        </div>
      </article>

      <article className="bg-[#F8F7F7]">
        <div className="px-[5%] py-20 xl:w-300 xl:mx-auto xl:px-0 xl:py-37.5">
          <div className="text-center mb-7.5 xl:mb-17.5">
            <h2 className="font-sb-l xl:text-[2.5rem]">PORTFOLIO</h2>
            <p className="mt-3.75">에스원이벤트은 주관사의 완벽한 행사를 위해 함께 준비해오고 있습니다.</p>
          </div>
          <div className="text-center">
            <EventList category="event" />
            <button className="mt-12.5 py-2 px-7.5 md:py-3 md:px-10 bg-black rounded-full">
              <Link href="/event" className="text-white md:text-base">더보기</Link>
            </button>
          </div>
        </div>
      </article>

      <article className="bg-[url('/images/home_bg.jpg')] bg-center bg-cover bg-no-repeat">
        <div className="px-[5%] py-20 text-white text-center xl:w-300 xl:mx-auto xl:px-0 xl:py-37.5">
          <div>
            <h2 className="font-sb-l xl:text-[2.5rem]">
              에스원이벤트는
              <br />
              파트너쉽을 통한 행사기획,대행 솔루션입니다.
            </h2>
            <p className="mt-5 mb-10 xl:mb-17.5">
              다년간의 행사경험 통해 전문기업으로 성장해 왔습니다. <br className="hidden xl:block" /> 회사 소개 실적 고객 니즈에 최적화된 행사기획과 운영으로 파트너의 성과 창출을 지원합니다.
              <br className="hidden xl:block" /> 항상 모든 프로젝트를 성실히 임무수행 하는 ㈜에스원이벤트가 되겠습니다.
            </p>
            <button className="rounded-full border border-white py-1.25 px-6.25 md:py-2 md:px-8.75 hover:bg-white/30">
              <Link href="/about" className="text-white xl:text-base">자세히 보기</Link>
            </button>
          </div>
        </div>
      </article>
    </>
  );
}
