"use client";
import Image, { ImageProps } from "next/image";
import { useState } from "react";
import Skeleton from "./Skeleton";

// 썸네일/상세 콘텐츠 이미지가 로딩되는 동안 빈 화면 대신 스켈레톤을 보여준다.
// className은 기존 <Image>에 주던 크기/라운딩 클래스를 그대로 넘기면 래퍼 div에 적용되고,
// className 없이 width/height만 넘기던 기존 사용처는 그 픽셀 크기를 래퍼에 그대로 적용해 레이아웃을 유지한다.
export default function ImageWithSkeleton({ className, onLoad, alt, width, height, ...rest }: ImageProps) {
    const [loaded, setLoaded] = useState(false);

    return (
        <div
            className={`relative overflow-hidden ${className ?? ""}`}
            style={
                !className
                    ? {
                          width: typeof width === "number" ? width : undefined,
                          height: typeof height === "number" ? height : undefined,
                      }
                    : undefined
            }
        >
            {!loaded && <Skeleton className="absolute inset-0" />}
            <Image
                {...rest}
                alt={alt}
                width={width}
                height={height}
                className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${
                    loaded ? "opacity-100" : "opacity-0"
                }`}
                onLoad={(e) => {
                    setLoaded(true);
                    onLoad?.(e);
                }}
            />
        </div>
    );
}
