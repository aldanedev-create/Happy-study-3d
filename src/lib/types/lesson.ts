export interface LessonContent {
  id: string;
  title: string;
  summary: string;
  mustKnow?: string[];
  keyTerms?: { term: string; definition: string }[];
  examples?: { question: string; answer: string; explanation: string }[];
  formulas?: string[];
  codeExamples?: { language: string; code: string; explanation: string }[];
  commonMistakes?: string[];
  advanced?: string[];
  furtherResearch?: string[];
  resources?: {
    title: string;
    description?: string;
    type: string;
    url: string;
    provider?: string;
  }[];
}

export interface LessonProgress {
  lessonId: string;
  completed: boolean;
  startedAt?: string;
  completedAt?: string;
  timeSpent?: number;
  notes?: string;
}

export interface LessonState {
  currentLessonId: string | null;
  currentTopicId: string | null;
  currentSubjectId: string | null;
  completedLessons: string[];
  progress: number;
  isLoading: boolean;
  error: string | null;
}