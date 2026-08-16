import { browser } from '$app/environment';

const STORAGE_PREFIX = 'happystudy3d-';

export function setLocalStorage(key: string, value: any): void {
  if (!browser) return;
  
  try {
    const serialized = typeof value === 'string' ? value : JSON.stringify(value);
    localStorage.setItem(STORAGE_PREFIX + key, serialized);
  } catch (error) {
    console.warn(`Failed to save ${key} to localStorage:`, error);
  }
}

export function getLocalStorage<T>(key: string, defaultValue?: T): T | null {
  if (!browser) return defaultValue || null;
  
  try {
    const value = localStorage.getItem(STORAGE_PREFIX + key);
    if (value === null) return defaultValue || null;
    
    try {
      return JSON.parse(value) as T;
    } catch {
      return value as unknown as T;
    }
  } catch (error) {
    console.warn(`Failed to load ${key} from localStorage:`, error);
    return defaultValue || null;
  }
}

export function removeLocalStorage(key: string): void {
  if (!browser) return;
  
  try {
    localStorage.removeItem(STORAGE_PREFIX + key);
  } catch (error) {
    console.warn(`Failed to remove ${key} from localStorage:`, error);
  }
}

export function clearLocalStorage(): void {
  if (!browser) return;
  
  try {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith(STORAGE_PREFIX)) {
        localStorage.removeItem(key);
      }
    });
  } catch (error) {
    console.warn('Failed to clear localStorage:', error);
  }
}

export function getStorageSize(): number {
  if (!browser) return 0;
  
  try {
    let totalSize = 0;
    const keys = Object.keys(localStorage);
    
    keys.forEach(key => {
      if (key.startsWith(STORAGE_PREFIX)) {
        totalSize += localStorage.getItem(key)?.length || 0;
      }
    });
    
    return totalSize;
  } catch (error) {
    console.warn('Failed to get storage size:', error);
    return 0;
  }
}

export function setSessionStorage(key: string, value: any): void {
  if (!browser) return;
  
  try {
    const serialized = typeof value === 'string' ? value : JSON.stringify(value);
    sessionStorage.setItem(STORAGE_PREFIX + key, serialized);
  } catch (error) {
    console.warn(`Failed to save ${key} to sessionStorage:`, error);
  }
}

export function getSessionStorage<T>(key: string, defaultValue?: T): T | null {
  if (!browser) return defaultValue || null;
  
  try {
    const value = sessionStorage.getItem(STORAGE_PREFIX + key);
    if (value === null) return defaultValue || null;
    
    try {
      return JSON.parse(value) as T;
    } catch {
      return value as unknown as T;
    }
  } catch (error) {
    console.warn(`Failed to load ${key} from sessionStorage:`, error);
    return defaultValue || null;
  }
}

export function removeSessionStorage(key: string): void {
  if (!browser) return;
  
  try {
    sessionStorage.removeItem(STORAGE_PREFIX + key);
  } catch (error) {
    console.warn(`Failed to remove ${key} from sessionStorage:`, error);
  }
}

export function clearSessionStorage(): void {
  if (!browser) return;
  
  try {
    const keys = Object.keys(sessionStorage);
    keys.forEach(key => {
      if (key.startsWith(STORAGE_PREFIX)) {
        sessionStorage.removeItem(key);
      }
    });
  } catch (error) {
    console.warn('Failed to clear sessionStorage:', error);
  }
}

export function getAllStorageKeys(): string[] {
  if (!browser) return [];
  
  try {
    return Object.keys(localStorage)
      .filter(key => key.startsWith(STORAGE_PREFIX))
      .map(key => key.substring(STORAGE_PREFIX.length));
  } catch (error) {
    console.warn('Failed to get storage keys:', error);
    return [];
  }
}

export function hasStorageKey(key: string): boolean {
  if (!browser) return false;
  
  try {
    return localStorage.getItem(STORAGE_PREFIX + key) !== null;
  } catch (error) {
    console.warn(`Failed to check ${key}:`, error);
    return false;
  }
}

export function getAllStorageItems(): Record<string, any> {
  if (!browser) return {};
  
  try {
    const items: Record<string, any> = {};
    const keys = getAllStorageKeys();
    
    keys.forEach(key => {
      items[key] = getLocalStorage(key);
    });
    
    return items;
  } catch (error) {
    console.warn('Failed to get all storage items:', error);
    return {};
  }
}

export function exportStorage(): string {
  const items = getAllStorageItems();
  return JSON.stringify(items, null, 2);
}

export function importStorage(jsonData: string): void {
  try {
    const items = JSON.parse(jsonData);
    
    Object.keys(items).forEach(key => {
      setLocalStorage(key, items[key]);
    });
  } catch (error) {
    console.error('Failed to import storage:', error);
    throw error;
  }
}