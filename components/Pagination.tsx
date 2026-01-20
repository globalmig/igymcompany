interface PaginationProps {
    dataPerPage: number;
    totalCount: number;      // 전체 데이터 개수
    currentPage: number;     // 현재 선택된 페이지
    onPageChange: (page: number) => void; // 페이지 변경 시 실행할 함수
}

export default function Pagination({ dataPerPage, totalCount, currentPage, onPageChange }: PaginationProps) {
    
    const pageCount = Math.ceil(totalCount / dataPerPage);
    
    // 페이지 그룹 관리
    const groupSize = 5;
    const groupStartPage = Math.floor((currentPage - 1) / groupSize) * groupSize + 1;

    const pages = Array.from(
        { length: groupSize },
        (_, index) => index + groupStartPage
    ).filter(page => page <= pageCount);

    return (
        <div className="pagination display-flex">
            <button 
                onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
            >이전</button>
            
            <div>
                {pages.map((page) => (
                    <button
                        key={page}
                        onClick={() => onPageChange(page)}
                        className={currentPage === page ? "select" : ""}
                    >
                        {page}
                    </button>
                ))}
            </div>

            <button 
                onClick={() => onPageChange(Math.min(pageCount, currentPage + 1))}
                disabled={currentPage === pageCount}
            >다음</button>
        </div>
    );
}