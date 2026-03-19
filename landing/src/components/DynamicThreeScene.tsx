import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame, Vector3 } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Sphere } from '@react-three/drei';
import { Bloom, EffectComposer } from '@react-three/postprocessing';
import * as THREE from 'three';

export type QualityLevel = 'basic' | 'professional' | 'premium';

interface Props {
  budget: number;
  seats: number;
  waitTime: number;
  quality: QualityLevel;
}

// Custom Starfield Component using Three.js native BufferGeometry and PointsMaterial
// This replaces the Environment preset which made network requests for HDR maps
const CustomStarfield = () => {
  const pointsRef = useRef<THREE.Points>(null);
  
  // Generate random star positions once on mount - no external dependencies
  const starsGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const count = 5000; // Number of stars (matches Stars component default)
    const positions = new Float32Array(count * 3); // x, y, z for each star
    const colors = new Float32Array(count * 3);   // RGB color for each star
    
    for (let i = 0; i < count; i++) {
      // Position stars in a sphere around the scene for even distribution
      const r = Math.random() * 100; // Radius up to 100 units from center
      
      // Use spherical coordinates for uniform star distribution on sphere surface
      const theta = Math.random() * Math.PI * 2;       // Random azimuthal angle (0 to 2π)
      const phi = Math.acos(2 * Math.random() - 1);     // Random polar angle (-1 to 1 mapped to 0 to π)
      
      positions[i * 3]     = r * Math.sin(phi) * Math.cos(theta);       // x
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);       // y
      positions[i * 3 + 2] = r * Math.cos(phi);                          // z
      
      // Create white/light blue star colors with slight variations for visual interest
      const colorVariation = 0.8 + Math.random() * 0.2; // Brightness: 0.8 to 1.0
      colors[i * 3]     = colorVariation;                 // Red channel
      colors[i * 3 + 1] = colorVariation;                 // Green channel (same for white)
      colors[i * 3 + 2] = colorVariation;                 // Blue channel (same for white)
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    return geometry;
  }, []);

  useFrame((state, delta) => {
    // Slowly rotate the starfield for a dynamic effect (no speed dependency on props)
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.02;
    }
  });

  return (
    <group>
      <points ref={pointsRef}>
        <primitive object={starsGeometry} attach="geometry" />
        <pointsMaterial
          size={0.5}
          vertexColors
          transparent
          opacity={0.8}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          sizeAttenuation
        />
      </points>
    </group>
  );
};

const DynamicObjects = ({ budget, seats, waitTime, quality }: Props) => {
  const groupRef = useRef<THREE.Group>(null);
  
  // Budget affects light intensity and glow
  const glowIntensity = Math.min(budget / 10000000, 2);
  
  // Seats affect object count (simulated by scale or clones)
  const objectScale = 1 + (seats / 100);
  
  // Wait time affects speed
  const speed = Math.max(0.5, 5 - (waitTime / 60));

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.1 * speed;
      groupRef.current.position.y = Math.sin(t * 0.5) * 0.2;
    }
  });

  const spheres = useMemo(() => {
    const count = Math.min(Math.floor(seats / 10) + 1, 10);
    return Array.from({ length: count }).map((_, i) => ({
      position: [
        Math.cos((i / count) * Math.PI * 2) * 3,
        Math.sin((i / count) * Math.PI * 2) * 3,
        (Math.random() - 0.5) * 2
      ] as [number, number, number],
      distort: 0.3 + Math.random() * 0.2,
      speed: 1 + Math.random()
    }));
  }, [seats]);

  return (
    <group ref={groupRef}>
      {spheres.map((s, i) => (
        <Float key={i} speed={s.speed * speed} rotationIntensity={1} floatIntensity={1}>
          <Sphere args={[0.5 * objectScale, 64, 64]} position={s.position as Vector3}>
            <MeshDistortMaterial
              color={quality === 'premium' ? '#fbbf24' : quality === 'professional' ? '#10b981' : '#3b82f6'}
              attach="material"
              distort={s.distort}
              speed={speed}
              roughness={0.1}
              metalness={0.9}
              emissive={quality === 'premium' ? '#fbbf24' : '#000000'}
              emissiveIntensity={glowIntensity}
            />
          </Sphere>
        </Float>
      ))}
      
      {/* Central Core */}
      <Sphere args={[1.2, 128, 128]}>
        <MeshDistortMaterial
          color={quality === 'premium' ? '#ffffff' : '#10b981'}
          distort={0.4}
          speed={speed * 0.5}
          roughness={0}
          metalness={1}
          emissive={quality === 'premium' ? '#ffffff' : '#10b981'}
          emissiveIntensity={glowIntensity * 0.5}
        />
      </Sphere>
    </group>
  );
};

export const DynamicThreeScene: React.FC<Props> = (props) => {
  return (
    <div className="fixed inset-0 -z-10 bg-[#050505]">
      <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 10], fov: 50 }}>
        {/* Custom starfield replaces Environment preset - no network requests */}
        <CustomStarfield />
        
        {/* Ambient lighting setup to simulate environment illumination without HDR loading */}
        <ambientLight intensity={0.2} color="#ffffff" />
        <pointLight 
          position={[10, 10, 10]} 
          intensity={1.5} 
          color={props.quality === 'premium' ? '#fbbf24' : '#10b981'} 
        />
        
        <DynamicObjects {...props} />
        
        {/* Additional fill light for rim effect */}
        <pointLight position={[-10, -10, -10]} intensity={1} color="#3b82f6" distance={20} />
        
        {props.quality === 'premium' && (
          <EffectComposer>
            <Bloom luminanceThreshold={0.2} luminanceSmoothing={0.9} height={300} intensity={1.5} />
          </EffectComposer>
        )}
      </Canvas>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050506]/30 to-[#050505]" />
    </div>
  );
};