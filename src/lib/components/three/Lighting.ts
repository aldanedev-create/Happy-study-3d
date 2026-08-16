import * as THREE from 'three';

export class LightingSetup {
  private scene: THREE.Scene;
  private lights: THREE.Light[] = [];
  
  constructor(scene: THREE.Scene) {
    this.scene = scene;
  }
  
  createDefaultLighting(): void {
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0x404060, 0.5);
    this.scene.add(ambientLight);
    this.lights.push(ambientLight);
    
    // Main directional light (sun)
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
    directionalLight.position.set(5, 10, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 50;
    directionalLight.shadow.camera.left = -20;
    directionalLight.shadow.camera.right = 20;
    directionalLight.shadow.camera.top = 20;
    directionalLight.shadow.camera.bottom = -20;
    directionalLight.shadow.bias = -0.0001;
    this.scene.add(directionalLight);
    this.lights.push(directionalLight);
    
    // Hemisphere light for natural fill
    const hemisphereLight = new THREE.HemisphereLight(
      0x8888ff, // sky color
      0x444422, // ground color
      0.4
    );
    this.scene.add(hemisphereLight);
    this.lights.push(hemisphereLight);
  }
  
  createStudyRoomLighting(): void {
    // Soft ambient lighting
    const ambientLight = new THREE.AmbientLight(0x303050, 0.4);
    this.scene.add(ambientLight);
    this.lights.push(ambientLight);
    
    // Main spotlight
    const spotLight = new THREE.SpotLight(0xffffff, 1.5);
    spotLight.position.set(0, 8, 0);
    spotLight.angle = Math.PI / 4;
    spotLight.penumbra = 0.3;
    spotLight.decay = 1;
    spotLight.distance = 30;
    spotLight.castShadow = true;
    spotLight.shadow.mapSize.width = 1024;
    spotLight.shadow.mapSize.height = 1024;
    this.scene.add(spotLight);
    this.lights.push(spotLight);
    
    // Point lights for accent
    const colors = [0x4F46E5, 0x7C3AED, 0x2563EB];
    colors.forEach((color, index) => {
      const pointLight = new THREE.PointLight(color, 0.5, 5);
      const angle = (index / colors.length) * Math.PI * 2;
      pointLight.position.set(
        Math.cos(angle) * 3,
        1,
        Math.sin(angle) * 3
      );
      this.scene.add(pointLight);
      this.lights.push(pointLight);
    });
  }
  
  addLight(light: THREE.Light): void {
    this.scene.add(light);
    this.lights.push(light);
  }
  
  removeLight(light: THREE.Light): void {
    this.scene.remove(light);
    const index = this.lights.indexOf(light);
    if (index > -1) {
      this.lights.splice(index, 1);
    }
  }
  
  setLightIntensity(lightIndex: number, intensity: number): void {
    if (lightIndex >= 0 && lightIndex < this.lights.length) {
      const light = this.lights[lightIndex];
      if (light instanceof THREE.DirectionalLight || 
          light instanceof THREE.PointLight || 
          light instanceof THREE.SpotLight) {
        light.intensity = intensity;
      } else if (light instanceof THREE.AmbientLight) {
        light.intensity = intensity;
      } else if (light instanceof THREE.HemisphereLight) {
        light.intensity = intensity;
      }
    }
  }
  
  clearAllLights(): void {
    this.lights.forEach((light) => {
      this.scene.remove(light);
    });
    this.lights = [];
  }
  
  getLights(): THREE.Light[] {
    return this.lights;
  }
}