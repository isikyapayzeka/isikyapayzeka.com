import type { APIRoute } from "astro";
import { etkinlikler, icsMetni } from "../../veri";

// Her etkinlik için takvim dosyası (Apple Takvim, Outlook vb.).
export async function getStaticPaths() {
  return (await etkinlikler("tr")).map((e) => ({ params: { id: e.id }, props: { e } }));
}

export const GET: APIRoute = ({ props, site }) => {
  const e = props.e as Awaited<ReturnType<typeof etkinlikler>>[number];
  return new Response(icsMetni(e, new URL(e.sayfa, site).href), {
    headers: { "Content-Type": "text/calendar; charset=utf-8" },
  });
};
