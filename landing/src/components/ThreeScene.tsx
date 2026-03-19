import React, { useRef, useMemo, useCallback, useEffect, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import {
  Float,
  MeshDistortMaterial,
  PerspectiveCamera,
  OrbitControls,
  OrthographicCamera,
  useGLTF,
  useAnimations,
} from '@react-three/drei';
import * as THREE from 'three';
import { useScroll } from 'framer-motion';

// ── Starfield Background (local environment replacement) ────────────────────
interface StarfieldProps {
  starCount?: number;
  spread?: number;
  scrollProgress?: THREE.IEventTarget['scrollYProgress'];
}

const Starfield: React.FC<StarfieldProps> = ({ 
  starCount = 200, 
  spread = 8,
  scrollProgress 
}) => {
  const pointsRef = useRef<THREE.Points>(null);

  // Generate random positions for stars distributed in a spherical volume
  const generateStars = useCallback((count: number) => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      // Uniform distribution on a sphere using spherical coordinates
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const radius = spread * Math.cbrt(Math.random());
      
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);
      
      positions[i * 3]     = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
      
      // Stars have varying colors from white to light green/teal
      const colorTint = new THREE.Color().setHSL(0.5, 0.5, 0.8);
      colors[i * 3]     = colorTint.r;
      colors[i * 3 + 1] = colorTint.g;
      colors[i * 3 + 2] = colorTint.b;
    }
    
    return { positions, colors };
  }, [spread]);

  const starData = useMemo(() => generateStars(starCount), [starCount, generateStars]);

  useFrame((state) => {
    if (!pointsRef.current || !pointsRef.current.material) return;
    
    const t = state.clock.getElapsedTime();
    const progress = scrollProgress?.get() ?? 0;
    
    // Rotate the starfield slowly for dynamic effect
    pointsRef.current.rotation.y = t * 0.03;
    pointsRef.current.rotation.x = Math.sin(t * 0.1) * 0.05;
    
    const material = pointsRef.current.material as THREE.PointsMaterial & { 
      uniforms?: any;
      onBeforeRender?: (renderer: any, scene: any, camera: any) => void;
    };
    
    // Update starfield appearance based on scroll position for section highlighting
    if (material) {
      const transitions = [0.16, 0.36, 0.56, 0.74];
      const pulse = transitions.reduce(
        (acc: number, tp: number) => acc + Math.max(0, 1 - Math.abs(progress - tp) * 14),
        0 as number
      );
      
      // Animate opacity and size based on scroll position
      material.opacity = 0.12 + pulse * 0.5;
      material.size    = 0.018 + pulse * 0.04;
    }
  });

  return (
    <points ref={pointsRef} matrixAutoUpdate={false}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[starData.positions, 3]}
          count={starCount}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[starData.colors, 3]}
          count={starCount}
        />
      </bufferGeometry>
      <pointsMaterial
        vertexColors
        size={0.018}
        transparent
        opacity={0.12}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
      />
    </points>
  );
};

// ── Simple Starfield Background (fallback/enhancement) ────────────────────
const SimpleStarfield: React.FC = () => {
  const starFieldRef = useRef<THREE.Points>(null);
  
  const generateStars = useMemo(() => {
    const positions = new Float32Array(400 * 3);
    for (let i = 0; i < 400; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const radius = 8 * Math.cbrt(Math.random());
      
      positions[i * 3]     = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);
    }
    return positions;
  }, []);

  useFrame((state) => {
    if (starFieldRef.current) {
      const t = state.clock.getElapsedTime();
      starFieldRef.current.rotation.y = t * 0.02;
      starFieldRef.current.rotation.x = Math.sin(t * 0.15) * 0.05;
    }
  });

  return (
    <points ref={starFieldRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[generateStars, 3]}
          count={400}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#a7f3d0"
        size={0.025}
        transparent
        opacity={0.6}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

// ── Preload GLB models ───────────────────────────────────────────────────────
useGLTF.preload('/models/maze.glb');
useGLTF.preload('/models/puzzle.glb');
useGLTF.preload('/models/trouble_board_game.glb');
useGLTF.preload('/models/game_console.glb');

// ── Helpers ──────────────────────────────────────────────────────────────────
function sectionOpacity(
  scroll: number,
  start: number,
  end: number,
  fade = 0.045,
): number {
  if (scroll <= start || scroll >= end) return 0;
  if (scroll < start + fade) return (scroll - start) / fade;
  if (scroll > end - fade) return (end - scroll) / fade;
  return 1;
}

// ── Particles ────────────────────────────────────────────────────────────────
const MorphParticles: React.FC = () => {
  const pointsRef = useRef<THREE.Points>(null);
  const { scrollYProgress } = useScroll();

  const positions = useMemo(() => {
    const pos = new Float32Array(200 * 3);
    for (let i = 0; i < 200; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * 8;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 8;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 8;
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const t = state.clock.getElapsedTime();
    const scroll = scrollYProgress.get();

    const transitions = [0.16, 0.36, 0.56, 0.74];
    const pulse = transitions.reduce(
      (acc, tp) => acc + Math.max(0, 1 - Math.abs(scroll - tp) * 14),
      0,
    );

    pointsRef.current.rotation.y = t * 0.05;
    pointsRef.current.rotation.x = Math.sin(t * 0.3) * 0.1;

    const mat = pointsRef.current.material as THREE.PointsMaterial;
    mat.opacity = 0.12 + pulse * 0.5;
    mat.size    = 0.018 + pulse * 0.04;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} count={200} />
      </bufferGeometry>
      <pointsMaterial
        color="#10b981"
        size={0.018}
        transparent
        opacity={0.12}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

// ── Cinematic camera ─────────────────────────────────────────────────────────
const CinematicCamera: React.FC = () => {
  const { camera } = useThree();
  const { scrollYProgress } = useScroll();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const scroll = scrollYProgress.get();

    camera.position.x = THREE.MathUtils.lerp(camera.position.x, Math.sin(t * 0.2) * 0.3, 0.02);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, Math.cos(t * 0.15) * 0.2, 0.02);
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, 12 - scroll * 1.5, 0.02);
    camera.lookAt(0, 0, 0);
  });

  return null;
};

