import type { SubjectProgress, TopicProgressData, LessonProgressData, StudySession, OverallProgress } from '$types/progress';
import type { CurriculumArea } from '$types/subject';
import { browser } from '$app/environment';

class ProgressService {
  private db: IDBDatabase | null = null;
  private readonly DB_NAME = 'HappyStudy3D';
  private readonly DB_VERSION = 1;
  private readonly STORE_NAME = 'progress';
  
  private progressData: {
    subjects: SubjectProgress[];
    topics: TopicProgressData[];
    lessons: LessonProgressData[];
    sessions: StudySession[];
  } = {
    subjects: [],
    topics: [],
    lessons: [],
    sessions: []
  };
  
  constructor() {
    if (browser) {
      this.initDatabase();
    }
  }
  
  private async initDatabase(): Promise<void> {
    try {
      const request = indexedDB.open(this.DB_NAME, this.DB_VERSION);
      
      request.onerror = () => {
        console.error('Failed to open IndexedDB');
      };
      
      request.onsuccess = () => {
        this.db = request.result;
        this.loadProgress();
      };
      
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        if (!db.objectStoreNames.contains(this.STORE_NAME)) {
          const store = db.createObjectStore(this.STORE_NAME, { keyPath: 'id' });
          store.createIndex('subjectId', 'subjectId', { unique: false });
          store.createIndex('type', 'type', { unique: false });
        }
      };
    } catch (error) {
      console.error('Failed to initialize IndexedDB:', error);
    }
  }
  
  private async loadProgress(): Promise<void> {
    if (!this.db) return;
    
    try {
      const transaction = this.db.transaction(this.STORE_NAME, 'readonly');
      const store = transaction.objectStore(this.STORE_NAME);
      const request = store.getAll();
      
      request.onsuccess = () => {
        const records = request.result as any[];
        
        records.forEach(record => {
          if (record.type === 'subject') {
            this.progressData.subjects.push(record.data);
          } else if (record.type === 'topic') {
            this.progressData.topics.push(record.data);
          } else if (record.type === 'lesson') {
            this.progressData.lessons.push(record.data);
          } else if (record.type === 'session') {
            this.progressData.sessions.push(record.data);
          }
        });
      };
    } catch (error) {
      console.error('Failed to load progress:', error);
    }
  }
  
  async updateSubjectProgress(
    subjectId: string,
    subjectName: string,
    area: CurriculumArea,
    topicsCompleted: number,
    totalTopics: number,
    averageScore?: number
  ): Promise<void> {
    const existing = this.progressData.subjects.find(s => s.subjectId === subjectId);
    const percentage = totalTopics > 0 ? (topicsCompleted / totalTopics) * 100 : 0;
    
    const progress: SubjectProgress = {
      subjectId,
      subjectName,
      area,
      topicsCompleted,
      totalTopics,
      lessonsCompleted: existing?.lessonsCompleted || 0,
      totalLessons: existing?.totalLessons || 0,
      questionsAnswered: existing?.questionsAnswered || 0,
      totalQuestions: existing?.totalQuestions || 0,
      quizzesTaken: existing?.quizzesTaken || 0,
      averageScore: averageScore !== undefined ? averageScore : (existing?.averageScore || 0),
      lastStudied: new Date().toISOString(),
      timeSpent: existing?.timeSpent || 0,
      percentage
    };
    
    const index = this.progressData.subjects.findIndex(s => s.subjectId === subjectId);
    if (index >= 0) {
      this.progressData.subjects[index] = progress;
    } else {
      this.progressData.subjects.push(progress);
    }
    
    await this.saveToDatabase({
      id: `subject-${subjectId}`,
      type: 'subject',
      subjectId,
      data: progress
    });
  }
  
  async updateTopicProgress(topicData: TopicProgressData): Promise<void> {
    const index = this.progressData.topics.findIndex(t => t.topicId === topicData.topicId);
    if (index >= 0) {
      this.progressData.topics[index] = topicData;
    } else {
      this.progressData.topics.push(topicData);
    }
    
    await this.saveToDatabase({
      id: `topic-${topicData.topicId}`,
      type: 'topic',
      subjectId: topicData.subjectId,
      data: topicData
    });
  }
  
  async updateLessonProgress(lessonData: LessonProgressData): Promise<void> {
    const index = this.progressData.lessons.findIndex(l => l.lessonId === lessonData.lessonId);
    if (index >= 0) {
      this.progressData.lessons[index] = lessonData;
    } else {
      this.progressData.lessons.push(lessonData);
    }
    
    await this.saveToDatabase({
      id: `lesson-${lessonData.lessonId}`,
      type: 'lesson',
      subjectId: lessonData.subjectId,
      data: lessonData
    });
  }
  
  async addStudySession(session: StudySession): Promise<void> {
    this.progressData.sessions.push(session);
    
    await this.saveToDatabase({
      id: session.id,
      type: 'session',
      subjectId: session.subjectId,
      data: session
    });
  }
  
  getSubjectProgress(subjectId: string): SubjectProgress | null {
    return this.progressData.subjects.find(s => s.subjectId === subjectId) || null;
  }
  
  getTopicProgress(topicId: string): TopicProgressData | null {
    return this.progressData.topics.find(t => t.topicId === topicId) || null;
  }
  
  getLessonProgress(lessonId: string): LessonProgressData | null {
    return this.progressData.lessons.find(l => l.lessonId === lessonId) || null;
  }
  
  getAllSubjectProgress(): SubjectProgress[] {
    return this.progressData.subjects;
  }
  
  getOverallProgress(): OverallProgress {
    const subjects = this.progressData.subjects;
    
    const totalSubjects = subjects.length;
    const completedSubjects = subjects.filter(s => s.percentage >= 100).length;
    const totalTopics = subjects.reduce((sum, s) => sum + s.totalTopics, 0);
    const completedTopics = subjects.reduce((sum, s) => sum + s.topicsCompleted, 0);
    const totalLessons = subjects.reduce((sum, s) => sum + s.totalLessons, 0);
    const completedLessons = subjects.reduce((sum, s) => sum + s.lessonsCompleted, 0);
    const totalQuestions = subjects.reduce((sum, s) => sum + s.totalQuestions, 0);
    const answeredQuestions = subjects.reduce((sum, s) => sum + s.questionsAnswered, 0);
    const quizzesTaken = subjects.reduce((sum, s) => sum + s.quizzesTaken, 0);
    const averageScore = subjects.length > 0 
      ? subjects.reduce((sum, s) => sum + s.averageScore, 0) / subjects.length 
      : 0;
    const overallPercentage = subjects.length > 0 
      ? subjects.reduce((sum, s) => sum + s.percentage, 0) / subjects.length 
      : 0;
    
    return {
      totalSubjects,
      totalTopics,
      totalLessons,
      totalQuestions,
      completedSubjects,
      completedTopics,
      completedLessons,
      answeredQuestions,
      quizzesTaken,
      averageScore,
      overallPercentage,
      lastActiveDate: new Date().toISOString(),
      totalStudyTime: this.progressData.sessions.reduce((sum, s) => sum + (s.duration || 0), 0)
    };
  }
  
  private async saveToDatabase(record: any): Promise<void> {
    if (!this.db) return;
    
    try {
      const transaction = this.db.transaction(this.STORE_NAME, 'readwrite');
      const store = transaction.objectStore(this.STORE_NAME);
      
      await new Promise<void>((resolve, reject) => {
        const request = store.put(record);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.error('Failed to save progress:', error);
    }
  }
  
  async clearAllProgress(): Promise<void> {
    this.progressData = {
      subjects: [],
      topics: [],
      lessons: [],
      sessions: []
    };
    
    if (this.db) {
      try {
        const transaction = this.db.transaction(this.STORE_NAME, 'readwrite');
        const store = transaction.objectStore(this.STORE_NAME);
        
        await new Promise<void>((resolve, reject) => {
          const request = store.clear();
          request.onsuccess = () => resolve();
          request.onerror = () => reject(request.error);
        });
      } catch (error) {
        console.error('Failed to clear progress:', error);
      }
    }
  }
}

export const progressService = new ProgressService();