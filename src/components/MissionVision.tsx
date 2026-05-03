import { useRef, useState, Suspense, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import { motion, useScroll, useTransform } from 'framer-motion';
import MissionCapsule from '../three/MissionCapsule';
import { capsuleBreakState } from '../three/capsuleBreakState';

function MissionIcon({ hovered }: { hovered: boolean }) {
  return (
    <div style={{ position: 'relative', width: 56, height: 56 }}>
      {/* Pulsing glow */}
      <div style={{
        position: 'absolute', inset: 0, borderRadius: '50%',
        background: hovered ? 'rgba(65,105,225,0.2)' : 'rgba(65,105,225,0.08)',
        animation: 'targetPulse 2s ease-in-out infinite',
        transition: 'background 0.2s ease',
      }} />

      {/* Outer rotating ring */}
      <div style={{
        position: 'absolute', inset: 0, borderRadius: '50%',
        border: '2px dashed rgba(65,105,225,0.3)',
        animationName: 'spin',
        animationDuration: hovered ? '1s' : '8s',
        animationTimingFunction: 'linear',
        animationIterationCount: 'infinite',
      }} />

      {/* Inner counter-rotating ring */}
      <div style={{
        position: 'absolute', top: 8, left: 8, right: 8, bottom: 8,
        borderRadius: '50%',
        border: '1.5px dashed rgba(65,105,225,0.2)',
        animationName: 'spinReverse',
        animationDuration: hovered ? '0.8s' : '5s',
        animationTimingFunction: 'linear',
        animationIterationCount: 'infinite',
      }} />

      {/* Icon circle */}
      <div style={{
        position: 'absolute', inset: 4, borderRadius: '50%',
        background: hovered ? '#4169E1' : 'rgba(65,105,225,0.08)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'background 0.1s ease',
      }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="9" stroke={hovered ? 'white' : '#4169E1'} strokeWidth="2"/>
          <circle cx="12" cy="12" r="3" fill={hovered ? 'white' : '#4169E1'}/>
          <line x1="12" y1="3" x2="12" y2="6" stroke={hovered ? 'white' : '#4169E1'} strokeWidth="2" strokeLinecap="round"/>
          <line x1="12" y1="18" x2="12" y2="21" stroke={hovered ? 'white' : '#4169E1'} strokeWidth="2" strokeLinecap="round"/>
          <line x1="3" y1="12" x2="6" y2="12" stroke={hovered ? 'white' : '#4169E1'} strokeWidth="2" strokeLinecap="round"/>
          <line x1="18" y1="12" x2="21" y2="12" stroke={hovered ? 'white' : '#4169E1'} strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </div>

      {/* Crosshair lines */}
      {([
        { top: -4, left: '50%', marginLeft: -3, width: 6, height: 2, delay: '0s' },
        { bottom: -4, left: '50%', marginLeft: -3, width: 6, height: 2, delay: '0.5s' },
        { left: -4, top: '50%', marginTop: -1, width: 6, height: 2, delay: '0.25s' },
        { right: -4, top: '50%', marginTop: -1, width: 6, height: 2, delay: '0.75s' },
      ] as React.CSSProperties[]).map((pos, i) => (
        <div key={i} style={{
          position: 'absolute',
          ...pos,
          background: '#4169E1', borderRadius: 1,
          animationName: 'crosshairPulse',
          animationDuration: '2s',
          animationTimingFunction: 'ease-in-out',
          animationIterationCount: 'infinite',
          animationDelay: (pos as { delay: string }).delay,
          ...(hovered ? { opacity: 1, transform: 'scaleX(2)' } : {}),
        } as React.CSSProperties} />
      ))}
    </div>
  );
}

function VisionIcon({ hovered }: { hovered: boolean }) {
  return (
    <div style={{ position: 'relative', width: 56, height: 56 }}>
      {/* Scanning rings */}
      {[0, 1.25].map((delay, i) => (
        <div key={i} style={{
          position: 'absolute', inset: 0, borderRadius: '50%',
          border: `1.5px solid rgba(255,255,255,${hovered ? 0.5 : 0.3})`,
          animationName: 'visionScan',
          animationDuration: hovered ? '1.2s' : '2.5s',
          animationTimingFunction: 'ease-out',
          animationIterationCount: 'infinite',
          animationDelay: `${delay}s`,
        }} />
      ))}

      {/* Icon circle */}
      <div style={{
        position: 'absolute', inset: 0, borderRadius: '50%',
        background: hovered ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.18)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden',
        transition: 'background 0.2s ease',
      }}>
        {/* Iris tracking dot */}
        <div style={{
          position: 'absolute',
          width: 8, height: 8, borderRadius: '50%',
          background: 'rgba(255,255,255,0.4)',
          animation: 'irisMove 3s ease-in-out infinite',
          pointerEvents: 'none',
        }} />

        {/* Eye SVG with blink */}
        <div style={{
          animation: 'iconBlink 4s ease-in-out infinite',
          transform: hovered ? 'scaleY(1.3)' : 'scaleY(1)',
          transition: 'transform 0.2s ease',
          position: 'relative', zIndex: 1,
        }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" stroke="white" strokeWidth="2"/>
            <circle cx="12" cy="12" r="3" fill="white"/>
          </svg>
        </div>

        {/* Hover flash */}
        {hovered && (
          <motion.div
            initial={{ opacity: 0.6 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            style={{
              position: 'absolute', inset: 0, borderRadius: '50%',
              background: 'rgba(255,255,255,0.5)',
              pointerEvents: 'none',
            }}
          />
        )}
      </div>
    </div>
  );
}

export default function MissionVision() {
  const sectionRef = useRef<HTMLElement>(null);
  const [broken, setBroken] = useState(false);
  const [missionHovered, setMissionHovered] = useState(false);
  const [visionHovered, setVisionHovered]   = useState(false);

  // Reset singleton on every mount so HMR / page transitions work correctly
  useEffect(() => {
    capsuleBreakState.triggered = false;
    capsuleBreakState.onComplete = null;
    return () => {
      capsuleBreakState.triggered = false;
      capsuleBreakState.onComplete = null;
    };
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  // Trigger break at 25% scroll through section
  useTransform(scrollYProgress, (v) => {
    if (v >= 0.25 && !capsuleBreakState.triggered) {
      capsuleBreakState.triggered = true;
      capsuleBreakState.onComplete = () => setBroken(true);
    }
  });

  return (
    <section
      ref={sectionRef}
      style={{
        padding: '100px 0',
        background: '#ffffff',
        fontFamily: "'Montserrat', sans-serif",
        minHeight: '80vh',
      }}
    >
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 5%' }}>
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: 56 }}
        >
          <div style={{
            color: '#4169E1',
            fontSize: '0.75rem', fontWeight: 700,
            letterSpacing: '0.15em', textTransform: 'uppercase',
            marginBottom: 12,
          }}>
            Who We Are
          </div>
          <h2 style={{
            fontWeight: 700,
            fontSize: 'clamp(1.9rem, 3.5vw, 2.8rem)',
            color: 'var(--text)',
            lineHeight: 1.2, margin: 0,
          }}>
            Mission &amp; Vision
          </h2>
        </motion.div>

        {/* Capsule canvas */}
        {!broken && (
          <div style={{ width: '100%', height: 320, marginBottom: 48 }}>
            <Canvas
              camera={{ position: [0, 0, 3], fov: 40 }}
              style={{ width: '100%', height: '100%', background: 'transparent' }}
              gl={{ alpha: true, antialias: true }}
            >
              <Suspense fallback={null}>
                <ambientLight intensity={0.8} />
                <directionalLight position={[3, 5, 3]} intensity={1.2} />
                <pointLight position={[0, 4, 2]} intensity={2} color="#ffffff" />
                <pointLight position={[-3, 0, 2]} intensity={1} color="#2563EB" />
                <MissionCapsule />
                <Environment preset="city" />
              </Suspense>
            </Canvas>
          </div>
        )}

        {/* Cards appear after break */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={broken ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 28,
            pointerEvents: broken ? 'auto' : 'none',
          }}
        >
          {/* Mission */}
          <div
            onMouseEnter={() => setMissionHovered(true)}
            onMouseLeave={() => setMissionHovered(false)}
            style={{
              background: '#ffffff',
              borderRadius: 20,
              padding: 44,
              boxShadow: '0 8px 32px rgba(65,105,225,0.12)',
              border: '1px solid rgba(65,105,225,0.12)',
            }}
          >
            <div style={{ marginBottom: 24 }}>
              <MissionIcon hovered={missionHovered} />
            </div>
            <h3 style={{
              fontWeight: 700, fontSize: '1.4rem',
              color: 'var(--text)', margin: '0 0 16px',
              letterSpacing: '-0.01em',
            }}>
              Mission
            </h3>
            <p style={{
              color: 'var(--text-light)', fontSize: '0.97rem',
              lineHeight: 1.85, margin: '0 0 24px', fontWeight: 500,
            }}>
              To eliminate the burden of documentation and let doctors reclaim their time —
              by building fast, reliable, and intelligent systems that integrate seamlessly
              into a doctor's natural workflow. CogniScribe adapts to the doctor's flow.
              Not the other way around.
            </p>
            <div style={{ width: 40, height: 3, background: '#4169E1', borderRadius: 2 }} />
          </div>

          {/* Vision */}
          <div
            onMouseEnter={() => setVisionHovered(true)}
            onMouseLeave={() => setVisionHovered(false)}
            style={{
              background: '#4169E1',
              borderRadius: 20,
              padding: 44,
              boxShadow: '0 8px 32px rgba(65,105,225,0.25)',
            }}
          >
            <div style={{ marginBottom: 24 }}>
              <VisionIcon hovered={visionHovered} />
            </div>
            <h3 style={{
              fontWeight: 700, fontSize: '1.4rem',
              color: 'white', margin: '0 0 16px',
              letterSpacing: '-0.01em',
            }}>
              Vision
            </h3>
            <p style={{
              color: 'rgba(255,255,255,0.9)',
              fontSize: '0.97rem', lineHeight: 1.85,
              margin: '0 0 24px', fontWeight: 500,
            }}>
              To redefine clinical documentation — so that every doctor in India can
              walk into a consultation room and give their patient one hundred percent of
              their attention, knowing that the documentation is already taken care of.
              A future where the stethoscope gets more time than the pen.
            </p>
            <div style={{ width: 40, height: 3, background: 'white', borderRadius: 2 }} />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
