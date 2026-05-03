import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Floating medical particles
export function MedicalParticles() {
  const pointsRef = useRef<THREE.Points>(null);

  const { positions, count } = useMemo(() => {
    const count = 80;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 12;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 8;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 6;
    }
    return { positions, count };
  }, []);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geo;
  }, [positions]);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.05;
      pointsRef.current.rotation.x = state.clock.elapsedTime * 0.03;
      const posAttr = pointsRef.current.geometry.getAttribute('position') as THREE.BufferAttribute;
      for (let i = 0; i < count; i++) {
        const y = posAttr.getY(i);
        posAttr.setY(i, y + Math.sin(state.clock.elapsedTime + i * 0.5) * 0.002);
      }
      posAttr.needsUpdate = true;
    }
  });

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial color="#4169E1" size={0.06} transparent opacity={0.5} sizeAttenuation />
    </points>
  );
}

// DNA Helix
export function DNAHelix() {
  const groupRef = useRef<THREE.Group>(null);

  const helixPoints = useMemo(() => {
    const strand1: THREE.Vector3[] = [];
    const strand2: THREE.Vector3[] = [];
    const rungs: [THREE.Vector3, THREE.Vector3][] = [];
    const segments = 40;

    for (let i = 0; i <= segments; i++) {
      const t = (i / segments) * Math.PI * 4;
      const y = (i / segments) * 4 - 2;
      strand1.push(new THREE.Vector3(Math.cos(t) * 0.5, y, Math.sin(t) * 0.5));
      strand2.push(new THREE.Vector3(Math.cos(t + Math.PI) * 0.5, y, Math.sin(t + Math.PI) * 0.5));
      if (i % 4 === 0) {
        rungs.push([strand1[strand1.length - 1], strand2[strand2.length - 1]]);
      }
    }
    return { strand1, strand2, rungs };
  }, []);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.4;
    }
  });

  return (
    <group ref={groupRef} scale={0.7}>
      {/* Strand 1 */}
      {helixPoints.strand1.slice(0, -1).map((point, i) => {
        const next = helixPoints.strand1[i + 1];
        const mid = point.clone().add(next).multiplyScalar(0.5);
        const dir = next.clone().sub(point);
        const len = dir.length();
        return (
          <mesh key={`s1${i}`} position={mid} quaternion={new THREE.Quaternion().setFromUnitVectors(
            new THREE.Vector3(0, 1, 0), dir.clone().normalize()
          )}>
            <cylinderGeometry args={[0.02, 0.02, len, 6]} />
            <meshStandardMaterial color="#4169E1" metalness={0.5} roughness={0.3} />
          </mesh>
        );
      })}
      {/* Strand 2 */}
      {helixPoints.strand2.slice(0, -1).map((point, i) => {
        const next = helixPoints.strand2[i + 1];
        const mid = point.clone().add(next).multiplyScalar(0.5);
        const dir = next.clone().sub(point);
        const len = dir.length();
        return (
          <mesh key={`s2${i}`} position={mid} quaternion={new THREE.Quaternion().setFromUnitVectors(
            new THREE.Vector3(0, 1, 0), dir.clone().normalize()
          )}>
            <cylinderGeometry args={[0.02, 0.02, len, 6]} />
            <meshStandardMaterial color="#8B5CF6" metalness={0.5} roughness={0.3} />
          </mesh>
        );
      })}
      {/* Rungs */}
      {helixPoints.rungs.map(([a, b], i) => {
        const mid = a.clone().add(b).multiplyScalar(0.5);
        const dir = b.clone().sub(a);
        const len = dir.length();
        return (
          <mesh key={`r${i}`} position={mid} quaternion={new THREE.Quaternion().setFromUnitVectors(
            new THREE.Vector3(0, 1, 0), dir.clone().normalize()
          )}>
            <cylinderGeometry args={[0.015, 0.015, len, 6]} />
            <meshStandardMaterial color="#10B981" metalness={0.3} roughness={0.5} />
          </mesh>
        );
      })}
    </group>
  );
}

// ECG / Heartbeat line in 3D
export function ECGLine3D() {
  const meshRef = useRef<THREE.Mesh>(null);

  const geometry = useMemo(() => {
    const ecgPoints: THREE.Vector3[] = [];
    const segments = 200;
    for (let i = 0; i <= segments; i++) {
      const x = (i / segments) * 6 - 3;
      let y = 0;
      const phase = (i / segments) * Math.PI * 8;
      if (i % 25 < 2) y = 0.6;
      else if (i % 25 < 4) y = -0.2;
      else if (i % 25 < 6) y = 1.2;
      else if (i % 25 < 8) y = -0.4;
      else if (i % 25 < 10) y = 0.3;
      else y = Math.sin(phase) * 0.05;
      ecgPoints.push(new THREE.Vector3(x, y, 0));
    }
    return new THREE.BufferGeometry().setFromPoints(ecgPoints);
  }, []);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.material = new THREE.LineBasicMaterial({
        color: '#10B981',
        transparent: true,
        opacity: 0.4 + Math.sin(state.clock.elapsedTime * 2) * 0.2,
      });
    }
  });

  return (
    <primitive object={new THREE.Line(geometry, new THREE.LineBasicMaterial({ color: '#10B981', transparent: true, opacity: 0.5 }))} />
  );
}
