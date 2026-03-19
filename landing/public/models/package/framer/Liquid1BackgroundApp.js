// Welcome to Code in Framer
// Get Started: https://www.framer.com/developers

import { addPropertyControls, ControlType } from 'framer'
import { useEffect, useRef } from 'react'
import { Liquid1Background } from 'https://threejs-components.netlify.app/backgrounds/liquid1.cdn.min.js'

/**
 * These annotations control how your component sizes
 * Learn more: https://www.framer.com/developers/#code-components-auto-sizing
 *
 * @framerSupportedLayoutWidth fixed
 * @framerSupportedLayoutHeight fixed
 */
export default function Liquid1BackgroundApp (props) {
  const {
    attenuation,
    color,
    image,
    envMap,
    envMapIntensity,
    metalness,
    roughness,
    rain,
    rainTime
  } = props
  const canvasRef = useRef(null)

  const app = useRef(null)

  useEffect(() => {
    app.current = Liquid1Background(canvasRef.current)
    return () => {
      app.current.dispose()
    }
  }, [])

  useEffect(() => {
    app.current.setAttenuation(attenuation)
  }, [attenuation])

  useEffect(() => {
    app.current.setColor(color)
  }, [color])

  useEffect(() => {
    app.current.loadImage(image)
  }, [image])

  useEffect(() => {
    app.current.loadEnvMap(envMap)
  }, [envMap])

  useEffect(() => {
    app.current.setEnvMapIntensity(envMapIntensity)
  }, [envMapIntensity])

  useEffect(() => {
    app.current.setMetalness(metalness)
  }, [metalness])

  useEffect(() => {
    app.current.setRoughness(roughness)
  }, [roughness])

  useEffect(() => {
    app.current.setRain(rain)
  }, [rain])

  useEffect(() => {
    app.current.setRainTime(rainTime)
  }, [rainTime])

  return <canvas ref={canvasRef} />
}

Liquid1BackgroundApp.defaultProps = {
  attenuation: 0.995,
  color: '#ffffff',
  image: null,
  envMap: null,
  envMapIntensity: 0.5,
  metalness: 0.2,
  roughness: 0,
  rain: true,
  rainTime: 0.5
}

addPropertyControls(Liquid1BackgroundApp, {
  attenuation: {
    type: ControlType.Number,
    min: 0,
    max: 1,
    step: 0.001
  },
  color: {
    type: ControlType.Color
  },
  image: {
    type: ControlType.File,
    allowedFileTypes: ['jpg', 'png']
  },
  envMap: {
    type: ControlType.File,
    allowedFileTypes: ['jpg', 'png', 'hdr']
  },
  envMapIntensity: {
    type: ControlType.Number,
    min: 0,
    max: 1,
    step: 0.01
  },
  metalness: {
    type: ControlType.Number,
    min: 0,
    max: 1,
    step: 0.01
  },
  roughness: {
    type: ControlType.Number,
    min: 0,
    max: 1,
    step: 0.01
  },
  rain: {
    type: ControlType.Boolean
  },
  rainTime: {
    type: ControlType.Number,
    min: 0.01,
    max: 1,
    step: 0.01
  }
})
