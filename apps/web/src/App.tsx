import { useEffect, useMemo, useState, type CSSProperties } from "react";
import type { LearnerProfile, Lesson } from "@multi-li/shared";
import { getFeaturedLesson, getLearners, saveProgress } from "./api";
import "./app.css";

type LoadState =
  | { status: "loading" }
  | { status: "ready"; learners: LearnerProfile[]; lesson: Lesson }
  | { status: "error"; message: string };

function App() {
  const [loadState, setLoadState] = useState<LoadState>({ status: "loading" });
  const [completedActivityIds, setCompletedActivityIds] = useState<string[]>([]);
  const [saveMessage, setSaveMessage] = useState<string>("");

  useEffect(() => {
    Promise.all([getLearners(), getFeaturedLesson()])
      .then(([learnersResponse, lessonResponse]) => {
        setLoadState({
          status: "ready",
          learners: learnersResponse.learners,
          lesson: lessonResponse.lesson
        });
      })
      .catch((error: unknown) => {
        setLoadState({
          status: "error",
          message: error instanceof Error ? error.message : "Unable to load lessons"
        });
      });
  }, []);

  const activeLearner = loadState.status === "ready" ? loadState.learners[0] : undefined;
  const lesson = loadState.status === "ready" ? loadState.lesson : undefined;
  const progressPercent = useMemo(() => {
    if (!lesson) {
      return 0;
    }

    return Math.round((completedActivityIds.length / lesson.activities.length) * 100);
  }, [completedActivityIds.length, lesson]);

  async function handleSaveProgress() {
    if (!activeLearner || !lesson) {
      return;
    }

    const response = await saveProgress({
      learnerId: activeLearner.id,
      lessonId: lesson.id,
      completedActivityIds,
      confidence: progressPercent === 100 ? "ready-to-share" : "getting-there"
    });

    setSaveMessage(`${response.message} at ${new Date(response.progress.recordedAt).toLocaleTimeString()}`);
  }

  function toggleActivity(activityId: string) {
    setCompletedActivityIds((current) =>
      current.includes(activityId)
        ? current.filter((id) => id !== activityId)
        : [...current, activityId]
    );
  }

  return (
    <main className="shell">
      <section className="hero" aria-labelledby="page-title">
        <div>
          <p className="eyebrow">English learning for global children</p>
          <h1 id="page-title">A playful path from home language to confident English.</h1>
          <p className="hero-copy">
            Multi-Li blends short lessons, age-aware pacing, and localized support for children
            learning English outside English-speaking regions.
          </p>
        </div>
        <div className="hero-card" aria-label="Platform readiness">
          <span className="pulse" />
          API connected
          <strong>Frontend / Backend separated</strong>
        </div>
      </section>

      {loadState.status === "loading" && <p className="status">Loading lesson studio...</p>}

      {loadState.status === "error" && (
        <p className="status status-error">Could not load starter content: {loadState.message}</p>
      )}

      {loadState.status === "ready" && activeLearner && lesson && (
        <section className="dashboard" aria-label="Learner dashboard">
          <article className="panel learner-panel">
            <p className="eyebrow">Learner profile</p>
            <h2>{activeLearner.displayName}'s weekly goal</h2>
            <dl>
              <div>
                <dt>Age range</dt>
                <dd>{activeLearner.ageRange}</dd>
              </div>
              <div>
                <dt>Home locale</dt>
                <dd>{activeLearner.homeLocale}</dd>
              </div>
              <div>
                <dt>Goal</dt>
                <dd>{activeLearner.weeklyGoalMinutes} minutes</dd>
              </div>
            </dl>
          </article>

          <article className="panel lesson-panel">
            <p className="eyebrow">Featured lesson</p>
            <h2>{lesson.title}</h2>
            <p>{lesson.theme}</p>
            <div className="word-list" aria-label="Target words">
              {lesson.targetWords.map((word) => (
                <span key={word}>{word}</span>
              ))}
            </div>
            <blockquote>{lesson.sentenceFrame}</blockquote>
            <p className="encouragement">{lesson.encouragement}</p>
          </article>

          <article className="panel progress-panel">
            <div className="progress-heading">
              <div>
                <p className="eyebrow">Activity path</p>
                <h2>{progressPercent}% complete</h2>
              </div>
              <div
                className="progress-ring"
                style={{ "--progress": `${progressPercent}%` } as CSSProperties}
                aria-label={`${progressPercent}% complete`}
              />
            </div>

            <ul className="activity-list">
              {lesson.activities.map((activity) => (
                <li key={activity.id}>
                  <label>
                    <input
                      type="checkbox"
                      checked={completedActivityIds.includes(activity.id)}
                      onChange={() => toggleActivity(activity.id)}
                    />
                    <span>
                      <strong>{activity.title}</strong>
                      {activity.prompt}
                    </span>
                  </label>
                  <small>
                    {activity.skill} · {activity.estimatedMinutes} min
                  </small>
                </li>
              ))}
            </ul>

            <button type="button" onClick={handleSaveProgress}>
              Save progress
            </button>
            {saveMessage && <p className="save-message">{saveMessage}</p>}
          </article>
        </section>
      )}
    </main>
  );
}

export default App;
