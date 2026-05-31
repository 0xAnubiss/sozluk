import { NextResponse } from "next/server";
import { createLocalEntry } from "@/lib/local-dictionary-store";

function getBackendBaseUrl() {
  const baseUrl = process.env.API_BASE_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL;
  return (baseUrl ?? "http://127.0.0.1:4000").replace(/\/$/, "");
}

export async function POST(request: Request) {
  const body = await request.text();
  try {
    const response = await fetch(`${getBackendBaseUrl()}/entries`, {
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
  } catch (error) {
    try {
      return NextResponse.json(createLocalEntry(JSON.parse(body)), { status: 201 });
    } catch (fallbackError) {
      return NextResponse.json(
        {
          message: fallbackError instanceof Error ? fallbackError.message : "Yeni madde kaydedilemedi."
        },
        { status: 400 }
      );
    }
  }
}
