import { browser } from '$app/environment';

class StorageService {
  private readonly PREFIX = 'happystudy3d-';
  
  setItem(key: string, value: any): void {
    if (!browser) return;
    
    try {
      const serialized = JSON.stringify(value);
      localStorage.setItem(this.PREFIX + key, serialized);
    } catch (error) {
      console.warn(`Failed to save ${key}:`, error);
    }
  }
  
  getItem<T>(key: string, defaultValue?: T): T | null {
    if (!browser) return defaultValue || null;
    
    try {
      const serialized = localStorage.getItem(this.PREFIX + key);
      if (serialized === null) return defaultValue || null;
      return JSON.parse(serialized) as T;
    } catch (error) {
      console.warn(`Failed to load ${key}:`, error);
      return defaultValue || null;
    }
  }
  
  removeItem(key: string): void {
    if (!browser) return;
    
    try {
      localStorage.removeItem(this.PREFIX + key);
    } catch (error) {
      console.warn(`Failed to remove ${key}:`, error);
    }
  }
  
  clear(): void {
    if (!browser) return;
    
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith(this.PREFIX)) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.warn('Failed to clear storage:', error);
    }
  }
  
  getKeys(): string[] {
    if (!browser) return [];
    
    try {
      return Object.keys(localStorage)
        .filter(key => key.startsWith(this.PREFIX))
        .map(key => key.substring(this.PREFIX.length));
    } catch (error) {
      console.warn('Failed to get keys:', error);
      return [];
    }
  }
  
  getSize(): number {
    if (!browser) return 0;
    
    try {
      let totalSize = 0;
      const keys = Object.keys(localStorage);
      
      keys.forEach(key => {
        if (key.startsWith(this.PREFIX)) {
          totalSize += localStorage.getItem(key)?.length || 0;
        }
      });
      
      return totalSize;
    } catch (error) {
      console.warn('Failed to get size:', error);
      return 0;
    }
  }
  
  // IndexedDB operations for larger data
  private db: IDBDatabase | null = null;
  
  async initIndexedDB(): Promise<void> {
    if (!browser) return;
    
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('HappyStudy3D', 1);
      
      request.onerror = () => reject(request.error);
      
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };
      
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        if (!db.objectStoreNames.contains('progress')) {
          db.createObjectStore('progress', { keyPath: 'id' });
        }
        
        if (!db.objectStoreNames.contains('audio')) {
          db.createObjectStore('audio', { keyPath: 'id' });
        }
        
        if (!db.objectStoreNames.contains('settings')) {
          db.createObjectStore('settings', { keyPath: 'id' });
        }
      };
    });
  }
  
  async saveToIndexedDB(storeName: string, data: any): Promise<void> {
    if (!browser || !this.db) return;
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.put(data);
      
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }
  
  async getFromIndexedDB<T>(storeName: string, id: string): Promise<T | null> {
    if (!browser || !this.db) return null;
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(storeName, 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.get(id);
      
      request.onsuccess = () => resolve(request.result as T);
      request.onerror = () => reject(request.error);
    });
  }
  
  async getAllFromIndexedDB<T>(storeName: string): Promise<T[]> {
    if (!browser || !this.db) return [];
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(storeName, 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.getAll();
      
      request.onsuccess = () => resolve(request.result as T[]);
      request.onerror = () => reject(request.error);
    });
  }
  
  async deleteFromIndexedDB(storeName: string, id: string): Promise<void> {
    if (!browser || !this.db) return;
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.delete(id);
      
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }
}

export const storageService = new StorageService();