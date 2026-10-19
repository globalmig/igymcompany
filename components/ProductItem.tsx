"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

interface ProductItemProps {
    product: {
        id: string,
        name: string,
        category: string,
        thumnail: string,
        intro?: string,
        contents?: string[],
        size?: string,
        detail?: string[]
    },
    isPreview: boolean
}

const MARQUEE_SPEED = 40; // px/s
const MARQUEE_MIN_DURATION = 4; // s

export default function ProductItem({ product, isPreview }: ProductItemProps) {

    const nameWrapRef = useRef<HTMLDivElement>(null);
    const nameTextRef = useRef<HTMLSpanElement>(null);
    const [isOverflowing, setIsOverflowing] = useState(false);
    const [marqueeDuration, setMarqueeDuration] = useState(MARQUEE_MIN_DURATION);
    const [marqueeDistance, setMarqueeDistance] = useState(0);

    useEffect(() => {
        const checkOverflow = () => {
            const wrap = nameWrapRef.current;
            const text = nameTextRef.current;
            if (!wrap || !text) return;
            const overflowWidth = text.scrollWidth - wrap.clientWidth;
            setIsOverflowing(overflowWidth > 0);
            if (overflowWidth > 0) {
                setMarqueeDistance(overflowWidth);
                setMarqueeDuration(Math.max(overflowWidth / MARQUEE_SPEED, MARQUEE_MIN_DURATION));
            }
        };

        checkOverflow();
        window.addEventListener("resize", checkOverflow);
        return () => window.removeEventListener("resize", checkOverflow);
    }, [product.name]);

    return (
        <section
            className="w-[48%] mb-5 xl:w-70 xl:mb-11.25"
        >
            <div>
                <div>
                    <Link href={`/${product.category}/${product.id}`}>
                        <Image
                            src={product.thumnail}
                            alt={product.name}
                            width={1000}
                            height={619}
                            className="w-full h-35 object-cover md:h-62.5 xl:h-52.5"
                        />
                    </Link>
                </div>
                <div>
                    <div ref={nameWrapRef} className="mt-3.75 overflow-hidden xl:mt-5">
                        <h4 className="text-base md:text-[1.2rem]">
                            <span
                                className={`flex w-max whitespace-nowrap ${isOverflowing ? "animate-marquee" : ""}`}
                                style={
                                    isOverflowing
                                        ? ({
                                              animationDuration: `${marqueeDuration}s`,
                                              "--marquee-distance": `-${marqueeDistance}px`,
                                          } as React.CSSProperties)
                                        : undefined
                                }
                            >
                                <span ref={nameTextRef}>{product.name}</span>
                            </span>
                        </h4>
                    </div>
                    <ul className="my-2 h-11.25 md:h-13.75 xl:my-2.5 xl:h-16.25">
                        {product.size !== "별도 문의" && <li className="text-[#555] text-[0.8rem] md:text-base">{product.size}</li>}
                        {product.intro && <li className="text-[#555] text-[0.8rem] md:text-base">{product.intro}</li>}
                    </ul>
                </div>
            </div>
            {isPreview &&
                <button className="mt-7.5 mb-5">
                    <Link
                        href={`/${product.category}/${product.id}`}
                        className="py-1.25 px-6.25 border border-[#aaa] text-[#555] rounded-full hover:bg-[#222] hover:border-[#222] hover:text-white md:text-base"
                    >
                        자세히 보기
                    </Link>
                </button>
            }
        </section>
    )
}