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

// 3-stop color gradient: low → mid → high weight
function weightToColor(w: number): string {
  const low = [74, 144, 217]   // #4a90d9
  const mid = [80, 227, 194]   // #50e3c2
  const high = [245, 166, 35]  // #f5a623

  let from: number[], to: number[], t: number
  if (w < 0.5) {
    from = low; to = mid; t = w * 2
  } else {
    from = mid; to = high; t = (w - 0.5) * 2
  }

  const r = Math.round(from[0] + (to[0] - from[0]) * t)
  const g = Math.round(from[1] + (to[1] - from[1]) * t)
  const b = Math.round(from[2] + (to[2] - from[2]) * t)
  return `rgb(${r},${g},${b})`
}

// Map weight to font size (linear interpolation)
function weightToSize(w: number): number {
  return 0.12 + w * (0.45 - 0.12)
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
