import cors from "cors";
import express, { type Request, type Response } from "express";
import helmet from "helmet";
import morgan from "morgan";
import {
  getFeaturedLesson,
  learnerProfiles,
  progressSchema,
  type ProgressSnapshot
} from "@multi-li/shared";
import { ZodError } from "zod";

const defaultWebOrigin = "http://localhost:5173";

type StoredProgress = ProgressSnapshot & {
  recordedAt: string;
};

const progressLog: StoredProgress[] = [];

export function createApp() {
  const app = express();
  const webOrigin = process.env.WEB_ORIGIN ?? defaultWebOrigin;

  app.use(helmet());
  app.use(
    cors({
      origin: webOrigin,
      credentials: true
    })
  );
  app.use(express.json());
  app.use(morgan("tiny"));

  app.get("/health", (_request: Request, response: Response) => {
    response.json({
      status: "ok",
      service: "multi-li-api",
      version: "0.1.0"
    });
  });

  app.get("/api/learners", (_request: Request, response: Response) => {
    response.json({
      learners: learnerProfiles
    });
  });

  app.get("/api/lessons/featured", (_request: Request, response: Response) => {
    response.json({
      lesson: getFeaturedLesson()
    });
  });

  app.post("/api/progress", (request: Request, response: Response) => {
    try {
      const progress = progressSchema.parse(request.body);
      const storedProgress: StoredProgress = {
        ...progress,
        recordedAt: new Date().toISOString()
      };

      progressLog.push(storedProgress);

      response.status(201).json({
        progress: storedProgress,
        message: "Progress saved"
      });
    } catch (error) {
      if (error instanceof ZodError) {
        response.status(400).json({
          message: "Progress payload is invalid",
          issues: error.issues
        });
        return;
      }

      throw error;
    }
  });

  app.get("/api/progress", (_request: Request, response: Response) => {
    response.json({
      progress: progressLog
    });
  });

  return app;
}
