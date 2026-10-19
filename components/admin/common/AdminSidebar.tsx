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

interface AdminSideMenuProps {
    open?: boolean;
    onClose?: () => void;
}

export default function AdminSidebar({ open = false, onClose }: AdminSideMenuProps) {
    const pathname = usePathname();

    // href가 가장 길게(가장 구체적으로) 일치하는 메뉴 하나만 활성화한다.
    // ("/admin"과 "/admin/event"처럼 상위 경로가 겹치는 메뉴가 동시에 켜지는 것을 방지)
    const matchedHref = NAV_ITEMS
        .map((item) => item.href)
        .filter((href) => pathname === href || pathname.startsWith(`${href}/`))
        .sort((a, b) => b.length - a.length)[0];

    return (
        <>
            {open && (
                <div
                    className="fixed inset-0 top-15 z-40 bg-black/50 xl:hidden"
                    onClick={onClose}
                    aria-hidden="true"
                />
            )}
            <aside className={`fixed left-0 top-15 z-50 min-h-[calc(100vh-3.75rem)] w-55 max-w-[80%] shrink-0 overflow-y-auto bg-white border-r border-admin-border px-5 py-7 transition-transform duration-200 xl:static xl:top-auto xl:z-auto xl:h-auto xl:min-h-[calc(100vh-60px)] xl:w-55 xl:max-w-none xl:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"
                }`}>
                <nav>
                    <p className="text-[0.78rem] text-admin-muted font-bold mb-3.5">관리자 메뉴</p>
                    <div>
                        <ul>
                            {NAV_ITEMS.map((item) => {
                                const isActive = item.href === matchedHref;
                                return (
                                    <li key={item.href} className="mb-1">
                                        <Link
                                            href={item.href}
                                            className={`block px-3 py-2.5 rounded-lg text-[0.92rem] font-bold text-admin-text ${isActive ? "bg-admin-active-bg text-admin-dark" : ""
                                                }`}
                                        >
                                            {item.label}
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </nav>
            </aside>
        </>

    );
}
