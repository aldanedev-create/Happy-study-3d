<script lang="ts">
  type LoadingVariant = 'spinner' | 'dots' | 'pulse' | 'skeleton';
  type LoadingSize = 'sm' | 'md' | 'lg';
  
  interface Props {
    variant?: LoadingVariant;
    size?: LoadingSize;
    text?: string;
    showText?: boolean;
    fullScreen?: boolean;
    overlay?: boolean;
  }
  
  let {
    variant = 'spinner',
    size = 'md',
    text = 'Loading...',
    showText = true,
    fullScreen = false,
    overlay = false
  }: Props = $props();
</script>

<div 
  class="loading-container"
  class:fullscreen={fullScreen}
  class:overlay={overlay}
  role="status"
  aria-live="polite"
>
  {#if variant === 'spinner'}
    <div class="spinner" class:size-sm={size === 'sm'} class:size-md={size === 'md'} class:size-lg={size === 'lg'}>
      <div class="spinner-ring"></div>
    </div>
  {:else if variant === 'dots'}
    <div class="dots">
      <span class="dot" style="animation-delay: 0s"></span>
      <span class="dot" style="animation-delay: 0.2s"></span>
      <span class="dot" style="animation-delay: 0.4s"></span>
    </div>
  {:else if variant === 'pulse'}
    <div class="pulse">
      <div class="pulse-circle" style="animation-delay: 0s"></div>
      <div class="pulse-circle" style="animation-delay: 0.3s"></div>
      <div class="pulse-circle" style="animation-delay: 0.6s"></div>
    </div>
  {:else if variant === 'skeleton'}
    <div class="skeleton">
      <div class="skeleton-line"></div>
      <div class="skeleton-line"></div>
      <div class="skeleton-line short"></div>
    </div>
  {/if}
  
  {#if showText && text}
    <p class="loading-text">{text}</p>
  {/if}
  
  <span class="sr-only">Loading</span>
</div>

<style>
  .loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    padding: 2rem;
  }
  
  .loading-container.fullscreen {
    position: fixed;
    inset: 0;
    background: #0F172A;
    z-index: 3000;
  }
  
  .loading-container.overlay {
    position: absolute;
    inset: 0;
    background: rgba(15, 23, 42, 0.9);
    z-index: 1500;
  }
  
  /* Spinner */
  .spinner {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .spinner-ring {
    border: 3px solid #334155;
    border-top-color: #4F46E5;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }
  
  .size-sm .spinner-ring {
    width: 1.5rem;
    height: 1.5rem;
    border-width: 2px;
  }
  
  .size-md .spinner-ring {
    width: 2.5rem;
    height: 2.5rem;
    border-width: 3px;
  }
  
  .size-lg .spinner-ring {
    width: 4rem;
    height: 4rem;
    border-width: 4px;
  }
  
  /* Dots */
  .dots {
    display: flex;
    gap: 0.5rem;
    align-items: center;
  }
  
  .dot {
    width: 0.75rem;
    height: 0.75rem;
    background: #4F46E5;
    border-radius: 50%;
    animation: bounce 1s ease-in-out infinite;
  }
  
  .size-sm .dot {
    width: 0.5rem;
    height: 0.5rem;
  }
  
  .size-lg .dot {
    width: 1rem;
    height: 1rem;
  }
  
  /* Pulse */
  .pulse {
    display: flex;
    gap: 0.75rem;
    align-items: center;
  }
  
  .pulse-circle {
    width: 1rem;
    height: 1rem;
    background: #4F46E5;
    border-radius: 50%;
    animation: pulse 1.5s ease-in-out infinite;
  }
  
  .size-sm .pulse-circle {
    width: 0.75rem;
    height: 0.75rem;
  }
  
  .size-lg .pulse-circle {
    width: 1.25rem;
    height: 1.25rem;
  }
  
  /* Skeleton */
  .skeleton {
    width: 100%;
    max-width: 300px;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .skeleton-line {
    height: 1rem;
    background: #334155;
    border-radius: 0.25rem;
    animation: shimmer 2s ease-in-out infinite;
  }
  
  .skeleton-line.short {
    width: 60%;
  }
  
  .loading-text {
    color: #94A3B8;
    font-size: 0.875rem;
    margin: 0;
  }
  
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
  }
  
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
  
  @keyframes bounce {
    0%, 100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-10px);
    }
  }
  
  @keyframes pulse {
    0%, 100% {
      opacity: 1;
      transform: scale(1);
    }
    50% {
      opacity: 0.5;
      transform: scale(0.8);
    }
  }
  
  @keyframes shimmer {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }
</style>