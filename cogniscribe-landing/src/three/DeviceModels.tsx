import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

/* ─────────────────────────────────────
   MacBook-style Laptop
   Open lid, screen showing CogniScribe
───────────────────────────────────── */
export function LaptopModel() {
  const groupRef = useRef<THREE.Group>(null);
  const lidRef   = useRef<THREE.Group>(null);

  /* Gentle float — NO side-to-side rotation (that looked like tweezers) */
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.55) * 0.06;
      // Very subtle tilt for depth
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.02;
    }
  });

  /* Screen texture: canvas with CogniScribe dashboard UI */
  const screenTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width  = 512;
    canvas.height = 320;
    const ctx = canvas.getContext('2d')!;

    // Background — dark navy
    ctx.fillStyle = '#0a0e1a';
    ctx.fillRect(0, 0, 512, 320);

    // Top nav bar
    ctx.fillStyle = '#111827';
    ctx.fillRect(0, 0, 512, 36);

    // Nav logo area
    ctx.fillStyle = '#4169E1';
    ctx.beginPath();
    ctx.roundRect(14, 8, 20, 20, 4);
    ctx.fill();
    // Cross on logo
    ctx.fillStyle = 'white';
    ctx.fillRect(21, 11, 6, 14);
    ctx.fillRect(16, 16, 16, 4);

    // Nav label
    ctx.fillStyle = 'rgba(255,255,255,0.9)';
    ctx.font = 'bold 13px Inter, sans-serif';
    ctx.fillText('CogniScribe', 42, 23);

    // Sidebar
    ctx.fillStyle = '#111827';
    ctx.fillRect(0, 36, 76, 284);

    // Sidebar icons
    const sideIcons = [48, 88, 128, 168, 208];
    sideIcons.forEach((y, i) => {
      ctx.fillStyle = i === 0 ? '#4169E1' : 'rgba(255,255,255,0.15)';
      ctx.beginPath();
      ctx.roundRect(16, y, 44, 28, 6);
      ctx.fill();
    });

    // Main content area
    // Title
    ctx.fillStyle = 'rgba(255,255,255,0.85)';
    ctx.font = 'bold 14px Inter, sans-serif';
    ctx.fillText('Patient Dashboard', 94, 60);

    // Stat cards row
    const stats = [
      { x: 92, color: '#4169E1', label: 'Notes', val: '24' },
      { x: 205, color: '#10B981', label: 'Saved', val: '2h' },
      { x: 318, color: '#F97316', label: 'Patients', val: '8' },
    ];
    stats.forEach(s => {
      ctx.fillStyle = s.color + '22';
      ctx.beginPath();
      ctx.roundRect(s.x, 72, 100, 54, 8);
      ctx.fill();
      ctx.strokeStyle = s.color + '55';
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.fillStyle = s.color;
      ctx.font = 'bold 20px Inter, sans-serif';
      ctx.fillText(s.val, s.x + 12, 102);
      ctx.fillStyle = 'rgba(255,255,255,0.5)';
      ctx.font = '10px Inter, sans-serif';
      ctx.fillText(s.label, s.x + 12, 116);
    });

    // Recent notes list
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.font = '11px Inter, sans-serif';
    ctx.fillText('Recent Notes', 94, 148);

    const notes = ['SOAP Note — Patient A', 'Progress Note — Patient B', 'Discharge Summary — Patient C'];
    notes.forEach((note, i) => {
      ctx.fillStyle = 'rgba(255,255,255,0.06)';
      ctx.beginPath();
      ctx.roundRect(92, 156 + i * 36, 328, 28, 6);
      ctx.fill();

      ctx.fillStyle = '#4169E1';
      ctx.beginPath();
      ctx.arc(106, 170 + i * 36, 5, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = 'rgba(255,255,255,0.7)';
      ctx.font = '11px Inter, sans-serif';
      ctx.fillText(note, 118, 174 + i * 36);

      ctx.fillStyle = '#10B981';
      ctx.font = '9px Inter, sans-serif';
      ctx.fillText('✓', 390, 174 + i * 36);
    });

    // Waveform at bottom
    ctx.strokeStyle = '#4169E1';
    ctx.lineWidth = 1.5;
    ctx.globalAlpha = 0.4;
    ctx.beginPath();
    for (let x = 92; x < 420; x += 2) {
      const t = (x - 92) / 40;
      const y = 280 + Math.sin(t * 3) * 8 * (Math.sin(t * 0.5) > 0 ? 1 : 0.3);
      if (x === 92) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.globalAlpha = 1;

    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    return tex;
  }, []);

  return (
    <group ref={groupRef}>
      {/* ── Base / palm-rest ── */}
      <RoundedBox args={[2.2, 0.09, 1.5]} radius={0.04} smoothness={4} position={[0, 0, 0]}>
        <meshStandardMaterial color="#e0e4ea" metalness={0.72} roughness={0.18} />
      </RoundedBox>

      {/* Trackpad */}
      <mesh position={[0, 0.051, 0.28]}>
        <boxGeometry args={[0.55, 0.004, 0.38]} />
        <meshStandardMaterial color="#cacfd8" metalness={0.5} roughness={0.35} />
      </mesh>

      {/* Keyboard grid hint */}
      <mesh position={[0, 0.051, -0.08]}>
        <boxGeometry args={[1.8, 0.003, 0.65]} />
        <meshStandardMaterial color="#d0d5de" roughness={0.9} />
      </mesh>

      {/* Apple-style notch/logo on base top */}
      <mesh position={[0, 0.051, -0.55]}>
        <circleGeometry args={[0.04, 16]} />
        <meshStandardMaterial color="#c8cdd6" metalness={0.6} roughness={0.3} />
      </mesh>

      {/* ── Screen lid (angled open at ~115°) ── */}
      <group ref={lidRef} position={[0, 0.045, -0.75]} rotation={[-Math.PI / 2 + 0.45, 0, 0]}>
        {/* Lid shell */}
        <RoundedBox args={[2.2, 1.4, 0.07]} radius={0.04} smoothness={4} position={[0, 0.7, 0]}>
          <meshStandardMaterial color="#e0e4ea" metalness={0.72} roughness={0.18} />
        </RoundedBox>

        {/* Screen bezel (inner dark frame) */}
        <mesh position={[0, 0.7, 0.038]}>
          <planeGeometry args={[2.0, 1.22]} />
          <meshStandardMaterial color="#090d18" roughness={0.05} metalness={0.05} />
        </mesh>

        {/* ── Screen content ── */}
        <mesh position={[0, 0.7, 0.039]}>
          <planeGeometry args={[1.88, 1.12]} />
          <meshStandardMaterial map={screenTexture} roughness={0.05} metalness={0.05} />
        </mesh>

        {/* Screen glass reflection sheen */}
        <mesh position={[0, 0.7, 0.0395]}>
          <planeGeometry args={[1.88, 1.12]} />
          <meshStandardMaterial
            color="white"
            transparent opacity={0.04}
            roughness={0} metalness={0}
          />
        </mesh>

        {/* Camera notch */}
        <mesh position={[0, 1.34, 0.038]}>
          <circleGeometry args={[0.018, 12]} />
          <meshStandardMaterial color="#1a1f2e" roughness={0.6} />
        </mesh>
      </group>
    </group>
  );
}

