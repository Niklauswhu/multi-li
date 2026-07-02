import cors from "cors";
import express, { type Request, type Response } from "express";
import helmet from "helmet";
import morgan from "morgan";
import {
  bookCompletionSchema,
  buildReviewSchedule,
  getBookById,
  getBooksByLevel,
  getFeaturedLesson,
  learnerProfiles,
  partitionReviewTasks,
  progressSchema,
  readingLevels,
  studyPlanSchema,
  toBookSummary,
  type BookCompletion,
  type ProgressSnapshot,
  type ReadingLevelNumber,
  type ReviewTask,
  type StudyPlan
} from "@multi-li/shared";
import { ZodError } from "zod";

const defaultWebOrigin = "http://localhost:5173";

type StoredProgress = ProgressSnapshot & {
  recordedAt: string;
};

const progressLog: StoredProgress[] = [];
const studyPlans = new Map<string, StudyPlan>();
const completions: BookCompletion[] = [];
const reviewTasks: ReviewTask[] = [];

function defaultStudyPlan(learnerId: string): StudyPlan {
  return {
    learnerId,
    currentLevel: 1,
    booksPerWeek: 3,
    reviewReminderHour: 18,
    updatedAt: new Date().toISOString()
  };
}

function handleValidationError(error: unknown, response: Response): boolean {
  if (error instanceof ZodError) {
    response.status(400).json({
      message: "Payload is invalid",
      issues: error.issues
    });
    return true;
  }
  return false;
}

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

  app.get("/api/reading/levels", (_request: Request, response: Response) => {
    response.json({
      levels: readingLevels.map((level) => ({
        ...level,
        books: getBooksByLevel(level.level).map(toBookSummary)
      }))
    });
  });

  app.get("/api/reading/books/:bookId", (request: Request, response: Response) => {
    const book = getBookById(String(request.params.bookId));

    if (!book) {
      response.status(404).json({ message: "Book not found" });
      return;
    }

    response.json({ book });
  });

  app.get("/api/study-plan/:learnerId", (request: Request, response: Response) => {
    const learnerId = String(request.params.learnerId);
    const plan = studyPlans.get(learnerId) ?? defaultStudyPlan(learnerId);

    response.json({ plan });
  });

  app.put("/api/study-plan/:learnerId", (request: Request, response: Response) => {
    try {
      const parsed = studyPlanSchema.parse({
        ...request.body,
        learnerId: request.params.learnerId
      });
      const plan: StudyPlan = {
        ...parsed,
        currentLevel: parsed.currentLevel as ReadingLevelNumber,
        updatedAt: new Date().toISOString()
      };

      studyPlans.set(plan.learnerId, plan);
      response.json({ plan, message: "Study plan saved" });
    } catch (error) {
      if (handleValidationError(error, response)) {
        return;
      }
      throw error;
    }
  });

  app.post("/api/reading/completions", (request: Request, response: Response) => {
    try {
      const input = bookCompletionSchema.parse(request.body);
      const book = getBookById(input.bookId);

      if (!book) {
        response.status(404).json({ message: "Book not found" });
        return;
      }

      const completedAt = new Date();
      const completion: BookCompletion = {
        ...input,
        id: `completion-${completions.length + 1}-${input.bookId}`,
        completedAt: completedAt.toISOString()
      };
      completions.push(completion);

      const reminderHour =
        studyPlans.get(input.learnerId)?.reviewReminderHour ??
        defaultStudyPlan(input.learnerId).reviewReminderHour;
      const schedule = buildReviewSchedule(
        completion.id,
        input.learnerId,
        input.bookId,
        completedAt,
        reminderHour
      );
      reviewTasks.push(...schedule);

      response.status(201).json({
        completion,
        reviewTasks: schedule,
        message: "Reading recorded and review schedule created"
      });
    } catch (error) {
      if (handleValidationError(error, response)) {
        return;
      }
      throw error;
    }
  });

  app.get("/api/reading/completions", (request: Request, response: Response) => {
    const learnerId = String(request.query.learnerId ?? "");
    const items = learnerId
      ? completions.filter((completion) => completion.learnerId === learnerId)
      : completions;

    response.json({ completions: items });
  });

  app.get("/api/reviews/:learnerId", (request: Request, response: Response) => {
    const learnerId = String(request.params.learnerId);
    const tasks = reviewTasks.filter((task) => task.learnerId === learnerId);

    response.json({
      queue: partitionReviewTasks(tasks, new Date())
    });
  });

  app.post("/api/reviews/:taskId/complete", (request: Request, response: Response) => {
    const task = reviewTasks.find((candidate) => candidate.id === request.params.taskId);

    if (!task) {
      response.status(404).json({ message: "Review task not found" });
      return;
    }

    if (task.status === "done") {
      response.status(409).json({ message: "Review task already completed", task });
      return;
    }

    task.status = "done";
    task.completedAt = new Date().toISOString();

    response.json({ task, message: "Review completed" });
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
