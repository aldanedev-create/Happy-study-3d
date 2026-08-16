<script lang="ts">
  import { page } from '$app/stores';
  import { appStore } from '$stores/app.svelte';
  
  interface SidebarItem {
    href: string;
    label: string;
    icon: string;
    children?: SidebarItem[];
  }
  
  export let items: SidebarItem[] = [
    {
      href: '/cxc',
      label: 'CXC/CSEC',
      icon: '📚',
      children: [
        { href: '/cxc', label: 'All Subjects', icon: '📖' },
        { href: '/study?subject=mathematics&area=cxc', label: 'Mathematics', icon: '📐' },
        { href: '/study?subject=english-a&area=cxc', label: 'English A', icon: '📝' },
        { href: '/study?subject=information-technology&area=cxc', label: 'IT', icon: '💻' }
      ]
    },
    {
      href: '/cape',
      label: 'CAPE',
      icon: '🎓',
      children: [
        { href: '/cape', label: 'All Subjects', icon: '📖' },
        { href: '/study?subject=communication-studies&area=cape', label: 'Communication', icon: '💬' },
        { href: '/study?subject=computer-science&area=cape', label: 'Computer Science', icon: '💻' }
      ]
    },
    {
      href: '/software-engineering',
      label: 'Programming',
      icon: '💻',
      children: [
        { href: '/software-engineering', label: 'All Topics', icon: '📖' },
        { href: '/study?subject=javascript&area=software-engineering', label: 'JavaScript', icon: '⚡' },
        { href: '/study?subject=python&area=software-engineering', label: 'Python', icon: '🐍' }
      ]
    },
    {
      href: '/audio',
      label: 'Audio Studio',
      icon: '🎙️'
    },
    {
      href: '/progress',
      label: 'Progress',
      icon: '📊'
    },
    {
      href: '/freecodecamp',
      label: 'Resources',
      icon: '🔗'
    }
  ];
  
  export let isOpen = true;
  export let onToggle: (() => void) | undefined = undefined;
  
  let expandedItems = $state<Set<string>>(new Set());
  
  function toggleExpand(href: string) {
    if (expandedItems.has(href)) {
      expandedItems.delete(href);
    } else {
      expandedItems.add(href);
    }
    expandedItems = new Set(expandedItems);
    appStore.playSound('click');
  }
  
  function isExpanded(href: string): boolean {
    return expandedItems.has(href);
  }
  
  function handleItemClick() {
    appStore.playSound('click');
    if (onToggle && window.innerWidth < 768) {
      onToggle();
    }
  }
</script>

<aside class="sidebar" class:collapsed={!isOpen} aria-label="Sidebar navigation">
  <nav class="sidebar-nav">
    {#each items as item}
      <div class="sidebar-item">
        {#if item.children}
          <button 
            class="sidebar-link parent"
            class:active={$page.url.pathname === item.href}
            onclick={() => toggleExpand(item.href)}
            aria-expanded={isExpanded(item.href)}
          >
            <span class="sidebar-icon" aria-hidden="true">{item.icon}</span>
            {#if isOpen}
              <span class="sidebar-label">{item.label}</span>
              <span class="expand-icon" aria-hidden="true">
                {isExpanded(item.href) ? '▾' : '▸'}
              </span>
            {/if}
          </button>
          
          {#if isExpanded(item.href) && isOpen}
            <div class="sidebar-children">
              {#each item.children as child}
                <a 
                  href={child.href}
                  class="sidebar-link child"
                  class:active={$page.url.pathname === child.href}
                  onclick={handleItemClick}
                >
                  <span class="sidebar-icon" aria-hidden="true">{child.icon}</span>
                  <span class="sidebar-label">{child.label}</span>
                </a>
              {/each}
            </div>
          {/if}
        {:else}
          <a 
            href={item.href}
            class="sidebar-link"
            class:active={$page.url.pathname === item.href}
            onclick={handleItemClick}
          >
            <span class="sidebar-icon" aria-hidden="true">{item.icon}</span>
            {#if isOpen}
              <span class="sidebar-label">{item.label}</span>
            {/if}
          </a>
        {/if}
      </div>
    {/each}
  </nav>
</aside>

<style>
  .sidebar {
    width: 250px;
    background: #1E293B;
    border-right: 1px solid #334155;
    transition: all 0.3s;
    overflow-y: auto;
    overflow-x: hidden;
    height: 100%;
    position: sticky;
    top: 64px;
  }
  
  .sidebar.collapsed {
    width: 60px;
  }
  
  .sidebar-nav {
    padding: 1rem 0;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }
  
  .sidebar-item {
    display: flex;
    flex-direction: column;
  }
  
  .sidebar-link {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem 1rem;
    text-decoration: none;
    color: #94A3B8;
    transition: all 0.2s;
    cursor: pointer;
    border: none;
    background: none;
    width: 100%;
    text-align: left;
    font-size: 0.95rem;
    font-weight: 500;
  }
  
  .sidebar-link:hover {
    background: #334155;
    color: #E2E8F0;
  }
  
  .sidebar-link.active {
    background: #4F46E5;
    color: white;
  }
  
  .sidebar-link.parent {
    font-weight: 600;
  }
  
  .sidebar-icon {
    font-size: 1.25rem;
    flex-shrink: 0;
    width: 1.5rem;
    text-align: center;
  }
  
  .sidebar-label {
    flex: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  .expand-icon {
    font-size: 0.75rem;
    transition: transform 0.2s;
  }
  
  .sidebar-children {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    padding-left: 0.5rem;
    animation: slideDown 0.2s ease;
  }
  
  .sidebar-link.child {
    padding-left: 2rem;
    font-size: 0.875rem;
  }
  
  .sidebar.collapsed .sidebar-link {
    justify-content: center;
    padding: 0.75rem;
  }
  
  .sidebar.collapsed .sidebar-label,
  .sidebar.collapsed .expand-icon {
    display: none;
  }
  
  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-5px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @media (max-width: 768px) {
    .sidebar {
      position: fixed;
      left: 0;
      top: 64px;
      bottom: 0;
      z-index: 900;
      transform: translateX(-100%);
    }
    
    .sidebar.collapsed {
      transform: translateX(0);
      width: 250px;
    }
  }
</style>