/* ─────────────────────────────────────
   Modern Smartphone (iPhone-style)
───────────────────────────────────── */
export function PhoneModel() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.65 + 1.2) * 0.07;
      groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.35) * 0.04;
    }
  });

  /* Phone screen texture */
  const phoneTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width  = 256;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;

    // Background
    ctx.fillStyle = '#0a0e1a';
    ctx.fillRect(0, 0, 256, 512);

    // Status bar
    ctx.fillStyle = 'rgba(255,255,255,0.12)';
    ctx.fillRect(0, 0, 256, 28);
    ctx.fillStyle = 'rgba(255,255,255,0.6)';
    ctx.font = '10px Inter, sans-serif';
    ctx.fillText('9:41', 20, 18);
    ctx.fillText('●●●', 190, 18);

    // App header
    ctx.fillStyle = '#111827';
    ctx.fillRect(0, 28, 256, 52);

    // Logo in header
    ctx.fillStyle = '#4169E1';
    ctx.beginPath();
    ctx.roundRect(16, 38, 22, 22, 4);
    ctx.fill();
    ctx.fillStyle = 'white';
    ctx.fillRect(24, 41, 6, 16);
    ctx.fillRect(19, 46, 16, 6);

    ctx.fillStyle = 'rgba(255,255,255,0.9)';
    ctx.font = 'bold 13px Inter, sans-serif';
    ctx.fillText('CogniScribe', 46, 52);

    // Mic button — large centered circle
    ctx.fillStyle = '#4169E1';
    ctx.beginPath();
    ctx.arc(128, 155, 42, 0, Math.PI * 2);
    ctx.fill();
    // Mic icon
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.roundRect(121, 134, 14, 26, 7);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(128, 162, 18, Math.PI, 0);
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 2.5;
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(128, 180);
    ctx.lineTo(128, 188);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(118, 188);
    ctx.lineTo(138, 188);
    ctx.stroke();

    // Recording indicator
    ctx.fillStyle = '#10B981';
    ctx.beginPath();
    ctx.arc(128, 214, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.55)';
    ctx.font = '10px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Tap to record', 128, 230);
    ctx.textAlign = 'left';

    // Recent notes
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.font = '10px Inter, sans-serif';
    ctx.fillText('Recent', 18, 258);

    const notes = ['SOAP Note', 'Progress', 'Discharge'];
    const noteColors = ['#4169E1', '#10B981', '#F97316'];
    notes.forEach((n, i) => {
      ctx.fillStyle = 'rgba(255,255,255,0.06)';
      ctx.beginPath();
      ctx.roundRect(16, 266 + i * 44, 224, 34, 8);
      ctx.fill();
      ctx.fillStyle = noteColors[i];
      ctx.beginPath();
      ctx.arc(32, 283 + i * 44, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,0.75)';
      ctx.font = '11px Inter, sans-serif';
      ctx.fillText(n, 46, 287 + i * 44);
    });

    // Bottom bar
    ctx.fillStyle = 'rgba(255,255,255,0.08)';
    ctx.fillRect(0, 480, 256, 32);
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.fillRect(88, 490, 80, 4);
    ctx.beginPath();
    ctx.roundRect(88, 490, 80, 4, 2);
    ctx.fill();

    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    return tex;
  }, []);

  return (
    <group ref={groupRef}>
      {/* Body */}
      <RoundedBox args={[0.88, 1.82, 0.11]} radius={0.1} smoothness={6}>
        <meshStandardMaterial color="#1c2030" metalness={0.6} roughness={0.22} />
      </RoundedBox>

      {/* Screen face */}
      <mesh position={[0, 0, 0.058]}>
        <planeGeometry args={[0.78, 1.68]} />
        <meshStandardMaterial color="#060a14" roughness={0.05} metalness={0.05} />
      </mesh>

      {/* Screen content */}
      <mesh position={[0, 0, 0.059]}>
        <planeGeometry args={[0.76, 1.65]} />
        <meshStandardMaterial map={phoneTexture} roughness={0.05} metalness={0.05} />
      </mesh>

      {/* Dynamic Island notch */}
      <mesh position={[0, 0.78, 0.0595]} rotation={[0, 0, Math.PI / 2]}>
        <capsuleGeometry args={[0.024, 0.05, 6, 12]} />
        <meshStandardMaterial color="#060a14" roughness={0.6} />
      </mesh>

      {/* Side buttons */}
      <mesh position={[0.45, 0.4, 0]} rotation={[0, 0, 0]}>
        <boxGeometry args={[0.015, 0.16, 0.08]} />
        <meshStandardMaterial color="#151926" metalness={0.5} roughness={0.3} />
      </mesh>
      <mesh position={[-0.45, 0.22, 0]}>
        <boxGeometry args={[0.015, 0.28, 0.08]} />
        <meshStandardMaterial color="#151926" metalness={0.5} roughness={0.3} />
      </mesh>
    </group>
  );
}

