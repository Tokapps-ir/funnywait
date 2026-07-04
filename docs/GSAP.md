# GSAP Animation

## Overview

GSAP (GreenSock Animation Platform) is a powerful JavaScript animation library for creating high-performance animations with ease. It works across all browsers and devices without requiring JavaScript enabled for basic animations.

**Version:** ^3.14.2  
**Homepage:** [https://greensock.com/gsap](https://greensock.com/gsap)  
**Repository:** [https://github.com/greensock/GSAP](https://github.com/greensock/GSAP)  
**License:** Commercial

## Installation

```bash
npm install gsap@3.14.2
npm install gsap@3.14.2 --save-dev
```

## Core Features

### 1. Tweening

Create animations by interpolating between values:

```javascript
import gsap from 'gsap';

// Animate a single element
gsap.to('#myElement', {
  x: 100,
  y: 50,
  opacity: 1,
  duration: 1
});

// Animate multiple elements with same values
gsap.to('.myElements', {
  x: 100,
  duration: 1
});
```

### 2. From Animations

Animate from current values to target values:

```javascript
gsap.from('.myElements', {
  x: -100,
  duration: 1,
  ease: 'power2.out'
});
```

### 3. Timeline

Sequence multiple animations with precise timing:

```javascript
import { gsap } from 'gsap';
import { TimelineMax } from 'gsap';

const tl = new TimelineMax();

tl.to('#header', { duration: 1 })
  .from('#hero', 1, { onStart: () => console.log('hero starts') })
  .from('#footer', 1, { onStart: () => console.log('footer starts') });

tl.play();
```

### 4. ScrollTrigger

Trigger animations on scroll:

```javascript
import gsap, { ScrollTrigger } from 'gsap';

gsap.registerPlugin(ScrollTrigger);

gsap.to('#hero', {
  x: () => window.innerWidth / 2,
  y: 100,
  duration: 2,
  scrollTrigger: {
    trigger: '#hero-section',
    start: 'top 80%',
    end: 'bottom 20%',
    scrub: 1 // Smooth scroll-based animation
  }
});
```

### 5. Pin Elements

Pin content to screen and animate behind:

```javascript
gsap.to('#hero-section', {
  y: '-100%',
  duration: 3,
  scrollTrigger: {
    trigger: '#hero-section',
    start: 'top center',
    pin: true,
    pinSpacing: false
  }
});
```

### 6. Scrub Animation

Link animation playback to scroll position:

```javascript
gsap.to('#hero', {
  scrollTrigger: {
    trigger: '#hero-section',
    start: 'top 50%',
    scrub: 1
  }
});
```

## API Reference

### Core Methods

#### `gsap.to()`

```javascript
// Basic usage
// target.selector | target.element | target.object | targets:array | targets:object
gsap.to(target, {
  properties: value // or: function
  duration
  delay
  ease
  onComplete
  onRepeat
  onStart
  onEnterBack
  onUpdate
})
```

#### `gsap.from()`

```javascript
// Reverse of to()
gsap.from(target, {
  properties: value,
  delay
  ...same properties
})
```

#### `gsap.to()` with string properties

```javascript
// String properties
gsap.fromTo('#myElement', {
  xPercent: -100
}, {
  xPercent: '100%',
  duration: 2
});
```

### Easing Functions

```javascript
import gsap from 'gsap';

// Built-in easings
ease: 'power1.out'
ease: 'power2.inOut'
ease: 'bounce.out'
ease: 'elastic.out'
ease: 'sine.out'
ease: 'expo.out'
ease: 'back.out'
ease: 'circ.out'

// Custom easing with function
const customEase = gsap.utils.ease.map([0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1], () => 1);
gsap.to('#myElement', { x: 100, duration: 1, ease: customEase });
```

### Timeline Methods

```javascript
const tl = new gsap.timeline();

// Add a tween to timeline
tl.to('#myElement', { duration: 2 });

// Create a sub-timeline
const subTL = new gsap.timeline({
  onComplete: () => {
    console.log('Animation complete');
  }
});
```

### ScrollTrigger Configuration

```javascript
const trigger = ScrollTrigger.create({
  trigger: '.trigger-element',
  start: 'top center',
  end: 'bottom bottom',
  toggleActions: 'play none none reverse'
});

gsap.fromTo('#myElement', {
  opacity: 0.1
}, {
  opacity: 0.8,
  scrollTrigger: trigger
});
```

### Refresh and Clean Up

```javascript
// Reset ScrollTrigger positions
ScrollTrigger.refresh();

// Cleanup when removing elements
gsap.from('#myElement', {
  scrollTrigger: {
    toggleActions: 'play none none none'
  }
});

// Remove animation
tl.pause(); // Pause
tl.resume(); // Resume
tl.invalidate(); // Force re-calculation
```

## Best Practices

### 1. Reusable Classes

```javascript
// Define reusable animation classes
const revealClass = document.querySelector('.reveal-animation');

function revealOnScroll(targetElement, options = {}) {
  const defaults = {
    duration: 1,
    delay: 0,
    offset: 0,
    opacity: 1
  };

  const config = { ...defaults, ...options };

  revealClass.style.opacity = 0;
  gsap.to(revealClass, {
    opacity: config.opacity,
    duration: config.duration,
    delay: config.delay,
    scrollTrigger: {
      trigger: revealClass,
      start: 'top ' + config.offset,
      scrub: config.scrub
    }
  });
}

// Usage
revealOnScroll(document.getElementById('hero'), { 
  offset: '-80%', 
  duration: 1.5 
});
```

### 2. Responsive Timelines

```javascript
function createResponsiveTimeline() {
  gsap.matchMedia().add('screen >= 1200px', () => {
    // Timeline config for wide screens
  }).add('screen <= 600px', () => {
    // Timeline config for mobile
  });
}

const tl = gsap.timeline();
tl.from('#element', { duration: 2 });

createResponsiveTimeline();
```

### 3. Performance Tips

- Use `scrollTrigger` instead of `window.addEventListener('scroll')`
- Limit simultaneous animations
- Use `scrub` for smoother scroll-based animations
- Consider `ScrollSmoother` for better performance
- Clean up ScrollTriggers on element removal

```javascript
// Efficient scroll-based animation
const scrollTriggers = ScrollTrigger.batch('.item', {
  start: 'top 90%',
  toggleClass: 'animate'
});

gsap.to('.item', {
  autoAlpha: 1,
  y: 10,
  duration: 1,
  stagger: 0.2,
  scrollTrigger: scrollTriggers
});
```

## Plugins

### Register Plugin

```javascript
// Import and register plugins
import gsap, { ScrollTrigger, ScrollSmoother, Ticker } from 'gsap';

// Register plugins
gsap.registerPlugin(ScrollTrigger, ScrollSmoother, Ticker);

// Use plugins
ScrollTrigger.create({ trigger: '.element' });
```

### Custom Plugins

```javascript
function plugin() {
  // Custom logic
};

gsap.registerPlugin(plugin);
```

### Plugin Categories

- **Scroll Plugins:** ScrollTrigger, ScrollSmoother
- **Transform Plugins:** MotionPath, TextPlugin, MorphSVG
- **SVG Plugins:** CSSPlugin, MorphSVGPlugin
- **Timing Plugins:** BezierPlugin, CustomEase
- **Animation Plugins:** Magnetic, Flip, SplitText

## Resources

- [Official Documentation](https://greensock.com/docs/)
- [Examples](https://greensock.com/#examples)
- [Plugin Catalog](https://greensock.com/plugins/)
- [Forum](https://forum.greensock.com/)