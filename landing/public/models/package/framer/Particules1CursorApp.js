// Welcome to Code in Framer
// Get Started: https://www.framer.com/developers

import { addPropertyControls, ControlType } from 'framer'
import { useEffect, useRef } from 'react'
import Particles1Cursor from 'https://cdn.jsdelivr.net/npm/threejs-components@0.0.12/build/cursors/particles1.cdn.min.js'

/**
 * These annotations control how your component sizes
 * Learn more: https://www.framer.com/developers/#code-components-auto-sizing
 *
 * @framerSupportedLayoutWidth fixed
 * @framerSupportedLayoutHeight fixed
 */
export default function Particles1CursorApp (props = {}) {
  const {
    colors,
    color,
    size,
    decay,
    noiseCoordScale,
    noiseIntensity,
    noiseTimeCoef
  } = props
  const canvasRef = useRef(null)

  const app = useRef(null)

  useEffect(() => {
    app.current = Particles1Cursor(canvasRef.current, {})
    return () => {
      app.current.dispose()
    }
  }, [])

  useEffect(() => {
    app.current.particles.setColors(colors)
  }, [JSON.stringify(colors)])

  useEffect(() => {
    app.current.particles.uniforms.uColor.value.set(color)
  }, [color])

  useEffect(() => {
    app.current.particles.uniforms.uPointSize.value = size
  }, [size])

  useEffect(() => {
    app.current.particles.uniforms.uDecay.value = decay
  }, [decay])

  useEffect(() => {
    app.current.particles.uniforms.uNoiseCoordScale.value = noiseCoordScale
  }, [noiseCoordScale])

  useEffect(() => {
    app.current.particles.uniforms.uNoiseIntensity.value = noiseIntensity
  }, [noiseIntensity])

  useEffect(() => {
    app.current.particles.config.noiseTimeCoef = noiseTimeCoef
  }, [noiseTimeCoef])

  return <canvas ref={canvasRef} />
}

Particles1CursorApp.defaultProps = {
  colors: ['#00ff00', '#0000ff'],
  color: '#ff0000',
  size: 5,
  decay: 0.0025,
  noiseCoordScale: 0.5,
  noiseIntensity: 0.001,
  noiseTimeCoef: 0.1
}

addPropertyControls(Particles1CursorApp, {
  colors: {
    type: ControlType.Array,
    control: {
      type: ControlType.Color
    },
    maxCount: 5
  },
  color: {
    type: ControlType.Color
  },
  size: {
    type: ControlType.Number,
    min: 1,
    max: 50
  },
  decay: {
    type: ControlType.Number,
    min: 0.00001,
    max: 0.01,
    step: 0.00001
  },
  noiseCoordScale: {
    type: ControlType.Number,
    min: 0,
    max: 2,
    step: 0.001
  },
  noiseIntensity: {
    type: ControlType.Number,
    min: 0,
    max: 0.01,
    step: 0.00001
  },
  noiseTimeCoef: {
    type: ControlType.Number,
    min: 0.0001,
    max: 1,
    step: 0.0001
  }
})
