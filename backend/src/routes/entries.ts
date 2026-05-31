import type { FastifyInstance } from "fastify";
import { z } from "zod";
import {
  contributionStatuses,
  contributionTypes,
  languageLevels,
  supportedLanguagePairs
} from "../../../shared/dictionary-contracts";
import { dictionaryStore } from "../store/dictionary-store";

const exampleSchema = z.object({
  source: z.string().min(1),
  target: z.string().min(1)
});

const idiomSchema = z.object({
  phrase: z.string().min(1),
  meaning: z.string().min(1)
});

const createSenseSchema = z.object({
  definition: z.string().min(1),
  translatedDefinition: z.string().min(1),
  level: z.enum(languageLevels),
  register: z.string().min(1),
  partOfSpeech: z.string().min(1),
  note: z.string().min(1),
  contributorName: z.string().min(1),
  examples: z.array(exampleSchema).min(1)
});

const updateSenseSchema = z.object({
  definition: z.string().min(1).optional(),
  translatedDefinition: z.string().min(1).optional(),
  level: z.enum(languageLevels).optional(),
  register: z.string().min(1).optional(),
  partOfSpeech: z.string().min(1).optional(),
  note: z.string().min(1).optional(),
  contributorName: z.string().min(1).optional(),
  examples: z.array(exampleSchema).min(1).optional()
});

const createEntrySchema = z.object({
  headword: z.string().min(1),
  languageLabel: z.string().min(1),
  languagePair: z.enum(supportedLanguagePairs),
  pronunciation: z.string().min(1),
  ipa: z.string().min(1),
  summary: z.string().min(1),
  domain: z.string().min(1),
  relatedTerms: z.array(z.string().min(1)).optional(),
  synonyms: z.array(z.string().min(1)).optional(),
  antonyms: z.array(z.string().min(1)).optional(),
  etymology: z.string().optional(),
  editorialNote: z.string().optional(),
  idioms: z.array(idiomSchema).optional(),
  initialSense: createSenseSchema.optional()
});

const updateEntrySchema = z.object({
  headword: z.string().min(1).optional(),
  languageLabel: z.string().min(1).optional(),
  languagePair: z.enum(supportedLanguagePairs).optional(),
  pronunciation: z.string().min(1).optional(),
  ipa: z.string().min(1).optional(),
  summary: z.string().min(1).optional(),
  domain: z.string().min(1).optional(),
  contributionStatus: z.string().min(1).optional(),
  relatedTerms: z.array(z.string().min(1)).optional(),
  synonyms: z.array(z.string().min(1)).optional(),
  antonyms: z.array(z.string().min(1)).optional(),
  idioms: z.array(idiomSchema).optional(),
  etymology: z.string().optional(),
  editorialNote: z.string().optional()
});

const createContributionSchema = z.object({
  entrySlug: z.string().min(1),
  author: z.string().min(1),
  type: z.enum(contributionTypes),
  summary: z.string().min(1),
  status: z.enum(contributionStatuses).optional()
});

const castVoteSchema = z.object({
  rating: z.union([z.literal(1), z.literal(2), z.literal(3), z.null()]),
  previousRating: z.union([z.literal(1), z.literal(2), z.literal(3), z.null()]).optional()
});

const querySchema = z.object({
  q: z.string().optional(),
  pair: z.enum(supportedLanguagePairs).optional(),
  limit: z.coerce.number().int().positive().max(50).optional()
});

export async function registerEntryRoutes(app: FastifyInstance) {
  app.get("/entries", async (request) => {
    const query = querySchema.parse(request.query);
    return {
      items: await dictionaryStore.listEntries({
        query: query.q,
        languagePair: query.pair,
        limit: query.limit
      }),
      total: await dictionaryStore.countEntries({
        query: query.q,
        languagePair: query.pair
      })
    };
  });

  app.get("/entries/:slug", async (request, reply) => {
    const params = z.object({ slug: z.string().min(1) }).parse(request.params);
    const entry = await dictionaryStore.getEntryBySlug(params.slug);

    if (!entry) {
      return reply.code(404).send({ message: "Madde bulunamadı." });
    }

    return entry;
  });

  app.post("/entries", async (request, reply) => {
    const payload = createEntrySchema.parse(request.body);

    try {
      const entry = await dictionaryStore.createEntry(payload);
      return reply.code(201).send(entry);
    } catch (error) {
      return reply.code(409).send({
        message: error instanceof Error ? error.message : "Madde oluşturulamadı."
      });
    }
  });

  app.patch("/entries/:slug", async (request, reply) => {
    const params = z.object({ slug: z.string().min(1) }).parse(request.params);
    const payload = updateEntrySchema.parse(request.body);
    const entry = await dictionaryStore.updateEntry(params.slug, payload);

    if (!entry) {
      return reply.code(404).send({ message: "Madde bulunamadı." });
    }

    return entry;
  });

  app.post("/entries/:slug/senses", async (request, reply) => {
    const params = z.object({ slug: z.string().min(1) }).parse(request.params);
    const payload = createSenseSchema.parse(request.body);
    const sense = await dictionaryStore.createSense(params.slug, payload);

    if (!sense) {
      return reply.code(404).send({ message: "Madde bulunamadı." });
    }

    return reply.code(201).send(sense);
  });

  app.patch("/entries/:slug/senses/:senseId", async (request, reply) => {
    const params = z
      .object({
        slug: z.string().min(1),
        senseId: z.string().min(1)
      })
      .parse(request.params);
    const payload = updateSenseSchema.parse(request.body);
    const sense = await dictionaryStore.updateSense(params.slug, params.senseId, payload);

    if (!sense) {
      return reply.code(404).send({ message: "Anlam bulunamadı." });
    }

    return sense;
  });

  app.post("/entries/:slug/senses/:senseId/votes", async (request, reply) => {
    const params = z
      .object({
        slug: z.string().min(1),
        senseId: z.string().min(1)
      })
      .parse(request.params);
    const payload = castVoteSchema.parse(request.body);
    const sense = await dictionaryStore.castVote(params.slug, params.senseId, payload);

    if (!sense) {
      return reply.code(404).send({ message: "Anlam bulunamadı." });
    }

    return sense;
  });

  app.post("/contributions", async (request, reply) => {
    const payload = createContributionSchema.parse(request.body);
    const contribution = await dictionaryStore.createContribution(payload);

    if (!contribution) {
      return reply.code(404).send({ message: "Madde bulunamadı." });
    }

    return reply.code(201).send(contribution);
  });
}
