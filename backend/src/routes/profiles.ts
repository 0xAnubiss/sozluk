import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { dictionaryStore } from "../store/dictionary-store";

export async function registerProfileRoutes(app: FastifyInstance) {
  app.get("/profiles", async () => {
    const profiles = await dictionaryStore.listProfiles();
    return {
      items: profiles,
      total: profiles.length
    };
  });

  app.get("/profiles/:handle", async (request, reply) => {
    const params = z.object({ handle: z.string().min(1) }).parse(request.params);
    const profile = await dictionaryStore.getProfileByHandle(params.handle);

    if (!profile) {
      return reply.code(404).send({ message: "Profil bulunamadı." });
    }

    return profile;
  });
}