// ── Section 1: Morphing Jelly (original Rubik's cube) ────────────────────────
const MorphingJelly: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);
  const { scrollYProgress } = useScroll();

  const cubes = useMemo(() => {
    const temp = [];
    for (let x = -1; x <= 1; x++)
      for (let y = -1; y <= 1; y++)
        for (let z = -1; z <= 1; z++)
          temp.push({
            initialPos: new THREE.Vector3(x * 1.05, y * 1.05, z * 1.05),
            id: `${x}${y}${z}`,
          });
    return temp;
  }, []);

  const meshRefs  = useRef<THREE.Mesh[]>([]);
  const targetRotations = useRef<THREE.Euler[]>(
    Array.from({ length: 27 }, () => new THREE.Euler(0, 0, 0)),
  );

  const getStateColor = useCallback((_i: number) => {
    const colors = ['#dc2626', '#f59e0b', '#10b981'];
    return new THREE.Color(colors[_i % 3]);
  }, []);

  const getStateEmissive = useCallback((_i: number) => {
    const colors = ['#991b1b', '#d97706', '#064e3b'];
    return new THREE.Color(colors[_i % 3]);
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const scroll = scrollYProgress.get();

    const opacity = sectionOpacity(scroll, -0.1, 0.22);

    if (groupRef.current) {
      groupRef.current.visible    = opacity > 0.005;
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, t * 0.15, 0.03);
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, Math.sin(t * 0.3) * 0.12, 0.03);
    }

    meshRefs.current.forEach((mesh, i) => {
      if (!mesh) return;

      const { initialPos } = cubes[i];
      const targetRot = targetRotations.current[i];

      mesh.position.lerp(initialPos, 0.08);

      targetRot.set(
        Math.sin(t * 0.4 + i * 0.3) * 0.08,
        Math.cos(t * 0.4 + i * 0.3) * 0.08,
        0,
      );

      mesh.rotation.x = THREE.MathUtils.lerp(mesh.rotation.x, targetRot.x, 0.06);
      mesh.rotation.y = THREE.MathUtils.lerp(mesh.rotation.y, targetRot.y, 0.06);
      mesh.rotation.z = THREE.MathUtils.lerp(mesh.rotation.z, targetRot.z, 0.06);

      const material = mesh.material as THREE.MeshStandardMaterial & {
        distort: number;
        speed: number;
      };
      if (material) {
        material.distort        = 0.35 + Math.sin(t * 1.2 + i * 0.5) * 0.1;
        material.speed          = 3;
        (material as THREE.Material).opacity = opacity;

        const targetColor    = getStateColor(i);
        const targetEmissive = getStateEmissive(i);
        material.color.lerp(targetColor, 0.03);
        (material as any).emissive?.lerp(targetEmissive, 0.03);

        const transitionIntensity = Math.max(0, 1 - Math.abs(scroll - 0.16) * 10);
        material.emissiveIntensity = THREE.MathUtils.lerp(
          material.emissiveIntensity ?? 0.25,
          0.25 + transitionIntensity * 0.5,
          0.05,
        );
      }
    });
  });

  return (
    <group ref={groupRef}>
      {cubes.map((cube, i) => (
        <mesh
          key={cube.id}
          ref={(el) => (meshRefs.current[i] = el!)}
          position={cube.initialPos}
        >
          <boxGeometry args={[0.9, 0.9, 0.9]} />
          <MeshDistortMaterial
            color={i % 3 === 0 ? '#dc2626' : i % 3 === 1 ? '#f59e0b' : '#10b981'}
            distort={0.35}
            speed={3}
            roughness={0.1}
            metalness={0.7}
            emissive={i % 3 === 0 ? '#991b1b' : i % 3 === 1 ? '#d97706' : '#064e3b'}
            emissiveIntensity={0.25}
            transparent
            opacity={1}
          />
        </mesh>
      ))}
    </group>
  );
};

