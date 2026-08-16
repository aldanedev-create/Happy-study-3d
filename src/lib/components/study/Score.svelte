<script lang="ts">
  import { onMount } from 'svelte';
  import { appStore } from '$stores/app.svelte';
  
  interface Props {
    score: number;
    total: number;
    timeSpent?: number;
    onRetry?: () => void;
    onExit?: () => void;
    onReview?: () => void;
  }
  
  let {
    score,
    total,
    timeSpent = 0,
    onRetry = undefined,
    onExit = undefined,
    onReview = undefined
  }: Props = $props();
  
  $: percentage = total > 0 ? Math.round((score / total) * 100) : 0;
  
  function getGrade(percentage: number): { grade: string; color: string; message: string } {
    if (percentage >= 90) {
      return { grade: 'A', color: '#10B981', message: 'Outstanding! You have excellent understanding.' };
    } else if (percentage >= 80) {
      return { grade: 'B', color: '#3B82F6', message: 'Great job! You have a strong grasp of the material.' };
    } else if (percentage >= 70) {
      return { grade: 'C', color: '#F59E0B', message: 'Good work! You understand the key concepts.' };
    } else if (percentage >= 60) {
      return { grade: 'D', color: '#F97316', message: 'You\'re getting there. Review the weak areas.' };
    } else if (percentage >= 50) {
      return { grade: 'E', color: '#DC2626', message: 'You need more practice. Review the material.' };
    } else {
      return { grade: 'F', color: '#991B1B', message: 'Don\'t give up! Review and try again.' };
    }
  }
  
  $: result = getGrade(percentage);
  
  function formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    if (minutes > 0) {
      return `${minutes}m ${remainingSeconds}s`;
    }
    
    return `${remainingSeconds}s`;
  }
  
  onMount(() => {
    appStore.playSound('success');
  });
</script>

<div class="score-container">
  <div class="score-card">
    <div class="score-circle" style="border-color: {result.color}">
      <div class="score-percentage" style="color: {result.color}">
        {percentage}%
      </div>
      <div class="score-grade" style="background: {result.color}">
        {result.grade}
      </div>
    </div>
    
    <h2 class="score-title">Your Score</h2>
    <p class="score-message">{result.message}</p>
    
    <div class="score-details">
      <div class="detail-item">
        <span class="detail-label">Correct</span>
        <span class="detail-value">{score} / {total}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">Incorrect</span>
        <span class="detail-value">{total - score}</span>
      </div>
      {#if timeSpent > 0}
        <div class="detail-item">
          <span class="detail-label">Time Spent</span>
          <span class="detail-value">{formatTime(timeSpent)}</span>
        </div>
      {/if}
    </div>
    
    <div class="score-actions">
      {#if onReview}
        <button class="btn-review" onclick={onReview}>
          Review Answers
        </button>
      {/if}
      {#if onRetry}
        <button class="btn-retry" onclick={onRetry}>
          Try Again
        </button>
      {/if}
      {#if onExit}
        <button class="btn-exit" onclick={onExit}>
          Exit
        </button>
      {/if}
    </div>
  </div>
</div>

<style>
  .score-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 400px;
  }
  
  .score-card {
    text-align: center;
    padding: 3rem;
    background: #1E293B;
    border: 1px solid #334155;
    border-radius: 1rem;
    max-width: 500px;
    width: 100%;
  }
  
  .score-circle {
    width: 150px;
    height: 150px;
    border: 4px solid;
    border-radius: 50%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin: 0 auto 2rem;
    position: relative;
  }
  
  .score-percentage {
    font-size: 2.5rem;
    font-weight: bold;
  }
  
  .score-grade {
    position: absolute;
    top: -10px;
    right: -10px;
    width: 3rem;
    height: 3rem;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: bold;
    font-size: 1.25rem;
  }
  
  .score-title {
    color: #F1F5F9;
    margin-bottom: 0.5rem;
    font-size: 1.5rem;
  }
  
  .score-message {
    color: #CBD5E1;
    margin-bottom: 2rem;
    line-height: 1.6;
  }
  
  .score-details {
    display: flex;
    justify-content: center;
    gap: 2rem;
    margin-bottom: 2rem;
    flex-wrap: wrap;
  }
  
  .detail-item {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }
  
  .detail-label {
    color: #94A3B8;
    font-size: 0.875rem;
  }
  
  .detail-value {
    color: #F1F5F9;
    font-weight: 600;
    font-size: 1.1rem;
  }
  
  .score-actions {
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;
  }
  
  .btn-review,
  .btn-retry,
  .btn-exit {
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 0.5rem;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.2s;
  }
  
  .btn-review {
    background: #3B82F6;
    color: white;
  }
  
  .btn-review:hover {
    background: #2563EB;
  }
  
  .btn-retry {
    background: #4F46E5;
    color: white;
  }
  
  .btn-retry:hover {
    background: #4338CA;
  }
  
  .btn-exit {
    background: #334155;
    color: #E2E8F0;
  }
  
  .btn-exit:hover {
    background: #475569;
  }
</style>