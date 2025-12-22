import EventList from "@/components/EventList";
import MainSlide from "@/components/MainSlide";
import Link from "next/link";

export default function HomePage() {
  return (
    <>
      <main>
        <MainSlide />
      </main>
      <article className="home">
        <div>

        </div>
      </article>
      <div className="full-home">
        <h2>(주)에스원이벤트과 함께 <br />새롭고 즐거운 경험을 만들어보세요.</h2>
      </div>
      <article className="home-event">
        <div>
          <div>
            <h2>함께 해온 공식 행사</h2>
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