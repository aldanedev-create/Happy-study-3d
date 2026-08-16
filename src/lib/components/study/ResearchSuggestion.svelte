<script lang="ts">
  import { appStore } from '$stores/app.svelte';
  
  interface ResearchResource {
    title: string;
    url?: string;
    description?: string;
    type: 'official' | 'video' | 'article' | 'book' | 'website';
  }
  
  interface Props {
    topic: string;
    suggestions: string[];
    resources?: ResearchResource[];
    onClose?: () => void;
  }
  
  let {
    topic,
    suggestions,
    resources = [],
    onClose = undefined
  }: Props = $props();
  
  function handleResourceClick(resource: ResearchResource) {
    appStore.playSound('click');
    
    if (resource.url) {
      window.open(resource.url, '_blank');
    }
  }
  
  function getResourceIcon(type: string): string {
    switch (type) {
      case 'official':
        return '🏛️';
      case 'video':
        return '🎥';
      case 'article':
        return '📄';
      case 'book':
        return '📚';
      case 'website':
        return '🌐';
      default:
        return '🔗';
    }
  }
  
  function getResourceLabel(type: string): string {
    switch (type) {
      case 'official':
        return 'Official';
      case 'video':
        return 'Video';
      case 'article':
        return 'Article';
      case 'book':
        return 'Book';
      case 'website':
        return 'Website';
      default:
        return 'Resource';
    }
  }
</script>

<div class="research-container">
  <div class="research-header">
    <h3 class="research-title">
      🔍 Further Research: {topic}
    </h3>
    {#if onClose}
      <button 
        class="close-btn"
        onclick={onClose}
        aria-label="Close research suggestions"
      >
        ✕
      </button>
    {/if}
  </div>
  
  <div class="research-content">
    <p class="research-intro">
      To deepen your understanding, explore these topics:
    </p>
    
    <ul class="suggestions-list">
      {#each suggestions as suggestion, index}
        <li class="suggestion-item">
          <span class="suggestion-number">{index + 1}</span>
          <span class="suggestion-text">{suggestion}</span>
        </li>
      {/each}
    </ul>
    
    {#if resources.length > 0}
      <div class="resources-section">
        <h4 class="resources-title">Recommended Resources</h4>
        
        <div class="resources-list">
          {#each resources as resource, index}
            <div 
              class="resource-item"
              class:clickable={!!resource.url}
              onclick={() => handleResourceClick(resource)}
              role={resource.url ? 'button' : undefined}
              tabindex={resource.url ? 0 : undefined}
              onkeydown={(e) => {
                if (resource.url && (e.key === 'Enter' || e.key === ' ')) {
                  e.preventDefault();
                  handleResourceClick(resource);
                }
              }}
            >
              <span class="resource-icon" aria-hidden="true">
                {getResourceIcon(resource.type)}
              </span>
              <div class="resource-info">
                <span class="resource-type">
                  {getResourceLabel(resource.type)}
                </span>
                <span class="resource-name">{resource.title}</span>
                {#if resource.description}
                  <span class="resource-description">{resource.description}</span>
                {/if}
              </div>
              {#if resource.url}
                <span class="resource-link" aria-hidden="true">↗</span>
              {/if}
            </div>
          {/each}
        </div>
      </div>
    {/if}
    
    <div class="research-note">
      <span aria-hidden="true">💡</span>
      <p>
        Remember to verify all information with official CXC/CAPE syllabuses 
        and trusted educational sources.
      </p>
    </div>
  </div>
</div>

<style>
  .research-container {
    background: #1E293B;
    border: 1px solid #334155;
    border-radius: 1rem;
    padding: 1.5rem;
  }
  
  .research-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
  }
  
  .research-title {
    color: #F1F5F9;
    font-size: 1.25rem;
    margin: 0;
  }
  
  .close-btn {
    width: 2rem;
    height: 2rem;
    background: #334155;
    border: none;
    border-radius: 0.5rem;
    color: #CBD5E1;
    cursor: pointer;
    font-size: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
  }
  
  .close-btn:hover {
    background: #475569;
    color: #F1F5F9;
  }
  
  .research-content {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }
  
  .research-intro {
    color: #CBD5E1;
    margin: 0;
  }
  
  .suggestions-list {
    list-style: none;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .suggestion-item {
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
    padding: 0.75rem;
    background: #0F172A;
    border-radius: 0.5rem;
  }
  
  .suggestion-number {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 1.5rem;
    height: 1.5rem;
    background: #3B82F6;
    color: white;
    border-radius: 50%;
    font-size: 0.75rem;
    font-weight: 600;
    flex-shrink: 0;
  }
  
  .suggestion-text {
    color: #CBD5E1;
    line-height: 1.5;
  }
  
  .resources-section {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .resources-title {
    color: #F1F5F9;
    margin: 0;
    font-size: 1rem;
  }
  
  .resources-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .resource-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem;
    background: #0F172A;
    border-radius: 0.5rem;
    transition: all 0.2s;
  }
  
  .resource-item.clickable {
    cursor: pointer;
  }
  
  .resource-item.clickable:hover {
    background: #334155;
    transform: translateX(5px);
  }
  
  .resource-item:focus-visible {
    outline: 2px solid #3B82F6;
    outline-offset: 2px;
  }
  
  .resource-icon {
    font-size: 1.5rem;
    flex-shrink: 0;
  }
  
  .resource-info {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    flex: 1;
  }
  
  .resource-type {
    color: #64748B;
    font-size: 0.75rem;
    text-transform: uppercase;
    font-weight: 600;
  }
  
  .resource-name {
    color: #F1F5F9;
    font-weight: 600;
  }
  
  .resource-description {
    color: #94A3B8;
    font-size: 0.875rem;
  }
  
  .resource-link {
    color: #3B82F6;
    font-size: 1.25rem;
    flex-shrink: 0;
  }
  
  .research-note {
    display: flex;
    gap: 0.75rem;
    padding: 1rem;
    background: #0F172A;
    border-radius: 0.5rem;
    border-left: 3px solid #F59E0B;
  }
  
  .research-note p {
    color: #94A3B8;
    margin: 0;
    font-size: 0.875rem;
    line-height: 1.5;
  }
</style>