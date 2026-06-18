import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import App from "./App";

const fetchMock = vi.fn();

beforeEach(() => {
  vi.stubGlobal("fetch", fetchMock);
});

afterEach(() => {
  vi.unstubAllGlobals();
  fetchMock.mockReset();
});

describe("App", () => {
  it("loads the starter lesson and saves learner progress", async () => {
    fetchMock
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
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
        })
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
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
        })
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          message: "Progress saved",
          progress: {
            learnerId: "learner-1",
            lessonId: "lesson-sunny-market",
            completedActivityIds: ["listen-market-words"],
            confidence: "ready-to-share",
            recordedAt: "2026-06-18T03:08:00.000Z"
          }
        })
      });

    render(<App />);

    expect(await screen.findByRole("heading", { name: "Sunny Market" })).toBeInTheDocument();
    await userEvent.click(screen.getByRole("checkbox", { name: /listen and point/i }));
    await userEvent.click(screen.getByRole("button", { name: /save progress/i }));

    await waitFor(() => expect(screen.getByText(/progress saved at/i)).toBeInTheDocument());
    expect(fetchMock).toHaveBeenLastCalledWith(
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
