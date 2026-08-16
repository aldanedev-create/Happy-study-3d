<script lang="ts">
  import { appStore } from '$stores/app.svelte';
  
  interface Props {
    id: string;
    title: string;
    description: string;
    icon?: string;
    completed?: boolean;
    inProgress?: boolean;
    questionsCount?: number;
    lessonsCount?: number;
    onClick?: (id: string) => void;
  }
  
  let {
    id,
    title,
    description,
    icon = '📖',
    completed = false,
    inProgress = false,
    questionsCount = 0,
    lessonsCount = 0,
    onClick = undefined
  }: Props = $props();
  
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
  class="topic-card"
  class:completed={completed}
  class:in-progress={inProgress}
  onclick={handleClick}
  onkeydown={handleKeyDown}
  role="button"
  tabindex="0"
  aria-label={`Study ${title}`}
>
  <div class="topic-header">
    <span class="topic-icon" aria-hidden="true">{icon}</span>
    {#if completed}
      <span class="status-badge completed">✓ Completed</span>
    {:else if inProgress}
      <span class="status-badge in-progress">▶ In Progress</span>
    {/if}
  </div>
  
  <h3 class="topic-title">{title}</h3>
  <p class="topic-description">{description}</p>
  
  <div class="topic-meta">
    {#if lessonsCount > 0}
      <span class="meta-item">
        <span aria-hidden="true">📚</span> {lessonsCount} lessons
      </span>
    {/if}
    {#if questionsCount > 0}
      <span class="meta-item">
        <span aria-hidden="true">✏️</span> {questionsCount} questions
      </span>
    {/if}
  </div>
  
  <div class="topic-action">
    <span>{completed ? 'Review' : 'Start'}</span>
    <span class="arrow" aria-hidden="true">→</span>
  </div>
</div>

<style>
  .topic-card {
    background: #0F172A;
    border: 1px solid #334155;
    border-radius: 0.75rem;
    padding: 1.25rem;
    cursor: pointer;
    transition: all 0.3s;
    position: relative;
    overflow: hidden;
  }
  
  .topic-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
    border-color: #3B82F6;
  }
  
  .topic-card:focus-visible {
    outline: 2px solid #3B82F6;
    outline-offset: 2px;
  }
  
  .topic-card.completed {
    border-color: #10B981;
    background: #0F172A;
  }
  
  .topic-card.in-progress {
    border-color: #F59E0B;
  }
  
  .topic-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.75rem;
  }
  
  .topic-icon {
    font-size: 2rem;
  }
  
  .status-badge {
    padding: 0.25rem 0.75rem;
    border-radius: 9999px;
    font-size: 0.75rem;
    font-weight: 600;
  }
  
  .status-badge.completed {
    background: #10B981;
    color: white;
  }
  
  .status-badge.in-progress {
    background: #F59E0B;
    color: white;
  }
  
  .topic-title {
    margin-bottom: 0.5rem;
    color: #F1F5F9;
    font-size: 1.1rem;
  }
  
  .topic-description {
    color: #94A3B8;
    margin-bottom: 1rem;
    line-height: 1.5;
    font-size: 0.875rem;
  }
  
  .topic-meta {
    display: flex;
    gap: 1rem;
    margin-bottom: 1rem;
    flex-wrap: wrap;
  }
  
  .meta-item {
    color: #64748B;
    font-size: 0.875rem;
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }
  
  .topic-action {
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #3B82F6;
    font-weight: 600;
    font-size: 0.9rem;
  }
  
  .topic-card.completed .topic-action {
    color: #10B981;
  }
  
  .arrow {
    transition: transform 0.2s;
  }
  
  .topic-card:hover .arrow {
    transform: translateX(5px);
  }
</style>