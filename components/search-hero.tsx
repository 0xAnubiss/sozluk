"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import type { ContributorProfile, DictionaryEntry } from "@/lib/types";
import { SenseVoteControl } from "@/components/sense-vote-control";
import { ChartIcon, SearchIcon, ShareIcon, SwapIcon, UsersIcon, VolumeIcon } from "@/components/ui-icons";

type SearchHeroProps = {
  entries: DictionaryEntry[];
  contributors: ContributorProfile[];
  initialQuery?: string;
  initialLanguagePair?: "tr-fr" | "fr-tr";
};

type SessionUser = {
  name: string;
  email: string;
  profession?: string;
  languages?: string;
  avatarUrl?: string;
};

function pairLabel(pair: string) {
  return pair === "tr-fr" ? "Türkçe -> Fransızca" : "Fransızca -> Türkçe";
}

export function SearchHero({ entries, contributors, initialQuery = "", initialLanguagePair = "tr-fr" }: SearchHeroProps) {
  const [query, setQuery] = useState(initialQuery);
  const [languagePair, setLanguagePair] = useState<"tr-fr" | "fr-tr">(initialLanguagePair);
  const [voiceStatus, setVoiceStatus] = useState("");
  const [sessionUser, setSessionUser] = useState<SessionUser | null>(null);
  const trendingTerms = ["kitap", "tourner", "usul", "maison", "öğrenmek"];

  useEffect(() => {
    function syncSession() {
      try {
        setSessionUser(JSON.parse(localStorage.getItem("kalem-sozluk-current-user") ?? "null") as SessionUser | null);
      } catch {
        setSessionUser(null);
      }
    }

    syncSession();
    window.addEventListener("storage", syncSession);
    window.addEventListener("kalem-auth-change", syncSession);
    return () => {
      window.removeEventListener("storage", syncSession);
      window.removeEventListener("kalem-auth-change", syncSession);
    };
  }, []);

  const visibleContributors = useMemo(() => {
    if (!sessionUser?.name) {
      return contributors;
    }

    const localProfile: ContributorProfile = {
      id: `profile-${sessionUser.email || "local"}`,
      handle: "me",
      name: sessionUser.name,
      profession: sessionUser.profession?.trim() || "Katkı kullanıcısı",
      bio: "Kayıtlı kullanıcı",
      avatarUrl: sessionUser.avatarUrl,
      languages: (sessionUser.languages ?? "Türkçe, Fransızca").split(",").map((item) => item.trim()).filter(Boolean),
      focusAreas: ["sözlük katkısı"],
      stats: {
        entriesCreated: 0,
        contributions: 0,
        votesReceived: 0
      },
      recentContributions: [
        {
          entrySlug: "kitap",
          label: "Profil hazır",
          summary: "Profil resmi yüklendiğinde anasayfada küçük ikonla görünür."
        }
      ]
    };

    return [localProfile, ...contributors.filter((profile) => profile.handle !== "me")];
  }, [contributors, sessionUser]);

  const filteredEntries = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("tr");
    const scopedEntries = entries.filter((entry) => entry.languagePair === languagePair);

    if (!normalizedQuery) {
      return scopedEntries;
    }

    return scopedEntries.filter((entry) =>
      [
        entry.headword,
        entry.summary,
        entry.domain,
        ...entry.relatedTerms,
        ...entry.synonyms,
        ...entry.antonyms,
        ...entry.senses.flatMap((sense) => [sense.definition, sense.translatedDefinition])
      ].some((value) => value.toLocaleLowerCase("tr").includes(normalizedQuery))
    );
  }, [entries, languagePair, query]);

  const fallbackEntry = entries.find((entry) => entry.languagePair === languagePair) ?? entries[0];
  const featuredEntry = filteredEntries[0] ?? fallbackEntry;
  const topSense = featuredEntry?.senses[0];
  const recentContributions = visibleContributors
    .flatMap((profile) =>
      profile.recentContributions.map((contribution) => ({
        profile,
        contribution
      }))
    )
    .slice(0, 4);

  function switchPair() {
    setLanguagePair((current) => (current === "tr-fr" ? "fr-tr" : "tr-fr"));
  }

  function speak(text: string, pair: string) {
    if (!("speechSynthesis" in window)) {
      setVoiceStatus("Tarayıcı sesli dinlemeyi desteklemiyor.");
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = pair === "fr-tr" ? "fr-FR" : "tr-TR";
    window.speechSynthesis.speak(utterance);
    setVoiceStatus(`Sesletim: ${text}`);
  }

  async function shareEntry(entry: DictionaryEntry) {
    const url = `${window.location.origin}/entry/${entry.slug}`;
    if (navigator.share) {
      await navigator.share({ title: entry.headword, url });
      return;
    }

    await navigator.clipboard.writeText(url);
    setVoiceStatus("Madde bağlantısı kopyalandı.");
  }

  return (
    <div className="reverso-home">
      <section className="lookup-panel">
        <div className="lookup-tabs" aria-label="Dil çifti seçimi">
          <button
            type="button"
            className={languagePair === "tr-fr" ? "is-active" : ""}
            onClick={() => setLanguagePair("tr-fr")}
          >
            Türkçe-Fransızca
          </button>
          <button type="button" className="swap-button" onClick={switchPair} aria-label="Dil çiftini değiştir">
            <SwapIcon />
          </button>
          <button
            type="button"
            className={languagePair === "fr-tr" ? "is-active" : ""}
            onClick={() => setLanguagePair("fr-tr")}
          >
            Fransızca-Türkçe
          </button>
        </div>

        <label className="lookup-search" aria-label="Sözlük araması">
          <SearchIcon />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Kelime veya ifade yazın"
          />
          <Link href={featuredEntry ? `/entry/${featuredEntry.slug}` : "/contribute"} className="primary-button">
            Ara
          </Link>
        </label>

        <div className="quick-terms">
          {trendingTerms.map((term) => (
            <button key={term} type="button" onClick={() => setQuery(term)}>
              {term}
            </button>
          ))}
        </div>
      </section>

      <section className="dictionary-workspace">
        <main className="results-column">
          <div className="results-toolbar">
            <div>
              <span className="section-kicker">Sözlük</span>
              <h1>{query ? `"${query}" sonuçları` : pairLabel(languagePair)}</h1>
            </div>
            <Link href="/contribute" className="ghost-button">
              Katkı yap
            </Link>
          </div>

          {filteredEntries.length === 0 ? (
            <article className="empty-result">
              <h2>Madde bulunamadı</h2>
              <p>Bu başlık daha önce eklenmemişse katkı ekranından yeni madde olarak oluşturabilirsiniz.</p>
              <Link href="/contribute" className="primary-button">
                Yeni madde oluştur
              </Link>
            </article>
          ) : (
            <div className="translation-list">
              {filteredEntries.map((entry) => {
                const firstSense = entry.senses[0];

                return (
                  <article key={entry.id} className="translation-card">
                    <div className="translation-main">
                      <div className="word-line">
                        <Link href={`/entry/${entry.slug}`}>{entry.headword}</Link>
                        <button
                          type="button"
                          className="icon-button"
                          onClick={() => speak(entry.headword, entry.languagePair)}
                          aria-label={`${entry.headword} sesletimini dinle`}
                        >
                          <VolumeIcon />
                        </button>
                      </div>
                      <p className="phonetic-line">
                        {entry.pronunciation} · /{entry.ipa.replace(/^\[|\]$/g, "")}/ · {pairLabel(entry.languagePair)}
                      </p>
                      <p className="translation-definition">{firstSense?.translatedDefinition ?? entry.summary}</p>
                      <p className="source-definition">{firstSense?.definition ?? entry.summary}</p>
                    </div>
                    <div className="translation-meta">
                      <Link href={`/contribute?entry=${entry.slug}&word=${encodeURIComponent(entry.headword)}`} className="contribute-link contribute-link-top">
                        Katkı yap
                      </Link>
                      {firstSense ? (
                        <SenseVoteControl
                          entrySlug={entry.slug}
                          senseId={firstSense.id}
                          initialVotes={firstSense.votes}
                        />
                      ) : null}
                    </div>
                    <div className="translation-tags">
                      <span>{firstSense?.level ?? "A1"}</span>
                      <span className="part-of-speech-tag">{firstSense?.partOfSpeech ?? "ad"}</span>
                      <span>{entry.domain}</span>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </main>

        <aside className="context-column">
          {featuredEntry ? (
            <article className="context-card">
              <div className="context-head">
                <span className="section-kicker">Öne çıkan</span>
                <button type="button" className="icon-button" onClick={() => shareEntry(featuredEntry)} aria-label="Paylaş">
                  <ShareIcon />
                </button>
              </div>
              <h2>{featuredEntry.headword}</h2>
              <p>{topSense?.definition ?? featuredEntry.summary}</p>
              {topSense?.examples[0] ? (
                <blockquote className="context-example">
                  <span>{topSense.examples[0].source}</span>
                  <strong>{topSense.examples[0].target}</strong>
                </blockquote>
              ) : null}
              <Link href={`/entry/${featuredEntry.slug}`} className="inline-link">
                Maddeyi aç
              </Link>
            </article>
          ) : null}

          <article className="context-card">
            <h3>Son katkılar</h3>
            <div className="recent-feed">
              {recentContributions.map(({ profile, contribution }, index) => (
                <Link key={`${profile.id}-${index}`} href={`/entry/${contribution.entrySlug}`} className="feed-item">
                  <span className="feed-avatar">
                    {profile.avatarUrl ? (
                      <Image src={profile.avatarUrl} alt={`${profile.name} profil resmi`} width={34} height={34} unoptimized />
                    ) : (
                      profile.name.slice(0, 1)
                    )}
                  </span>
                  <div>
                    <strong>{contribution.label}</strong>
                    <span>{profile.name}</span>
                  </div>
                  <small>{index === 0 ? "az önce" : index === 1 ? "15 dk" : "1 sa"}</small>
                </Link>
              ))}
            </div>
          </article>

          <div className="metric-strip">
            <span>
              <ChartIcon />
              {entries.length} madde
            </span>
            <span>
              <UsersIcon />
              {visibleContributors.length} katkıcı
            </span>
          </div>
          {voiceStatus ? <p className="voice-status">{voiceStatus}</p> : null}
        </aside>
      </section>
    </div>
  );
}
