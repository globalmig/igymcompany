"use client";
import { useParams, useRouter } from "next/navigation";
import { ChangeEvent, DragEvent, useCallback, useEffect, useRef, useState } from "react"
import { uploadProductImages } from "@/lib/supabase/upload";
import { DetailBlock, parseDetailBlocks } from "@/lib/product/detailBlocks";
import { supabase } from "@/lib/supabase/client";
import ImageWithSkeleton from "@/components/admin/common/ImageWithSkeleton";

const MAIN_PREVIEW_LIMIT = 4;

type ProductFormMode = "upload" | "edit" | "detail";

interface InitialDataProps {
    id: string;
    name: string;
    category: string;
    thumnail: string;
    intro?: string;
    contents: string[];
    size?: string;
    detail: string[];
    show_on_main?: boolean;
}

interface ProductForm {
    name: string,
    category: string,
    thumnail: File | null,
    intro?: string;
    size?: string,
    show_on_main: boolean,
}

interface ProductFormProps {
    mode: ProductFormMode; // upload OR edit
    initialData?: InitialDataProps; // edit data (등록된 데이터)
}

// 상세페이지 콘텐츠 블록(텍스트/이미지) 편집용 로컬 상태 타입.
// 저장 시 DetailBlock 형태로 변환되어 서버로 전송된다.
type EditableBlock =
    | { id: string; type: "text"; text: string }
    | { id: string; type: "image"; url: string; file: File | null };

let blockIdSeq = 0;
function createBlockId() {
    blockIdSeq += 1;
    return `blk-${Date.now()}-${blockIdSeq}`;
}

function toEditableBlocks(detail: string[], contents: string[]): EditableBlock[] {
    return parseDetailBlocks(detail, contents).map((block) =>
        block.type === "text"
            ? { id: createBlockId(), type: "text", text: block.text }
            : { id: createBlockId(), type: "image", url: block.url, file: null }
    );
}

