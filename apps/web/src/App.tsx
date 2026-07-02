import { useCallback, useEffect, useState } from "react";
import type { LearnerProfile } from "@multi-li/shared";
import { getCompletions, getLearners, getReviewQueue } from "./api";
import { HomePage } from "./pages/HomePage";
import { LibraryPage } from "./pages/LibraryPage";
import { PlanPage } from "./pages/PlanPage";
import { ReaderPage } from "./pages/ReaderPage";
import { ReviewPage } from "./pages/ReviewPage";
import "./app.css";

type View =
  | { name: "home" }
  | { name: "library" }
  | { name: "reader"; bookId: string }
  | { name: "plan" }
  | { name: "reviews" };

type NavTab = {
  view: Extract<View["name"], "home" | "library" | "plan" | "reviews">;
  label: string;
};

const navTabs: NavTab[] = [
  { view: "home", label: "Home" },
  { view: "library", label: "Library" },
  { view: "plan", label: "Study plan" },
  { view: "reviews", label: "Reviews" }
];

function App() {
  const [learner, setLearner] = useState<LearnerProfile | null>(null);
  const [loadError, setLoadError] = useState<string>("");
  const [view, setView] = useState<View>({ name: "home" });
  const [dueReviewCount, setDueReviewCount] = useState(0);
  const [completedBookIds, setCompletedBookIds] = useState<string[]>([]);

  const refreshLearnerData = useCallback((learnerId: string) => {
    getReviewQueue(learnerId)
      .then((response) => setDueReviewCount(response.queue.dueNow.length))
      .catch(() => setDueReviewCount(0));
    getCompletions(learnerId)
      .then((response) =>
        setCompletedBookIds([...new Set(response.completions.map((entry) => entry.bookId))])
      )
      .catch(() => setCompletedBookIds([]));
  }, []);

  useEffect(() => {
    getLearners()
      .then((response) => {
        const [firstLearner] = response.learners;
        if (!firstLearner) {
          setLoadError("No learner profiles available");
          return;
        }
        setLearner(firstLearner);
        refreshLearnerData(firstLearner.id);
      })
      .catch((error: unknown) =>
        setLoadError(error instanceof Error ? error.message : "Unable to load learners")
      );
  }, [refreshLearnerData]);

  if (loadError) {
    return (
      <main className="shell">
        <p className="status status-error">Could not start Multi-Li: {loadError}</p>
      </main>
    );
  }

  if (!learner) {
    return (
      <main className="shell">
        <p className="status">Loading Multi-Li...</p>
      </main>
    );
  }

  const activeTab = view.name === "reader" ? "library" : view.name;

  return (
    <main className="shell">
      <nav className="top-nav" aria-label="Main navigation">
        <span className="brand">Multi-Li</span>
        <div className="nav-tabs">
          {navTabs.map((tab) => (
            <button
              key={tab.view}
              type="button"
              className={activeTab === tab.view ? "nav-tab nav-tab-active" : "nav-tab"}
              onClick={() => setView({ name: tab.view } as View)}
            >
              {tab.label}
              {tab.view === "reviews" && dueReviewCount > 0 && (
                <span className="nav-badge" aria-label={`${dueReviewCount} reviews due`}>
                  {dueReviewCount}
                </span>
              )}
            </button>
          ))}
        </div>
        <span className="nav-learner">Reader: {learner.displayName}</span>
      </nav>

      {view.name === "home" && (
        <HomePage
          learner={learner}
          onOpenLibrary={() => setView({ name: "library" })}
          onOpenReviews={() => setView({ name: "reviews" })}
          dueReviewCount={dueReviewCount}
        />
      )}

      {view.name === "library" && (
        <LibraryPage
          completedBookIds={completedBookIds}
          onOpenBook={(bookId) => setView({ name: "reader", bookId })}
        />
      )}

      {view.name === "reader" && (
        <ReaderPage
          bookId={view.bookId}
          learnerId={learner.id}
          onBackToLibrary={() => setView({ name: "library" })}
          onBookCompleted={() => refreshLearnerData(learner.id)}
          onGoToReviews={() => setView({ name: "reviews" })}
        />
      )}

      {view.name === "plan" && <PlanPage learnerId={learner.id} learnerName={learner.displayName} />}

      {view.name === "reviews" && (
        <ReviewPage
          learnerId={learner.id}
          onReadBook={(bookId) => setView({ name: "reader", bookId })}
          onQueueChanged={() => refreshLearnerData(learner.id)}
        />
      )}
    </main>
  );
}

export default App;
