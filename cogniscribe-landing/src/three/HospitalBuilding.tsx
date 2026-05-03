import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function WireBox({ position, size, color = '#4169E1', opacity = 0.6 }: {
  position: [number, number, number];
  size: [number, number, number];
  color?: string;
  opacity?: number;
}) {
  const geo = useMemo(() => new THREE.BoxGeometry(...size), [size]);
  return (
    <mesh position={position} geometry={geo}>
      <meshBasicMaterial color={color} wireframe opacity={opacity} transparent />
    </mesh>
  );
}

export default function HospitalBuilding() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.15;
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.4) * 0.05;
    }
  });

  return (
    <group ref={groupRef} scale={0.55}>
      {/* Main body */}
      <WireBox position={[0, 0, 0]} size={[2, 2.5, 1.2]} color="#4169E1" opacity={0.7} />
      {/* Upper tower */}
      <WireBox position={[0, 2.1, 0]} size={[1, 1.7, 0.8]} color="#6b8ef5" opacity={0.6} />
      {/* Left wing */}
      <WireBox position={[-1.6, -0.3, 0]} size={[1, 1.8, 1]} color="#4169E1" opacity={0.5} />
      {/* Right wing */}
      <WireBox position={[1.6, -0.3, 0]} size={[1, 1.8, 1]} color="#4169E1" opacity={0.5} />
      {/* Rooftop element */}
      <WireBox position={[0, 3.1, 0]} size={[0.4, 0.5, 0.4]} color="#8B5CF6" opacity={0.8} />

      {/* Windows - left wing */}
      {[-0.25, 0.25].map((y, i) => (
        <WireBox key={`lw${i}`} position={[-1.6, y, 0.52]} size={[0.18, 0.18, 0.02]} color="#10B981" opacity={0.9} />
      ))}
      {/* Windows - right wing */}
      {[-0.25, 0.25].map((y, i) => (
        <WireBox key={`rw${i}`} position={[1.6, y, 0.52]} size={[0.18, 0.18, 0.02]} color="#10B981" opacity={0.9} />
      ))}

      {/* Main building windows grid */}
      {[-0.5, 0, 0.5].map((x) =>
        [-0.6, 0, 0.6].map((y, j) => (
          <WireBox key={`mw${x}${j}`} position={[x, y, 0.62]} size={[0.22, 0.22, 0.01]} color="#6b8ef5" opacity={0.8} />
        ))
      )}

      {/* Cross symbol on front */}
      <WireBox position={[0, 0.9, 0.62]} size={[0.08, 0.4, 0.01]} color="#F97316" opacity={1} />
      <WireBox position={[0, 0.9, 0.62]} size={[0.4, 0.08, 0.01]} color="#F97316" opacity={1} />

      {/* Entry arch */}
      <WireBox position={[0, -0.9, 0.62]} size={[0.4, 0.5, 0.01]} color="#4169E1" opacity={0.9} />

      {/* Floating particles */}
      {[0.9, -0.9, 1.5, -1.5].map((x, i) => (
        <mesh key={`p${i}`} position={[x, 2.0 + i * 0.3, 0.4]}>
          <sphereGeometry args={[0.04, 6, 6]} />
          <meshBasicMaterial color="#4169E1" opacity={0.5} transparent />
        </mesh>
      ))}
    </group>
  );
}
