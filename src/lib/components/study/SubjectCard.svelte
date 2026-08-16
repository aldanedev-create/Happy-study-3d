<script lang="ts">
  import { appStore } from '$stores/app.svelte';
  import { progressStore } from '$stores/progress.svelte';
  
  interface Props {
    id: string;
    name: string;
    description: string;
    icon: string;
    area: 'cxc' | 'cape' | 'software-engineering';
    topicsCount?: number;
    onClick?: (id: string) => void;
  }
  
  let {
    id,
    name,
    description,
    icon,
    area,
    topicsCount = 0,
    onClick = undefined
  }: Props = $props();
  
  $: progress = progressStore.getSubjectProgress(id);
  $: percentage = progress?.percentage || 0;
  
  function handleClick() {
    appStore.playSound('click');
    if (onClick) {
      onClick(id);
    }
  }
  
  function handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleClick();
    }
  }
</script>

<div 
  class="subject-card"
  onclick={handleClick}
  onkeydown={handleKeyDown}
  role="button"
  tabindex="0"
  aria-label={`Study ${name}`}
>
  <div class="subject-header">
    <span class="subject-icon" aria-hidden="true">{icon}</span>
    <span class="area-badge">{area}</span>
  </div>
  
  <h3 class="subject-name">{name}</h3>
  <p class="subject-description">{description}</p>
  
  {#if topicsCount > 0}
    <div class="subject-meta">
      <span class="topics-count">{topicsCount} topics</span>
    </div>
  {/if}
  
  {#if percentage > 0}
    <div class="progress-section">
      <div class="progress-header">
        <span class="progress-label">Progress</span>
        <span class="progress-value">{Math.round(percentage)}%</span>
      </div>
      <div class="progress-bar">
        <div 
          class="progress-fill"
          style="width: {percentage}%"
        ></div>
      </div>
    </div>
  {/if}
  
  <div class="subject-action">
    <span>Start Learning</span>
    <span class="arrow" aria-hidden="true">→</span>
  </div>
</div>

<style>
  .subject-card {
    background: #1E293B;
    border: 1px solid #334155;
    border-radius: 1rem;
    padding: 1.5rem;
    cursor: pointer;
    transition: all 0.3s;
    position: relative;
    overflow: hidden;
  }
  
  .subject-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    border-color: #4F46E5;
  }
  
  .subject-card:focus-visible {
    outline: 2px solid #4F46E5;
    outline-offset: 2px;
  }
  
  .subject-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }
  
  .subject-icon {
    font-size: 2.5rem;
  }
  
  .area-badge {
    padding: 0.25rem 0.75rem;
    background: #4F46E5;
    color: white;
    border-radius: 9999px;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
  }
  
  .subject-name {
    margin-bottom: 0.5rem;
    color: #F1F5F9;
    font-size: 1.25rem;
  }
  
  .subject-description {
    color: #94A3B8;
    margin-bottom: 1rem;
    line-height: 1.5;
    font-size: 0.9rem;
  }
  
  .subject-meta {
    margin-bottom: 1rem;
  }
  
  .topics-count {
    color: #64748B;
    font-size: 0.875rem;
  }
  
  .progress-section {
    margin-bottom: 1rem;
  }
  
  .progress-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
  }
  
  .progress-label {
    color: #94A3B8;
    font-size: 0.875rem;
  }
  
  .progress-value {
    color: #CBD5E1;
    font-size: 0.875rem;
    font-weight: 600;
  }
  
  .progress-bar {
    width: 100%;
    height: 0.5rem;
    background: #0F172A;
    border-radius: 9999px;
    overflow: hidden;
  }
  
  .progress-fill {
    height: 100%;
    background: #4F46E5;
    border-radius: 9999px;
    transition: width 0.5s ease;
  }
  
  .subject-action {
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #4F46E5;
    font-weight: 600;
    font-size: 0.9rem;
  }
  
  .arrow {
    transition: transform 0.2s;
  }
  
  .subject-card:hover .arrow {
    transform: translateX(5px);
  }
</style>