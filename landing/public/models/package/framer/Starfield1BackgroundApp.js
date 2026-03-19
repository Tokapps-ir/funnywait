// Welcome to Code in Framer
// Get Started: https://www.framer.com/developers

import { addPropertyControls, ControlType } from 'framer'
import { useEffect, useRef } from 'react'
import Starfield1Background from 'https://cdn.jsdelivr.net/npm/threejs-components@0.0.12/build/backgrounds/starfield1.cdn.min.js'

/**
 * These annotations control how your component sizes
 * Learn more: https://www.framer.com/developers/#code-components-auto-sizing
 *
 * @framerSupportedLayoutWidth fixed
 * @framerSupportedLayoutHeight fixed
 */
export default function Starfield1BackgroundApp (props = {}) {
  const { colors, map, velocity } = props
  const canvasRef = useRef(null)

  const app = useRef(null)

  useEffect(() => {
    app.current = Starfield1Background(canvasRef.current, {})
    return () => {
      app.current.dispose()
    }
  }, [])

  useEffect(() => {
    app.current.particles.setColors(colors)
  }, [JSON.stringify(colors)])

  useEffect(() => {
    if (map) app.current.particles.loadMap(map)
  }, [map])

  useEffect(() => {
    app.current.velocity = velocity
  }, [velocity])

  return <canvas ref={canvasRef} />
}

Starfield1BackgroundApp.defaultProps = {
  colors: ['#a70267', '#f10c49', '#fb6b41', '#f6d86b', '#339194'],
  map: null,
  velocity: 1
}

addPropertyControls(Starfield1BackgroundApp, {
  colors: {
    type: ControlType.Array,
    control: {
      type: ControlType.Color
    },
    maxCount: 5
  },
  map: {
    type: ControlType.File,
    allowedFileTypes: ['jpg', 'png']
  },
  velocity: {
    type: ControlType.Number,
    min: 0,
    max: 50,
    step: 0.1
  }
})
