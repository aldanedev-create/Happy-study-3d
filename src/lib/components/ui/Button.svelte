<script lang="ts">
  import { appStore } from '$stores/app.svelte';
  
  type ButtonVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'ghost';
  type ButtonSize = 'sm' | 'md' | 'lg';
  
  interface Props {
    variant?: ButtonVariant;
    size?: ButtonSize;
    disabled?: boolean;
    loading?: boolean;
    fullWidth?: boolean;
    type?: 'button' | 'submit' | 'reset';
    href?: string;
    icon?: string;
    iconPosition?: 'left' | 'right';
    ariaLabel?: string;
  }
  
  let {
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    fullWidth = false,
    type = 'button',
    href = undefined,
    icon = undefined,
    iconPosition = 'left',
    ariaLabel = undefined
  }: Props = $props();
  
  function handleClick(event: MouseEvent) {
    if (!disabled && !loading) {
      appStore.playSound('click');
    }
  }
  
  // Determine if we're rendering a link or button
  $: isLink = href !== undefined;
</script>

{#if isLink}
  <a 
    href={href}
    class="btn"
    class:btn-primary={variant === 'primary'}
    class:btn-secondary={variant === 'secondary'}
    class:btn-success={variant === 'success'}
    class:btn-danger={variant === 'danger'}
    class:btn-warning={variant === 'warning'}
    class:btn-ghost={variant === 'ghost'}
    class:btn-sm={size === 'sm'}
    class:btn-md={size === 'md'}
    class:btn-lg={size === 'lg'}
    class:btn-full={fullWidth}
    class:btn-disabled={disabled}
    onclick={handleClick}
    aria-label={ariaLabel}
    aria-disabled={disabled}
    role="button"
  >
    {#if loading}
      <span class="spinner" aria-hidden="true"></span>
    {:else}
      {#if icon && iconPosition === 'left'}
        <span class="btn-icon" aria-hidden="true">{icon}</span>
      {/if}
      <slot />
      {#if icon && iconPosition === 'right'}
        <span class="btn-icon" aria-hidden="true">{icon}</span>
      {/if}
    {/if}
  </a>
{:else}
  <button 
    {type}
    class="btn"
    class:btn-primary={variant === 'primary'}
    class:btn-secondary={variant === 'secondary'}
    class:btn-success={variant === 'success'}
    class:btn-danger={variant === 'danger'}
    class:btn-warning={variant === 'warning'}
    class:btn-ghost={variant === 'ghost'}
    class:btn-sm={size === 'sm'}
    class:btn-md={size === 'md'}
    class:btn-lg={size === 'lg'}
    class:btn-full={fullWidth}
    class:btn-disabled={disabled}
    {disabled}
    onclick={handleClick}
    aria-label={ariaLabel}
    aria-busy={loading}
  >
    {#if loading}
      <span class="spinner" aria-hidden="true"></span>
      <span class="sr-only">Loading...</span>
    {:else}
      {#if icon && iconPosition === 'left'}
        <span class="btn-icon" aria-hidden="true">{icon}</span>
      {/if}
      <slot />
      {#if icon && iconPosition === 'right'}
        <span class="btn-icon" aria-hidden="true">{icon}</span>
      {/if}
    {/if}
  </button>
{/if}

<style>
  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.625rem 1.25rem;
    font-size: 0.875rem;
    font-weight: 600;
    border-radius: 0.5rem;
    border: 1px solid transparent;
    cursor: pointer;
    transition: all 0.2s;
    text-decoration: none;
    line-height: 1.5;
    white-space: nowrap;
    user-select: none;
  }
  
  .btn:hover:not(.btn-disabled) {
    transform: translateY(-1px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
  
  .btn:active:not(.btn-disabled) {
    transform: translateY(0);
  }
  
  .btn:focus-visible {
    outline: 2px solid #4F46E5;
    outline-offset: 2px;
  }
  
  /* Variants */
  .btn-primary {
    background: #4F46E5;
    color: white;
  }
  
  .btn-primary:hover:not(.btn-disabled) {
    background: #4338CA;
  }
  
  .btn-secondary {
    background: #334155;
    color: #E2E8F0;
  }
  
  .btn-secondary:hover:not(.btn-disabled) {
    background: #475569;
  }
  
  .btn-success {
    background: #10B981;
    color: white;
  }
  
  .btn-success:hover:not(.btn-disabled) {
    background: #059669;
  }
  
  .btn-danger {
    background: #DC2626;
    color: white;
  }
  
  .btn-danger:hover:not(.btn-disabled) {
    background: #B91C1C;
  }
  
  .btn-warning {
    background: #F59E0B;
    color: white;
  }
  
  .btn-warning:hover:not(.btn-disabled) {
    background: #D97706;
  }
  
  .btn-ghost {
    background: transparent;
    color: #CBD5E1;
    border-color: #334155;
  }
  
  .btn-ghost:hover:not(.btn-disabled) {
    background: #334155;
    color: #F1F5F9;
  }
  
  /* Sizes */
  .btn-sm {
    padding: 0.375rem 0.75rem;
    font-size: 0.75rem;
  }
  
  .btn-md {
    padding: 0.625rem 1.25rem;
    font-size: 0.875rem;
  }
  
  .btn-lg {
    padding: 0.875rem 1.75rem;
    font-size: 1rem;
  }
  
  /* Full width */
  .btn-full {
    width: 100%;
  }
  
  /* Disabled */
  .btn-disabled {
    opacity: 0.5;
    cursor: not-allowed;
    pointer-events: none;
  }
  
  .btn-icon {
    font-size: 1.1em;
    line-height: 1;
  }
  
  /* Spinner */
  .spinner {
    width: 1rem;
    height: 1rem;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-top-color: white;
    border-radius: 50%;
    animation: spin 0.6s linear infinite;
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
</style>