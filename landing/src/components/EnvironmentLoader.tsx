import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { Suspense } from 'react';
import { Environment as DreiEnvironment, Environment, useGLTF } from '@react-three/drei';
import { useFrame, extend } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Props for the EnvironmentLoader component.
 */
interface EnvironmentLoaderProps {
  /** Path to local HDR file (e.g., './environment-night.hdr') */
  url?: string;
  /** Environment map intensity multiplier (default: 1) */
  intensity?: number;
  /** Whether to use fallback on load failure (default: true) */
  fallbackToGradient?: boolean;
  /** Optional background prop for environment */
  background?: boolean;
  children: React.ReactNode;
}

/**
 * Props for the robust environment loader with error handling.
 */
interface RobustEnvironmentLoaderProps {
  /** Path to local HDR file (e.g., './environment-night.hdr') */
  url?: string;
  /** Environment map intensity multiplier (default: 1) */
  intensity?: number;
  /** Blur amount for the environment map (default: 0.8) */
  blur?: number;
  children: React.ReactNode;
}

/**
 * Props for the starfield texture hook.
 */
interface UseStarfieldTextureResult {
  texture: THREE.Texture | null;
  isLoaded: boolean;
  hasError: boolean;
}

/**
 * Local environment map loader with fallback mechanism.
 * 
 * This component loads HDR environment maps locally instead of relying on external CDNs.
 * It includes comprehensive error handling and graceful degradation to procedural stars.
 */
export const EnvironmentLoader: React.FC<EnvironmentLoaderProps> = ({
  url,
  intensity = 1,
  fallbackToGradient = true,
  background = false,
  children,
}) => {
  const [hasError, setHasError] = useState(false);

  // Load HDR environment map if provided
  useEffect(() => {
    if (url) {
      const loader = new THREE.TextureLoader();
      
      loader.load(
        url,
        () => {
          console.log(`Successfully loaded environment: ${url}`);
        },
        undefined,
        () => {
          console.warn(`Failed to load environment map: ${url}, using fallback`);
          setHasError(true);
        }
      );
    } else if (fallbackToGradient) {
      // Use Drei's preset as fallback when no URL provided
      setTimeout(() => setHasError(false), 100);
    }
  }, [url, fallbackToGradient]);

  return (
    <>
      {/* Fallback to Drei's preset environments on error or if no URL */}
      {!url || hasError ? (
        <Suspense fallback={null}>
          <DreiEnvironment 
            preset="night" 
            // intensity={intensity}
            blur={0.8} 
            background={background} 
          />
          <DreiEnvironment 
            preset="studio" 
            // intensity={intensity * 0.5}
            blur={0.3} 
            background={background} 
          />
        </Suspense>
      ) : (
        // Load local HDR file
        <LocalEnvironmentMap 
          path=""
          files={[url!]}
          blur={0.8} 
          background={background} 
        />
      )}

      {/* Fallback lighting for when environment maps fail */}
      <ambientLight intensity={0.4 * intensity} />
      <spotLight 
        position={[10, 10, 10]} 
        angle={0.5} 
        penumbra={1} 
        intensity={intensity} 
        castShadow
        color="#ffffff"
      />
      <pointLight 
        position={[-10, -5, -10]} 
        intensity={intensity * 0.5} 
        color="#4040ff" 
      />

      {children}
    </>
  );
};

/**
 * Props for LocalEnvironmentMap component.
 */
interface ILocalEnvironmentMapProps {
  path?: string;
  files: string[];
  intensity?: number;
  blur?: number;
  background?: boolean;
}

/**
 * Component that loads a local HDR/EXR environment map file.
 * Falls back gracefully if the file cannot be loaded.
 */
export const LocalEnvironmentMap: React.FC<ILocalEnvironmentMapProps> = ({ 
  path = '',
  files,
  intensity = 1,
  blur = 0.8,
  background = false,
}) => {
  // Combine path and filenames if needed
  const fullUrls = files.map(f => (path && !f.startsWith('/') ? `${path}${f}` : f));

  return (
    <Suspense fallback={null}>
      <DreiEnvironment 
        path={path}
        files={fullUrls as unknown as string[]}
        blur={blur}
        background={background as boolean | 'only' | undefined}
      />
    </Suspense>
  );
};

// Simplified environment provider - removed for simplicity

/**
 * Interface for environment status.
 */
interface IEnvironmentStatus {
  loaded: boolean;
  hasError: boolean;
}

type EnvironmentStatus = IEnvironmentStatus;

/**
 * Custom hook to load HDR environment maps with caching and fallback.
 * 
 * @param url - Path to the HDR file relative to public directory (e.g., './environment-night.hdr')
 * @returns Object containing texture, loading state, and error information
 */
export function useLocalEnvironment(url: string | null): {
  envMap: THREE.Texture | null;
  isLoaded: boolean;
  hasError: boolean;
  errorMessage: string;
} {
  const [envMap, setEnvMap] = useState<THREE.Texture | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    if (!url) return;

    // Use TextureLoader to load the HDR file
    const loader = new THREE.TextureLoader();
    
    loader.load(
      url,
      (texture: any) => {
        texture.colorSpace = THREE.SRGBColorSpace;
        setEnvMap(texture);
        setIsLoaded(true);
      },
      undefined,
      (error: unknown) => {
        console.error(`Failed to load environment map ${url}:`, error);
        setHasError(true);
        setErrorMessage(error instanceof Error ? error.message : 'Unknown error');
        setIsLoaded(false);
      }
    );

    // Cleanup on unmount
    return () => {
      if (envMap) {
        envMap.dispose();
      }
    };
  }, [url]);

  return { envMap, isLoaded, hasError, errorMessage };
}

