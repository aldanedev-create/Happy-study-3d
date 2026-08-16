import { getContext, setContext } from 'svelte';
import { browser } from '$app/environment';

interface SubjectProgress {
  subjectId: string;
  subjectName: string;
  area: 'cxc' | 'cape' | 'software-engineering';
  topicsCompleted: number;
  totalTopics: number;
  quizzesTaken: number;
  averageScore: number;
  lastStudied: string;
  percentage: number;
}

interface ProgressState {
  subjects: SubjectProgress[];
  overallPercentage: number;
  totalQuizzesTaken: number;
  totalStudyTime: number;
  lastActiveDate: string;
}

class ProgressStore {
  private state = $state<ProgressState>({
    subjects: [],
    overallPercentage: 0,
    totalQuizzesTaken: 0,
    totalStudyTime: 0,
    lastActiveDate: new Date().toISOString()
  });
  
  private db: IDBDatabase | null = null;
  private readonly DB_NAME = 'HappyStudy3D';
  private readonly DB_VERSION = 4;
  private readonly STORE_NAME = 'progress';
  
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
          const store = db.createObjectStore(this.STORE_NAME, { keyPath: 'subjectId' });
          store.createIndex('subjectId', 'subjectId', { unique: false });
          store.createIndex('area', 'area', { unique: false });
        }
        if (!db.objectStoreNames.contains('audio')) {
          const audio = db.createObjectStore('audio', { keyPath: 'id' });
          audio.createIndex('timestamp', 'timestamp', { unique: false });
        }
        if (!db.objectStoreNames.contains('video')) {
          const video = db.createObjectStore('video', { keyPath: 'id' });
          video.createIndex('timestamp', 'timestamp', { unique: false });
        }
      };
    } catch (error) {
      console.error('Failed to initialize IndexedDB:', error);
    }
  }
  
  async loadProgress(): Promise<void> {
    if (!this.db) return;
    
    try {
      const transaction = this.db.transaction(this.STORE_NAME, 'readonly');
      const store = transaction.objectStore(this.STORE_NAME);
      const request = store.getAll();
      
      request.onsuccess = () => {
        const subjects = request.result as SubjectProgress[];
        this.state.subjects = subjects;
        this.calculateOverall();
      };
      
      request.onerror = () => {
        console.error('Failed to load progress');
      };
    } catch (error) {
      console.error('Failed to load progress:', error);
    }
  }
  
  async updateSubjectProgress(
    subjectId: string,
    subjectName: string,
    area: 'cxc' | 'cape' | 'software-engineering',
    topicsCompleted: number,
    totalTopics: number,
    quizScore?: number
  ): Promise<void> {
    if (!this.db) return;
    
    try {
      const existing = this.state.subjects.find(s => s.subjectId === subjectId);
      const percentage = totalTopics > 0 ? (topicsCompleted / totalTopics) * 100 : 0;
      
      const progress: SubjectProgress = {
        subjectId,
        subjectName,
        area,
        topicsCompleted,
        totalTopics,
        quizzesTaken: (existing?.quizzesTaken || 0) + (quizScore !== undefined ? 1 : 0),
        averageScore: existing 
          ? (existing.averageScore * existing.quizzesTaken + (quizScore || 0)) / ((existing.quizzesTaken || 0) + (quizScore !== undefined ? 1 : 0))
          : (quizScore || 0),
        lastStudied: new Date().toISOString(),
        percentage
      };
      
      const transaction = this.db.transaction(this.STORE_NAME, 'readwrite');
      const store = transaction.objectStore(this.STORE_NAME);
      
      await new Promise<void>((resolve, reject) => {
        const request = store.put(progress);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
      
      const index = this.state.subjects.findIndex(s => s.subjectId === subjectId);
      if (index >= 0) {
        this.state.subjects[index] = progress;
      } else {
        this.state.subjects.push(progress);
      }
      
      this.calculateOverall();
    } catch (error) {
      console.error('Failed to update progress:', error);
    }
  }
  
  async recordQuizResult(
    subjectId: string,
    subjectName: string,
    area: 'cxc' | 'cape' | 'software-engineering',
    score: number,
    totalQuestions: number
  ): Promise<void> {
    const percentage = totalQuestions > 0 ? (score / totalQuestions) * 100 : 0;
    this.state.totalQuizzesTaken++;
    
    await this.updateSubjectProgress(
      subjectId,
      subjectName,
      area,
      0,
      0,
      percentage
    );
  }
  
  async markTopicCompleted(
    subjectId: string,
    subjectName: string,
    area: 'cxc' | 'cape' | 'software-engineering',
    _topicId: string
  ): Promise<void> {
    const existing = this.state.subjects.find(s => s.subjectId === subjectId);
    
    await this.updateSubjectProgress(
      subjectId,
      subjectName,
      area,
      (existing?.topicsCompleted || 0) + 1,
      (existing?.totalTopics || 0) + 1
    );
  }
  
  private calculateOverall(): void {
    if (this.state.subjects.length === 0) {
      this.state.overallPercentage = 0;
      return;
    }
    
    const totalPercentage = this.state.subjects.reduce((sum, subject) => {
      return sum + subject.percentage;
    }, 0);
    
    this.state.overallPercentage = totalPercentage / this.state.subjects.length;
    this.state.lastActiveDate = new Date().toISOString();
  }
  
  async clearAllProgress(): Promise<void> {
    if (!this.db) return;
    
    try {
      const transaction = this.db.transaction(this.STORE_NAME, 'readwrite');
      const store = transaction.objectStore(this.STORE_NAME);
      
      await new Promise<void>((resolve, reject) => {
        const request = store.clear();
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
      
      this.state.subjects = [];
      this.state.overallPercentage = 0;
      this.state.totalQuizzesTaken = 0;
      this.state.totalStudyTime = 0;
    } catch (error) {
      console.error('Failed to clear progress:', error);
    }
  }
  
  async exportProgress(): Promise<string> {
    try {
      const data = {
        subjects: this.state.subjects,
        overallPercentage: this.state.overallPercentage,
        totalQuizzesTaken: this.state.totalQuizzesTaken,
        exportDate: new Date().toISOString()
      };
      
      return JSON.stringify(data, null, 2);
    } catch (error) {
      console.error('Failed to export progress:', error);
      return '{}';
    }
  }
  
  async importProgress(jsonData: string): Promise<void> {
    try {
      const data = JSON.parse(jsonData);
      
      if (data.subjects && Array.isArray(data.subjects)) {
        this.state.subjects = data.subjects;
        this.calculateOverall();
        
        if (this.db) {
          const transaction = this.db.transaction(this.STORE_NAME, 'readwrite');
          const store = transaction.objectStore(this.STORE_NAME);
          
          for (const subject of this.state.subjects) {
            store.put(subject);
          }
        }
      }
    } catch (error) {
      console.error('Failed to import progress:', error);
      throw error;
    }
  }
  
  get subjects(): SubjectProgress[] {
    return this.state.subjects;
  }
  
  get overallPercentage(): number {
    return this.state.overallPercentage;
  }
  
  get totalQuizzesTaken(): number {
    return this.state.totalQuizzesTaken;
  }
  
  getSubjectProgress(subjectId: string): SubjectProgress | undefined {
    return this.state.subjects.find(s => s.subjectId === subjectId);
  }
}

export const progressStore = new ProgressStore();

const PROGRESS_STORE_KEY = Symbol('progress-store');

export function setProgressStoreContext(): void {
  setContext(PROGRESS_STORE_KEY, progressStore);
}

export function getProgressStore(): ProgressStore {
  return getContext<ProgressStore>(PROGRESS_STORE_KEY);
}
