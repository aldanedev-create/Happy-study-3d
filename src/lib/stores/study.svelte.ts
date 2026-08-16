import { browser } from '$app/environment';
import { curriculumService } from '$services/curriculum';
import type { Lesson, PracticeQuestion, Subject, Topic } from '$types/subject';

export type StudyMode = 'learn' | 'practice' | 'quiz' | 'exam';

type StudyState = {
  currentSubject: Subject | null;
  currentTopic: Topic | null;
  currentLesson: Lesson | null;
  currentQuestions: PracticeQuestion[];
  currentQuestionIndex: number;
  score: number;
  studyMode: StudyMode;
  isLoading: boolean;
  error: string | null;
};

const firstLesson = (topic: Topic): Lesson | null => {
  if (topic.lessons?.length) return topic.lessons[0];
  if (!topic.summary && !topic.mustKnow && !topic.keyTerms) return null;
  return {
    id: `${topic.id}-lesson`, title: topic.title, summary: topic.summary || topic.description || '',
    mustKnow: topic.mustKnow, keyTerms: topic.keyTerms, examples: topic.examples,
    formulas: topic.formulas, codeExamples: topic.codeExamples, commonMistakes: topic.commonMistakes,
    practiceQuestions: topic.questions, furtherResearch: topic.furtherResearch,
    externalResources: topic.resources, importance: topic.importance, difficulty: topic.difficulty
  };
};

const questionsFor = (topic: Topic): PracticeQuestion[] => [
  ...(topic.questions || []),
  ...(topic.lessons || []).flatMap((lesson) => lesson.practiceQuestions || [])
];

class StudyStore {
  private state = $state<StudyState>({
    currentSubject: null, currentTopic: null, currentLesson: null, currentQuestions: [],
    currentQuestionIndex: 0, score: 0, studyMode: 'learn', isLoading: false, error: null
  });

  loadSubject(subjectId: string, area: 'cxc' | 'cape' | 'software-engineering'): void {
    this.state.isLoading = true;
    this.state.error = null;
    const subject = curriculumService.loadSubject(subjectId, area) as Subject | null;
    if (!subject) {
      this.state.error = `We could not find ${subjectId}. Please choose a subject from the library.`;
      this.state.isLoading = false;
      return;
    }
    this.state.currentSubject = subject;
    this.setTopic(this.topics(subject)[0] || null);
    this.state.isLoading = false;
    this.save();
  }

  private topics(subject: Subject): Topic[] {
    if (subject.topics) return subject.topics;
    if (subject.units) return subject.units.flatMap((unit) => unit.topics || []);
    return subject.levels?.flatMap((level) => level.topics || []) || [];
  }

  loadTopic(topicId: string): void {
    const topic = this.currentSubject ? this.topics(this.currentSubject).find((item) => item.id === topicId) : null;
    if (topic) { this.setTopic(topic); this.save(); }
  }

  private setTopic(topic: Topic | null): void {
    this.state.currentTopic = topic;
    this.state.currentLesson = topic ? firstLesson(topic) : null;
    this.state.currentQuestions = topic ? questionsFor(topic) : [];
    this.state.currentQuestionIndex = 0;
    this.state.score = 0;
  }

  setStudyMode(mode: StudyMode): void { this.state.studyMode = mode; this.resetQuiz(); this.save(); }
  answerQuestion(answer: string): boolean {
    const correct = Boolean(this.currentQuestion?.correctAnswer && this.currentQuestion.correctAnswer === answer);
    if (correct) this.state.score += 1;
    return correct;
  }
  nextQuestion(): boolean {
    if (this.state.currentQuestionIndex >= this.state.currentQuestions.length - 1) return false;
    this.state.currentQuestionIndex += 1;
    return true;
  }
  resetQuiz(): void { this.state.currentQuestionIndex = 0; this.state.score = 0; }
  saveProgress(): void {
    if (!browser || !this.currentTopic) return;
    const saved = JSON.parse(localStorage.getItem('happystudy3d-progress') || '{}');
    saved[this.currentTopic.id] = { score: this.state.score, total: this.state.currentQuestions.length, updatedAt: new Date().toISOString() };
    localStorage.setItem('happystudy3d-progress', JSON.stringify(saved));
  }
  private save(): void { if (browser) sessionStorage.setItem('happystudy3d-study', JSON.stringify({ subjectId: this.currentSubject?.id, mode: this.state.studyMode })); }
  get topicList(): Topic[] { return this.currentSubject ? this.topics(this.currentSubject) : []; }
  get currentSubject() { return this.state.currentSubject; }
  get currentTopic() { return this.state.currentTopic; }
  get currentLesson() { return this.state.currentLesson; }
  get currentQuestions() { return this.state.currentQuestions; }
  get currentQuestionIndex() { return this.state.currentQuestionIndex; }
  get currentQuestion() { return this.state.currentQuestions[this.state.currentQuestionIndex] || null; }
  get score() { return this.state.score; }
  get isLoading() { return this.state.isLoading; }
  get error() { return this.state.error; }
}

export const studyStore = new StudyStore();
