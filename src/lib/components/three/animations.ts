import * as THREE from 'three';

export type AnimationType = 'float' | 'rotate' | 'bounce' | 'spin' | 'pulse' | 'orbit';

export interface AnimationConfig {
  type: AnimationType;
  speed?: number;
  amplitude?: number;
  duration?: number;
  delay?: number;
  loop?: boolean;
}

export class AnimationManager {
  private animations: Map<THREE.Object3D, AnimationConfig[]> = new Map();
  private animationTimes: Map<THREE.Object3D, number> = new Map();
  
  addAnimation(object: THREE.Object3D, config: AnimationConfig): void {
    const existing = this.animations.get(object) || [];
    existing.push(config);
    this.animations.set(object, existing);
    
    if (!this.animationTimes.has(object)) {
      this.animationTimes.set(object, 0);
    }
  }
  
  removeAnimation(object: THREE.Object3D, type?: AnimationType): void {
    if (type) {
      const existing = this.animations.get(object) || [];
      const filtered = existing.filter(anim => anim.type !== type);
      
      if (filtered.length > 0) {
        this.animations.set(object, filtered);
      } else {
        this.animations.delete(object);
        this.animationTimes.delete(object);
      }
    } else {
      this.animations.delete(object);
      this.animationTimes.delete(object);
    }
  }
  
  clearAllAnimations(): void {
    this.animations.clear();
    this.animationTimes.clear();
  }
  
  update(delta: number, elapsedTime: number): void {
    this.animations.forEach((configs, object) => {
      let time = this.animationTimes.get(object) || 0;
      time += delta;
      this.animationTimes.set(object, time);
      
      configs.forEach((config) => {
        this.applyAnimation(object, config, delta, elapsedTime);
      });
    });
  }
  
  private applyAnimation(
    object: THREE.Object3D,
    config: AnimationConfig,
    delta: number,
    elapsedTime: number
  ): void {
    const speed = config.speed || 1;
    const amplitude = config.amplitude || 1;
    
    switch (config.type) {
      case 'float':
        object.position.y += Math.sin(elapsedTime * speed * 2) * 0.001 * amplitude;
        object.rotation.x = Math.sin(elapsedTime * speed) * 0.1 * amplitude;
        object.rotation.z = Math.cos(elapsedTime * speed) * 0.1 * amplitude;
        break;
        
      case 'rotate':
        object.rotation.y += delta * speed;
        break;
        
      case 'bounce':
        const bounceHeight = Math.abs(Math.sin(elapsedTime * speed * 2)) * 0.5 * amplitude;
        object.position.y = bounceHeight;
        break;
        
      case 'spin':
        object.rotation.x += delta * speed;
        object.rotation.y += delta * speed * 0.5;
        object.rotation.z += delta * speed * 0.25;
        break;
        
      case 'pulse':
        const scale = 1 + Math.sin(elapsedTime * speed * 2) * 0.1 * amplitude;
        object.scale.set(scale, scale, scale);
        break;
        
      case 'orbit':
        const angle = elapsedTime * speed;
        const radius = 3 * amplitude;
        object.position.x = Math.cos(angle) * radius;
        object.position.z = Math.sin(angle) * radius;
        object.position.y = Math.sin(elapsedTime * speed) * 0.5;
        break;
    }
  }
  
  // Utility animation functions
  static fadeIn(object: THREE.Object3D, duration: number = 1.0): void {
    object.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        const material = child.material as THREE.MeshStandardMaterial;
        if (material) {
          material.opacity = 0;
          material.transparent = true;
          
          const startTime = performance.now();
          
          function animate() {
            const currentTime = performance.now();
            const progress = (currentTime - startTime) / (duration * 1000);
            
            if (progress < 1) {
              material.opacity = progress;
              requestAnimationFrame(animate);
            } else {
              material.opacity = 1;
            }
          }
          
          animate();
        }
      }
    });
  }
  
  static fadeOut(object: THREE.Object3D, duration: number = 1.0): void {
    object.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        const material = child.material as THREE.MeshStandardMaterial;
        if (material) {
          material.transparent = true;
          
          const startTime = performance.now();
          
          function animate() {
            const currentTime = performance.now();
            const progress = (currentTime - startTime) / (duration * 1000);
            
            if (progress < 1) {
              material.opacity = 1 - progress;
              requestAnimationFrame(animate);
            } else {
              material.opacity = 0;
            }
          }
          
          animate();
        }
      }
    });
  }
  
  static scaleUp(object: THREE.Object3D, duration: number = 0.5): void {
    object.scale.set(0, 0, 0);
    
    const startTime = performance.now();
    
    function animate() {
      const currentTime = performance.now();
      const progress = (currentTime - startTime) / (duration * 1000);
      
      if (progress < 1) {
        const scale = progress;
        object.scale.set(scale, scale, scale);
        requestAnimationFrame(animate);
      } else {
        object.scale.set(1, 1, 1);
      }
    }
    
    animate();
  }
  
  static moveTo(
    object: THREE.Object3D,
    targetPosition: THREE.Vector3,
    duration: number = 1.0
  ): void {
    const startPosition = object.position.clone();
    const startTime = performance.now();
    
    function animate() {
      const currentTime = performance.now();
      const progress = (currentTime - startTime) / (duration * 1000);
      
      if (progress < 1) {
        object.position.lerpVectors(startPosition, targetPosition, progress);
        requestAnimationFrame(animate);
      } else {
        object.position.copy(targetPosition);
      }
    }
    
    animate();
  }
}