import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { portalState } from './portalState';

/* ── canvas texture: "CogniScribe" sign on building ── */
function makeSignTexture() {
  const c = document.createElement('canvas');
  c.width = 512; c.height = 128;
  const ctx = c.getContext('2d')!;
  ctx.fillStyle = '#0f1629';
  ctx.fillRect(0, 0, 512, 128);
  ctx.font = 'bold 52px Montserrat, sans-serif';
  ctx.fillStyle = '#4169E1';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('CogniScribe', 256, 64);
  const t = new THREE.CanvasTexture(c);
  return t;
}

/* ── canvas texture: floor grid ── */
function makeGridTexture() {
  const c = document.createElement('canvas');
  c.width = 256; c.height = 256;
  const ctx = c.getContext('2d')!;
  ctx.fillStyle = '#0d0d1a';
  ctx.fillRect(0, 0, 256, 256);
  ctx.strokeStyle = 'rgba(65, 105, 225,0.12)';
  ctx.lineWidth = 1;
  for (let i = 0; i <= 8; i++) {
    const p = (i / 8) * 256;
    ctx.beginPath(); ctx.moveTo(p, 0); ctx.lineTo(p, 256); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, p); ctx.lineTo(256, p); ctx.stroke();
  }
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(8, 8);
  return t;
}

/* ── Rain particles ── */
function Rain() {
  const ref = useRef<THREE.Points>(null);
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const pos = new Float32Array(50 * 3);
    for (let i = 0; i < 50; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * 30;
      pos[i * 3 + 1] = Math.random() * 18;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    return g;
  }, []);

  useFrame((_, dt) => {
    if (!ref.current) return;
    const pos = ref.current.geometry.attributes.position;
    for (let i = 0; i < 50; i++) {
      let y = pos.getY(i) - dt * 2.5;
      if (y < -1) y = 18;
      pos.setY(i, y);
    }
    pos.needsUpdate = true;
  });

  return (
    <points ref={ref} geometry={geo}>
      <pointsMaterial color="#6699ff" size={0.06} transparent opacity={0.35} sizeAttenuation />
    </points>
  );
}

/* ── Lamp post ── */
function LampPost({ x }: { x: number }) {
  return (
    <group position={[x, 0, 2]}>
      <mesh position={[0, 4, 0]}>
        <cylinderGeometry args={[0.08, 0.12, 8, 8]} />
        <meshStandardMaterial color="#1a2a4a" metalness={0.8} roughness={0.2} />
      </mesh>
      <pointLight position={[0, 8.2, 0]} color="#4488ff" intensity={2.5} distance={15} decay={2} castShadow />
      {/* Halo disc on ground */}
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[2.5, 32]} />
        <meshStandardMaterial color="#4169E1" transparent opacity={0.08} />
      </mesh>
    </group>
  );
}

/* ── Window cluster ── */
function Windows() {
  const rows = 3, cols = 6;
  const windows = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = (c - (cols - 1) / 2) * 5.5;
      const y = 8 + r * 2.8;
      // skip center column (entrance area)
      if (Math.abs(x) < 6) continue;
      windows.push(
        <group key={`w${r}${c}`} position={[x, y, 0.12]}>
          <mesh>
            <boxGeometry args={[3.2, 1.8, 0.05]} />
            <meshPhysicalMaterial
              color="#a8c4f0" transmission={0.85} roughness={0.02}
              metalness={0.1} thickness={0.1}
            />
          </mesh>
          {/* Warm interior glow behind window */}
          <pointLight position={[0, 0, -1]} color="#fff5e0" intensity={0.6} distance={6} decay={2} />
        </group>
      );
    }
  }
  return <>{windows}</>;
}

export interface HospitalSceneHandles {
  doorLeft:    THREE.Mesh | null;
  doorRight:   THREE.Mesh | null;
  interiorLight: THREE.PointLight | null;
}

interface Props {
  sceneRef: React.MutableRefObject<HospitalSceneHandles>;
  cameraRef: React.MutableRefObject<THREE.PerspectiveCamera | null>;
}

