import "server-only";

import type { ContributorProfile, DictionaryEntry } from "@/lib/types";
import {
  getLocalEntryBySlug,
  getLocalProfileByHandle,
  listLocalEntries,
  listLocalProfiles
} from "@/lib/local-dictionary-store";

type EntryListResponse = {
  items: DictionaryEntry[];
  total: number;
};

type ProfileListResponse = {
  items: ContributorProfile[];
  total: number;
};

function getBackendBaseUrl() {
  const baseUrl = process.env.API_BASE_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL;
  return (baseUrl ?? "http://127.0.0.1:4000").replace(/\/$/, "");
}

async function fetchJson<T>(path: string): Promise<T> {
  const response = await fetch(`${getBackendBaseUrl()}${path}`, {
    cache: "no-store",
    signal: AbortSignal.timeout(1200)
  });

  if (!response.ok) {
    throw new Error(`Backend request failed: ${response.status}`);
  }

  return (await response.json()) as T;
}

export async function getFeaturedEntries() {
  try {
    const payload = await fetchJson<EntryListResponse>("/entries");
    return payload.items;
  } catch {
    return listLocalEntries();
  }
}

export async function getEntryBySlug(slug: string) {
  try {
    return await fetchJson<DictionaryEntry>(`/entries/${slug}`);
  } catch {
    return getLocalEntryBySlug(slug);
  }
}

export async function getTopContributors() {
  try {
    const payload = await fetchJson<ProfileListResponse>("/profiles");
    return payload.items;
  } catch {
    return listLocalProfiles();
  }
}

export async function getProfileByHandle(handle: string) {
  try {
    return await fetchJson<ContributorProfile>(`/profiles/${handle}`);
  } catch {
    return getLocalProfileByHandle(handle);
  }
}
