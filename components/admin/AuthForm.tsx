"use client";

import { ChangeEvent, Dispatch, SetStateAction, useCallback, useEffect, useState } from "react";

interface AuthFormProps {
    setIsAuth: Dispatch<SetStateAction<boolean>>
}

export default function AuthForm({ setIsAuth }: AuthFormProps) {

    const [password, setPassword] = useState<String>("");

    // 초기 로드 인증 확인
    useEffect(() => {
        const authStorage = sessionStorage.getItem("isAdminAuthenticated");
        if (authStorage === "true") {
            setIsAuth(true);
        }
    }, [])

    const onChangePassword = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    }, []);

    const onSubmitPassword = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();

        if (!password.trim()) {
            alert("비밀번호를 입력해주세요.");
            return;
        }

        try {
            const response = await fetch("/api/auth", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ inputPassword: password }),
            });
            const data = await response.json();
            if (data.success) {
                // 인증 성공 시 세션 저장 및 상태 변경
                sessionStorage.setItem("isAdminAuthenticated", "true");
                setIsAuth(true);
                alert("관리자 확인되었습니다.");
            } else {
                alert("비밀번호를 다시 입력해주세요.");
                setPassword("");
            }
        } catch (error) {
            console.error("auth error:", error);
            alert("인증에 실패했습니다.");
        }
    }, [password]);

    return (
        <form onSubmit={onSubmitPassword}>
            <div>
                <label htmlFor="password"><h4>비밀번호 입력</h4></label>
                <input type="password" id="password" name="password" placeholder="비밀번호를 입력해주세요." onChange={onChangePassword} />
            </div>
            <div>
                <button type="submit">확인</button>
            </div>
        </form>
    )
}