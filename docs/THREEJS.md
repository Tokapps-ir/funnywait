# Three.js

## Overview

Three.js is a JavaScript 3D library that makes it easier to write applications using WebGL for rendering complex 3D graphics in the browser.

**Version:** ^0.183.1  
**Homepage:** [https://threejs.org/](https://threejs.org/)  
**Repository:** [https://github.com/mrdoob/three.js](https://github.com/mrdoob/three.js)  
**License:** MIT

## Installation

```bash
npm install three@0.183.1
npm install @react-three/fiber@9.5.0
npm install @react-three/drei@10.7.7
npm install @react-three/postprocessing@3.0.4
npm install @types/three@0.183.1
npm install threejs-components@0.0.17
```

## Key Features

### 1. Core WebGL Rendering

Three.js provides a complete 3D rendering engine covering:
- Geometry (shapes, models)
- Materials (surface properties)
- Lighting
- Cameras
- Rendering pipeline
- Post-processing effects

### 2. Basic 3D Objects

```javascript
import * as THREE from 'three';

// Scene, Camera, Renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });

// Add objects
const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// Render
renderer.setScenario({ scene: canvas });
renderer.setSize(window.innerWidth, window.innerHeight);
```

### 3. React Three Fiber Integration

React Three Fiber allows declarative 3D development with React:

```tsx
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, SphereControls } from '@react-three/drei';

function Scene() {
  const [hovered, setHover] = useState(false);
  
  return (
    <Canvas camera={{ position: [0, 0, 5] }}>
      <Sphere color={hovered ? 'orange' : 'white'} scale={hovered ? 2 : 1}>
        <meshStandardMaterial />
      </Sphere>
      
      {/* Auto-rotate on hover */}
      <SphereControls />
    </Canvas>
  );
}

function App() {
  return <Scene />;
}
```

### 4. Advanced Materials

```javascript
// Standard Material
const material = new THREE.MeshStandardMaterial({
  color: 0x00ff00,
  roughness: 0.5,
  metalness: 0.3
});

// Physical Material (realistic)
const material = new THREE.MeshPhysicalMaterial({
  color: 0x00ff00,
  roughness: 0.5,
  metalness: 0.3,
  thickness: 1.0,
  ior: 1.5
});

// Emissive Material (glowing)
const material = new THREE.MeshBasicMaterial({
  color: 0xff0000,
  emissive: 0x440000,
  emissiveIntensity: 0.5
});
```

### 5. Lighting

```javascript
// Ambient Light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

// Directional Light
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

// Point Light (omni-directional)
const pointLight = new THREE.PointLight(0xff0000, 1, 50);
scene.add(pointLight);

// Spot Light (directional with spread)
const spotLight = new THREE.SpotLight(0x00ffff, 1);
spotLight.position.set(5, 5, 5);
spotLight.angle = Math.PI / 6;
spotLight.penumbra = 0.2;
scene.add(spotLight);
```

### 6. Post-Processing Effects

```tsx
import { EffectComposer, Bloom, DepthOfField, Pass } from '@react-three/postprocessing';

function Scene() {
  return (
    <Canvas>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 10]} />
      
      <EffectComposer>
        <Bloom luminanceThreshold={0.5} />
        <DepthOfField focus={5} />
      </EffectComposer>
      
      {/* Your 3D content */}
    </Canvas>
  );
}
```

### 7. Animation Loop

```tsx
import { useFrame } from '@react-three/fiber';

function AnimatedMesh({ speed = 0.01 }) {
  const mesh = useRef();
  
  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    mesh.current.rotation.x = time * speed;
    mesh.current.rotation.y = time * speed;
  });
  
  return <mesh ref={mesh} />;
}
```

### 8. Loading 3D Models

```tsx
import { useGLTF } from '@react-three/drei';

function Model({ url }) {
  const { scene } = useGLTF(url);
  
  return (
    <primitive object={scene} position={[0, -2, 0]} />
  );
}
```

### 9. Interactive Elements

```tsx
import { useInteraction } from '@react-three/drei';

function Interactive() {
  const [hovered, onPointer] = useInteraction();
  
  return (
    <mesh onPointerDown={onPointer} visible={hovered}>
      {/* content */}
    </mesh>
  );
}
```

## Types & TypeScript

Install TypeScript types:

```bash
npm install @types/three
```

Usage with typeScript:

```tsx
import * as THREE from 'three';

function MyScene() {
  const geometry: THREE.BoxGeometry = new THREE.BoxGeometry();
  const material: THREE.MeshStandardMaterial = new THREE.MeshStandardMaterial();
  const mesh: THREE.Mesh | null = new THREE.Mesh(geometry, material);
}
```

## Performance

Three.js provides several performance optimizations:

- **BufferGeometry**: Use for large meshes with interleaved attributes
- **InstancedMesh**: Render thousands of identical objects efficiently
- **Object3D.instance():** Lazy geometry/material instantiation
- **Frame Timing Control:** Limit render frame rate on slower devices

```tsx
// BufferGeometry for performance
import { Plane as BufferPlane } from '@react-three/drei';

function ParticleSystem() {
  const meshBuffer = useRef();
  
  useFrame(() => {
    // Update particle positions
  });
  
  return <ref mesh={meshBuffer} />;
}
```

## Ecosystem

### Core React Three Packages

- **@react-three/fiber** - React renderer for Three.js
- **@react-three/drei** - Common 3D primitives and helpers
- **@react-three/postprocessing** - Effect composition for post-processing
- **@react-three/drc** - Data reactive components for analytics
- **@react-three/gltfjsx** - Convert glTF models to React components

### Example: glTF integration

```tsx
import { gltf } from './Box';

function Box() {
  return (
    <mesh ref={gltf.scene}>
      <primitive object={gltf.scene} />
    </mesh>
  );
}
```

## References

- [Official Documentation](https://threejs.org/)
- [GitHub Repository](https://github.com/mrdoob/three.js)
- [Three.js Journey](https://threejs-journey.com/)
- [React Three Fiber Documentation](https://r3f.docs.pmnd.rs/)
- [Drei Documentation](https://drei.docs.pmnd.rs/)