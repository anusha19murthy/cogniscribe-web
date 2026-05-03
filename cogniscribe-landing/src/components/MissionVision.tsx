import { useRef, useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import { motion, useScroll, useTransform } from 'framer-motion';
import MissionCapsule from '../three/MissionCapsule';
import { capsuleBreakState } from '../three/capsuleBreakState';

export default function MissionVision() {
  const sectionRef = useRef<HTMLElement>(null);
  const [broken, setBroken] = useState(false);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  // Trigger break at 55% scroll through section
  useTransform(scrollYProgress, (v) => {
    if (v >= 0.55 && !capsuleBreakState.triggered) {
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
          <div style={{
            background: '#ffffff',
            borderRadius: 20,
            padding: 44,
            boxShadow: '0 8px 32px rgba(65,105,225,0.12)',
            border: '1px solid rgba(65,105,225,0.12)',
          }}>
            <div style={{
              width: 52, height: 52, borderRadius: '50%',
              background: 'rgba(65,105,225,0.08)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: 24,
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="9" stroke="#4169E1" strokeWidth="2"/>
                <circle cx="12" cy="12" r="3" fill="#4169E1"/>
                <line x1="12" y1="3" x2="12" y2="6" stroke="#4169E1" strokeWidth="2" strokeLinecap="round"/>
                <line x1="12" y1="18" x2="12" y2="21" stroke="#4169E1" strokeWidth="2" strokeLinecap="round"/>
                <line x1="3" y1="12" x2="6" y2="12" stroke="#4169E1" strokeWidth="2" strokeLinecap="round"/>
                <line x1="18" y1="12" x2="21" y2="12" stroke="#4169E1" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <h3 style={{
              fontWeight: 700, fontSize: '1.4rem',
              color: 'var(--text)', margin: '0 0 16px',
              letterSpacing: '-0.01em',
            }}>
              Our Mission
            </h3>
            <p style={{
              color: 'var(--text-light)', fontSize: '0.97rem',
              lineHeight: 1.85, margin: '0 0 24px', fontWeight: 500,
            }}>
              To eliminate the burden of documentation and let doctors reclaim their time —
              by building fast, reliable, and intelligent systems that integrate seamlessly
              into a doctor's natural workflow.
            </p>
            <div style={{ width: 40, height: 3, background: '#4169E1', borderRadius: 2 }} />
          </div>

          {/* Vision */}
          <div style={{
            background: '#4169E1',
            borderRadius: 20,
            padding: 44,
            boxShadow: '0 8px 32px rgba(65,105,225,0.25)',
          }}>
            <div style={{
              width: 52, height: 52, borderRadius: '50%',
              background: 'rgba(255,255,255,0.18)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: 24,
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" stroke="white" strokeWidth="2"/>
                <circle cx="12" cy="12" r="3" fill="white"/>
              </svg>
            </div>
            <h3 style={{
              fontWeight: 700, fontSize: '1.4rem',
              color: 'white', margin: '0 0 16px',
              letterSpacing: '-0.01em',
            }}>
              Our Vision
            </h3>
            <p style={{
              color: 'rgba(255,255,255,0.9)',
              fontSize: '0.97rem', lineHeight: 1.85,
              margin: '0 0 24px', fontWeight: 500,
            }}>
              To redefine clinical documentation — so every doctor can walk into a
              consultation room and give their patient one hundred percent of their
              attention, knowing the documentation is already taken care of.
            </p>
            <div style={{ width: 40, height: 3, background: 'white', borderRadius: 2 }} />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
