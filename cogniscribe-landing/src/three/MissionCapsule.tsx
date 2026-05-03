import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import gsap from 'gsap';
import { capsuleBreakState } from './capsuleBreakState';

const PARTICLE_COUNT = 80;

export default function MissionCapsule() {
  const groupRef    = useRef<THREE.Group>(null);
  const topRef      = useRef<THREE.Group>(null);
  const bottomRef   = useRef<THREE.Group>(null);
  const crackRef    = useRef<THREE.Mesh>(null);
  const particlesRef = useRef<THREE.Points>(null);
  const brokenRef   = useRef(false);
  const floatPhase  = useRef(0);

  // Particle velocities (x, y, z per particle)
  const velocities = useMemo(() => {
    const arr = new Float32Array(PARTICLE_COUNT * 3);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi   = Math.random() * Math.PI;
      const speed = 0.02 + Math.random() * 0.04;
      arr[i * 3]     = Math.sin(phi) * Math.cos(theta) * speed;
      arr[i * 3 + 1] = Math.cos(phi) * speed * (Math.random() > 0.5 ? 1 : -1);
      arr[i * 3 + 2] = Math.sin(phi) * Math.sin(theta) * speed;
    }
    return arr;
  }, []);

  const particlePositions = useMemo(() => {
    const arr = new Float32Array(PARTICLE_COUNT * 3);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      arr[i * 3]     = (Math.random() - 0.5) * 0.3;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 0.9;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 0.3;
    }
    return arr;
  }, []);

  const particleGeo = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(particlePositions.slice(), 3));
    return geo;
  }, [particlePositions]);

  const particleMat = useMemo(() => new THREE.PointsMaterial({
    color: '#4169E1', size: 0.045, transparent: true, opacity: 0,
    sizeAttenuation: true,
  }), []);

  const crackMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#4169E1', transparent: true, opacity: 0, emissive: new THREE.Color('#4169E1'), emissiveIntensity: 0.6,
  }), []);

  const topMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#4169E1', metalness: 0.5, roughness: 0.2,
    emissive: new THREE.Color('#2D4D9F'), emissiveIntensity: 0.1,
    transparent: true, opacity: 1,
  }), []);

  const bottomMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#F0F4FF', metalness: 0.3, roughness: 0.3,
    transparent: true, opacity: 1,
  }), []);

  const seamMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#CBD5FF', metalness: 0.6, roughness: 0.15,
    transparent: true, opacity: 1,
  }), []);

  useEffect(() => {
    const check = () => {
      if (capsuleBreakState.triggered && !brokenRef.current) {
        brokenRef.current = true;
        triggerBreak();
      }
    };

    const interval = setInterval(check, 50);
    return () => clearInterval(interval);
  });

  function triggerBreak() {
    if (!groupRef.current || !topRef.current || !bottomRef.current || !crackRef.current || !particlesRef.current) return;

    const tl = gsap.timeline({
      onComplete: () => {
        if (capsuleBreakState.onComplete) capsuleBreakState.onComplete();
      },
    });

    // 1. Shake
    tl.to(groupRef.current.position, { x: 0.06, duration: 0.06, yoyo: true, repeat: 5 })
      .to(groupRef.current.position, { x: 0, duration: 0.04 });

    // 2. Show crack glow
    tl.to(crackMat, { opacity: 0.9, duration: 0.15 }, '-=0.1');

    // 3. Top half flies up
    tl.to(topRef.current.position, { y: 3.5, duration: 0.75, ease: 'power2.out' }, '+=0.05')
      .to(topRef.current.rotation, { x: -Math.PI * 0.35, duration: 0.75, ease: 'power2.out' }, '<');

    // 4. Bottom half drops
    tl.to(bottomRef.current.position, { y: -3.5, duration: 0.75, ease: 'power2.in' }, '<')
      .to(bottomRef.current.rotation, { x: Math.PI * 0.25, duration: 0.75, ease: 'power2.in' }, '<');

    // 5. Particles burst
    tl.to(particleMat, { opacity: 0.85, duration: 0.1 }, '<');

    // 6. Fade everything out
    tl.to([topMat, bottomMat, seamMat, crackMat], { opacity: 0, duration: 0.4 }, '+=0.15')
      .to(particleMat, { opacity: 0, duration: 0.5 }, '<+=0.2');
  }

  useFrame((_, delta) => {
    if (!groupRef.current || brokenRef.current) return;

    // Idle float
    floatPhase.current += delta * 0.6;
    groupRef.current.position.y = Math.sin(floatPhase.current) * 0.08;
    groupRef.current.rotation.y += delta * 0.2;

    // Animate burst particles after break triggered
    if (brokenRef.current && particlesRef.current) {
      const pos = particlesRef.current.geometry.attributes.position;
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        pos.setXYZ(
          i,
          pos.getX(i) + velocities[i * 3],
          pos.getY(i) + velocities[i * 3 + 1],
          pos.getZ(i) + velocities[i * 3 + 2],
        );
      }
      pos.needsUpdate = true;
    }
  });

  return (
    <group ref={groupRef}>

      {/* Top half — blue dome + cylinder */}
      <group ref={topRef}>
        <mesh material={topMat} position={[0, 0.45, 0]}>
          <sphereGeometry args={[0.38, 24, 24, 0, Math.PI * 2, 0, Math.PI / 2]} />
        </mesh>
        <mesh material={topMat} position={[0, 0.01, 0]}>
          <cylinderGeometry args={[0.38, 0.38, 0.45, 24]} />
        </mesh>
      </group>

      {/* Bottom half — white dome + cylinder */}
      <group ref={bottomRef}>
        <mesh material={bottomMat} position={[0, -0.45, 0]}>
          <sphereGeometry args={[0.38, 24, 24, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2]} />
        </mesh>
        <mesh material={bottomMat} position={[0, -0.01, 0]}>
          <cylinderGeometry args={[0.38, 0.38, 0.45, 24]} />
        </mesh>
      </group>

      {/* Seam torus */}
      <mesh material={seamMat} position={[0, 0, 0]}>
        <torusGeometry args={[0.38, 0.022, 12, 48]} />
      </mesh>

      {/* Crack glow ring */}
      <mesh ref={crackRef} material={crackMat} position={[0, 0, 0]}>
        <torusGeometry args={[0.39, 0.01, 8, 48]} />
      </mesh>

      {/* Burst particles */}
      <points ref={particlesRef} geometry={particleGeo} material={particleMat} />

    </group>
  );
}