// ── GLB model with customizable material, perspective tilt & animation support ─────
type ViewMode = 'top' | 'left' | 'right' | 'perspective' | 'front' | 'back';

interface GLBModelProps {
  url: string;
  scrollStart: number;
  scrollEnd: number;
  color: string;
  emissive: string;
  floatSpeed?: number;
  /** Static tilt in radians [x, y, z] for a perspective look */
  tilt?: [number, number, number];
  /** View mode: top, left, right, perspective, front, back */
  mode?: ViewMode;
  /** Use original colors instead of glass material */
  useOriginalColors?: boolean;
  /** Light intensity for the model */
  lightIntensity?: number;
  /** Initial rotation state [x, y, z] at the beginning of the sequence */
  initialRotation?: [number, number, number];
  /** Whether to enable dynamic lighting based on scroll position */
  enableDynamicLighting?: boolean;
  /** Whether to enable rotation animation */
  enableRotation?: boolean;
  /** Whether to enable original GLB animations */
  enableOriginalAnimations?: boolean;
}

const GLBModel: React.FC<GLBModelProps> = ({
  url,
  scrollStart,
  scrollEnd,
  color,
  emissive,
  floatSpeed = 0.8,
  tilt = [0, 0, 0],
  mode,
  useOriginalColors = false,
  lightIntensity = 1,
  initialRotation = [0, 0, 0],
  enableDynamicLighting = false,
  enableRotation = true,
  enableOriginalAnimations = true,
}) => {
  const { scene, animations } = useGLTF(url);
  const { scrollYProgress } = useScroll();
  const outerRef = useRef<THREE.Group>(null);
  const innerRef = useRef<THREE.Group>(null);

  // Calculate effective tilt based on mode if provided
  const effectiveTilt = useMemo((): [number, number, number] => {
    if (mode) {
      switch (mode) {
        case 'top':
          return [Math.PI / 2, 0, 0]; // Top-down view
        case 'left':
          return [0, Math.PI / 2, 0]; // Left side view
        case 'right':
          return [0, -Math.PI / 2, 0]; // Right side view
        case 'back':
          return [0, Math.PI, 0]; // Back view
        case 'front':
          return [0, 0, 0] as [number, number, number]; // Front view
        case 'perspective':
        default:
          return tilt as [number, number, number]; // Use provided tilt for perspective
      }
    }
    return tilt as [number, number, number];
  }, [mode, tilt]);

  // Clone for isolation — never mutate useGLTF cache
  const { clonedScene, materials, normalizedScale, centerOffset } = useMemo(() => {
    const cloned = scene.clone(true);
    cloned.updateMatrixWorld(true);

    const box  = new THREE.Box3().setFromObject(cloned);
    const size = new THREE.Vector3();
    const ct   = new THREE.Vector3();
    let   scale = 1;

    if (!box.isEmpty()) {
      box.getSize(size);
      const maxDim = Math.max(size.x, size.y, size.z);
      if (maxDim > 0.001) scale = 4.0 / maxDim;
      box.getCenter(ct);
    }

    const mats: THREE.Material[] = [];
    cloned.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        if (useOriginalColors) {
          // Preserve original materials for sharp colors
          if (Array.isArray(mesh.material)) {
            mats.push(...mesh.material);
          } else {
            mats.push(mesh.material);
          }
        } else {
          // Use glass material
          const m = new THREE.MeshPhysicalMaterial({
            color:              new THREE.Color(color),
            roughness:          0.05,
            metalness:          0.15,
            clearcoat:          1.0,
            clearcoatRoughness: 0.05,
            envMapIntensity:    4.0,
            emissive:           new THREE.Color(emissive),
            emissiveIntensity:  0.55,
            transparent:        true,
            opacity:            0,
            side:               THREE.FrontSide,
            depthWrite:         false,
          });
          mesh.material = m;
          mats.push(m);
        }
        mesh.castShadow    = true;
        mesh.receiveShadow = true;
      }
    });

    return { clonedScene: cloned, materials: mats, normalizedScale: scale, centerOffset: ct };
  }, [scene, color, emissive, useOriginalColors]);

  // ── Play animations if the GLB has any ──────────────────────────────────
  const { actions } = useAnimations(animations, innerRef);

  useEffect(() => {
    if (!actions || !enableOriginalAnimations) return;
    Object.values(actions).forEach((action) => {
      if (action) {
        action.setLoop(THREE.LoopRepeat, Infinity);
        action.timeScale = 0.6;          // gentle pace
        if (enableOriginalAnimations) {
          action.play();
        } else {
          action.stop();
        }
      }
    });
  }, [actions, enableOriginalAnimations]);

  // Create light refs for dynamic updates
  const pointLightRef1 = useRef<THREE.PointLight>(null);
  const pointLightRef2 = useRef<THREE.PointLight>(null);
  const spotLightRef = useRef<THREE.SpotLight>(null);

  useFrame((state) => {
    const scroll  = scrollYProgress.get();
    const opacity = sectionOpacity(scroll, scrollStart, scrollEnd);
    const t       = state.clock.getElapsedTime();

    if (outerRef.current) {
      outerRef.current.visible    = opacity > 0.005;
      
      // Apply initial rotation and dynamic rotation based on settings
      if (enableRotation) {
        if (enableDynamicLighting) {
          outerRef.current.rotation.x = initialRotation[0] + Math.sin(t * 0.1) * 0.1;
          outerRef.current.rotation.y = initialRotation[1] + t * 0.18;
          outerRef.current.rotation.z = initialRotation[2];
        } else {
          outerRef.current.rotation.y = initialRotation[1] + t * 0.18;
          outerRef.current.rotation.x = initialRotation[0];
          outerRef.current.rotation.z = initialRotation[2];
        }
      } else {
        // No rotation - just use initial rotation
        outerRef.current.rotation.x = initialRotation[0];
        outerRef.current.rotation.y = initialRotation[1];
        outerRef.current.rotation.z = initialRotation[2];
      }
      
      outerRef.current.position.y = Math.sin(t * 0.65) * 0.2;
    }

    // Update light intensities dynamically
    if (enableDynamicLighting && pointLightRef1.current) {
      pointLightRef1.current.intensity = lightIntensity * opacity;
    }
    if (enableDynamicLighting && pointLightRef2.current) {
      pointLightRef2.current.intensity = lightIntensity * 0.5 * opacity;
    }
    if (enableDynamicLighting && spotLightRef.current) {
      spotLightRef.current.intensity = lightIntensity * 0.8 * opacity;
    }

    for (const m of materials) {
      if (m instanceof THREE.MeshPhysicalMaterial) {
        m.opacity           = useOriginalColors ? 1 : opacity;
        m.emissiveIntensity = useOriginalColors ? 0.55 : 0.55 * opacity;
      } else {
        // For original materials, apply opacity if the material supports it
        const material = m as THREE.Material;
        if ('transparent' in material) {
          material.transparent = opacity < 1;
          if ('opacity' in material) {
            (material as any).opacity = opacity;
          }
        }
      }
    }
  });

  return (
    <group ref={outerRef}>
      <Float speed={floatSpeed} floatIntensity={0.25} rotationIntensity={0.08}>
        {/* Perspective tilt wrapper */}
        <group rotation={effectiveTilt}>
          <group ref={innerRef} scale={normalizedScale}>
            <group position={[-centerOffset.x, -centerOffset.y, -centerOffset.z]}>
              <primitive object={clonedScene} />
            </group>
          </group>
        </group>
      </Float>
      
      {/* Dynamic lighting for the model */}
      {enableDynamicLighting && (
        <>
          <pointLight
            ref={pointLightRef1}
            position={[2, 2, 2]}
            intensity={lightIntensity}
            color="#ffffff"
            distance={10}
            decay={2}
          />
          <pointLight
            ref={pointLightRef2}
            position={[-2, -2, -2]}
            intensity={lightIntensity * 0.5}
            color="#4040ff"
            distance={8}
            decay={2}
          />
          <spotLight
            ref={spotLightRef}
            position={[0, 4, 0]}
            angle={0.3}
            penumbra={1}
            intensity={lightIntensity * 0.8}
            color="#ffffcc"
            castShadow
          />
        </>
      )}
    </group>
  );
};

