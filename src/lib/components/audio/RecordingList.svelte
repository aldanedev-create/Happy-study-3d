<script lang="ts">
  import { onMount } from 'svelte';
  import { audioStore } from '$stores/audio.svelte';
  import { appStore } from '$stores/app.svelte';
  import AudioPlayer from './AudioPlayer.svelte';
  
  let selectedRecording = $state<string | null>(null);
  let searchQuery = $state('');
  let sortBy = $state<'date' | 'name' | 'duration'>('date');
  let sortOrder = $state<'asc' | 'desc'>('desc');
  
  onMount(() => {
    audioStore.loadRecordings();
  });
  
  $: filteredRecordings = getFilteredRecordings();
  
  function getFilteredRecordings() {
    let recordings = [...audioStore.recordings];
    
    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      recordings = recordings.filter(recording => 
        recording.name.toLowerCase().includes(query)
      );
    }
    
    // Apply sort
    recordings.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'duration':
          comparison = a.duration - b.duration;
          break;
        default:
          comparison = new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });
    
    return recordings;
  }
  
  function toggleRecording(id: string) {
    if (selectedRecording === id) {
      selectedRecording = null;
    } else {
      selectedRecording = id;
    }
    appStore.playSound('click');
  }
  
  function deleteRecording(id: string) {
    if (confirm('Are you sure you want to delete this recording?')) {
      audioStore.deleteRecording(id);
      if (selectedRecording === id) {
        selectedRecording = null;
      }
      appStore.playSound('notification');
    }
  }
  
  function renameRecording(id: string) {
    const recording = audioStore.recordings.find(r => r.id === id);
    if (!recording) return;
    
    const newName = prompt('Enter new name:', recording.name);
    if (newName && newName.trim()) {
      audioStore.renameRecording(id, newName.trim());
      appStore.playSound('click');
    }
  }
  
  function toggleSort(field: 'date' | 'name' | 'duration') {
    if (sortBy === field) {
      sortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      sortBy = field;
      sortOrder = 'desc';
    }
    appStore.playSound('click');
  }
  
  function formatDate(timestamp: string): string {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
  
  function formatDuration(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
</script>

<div class="recording-list">
  <div class="list-header">
    <h3 class="list-title">Your Recordings</h3>
    <span class="recording-count">
      {filteredRecordings.length} recording{filteredRecordings.length !== 1 ? 's' : ''}
    </span>
  </div>
  
  <div class="list-controls">
    <div class="search-container">
      <input
        type="text"
        class="search-input"
        placeholder="Search recordings..."
        bind:value={searchQuery}
        aria-label="Search recordings"
      />
      <span class="search-icon" aria-hidden="true">🔍</span>
    </div>
    
    <div class="sort-buttons">
      <button 
        class="sort-btn"
        class:active={sortBy === 'date'}
        onclick={() => toggleSort('date')}
      >
        Date {sortBy === 'date' && (sortOrder === 'asc' ? '↑' : '↓')}
      </button>
      <button 
        class="sort-btn"
        class:active={sortBy === 'name'}
        onclick={() => toggleSort('name')}
      >
        Name {sortBy === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
      </button>
      <button 
        class="sort-btn"
        class:active={sortBy === 'duration'}
        onclick={() => toggleSort('duration')}
      >
        Duration {sortBy === 'duration' && (sortOrder === 'asc' ? '↑' : '↓')}
      </button>
    </div>
  </div>
  
  {#if filteredRecordings.length === 0}
    <div class="empty-state">
      <p class="empty-text">
        {searchQuery ? 'No recordings match your search.' : 'No recordings yet.'}
      </p>
      <p class="empty-hint">
        {searchQuery ? 'Try a different search term.' : 'Start recording to create your first study note.'}
      </p>
    </div>
  {:else}
    <div class="recordings">
      {#each filteredRecordings as recording, index}
        <div class="recording-item" class:expanded={selectedRecording === recording.id}>
          <div 
            class="recording-header"
            onclick={() => toggleRecording(recording.id)}
            role="button"
            tabindex="0"
            onkeydown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleRecording(recording.id);
              }
            }}
          >
            <div class="recording-info">
              <span class="recording-number">{index + 1}</span>
              <div class="recording-details">
                <h4 class="recording-name">{recording.name}</h4>
                <div class="recording-meta">
                  <span class="meta-item">📅 {formatDate(recording.timestamp)}</span>
                  <span class="meta-item">⏱ {formatDuration(recording.duration)}</span>
                </div>
              </div>
            </div>
            
            <div class="recording-actions">
              <button 
                class="action-btn"
                onclick={(e) => {
                  e.stopPropagation();
                  renameRecording(recording.id);
                }}
                aria-label="Rename recording"
              >
                ✏️
              </button>
              <button 
                class="action-btn delete"
                onclick={(e) => {
                  e.stopPropagation();
                  deleteRecording(recording.id);
                }}
                aria-label="Delete recording"
              >
                🗑️
              </button>
              <span class="expand-icon" aria-hidden="true">
                {selectedRecording === recording.id ? '▾' : '▸'}
              </span>
            </div>
          </div>
          
          {#if selectedRecording === recording.id}
            <div class="recording-player">
              <AudioPlayer 
                src={recording.url}
                title={recording.name}
                showDownload={true}
              />
            </div>
          {/if}
        </div>
      {/each}
    </div>
  {/if}
</div>

<style>
  .recording-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  
  .list-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .list-title {
    color: #F1F5F9;
    font-size: 1.1rem;
    margin: 0;
  }
  
  .recording-count {
    color: #94A3B8;
    font-size: 0.875rem;
  }
  
  .list-controls {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .search-container {
    position: relative;
  }
  
  .search-input {
    width: 100%;
    padding: 0.75rem 1rem 0.75rem 2.5rem;
    background: #0F172A;
    border: 1px solid #334155;
    border-radius: 0.5rem;
    color: #F1F5F9;
    font-size: 0.9rem;
    transition: all 0.2s;
  }
  
  .search-input:focus {
    outline: none;
    border-color: #4F46E5;
  }
  
  .search-input::placeholder {
    color: #64748B;
  }
  
  .search-icon {
    position: absolute;
    left: 0.75rem;
    top: 50%;
    transform: translateY(-50%);
    color: #64748B;
  }
  
  .sort-buttons {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
  }
  
  .sort-btn {
    padding: 0.5rem 1rem;
    background: #0F172A;
    border: 1px solid #334155;
    color: #94A3B8;
    border-radius: 0.5rem;
    cursor: pointer;
    font-size: 0.875rem;
    transition: all 0.2s;
  }
  
  .sort-btn:hover {
    background: #334155;
    color: #E2E8F0;
  }
  
  .sort-btn.active {
    background: #4F46E5;
    color: white;
    border-color: #4F46E5;
  }
  
  .empty-state {
    text-align: center;
    padding: 2rem;
    background: #0F172A;
    border-radius: 0.5rem;
  }
  
  .empty-text {
    color: #F1F5F9;
    margin-bottom: 0.5rem;
    font-weight: 600;
  }
  
  .empty-hint {
    color: #94A3B8;
    margin: 0;
    font-size: 0.9rem;
  }
  
  .recordings {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .recording-item {
    background: #0F172A;
    border: 1px solid #334155;
    border-radius: 0.5rem;
    overflow: hidden;
    transition: all 0.2s;
  }
  
  .recording-item.expanded {
    border-color: #4F46E5;
  }
  
  .recording-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .recording-header:hover {
    background: #1E293B;
  }
  
  .recording-info {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    flex: 1;
  }
  
  .recording-number {
    width: 2rem;
    height: 2rem;
    background: #334155;
    color: #F1F5F9;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    font-size: 0.875rem;
    flex-shrink: 0;
  }
  
  .recording-details {
    flex: 1;
  }
  
  .recording-name {
    color: #F1F5F9;
    margin: 0 0 0.25rem 0;
    font-size: 0.95rem;
  }
  
  .recording-meta {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
  }
  
  .meta-item {
    color: #64748B;
    font-size: 0.8rem;
  }
  
  .recording-actions {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  .action-btn {
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
  
  .action-btn:hover {
    background: #4F46E5;
    color: white;
  }
  
  .action-btn.delete:hover {
    background: #DC2626;
  }
  
  .expand-icon {
    color: #94A3B8;
    font-size: 0.75rem;
    transition: transform 0.2s;
  }
  
  .recording-player {
    padding: 1rem;
    border-top: 1px solid #334155;
    animation: slideDown 0.3s ease;
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
</style>