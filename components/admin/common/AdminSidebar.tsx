"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface AdminNavItem {
    label: string;
    href: string;
}

const NAV_ITEMS: AdminNavItem[] = [
    { label: "제품관리", href: "/admin" },
    { label: "행사관리", href: "/admin/event" },
];

export default function AdminSidebar() {
    const pathname = usePathname();

    // href가 가장 길게(가장 구체적으로) 일치하는 메뉴 하나만 활성화한다.
    // ("/admin"과 "/admin/event"처럼 상위 경로가 겹치는 메뉴가 동시에 켜지는 것을 방지)
    const matchedHref = NAV_ITEMS
        .map((item) => item.href)
        .filter((href) => pathname === href || pathname.startsWith(`${href}/`))
        .sort((a, b) => b.length - a.length)[0];

    return (
        <aside className="w-55 shrink-0 min-h-[calc(100vh-60px)] bg-white border-r border-admin-border px-5 py-7 max-[900px]:hidden">
            <p className="text-[0.78rem] text-admin-muted font-bold mb-3.5">관리자 메뉴</p>
            <div>
                <ul>
                    {NAV_ITEMS.map((item) => {
                        const isActive = item.href === matchedHref;
                        return (
                            <li key={item.href} className="mb-1">
                                <Link
                                    href={item.href}
                                    className={`block px-3 py-2.5 rounded-lg text-[0.92rem] font-bold text-admin-text ${
                                        isActive ? "bg-admin-active-bg text-admin-dark" : ""
                                    }`}
                                >
                                    {item.label}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </aside>
    );
}