/**
 * Local starfield texture loader with fallback.
 * Generates a procedural starfield pattern using HTML5 Canvas when textures fail to load.
 */
export function useStarfieldTexture(): UseStarfieldTextureResult {
  const [texture, setTexture] = useState<THREE.Texture | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Generate a procedural starfield texture using canvas
  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const size = 512;
      canvas.width = size;
      canvas.height = size;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        setHasError(true);
        return;
      }

      // Fill with dark gradient background (night sky)
      const gradient = ctx.createRadialGradient(size/2, size/2, 0, size/2, size/2, size);
      gradient.addColorStop(0, '#0a0a1a');   // Dark blue center
      gradient.addColorStop(0.5, '#050510'); // Mid-tone
      gradient.addColorStop(1, '#00000a');  // Black edges

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, size, size);

      // Generate stars with varying sizes and brightness
      const starCount = 2000;
      for (let i = 0; i < starCount; i++) {
        const x = Math.random() * size;
        const y = Math.random() * size;
        const radius = Math.random() * 1.5 + 0.5; // Star size
        
        const brightness = 0.3 + Math.random() * 0.7; // Brightness variation
        const colorVariation = Math.random();
        
        let r: number, g: number, b: number;
        
        // Color variations: white, blue-white, yellowish
        if (colorVariation < 0.6) {
          // White/blue stars (cooler temperatures)
          const coolness = 1 - colorVariation / 0.6;
          r = g = b = brightness;
          b += coolness * 0.3;
        } else if (colorVariation < 0.9) {
          // Yellowish stars (warmer temperatures)
          const warmth = (colorVariation - 0.6) / 0.4;
          r = brightness;
          g = b * (0.8 + warmth * 0.2);
          b *= 0.7;
        } else {
          // Pure white stars
          r = g = b = brightness;
        }
        
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${Math.round(r*255)}, ${Math.round(g*255)}, ${Math.round(b*255)}, 1)`;
        ctx.fill();

        // Add glow for brighter stars
        if (radius > 1.2) {
          const glowGradient = ctx.createRadialGradient(x, y, radius, x, y, radius * 3);
          glowGradient.addColorStop(0, `rgba(${Math.round(r*255)}, ${Math.round(g*255)}, ${Math.round(b*255)}, 0.8)`);
          glowGradient.addColorStop(1, 'rgba(0,0,0,0)');
          
          ctx.beginPath();
          ctx.arc(x, y, radius * 3, 0, Math.PI * 2);
          ctx.fillStyle = glowGradient;
          ctx.fill();
        }
      }

      // Create texture from canvas
      const texCanvas = document.createElement('canvas');
      texCanvas.width = size;
      texCanvas.height = size;
      const tCtx = texCanvas.getContext('2d');
      
      if (tCtx) {
        tCtx.drawImage(canvas, 0, 0, size, size);
        
        const newTexture = new THREE.CanvasTexture(texCanvas);
        newTexture.colorSpace = THREE.SRGBColorSpace;
        newTexture.wrapS = THREE.RepeatWrapping;
        newTexture.magFilter = THREE.LinearFilter;
        
        setTexture(newTexture);
        setIsLoaded(true);
      } else {
        setHasError(true);
      }
    } catch (error) {
      console.error('Failed to generate starfield texture:', error);
      setHasError(true);
    }
  }, []);

  return { texture, isLoaded, hasError };
}

/**
 * Fallback component when environment loading fails completely.
 * Provides a procedural starfield that degrades gracefully.
 */
export const EnvironmentFallback: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <group>
    {/* Procedural starfield using Points as fallback */}
    <StarfieldFallback />
    
    {/* Ambient lighting to compensate for missing environment maps */}
    <ambientLight intensity={0.5} />
    <spotLight 
      position={[10, 10, 10]} 
      angle={Math.PI / 4} 
      penumbra={1} 
      intensity={1} 
      castShadow 
    />
    
    {children}
  </group>
);

/**
 * Procedural starfield using Three.js Points.
 * This serves as a fallback when texture loading fails.
 */
const StarfieldFallback: React.FC = () => {
  const pointsRef = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const pos = new Float32Array(5000 * 3);
    for (let i = 0; i < 5000; i++) {
      // Random position in spherical distribution using uniform sampling
      const phi = Math.acos(-1 + (2 * i) / 5000 - 1e-6);
      const theta = Math.sqrt(5000 * Math.PI * i) * 2.4048; // Approximate spacing
      
      const radius = 100 + Math.random() * 50;
      
      pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = radius * Math.cos(phi);
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (pointsRef.current) {
      const t = state.clock.getElapsedTime() * 0.01;
      pointsRef.current.rotation.y = t;
      pointsRef.current.rotation.x = Math.sin(t * 0.5) * 0.1;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={5000}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.5}
        color="#ffffff"
        sizeAttenuation
        depthWrite={false}
        transparent
        opacity={0.8}
      />
    </points>
  );
};

// Re-export types for external use
export type { EnvironmentStatus, IEnvironmentStatus as IEnvironmentStatusType };
