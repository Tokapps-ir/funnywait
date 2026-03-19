// Welcome to Code in Framer
// Get Started: https://www.framer.com/developers

import { addPropertyControls, ControlType } from 'framer'
import { useEffect, useRef } from 'react'
import { Bokeh1Background } from 'https://threejs-components.netlify.app/backgrounds/bokeh1.cdn.min.js'

/**
 * These annotations control how your component sizes
 * Learn more: https://www.framer.com/developers/#code-components-auto-sizing
 *
 * @framerSupportedLayoutWidth fixed
 * @framerSupportedLayoutHeight fixed
 */
export default function Bokeh1BackgroundApp (props) {
  const {
    bgColor,
    colors,
    opacity,
    blurLevel,
    focalLength,
    focusDistance,
    minScale,
    maxScale
  } = props

  const canvasRef = useRef(null)
  const app = useRef(null)

  useEffect(() => {
    app.current = Bokeh1Background(canvasRef.current)
    app.current.loadMap(
      'https://threejs-components.netlify.app/assets/bokeh-particles.png'
    )
    return () => {
      app.current.dispose()
    }
  }, [])

  useEffect(() => {
    app.current.setColors(colors)
  }, [JSON.stringify(colors)])

  useEffect(() => {
    app.current.setBackgroundColor(bgColor)
  }, [bgColor])

  useEffect(() => {
    app.current.particles.material.opacity = opacity
  }, [opacity])

  useEffect(() => {
    app.current.particles.uniforms.uBlurLevel.value = blurLevel
  }, [blurLevel])

  useEffect(() => {
    app.current.particles.uniforms.uBlurLevel.value = blurLevel
  }, [blurLevel])

  useEffect(() => {
    app.current.particles.uniforms.uFocalLength.value = focalLength
  }, [focalLength])

  useEffect(() => {
    app.current.particles.uniforms.uFocusDistance.value = focusDistance
  }, [focusDistance])

  useEffect(() => {
    app.current.particles.uniforms.uMinScale.value = minScale
  }, [minScale])

  useEffect(() => {
    app.current.particles.uniforms.uMaxScale.value = maxScale
  }, [maxScale])

  return <canvas ref={canvasRef} />
}

Bokeh1BackgroundApp.defaultProps = {
  bgColor: '#000000',
  colors: ['#0000ff', '#ff0000'],
  opacity: 0.5,
  blurLevel: 4,
  focalLength: 1,
  focusDistance: 1,
  minScale: 0.1,
  maxScale: 1.4
}

addPropertyControls(Bokeh1BackgroundApp, {
  bgColor: {
    type: ControlType.Color
  },
  colors: {
    type: ControlType.Array,
    control: {
      type: ControlType.Color
    },
    maxCount: 3
  },
  opacity: {
    type: ControlType.Number,
    min: 0,
    max: 1,
    step: 0.01
  },
  blurLevel: {
    type: ControlType.Number,
    min: 0,
    max: 6,
    step: 1
  },
  focalLength: {
    type: ControlType.Number,
    min: 0,
    max: 2,
    step: 0.01
  },
  focusDistance: {
    type: ControlType.Number,
    min: 0.01,
    max: 2,
    step: 0.01
  },
  minScale: {
    type: ControlType.Number,
    min: 0.01,
    max: 2,
    step: 0.01
  },
  maxScale: {
    type: ControlType.Number,
    min: 0.01,
    max: 2,
    step: 0.01
  }
})
