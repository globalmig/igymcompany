interface PaginationProps {
    dataPerPage: number;
    totalCount: number;      // 전체 데이터 개수
    currentPage: number;     // 현재 선택된 페이지
    onPageChange: (page: number) => void; // 페이지 변경 시 실행할 함수
    variant?: "public" | "admin";
}

export default function Pagination({ dataPerPage, totalCount, currentPage, onPageChange, variant = "public" }: PaginationProps) {

    const pageCount = Math.ceil(totalCount / dataPerPage);

    // 페이지 그룹 관리
    const groupSize = 5;
    const groupStartPage = Math.floor((currentPage - 1) / groupSize) * groupSize + 1;

    const pages = Array.from(
        { length: groupSize },
        (_, index) => index + groupStartPage
    ).filter(page => page <= pageCount);

    if (variant === "admin") {
        const adminButtonClasses = "rounded-md px-3 py-1.5 text-[0.85rem] text-admin-muted cursor-pointer disabled:cursor-default disabled:opacity-40";

        return (
            <div className="mt-7.5 flex justify-center gap-1.5">
                <button
                    className={adminButtonClasses}
                    onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                >이전</button>

                <div className="flex gap-1">
                    {pages.map((page) => (
                        <button
                            key={page}
                            onClick={() => onPageChange(page)}
                            className={`${adminButtonClasses} ${currentPage === page ? "bg-admin-dark text-white" : ""}`}
                        >
                            {page}
                        </button>
                    ))}
                </div>

                <button
                    className={adminButtonClasses}
                    onClick={() => onPageChange(Math.min(pageCount, currentPage + 1))}
                    disabled={currentPage === pageCount}
                >다음</button>
            </div>
        );
    }

    const navButtonClasses = "cursor-pointer rounded-[5px] bg-[#eee] px-2.5 py-1.25 text-[#555] hover:bg-[#aaa] xl:px-5 xl:text-base";

    return (
        <div className="mt-12.5 flex justify-between xl:mt-17.5">
            <button
                className={navButtonClasses}
                onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
            >이전</button>

            <div>
                {pages.map((page) => (
                    <button
                        key={page}
                        onClick={() => onPageChange(page)}
                        className={`h-7.5 w-7.5 cursor-pointer rounded-full xl:h-10 xl:w-10 xl:text-base ${
                            currentPage === page ? "bg-black text-white" : ""
                        }`}
                    >
                        {page}
                    </button>
                ))}
            </div>

            <button
                className={navButtonClasses}
                onClick={() => onPageChange(Math.min(pageCount, currentPage + 1))}
                disabled={currentPage === pageCount}
            >다음</button>
        </div>
    );
}
