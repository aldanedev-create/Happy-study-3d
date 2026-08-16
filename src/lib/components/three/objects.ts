import * as THREE from 'three';

export function createBox(
  width: number,
  height: number,
  depth: number,
  color: number = 0x4F46E5
): THREE.Mesh {
  const geometry = new THREE.BoxGeometry(width, height, depth);
  const material = new THREE.MeshStandardMaterial({ 
    color,
    roughness: 0.5,
    metalness: 0.2
  });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

export function createSphere(
  radius: number,
  color: number = 0x4F46E5,
  segments: number = 32
): THREE.Mesh {
  const geometry = new THREE.SphereGeometry(radius, segments, segments);
  const material = new THREE.MeshStandardMaterial({ 
    color,
    roughness: 0.5,
    metalness: 0.2
  });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

export function createCylinder(
  radiusTop: number,
  radiusBottom: number,
  height: number,
  color: number = 0x4F46E5,
  segments: number = 32
): THREE.Mesh {
  const geometry = new THREE.CylinderGeometry(
    radiusTop,
    radiusBottom,
    height,
    segments
  );
  const material = new THREE.MeshStandardMaterial({ 
    color,
    roughness: 0.5,
    metalness: 0.2
  });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

export function createCone(
  radius: number,
  height: number,
  color: number = 0x4F46E5,
  segments: number = 32
): THREE.Mesh {
  const geometry = new THREE.ConeGeometry(radius, height, segments);
  const material = new THREE.MeshStandardMaterial({ 
    color,
    roughness: 0.5,
    metalness: 0.2
  });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

export function createTorus(
  radius: number,
  tube: number,
  color: number = 0x4F46E5,
  radialSegments: number = 16,
  tubularSegments: number = 100
): THREE.Mesh {
  const geometry = new THREE.TorusGeometry(
    radius,
    tube,
    radialSegments,
    tubularSegments
  );
  const material = new THREE.MeshStandardMaterial({ 
    color,
    roughness: 0.5,
    metalness: 0.2
  });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

export function createTextSprite(
  text: string,
  options?: {
    fontSize?: number;
    color?: string;
    backgroundColor?: string;
  }
): THREE.Sprite {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  
  if (!context) {
    throw new Error('Failed to create canvas context');
  }
  
  const fontSize = options?.fontSize || 48;
  context.font = `${fontSize}px Arial`;
  
  const textMetrics = context.measureText(text);
  canvas.width = textMetrics.width + 20;
  canvas.height = fontSize + 20;
  
  // Re-set font after canvas resize
  context.font = `${fontSize}px Arial`;
  context.fillStyle = options?.backgroundColor || 'rgba(0, 0, 0, 0.7)';
  context.fillRect(0, 0, canvas.width, canvas.height);
  
  context.fillStyle = options?.color || '#FFFFFF';
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillText(text, canvas.width / 2, canvas.height / 2);
  
  const texture = new THREE.CanvasTexture(canvas);
  const material = new THREE.SpriteMaterial({ map: texture });
  const sprite = new THREE.Sprite(material);
  
  sprite.scale.set(canvas.width / 100, canvas.height / 100, 1);
  
  return sprite;
}