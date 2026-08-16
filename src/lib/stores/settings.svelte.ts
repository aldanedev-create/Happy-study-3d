import { getContext, setContext } from 'svelte';
import { browser } from '$app/environment';
import { progressStore } from './progress.svelte';
import { audioStore } from './audio.svelte';

interface Settings {
  soundEnabled: boolean;
  threeDEnabled: boolean;
  notificationsEnabled: boolean;
  theme: 'dark' | 'light';
  fontSize: 'small' | 'medium' | 'large';
  reducedMotion: boolean;
  autoSave: boolean;
  studyReminders: boolean;
}

interface SettingsState extends Settings {
  isLoaded: boolean;
}

class SettingsStore {
  private state = $state<SettingsState>({
    soundEnabled: true,
    threeDEnabled: true,
    notificationsEnabled: false,
    theme: 'dark',
    fontSize: 'medium',
    reducedMotion: false,
    autoSave: true,
    studyReminders: false,
    isLoaded: false
  });
  
  private readonly STORAGE_KEY = 'happystudy3d-settings';
  
  constructor() {
    if (browser) {
      this.loadSettings();
    }
  }
  
  loadSettings(): void {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      
      if (saved) {
        const settings = JSON.parse(saved);
        this.state = {
          ...this.state,
          ...settings,
          isLoaded: true
        };
      } else {
        this.state.isLoaded = true;
        this.saveSettings();
      }
      
      // Apply settings
      this.applySettings();
    } catch (error) {
      console.error('Failed to load settings:', error);
      this.state.isLoaded = true;
    }
  }
  
  private saveSettings(): void {
    if (!browser) return;
    
    try {
      const settingsToSave = {
        soundEnabled: this.state.soundEnabled,
        threeDEnabled: this.state.threeDEnabled,
        notificationsEnabled: this.state.notificationsEnabled,
        theme: this.state.theme,
        fontSize: this.state.fontSize,
        reducedMotion: this.state.reducedMotion,
        autoSave: this.state.autoSave,
        studyReminders: this.state.studyReminders
      };
      
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(settingsToSave));
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  }
  
  private applySettings(): void {
    if (!browser) return;
    
    // Apply theme
    document.documentElement.setAttribute('data-theme', this.state.theme);
    
    // Apply font size
    document.documentElement.setAttribute('data-font-size', this.state.fontSize);
    
    // Apply reduced motion
    if (this.state.reducedMotion) {
      document.documentElement.classList.add('reduced-motion');
    } else {
      document.documentElement.classList.remove('reduced-motion');
    }
  }
  
  toggleSound(): void {
    this.state.soundEnabled = !this.state.soundEnabled;
    this.saveSettings();
  }
  
  toggle3D(): void {
    this.state.threeDEnabled = !this.state.threeDEnabled;
    this.saveSettings();
  }
  
  async toggleNotifications(): Promise<void> {
    if (!this.state.notificationsEnabled) {
      if (!browser || typeof window.Notification === 'undefined') {
        console.warn('Notifications are not supported in this browser environment.');
        this.state.notificationsEnabled = false;
        this.saveSettings();
        return;
      }

      try {
        const permission = await Notification.requestPermission();
        this.state.notificationsEnabled = permission === 'granted';
      } catch (error) {
        console.error('Failed to request notification permission:', error);
        this.state.notificationsEnabled = false;
      }
    } else {
      this.state.notificationsEnabled = false;
    }
    
    this.saveSettings();
  }
  
  setTheme(theme: 'dark' | 'light'): void {
    this.state.theme = theme;
    this.saveSettings();
    this.applySettings();
  }
  
  setFontSize(size: 'small' | 'medium' | 'large'): void {
    this.state.fontSize = size;
    this.saveSettings();
    this.applySettings();
  }
  
  toggleReducedMotion(): void {
    this.state.reducedMotion = !this.state.reducedMotion;
    this.saveSettings();
    this.applySettings();
  }
  
  toggleAutoSave(): void {
    this.state.autoSave = !this.state.autoSave;
    this.saveSettings();
  }
  
  toggleStudyReminders(): void {
    this.state.studyReminders = !this.state.studyReminders;
    this.saveSettings();
    
    if (this.state.studyReminders) {
      this.scheduleStudyReminder();
    }
  }
  
  private scheduleStudyReminder(): void {
    if (!browser || !this.state.notificationsEnabled || typeof window.Notification === 'undefined') return;
    
    // Schedule daily reminder at 4 PM
    const now = new Date();
    const reminderTime = new Date(now);
    reminderTime.setHours(16, 0, 0, 0);
    
    if (reminderTime < now) {
      reminderTime.setDate(reminderTime.getDate() + 1);
    }
    
    const timeUntilReminder = reminderTime.getTime() - now.getTime();
    
    setTimeout(() => {
      if (this.state.studyReminders && Notification.permission === 'granted') {
        new Notification('Happy Study 3D', {
          body: 'Time to study! Keep up your progress.',
          icon: '/icons/icon-192.png'
        });
        
        // Schedule next reminder
        this.scheduleStudyReminder();
      }
    }, timeUntilReminder);
  }
  
  async clearAllData(): Promise<void> {
    try {
      // Clear progress
      await progressStore.clearAllProgress();
      
      // Clear audio recordings
      await audioStore.clearAllRecordings();
      
      // Reset settings to defaults
      this.state = {
        soundEnabled: true,
        threeDEnabled: true,
        notificationsEnabled: false,
        theme: 'dark',
        fontSize: 'medium',
        reducedMotion: false,
        autoSave: true,
        studyReminders: false,
        isLoaded: true
      };
      
      this.saveSettings();
      this.applySettings();
    } catch (error) {
      console.error('Failed to clear all data:', error);
      throw error;
    }
  }
  
  async exportData(): Promise<void> {
    try {
      const progressData = await progressStore.exportProgress();
      const audioData = await audioStore.exportRecordings();
      
      const exportData = {
        version: '1.0',
        exportDate: new Date().toISOString(),
        settings: {
          soundEnabled: this.state.soundEnabled,
          threeDEnabled: this.state.threeDEnabled,
          theme: this.state.theme,
          fontSize: this.state.fontSize
        },
        progress: JSON.parse(progressData || '{}'),
        audio: audioData
      };
      
      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: 'application/json'
      });
      
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `happystudy3d-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to export data:', error);
      throw error;
    }
  }
  
  async importData(file: File): Promise<void> {
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      
      if (data.settings) {
        this.state = {
          ...this.state,
          ...data.settings,
          isLoaded: true
        };
        this.saveSettings();
        this.applySettings();
      }
      
      if (data.progress) {
        await progressStore.importProgress(JSON.stringify(data.progress));
      }
      
      if (data.audio) {
        await audioStore.importRecordings(data.audio);
      }
    } catch (error) {
      console.error('Failed to import data:', error);
      throw error;
    }
  }
  
  // Getters
  get soundEnabled(): boolean {
    return this.state.soundEnabled;
  }
  
  get threeDEnabled(): boolean {
    return this.state.threeDEnabled;
  }
  
  get notificationsEnabled(): boolean {
    return this.state.notificationsEnabled;
  }
  
  get theme(): 'dark' | 'light' {
    return this.state.theme;
  }
  
  get fontSize(): 'small' | 'medium' | 'large' {
    return this.state.fontSize;
  }
  
  get reducedMotion(): boolean {
    return this.state.reducedMotion;
  }
  
  get autoSave(): boolean {
    return this.state.autoSave;
  }
  
  get studyReminders(): boolean {
    return this.state.studyReminders;
  }
  
  get isLoaded(): boolean {
    return this.state.isLoaded;
  }
}

// Create singleton instance
export const settingsStore = new SettingsStore();

// Context for Svelte components
const SETTINGS_STORE_KEY = Symbol('settings-store');

export function setSettingsStoreContext(): void {
  setContext(SETTINGS_STORE_KEY, settingsStore);
}

export function getSettingsStore(): SettingsStore {
  return getContext<SettingsStore>(SETTINGS_STORE_KEY);
}