// src/index.ts
import { IgnitorApp } from "./core/IgnitorApp";
import { AppLogger } from "./core/logging/logger";
import { config } from "./core/config";

// Providers (Infrastructure)
import { PrismaProvider } from "./providers/PrismaProvider";
import { prisma } from "./lib/prisma";

// Modules (Business Logic)
import { AuthModule } from "./modules/Auth/AuthModule";

// Initialize the Ignitor Engine
const ignitor = new IgnitorApp();
const expressApp = ignitor.getApp();

let isInitialized = false;
let initializationPromise: Promise<void> | null = null;

async function bootstrap() {
  try {
    AppLogger.info("🗹 Starting application bootstrap");

    // 1. Register Infrastructure Providers
    AppLogger.info("⚙ Registering infrastructure...");
    ignitor.getContext().registerProvider("prisma", new PrismaProvider(prisma));

    // 2. Register Application Modules
    AppLogger.info("⚙ Registering modules...");
    ignitor.registerModule(new AuthModule());
    // ignitor.registerModule(new ProductModule());
    AppLogger.info("✔ All modules registered successfully");

    // 3. Spark the server!
    await ignitor.spark(config.server.port);

    AppLogger.info("✷ Ignitor sparked successfully");
    isInitialized = true;
  } catch (error) {
    AppLogger.error("⬤ Failed to initialize application:", {
      error: error instanceof Error ? error : new Error(String(error)),
      context: "application-bootstrap",
      stack: error instanceof Error ? error.stack : undefined,
    });
    throw error;
  }
}

// Handler for Vercel
export default async (req: any, res: any) => {
  if (!isInitialized) {
    if (!initializationPromise) {
      initializationPromise = bootstrap();
    }
    await initializationPromise;
  }
  return expressApp(req, res);
};

// Automatic start for local development
if (process.env.VERCEL !== "1") {
  bootstrap().catch((err) => {
    AppLogger.error("❌ Unhandled bootstrap error:", { error: err });
    process.exit(1);
  });
}
