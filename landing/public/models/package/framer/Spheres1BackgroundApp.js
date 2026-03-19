// Welcome to Code in Framer
// Get Started: https://www.framer.com/developers

import { addPropertyControls, ControlType } from 'framer'
import { useEffect, useRef } from 'react'
import Spheres1Background from 'https://cdn.jsdelivr.net/npm/threejs-components@0.0.8/build/backgrounds/spheres1.cdn.min.js'

/**
 * These annotations control how your component sizes
 * Learn more: https://www.framer.com/developers/#code-components-auto-sizing
 *
 * @framerSupportedLayoutWidth fixed
 * @framerSupportedLayoutHeight fixed
 */
export default function Spheres1BackgroundApp (props) {
  const { count, colors, minSize, maxSize, size0, gravity, friction, maxVelocity } = props
  const canvasRef = useRef(null)

  const app = useRef(null)

  useEffect(() => {
    app.current = Spheres1Background(canvasRef.current)
    return () => {
      app.current.dispose()
    }
  }, [])

  useEffect(() => {
    if (app.current) app.current.setCount(count)
  }, [count])

  useEffect(() => {
    app.current?.spheres.setColors(colors)
  }, [JSON.stringify(colors)])

  useEffect(() => {
    if (app.current) {
      app.current.spheres.config.minSize = minSize
      app.current.spheres.config.maxSize = maxSize
      app.current.spheres.config.size0 = size0
      app.current.spheres.physics.setSizes()
    }
  }, [minSize, maxSize, size0])

  useEffect(() => { if (app.current) app.current.spheres.config.gravity = gravity }, [gravity])
  useEffect(() => { if (app.current) app.current.spheres.config.friction = friction }, [friction])
  useEffect(() => { if (app.current) app.current.spheres.config.maxVelocity = maxVelocity }, [maxVelocity])

  return <canvas ref={canvasRef} />
}

Spheres1BackgroundApp.defaultProps = {
  count: 200,
  colors: ['#0000ff', '#000000', '#ffffff'],
  minSize: 0.5,
  maxSize: 1,
  size0: 1,
  gravity: 0.5,
  friction: 0.9975,
  maxVelocity: 0.15
}

addPropertyControls(Spheres1BackgroundApp, {
  count: {
    type: ControlType.Enum,
    defaultValue: 200,
    options: [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000]
  },
  colors: {
    type: ControlType.Array,
    control: {
      type: ControlType.Color
    },
    maxCount: 3
  },
  minSize: {
    type: ControlType.Number,
    min: 0.1,
    max: 0.5,
    step: 0.1
  },
  maxSize: {
    type: ControlType.Number,
    min: 0.5,
    max: 1,
    step: 0.1
  },
  size0: {
    type: ControlType.Number,
    min: 0.1,
    max: 1,
    step: 0.1
  },
  gravity: {
    type: ControlType.Number,
    min: 0,
    max: 1,
    step: 0.001
  },
  friction: {
    type: ControlType.Number,
    min: 0.5,
    max: 1,
    step: 0.0001
  },
  maxVelocity: {
    type: ControlType.Number,
    min: 0,
    max: 0.5,
    step: 0.001
  }
})
