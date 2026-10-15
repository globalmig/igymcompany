"use client";
import { useParams, useRouter } from "next/navigation";
import { ChangeEvent, useCallback, useEffect, useState } from "react"
import { uploadEventImages } from "@/lib/supabase/upload";
import { CATEGORY_MAP } from "@/data/category";
import { supabase } from "@/lib/supabase/client";
import ImageWithSkeleton from "@/components/admin/common/ImageWithSkeleton";

const MAIN_PORTFOLIO_LIMIT = 9;

type EventFormMode = "upload" | "edit" | "detail";

interface InitialDataProps {
    id: string;
    name: string;
    category: string;
    thumnail: string;
    detail: string[];
    show_on_main?: boolean;
}

interface EventFormState {
    name: string,
    category: string,
    thumnail: File | null,
    show_on_main: boolean,
}

interface EventFormProps {
    mode: EventFormMode; // upload OR edit
    initialData?: InitialDataProps; // edit data (등록된 데이터)
}

const EVENT_CATEGORIES = ["event", "sports_competition"];

export default function EventForm({ mode, initialData }: EventFormProps) {

    const router = useRouter();
    const { id } = useParams();

    const isDetail = mode === "detail";
    const isUpload = mode === "upload";
    const isEdit = mode === "edit";

    const [form, setForm] = useState<EventFormState>({
        name: initialData?.name ?? "",
        category: initialData?.category ?? "",
        thumnail: null,
        show_on_main: initialData?.show_on_main ?? false,
    });

    useEffect(() => {
        if (initialData) {
            setForm(prev => ({
                ...prev,
                name: initialData.name ?? "",
                category: initialData.category ?? "",
                show_on_main: initialData.show_on_main ?? false,
            }));
        }
    }, [initialData]);

    // 필수 입력값 검증 실패 시, 해당 입력 필드 테두리를 강조 표시하기 위한 상태
    const [errors, setErrors] = useState<{ name?: boolean; category?: boolean; thumnail?: boolean }>({});

    // 같은 카테고리에서 메인 노출 개수가 이미 최대치인지 미리 확인해, 토글에 마우스를 올렸을 때 이유를 안내한다.
    const [mainLimitReached, setMainLimitReached] = useState(false);

    const checkMainLimit = useCallback(async () => {
        if (!form.category) {
            setMainLimitReached(false);
            return;
        }
        try {
            let query = supabase
                .from("events")
                .select("id", { count: "exact", head: true })
                .eq("category", form.category)
                .eq("show_on_main", true);

            if (initialData?.id) {
                query = query.neq("id", initialData.id);
            }

            const { count, error } = await query;
            if (error) throw error;

            setMainLimitReached((count ?? 0) >= MAIN_PORTFOLIO_LIMIT);
        } catch {
            setMainLimitReached(false);
        }
    }, [form.category, initialData?.id]);

    useEffect(() => {
        checkMainLimit();
    }, [checkMainLimit]);

    const onToggleShowOnMain = async () => {
        if (form.show_on_main) {
            setForm(prev => ({ ...prev, show_on_main: false }));
            return;
        }

        try {
            let query = supabase
                .from("events")
                .select("id", { count: "exact", head: true })
                .eq("category", form.category)
                .eq("show_on_main", true);

            if (initialData?.id) {
                query = query.neq("id", initialData.id);
            }

            const { count, error } = await query;
            if (error) throw error;

            if ((count ?? 0) >= MAIN_PORTFOLIO_LIMIT) {
                setMainLimitReached(true);
                alert(`메인 포트폴리오 섹션에는 최대 ${MAIN_PORTFOLIO_LIMIT}개까지만 노출할 수 있습니다.\n다른 행사의 노출을 먼저 꺼주세요.`);
                return;
            }

            setForm(prev => ({ ...prev, show_on_main: true }));
        } catch (err: any) {
            alert(err.message || "노출 설정 확인 중 오류가 발생했습니다.");
        }
    };

    // 이미지 상태관리
    const [existingDetail, setExistingDetail] = useState<string[]>(initialData?.detail ?? []);
    const [newDetailFiles, setNewDetailFiles] = useState<File[]>([]);

    useEffect(() => {
        if (initialData) {
            setExistingDetail(initialData.detail || []);
        }
    }, [initialData]);

    const onRemoveExistingImage = (url: string) => {
        setExistingDetail(prev => prev.filter(item => item !== url));
    };

    const onChangeFile = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, files } = e.target;
        if (!files) return;
        if (name === "thumnail") {
            setForm(prev => ({ ...prev, thumnail: files[0] }));
            setErrors(prev => (prev.thumnail ? { ...prev, thumnail: false } : prev));
        }
    };

    const onChangeForm = useCallback((e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: value
        }))
        setErrors(prev => (prev[name as keyof typeof prev] ? { ...prev, [name]: false } : prev));
    }, []);

    const onClickCancel = () => {
        setForm({
            name: initialData?.name ?? "",
            category: initialData?.category ?? "",
            thumnail: null,
            show_on_main: initialData?.show_on_main ?? false,
        });
        setErrors({});
        router.back();
    };

    const onSubmitForm = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();

        const nameInvalid = !form.name.trim();
        const categoryInvalid = !form.category.trim();
        if (nameInvalid || categoryInvalid) {
            setErrors(prev => ({ ...prev, name: nameInvalid, category: categoryInvalid }));
            alert("필수 항목을 입력(등록)해주세요.")
            return;
        }
        setErrors(prev => ({ ...prev, name: false, category: false }));

        if (isUpload && !form.thumnail) {
            setErrors(prev => ({ ...prev, thumnail: true }));
            alert("행사 대표 이미지를 등록해주세요.");
            return;
        }

        if (isEdit && !form.thumnail && !initialData?.thumnail) {
            setErrors(prev => ({ ...prev, thumnail: true }));
            alert("행사 대표 이미지를 등록해주세요.");
            return;
        }

        if (form.thumnail) {
            const ext = form.thumnail.name.split('.').pop()?.toLowerCase() ?? "";
            const allowedExtensions = ["jpg", "jpeg", "png"];

            if (!allowedExtensions.includes(ext)) {
                setErrors(prev => ({ ...prev, thumnail: true }));
                alert("이미지는 JPG, JPEG, PNG 파일만 업로드 가능합니다.");
                return;
            }
        }
        setErrors(prev => ({ ...prev, thumnail: false }));

        for (const file of newDetailFiles) {
            const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
            const allowedExtensions = ["jpg", "jpeg", "png"];
            if (!allowedExtensions.includes(ext)) {
                alert("이미지는 JPG, JPEG, PNG 파일만 업로드 가능합니다.");
                return;
            }
        }

        try {
            let thumnailUrl = initialData?.thumnail ?? "";
            if (form.thumnail) {
                const [uploadedUrl] = await uploadEventImages([form.thumnail], "thumnail");
                thumnailUrl = uploadedUrl;
            }

            const newDetailUrls = await uploadEventImages(newDetailFiles, "detail");

            const payload = {
                name: form.name,
                category: form.category,
                thumnail: thumnailUrl,
                existingDetail,
                detail: newDetailUrls,
                show_on_main: form.show_on_main,
            };

            const res = await fetch(isUpload ? "/api/event" : `/api/event/${id}`, {
                method: isUpload ? "POST" : "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const result = await res.json();

            if (!res.ok) {
                alert(result.error || "행사 등록 실패");
                return;
            }

            alert(result.message);
            // 수정/등록한 행사의 카테고리 목록으로 돌아가, 방금 본 필터가 풀리지 않게 한다.
            router.push(`/admin/event?category=${encodeURIComponent(form.category)}`);
            router.refresh();

        } catch (err: any) {
            alert(err.message);
        }

    }, [form, existingDetail, newDetailFiles, initialData, id, isUpload, router]);

    const onEventDelete = async () => {
        if (!initialData) return;
        if (!confirm("행사를 삭제하시겠습니까?")) return;
        try {
            const res = await fetch(`/api/event/${initialData.id}`, { method: "DELETE" });
            const result = await res.json();
            if (!res.ok) throw new Error(result.error || "삭제 실패");

            alert(result.message);
            router.push(`/admin/event?category=${encodeURIComponent(initialData.category)}`);
            router.refresh();
        } catch (err: any) {
            alert(err.message);
        }
    };

    const goEdit = (id: string) => {
        router.push(`/admin/event/${id}/edit`);
    };

    const fieldGroupClasses = "mb-6.5";
    const labelH4Classes = "text-[0.95rem] text-admin-text mb-1.5";
    const labelSpanClasses = "text-[0.78rem] text-admin-muted";
    const labelPClasses = "text-[0.78rem] text-admin-muted mt-1 mb-2.5";
    const inputBaseClasses = "w-full px-3 py-2.5 border rounded-lg text-[0.88rem]";
    const fileInputBaseClasses = "w-full px-3 py-2.5 border rounded-lg text-[0.82rem] cursor-pointer";
    const borderClass = (hasError?: boolean) => (hasError ? "border-admin-rust" : "border-admin-border");
    const inputClasses = `${inputBaseClasses} ${borderClass()}`;
    const fileInputClasses = `${fileInputBaseClasses} ${borderClass()}`;
    const mainToggleTitle = isDetail
        ? undefined
        : !form.show_on_main && mainLimitReached
            ? `메인 포트폴리오 노출은 최대 ${MAIN_PORTFOLIO_LIMIT}개까지 가능합니다. 노출 개수가 이미 꽉 차 있어 활성화할 수 없습니다.`
            : undefined;

    return (
        <>
            <form onSubmit={onSubmitForm}>
              <div className="flex flex-col items-start mb-6.5 lg:flex-row">
                <div className="flex-1 min-w-0 lg:pr-10">
                <div className={fieldGroupClasses}>
                    <label htmlFor="name">
                        <h4 className={labelH4Classes}>행사명 <span className={labelSpanClasses}>(필수)</span></h4>
                    </label>
                    <input type="text" id="name" name="name" placeholder="행사명을 입력해주세요." onChange={onChangeForm} value={form.name} readOnly={isDetail} className={`${inputBaseClasses} ${borderClass(errors.name)}`} />
                </div>
                <div className={fieldGroupClasses}>
                    <label htmlFor="category">
                        <h4 className={labelH4Classes}>카테고리 <span className={labelSpanClasses}>(필수)</span></h4>
                    </label>
                    <select id="category" name="category" onChange={onChangeForm} value={form.category} disabled={isDetail} className={`${inputBaseClasses} ${borderClass(errors.category)}`}>
                        <option value="">카테고리를 선택해주세요</option>
                        {EVENT_CATEGORIES.map((key) => (
                            <option key={key} value={key}>{CATEGORY_MAP[key]?.title ?? key}</option>
                        ))}
                    </select>
                </div>
                <div className={`${fieldGroupClasses} flex items-center justify-between gap-4 px-4 py-3.5 border border-admin-border rounded-[10px]`} title={mainToggleTitle}>
                    <label htmlFor="show_on_main">
                        <h4 className={labelH4Classes}>화면에 노출</h4>
                        <p className="text-[0.78rem] text-admin-muted mt-1">메인페이지 포트폴리오 섹션에 노출할지 설정합니다.<br/>
                        켜져 있는 행사가 있으면 그 중 최신 등록순으로 최대 9개가 노출되고,<br/>
                        하나도 켜져 있지 않으면 전체 행사 중 최신 등록순 9개가 자동으로 노출됩니다.<br/>
                        최대 9개까지만 노출 설정이 가능합니다.</p>
                        {!form.show_on_main && mainLimitReached && !isDetail && (
                            <p className="text-[0.78rem] text-admin-rust mt-1.5">노출 개수가 꽉 차서 지금은 켤 수 없습니다. 다른 행사의 노출을 먼저 꺼주세요.</p>
                        )}
                    </label>
                    <button
                        type="button"
                        id="show_on_main"
                        role="switch"
                        aria-checked={form.show_on_main}
                        title={mainToggleTitle}
                        className={`shrink-0 w-11 h-6 rounded-full relative cursor-pointer transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-60 ${
                            form.show_on_main ? "bg-[#58C133]" : "bg-[#d7d9dd]"
                        }`}
                        onClick={onToggleShowOnMain}
                        disabled={isDetail}
                    >
                        <span
                            className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.25)] transition-transform duration-200 ${
                                form.show_on_main ? "translate-x-5" : ""
                            }`}
                        />
                    </button>
                </div>
                <div className={fieldGroupClasses}>
                    <label htmlFor="thumnail">
                        <h4 className={labelH4Classes}>대표 이미지 <span className={labelSpanClasses}>(필수)</span></h4>
                        {!isDetail && <p className={labelPClasses}>행사 목록에 보이는 대표 이미지를 등록해주세요.<br/>
                        이미지 크기는 가로 1000px 이상 (세로보다 가로가 긴 이미지) 사이즈를 권장합니다.
                        <br/>세로로 긴 이미지를 업로드하실 경우, 이미지가 잘릴 수 있습니다.</p>}
                    </label>
                    {!isDetail && <input type="file" id="thumnail" name="thumnail" accept=".jpg,.jpeg, .png" onChange={onChangeFile} className={`${fileInputBaseClasses} ${borderClass(errors.thumnail)}`} />}
                    <div>
                        {(isDetail || isEdit) && initialData?.thumnail && !form.thumnail && (
                            <ImageWithSkeleton src={initialData.thumnail} alt="image" width={1000} height={619} className="w-full max-w-105 h-55 rounded-[10px] mt-3" />
                        )}
                    </div>
                </div>
                </div>
                <div className="flex-1 min-w-0 flex flex-col pt-6 border-t border-admin-border lg:pt-0 lg:pl-10 lg:border-t-0 lg:border-l">
                <div className={fieldGroupClasses}>
                    <label htmlFor="detail">
                        <h4 className={labelH4Classes}>상세 이미지 <span className={labelSpanClasses}>(선택)</span></h4>
                        {!isDetail && <p className={labelPClasses}>상세페이지에 노출할 이미지를 여러 장 업로드할 수 있습니다.<br/>
                        이미지 크기는 가로 1000px 이상 (세로보다 가로가 긴 이미지) 사이즈를 권장합니다.
                        <br/>세로로 긴 이미지를 업로드하실 경우, 이미지가 잘릴 수 있습니다. </p>}
                    </label>
                    {!isDetail &&
                        <input
                            type="file"
                            id="detail"
                            name="detail"
                            accept=".jpg,.jpeg,.png"
                            multiple
                            onChange={(e) => setNewDetailFiles(Array.from(e.target.files || []))}
                            className={fileInputClasses}
                        />
                    }
                    <div className="flex flex-wrap justify-between">
                        {existingDetail.map((url, idx) => (
                            <div key={idx} style={{ position: 'relative' }}>
                                <ImageWithSkeleton src={url} alt="image" width={1000} height={619} />
                                {!isDetail && (
                                    <button type="button" onClick={() => onRemoveExistingImage(url)}>
                                        삭제
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                    {isEdit &&
                        <div>
                            <h5>추가 이미지</h5>
                            <div className="flex flex-wrap justify-between">
                                {newDetailFiles.map((file, idx) => (
                                    <div key={`new-${idx}`}>
                                        <ImageWithSkeleton
                                            src={URL.createObjectURL(file)}
                                            alt="새 이미지"
                                            width={1000} height={619}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    }
                </div>
                </div>
              </div>
                {(isUpload || isEdit) && (
                    <div className="flex justify-end gap-2.5 mt-7.5">
                        <button type="submit" className="px-7 py-3 rounded-lg font-bold text-[0.9rem] cursor-pointer bg-admin-dark text-white">{isUpload ? "등록" : "저장"}</button>
                        <button type="button" onClick={onClickCancel} className="px-7 py-3 rounded-lg font-bold text-[0.9rem] cursor-pointer bg-[#eee] text-[#555]">취소</button>
                    </div>
                )}
            </form>
            {isDetail &&
                <div className="flex justify-end gap-2.5 mt-7.5">
                    <button onClick={() => goEdit(String(id))} className="px-7 py-3 rounded-lg font-bold text-[0.9rem] cursor-pointer bg-admin-dark text-white">수정하기</button>
                    <button onClick={onEventDelete} className="px-7 py-3 rounded-lg font-bold text-[0.9rem] cursor-pointer bg-[#eee] text-[#555]">삭제하기</button>
                </div>
            }

        </>
    )
}
