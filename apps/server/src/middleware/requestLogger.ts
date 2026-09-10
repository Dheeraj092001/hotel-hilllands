import morgan from "morgan";
import { logger } from "../lib/logger";
import { isDev } from "../config/env";

const stream = {
  write: (message: string) => logger.http(message.trim()),
};

export const requestLogger = morgan(
  isDev ? "dev" : "combined",
  { stream }
);
