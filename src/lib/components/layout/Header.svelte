<script lang="ts">
  import { page } from '$app/stores';
  import { appStore } from '$stores/app.svelte';
  
  let isMobileMenuOpen = $state(false);
  let isScrolled = $state(false);
  
  // Navigation items
  const navItems = [
    { href: '/', label: 'Home', icon: '🏠' },
    { href: '/cxc', label: 'CXC', icon: '📚' },
    { href: '/cape', label: 'CAPE', icon: '🎓' },
    { href: '/software-engineering', label: 'Programming', icon: '💻' },
    { href: '/audio', label: 'Audio', icon: '🎙️' },
    { href: '/progress', label: 'Progress', icon: '📊' }
  ];
  
  function toggleMobileMenu() {
    isMobileMenuOpen = !isMobileMenuOpen;
    appStore.playSound('click');
  }
  
  function handleScroll() {
    isScrolled = window.scrollY > 10;
  }
  
  // Add scroll listener
  if (typeof window !== 'undefined') {
    window.addEventListener('scroll', handleScroll);
  }
</script>

<header class="header" class:scrolled={isScrolled}>
  <div class="header-container">
    <!-- Logo -->
    <a href="/" class="logo" onclick={() => appStore.playSound('click')}>
      <span class="logo-icon">📚</span>
      <span class="logo-text">Happy Study 3D</span>
    </a>
    
    <!-- Desktop Navigation -->
    <nav class="desktop-nav" aria-label="Main navigation">
      {#each navItems as item}
        <a 
          href={item.href} 
          class="nav-link"
          class:active={$page.url.pathname === item.href}
          onclick={() => appStore.playSound('click')}
          aria-current={$page.url.pathname === item.href ? 'page' : undefined}
        >
          <span class="nav-icon" aria-hidden="true">{item.icon}</span>
          <span class="nav-label">{item.label}</span>
        </a>
      {/each}
    </nav>
    
    <!-- Settings Link -->
    <a 
      href="/settings" 
      class="settings-link"
      class:active={$page.url.pathname === '/settings'}
      onclick={() => appStore.playSound('click')}
      aria-label="Settings"
    >
      <span aria-hidden="true">⚙️</span>
    </a>
    
    <!-- Mobile Menu Button -->
    <button 
      class="mobile-menu-btn"
      onclick={toggleMobileMenu}
      aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
      aria-expanded={isMobileMenuOpen}
    >
      <span aria-hidden="true">{isMobileMenuOpen ? '✕' : '☰'}</span>
    </button>
  </div>
  
  <!-- Mobile Navigation -->
  {#if isMobileMenuOpen}
    <nav class="mobile-nav" aria-label="Mobile navigation">
      {#each navItems as item}
        <a 
          href={item.href} 
          class="mobile-nav-link"
          class:active={$page.url.pathname === item.href}
          onclick={() => {
            appStore.playSound('click');
            isMobileMenuOpen = false;
          }}
        >
          <span class="nav-icon" aria-hidden="true">{item.icon}</span>
          <span>{item.label}</span>
        </a>
      {/each}
      <a 
        href="/settings" 
        class="mobile-nav-link"
        class:active={$page.url.pathname === '/settings'}
        onclick={() => {
          appStore.playSound('click');
          isMobileMenuOpen = false;
        }}
      >
        <span class="nav-icon" aria-hidden="true">⚙️</span>
        <span>Settings</span>
      </a>
    </nav>
  {/if}
</header>

<style>
  .header {
    background: #1E293B;
    border-bottom: 1px solid #334155;
    position: sticky;
    top: 0;
    z-index: 1000;
    transition: all 0.3s;
    backdrop-filter: blur(10px);
  }
  
  .header.scrolled {
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    background: rgba(30, 41, 59, 0.95);
  }
  
  .header-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0.75rem 2rem;
    display: flex;
    align-items: center;
    gap: 1rem;
  }
  
  .logo {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    text-decoration: none;
    color: #E2E8F0;
    font-weight: 700;
    font-size: 1.25rem;
    transition: all 0.2s;
  }
  
  .logo:hover {
    transform: scale(1.05);
  }
  
  .logo-icon {
    font-size: 1.75rem;
  }
  
  .logo-text {
    background: linear-gradient(135deg, #4F46E5, #7C3AED);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  .desktop-nav {
    display: flex;
    gap: 0.5rem;
    align-items: center;
    flex: 1;
    justify-content: center;
  }
  
  .nav-link {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    text-decoration: none;
    color: #94A3B8;
    border-radius: 0.5rem;
    transition: all 0.2s;
    font-weight: 500;
    position: relative;
  }
  
  .nav-link:hover {
    background: #334155;
    color: #E2E8F0;
  }
  
  .nav-link.active {
    background: #4F46E5;
    color: white;
  }
  
  .nav-link.active::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 50%;
    transform: translateX(-50%);
    width: 20px;
    height: 2px;
    background: #4F46E5;
    border-radius: 2px;
  }
  
  .nav-icon {
    font-size: 1.25rem;
    line-height: 1;
  }
  
  .settings-link {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2.5rem;
    height: 2.5rem;
    text-decoration: none;
    color: #94A3B8;
    border-radius: 0.5rem;
    transition: all 0.2s;
    font-size: 1.25rem;
  }
  
  .settings-link:hover {
    background: #334155;
    color: #E2E8F0;
  }
  
  .settings-link.active {
    background: #4F46E5;
    color: white;
  }
  
  .mobile-menu-btn {
    display: none;
    background: none;
    border: none;
    color: #E2E8F0;
    font-size: 1.5rem;
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 0.5rem;
    transition: all 0.2s;
  }
  
  .mobile-menu-btn:hover {
    background: #334155;
  }
  
  .mobile-nav {
    display: none;
    padding: 1rem;
    background: #1E293B;
    border-top: 1px solid #334155;
    flex-direction: column;
    gap: 0.5rem;
    animation: slideDown 0.3s ease;
  }
  
  .mobile-nav-link {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem 1rem;
    text-decoration: none;
    color: #94A3B8;
    border-radius: 0.5rem;
    transition: all 0.2s;
    font-weight: 500;
  }
  
  .mobile-nav-link:hover {
    background: #334155;
    color: #E2E8F0;
  }
  
  .mobile-nav-link.active {
    background: #4F46E5;
    color: white;
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
  
  @media (max-width: 768px) {
    .desktop-nav {
      display: none;
    }
    
    .settings-link {
      display: none;
    }
    
    .mobile-menu-btn {
      display: block;
    }
    
    .mobile-nav {
      display: flex;
    }
    
    .header-container {
      padding: 0.75rem 1rem;
    }
  }
</style>