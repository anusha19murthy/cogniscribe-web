import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { caduceusProgress } from './caduceusProgress';

function buildHelixCurve(
  phase: number,
  radius: number,
  totalHeight: number,
  turns: number
): THREE.CatmullRomCurve3 {
  const pts: THREE.Vector3[] = [];
  const segments = 120;
  for (let i = 0; i <= segments; i++) {
    const t = (i / segments) * turns * Math.PI * 2;
    const y = (i / segments) * totalHeight - totalHeight / 2;
    pts.push(new THREE.Vector3(
      Math.cos(t + phase) * radius,
      y,
      Math.sin(t + phase) * radius,
    ));
  }
  return new THREE.CatmullRomCurve3(pts, false, 'catmullrom', 0.4);
}

function clamp(v: number, lo: number, hi: number) {
  return Math.min(Math.max(v, lo), hi);
}

export default function Caduceus() {
  const groupRef   = useRef<THREE.Group>(null);
  const snake1Ref  = useRef<THREE.Group>(null);
  const snake2Ref  = useRef<THREE.Group>(null);
  const wingsRef   = useRef<THREE.Group>(null);
  const rodRef     = useRef<THREE.Group>(null);
  const rotRef     = useRef(0);

  const rodMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#2D4D9F', metalness: 0.78, roughness: 0.16,
    transparent: true, opacity: 1,
  }), []);

  const snake1Mat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#4169E1', metalness: 0.5, roughness: 0.22,
    emissive: new THREE.Color('#4169E1'), emissiveIntensity: 0.1,
    transparent: true, opacity: 1,
  }), []);

  const snake2Mat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#5B7FFF', metalness: 0.5, roughness: 0.22,
    emissive: new THREE.Color('#5B7FFF'), emissiveIntensity: 0.1,
    transparent: true, opacity: 1,
  }), []);

  const orbMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#7B9FFF', metalness: 0.6, roughness: 0.12,
    emissive: new THREE.Color('#7B9FFF'), emissiveIntensity: 0.18,
    transparent: true, opacity: 1,
  }), []);

  const wingMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#7B9FFF', metalness: 0.2, roughness: 0.5,
    transparent: true, opacity: 0.88,
    side: THREE.DoubleSide,
  }), []);

  const snake1Geo = useMemo(() => {
    const curve = buildHelixCurve(0, 0.3, 2.2, 2.5);
    return new THREE.TubeGeometry(curve, 120, 0.048, 8, false);
  }, []);

  const snake2Geo = useMemo(() => {
    const curve = buildHelixCurve(Math.PI, 0.3, 2.2, 2.5);
    return new THREE.TubeGeometry(curve, 120, 0.048, 8, false);
  }, []);

  const leftWingGeo = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.bezierCurveTo(-0.12, 0.22, -0.52, 0.42, -0.88, 0.2);
    shape.bezierCurveTo(-0.72, 0.04, -0.42, -0.16, 0, 0);
    return new THREE.ShapeGeometry(shape, 14);
  }, []);

  const rightWingGeo = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.bezierCurveTo(0.12, 0.22, 0.52, 0.42, 0.88, 0.2);
    shape.bezierCurveTo(0.72, 0.04, 0.42, -0.16, 0, 0);
    return new THREE.ShapeGeometry(shape, 14);
  }, []);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    const p = caduceusProgress.value; // 0 = idle, 1 = fully morphed

    // Rotation slows to zero as progress increases
    const rotSpeed = (Math.PI * 2 / 28) * (1 - clamp(p * 5, 0, 1));
    rotRef.current += rotSpeed * delta;
    groupRef.current.rotation.y = rotRef.current;

    // Vertical float — fades out
    const floatAmt = Math.sin(state.clock.elapsedTime * 0.45) * 0.07 * (1 - clamp(p * 3, 0, 1));
    groupRef.current.position.y = floatAmt;

    // Snake scale: compress outward radius toward rod (x/z → 0)
    const snakeScale = 1 - clamp((p - 0) / 0.5, 0, 1);
    if (snake1Ref.current) {
      snake1Ref.current.scale.x = snakeScale;
      snake1Ref.current.scale.z = snakeScale;
    }
    if (snake2Ref.current) {
      snake2Ref.current.scale.x = snakeScale;
      snake2Ref.current.scale.z = snakeScale;
    }

    // Snake opacity: fade out between p 0.45–0.9
    const snakeOpacity = 1 - clamp((p - 0.45) / 0.45, 0, 1);
    snake1Mat.opacity = snakeOpacity;
    snake2Mat.opacity = snakeOpacity;

    // Wings opacity: fade out between p 0.15–0.55
    const wingOpacity = (1 - clamp((p - 0.15) / 0.4, 0, 1)) * 0.88;
    wingMat.opacity = wingOpacity;

    // Rod + orb + rings: fade out between p 0.25–0.65
    const rodOpacity = 1 - clamp((p - 0.25) / 0.4, 0, 1);
    rodMat.opacity = rodOpacity;
    orbMat.opacity = rodOpacity;
  });

  return (
    <group ref={groupRef} scale={1.05}>

      <group ref={rodRef}>
        {/* Central rod */}
        <mesh material={rodMat}>
          <cylinderGeometry args={[0.052, 0.068, 2.6, 18]} />
        </mesh>

        {/* Bottom foot */}
        <mesh position={[0, -1.36, 0]} material={rodMat}>
          <cylinderGeometry args={[0.11, 0.09, 0.1, 18]} />
        </mesh>
        <mesh position={[0, -1.44, 0]} material={rodMat}>
          <sphereGeometry args={[0.07, 12, 12]} />
        </mesh>

        {/* Top orb */}
        <mesh position={[0, 1.46, 0]}>
          <sphereGeometry args={[0.1, 16, 16]} />
          <primitive object={orbMat} attach="material" />
        </mesh>

        {/* Decorative rings */}
        {[-0.75, -0.25, 0.25, 0.75].map((y, i) => (
          <mesh key={`ring${i}`} position={[0, y, 0]}>
            <torusGeometry args={[0.085, 0.017, 8, 22]} />
            <meshStandardMaterial color="#4169E1" metalness={0.65} roughness={0.2} transparent opacity={rodMat.opacity} />
          </mesh>
        ))}
      </group>

      {/* Snake 1 */}
      <group ref={snake1Ref}>
        <mesh geometry={snake1Geo} material={snake1Mat} />
        <mesh position={[0.3, 1.04, 0]}>
          <sphereGeometry args={[0.072, 12, 12]} />
          <primitive object={snake1Mat} attach="material" />
        </mesh>
        <mesh position={[0.38, 1.04, 0]} rotation={[0, 0, -0.3]}>
          <cylinderGeometry args={[0.008, 0.008, 0.1, 6]} />
          <meshStandardMaterial color="#ef4444" transparent opacity={snake1Mat.opacity} />
        </mesh>
      </group>

      {/* Snake 2 */}
      <group ref={snake2Ref}>
        <mesh geometry={snake2Geo} material={snake2Mat} />
        <mesh position={[-0.3, 1.04, 0]}>
          <sphereGeometry args={[0.072, 12, 12]} />
          <primitive object={snake2Mat} attach="material" />
        </mesh>
        <mesh position={[-0.38, 1.04, 0]} rotation={[0, 0, 0.3]}>
          <cylinderGeometry args={[0.008, 0.008, 0.1, 6]} />
          <meshStandardMaterial color="#ef4444" transparent opacity={snake2Mat.opacity} />
        </mesh>
      </group>

      {/* Wings */}
      <group ref={wingsRef}>
        <mesh geometry={leftWingGeo}  material={wingMat} position={[0, 1.18, 0.01]} />
        <mesh geometry={rightWingGeo} material={wingMat} position={[0, 1.18, 0.01]} />
        {[-0.25, -0.5, -0.7].map((x, i) => (
          <mesh key={`lr${i}`} position={[x, 1.18 + Math.abs(x) * 0.06, 0.015]}
            rotation={[0, 0, Math.PI / 2 + i * 0.15]}>
            <cylinderGeometry args={[0.006, 0.006, 0.28 - i * 0.06, 6]} />
            <meshStandardMaterial color="#7B9FFF" metalness={0.3} roughness={0.5} transparent opacity={wingMat.opacity} />
          </mesh>
        ))}
        {[0.25, 0.5, 0.7].map((x, i) => (
          <mesh key={`rr${i}`} position={[x, 1.18 + Math.abs(x) * 0.06, 0.015]}
            rotation={[0, 0, Math.PI / 2 - i * 0.15]}>
            <cylinderGeometry args={[0.006, 0.006, 0.28 - i * 0.06, 6]} />
            <meshStandardMaterial color="#7B9FFF" metalness={0.3} roughness={0.5} transparent opacity={wingMat.opacity} />
          </mesh>
        ))}
      </group>

    </group>
  );
}
