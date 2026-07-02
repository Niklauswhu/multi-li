import { useEffect, useState } from "react";
import type { BookCompletion, StudyPlan } from "@multi-li/shared";
import { getBookById, readingLevels } from "@multi-li/shared";
import { getCompletions, getStudyPlan, saveStudyPlan } from "../api";

type PlanPageProps = {
  learnerId: string;
  learnerName: string;
};

type LoadState =
  | { status: "loading" }
  | { status: "ready" }
  | { status: "error"; message: string };

function startOfWeek(now: Date): Date {
  const monday = new Date(now);
  const day = monday.getDay();
  const diff = day === 0 ? 6 : day - 1;
  monday.setDate(monday.getDate() - diff);
  monday.setHours(0, 0, 0, 0);
  return monday;
}

export function PlanPage({ learnerId, learnerName }: PlanPageProps) {
  const [loadState, setLoadState] = useState<LoadState>({ status: "loading" });
  const [plan, setPlan] = useState<StudyPlan | null>(null);
  const [completions, setCompletions] = useState<BookCompletion[]>([]);
  const [saveMessage, setSaveMessage] = useState<string>("");

  useEffect(() => {
    Promise.all([getStudyPlan(learnerId), getCompletions(learnerId)])
      .then(([planResponse, completionsResponse]) => {
        setPlan(planResponse.plan);
        setCompletions(completionsResponse.completions);
        setLoadState({ status: "ready" });
      })
      .catch((error: unknown) =>
        setLoadState({
          status: "error",
          message: error instanceof Error ? error.message : "Unable to load the study plan"
        })
      );
  }, [learnerId]);

  if (loadState.status === "loading") {
    return <p className="status">Loading the study plan...</p>;
  }

  if (loadState.status === "error" || !plan) {
    return (
      <p className="status status-error">
        Could not load the study plan{loadState.status === "error" ? `: ${loadState.message}` : ""}
      </p>
    );
  }

  const weekStart = startOfWeek(new Date());
  const booksThisWeek = completions.filter(
    (completion) => new Date(completion.completedAt).getTime() >= weekStart.getTime()
  ).length;
  const weeklyPercent = Math.min(100, Math.round((booksThisWeek / plan.booksPerWeek) * 100));
  const currentLevel = readingLevels.find((level) => level.level === plan.currentLevel);

  async function handleSave() {
    if (!plan) {
      return;
    }

    const response = await saveStudyPlan(learnerId, {
      currentLevel: plan.currentLevel,
      booksPerWeek: plan.booksPerWeek,
      reviewReminderHour: plan.reviewReminderHour
    });
    setPlan(response.plan);
    setSaveMessage(`${response.message} at ${new Date(response.plan.updatedAt).toLocaleTimeString()}`);
  }

  return (
    <section aria-label="Study plan">
      <header className="page-header">
        <p className="eyebrow">Study plan</p>
        <h1 className="page-title">{learnerName}'s reading plan</h1>
        <p className="page-copy">
          Choose a reading level and a weekly rhythm. Every finished book automatically joins the
          Ebbinghaus review schedule.
        </p>
      </header>

      <div className="plan-grid">
        <article className="panel">
          <p className="eyebrow">Plan settings</p>
          <h2>Weekly rhythm</h2>

          <label className="plan-field">
            <span>Current reading level</span>
            <select
              value={plan.currentLevel}
              onChange={(event) =>
                setPlan({ ...plan, currentLevel: Number(event.target.value) as StudyPlan["currentLevel"] })
              }
            >
              {readingLevels.map((level) => (
                <option key={level.level} value={level.level}>
                  Level {level.level} · {level.name}
                </option>
              ))}
            </select>
          </label>

          <label className="plan-field">
            <span>Books per week</span>
            <select
              value={plan.booksPerWeek}
              onChange={(event) => setPlan({ ...plan, booksPerWeek: Number(event.target.value) })}
            >
              {[1, 2, 3, 4, 5, 6, 7].map((count) => (
                <option key={count} value={count}>
                  {count} {count === 1 ? "book" : "books"}
                </option>
              ))}
            </select>
          </label>

          <label className="plan-field">
            <span>Daily review reminder</span>
            <select
              value={plan.reviewReminderHour}
              onChange={(event) => setPlan({ ...plan, reviewReminderHour: Number(event.target.value) })}
            >
              {Array.from({ length: 24 }, (_, hour) => hour).map((hour) => (
                <option key={hour} value={hour}>
                  {String(hour).padStart(2, "0")}:00
                </option>
              ))}
            </select>
          </label>

          <button type="button" onClick={handleSave}>
            Save study plan
          </button>
          {saveMessage && <p className="save-message">{saveMessage}</p>}
        </article>

        <article className="panel">
          <p className="eyebrow">This week</p>
          <h2>
            {booksThisWeek} of {plan.booksPerWeek} books read
          </h2>
          <div className="weekly-progress-track" role="img" aria-label={`${weeklyPercent}% of weekly goal`}>
            <div className="weekly-progress-value" style={{ width: `${weeklyPercent}%` }} />
          </div>
          <p className="plan-level-summary">
            {currentLevel
              ? `Level ${currentLevel.level} · ${currentLevel.name}: ${currentLevel.description}`
              : ""}
          </p>

          <p className="eyebrow">Reading log</p>
          {completions.length === 0 ? (
            <p className="plan-empty">No books finished yet. Open the library to start reading!</p>
          ) : (
            <ul className="completion-list">
              {[...completions]
                .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())
                .map((completion) => {
                  const book = getBookById(completion.bookId);

                  return (
                    <li key={completion.id}>
                      <strong>
                        {book ? `${book.coverEmoji} ${book.title}` : completion.bookId}
                      </strong>
                      <span>
                        Quiz {completion.quizCorrect}/{completion.quizTotal} ·{" "}
                        {new Date(completion.completedAt).toLocaleDateString()}
                      </span>
                    </li>
                  );
                })}
            </ul>
          )}
        </article>
      </div>
    </section>
  );
}
