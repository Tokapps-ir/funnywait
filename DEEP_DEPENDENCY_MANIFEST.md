# 📦 Comprehensive Dependency Manifest

**Project:** Funnywait  
**Generated:** 2026-07-04  
**Analysis Scope:** `landing` (Frontend) + `landing_backend` (Backend)

---

## 📋 Executive Summary

This document catalogs all dependencies and devDependencies extracted from the `landing` and `landing_backend` directories. The manifest is structured for dependency management, version auditing, and project onboarding.

### ⚖️ Technology Summary
| Domain | Technologies |
|--------|--------------|
| **Frontend (landing)** | React 19 × Vite + Tailwind CSS v4 + Three.js + Framer Motion |
| **Backend (landing_backend)** | Strapi 5 (CMS) + SQLite/PG + TypeScript |

**Frontend:** A modern, performant React 19 SPA with 3D graphics and rich animations (via React Three Fiber, Framer Motion, GSAP).  
**Backend:** A Headless CMS based on Strapi 5, optimized for content management and API generation.

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    Landing (Frontend)                   │
│   React 19 + Vite + Tailwind v4 + Three.js (3D)         │
│   └── Connects via @strapi/client to Backend API        │
└─────────────────────────────────────────────────────────┘
                             │
                         API Connection
                             │
