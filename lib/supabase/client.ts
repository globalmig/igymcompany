import { createClient } from "@supabase/supabase-js";

// 브라우저 환경에서 Supabase 클라이언트를 생성하기 위한 함수 / 어디서든 supabase 접근
export const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)