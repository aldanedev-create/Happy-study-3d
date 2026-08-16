<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import * as THREE from 'three';
  
  const seTopics = [
    { id: 'programming', name: 'Programming Fundamentals', icon: '💻', description: 'Core programming concepts', level: 'All Levels' },
    { id: 'html', name: 'HTML', icon: '🌐', description: 'Web page structure and markup', level: 'Beginner' },
    { id: 'css', name: 'CSS', icon: '🎨', description: 'Styling and layout design', level: 'Beginner' },
    { id: 'javascript', name: 'JavaScript', icon: '⚡', description: 'Interactive web development', level: 'Beginner-Intermediate' },
    { id: 'python', name: 'Python', icon: '🐍', description: 'General purpose programming', level: 'Beginner-Intermediate' },
    { id: 'typescript', name: 'TypeScript', icon: '📘', description: 'Typed JavaScript development', level: 'Intermediate' },
    { id: 'rust', name: 'Rust', icon: '🦀', description: 'Systems programming language', level: 'Intermediate-Advanced' },
    { id: 'algorithms', name: 'Algorithms', icon: '🧮', description: 'Problem-solving and efficiency', level: 'Intermediate' },
    { id: 'data-structures', name: 'Data Structures', icon: '🗂️', description: 'Organizing and storing data', level: 'Intermediate' },
    { id: 'git', name: 'Git & GitHub', icon: '📦', description: 'Version control and collaboration', level: 'Beginner-Intermediate' },
    { id: 'databases', name: 'Databases', icon: '🗄️', description: 'SQL and data management', level: 'Intermediate' },
    { id: 'apis', name: 'APIs', icon: '🔌', description: 'Application programming interfaces', level: 'Intermediate' },
    { id: 'testing', name: 'Testing', icon: '✅', description: 'Quality assurance and testing', level: 'Intermediate' },
    { id: 'debugging', name: 'Debugging', icon: '🐛', description: 'Finding and fixing bugs', level: 'All Levels' },
    { id: 'software-engineering', name: 'Software Engineering', icon: '🏗️', description: 'Building software systems', level: 'Intermediate' }
  ];
  
  // 3D Background
  let canvasElement: HTMLCanvasElement;
  let scene: THREE.Scene;
  let camera: THREE.PerspectiveCamera;
  let renderer: THREE.WebGLRenderer;
  let animationFrame: number;
  let floatingObjects: THREE.Mesh[] = [];
  
  onMount(() => {
    console.log('Software Engineering page loaded');
    init3D();
    animate3D();
  });
  
  onDestroy(() => {
    if (animationFrame) {
      cancelAnimationFrame(animationFrame);
    }
    if (renderer) {
      renderer.dispose();
    }
  });
  
  function init3D() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0F172A);
    
    camera = new THREE.PerspectiveCamera(
      75,
      canvasElement.clientWidth / canvasElement.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 8;
    
    renderer = new THREE.WebGLRenderer({ 
      canvas: canvasElement,
      antialias: true 
    });
    renderer.setSize(canvasElement.clientWidth, canvasElement.clientHeight);
    
    // Create floating geometric shapes
    const colors = [0x4F46E5, 0x7C3AED, 0x2563EB, 0x06B6D4, 0x10B981, 0xF59E0B];
    const geometries = [
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.SphereGeometry(0.6, 32, 32),
      new THREE.TorusGeometry(0.5, 0.2, 16, 32),
      new THREE.OctahedronGeometry(0.7),
      new THREE.TetrahedronGeometry(0.7),
      new THREE.IcosahedronGeometry(0.6)
    ];
    
    for (let i = 0; i < 15; i++) {
      const geometry = geometries[i % geometries.length];
      const material = new THREE.MeshStandardMaterial({
        color: colors[i % colors.length],
        roughness: 0.3,
        metalness: 0.6,
        transparent: true,
        opacity: 0.7
      });
      const mesh = new THREE.Mesh(geometry, material);
      
      mesh.position.x = (Math.random() - 0.5) * 12;
      mesh.position.y = (Math.random() - 0.5) * 8;
      mesh.position.z = (Math.random() - 0.5) * 4;
      mesh.userData.rotationSpeed = {
        x: (Math.random() - 0.5) * 0.02,
        y: (Math.random() - 0.5) * 0.02
      };
      mesh.userData.floatSpeed = 0.5 + Math.random();
      mesh.userData.floatAmplitude = 0.3 + Math.random() * 0.5;
      mesh.userData.initialY = mesh.position.y;
      
      scene.add(mesh);
      floatingObjects.push(mesh);
    }
    
    // Add lighting
    const pointLight1 = new THREE.PointLight(0x4F46E5, 2, 20);
    pointLight1.position.set(3, 3, 3);
    scene.add(pointLight1);
    
    const pointLight2 = new THREE.PointLight(0x7C3AED, 2, 20);
    pointLight2.position.set(-3, -2, 2);
    scene.add(pointLight2);
    
    const ambientLight = new THREE.AmbientLight(0x404060, 0.5);
    scene.add(ambientLight);
  }
  
  function animate3D() {
    animationFrame = requestAnimationFrame(animate3D);
    
    const time = Date.now() * 0.001;
    
    floatingObjects.forEach((obj) => {
      obj.rotation.x += obj.userData.rotationSpeed.x;
      obj.rotation.y += obj.userData.rotationSpeed.y;
      obj.position.y = obj.userData.initialY + Math.sin(time * obj.userData.floatSpeed) * obj.userData.floatAmplitude;
    });
    
    renderer.render(scene, camera);
  }
