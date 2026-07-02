import { describe, expect, it } from "vitest";
import {
  buildReviewSchedule,
  ebbinghausIntervalsDays,
  partitionReviewTasks,
  type ReviewTask
} from "@multi-li/shared";

describe("buildReviewSchedule", () => {
  it("schedules reviews on Ebbinghaus days 1, 2, 4, 7 and 15", () => {
    const completedAt = new Date("2026-07-02T09:30:00.000Z");
    const tasks = buildReviewSchedule("c-1", "learner-1", "l1-my-family", completedAt, 18);

    expect(ebbinghausIntervalsDays).toEqual([1, 2, 4, 7, 15]);
    expect(tasks).toHaveLength(5);

    tasks.forEach((task, index) => {
      expect(task.stage).toBe(index + 1);
      expect(task.status).toBe("pending");
      expect(task.completedAt).toBeNull();

      const expected = new Date(completedAt);
      expected.setDate(expected.getDate() + (ebbinghausIntervalsDays[index] ?? 0));
      expected.setHours(18, 0, 0, 0);
      expect(task.dueAt).toBe(expected.toISOString());
    });
  });

  it("uses the learner reminder hour for due times", () => {
    const completedAt = new Date("2026-07-02T09:30:00.000Z");
    const [firstTask] = buildReviewSchedule("c-2", "learner-1", "l1-my-family", completedAt, 7);

    expect(firstTask).toBeDefined();
    expect(new Date(firstTask!.dueAt).getHours()).toBe(7);
  });
});

describe("partitionReviewTasks", () => {
  const baseTask: Omit<ReviewTask, "id" | "dueAt" | "status" | "completedAt"> = {
    learnerId: "learner-1",
    bookId: "l1-my-family",
    stage: 1
  };

  it("splits tasks into dueNow, upcoming and done buckets", () => {
    const now = new Date("2026-07-10T12:00:00.000Z");
    const tasks: ReviewTask[] = [
      { ...baseTask, id: "past", dueAt: "2026-07-09T18:00:00.000Z", status: "pending", completedAt: null },
      { ...baseTask, id: "future", dueAt: "2026-07-12T18:00:00.000Z", status: "pending", completedAt: null },
      { ...baseTask, id: "finished", dueAt: "2026-07-08T18:00:00.000Z", status: "done", completedAt: "2026-07-08T19:00:00.000Z" }
    ];

    const queue = partitionReviewTasks(tasks, now);

    expect(queue.dueNow.map((task) => task.id)).toEqual(["past"]);
    expect(queue.upcoming.map((task) => task.id)).toEqual(["future"]);
    expect(queue.done.map((task) => task.id)).toEqual(["finished"]);
  });

  it("sorts due and upcoming tasks by due date ascending", () => {
    const now = new Date("2026-07-20T12:00:00.000Z");
    const tasks: ReviewTask[] = [
      { ...baseTask, id: "due-later", dueAt: "2026-07-19T18:00:00.000Z", status: "pending", completedAt: null },
      { ...baseTask, id: "due-first", dueAt: "2026-07-15T18:00:00.000Z", status: "pending", completedAt: null },
      { ...baseTask, id: "up-later", dueAt: "2026-07-30T18:00:00.000Z", status: "pending", completedAt: null },
      { ...baseTask, id: "up-first", dueAt: "2026-07-22T18:00:00.000Z", status: "pending", completedAt: null }
    ];

    const queue = partitionReviewTasks(tasks, now);

    expect(queue.dueNow.map((task) => task.id)).toEqual(["due-first", "due-later"]);
    expect(queue.upcoming.map((task) => task.id)).toEqual(["up-first", "up-later"]);
  });
});
