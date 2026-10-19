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

        if (!form.date.trim()) {
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

    }, [form]);

    const inputClasses = "w-full rounded-lg p-2.5 xl:p-3.75 border border-[#ccc] xl:text-[1.1rem] xl:placeholder:text-[1rem]";
    const phoneInputClasses = "w-[30%] rounded-lg p-2.5 xl:p-3.75 border border-[#ccc] xl:text-[1.1rem] xl:placeholder:text-[1rem]";
    const divClasses = "my-6.25 xl:mt-0 xl:mb-10 xl:mx-0";
    const h3Classes = "mb-2.5 xl:mb-5 xl:text-[1.3rem] after:content-['*'] after:text-[#FF1616] after:ml-1.25";
    const textBlockPClasses = "text-[0.8rem] xl:text-[1rem]";

    return (
        <>
            <form onSubmit={onSubmitForm}>
                <div className={divClasses}>
                    <label htmlFor="name"><h3 className={`required ${h3Classes}`}>기관명</h3></label>
                    <input type="text" id="name" name="name" placeholder="기관명을 입력해주세요." onChange={onChangeForm} value={form.name} className={inputClasses} />
                </div>

                <div className={`${divClasses} xl:w-100`}>
                    <legend><h3 className={`required ${h3Classes}`}>담당부서 및 담당자 전화번호</h3></legend>
                    <div className="flex justify-between">
                        <input type="text" inputMode="numeric" id="phoneFront" name="phoneFront" maxLength={3} onChange={onChangeForm} value={form.phoneFront} className={phoneInputClasses} />
                        <p className="m-auto xl:text-[1.2rem] xl:font-bold">-</p>
                        <input type="text" inputMode="numeric" id="phoneMiddle" name="phoneMiddle" maxLength={4} onChange={onChangeForm} value={form.phoneMiddle} className={phoneInputClasses} />
                        <p className="m-auto xl:text-[1.2rem] xl:font-bold">-</p>
                        <input type="text" inputMode="numeric" id="phoneLast" name="phoneLast" maxLength={4} onChange={onChangeForm} value={form.phoneLast} className={phoneInputClasses} />
                    </div>
                </div>

                <div className={divClasses}>
                    <label htmlFor="date"><h3 className={h3Classes}>행사 일자</h3></label>
                    <input type="date" id="date" name="date" onChange={onChangeForm} value={form.date} className={inputClasses} />
                </div>

                <div className={divClasses}>
                    <label htmlFor="contents"><h3 className={h3Classes}>문의 내용</h3></label>
                    <textarea id="contents" name="contents" rows={7} placeholder="문의 내용을 입력해주세요." onChange={onChangeForm} value={form.contents} className={inputClasses} />
                </div>

                <div className={divClasses}>
                    <label htmlFor="file"><h3 className="mb-2.5 xl:mb-5 xl:text-[1.3rem]">
                        첨부파일 (선택)<br /><span className="text-[0.82rem]">사진(JPG)만 업로드 가능하며, 최대 용량 200KB입니다.</span>
                    </h3></label>
                    <input type="file" id="file" name="file" accept=".jpg,.jpeg" onChange={onChangeForm} className={inputClasses} />
                </div>

                <div className={divClasses}>
                    <label htmlFor=""><h3 className={h3Classes}>개인 정보 수집 및 이용 동의</h3></label>
                    <div className="py-3.75 px-2.5 xl:p-7.5 rounded-lg border border-[#ccc]">
                        <p className={`${textBlockPClasses} font-bold`}>아래의 개인 정보를 수집하며, 상담 외 다른 목적으로 사용되지 않습니다.</p>
                        <ul className="my-5 xl:my-7.5">
                            <li className="my-1.25 text-[0.8rem] xl:my-2 xl:text-[1rem]">- 수집 항목 : 기관명, 연락처, 행사일자, 문의 내용</li>
                            <li className="my-1.25 text-[0.8rem] xl:my-2 xl:text-[1rem]">- 수집 및 이용 목적 : 문의 상담 및 고객 응대</li>
                            <li className="my-1.25 text-[0.8rem] xl:my-2 xl:text-[1rem]">- 보유 기간 : 문의일로부터 1년간 보관 후 즉시 파기</li>
                            <li className="my-1.25 text-[0.8rem] xl:my-2 xl:text-[1rem]">- 수집 방법 : 홈페이지 문의 접수</li>
                        </ul>
                        <p className={textBlockPClasses}>접수된 문의 내용은 SMS 발송을 통해 [(주)에스원이벤트] 담당자에게 실시간 전달됩니다.</p>
                        <p className={`${textBlockPClasses} mt-3.75`}>개인정보 수집에 동의하지 않으실 경우, 상담 서비스 제공이 제한될 수 있습니다.</p>
                    </div>
                    <div className="flex mt-5 justify-start gap-2.5">
                        <input type="checkbox" id="privacy" name="privacy" checked={form.privacy} onChange={onChangeForm} className="w-auto my-auto mx-0 rounded-lg p-2.5 xl:p-3.75 border border-[#ccc]" />
                        <label htmlFor="privacy"></label>
                        <p className="xl:text-[1.1rem]">개인 정보 수집 및 이용에 동의합니다.</p>
                    </div>
                </div>

                <button type="submit" className="w-full p-3.75 xl:p-5 mt-7.5 xl:mt-12.5 rounded-full text-white font-bold bg-black cursor-pointer xl:text-[1.2rem]">문의 접수하기</button>

            </form>
        </>
    );
}
