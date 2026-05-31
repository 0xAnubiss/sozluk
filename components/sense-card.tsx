"use client";

import Link from "next/link";
import { useState } from "react";
import type { DictionarySense } from "@/lib/types";
import { SenseVoteControl } from "@/components/sense-vote-control";
import { VolumeIcon } from "@/components/ui-icons";

type SenseCardProps = {
  entrySlug: string;
  entryHeadword: string;
  sense: DictionarySense;
  domain: string;
  sourceLanguage: "tr" | "fr";
};

export function SenseCard({ entrySlug, entryHeadword, sense, domain, sourceLanguage }: SenseCardProps) {
  const [status, setStatus] = useState("");

  function speak(text: string) {
    if (!("speechSynthesis" in window)) {
      setStatus("Tarayıcı sesli dinlemeyi desteklemiyor.");
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = sourceLanguage === "fr" ? "fr-FR" : "tr-TR";
    window.speechSynthesis.speak(utterance);
  }

  return (
    <article className="definition-entry">
      <div className="definition-head">
        <div>
          <span className="section-kicker">{sense.register}</span>
          <h2>{sense.translatedDefinition}</h2>
        </div>
        <div className="sense-actions">
          <Link href={`/contribute?entry=${entrySlug}&word=${encodeURIComponent(entryHeadword)}`} className="contribute-link">
            Katkı yap
          </Link>
          <button
            type="button"
            className="icon-button"
            onClick={() => speak(sense.examples[0]?.source ?? sense.definition)}
            aria-label="Sesli dinle"
          >
            <VolumeIcon />
          </button>
          <SenseVoteControl entrySlug={entrySlug} senseId={sense.id} initialVotes={sense.votes} compact />
        </div>
      </div>

      <p className="definition-copy">{sense.definition}</p>

      {sense.examples[0] ? (
        <blockquote className="definition-quote">
          <p>{sense.examples[0].source}</p>
          <span>{sense.examples[0].target}</span>
        </blockquote>
      ) : null}

      <div className="definition-tags">
        <span>{sense.level}</span>
        <span>{sense.register}</span>
        <span className="part-of-speech-tag">{sense.partOfSpeech}</span>
        <span>{domain}</span>
      </div>

      <p className="definition-note">{sense.note}</p>

      <div className="definition-footer">
        <div className="contributor-mark">
          <div className="avatar-dot">{sense.contributorName.slice(0, 1)}</div>
          <span>@{sense.contributorName.toLocaleLowerCase("tr").replace(/\s+/g, "_")}</span>
        </div>
      </div>

      {status ? <p className="voice-status">{status}</p> : null}
    </article>
  );
}
