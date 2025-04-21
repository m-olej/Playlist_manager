import Fastify from "fastify";
import cors from "@fastify/cors";
import { ItemType } from "@shared/types";
import { authRoutes } from "./auth";

const server = Fastify({
  logger: {
    level: "debug",
    transport: {
      target: "pino-pretty",
      options: {
        colorize: true,
        translateTime: "SYS:standard",
        ignore: "pid,hostname",
      },
    },
  },
});

const start = async () => {
  await server.register(cors, {
    origin: "*", // For dev, allow all. Lock it down in prod.
    credentials: true,
  });
  await server.register(authRoutes, { prefix: "/auth" });

  try {
    await server.listen({ port: 3123 });
    server.log.info("🚀 Fastify server running on http://localhost:3123");
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
