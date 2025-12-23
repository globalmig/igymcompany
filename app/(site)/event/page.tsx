import EventList from "@/components/EventList";
import Image from "next/image";

export default function EventPage() {
    return (
        <article className="event">
            <div>
                <div>
                    <Image src="/images/행사/banner.jpg" alt="공식행사" width={1000} height={619} />
                </div>
                <div>
                    <h2>사회적 가치를 담은 공식 행사</h2>
                    <p>사회적 문화적 교육적인 목적을 가지고<br />정부 지자체 공공단체 등이 주최하거나 참여하는 다양한 행사입니다.</p>
                    <ul className="display-flex-flow">
                        <li>기념식</li>
                        <li>준공식</li>
                        <li>착공식</li>
                        <li>제막식</li>
                        <li>문화 및 예술행사</li>
                        <li>국제회의포럼</li>
                        <li>시상식</li>
                        <li>워크샵</li>
                        <li>재난 대비 행사</li>
                    </ul>
                </div>
                <EventList />
            </div>
        </article>
    )
}