import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Cylinder, Sphere } from '@react-three/drei';
import * as THREE from 'three';

export default function Stethoscope() {
  const groupRef = useRef<THREE.Group>(null);

  // Curved tube path for the stethoscope
  const curve = useMemo(() => {
    const points = [
      new THREE.Vector3(-0.8, 0.6, 0),
      new THREE.Vector3(-0.5, 1.0, 0.1),
      new THREE.Vector3(0, 1.2, 0.2),
      new THREE.Vector3(0.5, 1.0, 0.1),
      new THREE.Vector3(0.8, 0.6, 0),
      new THREE.Vector3(0.9, 0.0, 0),
      new THREE.Vector3(0.8, -0.5, 0),
      new THREE.Vector3(0.4, -0.9, -0.1),
      new THREE.Vector3(0, -1.1, -0.2),
    ];
    return new THREE.CatmullRomCurve3(points);
  }, []);

  const tubeGeometry = useMemo(() =>
    new THREE.TubeGeometry(curve, 60, 0.06, 8, false),
    [curve]
  );

  const material = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#4169E1',
    metalness: 0.6,
    roughness: 0.2,
  }), []);

  const headMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#2d4fd6',
    metalness: 0.8,
    roughness: 0.15,
  }), []);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.4) * 0.25;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  return (
    <group ref={groupRef} scale={1.2}>
      {/* Tube body */}
      <mesh geometry={tubeGeometry} material={material} />

      {/* Earpieces */}
      <Sphere args={[0.1, 12, 12]} position={[-0.8, 0.6, 0]} material={headMaterial} />
      <Sphere args={[0.1, 12, 12]} position={[0.8, 0.6, 0]} material={headMaterial} />

      {/* Diaphragm (chest piece) */}
      <Cylinder args={[0.28, 0.28, 0.08, 32]} position={[0, -1.1, -0.2]} rotation={[0.3, 0, 0]} material={headMaterial} />
      <Cylinder args={[0.22, 0.22, 0.02, 32]} position={[0, -1.13, -0.17]} rotation={[0.3, 0, 0]}>
        <meshStandardMaterial color="#6b8ef5" metalness={0.5} roughness={0.3} />
      </Cylinder>

      {/* Connector */}
      <Sphere args={[0.08, 12, 12]} position={[0, 1.2, 0.2]} material={material} />
    </group>
  );
}
