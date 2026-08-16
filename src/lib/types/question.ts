export type QuestionType = 'multiple-choice' | 'true-false' | 'short-answer' | 'essay';
export type QuestionDifficulty = 'easy' | 'medium' | 'hard';

export interface Question {
  id: string;
  question: string;
  options?: string[];
  correctAnswer?: string;
  explanation?: string;
  difficulty: QuestionDifficulty;
  type: QuestionType;
  subjectId?: string;
  topicId?: string;
  lessonId?: string;
  tags?: string[];
  points?: number;
  timeLimit?: number;
}

export interface Quiz {
  id: string;
  title: string;
  description?: string;
  questions: Question[];
  timeLimit?: number;
  passingScore?: number;
  shuffleQuestions?: boolean;
  showAnswers?: boolean;
}

export interface Exam {
  id: string;
  title: string;
  description?: string;
  subjectId: string;
  questions: Question[];
  duration: number;
  totalMarks: number;
  passingScore: number;
}

export interface QuestionResult {
  questionId: string;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  timeSpent?: number;
}

export interface QuizResult {
  quizId: string;
  subjectId: string;
  topicId?: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  passed: boolean;
  timeSpent: number;
  completedAt: string;
  questionResults: QuestionResult[];
}

export interface QuestionBank {
  questions: Question[];
  totalQuestions: number;
  byTopic: Record<string, Question[]>;
  byDifficulty: Record<QuestionDifficulty, Question[]>;
}