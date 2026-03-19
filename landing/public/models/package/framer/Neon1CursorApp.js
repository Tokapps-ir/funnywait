// Welcome to Code in Framer
// Get Started: https://www.framer.com/developers

import { addPropertyControls, ControlType } from 'framer'
import { useEffect, useRef } from 'react'
import { Neon1Cursor } from 'https://threejs-components.netlify.app/cursors/neon1.cdn.min.js'
// import { Neon1Cursor } from "https://unpkg.com/threejs-components@0.0.1/build/cursors/neon1.cdn.min.js"

/**
 * These annotations control how your component sizes
 * Learn more: https://www.framer.com/developers/#code-components-auto-sizing
 *
 * @framerSupportedLayoutWidth fixed
 * @framerSupportedLayoutHeight fixed
 */
export default function NeonCursorApp (props) {
  const {
    colors,
    radius1,
    radius2,
    sleepRadiusX,
    sleepRadiusY,
    sleepTimeScale1,
    sleepTimeScale2
  } = props

  const canvasRef = useRef(null)
  const app = useRef(null)

  useEffect(() => {
    app.current = Neon1Cursor(canvasRef.current)
    return () => {
      app.current.dispose()
    }
  }, [])

  useEffect(() => {
    app.current.setColors(colors)
  }, [JSON.stringify(colors)])

  useEffect(() => {
    app.current.neon.config.radius1 = radius1
    app.current.neon.config.radius2 = radius2
    app.current.neon.updateUniforms()
  }, [radius1, radius2])

  useEffect(() => {
    app.current.neon.config.sleepRadiusX = sleepRadiusX
    app.current.neon.config.sleepRadiusY = sleepRadiusY
  }, [sleepRadiusX, sleepRadiusY])

  useEffect(() => {
    app.current.neon.config.sleepTimeScale1 = sleepTimeScale1
    app.current.neon.config.sleepTimeScale2 = sleepTimeScale2
  }, [sleepTimeScale1, sleepTimeScale2])

  return <canvas ref={canvasRef} />
}

NeonCursorApp.defaultProps = {
  colors: ['#0000ff', '#ff0000'],
  radius1: 5,
  radius2: 5,
  sleepRadiusX: 50,
  sleepRadiusY: 50,
  sleepTimeScale1: 2,
  sleepTimeScale2: 2
}

addPropertyControls(NeonCursorApp, {
  colors: {
    type: ControlType.Array,
    control: {
      type: ControlType.Color
    },
    maxCount: 3
  },
  radius1: {
    type: ControlType.Number,
    min: 0,
    max: 20
  },
  radius2: {
    type: ControlType.Number,
    min: 0,
    max: 100
  },
  sleepRadiusX: {
    type: ControlType.Number,
    min: 0,
    max: 500
  },
  sleepRadiusY: {
    type: ControlType.Number,
    min: 0,
    max: 500
  },
  sleepTimeScale1: {
    type: ControlType.Number,
    min: 0,
    max: 10,
    step: 0.1
  },
  sleepTimeScale2: {
    type: ControlType.Number,
    min: 0,
    max: 10,
    step: 0.1
  }
})
