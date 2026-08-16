import * as THREE from 'three';
import { browser } from '$app/environment';

export class ThreeScene {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private objects: THREE.Object3D[] = [];
  private raycaster: THREE.Raycaster;
  private mouse: THREE.Vector2;
  private hoveredObject: THREE.Object3D | null = null;
  private selectedObject: THREE.Object3D | null = null;
  
  constructor(
    private container: HTMLElement,
    private onObjectClick?: (object: THREE.Object3D) => void,
    private onObjectHover?: (object: THREE.Object3D | null) => void
  ) {
    if (!browser) {
      throw new Error('ThreeScene can only be created in browser environment');
    }
    
    // Initialize scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0F172A);
    this.scene.fog = new THREE.Fog(0x0F172A, 10, 50);
    
    // Initialize camera
    this.camera = new THREE.PerspectiveCamera(
      75,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    this.camera.position.set(0, 2, 10);
    this.camera.lookAt(0, 0, 0);
    
    // Initialize renderer
    this.renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true 
    });
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.0;
    
    container.appendChild(this.renderer.domElement);
    
    // Initialize raycaster for interaction
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    
    // Add event listeners
    this.setupEventListeners();
    
  }
  
  private setupEventListeners(): void {
    // Mouse move for hover effects
    this.container.addEventListener('mousemove', this.handleMouseMove);
    
    // Click for selection
    this.container.addEventListener('click', this.handleClick);
    
    // Touch events for mobile
    this.container.addEventListener('touchstart', this.handleTouchStart);
    
    // Resize handler
    window.addEventListener('resize', this.handleResize);
  }
  
  private handleMouseMove = (event: MouseEvent): void => {
    const rect = this.container.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    
    this.updateHover();
  };
  
  private handleClick = (event: MouseEvent): void => {
    const rect = this.container.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    
    this.updateSelection();
  };
  
  private handleTouchStart = (event: TouchEvent): void => {
    const touch = event.touches[0];
    if (event.touches.length === 1 && touch) {
      const rect = this.container.getBoundingClientRect();
      this.mouse.x = ((touch.clientX - rect.left) / rect.width) * 2 - 1;
      this.mouse.y = -((touch.clientY - rect.top) / rect.height) * 2 + 1;
      
      this.updateSelection();
    }
  };
  
  private handleResize = (): void => {
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  };
  
  private updateHover(): void {
    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.objects, true);
    
    let newHoveredObject: THREE.Object3D | null = null;
    const hit = intersects[0];
    
    if (hit) {
      newHoveredObject = this.findInteractiveParent(hit.object);
    }
    
    if (newHoveredObject !== this.hoveredObject) {
      // Remove hover from old object
      if (this.hoveredObject) {
        this.setObjectHover(this.hoveredObject, false);
      }
      
      // Add hover to new object
      if (newHoveredObject) {
        this.setObjectHover(newHoveredObject, true);
      }
      
      this.hoveredObject = newHoveredObject;
      
      if (this.onObjectHover) {
        this.onObjectHover(newHoveredObject);
      }
    }
  }
  
  private updateSelection(): void {
    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.objects, true);
    const hit = intersects[0];
    
    if (hit) {
      const selectedObject = this.findInteractiveParent(hit.object);
      
      if (selectedObject) {
        // Deselect previous
        if (this.selectedObject && this.selectedObject !== selectedObject) {
          this.setObjectSelected(this.selectedObject, false);
        }
        
        this.selectedObject = selectedObject;
        this.setObjectSelected(selectedObject, true);
        
        if (this.onObjectClick) {
          this.onObjectClick(selectedObject);
        }
      }
    } else {
      // Deselect if clicking empty space
      if (this.selectedObject) {
        this.setObjectSelected(this.selectedObject, false);
        this.selectedObject = null;
      }
    }
  }
  
  private findInteractiveParent(object: THREE.Object3D): THREE.Object3D | null {
    let current: THREE.Object3D | null = object;
    
    while (current) {
      if (current.userData.isInteractive) {
        return current;
      }
      current = current.parent;
    }
    
    return null;
  }
  
  private setObjectHover(object: THREE.Object3D, isHovered: boolean): void {
    object.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        const material = child.material as THREE.MeshStandardMaterial;
        if (material && material.emissive) {
          if (isHovered) {
            material.emissive.setHex(0x333333);
          } else {
            material.emissive.setHex(0x000000);
          }
        }
      }
    });
    
    // Scale effect
    if (isHovered) {
      object.scale.set(1.1, 1.1, 1.1);
    } else {
      object.scale.set(1, 1, 1);
    }
  }
  
  private setObjectSelected(object: THREE.Object3D, isSelected: boolean): void {
    object.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        const material = child.material as THREE.MeshStandardMaterial;
        if (material && material.emissive) {
          if (isSelected) {
            material.emissive.setHex(0x4F46E5);
          } else {
            material.emissive.setHex(0x000000);
          }
        }
      }
    });
  }
  
  // Public methods
  
  addObject(object: THREE.Object3D, animationType?: 'float' | 'rotate' | 'bounce'): void {
    if (animationType) {
      object.userData.animationType = animationType;
    }
    
    if (object.userData.isInteractive === undefined) object.userData.isInteractive = true;
    
    this.scene.add(object);
    this.objects.push(object);
  }
  
  removeObject(object: THREE.Object3D): void {
    this.scene.remove(object);
    const index = this.objects.indexOf(object);
    if (index > -1) {
      this.objects.splice(index, 1);
    }
  }
  
  clearObjects(): void {
    this.objects.forEach((object) => {
      this.scene.remove(object);
    });
    this.objects = [];
    this.hoveredObject = null;
    this.selectedObject = null;
  }
  
  setCameraPosition(x: number, y: number, z: number): void {
    this.camera.position.set(x, y, z);
    this.camera.lookAt(0, 0, 0);
  }
  
  setBackground(color: string): void {
    this.scene.background = new THREE.Color(color);
  }
  
  getScene(): THREE.Scene {
    return this.scene;
  }
  
  getCamera(): THREE.PerspectiveCamera {
    return this.camera;
  }
  
  getRenderer(): THREE.WebGLRenderer {
    return this.renderer;
  }
  
  dispose(): void {
    // Remove event listeners
    this.container.removeEventListener('mousemove', this.handleMouseMove);
    this.container.removeEventListener('click', this.handleClick);
    this.container.removeEventListener('touchstart', this.handleTouchStart);
    window.removeEventListener('resize', this.handleResize);
    
    // Dispose objects
    this.clearObjects();
    
    // Dispose renderer
    this.renderer.dispose();
    
    // Remove canvas
    if (this.renderer.domElement.parentElement === this.container) {
      this.container.removeChild(this.renderer.domElement);
    }
  }
}
