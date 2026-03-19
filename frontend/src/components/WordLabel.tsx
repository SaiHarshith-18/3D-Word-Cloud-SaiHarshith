import { useRef } from 'react'
import { Text } from '@react-three/drei'
import type { WordWeight } from '../types'

interface WordLabelProps {
  entry: WordWeight
  position: [number, number, number]
  fontSize: number
  color: string
}

export function WordLabel({ entry, position, fontSize, color }: WordLabelProps) {
  const meshRef = useRef<THREE.Mesh>(null!)

  return (
    <Text
      ref={meshRef}
      position={position}
      fontSize={fontSize}
      color={color}
      anchorX="center"
      anchorY="middle"
      outlineWidth={fontSize * 0.08}
      outlineColor="#000000"
    >
      {entry.word}
    </Text>
  )
}
