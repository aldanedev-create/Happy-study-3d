<script lang="ts">
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { appStore } from '$stores/app.svelte';
  
  interface Breadcrumb {
    label: string;
    href?: string;
    icon?: string;
  }
  
  export let breadcrumbs: Breadcrumb[] = [];
  export let showBackButton = false;
  export let backHref = '/';
  export let onBack: (() => void) | undefined = undefined;
  
  function handleBack() {
    appStore.playSound('click');
    if (onBack) {
      onBack();
    } else {
      goto(backHref);
    }
  }
  
  function handleBreadcrumbClick(breadcrumb: Breadcrumb) {
    if (breadcrumb.href) {
      appStore.playSound('click');
      goto(breadcrumb.href);
    }
  }
  
  // Auto-generate breadcrumbs from URL if not provided
  $: if (breadcrumbs.length === 0 && $page.url.pathname !== '/') {
    const segments = $page.url.pathname.split('/').filter(Boolean);
    breadcrumbs = segments.map((segment, index) => {
      const href = '/' + segments.slice(0, index + 1).join('/');
      return {
        label: segment.split('-').map(word => 
          word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' '),
        href
      };
    });
  }
</script>

<nav class="navigation" aria-label="Breadcrumb navigation">
  <div class="nav-container">
    {#if showBackButton}
      <button 
        class="back-button"
        onclick={handleBack}
        aria-label="Go back"
      >
        <span aria-hidden="true">←</span>
        <span>Back</span>
      </button>
    {/if}
    
    <ol class="breadcrumbs">
      <li class="breadcrumb-item">
        <a 
          href="/" 
          class="breadcrumb-link"
          onclick={() => appStore.playSound('click')}
        >
          <span aria-hidden="true">🏠</span>
          <span>Home</span>
        </a>
      </li>
      
      {#each breadcrumbs as breadcrumb, index}
        <li class="breadcrumb-item">
          <span class="breadcrumb-separator" aria-hidden="true">/</span>
          {#if index === breadcrumbs.length - 1}
            <span class="breadcrumb-current" aria-current="page">
              {#if breadcrumb.icon}
                <span aria-hidden="true">{breadcrumb.icon}</span>
              {/if}
              <span>{breadcrumb.label}</span>
            </span>
          {:else}
            <a 
              href={breadcrumb.href || '/'}
              class="breadcrumb-link"
              onclick={() => handleBreadcrumbClick(breadcrumb)}
            >
              {#if breadcrumb.icon}
                <span aria-hidden="true">{breadcrumb.icon}</span>
              {/if}
              <span>{breadcrumb.label}</span>
            </a>
          {/if}
        </li>
      {/each}
    </ol>
  </div>
</nav>

<style>
  .navigation {
    background: #0F172A;
    border-bottom: 1px solid #1E293B;
    padding: 0.75rem 2rem;
  }
  
  .nav-container {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    gap: 1rem;
    flex-wrap: wrap;
  }
  
  .back-button {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    background: #1E293B;
    border: 1px solid #334155;
    color: #CBD5E1;
    border-radius: 0.5rem;
    cursor: pointer;
    transition: all 0.2s;
    font-size: 0.875rem;
    font-weight: 500;
  }
  
  .back-button:hover {
    background: #334155;
    color: #F1F5F9;
  }
  
  .breadcrumbs {
    display: flex;
    align-items: center;
    list-style: none;
    padding: 0;
    margin: 0;
    flex-wrap: wrap;
    gap: 0.25rem;
  }
  
  .breadcrumb-item {
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }
  
  .breadcrumb-link {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    text-decoration: none;
    color: #64748B;
    transition: all 0.2s;
    padding: 0.25rem 0.5rem;
    border-radius: 0.25rem;
    font-size: 0.875rem;
  }
  
  .breadcrumb-link:hover {
    background: #1E293B;
    color: #E2E8F0;
  }
  
  .breadcrumb-separator {
    color: #475569;
    margin: 0 0.25rem;
  }
  
  .breadcrumb-current {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    color: #F1F5F9;
    font-weight: 600;
    padding: 0.25rem 0.5rem;
    font-size: 0.875rem;
  }
  
  @media (max-width: 768px) {
    .navigation {
      padding: 0.5rem 1rem;
    }
  }
</style>