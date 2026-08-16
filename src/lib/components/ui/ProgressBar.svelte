<script lang="ts">
  type ProgressVariant = 'default' | 'success' | 'warning' | 'danger' | 'info';
  type ProgressSize = 'sm' | 'md' | 'lg';
  
  interface Props {
    value?: number;
    max?: number;
    label?: string;
    showLabel?: boolean;
    showPercentage?: boolean;
    variant?: ProgressVariant;
    size?: ProgressSize;
    animated?: boolean;
    striped?: boolean;
    ariaLabel?: string;
  }
  
  let {
    value = 0,
    max = 100,
    label = undefined,
    showLabel = false,
    showPercentage = false,
    variant = 'default',
    size = 'md',
    animated = false,
    striped = false,
    ariaLabel = undefined
  }: Props = $props();
  
  $: percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  
  function getColor(): string {
    if (variant === 'default') {
      if (percentage >= 80) return '#10B981';
      if (percentage >= 60) return '#3B82F6';
      if (percentage >= 40) return '#F59E0B';
      return '#DC2626';
    }
    
    const colors = {
      success: '#10B981',
      warning: '#F59E0B',
      danger: '#DC2626',
      info: '#3B82F6'
    };
    
    return colors[variant as keyof typeof colors];
  }
  
  function getLabel(): string {
    if (label) return label;
    if (percentage >= 80) return 'Excellent';
    if (percentage >= 60) return 'Good';
    if (percentage >= 40) return 'Fair';
    return 'Needs Work';
  }
</script>

<div class="progress-container">
  {#if showLabel}
    <div class="progress-header">
      <span class="progress-label">{getLabel()}</span>
      {#if showPercentage}
        <span class="progress-percentage">{Math.round(percentage)}%</span>
      {/if}
    </div>
  {/if}
  
  <div 
    class="progress-bar"
    class:size-sm={size === 'sm'}
    class:size-md={size === 'md'}
    class:size-lg={size === 'lg'}
    role="progressbar"
    aria-valuenow={Math.round(percentage)}
    aria-valuemin={0}
    aria-valuemax={100}
    aria-label={ariaLabel || label || 'Progress'}
  >
    <div 
      class="progress-fill"
      class:animated={animated}
      class:striped={striped}
      style="width: {percentage}%; background-color: {getColor()}"
    ></div>
  </div>
</div>

<style>
  .progress-container {
    width: 100%;
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
    font-weight: 500;
  }
  
  .progress-percentage {
    color: #CBD5E1;
    font-size: 0.875rem;
    font-weight: 600;
  }
  
  .progress-bar {
    width: 100%;
    background: #0F172A;
    border-radius: 9999px;
    overflow: hidden;
    position: relative;
  }
  
  .size-sm {
    height: 0.5rem;
  }
  
  .size-md {
    height: 0.75rem;
  }
  
  .size-lg {
    height: 1rem;
  }
  
  .progress-fill {
    height: 100%;
    transition: width 0.5s ease;
    border-radius: 9999px;
    position: relative;
    overflow: hidden;
  }
  
  .progress-fill.animated {
    transition: width 1s ease;
  }
  
  .progress-fill.striped::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      45deg,
      rgba(255, 255, 255, 0.15) 25%,
      transparent 25%,
      transparent 50%,
      rgba(255, 255, 255, 0.15) 50%,
      rgba(255, 255, 255, 0.15) 75%,
      transparent 75%,
      transparent
    );
    background-size: 1rem 1rem;
    animation: stripe 1s linear infinite;
  }
  
  @keyframes stripe {
    from {
      background-position: 0 0;
    }
    to {
      background-position: 1rem 0;
    }
  }
</style>