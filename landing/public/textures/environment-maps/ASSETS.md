# Environment Assets Documentation

This directory contains local HDR environment maps used by the Three.js scene for realistic lighting and reflections.

## File Structure

```
textures/environment-maps/
├── ASSETS.md                 # This file - documentation
└── night-sky-nightly.hdr     # Primary night sky environment map (HDR format)
```

## Environment Maps

### night-sky-nightly.hdr

- **Format**: HDR (Radiance .hdr)
- **Description**: Dark blue/black gradient night sky environment
- **Usage**: Used by `EnvironmentLoader` component for realistic night-time rendering
- **Resolution**: 512x256 pixels (equirectangular projection)
- **License**: Placeholder - replace with production HDR from trusted source

#### Replacing with Production HDR

For production use, download a high-quality HDRI from:

1. **[Poly Haven](https://polyhaven.com/a/night_sky_psyche)** - Free HDRI (CC0 license)
2. **[HDRI Haven](https://hdrihaven.com/)** - Various free and paid options

Download the `.hdr` file and place it in this directory with the name `night-sky-nightly.hdr`.

## Loading Environment Maps

### Using the EnvironmentLoader Component

```tsx
import { EnvironmentLoader } from '@/components/EnvironmentLoader';

function MyScene() {
  return (
    <Canvas>
      <EnvironmentLoader 
        url="/textures/environment-maps/night-sky-nightly.hdr"
        intensity={1.0}
        fallbackToGradient={true}
      >
        {/* Your scene content */}
      </EnvironmentLoader>
    </Canvas>
  );
}
```

### Using LocalEnvironmentMap Component

```tsx
import { LocalEnvironmentMap } from '@/components/EnvironmentLoader';

function MyScene() {
  return (
    <Canvas>
      <LocalEnvironmentMap 
        path="/textures/environment-maps/"
        files={["night-sky-nightly.hdr"]}
        intensity={1.0}
        blur={0.8}
        background={false}
      />
    </Canvas>
  );
}
```

### Using useLocalEnvironment Hook

```tsx
import { useLocalEnvironment } from '@/components/EnvironmentLoader';

function MyComponent() {
  const { envMap, isLoaded, hasError, errorMessage } = useLocalEnvironment(
    '/textures/environment-maps/night-sky-nightly.hdr'
  );

  if (hasError) {
    return <div>Failed to load environment: {errorMessage}</div>;
  }

  return (
    <Canvas>
      {/* Scene content */}
    </Canvas>
  );
}
```

## Fallback Mechanisms

The environment loader includes several fallback mechanisms for when HDR files fail to load:

1. **First Fallback**: Three.js/Drei's preset environments (`preset="night"`, `preset="studio"`)
2. **Second Fallback**: Procedural starfield generated using HTML5 Canvas
3. **Final Fallback**: Basic lighting setup with ambient and point lights

## Performance Considerations

- HDR files can be large (100KB - 10MB); consider compression for production
- Use appropriate blur values to balance quality and performance
- Load environments asynchronously using `Suspense` boundaries
- Consider lazy loading environments based on user interaction

## Git LFS Configuration

This project uses Git Large File Storage (Git LFS) for managing large asset files. To set up:

```bash
# Install Git LFS if not already installed
brew install git-lfs  # macOS
git lfs install

# Track HDR and texture files
git lfs install
git lfs track "*.hdr"
git lfs track "*.exr"
git lfs track "*.jpg"
git lfs track "*.png"

# Commit the .gitattributes file
git add .gitattributes
```

## Troubleshooting

### HDR File Not Loading

1. Verify the file path is correct relative to your public directory
2. Check browser console for specific error messages
3. Ensure the file has proper read permissions
4. Try using a different HDR file format (EXR, JPG)

### Environment Map Appears Too Dark/Bright

Adjust the `intensity` prop:
```tsx
<EnvironmentLoader intensity={0.5} />  // Less intense
<EnvironmentLoader intensity={2.0} />  // More intense
```

### Artifacts or Glitches

1. Ensure HDR file is not corrupted
2. Try re-downloading from source
3. Check for browser compatibility issues
4. Verify Three.js version compatibility