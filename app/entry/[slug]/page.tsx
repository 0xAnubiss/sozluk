import Link from "next/link";
import { notFound } from "next/navigation";
import { SenseCard } from "@/components/sense-card";
import { SpeakButton } from "@/components/speak-button";
import { getEntryBySlug } from "@/lib/dictionary";

type EntryPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

function scoreSense(votes: { one: number; two: number; three: number }) {
  return votes.one + votes.two * 2 + votes.three * 3;
}

export default async function EntryPage({ params }: EntryPageProps) {
  const { slug } = await params;
  const entry = await getEntryBySlug(slug);

  if (!entry) {
    notFound();
  }

  const rankedSenses = [...entry.senses].sort((left, right) => scoreSense(right.votes) - scoreSense(left.votes));
  const visibleSenses = rankedSenses.slice(0, 2);
  const hiddenSenses = rankedSenses.slice(2);
  const sourceLanguage = entry.languagePair === "fr-tr" ? "fr" : "tr";
  const speechLang = sourceLanguage === "fr" ? "fr-FR" : "tr-TR";

  return (
    <div className="page-shell">
      <section className="entry-hero">
        <div>
          <span className="section-kicker">{entry.languagePair === "tr-fr" ? "Türkçe-Fransızca" : "Fransızca-Türkçe"}</span>
          <div className="entry-title-row">
            <h1>{entry.headword}</h1>
            <SpeakButton text={entry.headword} lang={speechLang} label={`${entry.headword} sesletimini dinle`} />
            <span className="level-chip">{rankedSenses[0]?.level ?? "A1"}</span>
          </div>
          <p className="entry-meta-line">
            <span>{entry.pronunciation}</span>
            <span>/ {entry.ipa.replace(/^\[|\]$/g, "")} /</span>
            <span className="part-of-speech-tag">{rankedSenses[0]?.partOfSpeech ?? "ad"}</span>
            <span>{entry.domain}</span>
          </p>
        </div>
        <Link href="/contribute" className="primary-button">
          Veri ekle
        </Link>
      </section>

      <div className="entry-layout">
        <main className="entry-main">
          {visibleSenses.map((sense) => (
              <SenseCard
                key={sense.id}
                entrySlug={entry.slug}
                entryHeadword={entry.headword}
                sense={sense}
                domain={entry.domain}
                sourceLanguage={sourceLanguage}
            />
          ))}

          {hiddenSenses.length > 0 ? (
            <details className="more-definitions">
              <summary>Daha fazla gör ({hiddenSenses.length})</summary>
              <div className="hidden-sense-stack">
                {hiddenSenses.map((sense) => (
                    <SenseCard
                      key={sense.id}
                      entrySlug={entry.slug}
                      entryHeadword={entry.headword}
                      sense={sense}
                      domain={entry.domain}
                      sourceLanguage={sourceLanguage}
                  />
                ))}
              </div>
            </details>
          ) : null}
        </main>

        <aside className="entry-sidebar">
          <article className="sidebar-panel">
            <h3>Madde bilgisi</h3>
            <div className="definition-tags">
              <span>{entry.languageLabel}</span>
              <span>{entry.contributionStatus}</span>
              <span>{entry.domain}</span>
            </div>
          </article>

          <article className="sidebar-panel">
            <h3>Kökenbilim</h3>
            <p>{entry.etymology || "Bu madde için kökenbilim bilgisi henüz eklenmedi."}</p>
            <div className="sidebar-divider" />
            <p>{entry.editorialNote || "Topluluk katkıları oy sırasına göre görünür."}</p>
          </article>

          {entry.idioms.length > 0 ? (
            <article className="sidebar-panel">
              <h3>Deyimsel ifadeler / atasözleri</h3>
              <div className="idiom-list">
                {entry.idioms.map((idiom) => (
                  <div key={idiom.phrase} className="idiom-item">
                    <strong>{idiom.phrase}</strong>
                    <p>{idiom.meaning}</p>
                  </div>
                ))}
              </div>
            </article>
          ) : null}

          <article className="sidebar-panel">
            <h3>Eş / karşıt / ilgili</h3>
            <div className="term-group">
              <strong>İlgili sözcükler</strong>
              <div className="linked-list">{entry.relatedTerms.map((term) => <span key={term}>{term}</span>)}</div>
            </div>
            <div className="term-group">
              <strong>Eş anlamlılar</strong>
              <div className="linked-list">{entry.synonyms.map((term) => <span key={term}>{term}</span>)}</div>
            </div>
            <div className="term-group">
              <strong>Karşıt anlamlılar</strong>
              <div className="linked-list">{entry.antonyms.map((term) => <span key={term}>{term}</span>)}</div>
            </div>
          </article>
        </aside>
      </div>
    </div>
  );
}
