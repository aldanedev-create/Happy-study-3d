<script lang="ts">
  import StudyWorld from '$three/StudyWorld.svelte';
  const cxcSubjects = [
    { id: 'mathematics', name: 'Mathematics', icon: '📐', description: 'Algebra, Geometry, Statistics' },
    { id: 'english-a', name: 'English A', icon: '📖', description: 'Comprehension, Writing, Language' },
    { id: 'english-b', name: 'English B', icon: '📚', description: 'Literature, Poetry, Drama' },
    { id: 'pob', name: 'Principles of Business', icon: '💼', description: 'Business, Marketing, Finance' },
    { id: 'poa', name: 'Principles of Accounts', icon: '📊', description: 'Accounting, Ledgers, Statements' },
    { id: 'social-studies', name: 'Social Studies', icon: '🌍', description: 'Society, Government, Culture' },
    { id: 'integrated-science', name: 'Integrated Science', icon: '🔬', description: 'Physics, Chemistry, Biology' },
    { id: 'hsb', name: 'Human and Social Biology', icon: '🧬', description: 'Body Systems, Health, Disease' },
    { id: 'information-technology', name: 'Information Technology', icon: '💻', description: 'Hardware, Software, Networks' },
    { id: 'agricultural-science', name: 'Agricultural Science', icon: '🌾', description: 'Crops, Livestock, Soil' },
    { id: 'biology', name: 'Biology', icon: '🦠', description: 'Cells, Genetics, Ecology' },
    { id: 'chemistry', name: 'Chemistry', icon: '⚗️', description: 'Matter, Reactions, Organic' },
    { id: 'physics', name: 'Physics', icon: '⚡', description: 'Motion, Energy, Waves' },
    { id: 'spanish', name: 'Spanish', icon: '🇪🇸', description: 'Vocabulary, Grammar, Communication' },
    { id: 'office-administration', name: 'Office Administration', icon: '📋', description: 'Procedures, Communication, Records' }
  ];
</script>

<svelte:head>
  <title>CXC/CSEC Subjects - Happy Study 3D</title>
  <meta name="description" content="Study CXC/CSEC subjects with interactive 3D learning environment" />
</svelte:head>

<div class="cxc-container">
  <header class="page-header">
    <div class="world"><StudyWorld sceneType="cxc" /></div>
    <div class="header-copy"><p class="eyebrow">CXC / CSEC EXAM PREP</p><h1 class="page-title">Build your pass.<br /><em>Then go for 100%.</em></h1><p class="page-description">Start with the high-value concepts that help you secure marks, then use practice questions and review to push for your best grade.</p><div class="header-pills"><span>15 subject pathways</span><span>Must-know revision</span><span>Practice at your pace</span></div></div>
  </header>
  
  <div class="subjects-grid">
    {#each cxcSubjects as subject}
      <a 
        href={`/study?subject=${subject.id}&area=cxc`}
        class="subject-card"
      >
        <div class="subject-icon">{subject.icon}</div>
        <h2 class="subject-name">{subject.name}</h2>
        <p class="subject-description">{subject.description}</p>
        <div class="subject-action">
          Start Learning →
        </div>
      </a>
    {/each}
  </div>
</div>

<style>
  .cxc-container {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    padding: 2rem;
    max-width: 1200px;
    margin: 0 auto;
  }
  
  .page-header {
    position:relative; min-height:300px; overflow:hidden; border-radius:28px; margin-bottom:2rem; border:1px solid rgba(167,139,250,.28); background:#0f172a; display:flex; align-items:center;
  }
  .world{position:absolute;inset:0;opacity:.72}.world :global(.study-world){min-height:100%;border-radius:0}.header-copy{position:relative;z-index:2;padding:clamp(2rem,6vw,4.5rem);max-width:720px;background:linear-gradient(90deg,rgba(2,6,23,.9),rgba(2,6,23,.5),transparent)}.eyebrow{font-size:.72rem;letter-spacing:.14em;font-weight:800;color:#c4b5fd;margin:0 0 .7rem}.header-pills{display:flex;gap:.5rem;flex-wrap:wrap;margin-top:1.3rem}.header-pills span{padding:.4rem .7rem;border:1px solid rgba(226,232,240,.2);background:rgba(15,23,42,.45);backdrop-filter:blur(8px);border-radius:999px;font-size:.75rem;color:#e2e8f0}
  
  .page-title {
    font-size: clamp(2.5rem,5vw,4.3rem);
    margin-bottom: 0.5rem;
    background: linear-gradient(135deg, #4F46E5, #7C3AED);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  .page-description {
    color: #94A3B8;
    font-size: 1.1rem;
  }
  
  .subjects-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1rem;
  }
  
  .subject-card {
    background: linear-gradient(145deg,rgba(30,41,59,.86),rgba(15,23,42,.92));
    border: 1px solid rgba(148,163,184,.2);
    border-radius: 1.25rem;
    padding: 2rem;
    cursor: pointer;
    transition: all 0.3s;
    position: relative;
    overflow: hidden;
    text-decoration: none;
    color: inherit;
    display: block;
  }
  
  .subject-card:hover {
    transform: translateY(-7px) rotateX(2deg);
    box-shadow: 0 22px 42px rgba(2,6,23,.4);
    border-color: #a78bfa;
  }
  
  .subject-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
  }
  
  .subject-name {
    margin-bottom: 0.5rem;
    color: #F1F5F9;
    font-size: 1.25rem;
  }
  
  .subject-description {
    color: #94A3B8;
    margin-bottom: 1.5rem;
    line-height: 1.5;
  }
  
  .subject-action {
    color: #c4b5fd;
    font-weight: 600;
    transition: all 0.2s;
  }
  .page-title em{font-family:Georgia,serif;font-weight:400;color:#c4b5fd}
  
  .subject-card:hover .subject-action {
    transform: translateX(5px);
  }
</style>
