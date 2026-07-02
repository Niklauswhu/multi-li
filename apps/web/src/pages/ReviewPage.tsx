import { useCallback, useEffect, useState } from "react";
import type { ReviewQueue, ReviewTask } from "@multi-li/shared";
import { ebbinghausIntervalsDays, getBookById } from "@multi-li/shared";
import { completeReviewTask, getReviewQueue } from "../api";

type ReviewPageProps = {
  learnerId: string;
  onReadBook: (bookId: string) => void;
  onQueueChanged: () => void;
};

type LoadState =
  | { status: "loading" }
  | { status: "ready"; queue: ReviewQueue }
  | { status: "error"; message: string };

function formatDue(dueAt: string): string {
  const due = new Date(dueAt);
  return `${due.toLocaleDateString()} ${due.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit"
  })}`;
}

function TaskRow({
  task,
  actions
}: {
  task: ReviewTask;
  actions?: React.ReactNode;
}) {
  const book = getBookById(task.bookId);

  return (
    <li className="review-task">
      <span className="review-task-cover" aria-hidden="true">
        {book?.coverEmoji ?? "📖"}
      </span>
      <span className="review-task-body">
        <strong>{book?.title ?? task.bookId}</strong>
        <small>
          Review {task.stage} of {ebbinghausIntervalsDays.length} · due {formatDue(task.dueAt)}
        </small>
      </span>
      {actions}
    </li>
  );
}

export function ReviewPage({ learnerId, onReadBook, onQueueChanged }: ReviewPageProps) {
  const [loadState, setLoadState] = useState<LoadState>({ status: "loading" });

  const refresh = useCallback(() => {
    getReviewQueue(learnerId)
      .then((response) => setLoadState({ status: "ready", queue: response.queue }))
      .catch((error: unknown) =>
        setLoadState({
          status: "error",
          message: error instanceof Error ? error.message : "Unable to load reviews"
        })
      );
  }, [learnerId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  if (loadState.status === "loading") {
    return <p className="status">Loading the review schedule...</p>;
  }

  if (loadState.status === "error") {
    return <p className="status status-error">Could not load reviews: {loadState.message}</p>;
  }

  const { queue } = loadState;

  async function handleComplete(taskId: string) {
    await completeReviewTask(taskId);
    refresh();
    onQueueChanged();
  }

  return (
    <section aria-label="Review schedule">
      <header className="page-header">
        <p className="eyebrow">Timed reviews</p>
        <h1 className="page-title">Beat the forgetting curve</h1>
        <p className="page-copy">
          Ebbinghaus showed that memories fade fast without practice. Each finished book comes back
          after {ebbinghausIntervalsDays.join(", ")} days so new words stick for good.
        </p>
      </header>

      <div className="review-grid">
        <article className="panel">
          <p className="eyebrow">Due now</p>
          <h2>
            {queue.dueNow.length === 0
              ? "All caught up!"
              : `${queue.dueNow.length} ${queue.dueNow.length === 1 ? "review" : "reviews"} waiting`}
          </h2>
          {queue.dueNow.length === 0 ? (
            <p className="plan-empty">
              Nothing to review right now. Finish a book in the library to start a new memory plan.
            </p>
          ) : (
            <ul className="review-task-list">
              {queue.dueNow.map((task) => (
                <TaskRow
                  key={task.id}
                  task={task}
                  actions={
                    <span className="review-task-actions">
                      <button
                        type="button"
                        className="ghost-button"
                        onClick={() => onReadBook(task.bookId)}
                      >
                        Read again
                      </button>
                      <button type="button" onClick={() => handleComplete(task.id)}>
                        Mark reviewed
                      </button>
                    </span>
                  }
                />
              ))}
            </ul>
          )}
        </article>

        <article className="panel">
          <p className="eyebrow">Coming up</p>
          <h2>{queue.upcoming.length} scheduled</h2>
          {queue.upcoming.length === 0 ? (
            <p className="plan-empty">No upcoming reviews yet.</p>
          ) : (
            <ul className="review-task-list">
              {queue.upcoming.map((task) => (
                <TaskRow key={task.id} task={task} />
              ))}
            </ul>
          )}

          <p className="eyebrow review-done-heading">Completed reviews</p>
          {queue.done.length === 0 ? (
            <p className="plan-empty">No reviews completed yet.</p>
          ) : (
            <ul className="review-task-list review-task-list-done">
              {queue.done.map((task) => (
                <TaskRow key={task.id} task={task} />
              ))}
            </ul>
          )}
        </article>
      </div>
    </section>
  );
}
