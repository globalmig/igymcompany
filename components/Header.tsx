"use client";
import { CATEGORY_MAP } from "@/data/category";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function Header() {

    const [isFocus, setIsFocus] = useState<string | null>(null);
    const [isOpen, setIsOpen] = useState<boolean>(false);

    // mobile gnb : about, inquire 제외
    const excludeNot = ["about", "inquire"];
    const categoryMenu = Object.entries(CATEGORY_MAP)
        .filter(([key]) => !excludeNot.includes(key as any))
        .map(([key, value]) => ({
            key,
            ...value,
        }));

    return (
        <>
            <header>
                <div>

                    <div className="display-flex">
                        <h3><Link href="/">(주)에스원이벤트</Link></h3>
                        <div className="mo" onClick={() => setIsOpen(true)}>
                            <Image src="/icons/nav.png" alt="메뉴열기" width={30} height={30} />
                        </div>
                        <div className="pc-flex">
                            <Link href="/about">회사소개</Link>
                            <Link href="/inquire">문의하기</Link>
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
                                        <Link href={`/${c.key}`} onFocus={() => setIsFocus(c.key)} onClick={() => setIsOpen(false)}>
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
                                            <Link href="/about" onClick={() => setIsOpen(false)} onFocus={() => setIsFocus(null)}>
                                                <Image src="/icons/about.png" alt="회사소개" width={100} height={100} />
                                            </Link>
                                        </div>
                                        <p>회사소개</p>
                                    </section>
                                    <section>
                                        <div>
                                            <Link href="/inquire" onClick={() => setIsOpen(false)} onFocus={() => setIsFocus(null)}>
                                                <Image src="/icons/inquire.png" alt="문의하기" width={100} height={100} />
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
                            <ul className="mo">
                                <li>대표번호 : 010-3546-9985</li>
                                <li>충정북도 진천군 초평면 원댕이길 15, 에스원이벤트창고</li>
                            </ul>
                        </nav>
                    </div>

                </div>
            </header>
            <div className="menu-sticky">
                {/* nav-select 연동, 맨 왼쪽으로 위치 */}
                <div>
                    <ul className="display-flex">
                        {categoryMenu.map((c) =>
                            <li key={c.key} onFocus={() => setIsFocus(c.key)} onClick={() => setIsOpen(false)} className={isFocus === c.key ? "on" : ""}>
                                <Link href={`/${c.key}`}>{c.title}</Link>
                            </li>)}
                    </ul>
                </div>
            </div>
        </>
    )
}