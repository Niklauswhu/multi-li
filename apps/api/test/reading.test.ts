import request from "supertest";
import { describe, expect, it } from "vitest";
import { ebbinghausIntervalsDays, readingBooks, readingLevels } from "@multi-li/shared";
import { createApp } from "../src/app.js";

describe("levelled reading api", () => {
  const app = createApp();

  it("returns five reading levels with book summaries", async () => {
    const response = await request(app).get("/api/reading/levels").expect(200);

    expect(response.body.levels).toHaveLength(5);
    expect(response.body.levels.map((level: { level: number }) => level.level)).toEqual([
      1, 2, 3, 4, 5
    ]);

    for (const level of response.body.levels) {
      expect(level.books.length).toBeGreaterThanOrEqual(3);
      for (const book of level.books) {
        expect(book.level).toBe(level.level);
        expect(book).not.toHaveProperty("pages");
        expect(book).not.toHaveProperty("quiz");
      }
    }
  });

  it("returns a full book with pages and quiz", async () => {
    const response = await request(app).get("/api/reading/books/l1-my-family").expect(200);

    expect(response.body.book).toMatchObject({
      id: "l1-my-family",
      title: "My Family",
      level: 1
    });
    expect(response.body.book.pages.length).toBeGreaterThan(0);
    expect(response.body.book.quiz.length).toBeGreaterThan(0);
  });

  it("responds 404 for unknown books", async () => {
    await request(app).get("/api/reading/books/not-a-book").expect(404);
  });

  it("keeps the shared catalog consistent", () => {
    const levelNumbers = readingLevels.map((level) => level.level);
    expect(levelNumbers).toEqual([1, 2, 3, 4, 5]);

    for (const book of readingBooks) {
      expect(levelNumbers).toContain(book.level);
      for (const question of book.quiz) {
        expect(question.answerIndex).toBeGreaterThanOrEqual(0);
        expect(question.answerIndex).toBeLessThan(question.options.length);
      }
      expect(book.pages.map((page) => page.pageNumber)).toEqual(
        book.pages.map((_, index) => index + 1)
      );
    }
  });
});

describe("study plan api", () => {
  const app = createApp();

  it("returns a default plan for new learners", async () => {
    const response = await request(app).get("/api/study-plan/learner-1").expect(200);

    expect(response.body.plan).toMatchObject({
      learnerId: "learner-1",
      currentLevel: 1,
      booksPerWeek: 3,
      reviewReminderHour: 18
    });
  });

  it("saves and returns an updated plan", async () => {
    const saved = await request(app)
      .put("/api/study-plan/learner-1")
      .send({ currentLevel: 3, booksPerWeek: 5, reviewReminderHour: 19 })
      .expect(200);

    expect(saved.body.plan).toMatchObject({
      learnerId: "learner-1",
      currentLevel: 3,
      booksPerWeek: 5,
      reviewReminderHour: 19
    });

    const fetched = await request(app).get("/api/study-plan/learner-1").expect(200);
    expect(fetched.body.plan.currentLevel).toBe(3);
  });

  it("rejects invalid plans", async () => {
    const response = await request(app)
      .put("/api/study-plan/learner-1")
      .send({ currentLevel: 9, booksPerWeek: 0 })
      .expect(400);

    expect(response.body.issues.length).toBeGreaterThan(0);
  });
});

describe("ebbinghaus review api", () => {
  const app = createApp();

  it("creates a five-stage review schedule when a book is completed", async () => {
    const response = await request(app)
      .post("/api/reading/completions")
      .send({
        learnerId: "learner-1",
        bookId: "l2-the-red-kite",
        quizCorrect: 2,
        quizTotal: 2
      })
      .expect(201);

    expect(response.body.completion).toMatchObject({
      learnerId: "learner-1",
      bookId: "l2-the-red-kite"
    });
    expect(response.body.reviewTasks).toHaveLength(ebbinghausIntervalsDays.length);

    const completedAt = new Date(response.body.completion.completedAt);
    response.body.reviewTasks.forEach(
      (task: { stage: number; dueAt: string; status: string }, index: number) => {
        expect(task.stage).toBe(index + 1);
        expect(task.status).toBe("pending");

        const expectedDay = new Date(completedAt);
        expectedDay.setDate(expectedDay.getDate() + (ebbinghausIntervalsDays[index] ?? 0));
        expect(new Date(task.dueAt).toDateString()).toBe(expectedDay.toDateString());
      }
    );
  });

  it("rejects completions for unknown books", async () => {
    await request(app)
      .post("/api/reading/completions")
      .send({ learnerId: "learner-1", bookId: "ghost-book", quizCorrect: 1, quizTotal: 2 })
      .expect(404);
  });

  it("lists the learner review queue split into buckets", async () => {
    await request(app)
      .post("/api/reading/completions")
      .send({ learnerId: "learner-queue", bookId: "l1-colours", quizCorrect: 2, quizTotal: 2 })
      .expect(201);

    const response = await request(app).get("/api/reviews/learner-queue").expect(200);

    expect(response.body.queue.dueNow).toEqual([]);
    expect(response.body.queue.upcoming).toHaveLength(ebbinghausIntervalsDays.length);
    expect(response.body.queue.done).toEqual([]);
  });

  it("marks a review task as done exactly once", async () => {
    const completion = await request(app)
      .post("/api/reading/completions")
      .send({ learnerId: "learner-2", bookId: "l1-my-family", quizCorrect: 1, quizTotal: 2 })
      .expect(201);

    const taskId = completion.body.reviewTasks[0].id;

    const done = await request(app).post(`/api/reviews/${taskId}/complete`).expect(200);
    expect(done.body.task).toMatchObject({ id: taskId, status: "done" });
    expect(done.body.task.completedAt).toBeTruthy();

    await request(app).post(`/api/reviews/${taskId}/complete`).expect(409);

    const queue = await request(app).get("/api/reviews/learner-2").expect(200);
    expect(queue.body.queue.done.map((task: { id: string }) => task.id)).toContain(taskId);
  });

  it("responds 404 for unknown review tasks", async () => {
    await request(app).post("/api/reviews/nothing-here/complete").expect(404);
  });
});
