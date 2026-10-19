"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface AdminHeaderProps {
    onMenuClick?: () => void;
}

export default function AdminTopbar({ onMenuClick }: AdminHeaderProps) {

    const router = useRouter();
    const [loggingOut, setLoggingOut] = useState<boolean>(false);

    const onLogout = async () => {
        setLoggingOut(true);
        try {
            await fetch("/api/auth", { method: "DELETE" });
        } finally {
            router.push("/admin");
            router.refresh();
        }
    };

    return (
        <div className="flex items-center justify-between h-15 px-6 bg-white border-b border-admin-border sticky top-0 z-10">
            <p className="font-bold tracking-[0.05em] text-admin-dark">ADMIN</p>
            <div className="flex items-center gap-4.5 text-[0.85rem] whitespace-nowrap">
                <Link href="/" className="text-admin-dark font-bold">사이트 돌아가기</Link>
                <button type="button" onClick={onLogout} disabled={loggingOut} className="text-admin-muted cursor-pointer">로그아웃</button>
                <button
                    type="button"
                    onClick={onMenuClick}
                    aria-label="메뉴 열기"
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-admin-dark hover:bg-admin-active-bg xl:hidden"
                >
                    <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        aria-hidden="true"
                        className="h-5 w-5"
                    >
                        <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
                    </svg>
                </button>
            </div>
        </div>
    );
}