/* ─────────────────────────────────────
   3D Medical Capsule / Pill
───────────────────────────────────── */
export function MedicalCapsule({
  position = [0, 0, 0] as [number, number, number],
  scale    = 1,
  speed    = 0.25,
  opacity  = 0.22,
}) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.x = state.clock.elapsedTime * speed * 0.7;
    groupRef.current.rotation.z = state.clock.elapsedTime * speed;
    groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5) * 0.12;
  });

  return (
    <group ref={groupRef} position={position} scale={scale}>
      {/* Top hemisphere (blue) */}
      <mesh>
        <sphereGeometry args={[0.5, 24, 24, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial
          color="#4169E1" metalness={0.3} roughness={0.4}
          transparent opacity={opacity}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Bottom hemisphere (white) */}
      <mesh rotation={[Math.PI, 0, 0]}>
        <sphereGeometry args={[0.5, 24, 24, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial
          color="#e8ecf4" metalness={0.2} roughness={0.5}
          transparent opacity={opacity}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Cylindrical body */}
      <mesh>
        <cylinderGeometry args={[0.5, 0.5, 0.8, 24]} />
        <meshStandardMaterial
          color="#4169E1" metalness={0.3} roughness={0.4}
          transparent opacity={opacity * 0.8}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.5, 0.5, 0.8, 24]} />
        <meshStandardMaterial
          color="#e8ecf4"
          transparent opacity={opacity * 0.5}
          side={THREE.FrontSide}
          depthWrite={false}
        />
      </mesh>

      {/* Seam ring */}
      <mesh>
        <torusGeometry args={[0.5, 0.018, 8, 36]} />
        <meshStandardMaterial color="#4169E1" transparent opacity={opacity + 0.1} metalness={0.5} />
      </mesh>
    </group>
  );
}