// ── Scene ────────────────────────────────────────────────────────────────────
export const ThreeScene: React.FC = () => (
  <div className="fixed inset-0 -z-10 bg-[#050505]">
    <Canvas dpr={[1, 2]} shadows>
      <PerspectiveCamera makeDefault position={[0, 0, 12]} fov={35} />
      <CinematicCamera />

      {/* Lighting — unified emerald/teal palette */}
      <ambientLight intensity={0.5} />
      <spotLight
        position={[15, 15, 15]}
        angle={0.2}
        penumbra={1}
        intensity={2.5}
        castShadow
        color="#10b981"
      />
      <pointLight position={[-15, -15, -15]} intensity={1.2} color="#0d9488" />
      <pointLight position={[10, -5, 10]}    intensity={0.8} color="#14b8a6" />
      <pointLight position={[14,  4,  0]}    intensity={3.0} color="#f0fdfa" />
      <pointLight position={[-10, 8, 14]}    intensity={2.0} color="#99f6e4" />

      {/* Section 1 – jelly Rubik's cube */}
      <Float speed={1.2} rotationIntensity={0.2} floatIntensity={0.6}>
        <MorphingJelly />
      </Float>

      {/* Section 2 – Maze  (top-down perspective, has animation) */}
      <Suspense fallback={null}>
        <GLBModel
          url="/models/mula_maze_ikea_toy.glb"
          scrollStart={0.20}
          scrollEnd={0.40}
          color="#a7f3d0"
          emissive="#059669"
          floatSpeed={0.1}
          tilt={[Math.PI/2, 0, 0]}
          useOriginalColors={true}
          lightIntensity={2}
          initialRotation={[0, 0, 0]}
          enableDynamicLighting={true}
          enableRotation={false}
          enableOriginalAnimations={true}
          mode={'front'}
        />
      </Suspense>

      {/* Section 3 – Puzzle  (slightly angled from above) */}
      <Suspense fallback={null}>
        <GLBModel
          url="/models/puzzle.glb"
          scrollStart={0.36}
          scrollEnd={0.60}
          color="#6ee7b7"
          emissive="#047857"
          floatSpeed={0.9}
          tilt={[-0.35, -0.3, 0.08]}
          useOriginalColors={true}
          lightIntensity={1.5}
          initialRotation={[0, Math.PI/4, 0]}
          enableDynamicLighting={true}
          enableRotation={false}
          enableOriginalAnimations={true}
          mode={'top'}
        />
      </Suspense>

      {/* Section 4 – Board game  (bird's eye perspective) */}
      <Suspense fallback={null}>
        <GLBModel
          url="/models/week_02-_puzzle.glb"
          scrollStart={0.56}
          scrollEnd={0.78}
          color="#5eead4"
          emissive="#0f766e"
          floatSpeed={0.7}
          tilt={[-0.5, 0.2, -0.1]}
          useOriginalColors={true}
          lightIntensity={1.8}
          initialRotation={[Math.PI/6, 0, 0]}
          enableDynamicLighting={true}
          enableRotation={true}
          enableOriginalAnimations={true}
        />
      </Suspense>

      {/* Section 5 – Game console */}
      <Suspense fallback={null}>
        <GLBModel
          url="/models/game_console.glb"
          scrollStart={0.74}
          scrollEnd={1.0}
          color="#2dd4bf"
          emissive="#115e59"
          floatSpeed={1.0}
          tilt={[-0.3, 0.35, 0.05]}
          useOriginalColors={true}
          lightIntensity={1.2}
          initialRotation={[0, -Math.PI/3, 0]}
          enableDynamicLighting={true}
          enableRotation={false}
          enableOriginalAnimations={true}
        />
      </Suspense>

      {/* Starfield background as local environment replacement */}
      <Starfield starCount={150} spread={8} scrollProgress={useScroll().scrollYProgress} />
      
      {/* Shadow plane for GLB models - using custom shadow plane instead of ContactShadows */}
      <group position={[0, -6.5, 0]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <ringGeometry args={[0.1, 3, 32]} />
          <meshBasicMaterial color="#10b981" transparent opacity={0.1} side={THREE.DoubleSide} />
        </mesh>
      </group>

      <MorphParticles />
      
      {/* Native shadow camera for proper shadow casting */}
      <OrthographicCamera args={[-20, 20, 7, -5, 1, 30]} position={[0, 0, 10]} rotation={[Math.PI / 4, 0, 0]} />

      <OrbitControls enableZoom={false} enablePan={false} />
    </Canvas>

    {/* Gradient overlays for depth effect */}
    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050505]/30 to-[#050505]" />
    
    {/* Starfield overlay for additional atmosphere */}
    <SimpleStarfield />
  </div>
);
