export const languageLevels = ["A1", "A2", "B1", "B2", "C1", "C2"] as const;

export const contributionTypes = ["new-sense", "example", "translation", "note"] as const;

export const contributionStatuses = ["featured", "queued", "review"] as const;

export const supportedLanguagePairs = ["tr-fr", "fr-tr"] as const;

export type LanguageLevel = (typeof languageLevels)[number];
export type ContributionType = (typeof contributionTypes)[number];
export type ContributionStatus = (typeof contributionStatuses)[number];
export type SupportedLanguagePair = (typeof supportedLanguagePairs)[number];

export type VoteBreakdown = {
  one: number;
  two: number;
  three: number;
};

export type DictionaryExample = {
  source: string;
  target: string;
};

export type DictionarySense = {
  id: string;
  order: number;
  definition: string;
  translatedDefinition: string;
  level: LanguageLevel;
  register: string;
  partOfSpeech: string;
  note: string;
  contributorName: string;
  examples: DictionaryExample[];
  votes: VoteBreakdown;
};

export type EntryContribution = {
  id: string;
  author: string;
  type: ContributionType;
  summary: string;
  status: ContributionStatus;
};

export type DictionaryIdiom = {
  phrase: string;
  meaning: string;
};

export type DictionaryEntry = {
  id: string;
  slug: string;
  headword: string;
  languageLabel: string;
  languagePair: string;
  pronunciation: string;
  ipa: string;
  summary: string;
  domain: string;
  contributionStatus: string;
  relatedTerms: string[];
  synonyms: string[];
  antonyms: string[];
  idioms: DictionaryIdiom[];
  etymology: string;
  editorialNote: string;
  senses: DictionarySense[];
  contributions: EntryContribution[];
};

export type ContributorProfile = {
  id: string;
  handle: string;
  name: string;
  profession: string;
  bio: string;
  avatarUrl?: string;
  languages: string[];
  focusAreas: string[];
  stats: {
    entriesCreated: number;
    contributions: number;
    votesReceived: number;
  };
  recentContributions: Array<{
    entrySlug: string;
    label: string;
    summary: string;
  }>;
};

export type CreateEntryPayload = {
  headword: string;
  languageLabel: string;
  languagePair: SupportedLanguagePair;
  pronunciation: string;
  ipa: string;
  summary: string;
  domain: string;
  relatedTerms?: string[];
  synonyms?: string[];
  antonyms?: string[];
  etymology?: string;
  editorialNote?: string;
  idioms?: DictionaryIdiom[];
  initialSense?: CreateSensePayload;
};

export type UpdateEntryPayload = {
  headword?: string;
  languageLabel?: string;
  languagePair?: SupportedLanguagePair;
  pronunciation?: string;
  ipa?: string;
  summary?: string;
  domain?: string;
  contributionStatus?: string;
  relatedTerms?: string[];
  synonyms?: string[];
  antonyms?: string[];
  idioms?: DictionaryIdiom[];
  etymology?: string;
  editorialNote?: string;
};

export type CreateSensePayload = {
  definition: string;
  translatedDefinition: string;
  level: LanguageLevel;
  register: string;
  partOfSpeech: string;
  note: string;
  contributorName: string;
  examples: DictionaryExample[];
};

export type UpdateSensePayload = Partial<
  Omit<DictionarySense, "id" | "order" | "votes">
> & {
  examples?: DictionaryExample[];
};

export type CreateContributionPayload = {
  entrySlug: string;
  author: string;
  type: ContributionType;
  summary: string;
  status?: ContributionStatus;
};

export type CastVotePayload = {
  rating: 1 | 2 | 3 | null;
  previousRating?: 1 | 2 | 3 | null;
};
