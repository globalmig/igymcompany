"use client";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { ChangeEvent, useCallback, useEffect, useState } from "react"

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
}

interface ProductForm {
    name: string,
    category: string,
    thumnail: File | null,
    intro?: string;
    contents: string[],
    size?: string,
    detail: File[],
}

interface ProductFormProps {
    mode: ProductFormMode; // upload OR edit
    initialData?: InitialDataProps; // edit data (등록된 데이터)
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
        contents: initialData?.contents ?? [""],
        size: initialData?.size ?? "별도 문의",
        detail: []
    });

    useEffect(() => {
        if (initialData) {
            setForm(prev => ({
                ...prev,
                name: initialData.name ?? "",
                category: initialData.category ?? "",
                intro: initialData.intro ?? "",
                contents: initialData.contents ?? [""],
                size: initialData.size ?? "별도 문의",
            }));
        }
    }, [initialData]);

    // 이미지 상태관리
    const [existingDetail, setExistingDetail] = useState<string[]>(initialData?.detail ?? []);
    const [newDetailFiles, setNewDetailFiles] = useState<File[]>([]);

    // initialData가 들어올 때 기존 이미지 주소 세팅
    useEffect(() => {
        if (initialData) {
            setExistingDetail(initialData.detail || []);
            
        }
    }, [initialData]);

    // 이미지 삭제 (기존 이미지 중 삭제)
    const onRemoveExistingImage = (url: string) => {
        setExistingDetail(prev => prev.filter(item => item !== url));
    };

    const onChangeFile = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, files } = e.target;
        if (!files) return;
        if (name === "thumnail") {
            setForm(prev => ({ ...prev, thumnail: files[0] }));
        }
        if (name === "detail") {
            setForm(prev => ({ ...prev, detail: Array.from(files) }));
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
    }, []);

    // 취소
    const onClickCancel = () => {
        setForm({
            name: initialData?.name ?? "",
            category: initialData?.category ?? "",
            thumnail: null,
            intro: initialData?.intro ?? "",
            contents: initialData?.contents ?? [""],
            size: initialData?.size ?? "별도 문의",
            detail: []
        });
        router.back();
    };

    // 등록&수정
    const onSubmitForm = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();

        // 유효성 검증
        if (!form.name.trim() ||
            !form.category.trim() ||
            form.contents.length === 0
        ) {
            alert("필수 항목을 입력(등록)해주세요.")
            return;
        }

        if (isUpload && !form.thumnail) {
            alert("상품 섬네일을 등록해주세요.");
            return;
        }

        if (isEdit && !form.thumnail && !initialData?.thumnail) {
            alert("상품 섬네일을 등록해주세요.");
            return;
        }

        if (form.thumnail) {
            const ext = form.thumnail.name.split('.').pop()?.toLowerCase() ?? "";
            const allowedExtensions = ["jpg", "jpeg", "png"];

            if (!allowedExtensions.includes(ext)) {
                alert("이미지는 JPG, JPEG, PNG 파일만 업로드 가능합니다.");
                return;
            }
        }

        // 상세 이미지 유효성 검사
        // newDetailFiles: 새로 input으로 넣은 파일 배열 / existingDetail: 화면에 표시되고 있는 기존 URL 배열
        if (newDetailFiles.length === 0 && existingDetail.length === 0) {
            alert("상품 상세 이미지는 최소 1장 이상 등록해주세요.");
            return;
        }

        for (const file of form.detail) {
            const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
            const allowedExtensions = ["jpg", "jpeg", "png"];
            if (!allowedExtensions.includes(ext)) {
                alert("이미지는 JPG, JPEG, PNG 파일만 업로드 가능합니다.");
                return;
            }
        }

        const formData = new FormData();
        formData.append("name", form.name);
        formData.append("category", form.category);
        formData.append("intro", form.intro || "");
        formData.append("size", form.size || "");
        formData.append("contents", JSON.stringify(form.contents));

        if (form.thumnail) {
            // 사용자가 파일을 새로 선택한 경우
            formData.append("thumnail", form.thumnail);
        } else if (initialData?.thumnail) {
            // 파일을 선택하지 않았지만 기존 데이터가 있는 경우 (수정 시 유지)
            formData.append("thumnail", initialData.thumnail);
        }

        // 상세 이미지 처리
        formData.append("existingDetail", JSON.stringify(existingDetail));
        // 새로 추가할 파일들 전송
        newDetailFiles.forEach((file) => {
            formData.append("detail", file);
        });

        try {
            const res = await fetch(isUpload ? "/api/product" : `/api/product/${id}`, {
                method: isUpload ? "POST" : "PATCH",
                body: formData,
            });

            const result = await res.json();

            if (!res.ok) {
                alert(result.error || "상품 등록 실패");
                return;
            }

            alert(result.message);
            router.push("/admin");
            router.refresh();

        } catch (err: any) {
            alert(err.message);
        }

    }, [form, existingDetail, newDetailFiles, initialData, id, isUpload, router]);

    // 삭제
    const onProductDelete = async () => {
        if (!initialData) return;
        if (!confirm("상품을 삭제하시겠습니까?")) return;
        try {
            const res = await fetch(`/api/product/${initialData.id}`, { method: "DELETE" });
            const result = await res.json();
            if (!res.ok) throw new Error(result.error || "삭제 실패");

            alert(result.message);
            router.push("/admin");
            router.refresh();
        } catch (err: any) {
            alert(err.message);
        }
    };

    const goEdit = (id: string) => {
        router.push(`/admin/product/${id}/edit`);
    };

    return (
        <>
            <form onSubmit={onSubmitForm}>
                <div className="fm-name">
                    <label htmlFor="name">
                        <h4>상품명 <span>(필수)</span></h4>
                    </label>
                    <input type="text" id="name" name="name" placeholder="상품명을 입력해주세요." onChange={onChangeForm} value={form.name} readOnly={isDetail} />
                </div>
                <div className="fm-category">
                    <label htmlFor="category">
                        <h4>카테고리 <span>(필수)</span></h4>
                    </label>
                    <select id="category" name="category" onChange={onChangeForm} value={form.category} disabled={isDetail}>
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
                <div className="fm-thumnail">
                    <label htmlFor="thumnail">
                        <h4>상품 대표 이미지 <span>(필수)</span></h4>
                        {!isDetail && <p>상품의 대표 이미지를 등록해주세요.<br/>
                        이미지 크기는 가로 1000px 이상 (세로보다 가로가 긴 이미지) 사이즈를 권장합니다.
                        <br/>세로로 긴 이미지를 업로드하실 경우, 이미지가 잘릴 수 있습니다.</p>}
                    </label>
                    {!isDetail && <input type="file" id="thumnail" name="thumnail" accept=".jpg,.jpeg, .png" onChange={onChangeFile} />}
                    <div className="fm-thumnail-img">
                        {(isDetail || isEdit) && initialData?.thumnail && !form.thumnail && (
                            <Image src={initialData.thumnail} alt="image" width={1000} height={619} />

                        )}
                    </div>
                </div>
                <div className="fm-intro">
                    <label htmlFor="intro">
                        <h4>상품 소개 <span>(선택)</span></h4>
                        {!isDetail && <p>상품 목록 페이지에 보이는 간단한 상품 소개입니다.</p>}
                    </label>
                    <input type="text" id="intro" name="intro" placeholder="상품소개를 입력해주세요." onChange={onChangeForm} value={form.intro} readOnly={isDetail} />
                </div>
                <div className="fm-contents">
                    <label htmlFor="contents">
                        <h4>상품 상세 설명 <span>(선택)</span></h4>
                        {!isDetail && <p>상품 상세 페이지에 적용될 상품 상세 설명입니다.</p>}
                    </label>
                    {form.contents.map((text, index) => (
                        <div key={index}>
                            <textarea
                                rows={5}
                                placeholder={`상품설명을 입력해주세요.`}
                                value={text}
                                onChange={(e) => {
                                    const newContents = [...form.contents];
                                    newContents[index] = e.target.value;
                                    setForm({ ...form, contents: newContents });
                                }}
                                readOnly={isDetail}
                            />
                            {!isDetail &&
                                <div>
                                    {form.contents.length > 1 && (
                                        <button type="button" className="fm-contents-delete"
                                            onClick={() => {
                                                const newContents = form.contents.filter((_, i) => i !== index);
                                                setForm({ ...form, contents: newContents });
                                            }}
                                        >
                                            삭제
                                        </button>
                                    )}
                                    <button type="button" className="fm-contents-add"
                                        onClick={() => setForm({
                                            ...form,
                                            contents: [...form.contents, ""],
                                        })}>
                                        추가
                                    </button>
                                </div>
                            }
                        </div>
                    ))}
                </div>
                <div className="fm-size">
                    <label htmlFor="size">
                        <h4>사이즈 <span>(선택)</span></h4>
                        {!isDetail && <p>사이즈 미입력 시, 별도 문의로 표시됩니다.</p>}
                    </label>
                    <input type="text" id="size" name="size" placeholder={form.size} onChange={onChangeForm} value={form.size} readOnly={isDetail} />
                </div>
                <div className="fm-detail">
                    <label htmlFor="detail">
                        <h4>상품 상세 이미지 <span>(필수)</span></h4>
                        {!isDetail && <p>상품 상세 이미지를 여러 장 업로드할 수 있습니다.<br/>
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
                        />
                    }
                    <div className="display-flex-flow">
                        {existingDetail.map((url, idx) => (
                            <div key={idx} style={{ position: 'relative' }}>
                                <Image src={url} alt="image" width={1000} height={619} />
                                {!isDetail && (
                                    <button type="button" onClick={() => onRemoveExistingImage(url)}>
                                        삭제
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                    {isEdit &&
                        <div className="fm-detail-add">
                            <h5>추가 이미지</h5>
                            <div className="display-flex-flow">
                                {newDetailFiles.map((file, idx) => (
                                    <div key={`new-${idx}`}>
                                        <Image
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
                {(isUpload || isEdit) && (
                    <div className="display-flex">
                        <button type="submit">{isUpload ? "등록" : "수정"}</button>
                        <button type="button" onClick={onClickCancel}>취소</button>
                    </div>
                )}
            </form>
            {isDetail &&
                <div className="display-flex fm-detail-btn">
                    <button onClick={() => goEdit(String(id))}>수정</button>
                    <button onClick={onProductDelete}>삭제</button>
                </div>
            }

        </>
    )
}