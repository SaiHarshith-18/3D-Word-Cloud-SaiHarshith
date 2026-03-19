import { Suspense, useRef, useCallback } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'
import type { WordWeight } from '../types'
import { WordLabel } from './WordLabel'

// Evenly distribute N points on a sphere using the fibonacci (golden-angle) spiral
function fibonacciSphere(count: number, radius = 4): [number, number, number][] {
  const points: [number, number, number][] = []
  const goldenAngle = Math.PI * (3 - Math.sqrt(5))

  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2 // y goes from 1 to -1
    const radiusAtY = Math.sqrt(1 - y * y)
    const theta = goldenAngle * i

    points.push([
      Math.cos(theta) * radiusAtY * radius,
      y * radius,
      Math.sin(theta) * radiusAtY * radius,
    ])
  }
  return points
}

// Discrete weight-to-color mapping
export function weightToColor(w: number): string {
  if (w >= 0.90) return '#ff6b2b'  // bright orange
  if (w >= 0.80) return '#ff9d00'  // amber
  if (w >= 0.70) return '#f0f921'  // bright yellow
  if (w >= 0.60) return '#a8e043'  // yellow-green
  if (w >= 0.50) return '#1db87a'  // green-teal
  if (w >= 0.40) return '#1a9e9e'  // teal
  if (w >= 0.30) return '#1a4fd6'  // blue
  if (w >= 0.20) return '#7e03a8'  // purple
  if (w >= 0.15) return '#2563eb'  // bright blue
  if (w >= 0.10) return '#0891b2'  // cyan
  if (w >= 0.05) return '#6b7280'  // cool gray
  return '#666666'                  // dark gray
}


// Map weight to font size scale
function weightToSize(w: number): number {
  if (w > 0.80) return 1.0
  if (w >= 0.60) return 0.75
  if (w >= 0.40) return 0.60
  if (w >= 0.20) return 0.45
  return 0.32
}

// Map weight to font weight (boldness)
export function weightToFontWeight(w: number): number {
  if (w > 0.80) return 700
  if (w >= 0.60) return 600
  if (w >= 0.40) return 500
  return 400
}

interface WordCloud3DProps {
  keywords: WordWeight[]
}

function Scene({ keywords }: WordCloud3DProps) {
  const controlsRef = useRef<OrbitControlsImpl>(null!)
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>()

  const handlePointerDown = useCallback(() => {
    if (controlsRef.current) controlsRef.current.autoRotate = false
    clearTimeout(timeoutRef.current)
  }, [])

  const handlePointerUp = useCallback(() => {
    clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => {
      if (controlsRef.current) controlsRef.current.autoRotate = true
    }, 2000)
  }, [])

  const positions = fibonacciSphere(keywords.length)

  return (
    <>
      <ambientLight intensity={1} />
      <OrbitControls
        ref={controlsRef}
        autoRotate
        autoRotateSpeed={0.3}
        enableDamping
        dampingFactor={0.1}
        enableZoom
        minDistance={3}
        maxDistance={20}
      />
      <group onPointerDown={handlePointerDown} onPointerUp={handlePointerUp}>
        {keywords.map((entry, i) => (
          <WordLabel
            key={entry.word}
            entry={entry}
            position={positions[i]}
            fontSize={weightToSize(entry.weight)}
            fontWeight={weightToFontWeight(entry.weight)}
            color={weightToColor(entry.weight)}
          />
        ))}
      </group>
    </>
  )
}

export function WordCloud3D({ keywords }: WordCloud3DProps) {
  if (keywords.length === 0) return null

  return (
    <div className="canvas-container">
      <Canvas camera={{ position: [0, 0, 10], fov: 60 }}>
        <Suspense fallback={null}>
          <Scene keywords={keywords} />
        </Suspense>
      </Canvas>
    </div>
  )
}
