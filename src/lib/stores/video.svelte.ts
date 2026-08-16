import { browser } from '$app/environment';

export interface VideoRecording {
  id: string;
  name: string;
  blob: Blob;
  url: string;
  duration: number;
  timestamp: string;
}

class VideoStore {
  private recordings = $state<VideoRecording[]>([]);
  private db: IDBDatabase | null = null;
  private readonly DB_NAME = 'HappyStudy3D';
  private readonly DB_VERSION = 4;
  private readonly STORE = 'video';

  constructor() { if (browser) this.open(); }

  private open(): void {
    const request = indexedDB.open(this.DB_NAME, this.DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains('audio')) { const audio = db.createObjectStore('audio', { keyPath: 'id' }); audio.createIndex('timestamp', 'timestamp'); }
      if (!db.objectStoreNames.contains('progress')) { const progress = db.createObjectStore('progress', { keyPath: 'subjectId' }); progress.createIndex('subjectId', 'subjectId'); progress.createIndex('area', 'area'); }
      if (!db.objectStoreNames.contains(this.STORE)) { const store = db.createObjectStore(this.STORE, { keyPath: 'id' }); store.createIndex('timestamp', 'timestamp'); }
    };
    request.onsuccess = () => { this.db = request.result; this.load(); };
    request.onerror = () => console.error('Video library could not open.');
  }

  private load(): void {
    if (!this.db) return;
    const request = this.db.transaction(this.STORE, 'readonly').objectStore(this.STORE).getAll();
    request.onsuccess = () => { this.recordings = (request.result as Omit<VideoRecording, 'url'>[]).map((recording) => ({ ...recording, url: URL.createObjectURL(recording.blob) })).sort((a, b) => b.timestamp.localeCompare(a.timestamp)); };
  }

  async add(blob: Blob, duration: number, name?: string): Promise<VideoRecording> {
    const recording: VideoRecording = { id: `video-${Date.now()}`, name: name || `Screen recording ${new Date().toLocaleString()}`, blob, url: URL.createObjectURL(blob), duration, timestamp: new Date().toISOString() };
    if (this.db) await this.request<void>(this.db.transaction(this.STORE, 'readwrite').objectStore(this.STORE).put(recording));
    this.recordings = [recording, ...this.recordings];
    return recording;
  }

  async remove(id: string): Promise<void> {
    const recording = this.recordings.find((item) => item.id === id);
    if (this.db) await this.request<void>(this.db.transaction(this.STORE, 'readwrite').objectStore(this.STORE).delete(id));
    if (recording?.url.startsWith('blob:')) URL.revokeObjectURL(recording.url);
    this.recordings = this.recordings.filter((item) => item.id !== id);
  }

  async rename(id: string, name: string): Promise<void> {
    const recording = this.recordings.find((item) => item.id === id);
    if (!recording) return;
    const updated = { ...recording, name };
    if (this.db) await this.request<void>(this.db.transaction(this.STORE, 'readwrite').objectStore(this.STORE).put(updated));
    this.recordings = this.recordings.map((item) => item.id === id ? updated : item);
  }

  private request<T>(request: IDBRequest): Promise<T> { return new Promise((resolve, reject) => { request.onsuccess = () => resolve(request.result as T); request.onerror = () => reject(request.error); }); }
  get items(): VideoRecording[] { return this.recordings; }
}

export const videoStore = new VideoStore();
