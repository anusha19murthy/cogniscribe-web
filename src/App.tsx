import { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Lenis from '@studio-freight/lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import Loader        from './components/Loader';
import Navigation    from './components/Navigation';
import CustomCursor  from './components/CustomCursor';
import ScrollProgress from './components/ScrollProgress';
import PortalIntro   from './components/PortalIntro';
import SampleViewer  from './pages/SampleViewer';

import './styles/globals.css';

const Hero               = lazy(() => import('./components/Hero'));
const DoctorAppreciation = lazy(() => import('./components/DoctorAppreciation'));
const PhilosophyDivider  = lazy(() => import('./components/PhilosophyDivider'));
const ClaimTime          = lazy(() => import('./components/ClaimTime'));
const RecordSaveExport   = lazy(() => import('./components/RecordSaveExport'));
const DictationTypes     = lazy(() => import('./components/DictationTypes'));
const MissionVision      = lazy(() => import('./components/MissionVision'));
const Closing            = lazy(() => import('./components/Closing'));

gsap.registerPlugin(ScrollTrigger);

function SectionFallback() {
  return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{
        width: 40, height: 40, border: '3px solid rgba(65,105,225,0.15)',
        borderTop: '3px solid #4169E1', borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
      }} />
      <style>{`@keyframes spin { to { transform:rotate(360deg); } }`}</style>
    </div>
  );
}

function LandingPage() {
  const [loaded, setLoaded]         = useState(false);
  const [portalDone, setPortalDone] = useState(false);
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (!loaded) return;
    const lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
    lenisRef.current = lenis;
    lenis.on('scroll', ScrollTrigger.update);
    const raf = (t: number) => { lenis.raf(t); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);
    gsap.ticker.lagSmoothing(0);
    return () => { lenis.destroy(); lenisRef.current = null; };
  }, [loaded]);

  return (
    <>
      {!loaded && <Loader onComplete={() => setLoaded(true)} />}

      {loaded && !portalDone && (
        <PortalIntro onComplete={() => setPortalDone(true)} />
      )}

      <div className="grain-overlay" />
      <ScrollProgress />
      <CustomCursor />

      <main>
        <Navigation />
        <Suspense fallback={<SectionFallback />}>
          <Hero />
          <DoctorAppreciation />
          <PhilosophyDivider />
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

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/sample/:type" element={<SampleViewer />} />
      </Routes>
    </BrowserRouter>
  );
}
