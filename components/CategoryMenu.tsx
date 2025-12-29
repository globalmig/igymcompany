"use client";
import { CATEGORY_MAP } from "@/data/category";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function CategoryMenu() {

    // const [isFocus, setIsFocus] = useState<string | null>(null);
    const pathname = usePathname();
    const isFocus = pathname.split("/")[1] || null;
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
            <div className={`menu-sticky ${isSticky ? "show" : ""}`}>
                <div ref={horizontalRef}>
                    <ul className="display-flex">
                        {categoryMenu.map((c) =>
                            <li key={c.key} className={isFocus === c.key ? "on" : ""}>
                                <Link href={`/${c.key}`}>{c.title}</Link>
                            </li>)}
                    </ul>
                </div>
            </div>
        </>
    )
}