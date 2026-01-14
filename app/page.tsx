"use client";
import EventList from "@/components/EventList";
import EventSolution from "@/components/EventSolution";
import MainSlide from "@/components/MainSlide";
import ProductPreview from "@/components/ProductPreview";
import 'aos/dist/aos.css';
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

  return (
    <>
      <main className="main-home">
        <div>
          <MainSlide ref={slideRef} />
          <div className="pc-flex">
            <button onClick={() => slideRef.current?.prev()}>
              <Image src="/icons/prev.png" alt="이전" width={35} height={85} />
            </button>
            <button onClick={() => slideRef.current?.next()}>
              <Image src="/icons/next.png" alt="다음" width={35} height={85} />
            </button>
          </div>
          <div>
            <h3 data-aos="fade-up"
              data-aos-easing="ease-out"
              data-aos-duration="1000"
              data-aos-once="true"
            >(주)에스원이벤트와 함께</h3>
            <div data-aos="fade-up"
              data-aos-easing="ease-out"
              data-aos-duration="1000"
              data-aos-once="true">
              <h2>행사가 더 즐거워집니다.</h2>
            <h3>행사문의 : 010-3546-9985 / 카카오톡 ID : event.9985</h3>
            </div>
            <div className="scroll">
              <div className="mouse_scroll">
                <span></span>
              </div>
              <p>SCROLL DOWN</p>
            </div>
          </div>
        </div>
      </main>

      <article className="solution">
        <div>

          <div>
            <h2>EVENT SOLUTION</h2>
            <p>전문적인 기획과 실행으로 완성하는 행사 솔루션을 제공합니다.</p>
          </div>

          <EventSolution />

        </div>
      </article>

      <article className="preview">
        <div>
          <div>
            <h2>PRODUCT PREVIEW</h2>
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

      <article className="home-event">
        <div>
          <div>
            <h2>PORTFOLIO</h2>
            <p>(주)에스원이벤트은 주관사의 완벽한 행사를 위해 함께 준비해오고 있습니다.</p>
          </div>
          <div>
            <EventList />
            <button><Link href="/event">더보기</Link></button>
          </div>
        </div>
      </article>

      <article className="home-intro">
        <div>
            <div>
              <h2>(주)에스원이벤트는<br/>파트너쉽을 통한 행사기획,대행 솔루션입니다.</h2>
              <p>다년간의 행사경험 통해 전문기업으로 성장해 왔습니다. <br className="pc"/> 회사 소개 실적 고객 니즈에 최적화된 행사기획과 운영으로 파트너의 성과 창출을 지원합니다.<br className="pc"/> 항상 모든 프로젝트를 성실히 임무수행 하는 ㈜에스원이벤트가 되겠습니다.</p>
              <button>
                <Link href="/about">자세히 보기</Link>
              </button>
            </div>
        </div>
      </article>
    </>
  )
}