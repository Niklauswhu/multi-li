import type { LearnerProfile, Lesson, ProgressSnapshot } from "@multi-li/shared";

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