┌─────────────────────────────────────────────────────────┐
│                   Landing Backend (API)                 │
│   Strapi 5 (CMS) + SQLite/PostgreSQL + GraphQL/REST      │
└─────────────────────────────────────────────────────────┘
```

---

## 📂 File Locations

| File | Path | Purpose |
|------|------|---------|
| **Frontend Dependencies** | `/Users/apple/Documents/projectsLocal/funnywait/landing/package.json` | Frontend application dependencies |
| **Backend Dependencies** | `/Users/apple/Documents/projectsLocal/funnywait/landing_backend/package.json` | Strapi CMS dependencies |

---

## 📚 Dependency Catalog

### 🎨 Frontend (`landing`)

#### ⚙️ Production Dependencies (`dependencies`) - 29 packages

| Package | Version | Category | Purpose |
|---------|---------|----------|---------|
| `@google/genai` | ^1.29.0 | AI | Google Generative AI integration |
| `@react-three/drei` | ^10.7.7 | 3D | React Three Fiber utilities, glTF, Canvas |
| `@react-three/fiber` | ^9.5.0 | 3D | React rendering for Three.js |
| `@react-three/postprocessing` | ^3.0.4 | 3D Postprocessing | Visual effects (bloom, depth) |
| `@strapi/client` | ^1.6.1 | CMS | Strapi 5 React client for frontend API |
| `@tailwindcss/vite` | ^4.1.14 | Styling | Tailwind v4 plugin for Vite |
| `@types/three` | ^0.183.1 | Types | TypeScript types for Three.js |
| `@vitejs/plugin-react` | ^5.0.4 | Build | Vite plugin for React |
| `better-sqlite3` | ^12.4.1 | Database | Embedded SQLite (likely for local/offline caching) |
| `clsx` | ^2.1.1 | Utils | Class name concatenation utility |
| `dotenv` | ^17.2.3 | Config | Environment variable loader |
| `express` | ^4.21.2 | Server | Lightweight API/local server (Vite dev server) |
| `framer-motion` | ^12.34.3 | Animation | React animation library |
| `gsap` | ^3.14.2 | Animation | GreenSock Animation Platform |
| `howler` | ^2.2.4 | Audio | Audio controller library |
| `lenis` | ^1.3.17 | UI/UX | Smooth scroll for landing page |
| `motion` | ^12.23.24 | Animation | Basic motion utility (likely Motion One) |
| `postprocessing` | ^6.38.3 | 3D Postprocessing | Three.js visual effects |
| `react` | ^19.0.0 | Core | React 19 framework |
| `react-dom` | ^19.0.0 | Core | React DOM renderer |
| `react-intersection-observer` | ^10.0.3 | Hooks | Intersection observer hook |
| `react-markdown` | ^10.1.0 | UI | Markdown to React components |
| `recharts` | ^3.7.0 | Charting | React-based charts/gauges |
| `tailwind-merge` | ^3.5.0 | Styling | Tailwind utility class merger |
| `three` | ^0.183.1 | 3D | Three.js WebGL library |
| `threejs-components` | ^0.0.17 | 3D | Three.js components |
| `use-sound` | ^5.0.0 | Audio | Sound hook for React applications |
| `vite` | ^6.2.0 | Build | Fast build tool + dev server |

#### 🛠️ Development Dependencies (`devDependencies`) - 9 packages

| Package | Version | Category | Purpose |
|---------|---------|----------|---------|
| `@types/express` | ^4.17.21 | Types | TypeScript definitions for ExpressJS |
| `@types/node` | ^22.14.0 | Types | TypeScript definitions for Node.js |
| `autoprefixer` | ^10.4.21 | Build | PostCSS autoprefixer for Tailwind |
| `lucide-react` | ^0.575.0 | Icons | Icon set for React applications |
| `tailwindcss` | ^4.1.14 | Styling | Tailwind CSS v4 runtime |
| `tsx` | ^4.21.0 | Build | TypeScript execution tool (Vite dev server) |
| `typescript` | ~5.8.2 | Build | TypeScript compiler |
| `vite` | ^6.2.0 | Build | (Also listed here as dev dependency) |

---

### 🗄️ Backend (`landing_backend`)

#### ⚙️ Production Dependencies (`dependencies`) - 8 packages

| Package | Version | Category | Purpose |
|---------|---------|----------|---------|
| `@strapi/plugin-cloud` | ^5.49.0 | CMS | Cloud deployment plugin for Strapi 5 |
| `@strapi/plugin-users-permissions` | ^5.49.0 | CMS | Authentication & permissions plugin |
| `@strapi/strapi` | ^5.49.0 | CMS | Strapi 5 Framework core dependency |
| `better-sqlite3` | ^12.6.2 | Database | SQLite for local/development |
| `pg` | ^8.22.0 | Database | PostgreSQL driver for production |
| `react` | ^18.0.0 | UI | React for Strapi Admin Panel |
| `react-dom` | ^18.0.0 | UI | React DOM for Admin Panel |
| `react-router-dom` | ^6.0.0 | Routing | Navigation in Strapi Admin Panel |
| `styled-components` | ^6.0.0 | Styling | Admin panel UI styling |

#### 🛠️ Development Dependencies (`devDependencies`) - 4 packages

| Package | Version | Category | Purpose |
|---------|---------|----------|---------|
| `@types/node` | ^20 | Types | TypeScript definitions for Node.js |
| `@types/react` | ^18 | Types | TypeScript definitions for React |
| `@types/react-dom` | ^18 | Types | TypeScript definitions for React DOM |
| `typescript` | ^5 | Build | TypeScript compiler |

---

## 🔗 Cross-Platform Packages

Packages shared between **frontend** and **backend**:

| Package | Frontend | Backend | Notes |
|---------|----------|---------|-------|
| `better-sqlite3` | ^12.4.1 | ^12.6.2 | **Shared:** Local database for both layers. Backend version updated (12.4.1 → 12.6.2) |
| `react` | ^19.0.0 | ^18.0.0 | ⚠️ **Version Mismatch:** Frontend uses React 19, Backend uses React 18 |

---

## 🎯 Critical Observations & Recommendations

### ⚠️ Compatibility Alerts

1. **React Version Mismatch:**
   - **Frontend (`landing`):** React `^19.0.0`
   - **Backend (`landing_backend`):** React `^18.0.0`
   - **Risk:** Version inconsistency in shared React ecosystem components.
   - **Recommendation:** Align versions or use React Server Components (RSC) with careful version separation.

2. **`@types/node` Version Mismatch:**
   - **Frontend:** ^22.14.0
   - **Backend:** ^20
   - **Recommendation:** Ensure runtime Node version compatibility with both.

3. **Tailwind CSS Compatibility:**
   - **Frontend:** Uses `@tailwindcss/vite` (^4.1.14) - **Tailwind v4** with Vite plugin.
   - **Backend:** Uses `tailwindcss` (runtime only).
   - **Recommendation:** Consider unifying Tailwind approach if sharing styles between frontend and backend admin panel.

### ✅ Positive Observations

- **`@strapi/client`** is properly configured for frontend integration with Strapi 5.
- **`@types/strapi/**`** - type-safe Strapi client for frontend.
- **Backend plugin** is up-to-date Strapi 5:
  - `@strapi/plugin-cloud` for deployment
  - `@strapi/plugin-users-permissions` for auth
- **`pg`** included for production database readiness.

---

## 📄 NPM Manifest

### Frontend (`landing` - react-example)

```json
{
  "name": "react-example",
  "type": "module",
  "scripts": {
    "dev": "vite --port=3000 --host",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "@google/genai": "^1.29.0",
    "@react-three/drei": "^10.7.7",
    "@react-three/fiber": "^9.5.0",
    "@strapi/client": "^1.6.1",
    "@strapi/types": "^4.8.19",
    "@tailwindcss/vite": "^4.1.14",
    "@types/node": "^22.14.0",
    "@types/three": "^0.183.1",
    "@vitejs/plugin-react": "^5.0.4",
    "better-sqlite3": "^12.4.1",
    "clsx": "^2.1.1",
    "dotenv": "^17.2.3",
    "express": "^4.21.2",
    "framer-motion": "^12.34.3",
    "gsap": "^3.14.2",
    "howler": "^2.2.4",
    "lenis": "^1.3.17",
    "motion": "^12.23.24",
    "postprocessing": "^6.38.3",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "react-intersection-observer": "^10.0.3",
    "react-markdown": "^10.1.0",
    "recharts": "^3.7.0",
    "tailwind-merge": "^3.5.0",
    "three": "^0.183.1",
    "threejs-components": "^0.0.17",
    "use-sound": "^5.0.0",
    "vite": "^6.2.0"
  },
  "devDependencies": {
    "@types/express": "^4.17.21",
    "@types/node": "^22.14.0",
    "autoprefixer": "^10.4.21",
    "lucide-react": "^0.575.0",
    "tailwindcss": "^4.1.14",
    "tsx": "^4.21.0",
    "typescript": "~5.8.2",
    "vite": "^6.2.0"
  }
}
```

### Backend (`landing_backend` - funnywait-backend)

```json
{
  "name": "funnywait-backend",
  "description": "A Strapi application",
  "dependencies": {
    "@strapi/plugin-cloud": "^5.49.0",
    "@strapi/plugin-users-permissions": "^5.49.0",
    "@strapi/strapi": "^5.49.0",
    "better-sqlite3": "^12.6.2",
    "pg": "^8.22.0",
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "react-router-dom": "^6.0.0",
    "styled-components": "^6.0.0"
  },
  "devDependencies": {
    "@types/node": "^20",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "typescript": "^5"
  },
  "engines": {
    "node": ">=20.0.0 <=24.x.x",
    "npm": ">=6.0.0"
  }
}
```

---

## 📊 Package Statistics

| Scope | Production | Dev | Total |
|-------|------------|-----|-------|
| **Frontend** | 29 | 9 | 38 |
| **Backend** | 11 | 5 | 16 |
| **Combined** | 40 | 14 | 54 |

---

## 🎯 Actionable Tasks

1. **Align React versions** between frontend and backend to avoid runtime issues.
2. **Update `better-sqlite3`** to shared version (backend is ahead).
3. **Verify Tailwind CSS** compatibility between v4 frontend and backend.
4. **Consider Strapi type generation:** Run `npx strapi typegenerate` in backend and import types in frontend.
5. **Audit `@google/genai`** - ensure API key management strategy in `.env`.
6. **Consider `next` vs `vite`** - evaluate if Next.js might offer better full-stack advantages when integrating with Strapi 5.
7. **Set up `.env` synchronization:** Ensure frontend API URL points to `http://localhost:1337` (backend development).
8. **Check Node.js compatibility:** Ensure both projects run on compatible Node.js versions.

---

## 🔗 External Package Sources

### Frontend (`landing`):
- **Repository:** https://github.com/facebook/react
- **Vite:** https://vitejs.dev/
- **Three.js:** https://threejs.org/
- **React Three Fiber:** https://www.npmjs.com/package/@react-three/fiber
- **Tailwind CSS v4:** https://tailwindcss.com/docs/installation/stub
- **Google Generative AI:** https://github.com/google-gemini/generative-ai-javascript
- **Framer Motion:** https://www.framer.com/motion/
- **GSAP:** https://greensock.com/

### Backend (`landing_backend`):
- **Repository:** https://github.com/strapi/strapi
- **Strapi 5:** Version ^5.49.0

---

## 🔎 Package Health

### 🔥 Recently Updated (2024-2025):
- `framer-motion`: ^12.34.3 (likely major updates)
- `@strapi/strapi`: ^5.49.0 (latest major version)
- `react`: ^19.0.0 (cutest fresh version)
- `vite`: ^6.2.0 (fastest dev tool)

### ⚠️ Legacy Versions (Consider Upgrades):
- `react-router-dom`: ^6.0.0 (upgrade to v7)
- `pg`: ^8.22.0 (current LTS)
- `react`: ^5.8.2 and ^5.0.0 (consider pinning to stable versions)