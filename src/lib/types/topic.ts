export type TopicDifficulty = 'beginner' | 'intermediate' | 'advanced';
export type TopicImportance = 'core' | 'important' | 'useful' | 'advanced';

export interface TopicSummary {
  id: string;
  title: string;
  description: string;
  icon?: string;
  difficulty: TopicDifficulty;
  importance: TopicImportance;
  lessonCount: number;
  questionCount: number;
  completed?: boolean;
  progress?: number;
}

export interface TopicProgress {
  topicId: string;
  subjectId: string;
  completed: boolean;
  progress: number;
  lessonsCompleted: string[];
  questionsAnswered: string[];
  quizScores: number[];
  lastStudied?: string;
  timeSpent?: number;
}

export interface TopicList {
  topics: TopicSummary[];
  totalTopics: number;
  completedTopics: number;
  averageProgress: number;
}