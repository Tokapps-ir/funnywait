# Howler.js

## Overview

Howler.js is a simple JavaScript interface to the Web Audio API backed by Google Chrome and the older HTML5 Audio API. Howler.js takes all the pain out of web audio!

**Version:** ^2.2.4  
**Homepage:** [https://howlerjs.com/](https://howlerjs.com/)  
**Repository:** [https://github.com/goldfire/howler.js](https://github.com/goldfire/howler.js)  
**License:** MIT

## Installation

```bash
npm install howler
```

## Installation

```bash
npm install howler howler-react
```

## Core Features

### 1. Audio Context Initialization

```javascript
// Initialize with Web Audio API backend (default)
// Falls back to HTML5 Audio on older browsers
import Howl from 'howler';

// Create audio instance
const sound = new Howl({
  src: ['/audio/sound.mp3', '/audio/sound.ogg'], // Try multiple formats
  autoplay: false,
  loop: false,
  volume: 1
});
```

### 2. Audio Options

```javascript
const sound = new Howl({
  src: '/audio/sound.mp3', // Required - source of audio file
  
  // Format support
  formats: ['mp3', 'ogg', 'wav'], // Specify allowed formats
  
  // Playback settings
  preload: false, // Preload audio file
  volume: 1, // 0 to 1
  loop: false, // Loop audio
  rate: 1, // Playback speed (default 1)
  
  // Audio positioning
  pos: 0, // Position in audio (in seconds)
  offset: 0, // Skip initial n seconds
  start: 0, // Start sound at position instead of position 0
  end: 60, // Duration of audio to play
  
  // Muted
  mute: false, // Mute all sounds
  
  // Web Audio API extensions
  pool: 2, // Minimum buffer objects to be preloaded in memory
  static: true, // Preload audio before playing
  native: false, // Force native HTML5 Audio
  
  // Debug mode
  debug: false, // Enable debug logging (`howl.play()` logs the object)
  
  // Preload mode
  preloadAudio: true, // Load audio on creation instead of first play
  preload: 'auto' // 'none', 'metadata', or 'auto'
  
  // Sprite definitions
  sprite: {
    mySound: {
      src: ['/audio/sound.mp3'],
      pitchMod: 1.05, // Modify pitch when playing
      offset: 0,
      loop: true
    }
  },
  
  // Custom callbacks
  onload: function () {
    console.log('Audio loaded: ' + this.name);
  },
  ontimeout: function () {
    console.log('Failed to load audio');
  },
  onend: function () {
    console.log('Audio playback complete');
  },
  onloaderror: function (id, err) {
    console.log('Load error:', err);
  },
  onplayerror: function (id, err) {
    console.log('Play error:', err);
  }
});
```

### 3. Basic Playback Controls

```javascript
// Start playing
sound.play();

// Pause
sound.pause();

// Start playing with position
sound.play(15); // Start at 15 seconds

// Stop audio
sound.stop();

// Get current state
sound.playing(); // bool - Is sound playing?
sound.fadeTo(0.5); // Crossfade to 0.5 volume over 1 sec
sound.fadeFrom(0);
```

### 4. Audio Sprites

```javascript
const music = new Howl({
  src: 'http://www.soundjay.com/futuristic-interface/futuristic-interface-music.mp3',
  sprite: {
    'start': 0,
    'stop': 18000, // duration in milliseconds
  }
});

// Play specific segment
music.play('start');
music.stop('stop');
```

### 5. Spatial Audio

```javascript
// Stereo panning
const sound1 = new Howl({ src: 'audio1.mp3' });
sound1.panner().pan(1); // Right
sound2.panner().pan(-1); // Left

// 3D positional audio
sound3 = new Howl({ src: 'audio.mp3' });
sound3.pos3d(0, 0, 5); // Position at x=0, y=0, z=5

// Update position
function updatePosition() {
  const listener = howler().listener();
  const listenerPos = { x: listener.x, y: listener.y, z: listener.z };
  const x = 50, y = -100, z = listenerPos.x - x;
  listener.x = x;
  listener.y = y; // 100 is top of page
  
  document.querySelectorAll('.spatial-audio').forEach(sound => {
    const audio = sound.play('my-spatial-sound');
    const soundObj = sound.howl;
    soundObj.pos3d(z, y, listenerPos.z);
    soundObj.pan(Math.sin(z / 25));
  });
}
```

### 6. Audio Playback Rate

```javascript
// Set playback speed
sound.rate(2); // Speed up
sound.rate(0.5); // Slow down

// Loop rate changes
sound.fadeTo = function (rate = 1, duration = 1) {
  this.rate(rate, duration);
};
```

## React Integration with Howler.js

```javascript
// Install React bindings for Howler.js
import Audio from 'howler-react';

// Usage in React component
import React, { useState, useEffect } from 'react';

function AudioPlayer({ children }) {
  const [playing, setPlaying] = useState(false);
  
  useEffect(() => {
    const sound = new Howl({ src: '/audio/sound.mp3' });
    
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    
    sound.on('play', onPlay);
    sound.on('pause', onPause);
    
    return () => {
      sound.off('play', onPlay);
      sound.off('pause', onPause);
    };
  }, []);
  
  const togglePlay = () => {
    if (!sound) return;
    playing ? sound.pause() : sound.play();
  };
  
  return (
    <button onClick={togglePlay}>
      {playing ? 'Pause' : 'Play'}
    </button>
  );
}
```

### Multiple Audio Sources

```javascript
// Array of possible sources (fallback approach)
const audioSources = [
  '/audio/sound.mp3',
  '/audio/sound.ogg'
];

const mySound = new Howl({
  src: audioSources
});

mySound.play(); // Browser chooses best format
```

### Lazy Loading Audio

```javascript
// Load audio on first play instead of initial load
const mySound = new Howl({
  src: '/audio/sound.mp3',
  preload: false
});

function AudioButton() {
  const [play, setPlay] = useState(() => {
    setPlay(mySound.play());
    return () => mySound.stop();
  });
  
  return <button onClick={play}>Play</button>;
}
```

## State Management

```javascript
// Track audio state
const audioState = {
  playing: false,
  volume: 1,
  duration: 30,
  currentTime: 0
};

function AudioController({ source = 'audio' }) {
  const [state, setState] = useState({ ...audioState });
  
  const playSound = () => {
    howl[state.state.play]().play();
  };
  
  const pauseSound = () => {
    howl[state.state.play]().pause();
  };
  
  const stopSound = () => {
    howl[state.state.play]().stop();
  };
  
  const seek = seekTo => {
    howl[state.state.play]().seek(seekTo);
  };
}
```

## Best Practices

### 1. Multiple Audio Formats

```javascript
// Browser compatibility - provide multiple formats
const music = new Howl({
  src: [
    '/audio/music.mp3',    // Modern browsers
    '/audio/music.ogg'     // Firefox
  ]
});
```

### 2. Audio Pool Management

```javascript
// Configure pool for multiple audio instances
const gameAudio = new Howl({
  src: 'game-music.mp3',
  pool: 8 // Keep 8 instances preloaded
});

const soundEffect = new Howl({
  src: 'sound-effect.mp3',
  pool: 4 // Keep 4 instances preloaded
});
```

### 3. Volume Management

```javascript
// Global volume control
howler().unmute(); // Mute all sounds
howler().muted(mute); // Mute or unmute

// Individual audio levels
const sound = new Howl({ /* ... */ });
sound.volume(1); // Set volume (0-1)
```

### 4. Error Handling

```javascript
sound.on('loaderror', (id, err) => {
  console.error('Error loading sound:', err);
});

sound.on('playerror', (id, err) => {
  console.error('Error playing sound:', id, err);
});

sound.on('formaterror', (id, msg) => {
  console.error('Format playback error at:', msg);
});
```

### 5. Audio Context Suspense

```javascript
// Wait for user interaction before playing audio
const myAudio = new Howl({
  src: 'audio.mp3',
  volume: 1,
  preload: 'auto'
});

const [play, setPlay] = useState(() => {
  // Play on first user interaction
  myAudio.play();
  return () => myAudio.stop();
});

// Handle AudioContext not being ready
function useAudioContext() {
  const audioContext = useRef(new (window.AudioContext || window.webkitAudioContext)());
  
  useEffect(() => {
    audioContext.current.resume().catch(() => {
      console.log('AudioContext suspended');
    });
  }, []);
  
  return audioContext;
}
```

## API Reference

### Howl Methods

```javascript
const sound = new Howl({})

// Playback control
sound.play(callback, buffer)
sound.pause()
sound.stop()
sound.seek(seek)
sound.seekBy(seek, nowPlaying = false)
sound.fadeTo(amount, speed) // Crossfade
sound.fadeFrom(amount, speed)
sound.fade(amount, nowPlaying, speed, direction)
```

### Sound State

```javascript
// Check if playing
sound.playing()

// Volume control
sound.volume(vol)

// Mute all sounds
sound.mute(muted)

// Position
sound.pos(position)

// Playback rate
sound.rate(rate)

// Get duration
sound.duration()

// Get current time
sound.seek()

// Get state
sound.state()
```

### Callbacks

```javascript
sound.on('play', callback)
sound.on('pause', callback)
sound.on('end', callback)
sound.on('loadedmetadata', callback)
sound.on('load', callback)
sound.on('complete', callback)
sound.on('loaderror', callback)
sound.on('playerror', callback)
sound.on('seek', callback)
```

## Resources

- [Official Documentation](https://howlerjs.com/)
- [GitHub](https://github.com/goldfire/howler.js)
- [Howler.js Examples](https://howlerjs.com/docs/examples/)