export default function HospitalScene({ sceneRef, cameraRef }: Props) {
  const doorLeftRef    = useRef<THREE.Mesh>(null);
  const doorRightRef   = useRef<THREE.Mesh>(null);
  const interiorRef    = useRef<THREE.PointLight>(null);
  const breatheRef     = useRef(0);

  const signTex  = useMemo(() => makeSignTexture(), []);
  const gridTex  = useMemo(() => makeGridTexture(), []);

  // expose handles to parent
  sceneRef.current.doorLeft      = doorLeftRef.current;
  sceneRef.current.doorRight     = doorRightRef.current;
  sceneRef.current.interiorLight = interiorRef.current;

  useFrame((state, dt) => {
    // sync handles every frame so parent always has latest refs
    sceneRef.current.doorLeft      = doorLeftRef.current;
    sceneRef.current.doorRight     = doorRightRef.current;
    sceneRef.current.interiorLight = interiorRef.current;

    // idle camera breathe — paused once fly-in starts
    const cam = state.camera as THREE.PerspectiveCamera;
    cameraRef.current = cam;
    if (!portalState.flying) {
      breatheRef.current += dt;
      cam.position.y = 2 + Math.sin(breatheRef.current * 0.25) * 0.05;
    }
  });

  return (
    <>
      {/* Fog */}
      <fog attach="fog" args={['#0a0a1a', 20, 60]} />

      {/* Lights */}
      <ambientLight color="#0a0a2e" intensity={0.4} />
      <LampPost x={-9} />
      <LampPost x={9} />

      {/* Interior warm light (behind doors) */}
      <pointLight ref={interiorRef} position={[0, 4, -2]} color="#fff5e0" intensity={3} distance={20} decay={2} />

      {/* ── Floor ── */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 5]} receiveShadow>
        <planeGeometry args={[60, 40]} />
        <meshStandardMaterial map={gridTex} roughness={0.15} metalness={0.35} color="#0d0d1a" />
      </mesh>

      {/* ── Building facade ── */}
      <mesh position={[0, 9, 0]} receiveShadow castShadow>
        <boxGeometry args={[40, 20, 0.6]} />
        <meshStandardMaterial color="#0f1629" roughness={0.8} metalness={0.2} />
      </mesh>

      {/* Blue accent strip along bottom edge */}
      <mesh position={[0, 0.12, 0.35]}>
        <boxGeometry args={[40, 0.18, 0.12]} />
        <meshStandardMaterial color="#4169E1" emissive="#4169E1" emissiveIntensity={1.8} />
      </mesh>

      {/* Medical cross — vertical bar */}
      <mesh position={[0, 14, 0.4]}>
        <boxGeometry args={[0.5, 2.2, 0.15]} />
        <meshStandardMaterial color="#4169E1" emissive="#4169E1" emissiveIntensity={2.2} />
      </mesh>
      {/* Medical cross — horizontal bar */}
      <mesh position={[0, 14, 0.4]}>
        <boxGeometry args={[2.2, 0.5, 0.15]} />
        <meshStandardMaterial color="#4169E1" emissive="#4169E1" emissiveIntensity={2.2} />
      </mesh>

      {/* CogniScribe sign */}
      <mesh position={[0, 11, 0.42]}>
        <planeGeometry args={[8, 2]} />
        <meshStandardMaterial map={signTex} transparent />
      </mesh>

      {/* Windows */}
      <Windows />

      {/* ── Entrance door frames ── */}
      {/* Top frame */}
      <mesh position={[0, 6.3, 0.5]}>
        <boxGeometry args={[8.6, 0.22, 0.22]} />
        <meshStandardMaterial color="#1e3a6e" metalness={0.7} roughness={0.25} />
      </mesh>
      {/* Left frame post */}
      <mesh position={[-4.4, 3, 0.5]}>
        <boxGeometry args={[0.22, 6.6, 0.22]} />
        <meshStandardMaterial color="#1e3a6e" metalness={0.7} roughness={0.25} />
      </mesh>
      {/* Right frame post */}
      <mesh position={[4.4, 3, 0.5]}>
        <boxGeometry args={[0.22, 6.6, 0.22]} />
        <meshStandardMaterial color="#1e3a6e" metalness={0.7} roughness={0.25} />
      </mesh>

      {/* ── Glass doors ── */}
      <mesh ref={doorLeftRef} position={[-2.1, 3, 0.5]} castShadow>
        <boxGeometry args={[4, 6, 0.08]} />
        <meshPhysicalMaterial
          color="#a8c4f0" transmission={0.72} roughness={0.04}
          metalness={0.15} thickness={0.2}
        />
      </mesh>
      <mesh ref={doorRightRef} position={[2.1, 3, 0.5]} castShadow>
        <boxGeometry args={[4, 6, 0.08]} />
        <meshPhysicalMaterial
          color="#a8c4f0" transmission={0.72} roughness={0.04}
          metalness={0.15} thickness={0.2}
        />
      </mesh>

      {/* Rain */}
      <Rain />
    </>
  );
}
