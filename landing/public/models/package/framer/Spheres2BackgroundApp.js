// Welcome to Code in Framer
// Get Started: https://www.framer.com/developers

import { addPropertyControls, ControlType } from 'framer'
import { useEffect, useRef } from 'react'
import Spheres2Background from 'https://cdn.jsdelivr.net/npm/threejs-components@0.0.9/build/backgrounds/spheres2.cdn.min.js'

/**
 * These annotations control how your component sizes
 * Learn more: https://www.framer.com/developers/#code-components-auto-sizing
 *
 * @framerSupportedLayoutWidth fixed
 * @framerSupportedLayoutHeight fixed
 */
export default function Spheres2BackgroundApp (props = {}) {
  const {
    count,
    colors,
    pointLightIntensity,
    directionalLightColor,
    directionalLightIntensity,
    minSize,
    maxSize,
    size0,
    attraction,
    friction,
    maxVelocity
  } = props
  const canvasRef = useRef(null)

  const app = useRef(null)

  useEffect(() => {
    app.current = Spheres2Background(canvasRef.current, {})
    return () => {
      app.current.dispose()
    }
  }, [])

  useEffect(() => {
    app.current?.setCount(count)
  }, [count])

  useEffect(() => {
    app.current?.spheres.setColors(colors)
  }, [JSON.stringify(colors)])

  useEffect(() => {
    if (app.current) { app.current.spheres.pointLight.intensity = pointLightIntensity }
  }, [pointLightIntensity])
  useEffect(() => {
    if (app.current) {
      app.current.spheres.directionalLight.color.set(
        directionalLightColor
      )
    }
  }, [directionalLightColor])
  useEffect(() => {
    if (app.current) {
      app.current.spheres.directionalLight.intensity =
                directionalLightIntensity
    }
  }, [directionalLightIntensity])

  useEffect(() => {
    if (app.current) {
      app.current.spheres.config.minSize = minSize
      app.current.spheres.config.maxSize = maxSize
      app.current.spheres.physics.setSizes()
    }
  }, [minSize, maxSize])

  useEffect(() => {
    if (app.current) {
      app.current.spheres.physics.sizeData[0] = size0
    }
  }, [size0])

  useEffect(() => {
    if (app.current) app.current.spheres.config.attraction = attraction
  }, [attraction])
  useEffect(() => {
    if (app.current) app.current.spheres.config.friction = friction
  }, [friction])
  useEffect(() => {
    if (app.current) app.current.spheres.config.maxVelocity = maxVelocity
  }, [maxVelocity])

  return <canvas ref={canvasRef} />
}

Spheres2BackgroundApp.defaultProps = {
  count: 200,
  colors: ['#ff0000', '#000000', '#ffffff'],
  pointLightIntensity: 150,
  directionalLightColor: 0xffffff,
  directionalLightIntensity: 5,
  minSize: 0.25,
  maxSize: 1,
  size0: 3,
  attraction: 0.15,
  friction: 0.9975,
  maxVelocity: 0.15
}

addPropertyControls(Spheres2BackgroundApp, {
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
  pointLightIntensity: {
    type: ControlType.Number,
    min: 0,
    max: 500
  },
  directionalLightColor: {
    type: ControlType.Color
  },
  directionalLightIntensity: {
    type: ControlType.Number,
    min: 0,
    max: 100
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
    max: 10,
    step: 0.1
  },
  attraction: {
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
