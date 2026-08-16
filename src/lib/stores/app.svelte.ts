import { getContext, setContext } from 'svelte';
import { browser } from '$app/environment';

interface AppState {
  isInitialized: boolean;
  isOnline: boolean;
  soundEnabled: boolean;
  currentRoute: string;
  isLoading: boolean;
}

class AppStore {
  private state = $state<AppState>({
    isInitialized: false,
    isOnline: true,
    soundEnabled: true,
    currentRoute: '/',
    isLoading: false
  });
  
  private audioContext: AudioContext | null = null;
  private soundCache = new Map<string, AudioBuffer>();
  
  constructor() {
    if (browser) {
      this.initialize();
    }
  }
  
  async initialize(): Promise<void> {
    if (this.state.isInitialized) return;
    
    try {
      // Load settings from localStorage
      const savedSettings = localStorage.getItem('happystudy3d-settings');
      if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        this.state.soundEnabled = settings.soundEnabled ?? true;
      }
      
      // Initialize audio context
      if (this.state.soundEnabled) {
        await this.initAudioContext();
      }
      
      // Set online status
      this.state.isOnline = navigator.onLine;
      
      // Add event listeners
      window.addEventListener('online', this.handleOnline);
      window.addEventListener('offline', this.handleOffline);
      
      this.state.isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize app store:', error);
      this.state.isInitialized = true;
    }
  }
  
  private async initAudioContext(): Promise<void> {
    try {
      this.audioContext = new AudioContext();
      
      // Preload sounds
      const sounds = ['click', 'success', 'notification'];
      for (const sound of sounds) {
        await this.preloadSound(sound);
      }
    } catch (error) {
      console.warn('Audio initialization failed:', error);
      this.audioContext = null;
    }
  }
  
  private async preloadSound(name: string): Promise<void> {
    if (!this.audioContext) return;
    
    try {
      const response = await fetch(`/sounds/${name}.mp3`);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
      this.soundCache.set(name, audioBuffer);
    } catch (error) {
      console.warn(`Failed to preload sound: ${name}`, error);
    }
  }
  
  async playSound(sound: 'click' | 'success' | 'notification'): Promise<void> {
    if (!this.state.soundEnabled || !this.audioContext) return;
    
    try {
      // Resume context if suspended
      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
      }
      
      const audioBuffer = this.soundCache.get(sound);
      if (!audioBuffer) return;
      
      const source = this.audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(this.audioContext.destination);
      source.start(0);
    } catch (error) {
      console.warn(`Failed to play sound: ${sound}`, error);
    }
  }
  
  private handleOnline = (): void => {
    this.state.isOnline = true;
  };
  
  private handleOffline = (): void => {
    this.state.isOnline = false;
  };
  
  setRoute(route: string): void {
    this.state.currentRoute = route;
  }
  
  setLoading(loading: boolean): void {
    this.state.isLoading = loading;
  }
  
  toggleSound(): void {
    this.state.soundEnabled = !this.state.soundEnabled;
    this.saveSettings();
    
    if (this.state.soundEnabled && !this.audioContext) {
      this.initAudioContext();
    }
  }
  
  private saveSettings(): void {
    if (!browser) return;
    
    try {
      localStorage.setItem('happystudy3d-settings', JSON.stringify({
        soundEnabled: this.state.soundEnabled
      }));
    } catch (error) {
      console.warn('Failed to save settings:', error);
    }
  }
  
  cleanup(): void {
    if (browser) {
      window.removeEventListener('online', this.handleOnline);
      window.removeEventListener('offline', this.handleOffline);
    }
    
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
  }
  
  // Getters
  get isInitialized(): boolean {
    return this.state.isInitialized;
  }
  
  get isOnline(): boolean {
    return this.state.isOnline;
  }
  
  get soundEnabled(): boolean {
    return this.state.soundEnabled;
  }
  
  get currentRoute(): string {
    return this.state.currentRoute;
  }
  
  get isLoading(): boolean {
    return this.state.isLoading;
  }
}

// Create singleton instance
export const appStore = new AppStore();

// Context for Svelte components
const APP_STORE_KEY = Symbol('app-store');

export function setAppStoreContext(): void {
  setContext(APP_STORE_KEY, appStore);
}

export function getAppStore(): AppStore {
  return getContext<AppStore>(APP_STORE_KEY);
}