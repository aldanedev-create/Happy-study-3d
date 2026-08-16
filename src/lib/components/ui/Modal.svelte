<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { appStore } from '$stores/app.svelte';
  
  interface Props {
    isOpen?: boolean;
    title?: string;
    showCloseButton?: boolean;
    closeOnEscape?: boolean;
    closeOnBackdrop?: boolean;
    maxWidth?: string;
    onClose?: () => void;
    ariaLabel?: string;
    ariaDescribedBy?: string;
  }
  
  let {
    isOpen = false,
    title = undefined,
    showCloseButton = true,
    closeOnEscape = true,
    closeOnBackdrop = true,
    maxWidth = '500px',
    onClose = undefined,
    ariaLabel = undefined,
    ariaDescribedBy = undefined
  }: Props = $props();
  
  function close() {
    if (onClose) {
      appStore.playSound('click');
      onClose();
    }
  }
  
  function handleKeyDown(event: KeyboardEvent) {
    if (closeOnEscape && event.key === 'Escape' && isOpen) {
      close();
    }
  }
  
  function handleBackdropClick(event: MouseEvent) {
    if (closeOnBackdrop && event.target === event.currentTarget) {
      close();
    }
  }
  
  onMount(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('keydown', handleKeyDown);
    }
  });
  
  onDestroy(() => {
    if (typeof window !== 'undefined') {
      window.removeEventListener('keydown', handleKeyDown);
    }
  });
  
  // Lock body scroll when modal is open
  $: if (isOpen && typeof document !== 'undefined') {
    document.body.style.overflow = 'hidden';
  } else if (typeof document !== 'undefined') {
    document.body.style.overflow = '';
  }
</script>

{#if isOpen}
  <div 
    class="modal-backdrop"
    onclick={handleBackdropClick}
    role="presentation"
  >
    <div 
      class="modal"
      style="max-width: {maxWidth}"
      role="dialog"
      aria-modal="true"
      aria-label={ariaLabel || title || 'Modal'}
      aria-describedby={ariaDescribedBy}
    >
      {#if title || showCloseButton}
        <div class="modal-header">
          {#if title}
            <h2 class="modal-title">{title}</h2>
          {/if}
          
          {#if showCloseButton}
            <button 
              class="modal-close"
              onclick={close}
              aria-label="Close modal"
            >
              <span aria-hidden="true">✕</span>
            </button>
          {/if}
        </div>
      {/if}
      
      <div class="modal-content">
        <slot />
      </div>
      
      <div class="modal-footer">
        <slot name="footer" />
      </div>
    </div>
  </div>
{/if}

<style>
  .modal-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.75);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2000;
    padding: 1rem;
    animation: fadeIn 0.2s ease;
  }
  
  .modal {
    background: #1E293B;
    border: 1px solid #334155;
    border-radius: 1rem;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
    width: 100%;
    animation: slideUp 0.3s ease;
    max-height: 90vh;
    display: flex;
    flex-direction: column;
  }
  
  .modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.25rem 1.5rem;
    border-bottom: 1px solid #334155;
  }
  
  .modal-title {
    margin: 0;
    font-size: 1.25rem;
    color: #F1F5F9;
    font-weight: 600;
  }
  
  .modal-close {
    background: none;
    border: none;
    color: #94A3B8;
    font-size: 1.25rem;
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 0.5rem;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2.5rem;
    height: 2.5rem;
  }
  
  .modal-close:hover {
    background: #334155;
    color: #F1F5F9;
  }
  
  .modal-content {
    padding: 1.5rem;
    overflow-y: auto;
    flex: 1;
    color: #CBD5E1;
    line-height: 1.6;
  }
  
  .modal-footer {
    padding: 1.25rem 1.5rem;
    border-top: 1px solid #334155;
    display: flex;
    justify-content: flex-end;
    gap: 0.75rem;
  }
  
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  
  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @media (max-width: 768px) {
    .modal-backdrop {
      padding: 0.5rem;
      align-items: flex-end;
    }
    
    .modal {
      max-height: 95vh;
      border-radius: 1rem 1rem 0 0;
    }
  }
</style>