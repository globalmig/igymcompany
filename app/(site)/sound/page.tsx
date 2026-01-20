import { supabase } from "@/lib/supabase/client";
import { redirect} from "next/navigation";

export default async function SoundPage() {

   const { data: product } = await supabase
        .from("products")
        .select("id")
        .eq("category", "sound")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

    if (product) {
        redirect(`/sound/${product.id}`);
    }

}
