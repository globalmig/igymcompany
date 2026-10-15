import type { Metadata } from "next";
import { supabaseServer } from "@/lib/supabase/server";
import EventDetail from "@/components/EventDetail";

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const { id } = await params;
  const { data: event } = await supabaseServer
    .from("events")
    .select("name")
    .eq("id", id)
    .maybeSingle();

  if (!event) {
    return {
      title: "행사 안내 | 에스원이벤트",
      description: "에스원이벤트가 기획하고 진행한 공식행사/지역축제 안내입니다.",
    };
  }

  const title = `${event.name} | 에스원이벤트`;
  const description = `에스원이벤트가 진행한 '${event.name}' 행사 현장을 소개합니다.`;

  return {
    title,
    description,
    keywords: [event.name, "에스원이벤트", "공식행사", "지역축제"],
    alternates: {
      canonical: `/event/${id}`,
    },
    openGraph: {
      title,
      description,
      url: `https://www.s-one-event.co.kr/event/${id}`,
      images: [
        {
          url: "https://www.s-one-event.co.kr/images/og_image.jpg",
          width: 1200,
          height: 630,
          alt: event.name,
        },
      ],
    },
  };
}

export default function EventDetailPage() {
    return (
        <EventDetail/>
    )
}