export default function ProductForm({ mode, initialData }: ProductFormProps) {

    const router = useRouter();
    const { id } = useParams();

    const isDetail = mode === "detail";
    const isUpload = mode === "upload";
    const isEdit = mode === "edit";

    const [form, setForm] = useState<ProductForm>({
        name: initialData?.name ?? "",
        category: initialData?.category ?? "",
        thumnail: null,
        intro: initialData?.intro ?? "",
        size: initialData?.size ?? "별도 문의",
        show_on_main: initialData?.show_on_main ?? false,
    });

    useEffect(() => {
        if (initialData) {
            setForm(prev => ({
                ...prev,
                name: initialData.name ?? "",
                category: initialData.category ?? "",
                intro: initialData.intro ?? "",
                size: initialData.size ?? "별도 문의",
                show_on_main: initialData.show_on_main ?? false,
            }));
        }
    }, [initialData]);

    // 필수 입력값 검증 실패 시, 해당 입력 필드 테두리를 강조 표시하기 위한 상태
    const [errors, setErrors] = useState<{ name?: boolean; category?: boolean; thumnail?: boolean }>({});
    const [detailError, setDetailError] = useState(false);
    const [blockErrors, setBlockErrors] = useState<Set<string>>(new Set());

    // 같은 카테고리에서 메인 노출 개수가 이미 최대치인지 미리 확인해, 토글에 마우스를 올렸을 때 이유를 안내한다.
    const [mainLimitReached, setMainLimitReached] = useState(false);

    const checkMainLimit = useCallback(async () => {
        if (!form.category) {
            setMainLimitReached(false);
            return;
        }
        try {
            let query = supabase
                .from("products")
                .select("id", { count: "exact", head: true })
                .eq("category", form.category)
                .eq("show_on_main", true);

            if (initialData?.id) {
                query = query.neq("id", initialData.id);
            }

            const { count, error } = await query;
            if (error) throw error;

            setMainLimitReached((count ?? 0) >= MAIN_PREVIEW_LIMIT);
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
                .from("products")
                .select("id", { count: "exact", head: true })
                .eq("category", form.category)
                .eq("show_on_main", true);

            if (initialData?.id) {
                query = query.neq("id", initialData.id);
            }

            const { count, error } = await query;
            if (error) throw error;

            if ((count ?? 0) >= MAIN_PREVIEW_LIMIT) {
                setMainLimitReached(true);
                alert(`메인 PRODUCT PREVIEW 섹션에는 카테고리당 최대 ${MAIN_PREVIEW_LIMIT}개까지만 노출할 수 있습니다.\n다른 상품의 노출을 먼저 꺼주세요.`);
                return;
            }

            setForm(prev => ({ ...prev, show_on_main: true }));
        } catch (err: any) {
            alert(err.message || "노출 설정 확인 중 오류가 발생했습니다.");
        }
    };

    // 상세페이지 콘텐츠 블록(텍스트/이미지) 상태관리 — 자유로운 순서 변경/추가/삭제/이미지 교체 지원
    const [blocks, setBlocks] = useState<EditableBlock[]>(
        () => toEditableBlocks(initialData?.detail ?? [], initialData?.contents ?? [])
    );

    useEffect(() => {
        if (initialData) {
            setBlocks(toEditableBlocks(initialData.detail ?? [], initialData.contents ?? []));
        }
    }, [initialData]);

    const dragIndexRef = useRef<number | null>(null);

    const addTextBlock = () => {
        setBlocks(prev => [...prev, { id: createBlockId(), type: "text", text: "" }]);
    };

    const addImageBlock = () => {
        setBlocks(prev => [...prev, { id: createBlockId(), type: "image", url: "", file: null }]);
        setDetailError(false);
    };

    const removeBlock = (blockId: string) => {
        setBlocks(prev => prev.filter(b => b.id !== blockId));
        setBlockErrors(prev => {
            if (!prev.has(blockId)) return prev;
            const next = new Set(prev);
            next.delete(blockId);
            return next;
        });
    };

    const moveBlock = (index: number, direction: -1 | 1) => {
        setBlocks(prev => {
            const target = index + direction;
            if (target < 0 || target >= prev.length) return prev;
            const next = [...prev];
            [next[index], next[target]] = [next[target], next[index]];
            return next;
        });
    };

    const clearBlockError = (blockId: string) => {
        setBlockErrors(prev => {
            if (!prev.has(blockId)) return prev;
            const next = new Set(prev);
            next.delete(blockId);
            return next;
        });
    };

    const updateBlockText = (blockId: string, text: string) => {
        setBlocks(prev => prev.map(b => (b.id === blockId && b.type === "text" ? { ...b, text } : b)));
        if (text.trim()) clearBlockError(blockId);
    };

    const updateBlockImage = (blockId: string, file: File | null) => {
        setBlocks(prev => prev.map(b => (b.id === blockId && b.type === "image" ? { ...b, file } : b)));
        if (file) {
            clearBlockError(blockId);
            setDetailError(false);
        }
    };

    const onDragStartBlock = (index: number) => {
        dragIndexRef.current = index;
    };

    const onDragOverBlock = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    const onDropBlock = (index: number) => {
        const from = dragIndexRef.current;
        dragIndexRef.current = null;
        if (from === null || from === index) return;
        setBlocks(prev => {
            const next = [...prev];
            const [moved] = next.splice(from, 1);
            next.splice(index, 0, moved);
            return next;
        });
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
        const { name, value, type } = e.target;

        if (type === "file") {
            const fileInput = e.target as HTMLInputElement;
            const file = fileInput.files?.[0] ?? null;
            setForm(prev => ({ ...prev, file }));
            return;
        }
        setForm(prev => ({
            ...prev,
            [name]: value
        }))
        setErrors(prev => (prev[name as keyof typeof prev] ? { ...prev, [name]: false } : prev));
    }, []);

    // 취소
    const onClickCancel = () => {
        setForm({
            name: initialData?.name ?? "",
            category: initialData?.category ?? "",
            thumnail: null,
            intro: initialData?.intro ?? "",
            size: initialData?.size ?? "별도 문의",
            show_on_main: initialData?.show_on_main ?? false,
        });
        setBlocks(toEditableBlocks(initialData?.detail ?? [], initialData?.contents ?? []));
        setErrors({});
        setDetailError(false);
        setBlockErrors(new Set());
        router.back();
    };

    // 등록&수정
    const onSubmitForm = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();

        // 유효성 검증
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
            alert("상품 섬네일을 등록해주세요.");
            return;
        }

        if (isEdit && !form.thumnail && !initialData?.thumnail) {
            setErrors(prev => ({ ...prev, thumnail: true }));
            alert("상품 섬네일을 등록해주세요.");
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

        // 상세 콘텐츠 유효성 검사
        const hasImageBlock = blocks.some(b => b.type === "image");
        if (!hasImageBlock) {
            setDetailError(true);
            alert("상품 상세 이미지는 최소 1장 이상 등록해주세요.");
            return;
        }
        setDetailError(false);

        const invalidBlockIds = new Set<string>();
        let blockErrorMessage = "";
        for (const block of blocks) {
            if (block.type === "text") {
                if (!block.text.trim()) {
                    invalidBlockIds.add(block.id);
                    if (!blockErrorMessage) blockErrorMessage = "비어있는 텍스트 블록이 있습니다. 내용을 입력하거나 삭제해주세요.";
                }
                continue;
            }
            if (!block.url && !block.file) {
                invalidBlockIds.add(block.id);
                if (!blockErrorMessage) blockErrorMessage = "비어있는 이미지 블록이 있습니다. 이미지를 선택하거나 삭제해주세요.";
                continue;
            }
            if (block.file) {
                const ext = block.file.name.split(".").pop()?.toLowerCase() ?? "";
                const allowedExtensions = ["jpg", "jpeg", "png"];
                if (!allowedExtensions.includes(ext)) {
                    invalidBlockIds.add(block.id);
                    if (!blockErrorMessage) blockErrorMessage = "이미지는 JPG, JPEG, PNG 파일만 업로드 가능합니다.";
                }
            }
        }
        if (invalidBlockIds.size > 0) {
            setBlockErrors(invalidBlockIds);
            alert(blockErrorMessage);
            return;
        }
        setBlockErrors(new Set());

        try {
            // 이미지는 Vercel 서버리스 함수를 거치지 않고 Supabase Storage로 직접 업로드한다.
            // (대용량 이미지가 API 요청 본문 크기 제한(413)에 걸리는 문제 방지)
            let thumnailUrl = initialData?.thumnail ?? "";
            if (form.thumnail) {
                const [uploadedUrl] = await uploadProductImages([form.thumnail], "thumnail");
                thumnailUrl = uploadedUrl;
            }

            // 새로 선택되었거나 교체된 이미지 블록만 업로드하고, 순서는 그대로 유지한다.
            const pendingFiles = blocks
                .filter((b): b is Extract<EditableBlock, { type: "image" }> => b.type === "image" && !!b.file)
                .map(b => b.file as File);
            const uploadedUrls = await uploadProductImages(pendingFiles, "detail");

            let uploadCursor = 0;
            const finalDetail: DetailBlock[] = blocks.map((b) => {
                if (b.type === "text") return { type: "text", text: b.text };
                const url = b.file ? uploadedUrls[uploadCursor++] : b.url;
                return { type: "image", url };
            });

            const payload = {
                name: form.name,
                category: form.category,
                intro: form.intro || "",
                size: form.size || "",
                thumnail: thumnailUrl,
                detail: finalDetail,
                show_on_main: form.show_on_main,
            };

            const res = await fetch(isUpload ? "/api/product" : `/api/product/${id}`, {
                method: isUpload ? "POST" : "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const result = await res.json();

            if (!res.ok) {
                alert(result.error || "상품 등록 실패");
                return;
            }

            alert(result.message);
            // 수정/등록한 상품의 카테고리 목록으로 돌아가, 방금 본 필터가 풀리지 않게 한다.
            router.push(`/admin?category=${encodeURIComponent(form.category)}`);
            router.refresh();

        } catch (err: any) {
            alert(err.message);
        }

    }, [form, blocks, initialData, id, isUpload, isEdit, router]);

    // 삭제
    const onProductDelete = async () => {
        if (!initialData) return;
        if (!confirm("상품을 삭제하시겠습니까?")) return;
        try {
            const res = await fetch(`/api/product/${initialData.id}`, { method: "DELETE" });
            const result = await res.json();
            if (!res.ok) throw new Error(result.error || "삭제 실패");

            alert(result.message);
            router.push(`/admin?category=${encodeURIComponent(initialData.category)}`);
            router.refresh();
        } catch (err: any) {
            alert(err.message);
        }
    };

    const goEdit = (id: string) => {
        router.push(`/admin/product/${id}/edit`);
    };

    const fieldGroupClasses = "mb-6.5";
    const labelH4Classes = "text-[0.95rem] text-admin-text mb-1.5";
    const labelSpanClasses = "text-[0.78rem] text-admin-muted";
    const labelPClasses = "text-[0.78rem] text-admin-muted mt-1 mb-2.5";
    const inputBaseClasses = "w-full px-3 py-2.5 border rounded-lg text-[0.88rem]";
    const fileInputBaseClasses = "w-full px-3 py-2.5 border rounded-lg text-[0.82rem] cursor-pointer";
    const borderClass = (hasError?: boolean) => (hasError ? "border-admin-rust" : "border-admin-border");
    const inputClasses = `${inputBaseClasses} ${borderClass()}`;
    const mainToggleTitle = isDetail
        ? undefined
        : !form.category
            ? "먼저 카테고리를 선택해주세요."
            : !form.show_on_main && mainLimitReached
                ? `카테고리당 최대 ${MAIN_PREVIEW_LIMIT}개까지만 노출 설정이 가능합니다.`
                : undefined;

    return (
        <>
            <form onSubmit={onSubmitForm}>
              <div className="flex flex-col items-start mb-6.5 lg:flex-row">
                <div className="flex-1 min-w-0 lg:pr-10">
                <div className={fieldGroupClasses}>
                    <label htmlFor="name">
                        <h4 className={labelH4Classes}>상품명 <span className={labelSpanClasses}>(필수)</span></h4>
                    </label>
                    <input type="text" id="name" name="name" placeholder="상품명을 입력해주세요." onChange={onChangeForm} value={form.name} readOnly={isDetail} className={`${inputBaseClasses} ${borderClass(errors.name)}`} />
                </div>
                <div className={fieldGroupClasses}>
                    <label htmlFor="category">
                        <h4 className={labelH4Classes}>카테고리 <span className={labelSpanClasses}>(필수)</span></h4>
                    </label>
                    <select id="category" name="category" onChange={onChangeForm} value={form.category} disabled={isDetail} className={`${inputBaseClasses} ${borderClass(errors.category)}`}>
                        <option value="">카테고리를 선택해주세요</option>
                        <option value="truss">트러스/조립식무대</option>
                        <option value="sound">음향시스템</option>
                        <option value="airbounce">에어바운스</option>
                        <option value="waterslide">워터슬라이드</option>
                        <option value="rental">천막/테이블/의자/행사용품</option>
                        <option value="amusement">놀이기구</option>
                        <option value="experience">체험놀이</option>
                    </select>
                </div>
                <div className={`${fieldGroupClasses} flex items-center justify-between gap-4 px-4 py-3.5 border border-admin-border rounded-[10px]`} title={mainToggleTitle}>
                    <label htmlFor="show_on_main">
                        <h4 className={labelH4Classes}>화면에 노출</h4>
                        <p className="text-[0.78rem] text-admin-muted mt-1">메인페이지 PRODUCT PREVIEW 섹션에 노출할지 설정합니다.<br/>
                        같은 카테고리에서 켜져 있는 상품이 있으면 그 중 최대 {MAIN_PREVIEW_LIMIT}개가 노출되고,<br/>
                        하나도 켜져 있지 않으면 해당 카테고리 상품 중 최대 {MAIN_PREVIEW_LIMIT}개가 자동으로 노출됩니다.<br/>
                        </p>
                        {!form.show_on_main && mainLimitReached && !isDetail && form.category && (
                            <p className="text-[0.78rem] text-admin-rust mt-1.5">카테고리당 최대 ${MAIN_PREVIEW_LIMIT}개까지만 노출 설정이 가능합니다.</p>
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
                        disabled={isDetail || !form.category}
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
                        <h4 className={labelH4Classes}>상품 대표 이미지 <span className={labelSpanClasses}>(필수)</span></h4>
                        {!isDetail && <p className={labelPClasses}>상품의 대표 이미지를 등록해주세요.<br/>
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
                <div className={fieldGroupClasses}>
                    <label htmlFor="intro">
                        <h4 className={labelH4Classes}>상품 소개 <span className={labelSpanClasses}>(선택)</span></h4>
                        {!isDetail && <p className={labelPClasses}>상품 목록 페이지에 보이는 간단한 상품 소개입니다.</p>}
                    </label>
                    <input type="text" id="intro" name="intro" placeholder="상품소개를 입력해주세요." onChange={onChangeForm} value={form.intro} readOnly={isDetail} className={inputClasses} />
                </div>
                <div className={fieldGroupClasses}>
                    <label htmlFor="size">
                        <h4 className={labelH4Classes}>사이즈 <span className={labelSpanClasses}>(선택)</span></h4>
                        {!isDetail && <p className={labelPClasses}>사이즈 미입력 시, 별도 문의로 표시됩니다.</p>}
                    </label>
                    <input type="text" id="size" name="size" placeholder={form.size} onChange={onChangeForm} value={form.size} readOnly={isDetail} className={inputClasses} />
                </div>
                </div>
                <div className="flex-1 min-w-0 flex flex-col pt-6 border-t border-admin-border lg:pt-0 lg:pl-10 lg:border-t-0 lg:border-l">
                    <label htmlFor="blocks">
                        <h4 className={labelH4Classes}>상품 상세페이지 콘텐츠 <span className={labelSpanClasses}>(필수)</span></h4>
                        {!isDetail && <p className={labelPClasses}>
                            텍스트와 이미지를 자유롭게 추가하고, 드래그하거나 ▲▼ 버튼으로 순서를 바꿀 수 있습니다.<br/>
                            텍스트는 항상 가운데 정렬로 표시됩니다. 이미지 크기는 가로 1000px 이상 권장합니다.
                        </p>}
                    </label>

                    {!isDetail &&
                        <div className="flex gap-2 mb-3.5">
                            <button type="button" onClick={addTextBlock} className="px-3.5 py-2 rounded-md text-[0.82rem] font-semibold cursor-pointer bg-admin-dark text-white">+ 텍스트 추가</button>
                            <button type="button" onClick={addImageBlock} className="px-3.5 py-2 rounded-md text-[0.82rem] font-semibold cursor-pointer bg-admin-dark text-white">+ 이미지 추가</button>
                        </div>
                    }

                    {detailError && (
                        <p className="text-[0.78rem] text-admin-rust mb-2.5">상품 상세 이미지는 최소 1장 이상 등록해주세요.</p>
                    )}

                    {blocks.length === 0 && !isDetail && (
                        <p className={`text-[0.82rem] p-5 text-center border border-dashed rounded-[10px] ${detailError ? "text-admin-rust border-admin-rust" : "text-admin-muted border-admin-border"}`}>추가된 콘텐츠가 없습니다. 텍스트 또는 이미지를 추가해주세요.</p>
                    )}

                    <div className="flex flex-col gap-3">
                        {blocks.map((block, index) => (
                            <div
                                key={block.id}
                                className={`border rounded-[10px] p-3.5 cursor-grab bg-[#fafafa] ${borderClass(blockErrors.has(block.id))}`}
                                draggable={!isDetail}
                                onDragStart={() => onDragStartBlock(index)}
                                onDragOver={onDragOverBlock}
                                onDrop={() => onDropBlock(index)}
                            >
                                <div className="flex items-center justify-between mb-2.5">
                                    <span className="text-[0.78rem] font-bold text-admin-muted">{block.type === "text" ? "텍스트" : "이미지"}</span>
                                    {!isDetail && (
                                        <div className="flex gap-1.5">
                                            <button type="button" onClick={() => moveBlock(index, -1)} disabled={index === 0} className="px-2.5 py-1 rounded-md text-[0.78rem] cursor-pointer bg-[#eee] text-[#555] disabled:opacity-40 disabled:cursor-default">▲</button>
                                            <button type="button" onClick={() => moveBlock(index, 1)} disabled={index === blocks.length - 1} className="px-2.5 py-1 rounded-md text-[0.78rem] cursor-pointer bg-[#eee] text-[#555] disabled:opacity-40 disabled:cursor-default">▼</button>
                                            <button type="button" onClick={() => removeBlock(block.id)} className="px-2.5 py-1 rounded-md text-[0.78rem] cursor-pointer bg-[#fdecec] text-[#c0392b]">삭제</button>
                                        </div>
                                    )}
                                </div>

                                {block.type === "text" ? (
                                    <textarea
                                        rows={4}
                                        placeholder="내용을 입력해주세요. (가운데 정렬로 표시됩니다)"
                                        value={block.text}
                                        onChange={(e) => updateBlockText(block.id, e.target.value)}
                                        readOnly={isDetail}
                                        className={`${inputClasses} bg-white`}
                                    />
                                ) : (
                                    <div>
                                        {block.file ? (
                                            <ImageWithSkeleton src={URL.createObjectURL(block.file)} alt="상세 이미지" width={1000} height={619} className="w-full max-w-105 h-55 rounded-lg block mb-2.5 max-[900px]:max-w-full" />
                                        ) : block.url ? (
                                            <ImageWithSkeleton src={block.url} alt="상세 이미지" width={1000} height={619} className="w-full max-w-105 h-55 rounded-lg block mb-2.5 max-[900px]:max-w-full" />
                                        ) : (
                                            <div className="w-full max-w-105 h-30 flex items-center justify-center border border-dashed border-admin-border rounded-lg text-[0.8rem] text-admin-muted mb-2.5 max-[900px]:max-w-full">이미지를 선택해주세요</div>
                                        )}
                                        {!isDetail && (
                                            <input
                                                type="file"
                                                accept=".jpg,.jpeg,.png"
                                                onChange={(e) => updateBlockImage(block.id, e.target.files?.[0] ?? null)}
                                                className={`${fileInputBaseClasses} ${borderClass(blockErrors.has(block.id))}`}
                                            />
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
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
                    <button onClick={onProductDelete} className="px-7 py-3 rounded-lg font-bold text-[0.9rem] cursor-pointer bg-[#eee] text-[#555]">삭제하기</button>
                </div>
            }

        </>
    )
}
