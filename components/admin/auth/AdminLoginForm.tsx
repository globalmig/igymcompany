"use client";

import { ChangeEvent, useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminLoginForm() {

    const router = useRouter();
    const [password, setPassword] = useState<string>("");
    const [submitting, setSubmitting] = useState<boolean>(false);

    const onChangePassword = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    }, []);

    const onSubmitPassword = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();

        if (!password.trim()) {
            alert("비밀번호를 입력해주세요.");
            return;
        }

        setSubmitting(true);
        try {
            const response = await fetch("/api/auth", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ inputPassword: password }),
            });
            const data = await response.json();
            if (data.success) {
                // 서버가 세션 쿠키를 내려줬으니, 레이아웃(서버 컴포넌트)을 다시 실행해 대시보드로 전환한다.
                router.refresh();
            } else {
                alert(data.error || "비밀번호를 다시 입력해주세요.");
                setPassword("");
            }
        } catch (error) {
            console.error("auth error:", error);
            alert("인증에 실패했습니다.");
        } finally {
            setSubmitting(false);
        }
    }, [password, router]);

    return (
        <div className="w-full max-w-95 bg-white rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.08)] px-8 py-10">
            <div className="text-center mb-9">
                <h2 className="font-sb-l text-[1.4rem] text-admin-dark">에스원이벤트</h2>
                <p className="mt-2 text-[0.9rem] text-admin-muted">관리자 로그인</p>
            </div>
            <form onSubmit={onSubmitPassword}>
                <div className="mb-5">
                    <label htmlFor="password" className="block text-[0.85rem] font-bold text-admin-text mb-2">비밀번호</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        placeholder="비밀번호를 입력해주세요"
                        onChange={onChangePassword}
                        value={password}
                        className="w-full px-3.5 py-3 border border-admin-border rounded-lg text-[0.9rem]"
                    />
                </div>
                <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3.25 rounded-lg bg-admin-dark text-white font-bold cursor-pointer"
                >로그인</button>
            </form>
            <Link href="/" className="block text-center mt-5 text-[0.82rem] text-admin-muted">홈으로 돌아가기</Link>
        </div>
    );
}
