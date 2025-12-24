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
            <h1 data-aos="fade-up"
              data-aos-easing="ease-out"
              data-aos-duration="1000"
              data-aos-once="true"
            >행사가 더 즐거워집니다.</h1>
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
            <ProductPreview name="에어바운스" category="airbounce" />
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
    </>
  )
}