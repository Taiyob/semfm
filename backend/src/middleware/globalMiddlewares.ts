// src/middleware/globalMiddlewares.ts
import express, { Express, Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";
import { config } from "@/core/config";
import { requestLogger } from "./requestLogger";
import { requestId } from "./requestId";
import { TimeoutError, RateLimitError } from "@/core/errors/AppError";
import timeout from "connect-timeout";

export function setupGlobalMiddlewares(app: Express) {
  app.set("trust proxy", 1);
  app.use(requestId());
  app.use(
    helmet({
      contentSecurityPolicy: config.server.isProduction,
      crossOriginEmbedderPolicy: config.server.isProduction,
    }),
  );

  app.use(
    cors({
      origin: (origin, callback) => {
        const allowedOrigins = config.security.cors.allowedOrigins.split(",").map(o => o.trim());
        // Allow requests with no origin (like mobile apps or curl)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.indexOf(origin) !== -1 || origin.endsWith('.vercel.app')) {
          callback(null, true);
        } else {
          callback(null, true); // Fallback to allow during transition, but better to be strict later
        }
      },
      credentials: true,
      optionsSuccessStatus: 200,
    }),
  );

  app.use(cookieParser());
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true, limit: "10mb" }));
  app.use(requestLogger());

  // Timeout middleware
  const timeoutMs = config.server.requestTimeout || 30000;
  app.use(timeout(`${timeoutMs}ms`));

  app.use((req: Request, res: Response, next: NextFunction) => {
    const controller = new AbortController();
    req.abortSignal = controller.signal;

    // Trigger AbortSignal if connect-timeout fires
    req.on("timeout", () => {
      controller.abort("Request Timeout");
    });

    // Trigger AbortSignal if the user closes their browser tab early
    res.on("close", () => {
      if (!res.writableFinished && !req.timedout) {
        controller.abort("Client Disconnected");
      }
    });

    next();
  });

  // Rate Limiting
  if (config.server.isProduction) {
    app.use(
      rateLimit({
        windowMs: config.security.rateLimit.windowMs,
        max: config.security.rateLimit.max,
        handler: (_: Request, __: Response, next: NextFunction) => {
          next(new RateLimitError("Too many requests"));
        },
        skip: (req) => req.path === "/health",
      }),
    );
  }
}
