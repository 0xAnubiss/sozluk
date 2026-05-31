import { NextResponse } from "next/server";
import { castLocalVote } from "@/lib/local-dictionary-store";

function getBackendBaseUrl() {
  const baseUrl = process.env.API_BASE_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL;
  return (baseUrl ?? "http://127.0.0.1:4000").replace(/\/$/, "");
}

type RouteContext = {
  params: Promise<{
    slug: string;
    senseId: string;
  }>;
};

export async function POST(request: Request, context: RouteContext) {
  const { slug, senseId } = await context.params;
  const body = await request.text();
  try {
    const response = await fetch(`${getBackendBaseUrl()}/entries/${slug}/senses/${senseId}/votes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body,
      cache: "no-store",
      signal: AbortSignal.timeout(1200)
    });

    return NextResponse.json(await response.json(), {
      status: response.status
    });
  } catch {
    const sense = castLocalVote(slug, senseId, JSON.parse(body));
    if (!sense) {
      return NextResponse.json({ message: "Anlam bulunamadı." }, { status: 404 });
    }

    return NextResponse.json(sense, { status: 200 });
  }
}
