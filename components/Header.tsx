"use client";
import { CATEGORY_MAP } from "@/data/category";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function Header() {

    // const [isFocus, setIsFocus] = useState<string | null>(null);
    const pathname = usePathname();
    const isFocus = pathname.split("/")[1] || null;
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [isSticky, setIsSticky] = useState<boolean>(false);
    const horizontalRef = useRef<HTMLDivElement>(null);

    // mobile gnb : about, inquire 제외
    const excludeNot = ["about", "inquire"];
    const categoryMenu = Object.entries(CATEGORY_MAP)
        .filter(([key]) => !excludeNot.includes(key as any))
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
            <header>
                <div>

                    <div>
                        <div className="display-flex">
                            <h3><Link href="/" >(주)에스원이벤트</Link></h3>
                            <div className="mo" onClick={() => setIsOpen(true)}>
                                <Image src="/icons/nav.png" alt="메뉴열기" width={35} height={29} />
                            </div>
                            <div className="pc-flex">
                                <Link href="/about" >회사소개</Link>
                                <Link href="/inquire" >문의하기</Link>
                            </div>
                        </div>
                    </div>

                    <div className={isOpen ? "open" : ""}>
                        <nav>
                            <div className="mo display-flex">
                                <h3>카테고리</h3>
                                <div onClick={() => setIsOpen(false)}>
                                    <Image src="/icons/nav-close.png" alt="메뉴닫기" width={30} height={30} />
                                </div>
                            </div>
                            <ul className="display-flex-flow">
                                {categoryMenu.map((c) =>
                                    <li key={c.key} className={isFocus === c.key ? "on" : ""}>
                                        <Link href={`/${c.key}`} onClick={() => setIsOpen(false)}>
                                            <div>
                                                <Image src={c.menu_img} alt={c.title} width={148} height={148} />
                                            </div>
                                            <p>{c.title}</p>
                                        </Link>
                                    </li>)}
                            </ul>
                            <div className="mo display-flex">
                                <div className="display-flex">
                                    <section>
                                        <div>
                                            <Link href="/about" onClick={() => setIsOpen(false)}>
                                                <Image src="/icons/about.png" alt="회사소개" width={62} height={56} />
                                            </Link>
                                        </div>
                                        <p>회사소개</p>
                                    </section>
                                    <section>
                                        <div>
                                            <Link href="/inquire" onClick={() => setIsOpen(false)}>
                                                <Image src="/icons/inquire.png" alt="문의하기" width={66} height={62} />
                                            </Link>
                                        </div>
                                        <p>문의하기</p>
                                    </section>
                                </div>
                                <div>
                                    <p>운영시간</p>
                                    <ul>
                                        <li>09:00 ~ 18:00</li>
                                        <li>주말 및 공휴일 제외</li>
                                    </ul>
                                </div>
                            </div>
                            <div>
                                <ul className="mo">
                                    <li>대표번호 : 010-3546-9985</li>
                                    <li>충정북도 진천군 초평면 원댕이길 15, 에스원이벤트창고</li>
                                </ul>
                            </div>
                        </nav>
                    </div>

                </div>
            </header>
            <div className={`menu-sticky ${isSticky ? "show" : ""}`}>
                <div ref={horizontalRef}>
                    <ul className="display-flex">
                        {categoryMenu.map((c) =>
                            <li key={c.key} onClick={() => setIsOpen(false)} className={isFocus === c.key ? "on" : ""}>
                                <Link href={`/${c.key}`}>{c.title}</Link>
                            </li>)}
                    </ul>
                </div>
            </div>
            <div className="white-bg" style={{display: isOpen ? "block" : "none"}}></div>

        </>
    )
}