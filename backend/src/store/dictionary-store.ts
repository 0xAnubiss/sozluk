import { prisma } from "../lib/prisma";
import type {
  CastVotePayload,
  ContributorProfile,
  CreateContributionPayload,
  CreateEntryPayload,
  CreateSensePayload,
  DictionaryEntry,
  DictionarySense,
  EntryContribution,
  SupportedLanguagePair,
  UpdateEntryPayload,
  UpdateSensePayload
} from "../../../shared/dictionary-contracts";

type ListEntriesOptions = {
  query?: string;
  languagePair?: string;
  limit?: number;
};

const entryInclude = {
  relatedTerms: { orderBy: { order: "asc" } },
  synonyms: { orderBy: { order: "asc" } },
  antonyms: { orderBy: { order: "asc" } },
  idioms: { orderBy: { order: "asc" } },
  senses: {
    orderBy: { order: "asc" },
    include: {
      examples: { orderBy: { order: "asc" } }
    }
  },
  contributions: {
    orderBy: { createdAt: "desc" }
  }
} as const;

const profileInclude = {
  contributions: {
    orderBy: { createdAt: "desc" },
    take: 5,
    include: { entry: true }
  }
} as const;

async function findEntryRecordBySlug(slug: string) {
  return prisma.entry.findUnique({
    where: { slug },
    include: entryInclude
  });
}

async function findEntryRecordById(id: string) {
  return prisma.entry.findUniqueOrThrow({
    where: { id },
    include: entryInclude
  });
}

async function findProfilesWithRecentContributions() {
  return prisma.profile.findMany({
    include: profileInclude,
    orderBy: { votesReceived: "desc" }
  });
}

async function findProfileRecordByHandle(handle: string) {
  return prisma.profile.findUnique({
    where: { handle },
    include: profileInclude
  });
}

