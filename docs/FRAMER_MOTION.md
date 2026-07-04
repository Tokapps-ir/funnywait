# Framer Motion

## Overview

Framer Motion is a production-ready motion library for React that provides an intuitive, declarative way to animate and interact with components. It's built on top of Framer, a no-code design tool.

**Version:** ^12.34.3  
**Homepage:** [https://www.framer.com/motion/](https://www.framer.com/motion/)  
**Repository:** [https://github.com/pmndfr/framer](https://github.com/pmndfr/framer)  
**License:** MIT

## Installation

```bash
npm install framer-motion
```

## Key Features

### 1. Declarative Animations

Animate components with a declarative syntax:

```tsx
import { motion } from 'framer-motion';

function Example() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    />
  );
}
```

### 2. Transition Types

#### Spring Animations

Physics-based animations with spring properties:

```tsx
<motion.div
  initial={{ rotate: 0 }}
  animate={{ rotate: 360 }}
  transition={{
    type: 'spring',
    stiffness: 50,
    damping: 3,
    mass: 1
  }}
/>
```

- **stiffness**: How quickly the spring moves (default: 100)
- **damping**: Friction factor (default: 10)
- **mass**: Weight of the object (default: 1)

#### Tween Animations

Time-based animations with easing:

```tsx
<motion.div
  initial={{ x: 0 }}
  animate={{ x: 100 }}
  transition={{
    ease: 'easeOut',
    duration: 1
  }}
/>
```

#### Presets

Quick presets for common animation behaviors:

```tsx
transition: {
  type: 'tween', // Linear or bezier-based
  ease: 'linear' // or 'easeIn', 'easeOut', 'easeInOut', 'circOut'
}
```

### 3. Transform Animations

Animate CSS transforms independently:

```tsx
<motion.div
  initial={{ x: 0, y: 0, rotate: 0 }}
  animate={{ 
    x: 100,
    y: 100,
    rotate: 360
  }}
/>
```

Supported transforms:
- **x, y, z**: Translations
- **scale, scaleX, scaleY, scaleZ**: Scaling
- **rotate, rotateX, rotateY, rotateZ**: Rotation
- **skewX, skewY**: Skewing
- **perspective**: Perspective depth

### 4. Transition Configuration

```tsx
<motion.div
  animate={{ opacity: 1, scale: 1 }}
  whileHover={{ opacity: 0.7, scale: 1.1 }}
  whileTap={{ opacity: 0.8, scale: 0.95 }}
  transition={{
    type: 'spring',
    stiffness: 300,
    damping: 17
  }}
/>
```

### 5. Animation Controls

Use `useSpring` for imperative animations:

```tsx
import { useAtomValue, useAtom } from 'jotai';
import { atom } from 'atom';

const springAtom = atom({
  stiffness: 50,
  damping: 3,
  mass: 1
});

function Counter() {
  const [scope, animate] = useSpring(() => atom(0));
  
  return (
    <motion.button onClick={() => animate(scope, 1)}>
      Count: {scope.value}
    </motion.button>
  );
}
```

### 6. Variants

Define reusable animation states:

```tsx
const list = [
  { name: 'First', value: 1 },
  { name: 'Second', value: 2 },
  { name: 'Third', value: 3 }
];

const variants = {
  hidden: { opacity: 0, scale: 0.5 },
  visible: (index) => ({ 
    opacity: 1, 
    scale: 1,
    transition: { delay: index * 0.1 }
  }),
  exit: { opacity: 0, scale: 0.5 }
};

function Example() {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={variants}
    />
  );
}
```

### 7. Stagger Children

Animate lists with staggered timing:

```tsx
const variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1 // 100ms delay between children
    }
  }
};

<ul>
  {items.map((item) => (
    <motion.li variants={variants} />
  ))}
</ul>
```

### 8. Layout Animations

Animate layout changes declaratively:

```tsx
import { AnimatePresence } from 'framer-motion';

function ListWithLayout() {
  const [items, setItems] = useState(['Item 1', 'Item 2']);
  
  return (
    <AnimatePresence>
      <motion.ul 
        initial={{ opacity: 1 }}
        exit={{ opacity: 0, transition: { duration: 0.5 } }}
      >
        {items.map((item, index) => (
          <motion.li key={index} initial={{ opacity: 0, scale: 0.5 }} />
        ))}
      </motion.ul>
    </AnimatePresence>
  );
}
```

### 9. Gesture Animations

Respond to user interactions:

```tsx
<motion.button
  whileHover={{ scale: 1.05, transition: { type: 'spring', stiffness: 400, damping: 12 } }}
  whileTap={{ scale: 0.95, transition: { type: 'spring', stiffness: 400, damping: 12 } }}
>
  Click me
</motion.button>
```

## Transformations

### 1. Translate

```tsx
<motion.div animate={{ y: 100, x: 200 }} />
```

### 2. Scale

```tsx
<motion.div animate={{ scale: 2 }} initial={{ scale: 0 }} />
```

### 3. Rotate

```tsx
<motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity }} />
```

### 4. Skew

```tsx
<motion.div animate={{ skewX: 45, skewY: -45 }} />
```

### 5. Perspective

```tsx
<motion.div 
  style={{ perspective: 500 }}
  animate={{ rotateX: 720 }} 
/>
```

## Color Animations

```tsx
// Simple color interpolation
<motion.div animate={{ backgroundColor: 'hotpink' }} />

// Complex color animations
<motion.div
  animate={{ color: 'hotpink' }}
  animate={{ backgroundColor: ['rgba(0,0,0,0)', 'rgba(255,0,0,0.1)'] }}
  transition={{ duration: 2, repeat: Infinity }}
/>
```

## CSS Variables

Animate CSS custom properties:

```tsx
<motion.div
  animate={{ '--rotate': '360deg', '--opacity': 1 }}
  transition={{ duration: 2, repeat: Infinity }}
/>
```

## Combining with Other Libraries

### With React Three Fiber

```tsx
import { motion } from 'framer-motion';
import { Canvas } from '@react-three/fiber';

function Scene() {
  return (
    <Canvas>
      <motion.mesh>
        {/* React-three-fiber content */}
      </motion.mesh>
    </Canvas>
  );
}
```

### With GSAP

Framer Motion integrates well with GSAP for timeline-based animations.

## Performance Tips

1. **Use Spring for interactive animations**
2. **Avoid animating too many elements**
3. **Use `will-change` for complex animations**
4. **Consider CSS transitions for simple animations**

## Best Practices

### 1. Spring Physics

For UI interactions, spring physics feel more natural:

```tsx
<motion.button
  whileHover={{ 
    scale: 1.02,
    transition: { type: 'spring', stiffness: 400, damping: 17 }
  }}
  whileTap={{ 
    scale: 0.98,
    transition: { type: 'spring', stiffness: 400, damping: 17 }
  }}
/>
```

### 2. Stagger Lists

```tsx
<motion.ul>
  {items.map((item, i) => (
    <motion.li
      key={item.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        type: 'spring',
        delay: i * 0.1
      }}
    />
  ))}
</motion.ul>
```

### 3. Layout Transitions

```tsx
<motion.div
  layout
  animate={{ width: newWidth }}
/>
```

## Resources

- [Official Documentation](https://www.framer.com/motion/)
- [Motion Library](https://motion.dev/) - Framer Motion for vanilla JS
- [Framer Motion Examples](https://www.framer.com/motion/)
- [Animation Handbook](https://motion.dev/resources/handbook/)

## Related Packages

- `react`: Core React framework
- `@react-three/fiber`: Three.js renderer
- `@react-three/drei`: Three.js helpers
- `gsap`: GreenSock Animation Platform (alternative)