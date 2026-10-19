"use client";
import { CATEGORY_MAP } from "@/data/category";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function CategoryBanner() {
  const pathname = usePathname();
  const pathnameSplit = pathname.split("/").filter(Boolean);
  const categoryKey = pathnameSplit[0];
  const category = CATEGORY_MAP[categoryKey];

  if (!category) return null;

  return (
    <main className="h-87.5 xl:h-112.5">
      <div className="relative">
        <div>
          <Image
            src={category?.banner}
            alt={`${category?.title} 이미지`}
            width={2560}
            height={600}
            priority
            quality={100}
            className="h-87.5 w-full object-cover xl:h-112.5"
          />
        </div>
        <div className="absolute top-1/2 left-1/2 w-4/5 -translate-x-1/2 -translate-y-1/2 text-center text-white">
          <h2 className="font-sb-l text-[2.5rem] xl:text-[3rem]">{category?.title}</h2>
          {category?.title === "문의하기" && (
            <p className="mt-5">
              에스원이벤트 문의사항은 아래의 폼을 작성해주세요.
              <br />
              최종 확정 문자를 받으셔야 예약 완료되십니다.
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
