import { z } from "zod";

export * from "./reading.js";
export * from "./studyPlan.js";

export const localeCodes = ["es-MX", "zh-CN", "pt-BR", "id-ID"] as const;
export type LocaleCode = (typeof localeCodes)[number];

export const skillAreas = ["listening", "speaking", "vocabulary", "phonics"] as const;
export type SkillArea = (typeof skillAreas)[number];

export type LearnerProfile = {
  id: string;
  displayName: string;
  ageRange: "5-7" | "8-10";
  homeLocale: LocaleCode;
  cefrBand: "pre-a1" | "a1";
  weeklyGoalMinutes: number;
};

export type LessonActivity = {
  id: string;
  title: string;
  skill: SkillArea;
  estimatedMinutes: number;
  prompt: string;
};

export type Lesson = {
  id: string;
  title: string;
  theme: string;
  level: LearnerProfile["cefrBand"];
  targetWords: string[];
  sentenceFrame: string;
  encouragement: string;
  activities: LessonActivity[];
};

export const learnerProfiles: LearnerProfile[] = [
  {
    id: "learner-1",
    displayName: "Mia",
    ageRange: "5-7",
    homeLocale: "es-MX",
    cefrBand: "pre-a1",
    weeklyGoalMinutes: 45
  },
  {
    id: "learner-2",
    displayName: "Leo",
    ageRange: "8-10",
    homeLocale: "pt-BR",
    cefrBand: "a1",
    weeklyGoalMinutes: 60
  }
];

export const lessonCatalog: Lesson[] = [
  {
    id: "lesson-sunny-market",
    title: "Sunny Market",
    theme: "Food and friendly greetings",
    level: "pre-a1",
    targetWords: ["apple", "banana", "please", "thank you"],
    sentenceFrame: "I would like a ____.",
    encouragement: "Say it with a big market smile.",
    activities: [
      {
        id: "listen-market-words",
        title: "Listen and point",
        skill: "listening",
        estimatedMinutes: 4,
        prompt: "Hear each market word and tap the matching picture."
      },
      {
        id: "speak-market-frame",
        title: "Market role play",
        skill: "speaking",
        estimatedMinutes: 6,
        prompt: "Practice asking for fruit with the sentence frame."
      },
      {
        id: "word-basket",
        title: "Build a word basket",
        skill: "vocabulary",
        estimatedMinutes: 5,
        prompt: "Drag each new word into the shopping basket."
      }
    ]
  }
];

export const progressSchema = z.object({
  learnerId: z.string().min(1),
  lessonId: z.string().min(1),
  completedActivityIds: z.array(z.string().min(1)).default([]),
  confidence: z.enum(["still-learning", "getting-there", "ready-to-share"])
});

export type ProgressSnapshot = z.infer<typeof progressSchema>;

export function getFeaturedLesson(): Lesson {
  const [featuredLesson] = lessonCatalog;

  if (!featuredLesson) {
    throw new Error("Lesson catalog must include at least one featured lesson.");
  }

  return featuredLesson;
}
