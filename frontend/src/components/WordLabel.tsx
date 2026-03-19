import { useRef, useState, useCallback } from 'react'
import { Text, Html } from '@react-three/drei'
import type { Mesh } from 'three'
import type { WordWeight } from '../types'

interface WordLabelProps {
  entry: WordWeight
  position: [number, number, number]
  fontSize: number
  fontWeight?: number
  color: string
}

export function WordLabel({ entry, position, fontSize, fontWeight = 400, color }: WordLabelProps) {
  const meshRef = useRef<Mesh>(null!)
  const [hovered, setHovered] = useState(false)

  const handlePointerOver = useCallback(() => {
    setHovered(true)
    document.body.style.cursor = 'pointer'
  }, [])

  const handlePointerOut = useCallback(() => {
    setHovered(false)
    document.body.style.cursor = 'auto'
  }, [])

  return (
    <group position={position}>
      <Text
        ref={meshRef}
        fontSize={fontSize}
        fontWeight={fontWeight}
        color={hovered ? '#ffffff' : color}
        anchorX="center"
        anchorY="middle"
        outlineWidth={fontSize * 0.08}
        outlineColor="#000000"
        scale={hovered ? 2 : 1}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        {entry.word}
      </Text>
      {hovered && (
        <Html center distanceFactor={10} style={{ pointerEvents: 'none' }}>
          <div className="word-tooltip">
            <span className="word-tooltip-word">{entry.word}</span>
            <span className="word-tooltip-weight">{(entry.weight * 100).toFixed(0)}%</span>
          </div>
        </Html>
      )}
    </group>
  )
}
