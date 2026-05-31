import cors from "@fastify/cors";
import Fastify from "fastify";
import { ZodError } from "zod";
import { registerEntryRoutes } from "./routes/entries";
import { registerProfileRoutes } from "./routes/profiles";

export async function buildServer() {
  const app = Fastify({
    logger: true
  });

  await app.register(cors, {
    origin: true
  });

  app.get("/health", async () => {
    return {
      status: "ok",
      service: "kalem-sozluk-backend"
    };
  });

  await registerEntryRoutes(app);
  await registerProfileRoutes(app);

  app.setErrorHandler((error, _request, reply) => {
    if (error instanceof ZodError) {
      return reply.code(400).send({
        message: "Validation failed.",
        issues: error.issues
      });
    }

    app.log.error(error);
    return reply.code(500).send({
      message: "Unexpected server error."
    });
  });

  return app;
}
