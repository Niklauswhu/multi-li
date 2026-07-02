import { z } from "zod";
import type { ReadingLevelNumber } from "./reading.js";

/**
 * Ebbinghaus forgetting-curve review offsets (in days) counted from the day
 * a book is first completed: reviews land on day 1, 2, 4, 7 and 15.
 */
export const ebbinghausIntervalsDays = [1, 2, 4, 7, 15] as const;
export type ReviewStage = 1 | 2 | 3 | 4 | 5;

export const studyPlanSchema = z.object({
  learnerId: z.string().min(1),
  currentLevel: z.number().int().min(1).max(5),
  booksPerWeek: z.number().int().min(1).max(14),
  reviewReminderHour: z.number().int().min(0).max(23).default(18)
});

export type StudyPlan = z.infer<typeof studyPlanSchema> & {
  currentLevel: ReadingLevelNumber;
  updatedAt: string;
};

export const bookCompletionSchema = z.object({
  learnerId: z.string().min(1),
  bookId: z.string().min(1),
  quizCorrect: z.number().int().min(0),
  quizTotal: z.number().int().min(1)
});

export type BookCompletionInput = z.infer<typeof bookCompletionSchema>;

export type BookCompletion = BookCompletionInput & {
  id: string;
  completedAt: string;
};

export type ReviewTaskStatus = "pending" | "done";

export type ReviewTask = {
  id: string;
  learnerId: string;
  bookId: string;
  stage: ReviewStage;
  dueAt: string;
  status: ReviewTaskStatus;
  completedAt: string | null;
};

/**
 * Builds the five spaced-repetition review tasks for one completed book.
 * Each task is due at the learner's reminder hour on the scheduled day.
 */
export function buildReviewSchedule(
  completionId: string,
  learnerId: string,
  bookId: string,
  completedAt: Date,
  reminderHour = 18
): ReviewTask[] {
  return ebbinghausIntervalsDays.map((offsetDays, index) => {
    const dueDate = new Date(completedAt);
    dueDate.setDate(dueDate.getDate() + offsetDays);
    dueDate.setHours(reminderHour, 0, 0, 0);

    return {
      id: `${completionId}-stage-${index + 1}`,
      learnerId,
      bookId,
      stage: (index + 1) as ReviewStage,
      dueAt: dueDate.toISOString(),
      status: "pending",
      completedAt: null
    };
  });
}

export type ReviewQueue = {
  dueNow: ReviewTask[];
  upcoming: ReviewTask[];
  done: ReviewTask[];
};

/** Splits review tasks into due-now, upcoming and finished buckets. */
export function partitionReviewTasks(tasks: ReviewTask[], now: Date): ReviewQueue {
  const dueNow: ReviewTask[] = [];
  const upcoming: ReviewTask[] = [];
  const done: ReviewTask[] = [];

  for (const task of tasks) {
    if (task.status === "done") {
      done.push(task);
    } else if (new Date(task.dueAt).getTime() <= now.getTime()) {
      dueNow.push(task);
    } else {
      upcoming.push(task);
    }
  }

  const byDueDate = (a: ReviewTask, b: ReviewTask) =>
    new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime();

  dueNow.sort(byDueDate);
  upcoming.sort(byDueDate);
  done.sort((a, b) => byDueDate(b, a));

  return { dueNow, upcoming, done };
}
