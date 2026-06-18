import request from "supertest";
import { describe, expect, it } from "vitest";
import { createApp } from "../src/app.js";

describe("multi-li api", () => {
  const app = createApp();

  it("reports service health", async () => {
    const response = await request(app).get("/health").expect(200);

    expect(response.body).toMatchObject({
      status: "ok",
      service: "multi-li-api"
    });
  });

  it("returns the featured lesson", async () => {
    const response = await request(app).get("/api/lessons/featured").expect(200);

    expect(response.body.lesson).toMatchObject({
      id: "lesson-sunny-market",
      title: "Sunny Market"
    });
    expect(response.body.lesson.activities).toHaveLength(3);
  });

  it("validates progress submissions", async () => {
    const response = await request(app)
      .post("/api/progress")
      .send({
        learnerId: "learner-1",
        lessonId: "lesson-sunny-market",
        completedActivityIds: ["listen-market-words"],
        confidence: "ready-to-share"
      })
      .expect(201);

    expect(response.body.progress).toMatchObject({
      learnerId: "learner-1",
      lessonId: "lesson-sunny-market",
      completedActivityIds: ["listen-market-words"],
      confidence: "ready-to-share"
    });
  });

  it("rejects malformed progress submissions", async () => {
    const response = await request(app)
      .post("/api/progress")
      .send({
        learnerId: "",
        lessonId: "lesson-sunny-market",
        confidence: "unknown"
      })
      .expect(400);

    expect(response.body.message).toBe("Progress payload is invalid");
    expect(response.body.issues.length).toBeGreaterThan(0);
  });
});
