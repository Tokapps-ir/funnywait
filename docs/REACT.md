# React 19

## Overview

React 19 is the latest major version of React, the JavaScript library for building user interfaces. React 19 introduces significant improvements in performance, developer experience, and rendering capabilities.

**Version:** ^19.0.0  
**Homepage:** [https://react.dev/](https://react.dev/)  
**Repository:** [https://github.com/facebook/react](https://github.com/facebook/react)  
**License:** MIT

## Installation

```bash
npm install react react-dom@19.0.0
```

## Key Features

### 1. React 19 Runtime Improvements

React 19 brings a new runtime that automatically removes build-time overhead by default, making React faster without additional configuration.

```tsx
import { createRoot } from 'react-dom/client';

// The new React runtime is used by default in React 19
const root = createRoot(document.getElementById('root'));
root.render(<App />);
```

### 2. Automatic JavaScript Execution

React 19 enables automatic execution of inline JavaScript in templates by default, removing the need for manual transpilation in older versions.

```tsx
function Greeting({ name }) {
  return (
    <div>
      Hello <strong>{name}!</strong>
    </div>
  );
}
```

### 3. React Server Components

React 19 improves React Server Components (RSC) with better streaming support and reduced bundle sizes. Server components can be used in a standard React app without additional configuration.

```tsx
// Server component - shipped to server only
async function UserProfile() {
  [user] = await fetchUser(user.userId);
  
  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </div>
  );
}
```

### 4. `use` Hook

A new hook that provides easy access to data fetched in a parent Server component. The `use` hook suspends the component until it receives the data and then provides the data.

```tsx
function ClientPage({ userId }) {
  const [user] = use();
  
  return (
    <Suspense fallback={<Loading />}>
      <UserProfile userId={userId} />
    </Suspense>
  );
}
```

### 5. `<jsx>` and `<jsx>` Tags

React 19 introduces new JSX tags `<jsx>` and `<jsx>` for easier JSX syntax:

```tsx
// Old syntax
const element = <div>Hello</div>;

// With jsx transform
const jsx_element = <jsx div>Hello</jsx>;

// With jsx tag directly
const jsx_element <jsx div>Hello</jsx>;
```

### 6. React.memo Improvements

React.memo now has automatic dependency tracking. Components wrapped with `React.memo` don't need dependency arrays for comparison functions.

```tsx
// No more need for dependency array
const MemoryExpensiveComponent = React.memo(() => {
  return <ExpensiveComponent />;
});
```

### 7. `startTransition` API

A new API for marking updates as "not urgent," allowing React to batch and prioritize updates.

```tsx
import { startTransition } from 'react';

function Parent() {
  const [value, setValue] = useState('a');
  
  const onChange = () => setValue(() => 'b');
  
  return (
    <Suspense fallback={<Basic value={value} />}>
      <Advanced value={value} />
    </Suspense>
  );
}

startTransition(() => {
  onChange();
});
```

## API Reference

### Core Hooks

#### `useState`

```tsx
const [count, setCount] = useState(0);

// Functional update
setCount(prev => prev + 1);
```

#### `useEffect`

```tsx
useEffect(() => {
  document.title = 'Hello World';
  
  return () => {
    document.title = 'React';
  };
}, []);
```

#### `useRef`

```tsx
const input = useRef(null);
input.current.value = 'Hello';
```

#### `useMemo`

```tsx
const memoizedValue = useMemo(() => {
  const array = [1, 2, 3, 4, 5];
  return { length: array.length };
}, [array]);
```

#### `useLayoutEffect`

Similar to `useEffect` but synchronous with DOM measurements:

```tsx
useLayoutEffect(() => {
  // Sync DOM measurements
  const refs = elementRefs.map(ref => ref.current);
  
  return () => {
    // Cleanup
  };
}, []);
```

### New Hooks in React 19

#### `use`

```tsx
function Child() {
  const [user, setUser] = useState(null);
  return <div>User: {user.name}</div>;
}

function Parent() {
  return (
    <>
      <Child />
      <button onClick={() => setUser({ name: 'Jane' })}>
        <Child />
      </button>
    </>
  );
}
```

### Components

#### `<ErrorBoundary>`

```tsx
import { ErrorBoundary } from 'react-error-boundary';

function MyComponent() {
  // might throw errors
}

function Fallback({ error }) {
  return <div>Something went wrong: {error.message}</div>;
}

function App() {
  return (
    <ErrorBoundary fallback={<Fallback />} >
      <MyComponent />
    </ErrorBoundary>
  );
}
```

#### `Suspense`, `Cache`, `defaultProps`

Improved support for Suspense boundaries with better default behaviors.

## Three.js Integration

For 3D rendering, use React Three Fiber:

```tsx
import { Canvas } from '@react-three/fiber';
import { Sphere } from '@react-three/drei';

function Scene() {
  return (
    <Canvas>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 10]} />
      <Sphere position={[0, 0, 0]} />
    </Canvas>
  );
}
```

## Strapi Integration

For frontend React to connect with Strapi backend:

```tsx
import { client } from '@strapi/client';

export async function getData() {
  const posts = await client.collections.query('post', { populate: 'author' });
  return posts.data;
}
```

## Performance

- **Faster runtime** with automatic unmounting optimizations
- **Smarter re-renders** with dependency tracking
- **Lazy loading** by default for improved initial load time

## Migration Guide

```bash
# React 18 to 19 migration
npx react-native init MyApp --template react-template
npm install react@19 react-dom@19
```

## Breaking Changes

- Some patterns that were "safe" in 18 may now throw errors
- Check migration guide at [https://react.dev/blog/2024/03/07/react-19-migration-checklist](https://react.dev/blog/2024/03/07/react-19-migration-checklist)

## Related Packages

- `react-dom`: DOM renderer for browser
- `@react-three/fiber`: Three.js renderer
- `@react-three/drei`: Three.js helpers
- `@strapi/client`: Strapi frontend SDK
- `react-router-dom`: React router (compatible)