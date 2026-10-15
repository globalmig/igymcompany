"use client"
import EventForm from "@/components/admin/events/EventForm";
import { supabase } from "@/lib/supabase/client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

interface InitialDataProps {
    id: string;
    name: string;
    category: string;
    thumnail: string;
    detail: string[];
    show_on_main?: boolean;
}

export default function EventEditPage() {
    const { id } = useParams();
    const [initialData, setInitialData] = useState<InitialDataProps | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;

        const fetchEvent = async () => {
            setLoading(true);
            try {
                const { data, error } = await supabase
                    .from("events")
                    .select("*")
                    .eq("id", id)
                    .single();

                if (error) throw error;
                if (!data) throw new Error("행사를 찾을 수 없습니다.");

                const formattedData: InitialDataProps = {
                    id: String(data.id),
                    name: data.name,
                    category: data.category,
                    thumnail: data.thumnail,
                    detail: data.detail ?? [],
                    show_on_main: data.show_on_main ?? false,
                };

                setInitialData(formattedData);
            } catch (err: any) {
                console.error("행사 조회 실패:", err);
                alert("행사 조회 중 오류가 발생했습니다.");
            } finally {
                setLoading(false);
            }
        };

        fetchEvent();
    }, [id]);

    if (loading) return <div className="w-full max-w-300 mx-auto py-25 text-center xl:py-37.5">행사 정보를 불러오는 중입니다.</div>;
    if (!initialData) return <div className="w-full max-w-300 mx-auto py-25 text-center xl:py-37.5">행사가 존재하지 않습니다.</div>;

    return (
        <div className="bg-white border border-admin-border rounded-[14px] p-6 xl:max-w-190 xl:mx-auto">
            <div className="flex flex-wrap items-center justify-between gap-3.5 mb-5">
                <h2 className="font-sb-l text-[1.15rem] text-admin-dark">행사 수정</h2>
            </div>
            <EventForm mode="edit" initialData={initialData} />
        </div>
    )
}
