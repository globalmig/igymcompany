"use client";
import CategoryBanner from "@/components/CategoryBanner";
import { CATEGORY_MAP } from "@/data/category";
import { usePathname } from "next/navigation";

export default function SiteLayout({
    children,
}: {
    children: React.ReactNode;
}) {

    const pathname = usePathname();
    const pathnameSplit = pathname.split('/').filter(Boolean);

    const showBanner = pathnameSplit.length === 1 && CATEGORY_MAP[pathnameSplit[0]];

    return (
        <>
            {showBanner && <CategoryBanner />}
            {children}
        </>
    );
}
