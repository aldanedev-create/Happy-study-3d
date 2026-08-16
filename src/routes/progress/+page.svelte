<script lang="ts">
  import { onMount } from 'svelte';
  import { progressStore } from '$stores/progress.svelte';
  
  onMount(() => {
    console.log('Progress page loaded');
    progressStore.loadProgress();
  });
  
  function getProgressColor(percentage: number): string {
    if (percentage >= 80) return '#10B981';
    if (percentage >= 60) return '#3B82F6';
    if (percentage >= 40) return '#F59E0B';
    return '#DC2626';
  }
  
  function getStatusLabel(percentage: number): string {
    if (percentage >= 80) return 'Excellent';
    if (percentage >= 60) return 'Good Progress';
    if (percentage >= 40) return 'Needs Work';
    return 'Getting Started';
  }
</script>

<svelte:head>
  <title>Progress - Happy Study 3D</title>
  <meta name="description" content="Track your study progress and identify weak areas" />
</svelte:head>

<div class="progress-container">
  <header class="page-header">
    <h1 class="page-title">Your Progress</h1>
    <p class="page-description">
      Track your learning journey and identify areas for improvement
    </p>
  </header>
  
  {#if progressStore.subjects.length === 0}
    <div class="empty-state">
      <h2>No Progress Yet</h2>
      <p>Start studying to track your progress!</p>
      <a href="/cxc" class="btn-primary">Browse CXC Subjects</a>
    </div>
  {:else}
    <div class="overall-section">
      <h2 class="section-title">Overall Progress</h2>
      <div class="overall-card">
        <div class="overall-percentage">
          {Math.round(progressStore.overallPercentage)}%
        </div>
        <div class="overall-status">
          {getStatusLabel(progressStore.overallPercentage)}
        </div>
        <div class="progress-bar">
          <div 
            class="progress-fill"
            style="width: {progressStore.overallPercentage}%; background: {getProgressColor(progressStore.overallPercentage)}"
          ></div>
        </div>
      </div>
    </div>
    
    <div class="subjects-section">
      <h2 class="section-title">Subject Breakdown</h2>
      <div class="subjects-list">
        {#each progressStore.subjects as subject}
          <div class="subject-progress">
            <div class="subject-header">
              <h3 class="subject-name">{subject.name}</h3>
              <span class="subject-percentage">{Math.round(subject.percentage)}%</span>
            </div>
            <div class="progress-bar">
              <div 
                class="progress-fill"
                style="width: {subject.percentage}%; background: {getProgressColor(subject.percentage)}"
              ></div>
            </div>
            <div class="subject-details">
              <span class="status-badge" style="background: {getProgressColor(subject.percentage)}">
                {getStatusLabel(subject.percentage)}
              </span>
              <span class="topics-completed">
                {subject.topicsCompleted} / {subject.totalTopics} topics
              </span>
            </div>
          </div>
        {/each}
      </div>
    </div>
  {/if}
</div>

<style>
  .progress-container {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    padding: 2rem;
    max-width: 1200px;
    margin: 0 auto;
  }
  
  .page-header {
    text-align: center;
    margin-bottom: 2rem;
  }
  
  .page-title {
    font-size: 2.5rem;
    margin-bottom: 0.5rem;
    background: linear-gradient(135deg, #10B981, #3B82F6);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  .page-description {
    color: #94A3B8;
    font-size: 1.1rem;
  }
  
  .empty-state {
    text-align: center;
    padding: 4rem 2rem;
    background: #1E293B;
    border-radius: 1rem;
    border: 1px solid #334155;
  }
  
  .empty-state h2 {
    margin-bottom: 1rem;
    color: #F1F5F9;
  }
  
  .empty-state p {
    margin-bottom: 2rem;
    color: #94A3B8;
  }
  
  .overall-section,
  .subjects-section {
    background: #1E293B;
    border: 1px solid #334155;
    border-radius: 1rem;
    padding: 2rem;
  }
  
  .section-title {
    margin-bottom: 1.5rem;
    color: #F1F5F9;
  }
  
  .overall-card {
    text-align: center;
    max-width: 400px;
    margin: 0 auto;
  }
  
  .overall-percentage {
    font-size: 4rem;
    font-weight: bold;
    color: #F1F5F9;
    margin-bottom: 0.5rem;
  }
  
  .overall-status {
    color: #94A3B8;
    margin-bottom: 1.5rem;
    font-size: 1.1rem;
  }
  
  .progress-bar {
    width: 100%;
    height: 0.75rem;
    background: #0F172A;
    border-radius: 9999px;
    overflow: hidden;
  }
  
  .progress-fill {
    height: 100%;
    transition: width 0.5s ease;
    border-radius: 9999px;
  }
  
  .subjects-list {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }
  
  .subject-progress {
    background: #0F172A;
    border-radius: 0.5rem;
    padding: 1.5rem;
  }
  
  .subject-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.75rem;
  }
  
  .subject-name {
    color: #F1F5F9;
    font-size: 1.1rem;
  }
  
  .subject-percentage {
    color: #CBD5E1;
    font-weight: bold;
  }
  
  .subject-details {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 0.75rem;
  }
  
  .status-badge {
    padding: 0.25rem 0.75rem;
    border-radius: 9999px;
    color: white;
    font-size: 0.75rem;
    font-weight: 600;
  }
  
  .topics-completed {
    color: #94A3B8;
    font-size: 0.875rem;
  }
  
  .btn-primary {
    display: inline-block;
    padding: 0.75rem 1.5rem;
    background: #4F46E5;
    color: white;
    text-decoration: none;
    border-radius: 0.5rem;
    transition: all 0.2s;
  }
  
  .btn-primary:hover {
    background: #4338CA;
    transform: translateY(-2px);
  }
</style>