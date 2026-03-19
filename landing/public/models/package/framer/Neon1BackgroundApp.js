// Welcome to Code in Framer
// Get Started: https://www.framer.com/developers

import { addPropertyControls, ControlType } from 'framer'
import { useEffect, useRef } from 'react'
import { Neon1Background } from 'https://threejs-components.netlify.app/backgrounds/neon1.cdn.min.js'

/**
 * These annotations control how your component sizes
 * Learn more: https://www.framer.com/developers/#code-components-auto-sizing
 *
 * @framerSupportedLayoutWidth fixed
 * @framerSupportedLayoutHeight fixed
 */
export default function NeonBackgroundApp (props) {
  const { colors, points, closed, offsetScale, neonSize, velocity } = props
  const canvasRef = useRef(null)

  const app = useRef(null)

  useEffect(() => {
    app.current = Neon1Background(canvasRef.current)
    return () => {
      app.current.dispose()
    }
  }, [])

  useEffect(() => {
    app.current?.setColors(colors)
  }, [JSON.stringify(colors)])
  useEffect(() => {
    app.current?.setCurvePoints(points)
  }, [JSON.stringify(points)])
  useEffect(() => {
    app.current?.setCurveClosed(closed)
  }, [closed])
  useEffect(() => {
    app.current?.setCurveOffsetScale(offsetScale)
  }, [JSON.stringify(offsetScale)])
  useEffect(() => {
    app.current?.setNeonSize(neonSize)
  }, [neonSize])
  useEffect(() => {
    app.current?.setVelocity(velocity)
  }, [velocity])

  return <canvas ref={canvasRef} />
}

NeonBackgroundApp.defaultProps = {
  colors: ['#c7d8e2', '#aa3b8c', '#3c97ee'],
  points: [
    { x: 0, y: 5, z: 20 },
    { x: 0, y: 0, z: 0 },
    { x: 0, y: -5, z: 20 }
  ],
  closed: false,
  offsetScale: { x: 10, y: 0, z: 0 },
  neonSize: 3,
  velocity: 20
}

const numberControl = {
  type: ControlType.Number,
  defaultValue: 0,
  min: -50,
  max: 50,
  step: 0.1
}

const scaleNumberControl = {
  type: ControlType.Number,
  defaultValue: 0,
  min: 0,
  max: 20,
  step: 0.1
}

addPropertyControls(NeonBackgroundApp, {
  colors: {
    type: ControlType.Array,
    control: {
      type: ControlType.Color
    },
    maxCount: 3
  },
  points: {
    type: ControlType.Array,
    control: {
      type: ControlType.Object,
      controls: { x: numberControl, y: numberControl, z: numberControl },
      defaultValue: { x: 0, y: 0, z: 0 }
    },
    maxCount: 5
  },
  closed: {
    type: ControlType.Boolean
  },
  offsetScale: {
    type: ControlType.Object,
    controls: {
      x: scaleNumberControl,
      y: scaleNumberControl,
      z: scaleNumberControl
    }
  },
  neonSize: {
    type: ControlType.Number,
    min: 0,
    max: 20,
    step: 0.1
  },
  velocity: {
    type: ControlType.Number,
    min: 0,
    max: 100,
    step: 0.1
  }
})
