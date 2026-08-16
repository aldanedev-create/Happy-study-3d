import { getContext, setContext } from 'svelte';
import { browser } from '$app/environment';

export interface AudioRecording {
  id: string;
  name: string;
  url: string;
  blob?: Blob;
  duration: number;
  timestamp: string;
}

interface AudioState {
  recordings: AudioRecording[];
  isRecording: boolean;
  isPaused: boolean;
  currentRecordingId: string | null;
  recordingTime: number;
  isLoading: boolean;
}

class AudioStore {
  private state = $state<AudioState>({
    recordings: [],
    isRecording: false,
    isPaused: false,
    currentRecordingId: null,
    recordingTime: 0,
    isLoading: false
  });
  
  private db: IDBDatabase | null = null;
  private readonly DB_NAME = 'HappyStudy3D';
  private readonly DB_VERSION = 4;
  private readonly STORE_NAME = 'audio';
  
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private stream: MediaStream | null = null;
  private timerInterval: ReturnType<typeof setInterval> | null = null;
  
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
        this.loadRecordings();
      };
      
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        if (!db.objectStoreNames.contains(this.STORE_NAME)) {
          const store = db.createObjectStore(this.STORE_NAME, { keyPath: 'id' });
          store.createIndex('timestamp', 'timestamp', { unique: false });
        }
        // Both stores share one database. Creating both on every upgrade prevents
        // whichever feature opens first from leaving the other without a store.
        if (!db.objectStoreNames.contains('progress')) {
          const progress = db.createObjectStore('progress', { keyPath: 'subjectId' });
          progress.createIndex('subjectId', 'subjectId', { unique: false });
          progress.createIndex('area', 'area', { unique: false });
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
  
  async loadRecordings(): Promise<void> {
    if (!this.db) return;
    if (!this.db.objectStoreNames.contains(this.STORE_NAME)) return;
    
    this.state.isLoading = true;
    
    try {
      const transaction = this.db.transaction(this.STORE_NAME, 'readonly');
      const store = transaction.objectStore(this.STORE_NAME);
      const request = store.getAll();
      
      request.onsuccess = () => {
        const rawRecordings = request.result as AudioRecording[];
        // Re-create object URLs for saved blobs across page reloads
        this.state.recordings = rawRecordings.map((rec) => {
          let url = rec.url;
          if (rec.blob) {
            url = URL.createObjectURL(rec.blob);
          }
          return { ...rec, url };
        });
        this.state.isLoading = false;
      };
      
      request.onerror = () => {
        console.error('Failed to load recordings');
        this.state.isLoading = false;
      };
    } catch (error) {
      console.error('Failed to load recordings:', error);
      this.state.isLoading = false;
    }
  }
  
  async startRecording(): Promise<void> {
    if (!browser || !navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === 'undefined') {
      throw new Error('Audio recording is not supported in this browser.');
    }
    if (this.state.isRecording) return;
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const preferredTypes = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4'];
      const mimeType = preferredTypes.find((type) => MediaRecorder.isTypeSupported(type));
      this.mediaRecorder = mimeType ? new MediaRecorder(this.stream, { mimeType }) : new MediaRecorder(this.stream);
      this.audioChunks = [];
      
      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      };
      
      this.mediaRecorder.onstop = () => {
        this.saveRecording();
        this.cleanupRecording();
      };
      
      this.mediaRecorder.start(1000);
      this.state.isRecording = true;
      this.state.isPaused = false;
      this.state.recordingTime = 0;
      
      this.timerInterval = setInterval(() => {
        if (!this.state.isPaused) {
          this.state.recordingTime++;
        }
      }, 1000);
    } catch (error) {
      console.error('Failed to start recording:', error);
      throw error;
    }
  }
  
  pauseRecording(): void {
    if (this.mediaRecorder && this.state.isRecording) {
      if (this.state.isPaused) {
        this.mediaRecorder.resume();
        this.state.isPaused = false;
      } else {
        this.mediaRecorder.pause();
        this.state.isPaused = true;
      }
    }
  }
  
  stopRecording(): void {
    if (this.mediaRecorder && this.state.isRecording) {
      this.mediaRecorder.stop();
      this.state.isRecording = false;
      this.state.isPaused = false;
      
      if (this.timerInterval) {
        clearInterval(this.timerInterval);
        this.timerInterval = null;
      }
    }
  }

  cancelRecording(): void {
    if (!this.mediaRecorder || !this.state.isRecording) return;
    this.mediaRecorder.onstop = null;
    this.mediaRecorder.stop();
    this.state.isRecording = false;
    this.state.isPaused = false;
    this.state.recordingTime = 0;
    if (this.timerInterval) clearInterval(this.timerInterval);
    this.timerInterval = null;
    this.cleanupRecording();
  }
  
  /**
   * Allows adding an audio recording manually or from external components
   */
  async addRecording(data: { name?: string; blob: Blob; duration: number }): Promise<AudioRecording | void> {
    const timestamp = new Date().toISOString();
    const id = `recording-${Date.now()}`;
    const url = URL.createObjectURL(data.blob);
    
    const recording: AudioRecording = {
      id,
      name: data.name || `Recording ${new Date().toLocaleString()}`,
      url,
      blob: data.blob,
      duration: data.duration,
      timestamp
    };

    if (this.db && this.db.objectStoreNames.contains(this.STORE_NAME)) {
      try {
        const transaction = this.db.transaction(this.STORE_NAME, 'readwrite');
        const store = transaction.objectStore(this.STORE_NAME);
        await new Promise<void>((resolve, reject) => {
          const request = store.put(recording);
          request.onsuccess = () => resolve();
          request.onerror = () => reject(request.error);
        });
      } catch (error) {
        console.error('Failed to persist recording to IndexedDB:', error);
      }
    }

    this.state.recordings.unshift(recording);
    return recording;
  }
  
  private async saveRecording(): Promise<void> {
    if (this.audioChunks.length === 0) return;
    
    const audioBlob = new Blob(this.audioChunks, { type: this.mediaRecorder?.mimeType || 'audio/webm' });
    await this.addRecording({
      blob: audioBlob,
      duration: this.state.recordingTime
    });
  }
  
  private cleanupRecording(): void {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
    
    this.mediaRecorder = null;
    this.audioChunks = [];
  }
  
  async deleteRecording(id: string): Promise<void> {
    if (this.db && this.db.objectStoreNames.contains(this.STORE_NAME)) {
      try {
        const transaction = this.db.transaction(this.STORE_NAME, 'readwrite');
        const store = transaction.objectStore(this.STORE_NAME);
        
        await new Promise<void>((resolve, reject) => {
          const request = store.delete(id);
          request.onsuccess = () => resolve();
          request.onerror = () => reject(request.error);
        });
      } catch (error) {
        console.error('Failed to delete recording:', error);
      }
    }

    const index = this.state.recordings.findIndex(r => r.id === id);
    if (index >= 0) {
      const recording = this.state.recordings[index];
      if (recording?.url.startsWith('blob:')) {
        URL.revokeObjectURL(recording.url);
      }
      this.state.recordings.splice(index, 1);
    }
  }
  
  async renameRecording(id: string, newName: string): Promise<void> {
    const recording = this.state.recordings.find(r => r.id === id);
    if (!recording) return;
    
    recording.name = newName;

    if (this.db && this.db.objectStoreNames.contains(this.STORE_NAME)) {
      try {
        const transaction = this.db.transaction(this.STORE_NAME, 'readwrite');
        const store = transaction.objectStore(this.STORE_NAME);
        
        await new Promise<void>((resolve, reject) => {
          const request = store.put(recording);
          request.onsuccess = () => resolve();
          request.onerror = () => reject(request.error);
        });
      } catch (error) {
        console.error('Failed to rename recording:', error);
      }
    }
    
    const index = this.state.recordings.findIndex(r => r.id === id);
    if (index >= 0) {
      this.state.recordings[index] = { ...recording };
    }
  }
  
  async clearAllRecordings(): Promise<void> {
    if (this.db && this.db.objectStoreNames.contains(this.STORE_NAME)) {
      try {
        const transaction = this.db.transaction(this.STORE_NAME, 'readwrite');
        const store = transaction.objectStore(this.STORE_NAME);
        
        await new Promise<void>((resolve, reject) => {
          const request = store.clear();
          request.onsuccess = () => resolve();
          request.onerror = () => reject(request.error);
        });
      } catch (error) {
        console.error('Failed to clear recordings:', error);
      }
    }

    this.state.recordings.forEach(recording => {
      if (recording.url.startsWith('blob:')) {
        URL.revokeObjectURL(recording.url);
      }
    });
    
    this.state.recordings = [];
  }
  
  async exportRecordings(): Promise<any[]> {
    try {
      return this.state.recordings.map(recording => ({
        id: recording.id,
        name: recording.name,
        duration: recording.duration,
        timestamp: recording.timestamp
      }));
    } catch (error) {
      console.error('Failed to export recordings:', error);
      return [];
    }
  }
  
  async importRecordings(data: any[]): Promise<void> {
    try {
      if (Array.isArray(data)) {
        this.state.recordings = data;
        
        if (this.db && this.db.objectStoreNames.contains(this.STORE_NAME)) {
          const transaction = this.db.transaction(this.STORE_NAME, 'readwrite');
          const store = transaction.objectStore(this.STORE_NAME);
          
          for (const recording of this.state.recordings) {
            store.put(recording);
          }
        }
      }
    } catch (error) {
      console.error('Failed to import recordings:', error);
      throw error;
    }
  }
  
  get recordings(): AudioRecording[] {
    return this.state.recordings;
  }
  
  get isRecording(): boolean {
    return this.state.isRecording;
  }
  
  get isPaused(): boolean {
    return this.state.isPaused;
  }
  
  get recordingTime(): number {
    return this.state.recordingTime;
  }
  
  get isLoading(): boolean {
    return this.state.isLoading;
  }
}

export const audioStore = new AudioStore();

const AUDIO_STORE_KEY = Symbol('audio-store');

export function setAudioStoreContext(): void {
  setContext(AUDIO_STORE_KEY, audioStore);
}

export function getAudioStore(): AudioStore {
  return getContext<AudioStore>(AUDIO_STORE_KEY);
}
