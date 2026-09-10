import app from "./app";
import { env } from "./config/env";
import { logger } from "./lib/logger";
import { prisma } from "./lib/prisma";

const PORT = env.port;

async function main() {
  try {
    // Test DB connection
    await prisma.$connect();
    logger.info("Database connected successfully");

    const server = app.listen(PORT, () => {
      logger.info(`Hotel Newlands API running on port ${PORT} [${env.nodeEnv}]`);
    });

    // Graceful shutdown
    process.on("SIGTERM", async () => {
      logger.info("SIGTERM received, shutting down gracefully...");
      server.close(async () => {
        await prisma.$disconnect();
        logger.info("Server closed");
        process.exit(0);
      });
    });

    process.on("SIGINT", async () => {
      logger.info("SIGINT received, shutting down gracefully...");
      server.close(async () => {
        await prisma.$disconnect();
        process.exit(0);
      });
    });
  } catch (error) {
    logger.error("Failed to start server:", error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

main();
