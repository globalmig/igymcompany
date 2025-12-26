'use client'
import { useRouter } from "next/navigation";
import { ChangeEvent, useCallback, useState } from "react";

interface FormProps {
    name: string;
    phoneFront: string;
    phoneMiddle: string;
    phoneLast: string;
    date: string;
    contents: string;
    file?: File | null;
    privacy: false;
}

export default function InquireForm() {

    const router = useRouter();

    const [form, setForm] = useState<FormProps>({
        name: "",
        phoneFront: "010",
        phoneMiddle: "",
        phoneLast: "",
        date: "",
        contents: "",
        file: null,
        privacy: false
    });

    const onChangeForm = useCallback((e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;

        const newValue =
            type === 'checkbox'
                ? (e.target as HTMLInputElement).checked
                : value;

        if (type === "file") {
            const fileInput = e.target as HTMLInputElement;
            const file = fileInput.files?.[0] ?? null;
            setForm(prev => ({ ...prev, file }));
            return;
        }

        setForm(prev => ({
            ...prev,
            [name]: newValue,
        }));
    }, []);

    const onSubmitForm = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();

        if (!form.name.trim() || !form.phoneMiddle.trim()
            || !form.phoneLast.trim()) {
            alert("필수 항목을 입력해주세요.")
            return;
        }

        if (!form.contents.trim()) {
            alert("문의내용을 입력해주세요.");
            return;
        }

        if(!form.date.trim()) {
            alert("행사 일자를 선택해주세요.");
        }

        const phone = form.phoneFront + form.phoneMiddle + form.phoneLast;
        if (!/^[0-9]{10,11}$/.test(phone)) {
            alert("연락처는 숫자만 10~11자리로 입력해주세요.")
            return;
        }

        if (form.file) {
            const ext = form.file.name.split('.').pop()?.toLowerCase() ?? "";
            const allowedExtensions = ["jpg", "jpeg"];

            if (!allowedExtensions.includes(ext)) {
                alert("JPG 파일만 업로드 가능합니다.");
                return;
            }

            const fileSizeKB = form.file.size / 1024;
            if (fileSizeKB > 200) {
                alert("첨부파일 용량은 200KB이하이어야 합니다.");
                return;
            }
        }

        if (!form.privacy) {
            alert("개인정보 수집 및 이용 동의를 해주세요.");
            return
        }

        // SMS 
        try {
            const formData = new FormData();
            Object.entries(form).forEach(([key, value]) => {
                if (value !== null) formData.append(key, value as any);
            });

            const response = await fetch("/api/inquire", {
                method: "POST",
                body: formData,
            });

            const data = await response.json();

            if (data.success) {
                alert("문의가 정상적으로 접수되었습니다.");
                router.push("/");
                window.location.reload();
            } else {
                alert("문자 발송 중 오류가 발생했습니다.");
            }
        } catch (error) {
            console.error(error);
            alert("서버 오류가 발생했습니다. 다시 시도해주세요.");
        }

        console.log(form)

    }, [form]);

    return (
        <>
            <form onSubmit={onSubmitForm}>
                <div>
                    <label htmlFor="name"><h3 className="required">원명 또는 기관명</h3></label>
                    <input type="text" id="name" name="name" placeholder="성함을 입력해주세요." onChange={onChangeForm} value={form.name} />
                </div>

                <div>
                    <legend><h3 className="required">담당부서 및 담당자 전화번호</h3></legend>
                    <div className="display-flex">
                        <input type="text" inputMode="numeric" id="phoneFront" name="phoneFront" maxLength={3} onChange={onChangeForm} value={form.phoneFront} />
                        <p>-</p>
                        <input type="text" inputMode="numeric" id="phoneMiddle" name="phoneMiddle" maxLength={4} onChange={onChangeForm} value={form.phoneMiddle} />
                        <p>-</p>
                        <input type="text" inputMode="numeric" id="phoneLast" name="phoneLast" maxLength={4} onChange={onChangeForm} value={form.phoneLast} />
                    </div>
                </div>

                <div>
                    <label htmlFor="date"><h3>행사 일자</h3></label>
                    <input type="date" id="date" name="date" onChange={onChangeForm} value={form.date} />
                </div>

                <div>
                    <label htmlFor="contents"><h3>문의 내용</h3></label>
                    <textarea id="contents" name="contents" rows={7} placeholder="공사 요청사항을 입력해주세요." onChange={onChangeForm} value={form.contents} />
                </div>

                <div>
                    <label htmlFor="file"><h3>
                        첨부파일 (선택)<br /><span>사진(JPG)만 업로드 가능하며, 최대 용량 200KB입니다.</span>
                    </h3></label>
                    <input type="file" id="file" name="file" accept=".jpg,.jpeg" onChange={onChangeForm} />
                </div>

                <div>
                    <label htmlFor=""><h3>개인 정보 수집 및 이용 동의</h3></label>
                    <div>
                        <p>아래의 개인 정보를 수집하며, 상담 외 다른 목적으로 사용되지 않습니다.</p>
                        <ul>
                            <li>- 수집 항목 : 행사명(단체명, 행사장소), 이름, 연락처, 문의 내용</li>
                            <li>- 수집 및 이용 목적 : 문의 상담 및 고객 응대</li>
                            <li>- 보유 기간 : 문의일로부터 1년간 보관 후 즉시 파기</li>
                            <li>- 수집 방법 : 홈페이지 문의 접수</li>
                        </ul>
                        <p>접수된 문의 내용은 SMS 발송을 통해 [(주)에스원이벤트] 담당자에게 실시간 전달됩니다.</p>
                        <p>개인정보 수집에 동의하지 않으실 경우, 상담 서비스 제공이 제한될 수 있습니다.</p>
                    </div>
                    <div className="display-flex">
                        <input type="checkbox" id="privacy" name="privacy" checked={form.privacy} onChange={onChangeForm} />
                        <label htmlFor="privacy"></label>
                        <p>개인 정보 수집 및 이용에 동의합니다.</p>
                    </div>
                </div>

                <button type="submit">문의 접수하기</button>

            </form>
        </>
    );
}
