<script lang="ts">
  import { page } from '$app/stores';
  const nav = [
    ['/', 'Home', '⌂'], ['/cxc', 'CXC', '◈'], ['/cape', 'CAPE', '✦'], ['/software-engineering', 'Code', '⌘'],
    ['/audio', 'Audio', '◉'], ['/camera', 'Camera', '◌'], ['/studio', 'Screen Studio', '▣'], ['/progress', 'Progress', '↗']
  ];
  let menuOpen = $state(false);
</script>

<svelte:head><title>Happy Study 3D</title><meta name="description" content="CXC, CAPE, and software-engineering study workspace." /></svelte:head>

<div class="desktop-app">
  <header class="titlebar"><a href="/" class="brand"><span>H</span><strong>Happy Study</strong><small>LEARNING WORKSPACE</small></a><div class="titlebar-actions"><span class="sync">● Saved locally</span><a href="/settings" aria-label="Open settings">⚙</a><button onclick={() => menuOpen = !menuOpen} aria-label="Open navigation">☰</button></div></header>
  <aside class:open={menuOpen} class="rail"><nav>{#each nav as [href,label,icon]}<a href={href} class:active={$page.url.pathname === href} title={label} onclick={() => menuOpen = false}><span>{icon}</span><b>{label}</b></a>{/each}</nav><div class="rail-bottom"><a href="/freecodecamp" title="FreeCodeCamp">↗<b>Continue learning</b></a><a href="/settings" class:active={$page.url.pathname === '/settings'} title="Settings">⚙<b>Settings</b></a></div></aside>
  <main class="workspace"><slot /></main>
</div>

<style>
  :global(*){box-sizing:border-box}:global(html){background:#070b18}:global(body){margin:0;font-family:Inter,ui-sans-serif,system-ui,sans-serif;color:#e5e7eb;background:radial-gradient(circle at 70% -15%,#1d2457 0,transparent 38rem),#070b18;line-height:1.5}:global(button),:global(input){font:inherit}.desktop-app{min-height:100vh;padding:40px 0 0 76px}.titlebar{height:40px;position:fixed;inset:0 0 auto;z-index:30;background:rgba(8,13,30,.88);border-bottom:1px solid rgba(148,163,184,.15);backdrop-filter:blur(18px);display:flex;align-items:center;justify-content:space-between;padding:0 .75rem 0 1rem}.brand{color:#f8fafc;text-decoration:none;display:flex;align-items:center;gap:.5rem}.brand>span{display:grid;place-content:center;width:22px;aspect-ratio:1;border-radius:7px;background:linear-gradient(135deg,#8b5cf6,#2563eb);font-weight:900;font-size:.75rem}.brand strong{font-size:.86rem}.brand small{color:#64748b;font-size:.58rem;letter-spacing:.12em;margin-left:.25rem}.titlebar-actions{display:flex;align-items:center;gap:.45rem}.titlebar-actions a,.titlebar-actions button{display:grid;place-content:center;border:0;background:transparent;color:#cbd5e1;width:29px;height:28px;border-radius:6px;text-decoration:none;cursor:pointer}.titlebar-actions a:hover,.titlebar-actions button:hover{background:rgba(148,163,184,.13)}.sync{font-size:.68rem;color:#94a3b8;margin-right:.35rem}.sync::first-letter{color:#34d399}.rail{position:fixed;left:0;top:40px;bottom:0;width:76px;z-index:20;border-right:1px solid rgba(148,163,184,.13);background:rgba(9,14,31,.8);backdrop-filter:blur(14px);display:flex;flex-direction:column;justify-content:space-between;padding:.75rem .55rem}.rail nav,.rail-bottom{display:grid;gap:.38rem}.rail a{color:#94a3b8;display:grid;place-items:center;gap:.2rem;padding:.55rem .25rem;text-decoration:none;border-radius:10px;font-size:1.1rem}.rail a b{font-size:.58rem;font-weight:650;white-space:nowrap}.rail a:hover{color:#f8fafc;background:rgba(148,163,184,.11)}.rail a.active{color:#fff;background:linear-gradient(145deg,#5b21b6,#2563eb);box-shadow:0 7px 16px rgba(37,99,235,.25)}.workspace{width:100%;max-width:1560px;margin:0 auto;padding:clamp(1rem,3vw,2rem);min-height:calc(100vh - 40px)}@media(max-width:760px){.desktop-app{padding-left:0}.rail{transform:translateX(-100%);transition:.2s;width:220px;padding:.75rem}.rail.open{transform:translateX(0);box-shadow:20px 0 40px rgba(0,0,0,.4)}.rail a{grid-template-columns:26px 1fr;justify-items:start}.rail a b{font-size:.78rem}.workspace{padding:1rem}.sync,.brand small{display:none}}
  .titlebar-actions button{display:none}
  @media(max-width:760px){.titlebar-actions button{display:grid}}
</style>
