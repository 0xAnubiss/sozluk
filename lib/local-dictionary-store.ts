import { contributorProfiles, dictionaryEntries } from "@/shared/mock-data";
import type {
  CastVotePayload,
  CreateEntryPayload,
  CreateSensePayload,
  DictionaryEntry,
  DictionarySense,
  SupportedLanguagePair
} from "@/shared/dictionary-contracts";

const entries: DictionaryEntry[] = structuredClone(dictionaryEntries);
const profiles = structuredClone(contributorProfiles);

export function slugify(value: string) {
  return value
    .replace(/ı/g, "i")
    .replace(/İ/g, "I")
    .replace(/ğ/g, "g")
    .replace(/Ğ/g, "G")
    .replace(/ş/g, "s")
    .replace(/Ş/g, "S")
    .replace(/ç/g, "c")
    .replace(/Ç/g, "C")
    .replace(/ö/g, "o")
    .replace(/Ö/g, "O")
    .replace(/ü/g, "u")
    .replace(/Ü/g, "U")
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function scoreSense(sense: DictionarySense) {
  return sense.votes.one + sense.votes.two * 2 + sense.votes.three * 3;
}

function cloneEntry(entry: DictionaryEntry) {
  return structuredClone(entry);
}

function findContributor(name: string) {
  return profiles.find((profile) => profile.name.toLocaleLowerCase("tr") === name.toLocaleLowerCase("tr"));
}

export function listLocalEntries(options: { query?: string; languagePair?: SupportedLanguagePair; limit?: number } = {}) {
  const normalizedQuery = options.query?.trim().toLocaleLowerCase("tr");
  const filtered = entries.filter((entry) => {
    const pairMatches = options.languagePair ? entry.languagePair === options.languagePair : true;
    if (!pairMatches) {
      return false;
    }

    if (!normalizedQuery) {
      return true;
    }

    return [
      entry.headword,
      entry.summary,
      entry.domain,
      ...entry.relatedTerms,
      ...entry.synonyms,
      ...entry.antonyms,
      ...entry.senses.flatMap((sense) => [sense.definition, sense.translatedDefinition])
    ].some((value) => value.toLocaleLowerCase("tr").includes(normalizedQuery));
  });

  return filtered
    .map(cloneEntry)
    .sort((left, right) => {
      const leftScore = left.senses.reduce((total, sense) => total + scoreSense(sense), 0);
      const rightScore = right.senses.reduce((total, sense) => total + scoreSense(sense), 0);
      return rightScore - leftScore;
    })
    .slice(0, options.limit ?? filtered.length);
}

export function getLocalEntryBySlug(slug: string) {
  const entry = entries.find((item) => item.slug === slug);
  return entry ? cloneEntry(entry) : null;
}

export function listLocalProfiles() {
  return structuredClone(profiles);
}

export function getLocalProfileByHandle(handle: string) {
  const profile = profiles.find((item) => item.handle === handle);
  return profile ? structuredClone(profile) : null;
}

export function createLocalEntry(payload: CreateEntryPayload) {
  const slug = slugify(payload.headword);

  if (!slug) {
    throw new Error("Madde başlığından geçerli bir bağlantı üretilemedi.");
  }

  if (entries.some((entry) => entry.slug === slug)) {
    throw new Error("Bu başlık için zaten bir madde var.");
  }

  const initialSense = payload.initialSense;
  const entry: DictionaryEntry = {
    id: `entry-${slug}`,
    slug,
    headword: payload.headword.trim(),
    languageLabel: payload.languageLabel.trim(),
    languagePair: payload.languagePair,
    pronunciation: payload.pronunciation.trim(),
    ipa: payload.ipa.trim(),
    summary: payload.summary.trim(),
    domain: payload.domain.trim(),
    contributionStatus: "Topluluk oylarına açık",
    relatedTerms: payload.relatedTerms ?? [],
    synonyms: payload.synonyms ?? [],
    antonyms: payload.antonyms ?? [],
    idioms: payload.idioms ?? [],
    etymology: payload.etymology?.trim() ?? "",
    editorialNote: payload.editorialNote?.trim() ?? "",
    senses: initialSense
      ? [
          {
            id: `sense-${slug}-1`,
            order: 1,
            definition: initialSense.definition.trim(),
            translatedDefinition: initialSense.translatedDefinition.trim(),
            level: initialSense.level,
            register: initialSense.register.trim(),
            partOfSpeech: initialSense.partOfSpeech.trim(),
            note: initialSense.note.trim(),
            contributorName: initialSense.contributorName.trim(),
            examples: initialSense.examples,
            votes: {
              one: 0,
              two: 0,
              three: 1
            }
          }
        ]
      : [],
    contributions: initialSense
      ? [
          {
            id: `contribution-${slug}-initial`,
            author: initialSense.contributorName.trim(),
            type: "new-sense",
            summary: "İlk anlam, madde oluşturulurken eklendi.",
            status: "featured"
          }
        ]
      : []
  };

  entries.unshift(entry);

  const contributor = initialSense ? findContributor(initialSense.contributorName.trim()) : null;
  if (contributor) {
    contributor.stats.entriesCreated += 1;
    contributor.stats.contributions += 1;
    contributor.recentContributions.unshift({
      entrySlug: entry.slug,
      label: entry.headword,
      summary: "Yeni madde oluşturdu."
    });
  }

  return cloneEntry(entry);
}

export function createLocalSense(slug: string, payload: CreateSensePayload) {
  const entry = entries.find((item) => item.slug === slug);
  if (!entry) {
    return null;
  }

  const nextOrder = entry.senses.length + 1;
  const sense: DictionarySense = {
    id: `sense-${slug}-${nextOrder}`,
    order: nextOrder,
    definition: payload.definition.trim(),
    translatedDefinition: payload.translatedDefinition.trim(),
    level: payload.level,
    register: payload.register.trim(),
    partOfSpeech: payload.partOfSpeech.trim(),
    note: payload.note.trim(),
    contributorName: payload.contributorName.trim(),
    examples: payload.examples,
    votes: {
      one: 0,
      two: 0,
      three: 1
    }
  };

  entry.senses.push(sense);
  entry.contributions.unshift({
    id: `contribution-${slug}-${nextOrder}`,
    author: payload.contributorName.trim(),
    type: "new-sense",
    summary: `${payload.contributorName.trim()} yeni bir anlam ekledi.`,
    status: "queued"
  });

  const contributor = findContributor(payload.contributorName.trim());
  if (contributor) {
    contributor.stats.contributions += 1;
    contributor.recentContributions.unshift({
      entrySlug: entry.slug,
      label: entry.headword,
      summary: "Yeni anlam ve örnek cümle ekledi."
    });
  }

  return structuredClone(sense);
}

export function castLocalVote(slug: string, senseId: string, payload: CastVotePayload) {
  const entry = entries.find((item) => item.slug === slug);
  const sense = entry?.senses.find((item) => item.id === senseId);

  if (!sense) {
    return null;
  }

  if (payload.previousRating === payload.rating) {
    return structuredClone(sense);
  }

  if (payload.previousRating === 1) {
    sense.votes.one = Math.max(0, sense.votes.one - 1);
  }

  if (payload.previousRating === 2) {
    sense.votes.two = Math.max(0, sense.votes.two - 1);
  }

  if (payload.previousRating === 3) {
    sense.votes.three = Math.max(0, sense.votes.three - 1);
  }

  if (payload.rating === 1) {
    sense.votes.one += 1;
  }

  if (payload.rating === 2) {
    sense.votes.two += 1;
  }

  if (payload.rating === 3) {
    sense.votes.three += 1;
  }

  const contributor = findContributor(sense.contributorName);
  if (contributor) {
    contributor.stats.votesReceived = Math.max(
      0,
      contributor.stats.votesReceived - (payload.previousRating ?? 0) + (payload.rating ?? 0)
    );
  }

  return structuredClone(sense);
}
