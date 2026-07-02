import { useEffect, useState } from "react";
import type { ReadingBook, ReviewTask } from "@multi-li/shared";
import { getReadingBook, recordBookCompletion } from "../api";

type ReaderPageProps = {
  bookId: string;
  learnerId: string;
  onBackToLibrary: () => void;
  onBookCompleted: (bookId: string) => void;
  onGoToReviews: () => void;
};

type LoadState =
  | { status: "loading" }
  | { status: "ready"; book: ReadingBook }
  | { status: "error"; message: string };

type ReaderPhase =
  | { name: "reading"; pageIndex: number }
  | { name: "quiz"; questionIndex: number; correctCount: number; picked: number | null }
  | { name: "finished"; correctCount: number; reviewTasks: ReviewTask[] };

export function ReaderPage({
  bookId,
  learnerId,
  onBackToLibrary,
  onBookCompleted,
  onGoToReviews
}: ReaderPageProps) {
  const [loadState, setLoadState] = useState<LoadState>({ status: "loading" });
  const [phase, setPhase] = useState<ReaderPhase>({ name: "reading", pageIndex: 0 });
  const [saveError, setSaveError] = useState<string>("");

  useEffect(() => {
    setPhase({ name: "reading", pageIndex: 0 });
    getReadingBook(bookId)
      .then((response) => setLoadState({ status: "ready", book: response.book }))
      .catch((error: unknown) =>
        setLoadState({
          status: "error",
          message: error instanceof Error ? error.message : "Unable to load the book"
        })
      );
  }, [bookId]);

  if (loadState.status === "loading") {
    return <p className="status">Opening the book...</p>;
  }

  if (loadState.status === "error") {
    return <p className="status status-error">Could not open the book: {loadState.message}</p>;
  }

  const { book } = loadState;

  async function finishBook(correctCount: number) {
    try {
      const response = await recordBookCompletion({
        learnerId,
        bookId: book.id,
        quizCorrect: correctCount,
        quizTotal: book.quiz.length
      });
      onBookCompleted(book.id);
      setPhase({ name: "finished", correctCount, reviewTasks: response.reviewTasks });
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : "Could not save your reading");
    }
  }

  function answerQuestion(optionIndex: number) {
    if (phase.name !== "quiz" || phase.picked !== null) {
      return;
    }

    const question = book.quiz[phase.questionIndex];
    if (!question) {
      return;
    }

    const isCorrect = optionIndex === question.answerIndex;
    setPhase({ ...phase, picked: optionIndex, correctCount: phase.correctCount + (isCorrect ? 1 : 0) });
  }

  function nextQuestion() {
    if (phase.name !== "quiz") {
      return;
    }

    if (phase.questionIndex + 1 < book.quiz.length) {
      setPhase({ name: "quiz", questionIndex: phase.questionIndex + 1, correctCount: phase.correctCount, picked: null });
    } else {
      void finishBook(phase.correctCount);
    }
  }

  const currentPage = phase.name === "reading" ? book.pages[phase.pageIndex] : undefined;
  const currentQuestion = phase.name === "quiz" ? book.quiz[phase.questionIndex] : undefined;

  return (
    <section className="reader" aria-label={`Reading ${book.title}`}>
      <div className="reader-toolbar">
        <button type="button" className="ghost-button" onClick={onBackToLibrary}>
          ← Library
        </button>
        <span className="reader-book-title">
          {book.coverEmoji} {book.title} · Level {book.level}
        </span>
      </div>

      {phase.name === "reading" && currentPage && (
        <article className="reader-page panel">
          <div className="reader-illustration" aria-hidden="true">
            {currentPage.illustration}
          </div>
          <p className="reader-text">{currentPage.text}</p>
          <p className="reader-page-count">
            Page {phase.pageIndex + 1} of {book.pages.length}
          </p>
          <div className="reader-nav">
            <button
              type="button"
              className="ghost-button"
              disabled={phase.pageIndex === 0}
              onClick={() => setPhase({ name: "reading", pageIndex: phase.pageIndex - 1 })}
            >
              ← Back
            </button>
            {phase.pageIndex + 1 < book.pages.length ? (
              <button
                type="button"
                onClick={() => setPhase({ name: "reading", pageIndex: phase.pageIndex + 1 })}
              >
                Next page →
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setPhase({ name: "quiz", questionIndex: 0, correctCount: 0, picked: null })}
              >
                Start the quiz
              </button>
            )}
          </div>
        </article>
      )}

      {phase.name === "quiz" && currentQuestion && (
        <article className="reader-page panel">
          <p className="eyebrow">
            Question {phase.questionIndex + 1} of {book.quiz.length}
          </p>
          <h2 className="quiz-question">{currentQuestion.question}</h2>
          <ul className="quiz-options">
            {currentQuestion.options.map((option, optionIndex) => {
              const isPicked = phase.picked === optionIndex;
              const isAnswer = optionIndex === currentQuestion.answerIndex;
              const revealed = phase.picked !== null;
              const optionClass = [
                "quiz-option",
                revealed && isAnswer ? "quiz-option-correct" : "",
                revealed && isPicked && !isAnswer ? "quiz-option-wrong" : ""
              ]
                .filter(Boolean)
                .join(" ");

              return (
                <li key={option}>
                  <button
                    type="button"
                    className={optionClass}
                    disabled={revealed}
                    onClick={() => answerQuestion(optionIndex)}
                  >
                    {option}
                  </button>
                </li>
              );
            })}
          </ul>
          {phase.picked !== null && (
            <button type="button" onClick={nextQuestion}>
              {phase.questionIndex + 1 < book.quiz.length ? "Next question" : "Finish the book"}
            </button>
          )}
          {saveError && <p className="status status-error">{saveError}</p>}
        </article>
      )}

      {phase.name === "finished" && (
        <article className="reader-page panel reader-finished">
          <div className="reader-illustration" aria-hidden="true">
            🎉
          </div>
          <h2>Well done! You finished {book.title}.</h2>
          <p className="quiz-score">
            Quiz score: {phase.correctCount} / {book.quiz.length}
          </p>
          <div className="review-schedule-card">
            <p className="eyebrow">Memory plan created</p>
            <p>
              Following the Ebbinghaus forgetting curve, this book is now scheduled for{" "}
              {phase.reviewTasks.length} reviews:
            </p>
            <ul className="review-schedule-list">
              {phase.reviewTasks.map((task) => (
                <li key={task.id}>
                  <strong>Review {task.stage}</strong>
                  <span>{new Date(task.dueAt).toLocaleDateString()}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="reader-nav">
            <button type="button" className="ghost-button" onClick={onBackToLibrary}>
              Back to library
            </button>
            <button type="button" onClick={onGoToReviews}>
              See my review plan
            </button>
          </div>
        </article>
      )}
    </section>
  );
}
