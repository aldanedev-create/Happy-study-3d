<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { audioStore } from '$stores/audio.svelte';
  import { appStore } from '$stores/app.svelte';
  
  interface Props {
    onStart?: () => void;
    onStop?: () => void;
    onError?: (error: string) => void;
  }
  
  let {
    onStart = undefined,
    onStop = undefined,
    onError = undefined
  }: Props = $props();
  
  let isRecording = $state(false);
  let isPaused = $state(false);
  let recordingTime = $state(0);
  let timerInterval: ReturnType<typeof setInterval> | null = null;
  let mediaRecorder: MediaRecorder | null = null;
  let audioChunks: Blob[] = [];
  let stream: MediaStream | null = null;
  let isSupported = $state(true);
  
  onMount(() => {
    // Check if MediaRecorder is supported
    if (typeof MediaRecorder === 'undefined') {
      isSupported = false;
    }
  });
  
  onDestroy(() => {
    cleanup();
  });
  
  async function startRecording() {
    if (!isSupported) {
      if (onError) {
        onError('MediaRecorder is not supported in this browser');
      }
      return;
    }
    
    try {
      // Request microphone access
      stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } 
      });
      
      mediaRecorder = new MediaRecorder(stream, {
        mimeType: getSupportedMimeType()
      });
      
      audioChunks = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.push(event.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        saveRecording();
        cleanup();
      };
      
      mediaRecorder.onerror = () => {
        if (onError) {
          onError('Recording failed. Please try again.');
        }
        cleanup();
      };
      
      mediaRecorder.start(1000); // Collect data every second
      isRecording = true;
      isPaused = false;
      recordingTime = 0;
      
      // Start timer
      timerInterval = setInterval(() => {
        if (!isPaused) {
          recordingTime++;
        }
      }, 1000);
      
      appStore.playSound('success');
      
      if (onStart) {
        onStart();
      }
    } catch (error) {
      console.error('Failed to start recording:', error);
      
      let errorMessage = 'Unable to access microphone';
      
      if (error instanceof DOMException) {
        if (error.name === 'NotAllowedError') {
          errorMessage = 'Microphone access denied. Please allow microphone access in your browser settings.';
        } else if (error.name === 'NotFoundError') {
          errorMessage = 'No microphone found. Please connect a microphone and try again.';
        } else if (error.name === 'NotReadableError') {
          errorMessage = 'Microphone is busy or not available. Please close other apps using the microphone.';
        }
      }
      
      if (onError) {
        onError(errorMessage);
      }
    }
  }
  
  function pauseRecording() {
    if (mediaRecorder && isRecording) {
      if (isPaused) {
        mediaRecorder.resume();
        isPaused = false;
        appStore.playSound('click');
      } else {
        mediaRecorder.pause();
        isPaused = true;
        appStore.playSound('click');
      }
    }
  }
  
  function stopRecording() {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      isRecording = false;
      isPaused = false;
      
      if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
      }
      
      appStore.playSound('notification');
      
      if (onStop) {
        onStop();
      }
    }
  }
  
  function cancelRecording() {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      audioChunks = [];
      isRecording = false;
      isPaused = false;
      
      if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
      }
      
      cleanup();
      appStore.playSound('click');
      
      if (onStop) {
        onStop();
      }
    }
  }
  
  async function saveRecording() {
    if (audioChunks.length === 0) return;
    
    try {
      const audioBlob = new Blob(audioChunks, { type: getSupportedMimeType() });
      
      await audioStore.addRecording({
        name: `Recording ${new Date().toLocaleString()}`,
        blob: audioBlob,
        duration: recordingTime
      });
    } catch (error) {
      console.error('Failed to save recording:', error);
      if (onError) {
        onError('Failed to save recording');
      }
    }
  }
  
  function cleanup() {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      stream = null;
    }
    
    mediaRecorder = null;
    audioChunks = [];
  }
  
  function getSupportedMimeType(): string {
    const types = [
      'audio/webm',
      'audio/webm;codecs=opus',
      'audio/ogg;codecs=opus',
      'audio/mp4',
      'audio/wav'
    ];
    
    for (const type of types) {
      if (MediaRecorder.isTypeSupported(type)) {
        return type;
      }
    }
    
    return '';
  }
  
  function formatTime(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
</script>

<div class="recorder">
  {#if !isSupported}
    <div class="unsupported">
      <p class="unsupported-text">
        Audio recording is not supported in this browser.
      </p>
      <p class="unsupported-hint">
        Try using Chrome, Firefox, or Edge.
      </p>
    </div>
  {:else}
    <div class="recorder-display">
      <div class="recording-status" class:recording={isRecording} class:paused={isPaused}>
        {#if isRecording}
          {#if isPaused}
            <span class="status-icon">⏸️</span>
            <span class="status-text">Paused</span>
          {:else}
            <span class="status-icon">🔴</span>
            <span class="status-text">Recording</span>
          {/if}
        {:else}
          <span class="status-icon">🎙️</span>
          <span class="status-text">Ready</span>
        {/if}
      </div>
      
      <div class="recording-time">
        {formatTime(recordingTime)}
      </div>
      
      <div class="recording-waveform" class:active={isRecording && !isPaused}>
        {#each Array(20) as _, index}
          <span 
            class="waveform-bar"
            style="height: {8 + Math.random() * 24}px"
            class:animating={isRecording && !isPaused}
          ></span>
        {/each}
      </div>
    </div>
    
    <div class="recorder-controls">
      {#if !isRecording}
        <button 
          class="btn-record"
          onclick={startRecording}
          aria-label="Start recording"
        >
          <span class="btn-icon">🎙️</span>
          <span class="btn-text">Start Recording</span>
        </button>
      {:else}
        <button 
          class="btn-pause"
          onclick={pauseRecording}
          aria-label={isPaused ? 'Resume recording' : 'Pause recording'}
        >
          <span class="btn-icon">{isPaused ? '▶️' : '⏸️'}</span>
          <span class="btn-text">{isPaused ? 'Resume' : 'Pause'}</span>
        </button>
        
        <button 
          class="btn-stop"
          onclick={stopRecording}
          aria-label="Stop recording"
        >
          <span class="btn-icon">⏹️</span>
          <span class="btn-text">Stop</span>
        </button>
        
        <button 
          class="btn-cancel"
          onclick={cancelRecording}
          aria-label="Cancel recording"
        >
          <span class="btn-icon">✕</span>
          <span class="btn-text">Cancel</span>
        </button>
      {/if}
    </div>
  {/if}
</div>

<style>
  .recorder {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    background: #0F172A;
    border-radius: 0.5rem;
    padding: 1.5rem;
  }
  
  .unsupported {
    text-align: center;
    padding: 2rem;
  }
  
  .unsupported-text {
    color: #F1F5F9;
    margin-bottom: 0.5rem;
    font-weight: 600;
  }
  
  .unsupported-hint {
    color: #94A3B8;
    margin: 0;
    font-size: 0.9rem;
  }
  
  .recorder-display {
    text-align: center;
  }
  
  .recording-status {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    margin-bottom: 0.5rem;
    color: #94A3B8;
  }
  
  .recording-status.recording {
    color: #DC2626;
  }
  
  .recording-status.paused {
    color: #F59E0B;
  }
  
  .status-icon {
    font-size: 1.25rem;
  }
  
  .status-text {
    font-weight: 600;
  }
  
  .recording-time {
    font-size: 3rem;
    font-weight: bold;
    color: #F1F5F9;
    font-family: monospace;
    margin-bottom: 1rem;
  }
  
  .recording-waveform {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.25rem;
    height: 40px;
  }
  
  .waveform-bar {
    width: 3px;
    background: #334155;
    border-radius: 2px;
    transition: height 0.2s ease;
  }
  
  .waveform-bar.animating {
    background: #4F46E5;
    animation: waveform 0.5s ease-in-out infinite alternate;
  }
  
  .recorder-controls {
    display: flex;
    gap: 0.75rem;
    justify-content: center;
    flex-wrap: wrap;
  }
  
  .btn-record,
  .btn-pause,
  .btn-stop,
  .btn-cancel {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 0.5rem;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.2s;
    font-size: 0.9rem;
  }
  
  .btn-record {
    background: #DC2626;
    color: white;
  }
  
  .btn-record:hover {
    background: #B91C1C;
    transform: translateY(-1px);
  }
  
  .btn-pause {
    background: #F59E0B;
    color: white;
  }
  
  .btn-pause:hover {
    background: #D97706;
    transform: translateY(-1px);
  }
  
  .btn-stop {
    background: #10B981;
    color: white;
  }
  
  .btn-stop:hover {
    background: #059669;
    transform: translateY(-1px);
  }
  
  .btn-cancel {
    background: #64748B;
    color: white;
  }
  
  .btn-cancel:hover {
    background: #475569;
    transform: translateY(-1px);
  }
  
  .btn-icon {
    font-size: 1.25rem;
  }
  
  @keyframes waveform {
    from {
      transform: scaleY(0.5);
    }
    to {
      transform: scaleY(1.5);
    }
  }
</style>
