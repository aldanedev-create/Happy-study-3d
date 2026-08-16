<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import * as THREE from 'three';
  import { ThreeScene } from './ThreeScene';
  import { CameraController } from './Camera';
  import { LightingSetup } from './Lighting';
  import { AnimationManager } from './animations';
  import { 
    createBox, 
    createSphere, 
    createCylinder, 
    createCone, 
    createTorus,
    createTextSprite 
  } from './objects';
  import { appStore } from '$stores/app.svelte';
  import { settingsStore } from '$stores/settings.svelte';
  
  interface Props {
    sceneType?: 'home' | 'cxc' | 'cape' | 'software-engineering' | 'study';
    interactive?: boolean;
    onObjectClick?: (object: THREE.Object3D) => void;
  }
  
  let {
    sceneType = 'home',
    interactive = true,
    onObjectClick = undefined
  }: Props = $props();
  
  let containerElement: HTMLDivElement;
  let threeScene: ThreeScene | null = null;
  let cameraController: CameraController | null = null;
  let lightingSetup: LightingSetup | null = null;
  let animationManager: AnimationManager | null = null;
  
  let isLoading = $state(true);
  let error = $state<string | null>(null);
  
  let animationFrame: number | null = null;
  let clock: THREE.Clock | null = null;
  
  onMount(() => {
    initializeScene();
  });
  
  onDestroy(() => {
    cleanup();
  });
  
  function initializeScene(): void {
    if (!containerElement || !settingsStore.threeDEnabled) {
      isLoading = false;
      return;
    }
    
    try {
      // Initialize Three.js scene
      threeScene = new ThreeScene(
        containerElement,
        handleObjectClick,
        handleObjectHover
      );
      
      // Initialize controllers
      cameraController = new CameraController(threeScene.getCamera());
      lightingSetup = new LightingSetup(threeScene.getScene());
      animationManager = new AnimationManager();
      clock = new THREE.Clock();
      
      // Create scene based on type
      createScene();
      
      isLoading = false;
      
      // Start animation loop
      animate();
    } catch (err) {
      error = err instanceof Error ? err.message : 'Failed to initialize 3D scene';
      isLoading = false;
      console.error('Failed to initialize 3D scene:', err);
    }
  }
  
  function createScene(): void {
    if (!threeScene || !lightingSetup || !animationManager) return;
    
    const scene = threeScene.getScene();
    
    // Set up lighting
    if (sceneType === 'study') {
      lightingSetup.createStudyRoomLighting();
    } else {
      lightingSetup.createDefaultLighting();
    }
    
    // Create floor
    const floor = createBox(20, 0.2, 20, 0x1E293B);
    floor.position.y = -1;
    floor.receiveShadow = true;
    floor.userData.isInteractive = false;
    scene.add(floor);
    
    // Create objects based on scene type
    switch (sceneType) {
      case 'home':
        createHomeScene();
        break;
      case 'cxc':
        createCXCScene();
        break;
      case 'cape':
        createCAPEScene();
        break;
      case 'software-engineering':
        createSEScene();
        break;
      case 'study':
        createStudyScene();
        break;
    }
  }
  
  function createHomeScene(): void {
    if (!threeScene) return;
    
    // Create subject category objects
    const categories = [
      { name: 'CXC', color: 0x4F46E5, position: new THREE.Vector3(-4, 1, -2) },
      { name: 'CAPE', color: 0x7C3AED, position: new THREE.Vector3(0, 1, -2) },
      { name: 'Programming', color: 0x2563EB, position: new THREE.Vector3(4, 1, -2) }
    ];
    
    categories.forEach((category) => {
      const box = createBox(2, 2, 0.5, category.color);
      box.position.copy(category.position);
      box.userData = {
        isInteractive: true,
        label: category.name,
        type: 'category'
      };
      
      threeScene.addObject(box, 'float');
      
      // Add label
      const label = createTextSprite(category.name, {
        fontSize: 32,
        color: '#FFFFFF'
      });
      label.position.y = 1.8;
      label.userData.isInteractive = false;
      box.add(label);
    });
  }
  
  function createCXCScene(): void {
    if (!threeScene) return;
    
    // Create subject objects for CXC
    const subjects = [
      { name: 'Mathematics', color: 0x4F46E5, shape: 'box' },
      { name: 'English A', color: 0x3B82F6, shape: 'sphere' },
      { name: 'Biology', color: 0x10B981, shape: 'cylinder' },
      { name: 'Physics', color: 0xF59E0B, shape: 'cone' }
    ];
    
    subjects.forEach((subject, index) => {
      let mesh: THREE.Mesh;
      
      switch (subject.shape) {
        case 'sphere':
          mesh = createSphere(1, subject.color);
          break;
        case 'cylinder':
          mesh = createCylinder(1, 1, 2, subject.color);
          break;
        case 'cone':
          mesh = createCone(1, 2, subject.color);
          break;
        default:
          mesh = createBox(1.5, 1.5, 1.5, subject.color);
      }
      
      const angle = (index / subjects.length) * Math.PI * 2;
      mesh.position.set(
        Math.cos(angle) * 3,
        1,
        Math.sin(angle) * 3 - 2
      );
      mesh.userData = {
        isInteractive: true,
        label: subject.name,
        type: 'subject'
      };
      
      threeScene.addObject(mesh, 'rotate');
      
      // Add label
      const label = createTextSprite(subject.name, {
        fontSize: 24,
        color: '#FFFFFF'
      });
      label.position.y = 1.5;
      label.userData.isInteractive = false;
      mesh.add(label);
    });
  }
  
  function createCAPEScene(): void {
    if (!threeScene) return;
    
    // Create CAPE subject objects
    const subjects = [
      { name: 'Communication', color: 0x7C3AED, shape: 'box' },
      { name: 'Pure Math', color: 0x4F46E5, shape: 'sphere' },
      { name: 'Computer Sci', color: 0x2563EB, shape: 'cylinder' },
      { name: 'Economics', color: 0x10B981, shape: 'cone' }
    ];
    
    subjects.forEach((subject, index) => {
      let mesh: THREE.Mesh;
      
      switch (subject.shape) {
        case 'sphere':
          mesh = createSphere(1, subject.color);
          break;
        case 'cylinder':
          mesh = createCylinder(1, 1, 2, subject.color);
          break;
        case 'cone':
          mesh = createCone(1, 2, subject.color);
          break;
        default:
          mesh = createBox(1.5, 1.5, 1.5, subject.color);
      }
      
      const angle = (index / subjects.length) * Math.PI * 2;
      mesh.position.set(
        Math.cos(angle) * 3,
        1,
        Math.sin(angle) * 3 - 2
      );
      mesh.userData = {
        isInteractive: true,
        label: subject.name,
        type: 'subject'
      };
      
      threeScene.addObject(mesh, 'bounce');
      
      // Add label
      const label = createTextSprite(subject.name, {
        fontSize: 24,
        color: '#FFFFFF'
      });
      label.position.y = 1.5;
      label.userData.isInteractive = false;
      mesh.add(label);
    });
  }
  
  function createSEScene(): void {
    if (!threeScene) return;
    
    // Create programming language objects
    const languages = [
      { name: 'JavaScript', color: 0xF7DF1E, shape: 'box' },
      { name: 'Python', color: 0x3776AB, shape: 'sphere' },
      { name: 'TypeScript', color: 0x3178C6, shape: 'cylinder' },
      { name: 'Rust', color: 0xDEA584, shape: 'cone' }
    ];
    
    languages.forEach((language, index) => {
      let mesh: THREE.Mesh;
      
      switch (language.shape) {
        case 'sphere':
          mesh = createSphere(1, language.color);
          break;
        case 'cylinder':
          mesh = createCylinder(1, 1, 2, language.color);
          break;
        case 'cone':
          mesh = createCone(1, 2, language.color);
          break;
        default:
          mesh = createBox(1.5, 1.5, 1.5, language.color);
      }
      
      const angle = (index / languages.length) * Math.PI * 2;
      mesh.position.set(
        Math.cos(angle) * 3,
        1,
        Math.sin(angle) * 3 - 2
      );
      mesh.userData = {
        isInteractive: true,
        label: language.name,
        type: 'language'
      };
      
      threeScene.addObject(mesh, 'spin');
      
      // Add label
      const label = createTextSprite(language.name, {
        fontSize: 24,
        color: '#000000'
      });
      label.position.y = 1.5;
      label.userData.isInteractive = false;
      mesh.add(label);
    });
  }
  
  function createStudyScene(): void {
    if (!threeScene) return;
    
    // Create a calm study environment
    const desk = createBox(4, 0.2, 2, 0x8B4513);
    desk.position.set(0, 0, -1);
    desk.userData = { isInteractive: false };
    threeScene.addObject(desk);
    
    // Add a book
    const book = createBox(1.5, 0.3, 1, 0x4F46E5);
    book.position.set(0, 0.3, -1);
    book.userData = {
      isInteractive: true,
      label: 'Study Material',
      type: 'book'
    };
    threeScene.addObject(book, 'float');
    
    // Add a lamp
    const lampBase = createCylinder(0.2, 0.3, 0.5, 0xDAA520);
    lampBase.position.set(2, 0.25, -1);
    lampBase.userData = { isInteractive: false };
    threeScene.addObject(lampBase);
    
    const lampShade = createCone(0.5, 0.8, 0xDAA520);
    lampShade.position.set(2, 0.9, -1);
    lampShade.userData = { isInteractive: false };
    threeScene.addObject(lampShade);
    
    // Add a plant
    const pot = createCylinder(0.3, 0.2, 0.5, 0x8B4513);
    pot.position.set(-2, 0.25, -1);
    pot.userData = { isInteractive: false };
    threeScene.addObject(pot);
    
    const plant = createSphere(0.4, 0x10B981);
    plant.position.set(-2, 0.8, -1);
    plant.userData = { isInteractive: false };
    threeScene.addObject(plant, 'float');
  }
  
  function handleObjectClick(object: THREE.Object3D): void {
    if (!interactive) return;
    
    appStore.playSound('click');
    
    if (onObjectClick) {
      onObjectClick(object);
    }
    
    // Default behavior based on object type
    const type = object.userData.type;
    const label = object.userData.label;
    
    if (type === 'category' && label) {
      // Navigate to category
      const route = label.toLowerCase() === 'cxc' ? '/cxc' : 
                    label.toLowerCase() === 'cape' ? '/cape' : 
                    '/software-engineering';
      window.location.href = route;
    }
  }
  
  function handleObjectHover(object: THREE.Object3D | null): void {
    if (!interactive) return;
    
    if (object && object.userData.label) {
      containerElement.style.cursor = 'pointer';
    } else {
      containerElement.style.cursor = 'default';
    }
  }
  
  function animate(): void {
    if (!threeScene || !animationManager || !clock) return;
    
    const delta = clock.getDelta();
    const elapsedTime = clock.getElapsedTime();
    
    // Update animations
    animationManager.update(delta, elapsedTime);
    
    // Update camera
    if (cameraController) {
      cameraController.update(delta);
    }
    
    // Render
    threeScene.getRenderer().render(
      threeScene.getScene(),
      threeScene.getCamera()
    );
    
    animationFrame = requestAnimationFrame(animate);
  }
  
  function cleanup(): void {
    if (animationFrame !== null) {
      cancelAnimationFrame(animationFrame);
    }
    
    if (threeScene) {
      threeScene.dispose();
      threeScene = null;
    }
    
    cameraController = null;
    lightingSetup = null;
    animationManager = null;
    clock = null;
  }
