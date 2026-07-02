import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import App from "./App";

const learnersPayload = {
  learners: [
    {
      id: "learner-1",
      displayName: "Mia",
      ageRange: "5-7",
      homeLocale: "es-MX",
      cefrBand: "pre-a1",
      weeklyGoalMinutes: 45
    }
  ]
};

const lessonPayload = {
  lesson: {
    id: "lesson-sunny-market",
    title: "Sunny Market",
    theme: "Food and friendly greetings",
    level: "pre-a1",
    targetWords: ["apple", "banana"],
    sentenceFrame: "I would like a ____.",
    encouragement: "Say it with a big market smile.",
    activities: [
      {
        id: "listen-market-words",
        title: "Listen and point",
        skill: "listening",
        estimatedMinutes: 4,
        prompt: "Hear each market word and tap the matching picture."
      }
    ]
  }
};

const testBook = {
  id: "l1-my-family",
  level: 1,
  title: "My Family",
  coverEmoji: "👨‍👩‍👧‍👦",
  synopsis: "Meet Finn, Bella and their cat Tofu at home.",
  phonicsFocus: "Initial sounds m, d, c",
  targetWords: ["mum", "dad"],
  wordCount: 12,
  pages: [
    { pageNumber: 1, illustration: "👩", text: "Mum." },
    { pageNumber: 2, illustration: "👨", text: "Dad." }
  ],
  quiz: [
    {
      id: "q1",
      question: "Who is Tofu?",
      options: ["The dad", "The cat"],
      answerIndex: 1
    }
  ]
};

const levelsPayload = {
  levels: [
    {
      level: 1,
      name: "First Words",
      bandColor: "#f2a9c4",
      description: "Single words and tiny labels supported by big pictures.",
      sentenceStyle: "One or two words per page",
      wordsPerBook: "10-20 words",
      books: [
        {
          id: testBook.id,
          level: testBook.level,
          title: testBook.title,
          coverEmoji: testBook.coverEmoji,
          synopsis: testBook.synopsis,
          phonicsFocus: testBook.phonicsFocus,
          targetWords: testBook.targetWords,
          wordCount: testBook.wordCount
        }
      ]
    }
  ]
};

const emptyQueuePayload = {
  queue: { dueNow: [], upcoming: [], done: [] }
};

type FetchStub = {
  reviewQueue?: unknown;
};

function jsonResponse(payload: unknown, status = 200) {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => payload
  };
}

const fetchMock = vi.fn();

function stubRoutes(overrides: FetchStub = {}) {
  fetchMock.mockImplementation(async (input: string, init?: RequestInit) => {
    const url = String(input);
    const method = init?.method ?? "GET";

    if (url === "/api/learners") {
      return jsonResponse(learnersPayload);
    }
    if (url === "/api/lessons/featured") {
      return jsonResponse(lessonPayload);
    }
    if (url === "/api/reading/levels") {
      return jsonResponse(levelsPayload);
    }
    if (url === `/api/reading/books/${testBook.id}`) {
      return jsonResponse({ book: testBook });
    }
    if (url.startsWith("/api/reviews/learner-1") && method === "GET") {
      return jsonResponse(overrides.reviewQueue ?? emptyQueuePayload);
    }
    if (url.startsWith("/api/reading/completions") && method === "GET") {
      return jsonResponse({ completions: [] });
    }
    if (url === "/api/reading/completions" && method === "POST") {
      return jsonResponse(
        {
          message: "Reading recorded and review schedule created",
          completion: {
            id: "completion-1",
            learnerId: "learner-1",
            bookId: testBook.id,
            quizCorrect: 1,
            quizTotal: 1,
            completedAt: "2026-07-02T09:00:00.000Z"
          },
          reviewTasks: [1, 2, 4, 7, 15].map((offset, index) => ({
            id: `completion-1-stage-${index + 1}`,
            learnerId: "learner-1",
            bookId: testBook.id,
            stage: index + 1,
            dueAt: new Date(Date.UTC(2026, 6, 2 + offset, 18)).toISOString(),
            status: "pending",
            completedAt: null
          }))
        },
        201
      );
    }
    if (url.includes("/complete") && method === "POST") {
      return jsonResponse({
        message: "Review completed",
        task: {
          id: "task-1",
          learnerId: "learner-1",
          bookId: testBook.id,
          stage: 1,
          dueAt: "2026-07-01T18:00:00.000Z",
          status: "done",
          completedAt: "2026-07-02T09:00:00.000Z"
        }
      });
    }
    if (url === "/api/progress" && method === "POST") {
      return jsonResponse(
        {
          message: "Progress saved",
          progress: {
            learnerId: "learner-1",
            lessonId: "lesson-sunny-market",
            completedActivityIds: ["listen-market-words"],
            confidence: "ready-to-share",
            recordedAt: "2026-06-18T03:08:00.000Z"
          }
        },
        201
      );
    }

    throw new Error(`Unhandled fetch: ${method} ${url}`);
  });
}

