<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  
  interface Props {
    audioUrl?: string;
    audioBuffer?: AudioBuffer;
    progress?: number;
    interactive?: boolean;
    onSeek?: (time: number) => void;
    color?: string;
    backgroundColor?: string;
    height?: number;
  }
  
  let {
    audioUrl = undefined,
    audioBuffer = undefined,
    progress = 0,
    interactive = true,
    onSeek = undefined,
    color = '#4F46E5',
    backgroundColor = '#0F172A',
    height = 100
  }: Props = $props();
  
  let canvasElement: HTMLCanvasElement;
  let isDragging = $state(false);
  let audioContext: AudioContext | null = null;
  let analyser: AnalyserNode | null = null;
  let dataArray: Uint8Array | null = null;
  let animationFrame: number | null = null;
  
  onMount(() => {
    if (audioUrl) {
      loadAudio(audioUrl);
    } else if (audioBuffer) {
      drawWaveform(audioBuffer);
    } else {
      drawEmptyState();
    }
  });
  
  onDestroy(() => {
    if (animationFrame !== null) {
      cancelAnimationFrame(animationFrame);
    }
    
    if (audioContext) {
      audioContext.close();
    }
  });
  
  async function loadAudio(url: string) {
    try {
      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      
      audioContext = new AudioContext();
      const audioBufferData = await audioContext.decodeAudioData(arrayBuffer);
      
      drawWaveform(audioBufferData);
    } catch (error) {
      console.error('Failed to load audio for waveform:', error);
      drawEmptyState();
    }
  }
  
  function drawWaveform(buffer: AudioBuffer) {
    const canvas = canvasElement;
    if (!canvas) return;
    
    const context = canvas.getContext('2d');
    if (!context) return;
    
    const width = canvas.width;
    const height = canvas.height;
    
    // Clear canvas
    context.fillStyle = backgroundColor;
    context.fillRect(0, 0, width, height);
    
    // Get audio data
    const channelData = buffer.getChannelData(0);
    
    // Calculate samples
    const samples = 200;
    const blockSize = Math.floor(channelData.length / samples);
    
    // Draw waveform
    context.beginPath();
    context.strokeStyle = color;
    context.lineWidth = 2;
    
    for (let i = 0; i < samples; i++) {
      const start = i * blockSize;
      let sum = 0;
      
      for (let j = 0; j < blockSize; j++) {
        sum += Math.abs(channelData[start + j]);
      }
      
      const average = sum / blockSize;
      const x = (i / samples) * width;
      const y = height / 2;
      const amplitude = average * height * 0.8;
      
      if (i === 0) {
        context.moveTo(x, y - amplitude);
      } else {
        context.lineTo(x, y - amplitude);
      }
    }
    
    context.stroke();
    
    // Draw progress overlay
    if (progress > 0) {
      const progressX = (progress / 100) * width;
      
      context.fillStyle = color;
      context.globalAlpha = 0.3;
      context.fillRect(0, 0, progressX, height);
      context.globalAlpha = 1;
      
      // Draw progress line
      context.beginPath();
      context.strokeStyle = '#FFFFFF';
      context.lineWidth = 2;
      context.moveTo(progressX, 0);
      context.lineTo(progressX, height);
      context.stroke();
    }
  }
  
  function drawEmptyState() {
    const canvas = canvasElement;
    if (!canvas) return;
    
    const context = canvas.getContext('2d');
    if (!context) return;
    
    const width = canvas.width;
    const height = canvas.height;
    
    context.fillStyle = backgroundColor;
    context.fillRect(0, 0, width, height);
    
    // Draw placeholder waveform
    context.beginPath();
    context.strokeStyle = '#334155';
    context.lineWidth = 2;
    
    for (let i = 0; i < width; i += 10) {
      const amplitude = Math.sin(i * 0.1) * 20;
      const y = height / 2 + amplitude;
      
      if (i === 0) {
        context.moveTo(i, y);
      } else {
        context.lineTo(i, y);
      }
    }
    
    context.stroke();
  }
  
  function handleCanvasClick(event: MouseEvent) {
    if (!interactive || !onSeek) return;
    
    const canvas = canvasElement;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    
    onSeek(percentage);
  }
  
  function handleCanvasMouseDown(event: MouseEvent) {
    if (!interactive) return;
    
    isDragging = true;
    handleCanvasClick(event);
  }
  
  function handleCanvasMouseMove(event: MouseEvent) {
    if (!isDragging || !interactive || !onSeek) return;
    
    handleCanvasClick(event);
  }
  
  function handleCanvasMouseUp() {
    isDragging = false;
  }
  
  function handleCanvasMouseLeave() {
    isDragging = false;
  }
</script>

<div class="waveform-container">
  <canvas
    bind:this={canvasElement}
    class="waveform-canvas"
    class:interactive={interactive}
    style="height: {height}px"
    onclick={handleCanvasClick}
    onmousedown={handleCanvasMouseDown}
    onmousemove={handleCanvasMouseMove}
    onmouseup={handleCanvasMouseUp}
    onmouseleave={handleCanvasMouseLeave}
    aria-label="Audio waveform"
    role="img"
  ></canvas>
</div>

<style>
  .waveform-container {
    width: 100%;
    overflow: hidden;
    border-radius: 0.5rem;
  }
  
  .waveform-canvas {
    width: 100%;
    display: block;
  }
  
  .waveform-canvas.interactive {
    cursor: pointer;
  }
  
  .waveform-canvas.interactive:active {
    cursor: grabbing;
  }
</style>