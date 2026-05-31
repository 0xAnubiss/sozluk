import {
  PrismaClient,
  type ContributionStatus,
  type ContributionType,
  type SupportedLanguagePair
} from "@prisma/client";
import { contributorProfiles, dictionaryEntries } from "../../shared/mock-data";

const prisma = new PrismaClient();

function toPrismaLanguagePair(languagePair: string): SupportedLanguagePair {
  return languagePair === "tr-fr" ? "tr_fr" : "fr_tr";
}

function toPrismaContributionType(type: string): ContributionType {
  if (type === "new-sense") {
    return "new_sense";
  }

  return type as ContributionType;
}

function toPrismaContributionStatus(status: string): ContributionStatus {
  return status as ContributionStatus;
}

async function seed() {
  await prisma.senseExample.deleteMany();
  await prisma.contribution.deleteMany();
  await prisma.sense.deleteMany();
  await prisma.entryIdiom.deleteMany();
  await prisma.entrySynonym.deleteMany();
  await prisma.entryAntonym.deleteMany();
  await prisma.entryRelatedTerm.deleteMany();
  await prisma.entry.deleteMany();
  await prisma.profile.deleteMany();

  for (const profile of contributorProfiles) {
    await prisma.profile.create({
      data: {
        id: profile.id,
        handle: profile.handle,
        name: profile.name,
        profession: profile.profession,
        bio: profile.bio,
        languages: profile.languages,
        focusAreas: profile.focusAreas,
        entriesCreated: profile.stats.entriesCreated,
        contributionsCount: profile.stats.contributions,
        votesReceived: profile.stats.votesReceived
      }
    });
  }

  for (const entry of dictionaryEntries) {
    const senseCreates = entry.senses.map((sense) => {
      const contributor = contributorProfiles.find((profile) => profile.name === sense.contributorName);

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
        contributorId: contributor?.id,
        voteOne: sense.votes.one,
        voteTwo: sense.votes.two,
        voteThree: sense.votes.three,
        examples: {
          create: sense.examples.map((example, index) => ({
            source: example.source,
            target: example.target,
            order: index
          }))
        }
      };
    });

    const contributionCreates = entry.contributions.map((contribution) => {
      const author = contributorProfiles.find((profile) => profile.name === contribution.author);

      return {
        id: contribution.id,
        authorName: contribution.author,
        authorId: author?.id,
        type: toPrismaContributionType(contribution.type),
        summary: contribution.summary,
        status: toPrismaContributionStatus(contribution.status)
      };
    });

    await prisma.entry.create({
      data: {
        id: entry.id,
        slug: entry.slug,
        headword: entry.headword,
        languageLabel: entry.languageLabel,
        languagePair: toPrismaLanguagePair(entry.languagePair),
        pronunciation: entry.pronunciation,
        ipa: entry.ipa,
        summary: entry.summary,
        domain: entry.domain,
        contributionStatus: entry.contributionStatus,
        etymology: entry.etymology,
        editorialNote: entry.editorialNote,
        relatedTerms: {
          create: entry.relatedTerms.map((term, index) => ({
            value: term,
            order: index
          }))
        },
        synonyms: {
          create: entry.synonyms.map((term, index) => ({
            value: term,
            order: index
          }))
        },
        antonyms: {
          create: entry.antonyms.map((term, index) => ({
            value: term,
            order: index
          }))
        },
        idioms: {
          create: entry.idioms.map((idiom, index) => ({
            phrase: idiom.phrase,
            meaning: idiom.meaning,
            order: index
          }))
        },
        senses: {
          create: senseCreates
        },
        contributions: {
          create: contributionCreates
        }
      }
    });
  }
}

seed()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
