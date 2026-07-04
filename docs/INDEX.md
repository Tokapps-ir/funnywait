# Package Documentation Index

This directory contains comprehensive markdown documentation for each package used in the funnywait project.

## Frontend Dependencies

### Core

- **REACT.md** - React 19
- **TYPES_REACT.md** - TypeScript types for React

### State Management & Routing

- **TYPES_REACT_ROUTER_DOM.md** - React Router DOM
- **USE_SOUND.md** - use-sound (audio) hook

### Animations

- **FRAMER_MOTION.md** - Framer Motion
- **GSAP.md** - GSAP (GreenSock)

### Styling

- **CLSX.md** - Class name concatenation
- **TAILWINNED_MERGE.md** - Tailwind CSS class merger

### 3D Graphics

- **THREEJS.md** - Three.js
- **TYPES_THREE.md** - TypeScript types for Three.js

### Charts & Graphs

- **RECharts.md** - Recharts

### Development & Build

- **TYPES_VITE.md** - Vite
- **TYPES_VITEST.md** - Vitest (Testing framework)

### Data Fetching

- **TYPES_NPMSTRAPICLIENT.md** - @strapi/client

------

## Backend Dependencies (Strapi)

### Core

- **STRAPI.md** - Strapi 5

### Plugins

- **TYPES_USER_PERMISSIONS.md** - Users & Permissions plugin
- **CLOUD.md** - Strapi Cloud plugin
- **TYPES_PLUGINS.md** - Plugin utilities

### UI Framework

- **TYPES_STYLED_COMPONENTS.md** - Styled-components (Admin Panel)

## Related Documentation

### TypeScript Types

Each type package has its own documentation:
- `@types/node`
- `@types/react`
- `@types/react-dom`
- `@types/three`

### Development Tools

- `@types/vitest` - Vitest testing framework types
- `autoprefixer` - CSS autoprefixer
- `typescript` - TypeScript compiler

### Environment

- `better-sqlite3` - SQLite library (Shared)
- `dotenv` - Environment variable loader
- `express` - Express.js (Frontend)

## Quick Reference

| Package | Documentation File |
|---------| ----------- |
| React | [REACT.md](REACT.md) |
| Three.js | [THREEJS.md](THREEJS.md) |
| Framer Motion | [FRAMER_MOTION.md](FRAMER_MOTION.md) |
| GSAP | [GSAP.md](GSAP.md) |
| Strapi | [STRAPI.md](STRAPI.md) |
| Howler.js | [HOWLER.md](HOWLER.md) |
| Recharts | [RECHARTS.md](RECHARTS.md) |
| Vite | [TYPES_VITE.md](TYPES_VITE.md) |
| use-sound | [USE_SOUND.md](USE_SOUND.md) |
| styled-components | [TYPES_STYLED_COMPONENTS.md](TYPES_STYLED_COMPONENTS.md) |

## Usage

```bash
# View specific package documentation
# cd /Users/apple/Documents/projectsLocal/funnywait/docs/
# cat REACT.md
```

## Updating Documentation

When updating a package version or finding new features:

1. Read the official documentation from the package website
2. Compare with existing documentation
3. Update the relevant markdown file
4. Note any breaking changes
5. Add migration guides if needed

## Contributing

- Follow the existing documentation structure
- Include examples for each major feature
- Add code snippets where appropriate
- Reference official resources
- Link to external resources

## License

All package documentation is maintained according to the original license of each package.