beforeEach(() => {
  vi.stubGlobal("fetch", fetchMock);
  stubRoutes();
});

afterEach(() => {
  vi.unstubAllGlobals();
  fetchMock.mockReset();
});

describe("App home", () => {
  it("loads the starter lesson and saves learner progress", async () => {
    render(<App />);

    expect(await screen.findByRole("heading", { name: "Sunny Market" })).toBeInTheDocument();
    await userEvent.click(screen.getByRole("checkbox", { name: /listen and point/i }));
    await userEvent.click(screen.getByRole("button", { name: /save progress/i }));

    await waitFor(() => expect(screen.getByText(/progress saved at/i)).toBeInTheDocument());
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/progress",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({
          learnerId: "learner-1",
          lessonId: "lesson-sunny-market",
          completedActivityIds: ["listen-market-words"],
          confidence: "ready-to-share"
        })
      })
    );
  });
});

describe("Reading library and reader", () => {
  it("reads a book end-to-end and creates the Ebbinghaus review schedule", async () => {
    render(<App />);

    await userEvent.click(await screen.findByRole("button", { name: "Library" }));
    expect(await screen.findByRole("heading", { name: "First Words" })).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: /my family/i }));
    expect(await screen.findByText("Mum.")).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: /next page/i }));
    expect(screen.getByText("Dad.")).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: /start the quiz/i }));
    expect(await screen.findByText("Who is Tofu?")).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "The cat" }));
    await userEvent.click(screen.getByRole("button", { name: /finish the book/i }));

    expect(await screen.findByText(/memory plan created/i)).toBeInTheDocument();
    expect(screen.getByText(/quiz score: 1 \/ 1/i)).toBeInTheDocument();
    expect(screen.getAllByText(/review \d/i).length).toBeGreaterThanOrEqual(5);

    expect(fetchMock).toHaveBeenCalledWith(
      "/api/reading/completions",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({
          learnerId: "learner-1",
          bookId: "l1-my-family",
          quizCorrect: 1,
          quizTotal: 1
        })
      })
    );
  });
});

describe("Review schedule page", () => {
  it("shows due reviews and marks them as done", async () => {
    stubRoutes({
      reviewQueue: {
        queue: {
          dueNow: [
            {
              id: "task-1",
              learnerId: "learner-1",
              bookId: testBook.id,
              stage: 1,
              dueAt: "2026-07-01T18:00:00.000Z",
              status: "pending",
              completedAt: null
            }
          ],
          upcoming: [],
          done: []
        }
      }
    });

    render(<App />);

    const reviewsTab = await screen.findByRole("button", { name: /reviews/i });
    expect(within(reviewsTab).getByLabelText(/1 reviews due/i)).toBeInTheDocument();

    await userEvent.click(reviewsTab);
    expect(await screen.findByRole("heading", { name: /beat the forgetting curve/i })).toBeInTheDocument();
    expect(screen.getByText(/1 review waiting/i)).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: /mark reviewed/i }));

    await waitFor(() =>
      expect(fetchMock).toHaveBeenCalledWith(
        "/api/reviews/task-1/complete",
        expect.objectContaining({ method: "POST" })
      )
    );
  });
});
