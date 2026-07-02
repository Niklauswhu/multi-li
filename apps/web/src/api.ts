import type {
  BookCompletion,
  BookCompletionInput,
  LearnerProfile,
  Lesson,
  ProgressSnapshot,
  ReadingBook,
  ReadingBookSummary,
  ReadingLevel,
  ReviewQueue,
  ReviewTask,
  StudyPlan
} from "@multi-li/shared";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? "";

async function requestJson<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${apiBaseUrl}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...init?.headers
    },
    ...init
  });

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export function getLearners() {
  return requestJson<{ learners: LearnerProfile[] }>("/api/learners");
}

export function getFeaturedLesson() {
  return requestJson<{ lesson: Lesson }>("/api/lessons/featured");
}

export function saveProgress(progress: ProgressSnapshot) {
  return requestJson<{ message: string; progress: ProgressSnapshot & { recordedAt: string } }>(
    "/api/progress",
    {
      method: "POST",
      body: JSON.stringify(progress)
    }
  );
}

export type LevelWithBooks = ReadingLevel & { books: ReadingBookSummary[] };

export function getReadingLevels() {
  return requestJson<{ levels: LevelWithBooks[] }>("/api/reading/levels");
}

export function getReadingBook(bookId: string) {
  return requestJson<{ book: ReadingBook }>(`/api/reading/books/${bookId}`);
}

export function getStudyPlan(learnerId: string) {
  return requestJson<{ plan: StudyPlan }>(`/api/study-plan/${learnerId}`);
}

export function saveStudyPlan(
  learnerId: string,
  plan: Pick<StudyPlan, "currentLevel" | "booksPerWeek" | "reviewReminderHour">
) {
  return requestJson<{ plan: StudyPlan; message: string }>(`/api/study-plan/${learnerId}`, {
    method: "PUT",
    body: JSON.stringify(plan)
  });
}

export function recordBookCompletion(input: BookCompletionInput) {
  return requestJson<{
    completion: BookCompletion;
    reviewTasks: ReviewTask[];
    message: string;
  }>("/api/reading/completions", {
    method: "POST",
    body: JSON.stringify(input)
  });
}

export function getCompletions(learnerId: string) {
  return requestJson<{ completions: BookCompletion[] }>(
    `/api/reading/completions?learnerId=${encodeURIComponent(learnerId)}`
  );
}

export function getReviewQueue(learnerId: string) {
  return requestJson<{ queue: ReviewQueue }>(`/api/reviews/${learnerId}`);
}

export function completeReviewTask(taskId: string) {
  return requestJson<{ task: ReviewTask; message: string }>(
    `/api/reviews/${encodeURIComponent(taskId)}/complete`,
    { method: "POST" }
  );
}
