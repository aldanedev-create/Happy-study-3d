import type { Question, QuestionType, QuestionDifficulty, Quiz, QuizResult, QuestionResult } from '$types/question';
import { curriculumService } from './curriculum';
import type { CurriculumArea } from '$types/subject';

class QuestionService {
  private questions: Map<string, Question> = new Map();
  private quizResults: QuizResult[] = [];
  
  async loadQuestionsForSubject(subjectId: string, area: CurriculumArea): Promise<Question[]> {
    const subject = await curriculumService.loadSubject(subjectId, area);
    if (!subject) return [];
    
    const questions = curriculumService.getAllQuestions(subject);
    
    questions.forEach(q => {
      q.subjectId = subjectId;
      this.questions.set(q.id, q);
    });
    
    return questions;
  }
  
  async loadQuestionsForTopic(subjectId: string, topicId: string, area: CurriculumArea): Promise<Question[]> {
    const subject = await curriculumService.loadSubject(subjectId, area);
    if (!subject) return [];
    
    const topics = curriculumService.getTopics(subject);
    const topic = topics.find(t => t.id === topicId);
    if (!topic) return [];
    
    const questions: Question[] = [];
    
    if (topic.questions) {
      questions.push(...(topic.questions as unknown as Question[]));
    }
    
    const lessons = curriculumService.getLessons(topic);
    lessons.forEach(lesson => {
      if (lesson.practiceQuestions) {
        questions.push(...(lesson.practiceQuestions as unknown as Question[]));
      }
    });
    
    questions.forEach(q => {
      q.subjectId = subjectId;
      q.topicId = topicId;
      this.questions.set(q.id, q);
    });
    
    return questions;
  }
  
  getQuestion(questionId: string): Question | null {
    return this.questions.get(questionId) || null;
  }
  
  getAllQuestions(): Question[] {
    return Array.from(this.questions.values());
  }
  
  getQuestionsByDifficulty(difficulty: QuestionDifficulty): Question[] {
    return this.getAllQuestions().filter(q => q.difficulty === difficulty);
  }
  
  getQuestionsByType(type: QuestionType): Question[] {
    return this.getAllQuestions().filter(q => q.type === type);
  }
  
  createQuiz(subjectId: string, topicId?: string, questionCount: number = 10): Quiz {
    let questions: Question[];
    
    if (topicId) {
      questions = this.getAllQuestions().filter(q => q.subjectId === subjectId && q.topicId === topicId);
    } else {
      questions = this.getAllQuestions().filter(q => q.subjectId === subjectId);
    }
    
    // Shuffle and select questions
    questions = this.shuffle(questions).slice(0, questionCount);
    
    return {
      id: `quiz-${Date.now()}`,
      title: topicId ? `${topicId} Quiz` : `${subjectId} Quiz`,
      questions,
      passingScore: 60,
      shuffleQuestions: true,
      showAnswers: true
    };
  }
  
  checkAnswer(question: Question, userAnswer: string): boolean {
    if (question.type === 'multiple-choice' || question.type === 'true-false') {
      return userAnswer === question.correctAnswer;
    }
    
    if (question.type === 'short-answer') {
      return userAnswer.toLowerCase().trim() === question.correctAnswer?.toLowerCase().trim();
    }
    
    // Essay questions are manually graded
    return true;
  }
  
  calculateScore(questions: Question[], answers: Map<string, string>): {
    score: number;
    total: number;
    percentage: number;
    results: QuestionResult[];
  } {
    let score = 0;
    const results: QuestionResult[] = [];
    
    questions.forEach(question => {
      const userAnswer = answers.get(question.id) || '';
      const isCorrect = this.checkAnswer(question, userAnswer);
      
      if (isCorrect) score++;
      
      results.push({
        questionId: question.id,
        userAnswer,
        correctAnswer: question.correctAnswer || '',
        isCorrect
      });
    });
    
    const total = questions.length;
    const percentage = total > 0 ? Math.round((score / total) * 100) : 0;
    
    return { score, total, percentage, results };
  }
  
  saveQuizResult(result: QuizResult): void {
    this.quizResults.push(result);
    
    // Save to localStorage
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('happystudy3d-quiz-results');
        const results = saved ? JSON.parse(saved) : [];
        results.push(result);
        localStorage.setItem('happystudy3d-quiz-results', JSON.stringify(results));
      } catch (error) {
        console.warn('Failed to save quiz result:', error);
      }
    }
  }
  
  getQuizResults(): QuizResult[] {
    // Load from localStorage if not loaded
    if (this.quizResults.length === 0 && typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('happystudy3d-quiz-results');
        if (saved) {
          this.quizResults = JSON.parse(saved);
        }
      } catch (error) {
        console.warn('Failed to load quiz results:', error);
      }
    }
    
    return this.quizResults;
  }
  
  getQuizResultsForSubject(subjectId: string): QuizResult[] {
    return this.getQuizResults().filter(r => r.subjectId === subjectId);
  }
  
  private shuffle<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = shuffled[i]!;
      shuffled[i] = shuffled[j]!;
      shuffled[j] = temp;
    }
    return shuffled;
  }
  
  clearResults(): void {
    this.quizResults = [];
    if (typeof window !== 'undefined') {
      localStorage.removeItem('happystudy3d-quiz-results');
    }
  }
}

export const questionService = new QuestionService();