function slugify(value: string) {
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

function toDbLanguagePair(languagePair: SupportedLanguagePair) {
  return languagePair === "tr-fr" ? "tr_fr" : "fr_tr";
}

function fromDbLanguagePair(languagePair: string): SupportedLanguagePair {
  return languagePair === "tr_fr" ? "tr-fr" : "fr-tr";
}

function toDbContributionType(type: string) {
  if (type === "new-sense") {
    return "new_sense";
  }

  return type;
}

function fromDbContributionType(type: string) {
  if (type === "new_sense") {
    return "new-sense";
  }

  return type as EntryContribution["type"];
}

function scoreSense(sense: DictionarySense) {
  return sense.votes.one + sense.votes.two * 2 + sense.votes.three * 3;
}

function mapEntry(record: any): DictionaryEntry {
  return {
    id: record.id,
    slug: record.slug,
    headword: record.headword,
    languageLabel: record.languageLabel,
    languagePair: fromDbLanguagePair(record.languagePair),
    pronunciation: record.pronunciation,
    ipa: record.ipa,
    summary: record.summary,
    domain: record.domain,
    contributionStatus: record.contributionStatus,
    relatedTerms: record.relatedTerms.map((term: any) => term.value),
    synonyms: record.synonyms.map((term: any) => term.value),
    antonyms: record.antonyms.map((term: any) => term.value),
    idioms: record.idioms.map((idiom: any) => ({
      phrase: idiom.phrase,
      meaning: idiom.meaning
    })),
    etymology: record.etymology,
    editorialNote: record.editorialNote,
    senses: record.senses.map((sense: any) => ({
      id: sense.id,
      order: sense.order,
      definition: sense.definition,
      translatedDefinition: sense.translatedDefinition,
      level: sense.level,
      register: sense.register,
      partOfSpeech: sense.partOfSpeech,
      note: sense.note,
      contributorName: sense.contributorName,
      examples: sense.examples.map((example: any) => ({
        source: example.source,
        target: example.target
      })),
      votes: {
        one: sense.voteOne,
        two: sense.voteTwo,
        three: sense.voteThree
      }
    })),
    contributions: record.contributions.map((contribution: any) => ({
      id: contribution.id,
      author: contribution.authorName,
      type: fromDbContributionType(contribution.type),
      summary: contribution.summary,
      status: contribution.status
    }))
  };
}

function mapProfile(record: any): ContributorProfile {
  return {
    id: record.id,
    handle: record.handle,
    name: record.name,
    profession: record.profession,
    bio: record.bio,
    languages: record.languages,
    focusAreas: record.focusAreas,
    stats: {
      entriesCreated: record.entriesCreated,
      contributions: record.contributionsCount,
      votesReceived: record.votesReceived
    },
    recentContributions: record.contributions.map((contribution: any) => ({
      entrySlug: contribution.entry.slug,
      label: contribution.entry.headword,
      summary: contribution.summary
    }))
  };
}

function buildEntryWhere(query?: string, languagePair?: string) {
  const normalizedQuery = query?.trim();

  return {
    languagePair: languagePair ? toDbLanguagePair(languagePair as SupportedLanguagePair) : undefined,
    OR: normalizedQuery
      ? [
          {
            headword: {
              contains: normalizedQuery,
              mode: "insensitive" as const
            }
          },
          {
            summary: {
              contains: normalizedQuery,
              mode: "insensitive" as const
            }
          },
          {
            relatedTerms: {
              some: {
                value: {
                  contains: normalizedQuery,
                  mode: "insensitive" as const
                }
              }
            }
          },
          {
            synonyms: {
              some: {
                value: {
                  contains: normalizedQuery,
                  mode: "insensitive" as const
                }
              }
            }
          },
          {
            antonyms: {
              some: {
                value: {
                  contains: normalizedQuery,
                  mode: "insensitive" as const
                }
              }
            }
          },
          {
            senses: {
              some: {
                OR: [
                  {
                    definition: {
                      contains: normalizedQuery,
                      mode: "insensitive" as const
                    }
                  },
                  {
                    translatedDefinition: {
                      contains: normalizedQuery,
                      mode: "insensitive" as const
                    }
                  }
                ]
              }
            }
          }
        ]
      : undefined
  } as const;
}

function normalizeTermArray(values?: string[]) {
  return (values ?? []).map((value) => value.trim()).filter(Boolean);
}

export class DictionaryStore {
  async listEntries({ query, languagePair, limit }: ListEntriesOptions = {}) {
    const records = await prisma.entry.findMany({
      where: buildEntryWhere(query, languagePair),
      include: entryInclude
    });

    return records
      .map(mapEntry)
      .sort((left, right) => {
        const leftScore = left.senses.reduce((total, sense) => total + scoreSense(sense), 0);
        const rightScore = right.senses.reduce((total, sense) => total + scoreSense(sense), 0);
        return rightScore - leftScore;
      })
      .slice(0, limit ?? records.length);
  }

  async countEntries({ query, languagePair }: Omit<ListEntriesOptions, "limit"> = {}) {
    return prisma.entry.count({
      where: buildEntryWhere(query, languagePair)
    });
  }

  async getEntryBySlug(slug: string) {
    const record = await findEntryRecordBySlug(slug);
    return record ? mapEntry(record) : null;
  }

  async createEntry(payload: CreateEntryPayload) {
    const slug = slugify(payload.headword);

    if (!slug) {
      throw new Error("Madde başlığından geçerli bir bağlantı üretilemedi.");
    }

    const existingEntry = await prisma.entry.findUnique({
      where: { slug }
    });

    if (existingEntry) {
      throw new Error("Bu başlık için zaten bir madde var.");
    }

    const contributor = payload.initialSense?.contributorName
      ? await prisma.profile.findUnique({
          where: {
            name: payload.initialSense.contributorName.trim()
          }
        })
      : null;

    const createdEntry = await prisma.$transaction(async (tx: any) => {
      const entry = await tx.entry.create({
        data: {
          id: `entry-${slug}`,
          slug,
          headword: payload.headword.trim(),
          languageLabel: payload.languageLabel.trim(),
          languagePair: toDbLanguagePair(payload.languagePair),
          pronunciation: payload.pronunciation.trim(),
          ipa: payload.ipa.trim(),
          summary: payload.summary.trim(),
          domain: payload.domain.trim(),
          contributionStatus: "Topluluk oylarına açık",
          etymology: payload.etymology?.trim() ?? "",
          editorialNote: payload.editorialNote?.trim() ?? "",
          relatedTerms: {
            create: normalizeTermArray(payload.relatedTerms).map((term, index) => ({
              value: term,
              order: index
            }))
          },
          synonyms: {
            create: normalizeTermArray(payload.synonyms).map((term, index) => ({
              value: term,
              order: index
            }))
          },
          antonyms: {
            create: normalizeTermArray(payload.antonyms).map((term, index) => ({
              value: term,
              order: index
            }))
          },
          idioms: {
            create: (payload.idioms ?? []).map((idiom, index) => ({
              phrase: idiom.phrase.trim(),
              meaning: idiom.meaning.trim(),
              order: index
            }))
          },
          senses: payload.initialSense
            ? {
                create: {
                  id: `sense-${slug}-1`,
                  order: 1,
                  definition: payload.initialSense.definition.trim(),
                  translatedDefinition: payload.initialSense.translatedDefinition.trim(),
                  level: payload.initialSense.level,
                  register: payload.initialSense.register.trim(),
                  partOfSpeech: payload.initialSense.partOfSpeech.trim(),
                  note: payload.initialSense.note.trim(),
                  contributorName: payload.initialSense.contributorName.trim(),
                  contributorId: contributor?.id,
                  examples: {
                    create: payload.initialSense.examples.map((example, index) => ({
                      source: example.source.trim(),
                      target: example.target.trim(),
                      order: index
                    }))
                  }
                }
              }
            : undefined,
          contributions: payload.initialSense
            ? {
                create: {
                  id: `contribution-${slug}-initial`,
                  authorName: payload.initialSense.contributorName.trim(),
                  authorId: contributor?.id,
                  type: "new_sense",
                  summary: "İlk anlam, madde oluşturulurken eklendi.",
                  status: "featured"
                }
              }
            : undefined
        },
        include: entryInclude
      });

      if (contributor && payload.initialSense) {
        await tx.profile.update({
          where: { id: contributor.id },
          data: {
            entriesCreated: { increment: 1 },
            contributionsCount: { increment: 1 }
          }
        });
      }

      return entry;
    });

    return mapEntry(createdEntry);
  }

  async updateEntry(slug: string, payload: UpdateEntryPayload) {
    const entry = await prisma.entry.findUnique({
      where: { slug }
    });

    if (!entry) {
      return null;
    }

    const updatedEntry = await prisma.$transaction(async (tx: any) => {
      await tx.entry.update({
        where: { slug },
        data: {
          headword: payload.headword?.trim(),
          languageLabel: payload.languageLabel?.trim(),
          languagePair: payload.languagePair ? toDbLanguagePair(payload.languagePair) : undefined,
          pronunciation: payload.pronunciation?.trim(),
          ipa: payload.ipa?.trim(),
          summary: payload.summary?.trim(),
          domain: payload.domain?.trim(),
          contributionStatus: payload.contributionStatus?.trim(),
          etymology: payload.etymology?.trim(),
          editorialNote: payload.editorialNote?.trim()
        }
      });

      if (payload.relatedTerms) {
        await tx.entryRelatedTerm.deleteMany({ where: { entryId: entry.id } });
        if (payload.relatedTerms.length > 0) {
          await tx.entryRelatedTerm.createMany({
            data: normalizeTermArray(payload.relatedTerms).map((term, index) => ({
              entryId: entry.id,
              value: term,
              order: index
            }))
          });
        }
      }

      if (payload.synonyms) {
        await tx.entrySynonym.deleteMany({ where: { entryId: entry.id } });
        if (payload.synonyms.length > 0) {
          await tx.entrySynonym.createMany({
            data: normalizeTermArray(payload.synonyms).map((term, index) => ({
              entryId: entry.id,
              value: term,
              order: index
            }))
          });
        }
      }

      if (payload.antonyms) {
        await tx.entryAntonym.deleteMany({ where: { entryId: entry.id } });
        if (payload.antonyms.length > 0) {
          await tx.entryAntonym.createMany({
            data: normalizeTermArray(payload.antonyms).map((term, index) => ({
              entryId: entry.id,
              value: term,
              order: index
            }))
          });
        }
      }

      if (payload.idioms) {
        await tx.entryIdiom.deleteMany({ where: { entryId: entry.id } });
        if (payload.idioms.length > 0) {
          await tx.entryIdiom.createMany({
            data: payload.idioms.map((idiom, index) => ({
              entryId: entry.id,
              phrase: idiom.phrase.trim(),
              meaning: idiom.meaning.trim(),
              order: index
            }))
          });
        }
      }

      return findEntryRecordById(entry.id);
    });

    return mapEntry(updatedEntry);
  }

  async createSense(slug: string, payload: CreateSensePayload) {
    const entry = await prisma.entry.findUnique({
      where: { slug },
      include: {
        senses: {
          select: { id: true }
        }
      }
    });

    if (!entry) {
      return null;
    }

    const contributor = await prisma.profile.findUnique({
      where: {
        name: payload.contributorName.trim()
      }
    });

    const sense = await prisma.$transaction(async (tx: any) => {
      const createdSense = await tx.sense.create({
        data: {
          id: `sense-${entry.slug}-${entry.senses.length + 1}`,
          order: entry.senses.length + 1,
          definition: payload.definition.trim(),
          translatedDefinition: payload.translatedDefinition.trim(),
          level: payload.level,
          register: payload.register.trim(),
          partOfSpeech: payload.partOfSpeech.trim(),
          note: payload.note.trim(),
          contributorName: payload.contributorName.trim(),
          contributorId: contributor?.id,
          entryId: entry.id,
          examples: {
            create: payload.examples.map((example, index) => ({
              source: example.source.trim(),
              target: example.target.trim(),
              order: index
            }))
          }
        },
        include: {
          examples: {
            orderBy: { order: "asc" }
          }
        }
      });

      await tx.contribution.create({
        data: {
          id: `contribution-${entry.slug}-${entry.senses.length + 1}`,
          entryId: entry.id,
          authorId: contributor?.id,
          authorName: payload.contributorName.trim(),
          type: "new_sense",
          summary: `${payload.contributorName.trim()} yeni bir anlam ekledi.`,
          status: "queued"
        }
      });

      if (contributor) {
        await tx.profile.update({
          where: { id: contributor.id },
          data: {
            contributionsCount: { increment: 1 }
          }
        });
      }

      return createdSense;
    });

    return {
      id: sense.id,
      order: sense.order,
      definition: sense.definition,
      translatedDefinition: sense.translatedDefinition,
      level: sense.level,
      register: sense.register,
      partOfSpeech: sense.partOfSpeech,
      note: sense.note,
      contributorName: sense.contributorName,
      examples: sense.examples.map((example: any) => ({
        source: example.source,
        target: example.target
      })),
      votes: {
        one: sense.voteOne,
        two: sense.voteTwo,
        three: sense.voteThree
      }
    } satisfies DictionarySense;
  }

  async updateSense(slug: string, senseId: string, payload: UpdateSensePayload) {
    const entry = await prisma.entry.findUnique({
      where: { slug }
    });

    if (!entry) {
      return null;
    }

    const sense = await prisma.sense.findFirst({
      where: {
        id: senseId,
        entryId: entry.id
      }
    });

    if (!sense) {
      return null;
    }

    const contributor = payload.contributorName
      ? await prisma.profile.findUnique({
          where: {
            name: payload.contributorName.trim()
          }
        })
      : null;

    const updatedSense = await prisma.$transaction(async (tx: any) => {
      await tx.sense.update({
        where: { id: senseId },
        data: {
          definition: payload.definition?.trim(),
          translatedDefinition: payload.translatedDefinition?.trim(),
          level: payload.level,
          register: payload.register?.trim(),
          partOfSpeech: payload.partOfSpeech?.trim(),
          note: payload.note?.trim(),
          contributorName: payload.contributorName?.trim(),
          contributorId: payload.contributorName ? contributor?.id ?? null : undefined
        }
      });

      if (payload.examples) {
        await tx.senseExample.deleteMany({ where: { senseId } });
        await tx.senseExample.createMany({
          data: payload.examples.map((example, index) => ({
            senseId,
            source: example.source.trim(),
            target: example.target.trim(),
            order: index
          }))
        });
      }

      return tx.sense.findUniqueOrThrow({
        where: { id: senseId },
        include: {
          examples: {
            orderBy: { order: "asc" }
          }
        }
      });
    });

    return {
      id: updatedSense.id,
      order: updatedSense.order,
      definition: updatedSense.definition,
      translatedDefinition: updatedSense.translatedDefinition,
      level: updatedSense.level,
      register: updatedSense.register,
      partOfSpeech: updatedSense.partOfSpeech,
      note: updatedSense.note,
      contributorName: updatedSense.contributorName,
      examples: updatedSense.examples.map((example: any) => ({
        source: example.source,
        target: example.target
      })),
      votes: {
        one: updatedSense.voteOne,
        two: updatedSense.voteTwo,
        three: updatedSense.voteThree
      }
    } satisfies DictionarySense;
  }

  async createContribution(payload: CreateContributionPayload) {
    const entry = await prisma.entry.findUnique({
      where: { slug: payload.entrySlug },
      include: {
        contributions: {
          select: { id: true }
        }
      }
    });

    if (!entry) {
      return null;
    }

    const author = await prisma.profile.findUnique({
      where: {
        name: payload.author.trim()
      }
    });

    const contribution = await prisma.$transaction(async (tx: any) => {
      const createdContribution = await tx.contribution.create({
        data: {
          id: `contribution-${entry.slug}-${entry.contributions.length + 1}`,
          entryId: entry.id,
          authorId: author?.id,
          authorName: payload.author.trim(),
          type: toDbContributionType(payload.type) as any,
          summary: payload.summary.trim(),
          status: payload.status ?? "queued"
        }
      });

      if (author) {
        await tx.profile.update({
          where: { id: author.id },
          data: {
            contributionsCount: { increment: 1 }
          }
        });
      }

      return createdContribution;
    });

    return {
      id: contribution.id,
      author: contribution.authorName,
      type: fromDbContributionType(contribution.type),
      summary: contribution.summary,
      status: contribution.status
    } satisfies EntryContribution;
  }

  async castVote(slug: string, senseId: string, payload: CastVotePayload) {
    const sense = await prisma.sense.findFirst({
      where: {
        id: senseId,
        entry: { slug }
      }
    });

    if (!sense) {
      return null;
    }

    if (payload.previousRating === payload.rating) {
      return {
        id: sense.id,
        order: sense.order,
        definition: sense.definition,
        translatedDefinition: sense.translatedDefinition,
        level: sense.level,
        register: sense.register,
        partOfSpeech: sense.partOfSpeech,
        note: sense.note,
        contributorName: sense.contributorName,
        examples: [],
        votes: {
          one: sense.voteOne,
          two: sense.voteTwo,
          three: sense.voteThree
        }
      } satisfies DictionarySense;
    }

    const nextVoteOne = Math.max(0, sense.voteOne - (payload.previousRating === 1 ? 1 : 0)) + (payload.rating === 1 ? 1 : 0);
    const nextVoteTwo = Math.max(0, sense.voteTwo - (payload.previousRating === 2 ? 1 : 0)) + (payload.rating === 2 ? 1 : 0);
    const nextVoteThree = Math.max(0, sense.voteThree - (payload.previousRating === 3 ? 1 : 0)) + (payload.rating === 3 ? 1 : 0);
    const voteDelta = (payload.rating ?? 0) - (payload.previousRating ?? 0);

    const updatedSense = await prisma.$transaction(async (tx: any) => {
      const nextSense = await tx.sense.update({
        where: { id: senseId },
        data: {
          voteOne: nextVoteOne,
          voteTwo: nextVoteTwo,
          voteThree: nextVoteThree
        },
        include: {
          examples: {
            orderBy: { order: "asc" }
          }
        }
      });

      if (sense.contributorId && voteDelta !== 0) {
        const profile = await tx.profile.findUnique({
          where: { id: sense.contributorId },
          select: { votesReceived: true }
        });

        await tx.profile.update({
          where: { id: sense.contributorId },
          data: {
            votesReceived: Math.max(0, (profile?.votesReceived ?? 0) + voteDelta)
          }
        });
      }

      return nextSense;
    });

    return {
      id: updatedSense.id,
      order: updatedSense.order,
      definition: updatedSense.definition,
      translatedDefinition: updatedSense.translatedDefinition,
      level: updatedSense.level,
      register: updatedSense.register,
      partOfSpeech: updatedSense.partOfSpeech,
      note: updatedSense.note,
      contributorName: updatedSense.contributorName,
      examples: updatedSense.examples.map((example: any) => ({
        source: example.source,
        target: example.target
      })),
      votes: {
        one: updatedSense.voteOne,
        two: updatedSense.voteTwo,
        three: updatedSense.voteThree
      }
    } satisfies DictionarySense;
  }

  async listProfiles() {
    const records = await findProfilesWithRecentContributions();
    return records.map(mapProfile);
  }

  async getProfileByHandle(handle: string) {
    const record = await findProfileRecordByHandle(handle);
    return record ? mapProfile(record) : null;
  }
}

export const dictionaryStore = new DictionaryStore();
