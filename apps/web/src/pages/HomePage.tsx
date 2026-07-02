import { useEffect, useMemo, useState } from "react";
import type { LearnerProfile, Lesson } from "@multi-li/shared";
import { getFeaturedLesson, saveProgress } from "../api";

type HomePageProps = {
  learner: LearnerProfile;
  dueReviewCount: number;
  onOpenLibrary: () => void;
  onOpenReviews: () => void;
};

type LessonState =
  | { status: "loading" }
  | { status: "ready"; lesson: Lesson }
  | { status: "error"; message: string };

export function HomePage({ learner, dueReviewCount, onOpenLibrary, onOpenReviews }: HomePageProps) {
  const [lessonState, setLessonState] = useState<LessonState>({ status: "loading" });
  const [completedActivityIds, setCompletedActivityIds] = useState<string[]>([]);
  const [saveMessage, setSaveMessage] = useState<string>("");

  useEffect(() => {
    getFeaturedLesson()
      .then((response) => setLessonState({ status: "ready", lesson: response.lesson }))
      .catch((error: unknown) =>
        setLessonState({
          status: "error",
          message: error instanceof Error ? error.message : "Unable to load lessons"
        })
      );
  }, []);

  const lesson = lessonState.status === "ready" ? lessonState.lesson : undefined;
  const progressPercent = useMemo(() => {
    if (!lesson) {
      return 0;
    }

    return Math.round((completedActivityIds.length / lesson.activities.length) * 100);
  }, [completedActivityIds.length, lesson]);

  async function handleSaveProgress() {
    if (!lesson) {
      return;
    }

    const response = await saveProgress({
      learnerId: learner.id,
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
    <>
      <section className="hero" aria-labelledby="page-title">
        <div>
          <p className="eyebrow">English learning for global children</p>
          <h1 id="page-title">A playful path from home language to confident English.</h1>
          <p className="hero-copy">
            Multi-Li blends levelled readers, a personal study plan, and Ebbinghaus-timed reviews
            for children learning English outside English-speaking regions.
          </p>
          <div className="hero-actions">
            <button type="button" onClick={onOpenLibrary}>
              Open the reading library
            </button>
            <button type="button" className="ghost-button" onClick={onOpenReviews}>
              {dueReviewCount > 0
                ? `${dueReviewCount} ${dueReviewCount === 1 ? "review" : "reviews"} due today`
                : "See the review plan"}
            </button>
          </div>
        </div>
        <div className="hero-card" aria-label="Platform readiness">
          <span className="pulse" />
          API connected
          <strong>Read · Plan · Review</strong>
        </div>
      </section>

      {lessonState.status === "loading" && <p className="status">Loading lesson studio...</p>}

      {lessonState.status === "error" && (
        <p className="status status-error">Could not load starter content: {lessonState.message}</p>
      )}

      {lessonState.status === "ready" && lesson && (
        <section className="dashboard" aria-label="Learner dashboard">
          <article className="panel learner-panel">
            <p className="eyebrow">Learner profile</p>
            <h2>{learner.displayName}'s weekly goal</h2>
            <dl>
              <div>
                <dt>Age range</dt>
                <dd>{learner.ageRange}</dd>
              </div>
              <div>
                <dt>Home locale</dt>
                <dd>{learner.homeLocale}</dd>
              </div>
              <div>
                <dt>Goal</dt>
                <dd>{learner.weeklyGoalMinutes} minutes</dd>
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
              <svg
                className="progress-ring"
                viewBox="0 0 48 48"
                role="img"
                aria-label={`${progressPercent}% complete`}
              >
                <circle className="progress-ring-track" cx="24" cy="24" r="20" pathLength="100" />
                <circle
                  className="progress-ring-value"
                  cx="24"
                  cy="24"
                  r="20"
                  pathLength="100"
                  strokeDashoffset={100 - progressPercent}
                />
                <text x="24" y="24" textAnchor="middle" dominantBaseline="middle">
                  {progressPercent}%
                </text>
              </svg>
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
    </>
  );
}
