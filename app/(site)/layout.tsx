"use client";
import CategoryBanner from "@/components/CategoryBanner";
import { usePathname } from "next/navigation";

export default function SiteLayout({
    children,
}: {
    children: React.ReactNode;
}) {

    const pathname = usePathname();
    const pathnameSplit = pathname.split('/').filter(Boolean);
    const categoryBannerRoutes = ["/truss", "/sound"]

    return (
        <>
            {categoryBannerRoutes.includes(pathname) || pathnameSplit.length <= 1 && <CategoryBanner />}
            {children}
        </>
    );
}
