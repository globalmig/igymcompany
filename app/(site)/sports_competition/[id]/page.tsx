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
      title: "체육대회 안내 | 에스원이벤트",
      description: "에스원이벤트가 기획하고 진행한 체육대회 안내입니다.",
    };
  }

  const title = `${event.name} | 에스원이벤트`;
  const description = `에스원이벤트가 진행한 '${event.name}' 체육대회 현장을 소개합니다.`;

  return {
    title,
    description,
    keywords: [event.name, "에스원이벤트", "체육대회"],
    alternates: {
      canonical: `/sports_competition/${id}`,
    },
    openGraph: {
      title,
      description,
      url: `https://www.s-one-event.co.kr/sports_competition/${id}`,
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

export default function SportsCompetitionDetailPage() {
    return (
        <EventDetail/>
    )
}