</script>

<div class="study-world" bind:this={containerElement}>
  {#if isLoading}
    <div class="loading-overlay">
      <div class="loading-spinner"></div>
      <p class="loading-text">Loading 3D Scene...</p>
    </div>
  {/if}
  
  {#if error}
    <div class="error-overlay">
      <p class="error-text">Failed to load 3D scene</p>
      <button class="retry-btn" onclick={() => {
        error = null;
        isLoading = true;
        initializeScene();
      }}>
        Retry
      </button>
    </div>
  {/if}
  
  {#if !settingsStore.threeDEnabled}
    <div class="disabled-overlay">
      <p class="disabled-text">3D interface is disabled</p>
      <p class="disabled-subtext">Enable it in settings for interactive experience</p>
    </div>
  {/if}
</div>

<style>
  .study-world {
    position: relative;
    width: 100%;
    height: 100%;
    min-height: 400px;
    background: #0F172A;
    border-radius: 1rem;
    overflow: hidden;
  }
  
  .study-world :global(canvas) {
    display: block;
    width: 100%;
    height: 100%;
  }
  
  .loading-overlay,
  .error-overlay,
  .disabled-overlay {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    background: rgba(15, 23, 42, 0.9);
    z-index: 10;
  }
  
  .loading-spinner {
    width: 3rem;
    height: 3rem;
    border: 3px solid #334155;
    border-top-color: #4F46E5;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
  
  .loading-text,
  .error-text,
  .disabled-text {
    color: #E2E8F0;
    font-size: 1.1rem;
    margin: 0;
  }
  
  .disabled-subtext {
    color: #94A3B8;
    font-size: 0.9rem;
    margin: 0;
  }
  
  .retry-btn {
    padding: 0.5rem 1rem;
    background: #4F46E5;
    color: white;
    border: none;
    border-radius: 0.5rem;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.2s;
  }
  
  .retry-btn:hover {
    background: #4338CA;
  }
  
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
</style>