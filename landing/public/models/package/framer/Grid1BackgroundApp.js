// Welcome to Code in Framer
// Get Started: https://www.framer.com/developers

import { addPropertyControls, ControlType } from 'framer'
import { useEffect, useRef } from 'react'
import Grid1Background from 'https://cdn.jsdelivr.net/npm/threejs-components@0.0.15/build/backgrounds/grid1.cdn.min.js'

/**
 * These annotations control how your component sizes
 * Learn more: https://www.framer.com/developers/#code-components-auto-sizing
 *
 * @framerSupportedLayoutWidth fixed
 * @framerSupportedLayoutHeight fixed
 */
export default function Grid1BackgroundApp (props = {}) {
  const {
    type,
    n,
    light1Color,
    light1Intensity,
    light1PositionZ,
    light2Color,
    light2Intensity,
    light2PositionZ,
    colors
  } = props
  const canvasRef = useRef(null)

  const app = useRef(null)

  useEffect(() => {
    app.current = Grid1Background(canvasRef.current, { type, n })
    return () => {
      app.current.dispose()
    }
  }, [type, n])

  // light 1
  useEffect(() => {
    app.current.grid.light1.color.set(light1Color)
  }, [light1Color])

  useEffect(() => {
    app.current.grid.light1.intensity = light1Intensity
  }, [light1Intensity])

  useEffect(() => {
    app.current.grid.light1.positionZ = light1PositionZ
  }, [light1PositionZ])

  // light 2
  useEffect(() => {
    app.current.grid.light2.color.set(light2Color)
  }, [light2Color])

  useEffect(() => {
    app.current.grid.light2.intensity = light2Intensity
  }, [light2Intensity])

  useEffect(() => {
    app.current.grid.light2.positionZ = light2PositionZ
  }, [light2PositionZ])

  // colors
  useEffect(() => {
    app.current.grid.setColors(colors)
  }, [JSON.stringify(colors)])

  return <canvas ref={canvasRef} />
}

Grid1BackgroundApp.defaultProps = {
  type: 'hexagon',
  n: 20,
  light1Color: '#ffffff',
  light1Intensity: 500,
  light1PositionZ: 5,
  light2Color: '#ff0000',
  light2Intensity: 250,
  light2PositionZ: -20,
  colors: ['#0000ff', '#202020', '#ffffff']
}

addPropertyControls(Grid1BackgroundApp, {
  type: {
    type: ControlType.Enum,
    defaultValue: 'hexagon',
    options: ['triangle', 'square', 'hexagon']
  },
  n: {
    type: ControlType.Enum,
    defaultValue: 20,
    options: [10, 20, 30, 40, 50]
  },
  light1Color: {
    type: ControlType.Color
  },
  light1Intensity: {
    type: ControlType.Number,
    min: 0,
    max: 1500
  },
  light1PositionZ: {
    type: ControlType.Number,
    min: 0,
    max: 50
  },
  light2Color: {
    type: ControlType.Color
  },
  light2Intensity: {
    type: ControlType.Number,
    min: 0,
    max: 1500
  },
  light2PositionZ: {
    type: ControlType.Number,
    min: -50,
    max: 0
  },
  colors: {
    type: ControlType.Array,
    control: {
      type: ControlType.Color
    },
    maxCount: 5
  }
})
