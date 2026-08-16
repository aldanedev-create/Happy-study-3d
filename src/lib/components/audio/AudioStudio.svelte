<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { audioStore } from '$stores/audio.svelte';
  import { appStore } from '$stores/app.svelte';
  import Recorder from './Recorder.svelte';
  import RecordingList from './RecordingList.svelte';
  
  let isRecording = $state(false);
  let error = $state<string | null>(null);
  
  onMount(() => {
    appStore.playSound('click');
  });
  
  function handleRecordingStart() {
    isRecording = true;
    error = null;
  }
  
  function handleRecordingStop() {
    isRecording = false;
    appStore.playSound('success');
  }
  
  function handleRecordingError(err: string) {
    error = err;
    isRecording = false;
  }
</script>

<div class="audio-studio">
  <header class="studio-header">
    <h2 class="studio-title">🎙️ Audio Studio</h2>
    <p class="studio-subtitle">
      Record study notes, lectures, or your own explanations
    </p>
  </header>
  
  {#if error}
    <div class="error-alert" role="alert">
      <span class="error-icon" aria-hidden="true">⚠️</span>
      <span class="error-message">{error}</span>
    </div>
  {/if}
  
  <div class="studio-content">
    <Recorder
      onStart={handleRecordingStart}
      onStop={handleRecordingStop}
      onError={handleRecordingError}
    />
    
    {#if isRecording}
      <div class="recording-indicator">
        <span class="pulse-dot"></span>
        <span>Recording in progress...</span>
      </div>
    {/if}
    
    <RecordingList />
  </div>
</div>

<style>
  .audio-studio {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    background: #1E293B;
    border: 1px solid #334155;
    border-radius: 1rem;
    padding: 2rem;
  }
  
  .studio-header {
    text-align: center;
    margin-bottom: 1rem;
  }
  
  .studio-title {
    color: #F1F5F9;
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
  }
  
  .studio-subtitle {
    color: #94A3B8;
    margin: 0;
  }
  
  .error-alert {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 1rem;
    background: #DC2626;
    color: white;
    border-radius: 0.5rem;
    animation: slideDown 0.3s ease;
  }
  
  .error-icon {
    font-size: 1.25rem;
  }
  
  .error-message {
    flex: 1;
  }
  
  .studio-content {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }
  
  .recording-indicator {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.75rem;
    background: #0F172A;
    border-radius: 0.5rem;
    color: #DC2626;
    font-weight: 600;
    animation: fadeIn 0.3s ease;
  }
  
  .pulse-dot {
    width: 0.75rem;
    height: 0.75rem;
    background: #DC2626;
    border-radius: 50%;
    animation: pulse 1s infinite;
  }
  
  @keyframes pulse {
    0%, 100% {
      opacity: 1;
      transform: scale(1);
    }
    50% {
      opacity: 0.5;
      transform: scale(1.5);
    }
  }
  
  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
</style>