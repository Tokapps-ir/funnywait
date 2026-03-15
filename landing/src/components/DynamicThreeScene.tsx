import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Sphere, PerspectiveCamera, Environment, Stars } from '@react-three/drei';
import { Bloom, EffectComposer } from '@react-three/postprocessing';
import * as THREE from 'three';
import { QualityLevel } from '../types';

interface Props {
  budget: number;
  seats: number;
  waitTime: number;
  quality: QualityLevel;
}

const DynamicObjects = ({ budget, seats, waitTime, quality }: Props) => {
  const groupRef = useRef<THREE.Group>(null);
  
  // Budget affects light intensity and glow
  const glowIntensity = Math.min(budget / 10000000, 2);
  
  // Seats affects object count (simulated by scale or clones)
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
          <Sphere args={[0.5 * objectScale, 64, 64]} position={s.position}>
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
      <Canvas dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={50} />
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={1.5} color={props.quality === 'premium' ? '#fbbf24' : '#10b981'} />
        <pointLight position={[-10, -10, -10]} intensity={1} color="#3b82f6" />
        
        <DynamicObjects {...props} />
        
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        <Environment preset="night" />
        
        {props.quality === 'premium' && (
          <EffectComposer>
            <Bloom luminanceThreshold={0.2} luminanceSmoothing={0.9} height={300} intensity={1.5} />
          </EffectComposer>
        )}
      </Canvas>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050505]/30 to-[#050505]" />
    </div>
  );
};
