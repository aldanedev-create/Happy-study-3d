<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { appStore } from '$stores/app.svelte';
  
  interface Props {
    src: string;
    title?: string;
    autoPlay?: boolean;
    loop?: boolean;
    showDownload?: boolean;
  }
  
  let {
    src,
    title = undefined,
    autoPlay = false,
    loop = false,
    showDownload = true
  }: Props = $props();
  
  let audioElement: HTMLAudioElement;
  let isPlaying = $state(false);
  let currentTime = $state(0);
  let duration = $state(0);
  let volume = $state(1);
  let isMuted = $state(false);
  let playbackRate = $state(1);
  
  onMount(() => {
    if (audioElement) {
      audioElement.volume = volume;
      
      if (autoPlay) {
        play();
      }
    }
  });
  
  onDestroy(() => {
    if (audioElement) {
      audioElement.pause();
      audioElement.src = '';
    }
  });
  
  async function play() {
    if (audioElement) {
      try {
        await audioElement.play();
        isPlaying = true;
        appStore.playSound('click');
      } catch (error) {
        // Browser autoplay rules and a missing/deleted blob both reject play().
        // Keep controls accurate and let the native audio error event be accessible.
        isPlaying = false;
        console.warn('Audio could not be played:', error);
      }
    }
  }
  
  function pause() {
    if (audioElement) {
      audioElement.pause();
      isPlaying = false;
      appStore.playSound('click');
    }
  }
  
  function togglePlay() {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }
  
  function handleTimeUpdate() {
    if (audioElement) {
      currentTime = audioElement.currentTime;
    }
  }
  
  function handleLoadedMetadata() {
    if (audioElement) {
      duration = audioElement.duration;
    }
  }
  
  function handleEnded() {
    isPlaying = false;
    currentTime = 0;
    
    if (audioElement) {
      audioElement.currentTime = 0;
    }
  }

  function handleError() {
    isPlaying = false;
  }
  
  function seek(event: Event) {
    const input = event.target as HTMLInputElement;
    const value = parseFloat(input.value);
    
    if (audioElement) {
      audioElement.currentTime = value;
      currentTime = value;
    }
  }
  
  function changeVolume(event: Event) {
    const input = event.target as HTMLInputElement;
    volume = parseFloat(input.value);
    
    if (audioElement) {
      audioElement.volume = volume;
      isMuted = volume === 0;
    }
  }
  
  function toggleMute() {
    if (audioElement) {
      isMuted = !isMuted;
      audioElement.muted = isMuted;
      appStore.playSound('click');
    }
  }
  
  function changePlaybackRate(event: Event) {
    const select = event.target as HTMLSelectElement;
    playbackRate = parseFloat(select.value);
    
    if (audioElement) {
      audioElement.playbackRate = playbackRate;
    }
  }
  
  function formatTime(seconds: number): string {
    if (!isFinite(seconds) || seconds < 0) return '00:00';
    
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
  
  function download() {
    appStore.playSound('click');
    
    const link = document.createElement('a');
    link.href = src;
    link.download = title || 'audio-recording.webm';
    link.click();
  }
</script>

<div class="audio-player">
  <audio
    bind:this={audioElement}
    src={src}
    ontimeupdate={handleTimeUpdate}
    onloadedmetadata={handleLoadedMetadata}
    onended={handleEnded}
    onplay={() => isPlaying = true}
    onpause={() => isPlaying = false}
    onerror={handleError}
    {loop}
  ></audio>
  
  {#if title}
    <div class="player-title">{title}</div>
  {/if}
  
  <div class="player-controls">
    <button 
      class="play-btn"
      onclick={togglePlay}
      aria-label={isPlaying ? 'Pause' : 'Play'}
    >
      <span class="play-icon">{isPlaying ? '⏸️' : '▶️'}</span>
    </button>
    
    <div class="time-display">
      <span class="current-time">{formatTime(currentTime)}</span>
      <span class="time-separator">/</span>
      <span class="duration">{formatTime(duration)}</span>
    </div>
    
    <div class="progress-container">
      <input
        type="range"
        class="progress-slider"
        min="0"
        max={duration || 0}
        value={currentTime}
        oninput={seek}
        aria-label="Seek"
      />
    </div>
    
    <button 
      class="mute-btn"
      onclick={toggleMute}
      aria-label={isMuted ? 'Unmute' : 'Mute'}
    >
      <span class="mute-icon">{isMuted ? '🔇' : '🔊'}</span>
    </button>
    
    <div class="volume-container">
      <input
        type="range"
        class="volume-slider"
        min="0"
        max="1"
        step="0.1"
        value={volume}
        oninput={changeVolume}
        aria-label="Volume"
      />
    </div>
    
    <select 
      class="rate-select"
      value={playbackRate}
      onchange={changePlaybackRate}
      aria-label="Playback speed"
    >
      <option value="0.5">0.5x</option>
      <option value="0.75">0.75x</option>
      <option value="1">1x</option>
      <option value="1.25">1.25x</option>
      <option value="1.5">1.5x</option>
      <option value="2">2x</option>
    </select>
    
    {#if showDownload}
      <button 
        class="download-btn"
        onclick={download}
        aria-label="Download"
      >
        <span class="download-icon">💾</span>
      </button>
    {/if}
  </div>
</div>

<style>
  .audio-player {
    background: #1E293B;
    border: 1px solid #334155;
    border-radius: 0.5rem;
    padding: 1rem;
  }
  
  .player-title {
    color: #F1F5F9;
    font-weight: 600;
    margin-bottom: 0.75rem;
    font-size: 0.9rem;
  }
  
  .player-controls {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    flex-wrap: wrap;
  }
  
  .play-btn,
  .mute-btn,
  .download-btn {
    width: 2.5rem;
    height: 2.5rem;
    background: #334155;
    border: none;
    border-radius: 50%;
    color: #F1F5F9;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
    flex-shrink: 0;
  }
  
  .play-btn:hover,
  .mute-btn:hover,
  .download-btn:hover {
    background: #4F46E5;
    transform: scale(1.1);
  }
  
  .play-icon,
  .mute-icon,
  .download-icon {
    font-size: 1rem;
  }
  
  .time-display {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    color: #94A3B8;
    font-size: 0.875rem;
    font-family: monospace;
    flex-shrink: 0;
  }
  
  .current-time,
  .duration {
    min-width: 2.5rem;
  }
  
  .time-separator {
    color: #64748B;
  }
  
  .progress-container {
    flex: 1;
    min-width: 100px;
  }
  
  .progress-slider {
    width: 100%;
    height: 4px;
    -webkit-appearance: none;
    appearance: none;
    background: #334155;
    border-radius: 2px;
    outline: none;
    cursor: pointer;
  }
  
  .progress-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 12px;
    height: 12px;
    background: #4F46E5;
    border-radius: 50%;
    cursor: pointer;
  }
  
  .progress-slider::-moz-range-thumb {
    width: 12px;
    height: 12px;
    background: #4F46E5;
    border-radius: 50%;
    cursor: pointer;
    border: none;
  }
  
  .volume-container {
    width: 80px;
    flex-shrink: 0;
  }
  
  .volume-slider {
    width: 100%;
    height: 4px;
    -webkit-appearance: none;
    appearance: none;
    background: #334155;
    border-radius: 2px;
    outline: none;
    cursor: pointer;
  }
  
  .volume-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 12px;
    height: 12px;
    background: #10B981;
    border-radius: 50%;
    cursor: pointer;
  }
  
  .volume-slider::-moz-range-thumb {
    width: 12px;
    height: 12px;
    background: #10B981;
    border-radius: 50%;
    cursor: pointer;
    border: none;
  }
  
  .rate-select {
    background: #334155;
    color: #F1F5F9;
    border: none;
    border-radius: 0.25rem;
    padding: 0.25rem 0.5rem;
    cursor: pointer;
    font-size: 0.875rem;
    flex-shrink: 0;
  }
  
  .rate-select:focus {
    outline: 2px solid #4F46E5;
  }
</style>
