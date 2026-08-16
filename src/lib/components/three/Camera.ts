import * as THREE from 'three';

export class CameraController {
  private camera: THREE.PerspectiveCamera;
  private target: THREE.Vector3;
  private currentPosition: THREE.Vector3;
  private targetPosition: THREE.Vector3;
  private isAnimating: boolean = false;
  private animationDuration: number = 1.0;
  private animationTime: number = 0;
  
  constructor(camera: THREE.PerspectiveCamera) {
    this.camera = camera;
    this.target = new THREE.Vector3(0, 0, 0);
    this.currentPosition = camera.position.clone();
    this.targetPosition = camera.position.clone();
  }
  
  moveTo(x: number, y: number, z: number, duration: number = 1.0): void {
    this.targetPosition.set(x, y, z);
    this.currentPosition.copy(this.camera.position);
    this.animationDuration = duration;
    this.animationTime = 0;
    this.isAnimating = true;
  }
  
  lookAt(x: number, y: number, z: number): void {
    this.target.set(x, y, z);
    this.camera.lookAt(this.target);
  }
  
  update(delta: number): void {
    if (!this.isAnimating) return;
    
    this.animationTime += delta;
    
    const progress = Math.min(this.animationTime / this.animationDuration, 1);
    
    // Smooth easing
    const easedProgress = this.easeInOutCubic(progress);
    
    this.camera.position.lerpVectors(
      this.currentPosition,
      this.targetPosition,
      easedProgress
    );
    
    this.camera.lookAt(this.target);
    
    if (progress >= 1) {
      this.isAnimating = false;
    }
  }
  
  private easeInOutCubic(t: number): number {
    return t < 0.5
      ? 4 * t * t * t
      : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }
  
  zoom(delta: number): void {
    const direction = new THREE.Vector3();
    this.camera.getWorldDirection(direction);
    
    const newPosition = this.camera.position.clone().add(
      direction.multiplyScalar(delta)
    );
    
    this.moveTo(newPosition.x, newPosition.y, newPosition.z, 0.5);
  }
  
  rotate(angle: number): void {
    this.camera.position.applyAxisAngle(
      new THREE.Vector3(0, 1, 0),
      angle
    );
    this.camera.lookAt(this.target);
  }
  
  reset(duration: number = 1.0): void {
    this.moveTo(0, 2, 10, duration);
    this.lookAt(0, 0, 0);
  }
  
  getPosition(): THREE.Vector3 {
    return this.camera.position.clone();
  }
  
  setTarget(x: number, y: number, z: number): void {
    this.target.set(x, y, z);
  }
}