</script>

<svelte:head>
  <title>Software Engineering - Happy Study 3D</title>
  <meta name="description" content="Learn programming and software engineering with Happy Study 3D" />
</svelte:head>

<div class="se-container">
  <!-- 3D Background -->
  <div class="three-background">
    <canvas bind:this={canvasElement}></canvas>
  </div>
  
  <!-- Content Overlay -->
  <div class="content-overlay">
    <header class="page-header">
      <h1 class="page-title">Software Engineering</h1>
      <p class="page-description">
        Learn programming and software development from beginner to intermediate level
      </p>
      <a href="/freecodecamp" class="resource-link">
        View FreeCodeCamp Resources →
      </a>
    </header>
    
    <a class="exam-prep-link" href="/software-engineering/exam"><span>EXAM PREP</span><strong>Test your software-engineering foundation →</strong><small>6 focused questions with explanations</small></a>
    <div class="topics-grid">
      {#each seTopics as topic}
        <a 
          href="/study?subject=software-engineering&area=software-engineering"
          class="topic-card"
        >
          <div class="topic-icon">{topic.icon}</div>
          <h2 class="topic-name">{topic.name}</h2>
          <p class="topic-description">{topic.description}</p>
          <span class="level-badge">{topic.level}</span>
          <div class="topic-action">
            Start Learning →
          </div>
        </a>
      {/each}
    </div>
  </div>
</div>

<style>
  .se-container {
    position: relative;
    min-height: 100vh;
  }
  
  .three-background {
    position: fixed;
    inset: 0;
    z-index: 0;
  }
  
  .three-background canvas {
    width: 100%;
    height: 100%;
    display: block;
  }
  
  .content-overlay {
    position: relative;
    z-index: 10;
    padding: 2rem;
    max-width: 1200px;
    margin: 0 auto;
  }
  
  .page-header {
    text-align: center;
    margin-bottom: 2rem;
  }
  
  .page-title {
    font-size: 2.5rem;
    margin-bottom: 0.5rem;
    background: linear-gradient(135deg, #2563EB, #06B6D4);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  .page-description {
    color: #E2E8F0;
    font-size: 1.1rem;
    margin-bottom: 1rem;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  }
  
  .resource-link {
    color: #06B6D4;
    text-decoration: none;
    font-weight: 600;
    transition: all 0.2s;
  }
  
  .resource-link:hover {
    color: #22D3EE;
  }
  
  .topics-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1.5rem;
  }
  .exam-prep-link{display:grid;grid-template-columns:auto 1fr auto;gap:1rem;align-items:center;margin-bottom:1rem;padding:1rem 1.25rem;border-radius:16px;text-decoration:none;color:#e0e7ff;background:linear-gradient(100deg,rgba(79,70,229,.55),rgba(8,145,178,.32));border:1px solid rgba(129,140,248,.4);backdrop-filter:blur(10px)}.exam-prep-link span{font-size:.68rem;letter-spacing:.12em;font-weight:800;color:#c4b5fd}.exam-prep-link strong{font-size:1.05rem}.exam-prep-link small{color:#bfdbfe}@media(max-width:650px){.exam-prep-link{grid-template-columns:1fr;gap:.35rem}}
  
  .topic-card {
    background: rgba(30, 41, 59, 0.85);
    border: 1px solid #334155;
    border-radius: 1rem;
    padding: 2rem;
    cursor: pointer;
    transition: all 0.3s;
    position: relative;
    overflow: hidden;
    text-decoration: none;
    color: inherit;
    display: block;
    backdrop-filter: blur(10px);
  }
  
  .topic-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    border-color: #2563EB;
    background: rgba(30, 41, 59, 0.95);
  }
  
  .topic-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
  }
  
  .topic-name {
    margin-bottom: 0.5rem;
    color: #F1F5F9;
    font-size: 1.25rem;
  }
  
  .topic-description {
    color: #94A3B8;
    margin-bottom: 1rem;
    line-height: 1.5;
  }
  
  .level-badge {
    display: inline-block;
    padding: 0.25rem 0.75rem;
    background: #2563EB;
    color: white;
    border-radius: 9999px;
    font-size: 0.75rem;
    font-weight: 600;
    margin-bottom: 1rem;
  }
  
  .topic-action {
    color: #2563EB;
    font-weight: 600;
    transition: all 0.2s;
  }
  
  .topic-card:hover .topic-action {
    transform: translateX(5px);
  }
</style>
