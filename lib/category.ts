import { CATEGORY_MAP } from "@/data/category";

// 메인메뉴에 사용되는 카테고리 분리
export const MENU_EXCLUDE_KEYS = ["about", "inquire"] as const;

export const MENU_CATEGORIES = Object.entries(CATEGORY_MAP)
    .filter(([key]) => !MENU_EXCLUDE_KEYS.includes(key as any))
    .map(([key, value]) => ({
        key,
        ...value,
    }));
