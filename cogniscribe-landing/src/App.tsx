// @ts-nocheck

import { useState, useEffect, useRef, lazy, Suspense } from 'react';
import Lenis from '@studio-freight/lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Components
import Loader from './components/Loader.tsx';
import Navigation from './components/Navigation.tsx';
import CustomCursor from './components/CustomCursor.tsx';
import ScrollProgress from './components/ScrollProgress.tsx';
import PortalIntro from './components/PortalIntro.tsx';

import './styles/globals.css';

// Lazy sections
const Hero = lazy(() => import('./components/Hero.tsx'));
const DoctorAppreciation = lazy(() => import('./components/DoctorAppreciation.tsx'));
const ClaimTime = lazy(() => import('./components/ClaimTime.tsx'));
const RecordSaveExport = lazy(() => import('./components/RecordSaveExport.tsx'));
const DictationTypes = lazy(() => import('./components/DictationTypes.tsx'));
const MissionVision = lazy(() => import('./components/MissionVision.tsx'));
const Closing = lazy(() => import('./components/Closing.tsx'));

gsap.registerPlugin(ScrollTrigger);

function SectionFallback() {
  return (
    <div style={{
      minHeight: '60vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div style={{
        width: 40,
        height: 40,
        border: '3px solid rgba(65, 105, 225,0.15)',
        borderTop: '3px solid #4169E1',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
      }} />
      <style>{`@keyframes spin { to { transform:rotate(360deg); } }`}</style>
    </div>
  );
}

export default function App() {
  const [loaded, setLoaded] = useState(false);
  const [portalDone, setPortalDone] = useState(false);
  const lenisRef = useRef(null);

  useEffect(() => {
    if (!loaded) return;

    const lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
    lenisRef.current = lenis;

    lenis.on('scroll', ScrollTrigger.update);

    const raf = (t) => { lenis.raf(t); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);
    gsap.ticker.lagSmoothing(0);

    const handleScrollTo = (e) => {
      lenis.scrollTo(e.detail.target, { offset: -80, duration: 1.2 });
    };
    window.addEventListener('lenis-scroll-to', handleScrollTo);

    return () => {
      lenis.destroy();
      lenisRef.current = null;
      window.removeEventListener('lenis-scroll-to', handleScrollTo);
    };
  }, [loaded]);

  return (
    <>
      {/* Loader */}
      {!loaded && <Loader onComplete={() => setLoaded(true)} />}

      {/* Intro animation */}
      {loaded && !portalDone && (
        <PortalIntro onComplete={() => setPortalDone(true)} />
      )}

      {/* UI overlays */}
      <div className="grain-overlay" />
      <ScrollProgress />
      <CustomCursor />

      {/* Main content */}
      <main>
        <Navigation />

        {/* Hero loads first, alone — owns WebGL context on load */}
        <Suspense fallback={<SectionFallback />}>
          <Hero />
        </Suspense>

        {/* Rest of sections load after */}
        <Suspense fallback={<SectionFallback />}>
          <DoctorAppreciation />
          <ClaimTime />
          <RecordSaveExport />
          <DictationTypes />
          <MissionVision />
          <Closing />
        </Suspense>
      </main>
    </>
  );
}