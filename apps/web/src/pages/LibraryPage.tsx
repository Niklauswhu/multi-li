import { useEffect, useState } from "react";
import { getReadingLevels, type LevelWithBooks } from "../api";

type LibraryPageProps = {
  completedBookIds: string[];
  onOpenBook: (bookId: string) => void;
};

type LoadState =
  | { status: "loading" }
  | { status: "ready"; levels: LevelWithBooks[] }
  | { status: "error"; message: string };

export function LibraryPage({ completedBookIds, onOpenBook }: LibraryPageProps) {
  const [loadState, setLoadState] = useState<LoadState>({ status: "loading" });

  useEffect(() => {
    getReadingLevels()
      .then((response) => setLoadState({ status: "ready", levels: response.levels }))
      .catch((error: unknown) =>
        setLoadState({
          status: "error",
          message: error instanceof Error ? error.message : "Unable to load the library"
        })
      );
  }, []);

  if (loadState.status === "loading") {
    return <p className="status">Loading the reading library...</p>;
  }

  if (loadState.status === "error") {
    return <p className="status status-error">Could not load the library: {loadState.message}</p>;
  }

  return (
    <section aria-label="Levelled reading library">
      <header className="page-header">
        <p className="eyebrow">Reading library</p>
        <h1 className="page-title">Five steps from first words to big adventures</h1>
        <p className="page-copy">
          Levelled readers inspired by graded reading schemes: each level adds longer sentences,
          richer stories and new phonics patterns.
        </p>
      </header>

      {loadState.levels.map((level) => (
        <article key={level.level} className="level-band" aria-label={`Level ${level.level}`}>
          <div className="level-heading">
            <span className="level-chip" style={{ backgroundColor: level.bandColor }}>
              Level {level.level}
            </span>
            <div>
              <h2>{level.name}</h2>
              <p className="level-meta">
                {level.sentenceStyle} · {level.wordsPerBook}
              </p>
              <p className="level-description">{level.description}</p>
            </div>
          </div>

          <ul className="book-grid">
            {level.books.map((book) => {
              const isCompleted = completedBookIds.includes(book.id);

              return (
                <li key={book.id}>
                  <button
                    type="button"
                    className="book-card"
                    style={{ borderTopColor: level.bandColor }}
                    onClick={() => onOpenBook(book.id)}
                  >
                    <span className="book-cover" aria-hidden="true">
                      {book.coverEmoji}
                    </span>
                    <span className="book-body">
                      <strong>{book.title}</strong>
                      <small>{book.synopsis}</small>
                      <small className="book-phonics">Phonics: {book.phonicsFocus}</small>
                    </span>
                    {isCompleted && <span className="book-done-badge">Read ✓</span>}
                  </button>
                </li>
              );
            })}
          </ul>
        </article>
      ))}
    </section>
  );
}
