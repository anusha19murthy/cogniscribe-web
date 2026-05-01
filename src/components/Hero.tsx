import { useEffect, useRef, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import { motion } from 'framer-motion';
import { IconArrowRight, IconPlay } from './Icons';
import Caduceus from '../three/Caduceus';
import { MedicalParticles } from '../three/MedicalElements';
import { caduceusProgress } from '../three/caduceusProgress';
import { magneticEffect } from '../animations/hoverEffects';

export default function Hero() {
  const btn1Ref = useRef<HTMLDivElement>(null);
  const btn2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cleanups: (() => void)[] = [];
    if (btn1Ref.current) cleanups.push(magneticEffect(btn1Ref.current));
    if (btn2Ref.current) cleanups.push(magneticEffect(btn2Ref.current));

    const onScroll = () => {
      const y = window.scrollY;
      const vh = window.innerHeight;
      caduceusProgress.value = Math.min(1, y / (vh * 0.8));
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    cleanups.push(() => window.removeEventListener('scroll', onScroll));

    return () => cleanups.forEach(fn => fn());
  }, []);

  return (
    <section style={{
      minHeight: '100vh',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      alignItems: 'center',
      position: 'relative',
      overflow: 'hidden',
      paddingTop: 64,
      background: 'var(--bg)',
      fontFamily: "'Montserrat', sans-serif",
    }}>
      {/* Left — text */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        style={{ padding: '0 5% 0 8%', zIndex: 2 }}
      >
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: 'rgba(65,105,225,0.08)',
          border: '1px solid rgba(65,105,225,0.2)',
          color: '#4169E1', borderRadius: 50,
          padding: '5px 16px', fontSize: '0.78rem', fontWeight: 600,
          marginBottom: 24, letterSpacing: '0.04em',
        }}>
          <span style={{
            width: 6, height: 6, borderRadius: '50%', background: '#10B981',
            animation: 'pulseGreen 1.6s ease-in-out infinite',
          }} />
          AI Medical Scribe
        </div>

        <style>{`
          @keyframes pulseGreen { 0%,100%{opacity:1;transform:scale(1);} 50%{opacity:0.6;transform:scale(1.3);} }
        `}</style>

        <h1 style={{
          fontFamily: "'Montserrat', sans-serif",
          fontWeight: 800,
          fontSize: 'clamp(2.6rem, 5vw, 4.2rem)',
          color: 'var(--text)',
          lineHeight: 1.1, letterSpacing: '-0.025em',
          margin: '0 0 22px',
        }}>
          Document smarter.<br />
          <span style={{ color: '#4169E1' }}>Care deeper.</span>
        </h1>

        <p style={{
          color: 'var(--text-light)',
          fontSize: '1.05rem', lineHeight: 1.75,
          maxWidth: 500, margin: '0 0 36px', fontWeight: 500,
        }}>
          CogniScribe transcribes your consultations in real-time, generating
          structured SOAP notes instantly — so you can focus on your patients,
          not paperwork.
        </p>

        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 16 }}>
          <div ref={btn1Ref} style={{ display: 'inline-block' }}>
            <button className="btn-capsule btn-primary">
              Start Free Trial
              <IconArrowRight size={16} color="white" />
            </button>
          </div>
          <div ref={btn2Ref} style={{ display: 'inline-block' }}>
            <button className="btn-capsule btn-secondary">
              <IconPlay size={14} color="#4169E1" />
              Watch Demo
            </button>
          </div>
        </div>

        <p style={{ fontSize: '0.8rem', color: 'var(--text-light)', fontWeight: 500 }}>
          No credit card required · HIPAA Compliant
        </p>
      </motion.div>

      {/* Right — 3D Caduceus */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, delay: 0.3 }}
        style={{ width: '100%', height: '100vh', position: 'relative' }}
      >
        <Canvas
          camera={{ position: [0, 0, 4.5], fov: 42 }}
          style={{ width: '100%', height: '100%', background: 'transparent' }}
          gl={{ alpha: true, antialias: true }}
        >
          <Suspense fallback={null}>
            <ambientLight intensity={0.6} />
            <directionalLight position={[5, 8, 5]} intensity={1.2} />
            <directionalLight position={[-4, -2, -4]} intensity={0.3} color="#6b8ef5" />
            <MedicalParticles />
            <Caduceus />
            <Environment preset="city" />
          </Suspense>
        </Canvas>
      </motion.div>
    </section>
  );
}
