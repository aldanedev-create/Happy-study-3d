export type CurriculumArea = 'cxc' | 'cape' | 'software-engineering';

export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

export type Importance = 'core' | 'important' | 'useful' | 'advanced';

export interface KeyTerm {
  term: string;
  definition: string;
}

export interface Example {
  question: string;
  answer: string;
  explanation: string;
}

export interface CodeExample {
  language: string;
  code: string;
  explanation: string;
}

export interface ExternalResource {
  title: string;
  description?: string;
  type: 'course' | 'video' | 'article' | 'book' | 'website' | 'official';
  url: string;
  provider?: string;
  relatedTopic?: string;
}

export interface PracticeQuestion {
  id: string;
  question: string;
  options?: string[];
  correctAnswer?: string;
  explanation?: string;
  difficulty: Difficulty;
  type?: 'multiple-choice' | 'true-false' | 'short-answer' | 'essay';
  points?: number;
}

export interface Lesson {
  id: string;
  title: string;
  description?: string;
  summary: string;
  mustKnow?: string[];
  keyTerms?: KeyTerm[];
  examples?: Example[];
  formulas?: string[];
  codeExamples?: CodeExample[];
  practiceQuestions?: PracticeQuestion[];
  commonMistakes?: string[];
  practicalExercise?: string;
  projectConnection?: string;
  studyTips?: string[];
  furtherResearch?: string[];
  externalResources?: ExternalResource[];
  importance?: Importance;
  difficulty?: Difficulty;
  duration?: number;
  order?: number;
}

export interface Topic {
  id: string;
  title: string;
  description?: string;
  summary?: string;
  importance?: Importance;
  difficulty?: Difficulty;
  learningObjectives?: string[];
  mustKnow?: string[];
  keyTerms?: KeyTerm[];
  examples?: Example[];
  formulas?: string[];
  codeExamples?: CodeExample[];
  commonMistakes?: string[];
  examTips?: string[];
  questions?: PracticeQuestion[];
  lessons?: Lesson[];
  furtherResearch?: string[];
  resources?: ExternalResource[];
  practicalExercise?: string;
  projectConnection?: string;
  studyTips?: string[];
  order?: number;
}

export interface Unit {
  id: string;
  title: string;
  description?: string;
  importance?: Importance;
  difficulty?: Difficulty;
  learningObjectives?: string[];
  topics: Topic[];
  order?: number;
}

export interface Level {
  id: string;
  title: string;
  description?: string;
  difficulty?: Difficulty;
  order?: number;
  topics: Topic[];
}

export interface Subject {
  id: string;
  name: string;
  level: string;
  description: string;
  icon: string;
  syllabusVersion?: string;
  lastVerified?: string;
  source?: string;
  units?: Unit[];
  topics?: Topic[];
  levels?: Level[];
  area?: CurriculumArea;
}

export interface SubjectSummary {
  id: string;
  name: string;
  description: string;
  icon: string;
  area: CurriculumArea;
  topicsCount?: number;
  lessonsCount?: number;
  questionsCount?: number;
}

export interface CurriculumData {
  subjects: Subject[];
  totalSubjects: number;
  totalTopics: number;
  totalQuestions: number;
  lastUpdated?: string;
}