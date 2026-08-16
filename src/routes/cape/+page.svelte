<script lang="ts">
  import StudyWorld from '$three/StudyWorld.svelte';
  
  const capeSubjects = [
    { id: 'communication-studies', name: 'Communication Studies', icon: '💬', description: 'Language, Communication, Analysis', unit: 'Single Unit' },
    { id: 'caribbean-studies', name: 'Caribbean Studies', icon: '🏝️', description: 'Society, Culture, Development', unit: 'Single Unit' },
    { id: 'pure-mathematics', name: 'Pure Mathematics', icon: '📐', description: 'Algebra, Calculus, Trigonometry', unit: 'Units 1 & 2' },
    { id: 'biology', name: 'Biology', icon: '🧬', description: 'Cell Biology, Genetics, Ecology', unit: 'Units 1 & 2' },
    { id: 'chemistry', name: 'Chemistry', icon: '⚗️', description: 'Organic, Inorganic, Physical', unit: 'Units 1 & 2' },
    { id: 'physics', name: 'Physics', icon: '⚡', description: 'Mechanics, Waves, Electricity', unit: 'Units 1 & 2' },
    { id: 'management-of-business', name: 'Management of Business', icon: '💼', description: 'Management, Marketing, Strategy', unit: 'Units 1 & 2' },
    { id: 'accounting', name: 'Accounting', icon: '📊', description: 'Financial, Cost, Management', unit: 'Units 1 & 2' },
    { id: 'economics', name: 'Economics', icon: '📈', description: 'Micro, Macro, Development', unit: 'Units 1 & 2' },
    { id: 'sociology', name: 'Sociology', icon: '👥', description: 'Society, Culture, Institutions', unit: 'Units 1 & 2' },
    { id: 'law', name: 'Law', icon: '⚖️', description: 'Contract, Tort, Criminal', unit: 'Units 1 & 2' },
    { id: 'computer-science', name: 'Computer Science', icon: '💻', description: 'Programming, Data, Systems', unit: 'Units 1 & 2' }
  ];
  
</script>

<svelte:head>
  <title>CAPE Subjects - Happy Study 3D</title>
  <meta name="description" content="Study CAPE subjects with interactive 3D learning environment" />
</svelte:head>

<div class="cape-container">
  <header class="page-header"><div class="world"><StudyWorld sceneType="cape" /></div><div class="header-copy"><p class="eyebrow">CAPE EXAM PREP</p><h1 class="page-title">Study with depth.<br /><em>Answer with confidence.</em></h1><p class="page-description">Use concise revision to secure your foundation, then build the analysis and application skills that make top answers stand out.</p><div class="header-pills"><span>12 advanced subjects</span><span>Unit-ready topics</span><span>Exam-focused practice</span></div></div></header>
  
  <div class="subjects-grid">
    {#each capeSubjects as subject}
      <a 
        href={`/study?subject=${subject.id}&area=cape`}
        class="subject-card"
      >
        <div class="subject-icon">{subject.icon}</div>
        <h2 class="subject-name">{subject.name}</h2>
        <p class="subject-description">{subject.description}</p>
        <span class="unit-badge">{subject.unit}</span>
        <div class="subject-action">
          Start Learning →
        </div>
      </a>
    {/each}
  </div>
</div>

<style>
  .cape-container {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    padding: 2rem;
    max-width: 1200px;
    margin: 0 auto;
  }
  
  .page-header {
    position:relative; min-height:300px; overflow:hidden; border-radius:28px; margin-bottom:2rem; border:1px solid rgba(244,114,182,.28); background:#0f172a; display:flex; align-items:center;
  }
  .world{position:absolute;inset:0;opacity:.72}.world :global(.study-world){min-height:100%;border-radius:0}.header-copy{position:relative;z-index:2;padding:clamp(2rem,6vw,4.5rem);max-width:720px;background:linear-gradient(90deg,rgba(2,6,23,.9),rgba(2,6,23,.5),transparent)}.eyebrow{font-size:.72rem;letter-spacing:.14em;font-weight:800;color:#f0abfc;margin:0 0 .7rem}.header-pills{display:flex;gap:.5rem;flex-wrap:wrap;margin-top:1.3rem}.header-pills span{padding:.4rem .7rem;border:1px solid rgba(226,232,240,.2);background:rgba(15,23,42,.45);backdrop-filter:blur(8px);border-radius:999px;font-size:.75rem;color:#e2e8f0}
  
  .page-title {
    font-size: clamp(2.5rem,5vw,4.3rem);
    margin-bottom: 0.5rem;
    background: linear-gradient(135deg, #7C3AED, #EC4899);
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
    border-color: #f0abfc;
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
    margin-bottom: 1rem;
    line-height: 1.5;
  }
  
  .unit-badge {
    display: inline-block;
    padding: 0.25rem 0.75rem;
    background: #7C3AED;
    color: white;
    border-radius: 9999px;
    font-size: 0.75rem;
    font-weight: 600;
    margin-bottom: 1rem;
  }
  
  .subject-action {
    color: #f0abfc;
    font-weight: 600;
    transition: all 0.2s;
  }
  .page-title em{font-family:Georgia,serif;font-weight:400;color:#f0abfc}
  
  .subject-card:hover .subject-action {
    transform: translateX(5px);
  }
</style>
