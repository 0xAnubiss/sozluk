import Link from "next/link";
import { formatLanguagePair } from "@/lib/formatters";
import type { DictionaryEntry } from "@/lib/types";

type EntryPreviewCardProps = {
  entry: DictionaryEntry;
};

export function EntryPreviewCard({ entry }: EntryPreviewCardProps) {
  return (
    <article className="result-card">
      <div>
        <strong>{entry.headword}</strong>
        <p>
          {formatLanguagePair(entry.languagePair)} - {entry.summary}
        </p>
      </div>
      <Link href={`/entry/${entry.slug}`}>Aç</Link>
    </article>
  );
}
