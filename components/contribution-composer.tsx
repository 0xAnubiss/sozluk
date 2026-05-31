"use client";

import { startTransition, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { slugify } from "@/lib/local-dictionary-store";

const levels = ["A1", "A2", "B1", "B2", "C1", "C2"] as const;
const registers = ["akademik", "resmi", "teknik", "edebi", "dijital", "günlük", "yöresel", "argo", "kaba"];
const partsOfSpeech = ["ad", "eylem", "önad", "adıl", "bağlaç", "belirteç", "ilgeç", "ünlem"];

type SubmitState = {
  message: string;
  status: "idle" | "success" | "error";
};

function parseCommaSeparated(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function parseIdiomLines(value: string) {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [phrase, ...meaningParts] = line.split(":");
      return {
        phrase: phrase.trim(),
        meaning: meaningParts.join(":").trim()
      };
    })
    .filter((idiom) => idiom.phrase && idiom.meaning);
}

export function ContributionComposer() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mode, setMode] = useState<"existing" | "new">("existing");
  const [headword, setHeadword] = useState("");
  const [languagePair, setLanguagePair] = useState<"tr-fr" | "fr-tr">("tr-fr");
  const [contributorName, setContributorName] = useState("Selin Arda");
  const [partOfSpeech, setPartOfSpeech] = useState(partsOfSpeech[0]);
  const [level, setLevel] = useState<(typeof levels)[number]>("A1");
  const [register, setRegister] = useState(registers[5]);
  const [domain, setDomain] = useState("genel dil");
  const [pronunciation, setPronunciation] = useState("");
  const [ipa, setIpa] = useState("");
  const [summary, setSummary] = useState("");
  const [relatedTerms, setRelatedTerms] = useState("");
  const [synonyms, setSynonyms] = useState("");
  const [antonyms, setAntonyms] = useState("");
  const [idioms, setIdioms] = useState("");
  const [etymology, setEtymology] = useState("");
  const [definition, setDefinition] = useState("");
  const [translatedDefinition, setTranslatedDefinition] = useState("");
  const [exampleSource, setExampleSource] = useState("");
  const [exampleTarget, setExampleTarget] = useState("");
  const [note, setNote] = useState("Topluluğa açık yeni katkı.");
  const [submitState, setSubmitState] = useState<SubmitState>({ message: "", status: "idle" });
  const [isPending, setIsPending] = useState(false);
  const linkedHeadword = searchParams.get("word") ?? searchParams.get("entry");

  useEffect(() => {
    if (linkedHeadword) {
      setMode("existing");
      setHeadword(linkedHeadword);
    }

    try {
      const session = JSON.parse(localStorage.getItem("kalem-sozluk-current-user") ?? "null") as { name?: string } | null;
      if (session?.name) {
        setContributorName(session.name);
      }
    } catch {
      // Keep the demo contributor if localStorage is unavailable.
    }
  }, [searchParams]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsPending(true);
    setSubmitState({ message: "", status: "idle" });

    const normalizedHeadword = headword.trim();
    const normalizedSlug = slugify(normalizedHeadword);
    const examplePayload =
      exampleSource.trim() && exampleTarget.trim()
        ? [{ source: exampleSource.trim(), target: exampleTarget.trim() }]
        : [];

    try {
      if (!normalizedHeadword) {
        throw new Error("Madde başlığı boş bırakılamaz.");
      }

      if (!definition.trim() || !translatedDefinition.trim()) {
        throw new Error("Tanım ve seçilen dildeki karşılığı zorunlu.");
      }

      if (examplePayload.length === 0) {
        throw new Error("En az bir örnek tümce ve çevirisi gerekli.");
      }

      const sensePayload = {
        definition: definition.trim(),
        translatedDefinition: translatedDefinition.trim(),
        level,
        register,
        partOfSpeech,
        note: note.trim(),
        contributorName: contributorName.trim(),
        examples: examplePayload
      };

      if (mode === "new") {
        const response = await fetch("/api/entries", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            headword: normalizedHeadword,
            languageLabel: languagePair === "tr-fr" ? "Türkçe madde" : "Fransızca madde",
            languagePair,
            pronunciation: pronunciation.trim() || normalizedHeadword,
            ipa: ipa.trim() || `[${normalizedHeadword}]`,
            summary: summary.trim() || definition.trim(),
            domain: domain.trim(),
            relatedTerms: parseCommaSeparated(relatedTerms),
            synonyms: parseCommaSeparated(synonyms),
            antonyms: parseCommaSeparated(antonyms),
            idioms: parseIdiomLines(idioms),
            etymology: etymology.trim(),
            editorialNote: note.trim(),
            initialSense: sensePayload
          })
        });

        const payload = (await response.json()) as { slug?: string; message?: string };

        if (!response.ok) {
          throw new Error(payload.message ?? "Yeni madde kaydedilemedi.");
        }

        setSubmitState({
          message: "Yeni madde kaydedildi. Madde sayfasına yönlendiriliyorsun.",
          status: "success"
        });
        startTransition(() => {
          router.push(`/entry/${payload.slug ?? normalizedSlug}`);
          router.refresh();
        });
        return;
      }

      const response = await fetch(`/api/entries/${normalizedSlug}/senses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(sensePayload)
      });

      const payload = (await response.json()) as { message?: string };

      if (!response.ok) {
        throw new Error(payload.message ?? "Yeni anlam kaydedilemedi.");
      }

      setSubmitState({
        message: "Yeni anlam kaydedildi. Madde sayfasına yönlendiriliyorsun.",
        status: "success"
      });
      startTransition(() => {
        router.push(`/entry/${normalizedSlug}`);
        router.refresh();
      });
    } catch (error) {
      setSubmitState({
        message: error instanceof Error ? error.message : "Beklenmeyen bir hata oluştu.",
        status: "error"
      });
    } finally {
      setIsPending(false);
    }
  }

  return (
    <form className="contribution-layout" onSubmit={handleSubmit}>
      <div className="contribution-main">
        {linkedHeadword ? (
          <div className="linked-entry-notice">
            <strong>{linkedHeadword}</strong> maddesine katkı yapıyorsun.
          </div>
        ) : null}

        <section className="form-card">
          <h2>Katkı türü</h2>
          <div className="mode-selector" aria-label="Katkı türü seçimi">
            <button type="button" className={mode === "existing" ? "is-active" : ""} onClick={() => setMode("existing")}>
              Mevcut maddeye veri ekle
            </button>
            <button type="button" className={mode === "new" ? "is-active" : ""} onClick={() => setMode("new")}>
              Yeni madde oluştur
            </button>
          </div>
        </section>

        <section className="form-card">
          <h2>Madde çekirdeği</h2>
          <div className="form-grid">
            <label className="field field-wide">
              <span>Madde adı</span>
              <input
                type="text"
                value={headword}
                onChange={(event) => setHeadword(event.target.value)}
                placeholder={mode === "new" ? "Örn. érudition" : "Örn. kitap"}
                className="entry-headword-input"
              />
            </label>

            <label className="field">
              <span>Dil çifti seçimi</span>
              <select value={languagePair} onChange={(event) => setLanguagePair(event.target.value as "tr-fr" | "fr-tr")}>
                <option value="tr-fr">Türkçe - Fransızca</option>
                <option value="fr-tr">Fransızca - Türkçe</option>
              </select>
            </label>

            <label className="field">
              <span>Sözcük türü</span>
              <select value={partOfSpeech} onChange={(event) => setPartOfSpeech(event.target.value)}>
                {partsOfSpeech.map((part) => (
                  <option key={part} value={part}>
                    {part}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </section>

        <section className="form-card definition-card">
          <div className="definition-badge">TANIM #1</div>
          <h2>Tanım ve karşılık</h2>
          <div className="form-grid">
            <label className="field">
              <span>Zorluk düzeyi</span>
              <select value={level} onChange={(event) => setLevel(event.target.value as (typeof levels)[number])}>
                {levels.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>

            <label className="field">
              <span>Dil düzeyi</span>
              <select value={register} onChange={(event) => setRegister(event.target.value)}>
                {registers.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>

            <label className="field field-wide">
              <span>Tanım</span>
              <textarea rows={4} value={definition} onChange={(event) => setDefinition(event.target.value)} />
            </label>

            <label className="field field-wide">
              <span>Madde tanımının seçilen dildeki karşılığı</span>
              <textarea rows={3} value={translatedDefinition} onChange={(event) => setTranslatedDefinition(event.target.value)} />
            </label>

            <label className="field field-wide example-field">
              <span>Örnek tümce / alıntı tümce</span>
              <textarea rows={3} value={exampleSource} onChange={(event) => setExampleSource(event.target.value)} />
              <input
                type="text"
                value={exampleTarget}
                onChange={(event) => setExampleTarget(event.target.value)}
                placeholder="Örnek tümcenin seçilen dildeki çevirisi"
              />
            </label>
          </div>
        </section>

        <section className="form-card">
          <h2>Ek bilgiler</h2>
          <div className="form-grid">
            <label className="field">
              <span>Konu / alan</span>
              <input type="text" value={domain} onChange={(event) => setDomain(event.target.value)} />
            </label>
            <label className="field">
              <span>Katkıyı ekleyen</span>
              <input type="text" value={contributorName} onChange={(event) => setContributorName(event.target.value)} />
            </label>
            <label className="field">
              <span>Sesletim</span>
              <input type="text" value={pronunciation} onChange={(event) => setPronunciation(event.target.value)} />
            </label>
            <label className="field">
              <span>API / IPA</span>
              <input type="text" value={ipa} onChange={(event) => setIpa(event.target.value)} placeholder="/kitap/" />
            </label>
            <label className="field field-wide">
              <span>Madde özeti</span>
              <textarea rows={3} value={summary} onChange={(event) => setSummary(event.target.value)} />
            </label>
            <label className="field field-wide">
              <span>Deyimsel ifadeler / atasözleri</span>
              <textarea
                rows={3}
                value={idioms}
                onChange={(event) => setIdioms(event.target.value)}
                placeholder="Her satır: kitabına uydurmak: Kuralları kendi lehine yorumlamak"
              />
            </label>
            <label className="field">
              <span>Eş anlamlı sözcükler</span>
              <input type="text" value={synonyms} onChange={(event) => setSynonyms(event.target.value)} />
            </label>
            <label className="field">
              <span>Karşıt anlamlı sözcükler</span>
              <input type="text" value={antonyms} onChange={(event) => setAntonyms(event.target.value)} />
            </label>
            <label className="field field-wide">
              <span>İlgili sözcükler</span>
              <input type="text" value={relatedTerms} onChange={(event) => setRelatedTerms(event.target.value)} />
            </label>
            <label className="field field-wide">
              <span>Kökenbilim</span>
              <textarea rows={3} value={etymology} onChange={(event) => setEtymology(event.target.value)} />
            </label>
            <label className="field field-wide">
              <span>Katkı notu</span>
              <textarea rows={3} value={note} onChange={(event) => setNote(event.target.value)} />
            </label>
          </div>
        </section>

        <div className="form-actions">
          <button type="submit" className="primary-button" disabled={isPending}>
            {isPending ? "Gönderiliyor..." : mode === "new" ? "Maddeyi yayımla" : "Anlamı yayımla"}
          </button>
        </div>

        {submitState.message ? (
          <p className={submitState.status === "error" ? "form-feedback error" : "form-feedback success"}>
            {submitState.message}
          </p>
        ) : null}
      </div>

      <aside className="contribution-sidebar">
        <div className="sidebar-note">
          <h3>MVP kontrolü</h3>
          <ol>
            <li>Her tanım kendi CEFR düzeyini ve yıldız skorunu taşır.</li>
            <li>Düşük oylu bilgiler detay sayfasında “daha fazla gör” altında kalır.</li>
            <li>Madde yoksa aynı form yeni madde oluşturur.</li>
            <li>Katkı sahibi ve profil istatistikleri görünür kalır.</li>
          </ol>
        </div>
      </aside>
    </form>
  );
}
