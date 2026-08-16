import type { CurriculumArea } from './subject';

export interface SubjectProgress {
  subjectId: string;
  subjectName: string;
  area: CurriculumArea;
  topicsCompleted: number;
  totalTopics: number;
  lessonsCompleted: number;
  totalLessons: number;
  questionsAnswered: number;
  totalQuestions: number;
  quizzesTaken: number;
  averageScore: number;
  lastStudied?: string;
  timeSpent?: number;
  percentage: number;
}

export interface TopicProgressData {
  topicId: string;
  subjectId: string;
  topicName: string;
  completed: boolean;
  progress: number;
  lessonsCompleted: string[];
  questionsAnswered: string[];
  quizScores: number[];
  lastStudied?: string;
  timeSpent?: number;
}

export interface LessonProgressData {
  lessonId: string;
  topicId: string;
  subjectId: string;
  completed: boolean;
  startedAt?: string;
  completedAt?: string;
  timeSpent?: number;
}

export interface StudySession {
  id: string;
  subjectId: string;
  topicId?: string;
  startTime: string;
  endTime?: string;
  duration?: number;
  activitiesCompleted: number;
}

export interface OverallProgress {
  totalSubjects: number;
  totalTopics: number;
  totalLessons: number;
  totalQuestions: number;
  completedSubjects: number;
  completedTopics: number;
  completedLessons: number;
  answeredQuestions: number;
  quizzesTaken: number;
  averageScore: number;
  overallPercentage: number;
  lastActiveDate?: string;
  totalStudyTime?: number;
}

export interface ProgressState {
  subjects: SubjectProgress[];
  topics: TopicProgressData[];
  lessons: LessonProgressData[];
  sessions: StudySession[];
  overall: OverallProgress;
  isLoading: boolean;
  error: string | null;
}