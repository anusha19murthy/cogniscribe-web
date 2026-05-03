import { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';

interface Props {
  onComplete: () => void;
}

/* ── Custom cursor ── */
function useCursor() {
  const dotRef  = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const mx = useRef(0), my = useRef(0);
  const cx = useRef(0), cy = useRef(0);

  useEffect(() => {
    const move = (e: MouseEvent) => {
      mx.current = e.clientX; my.current = e.clientY;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${e.clientX - 4}px, ${e.clientY - 4}px)`;
      }
    };
    window.addEventListener('mousemove', move);

    let raf = 0;
    const tick = () => {
      cx.current += (mx.current - cx.current) * 0.22;
      cy.current += (my.current - cy.current) * 0.22;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${cx.current - 14}px, ${cy.current - 14}px)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => { window.removeEventListener('mousemove', move); cancelAnimationFrame(raf); };
  }, []);

  return { dotRef, ringRef };
}

/* ── Curtain-wall glazing panel ── */
function CurtainPanel() {
  return (
    <div style={{
      width: '12%', height: 100,
      background: 'linear-gradient(180deg, #bfdbfe 0%, #dbeafe 50%, #bfdbfe 100%)',
      border: '1px solid #93c5fd',
      boxShadow: 'inset 0 1px 4px rgba(255,255,255,0.6)',
      position: 'relative',
    }}>
      {/* horizontal pane line */}
      <div style={{
        position: 'absolute', top: '50%', left: 0, right: 0,
        height: 1, background: 'rgba(65, 105, 225,0.18)',
      }} />
    </div>
  );
}

/* ── Glass diagonal reflection streak ── */
function Reflection({ left, top, h = 80 }: { left: string; top: string; h?: number }) {
  return (
    <div style={{
      position: 'absolute',
      left, top,
      width: 1, height: `${h}%`,
      background: 'rgba(255,255,255,0.55)',
      transform: 'rotate(20deg)',
      transformOrigin: 'top center',
      pointerEvents: 'none',
    }} />
  );
}

export default function PortalIntro({ onComplete }: Props) {
  const overlayRef    = useRef<HTMLDivElement>(null);
  const sceneRef      = useRef<HTMLDivElement>(null);
  const leftDoorRef   = useRef<HTMLDivElement>(null);
  const rightDoorRef  = useRef<HTMLDivElement>(null);
  const interiorRef   = useRef<HTMLDivElement>(null);
  const flareRef      = useRef<HTMLDivElement>(null);
  const uiRef         = useRef<HTMLDivElement>(null);
  const btnRef        = useRef<HTMLButtonElement>(null);
  const skipRef       = useRef<HTMLDivElement>(null);
  const motionBlurRef = useRef<HTMLDivElement>(null);
  const [triggered, setTriggered] = useState(false);
  const [btnHover, setBtnHover]   = useState(false);

  const { dotRef, ringRef } = useCursor();

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      onComplete(); return;
    }
    const t = setTimeout(() => {
      if (skipRef.current) gsap.to(skipRef.current, { opacity: 1, duration: 0.6 });
    }, 1500);
    return () => clearTimeout(t);
  }, [onComplete]);

  function triggerEnter() {
    if (triggered) return;
    setTriggered(true);

    const tl = gsap.timeline();

    // 0.0s — button click feel
    if (btnRef.current) {
      tl.to(btnRef.current, { scale: 0.94, duration: 0.1, ease: 'power2.in' })
        .to(btnRef.current, { scale: 1, duration: 0.15, ease: 'power2.out' });
    }

    // 0.15s — text fades out
    tl.to(uiRef.current, { opacity: 0, duration: 0.3 }, 0.15);

    // 0.3s — cinematic zoom + subtle tilt
    tl.to(sceneRef.current, {
      scale: 5, duration: 2.4, ease: 'expo.in',
    }, 0.3);
    tl.to(sceneRef.current, {
      rotateX: 1.5, duration: 2.4, ease: 'expo.in',
    }, 0.3);

    // 1.0s — doors swing open with 3D perspective hinge
    tl.to(leftDoorRef.current, {
      rotateY: -75, duration: 0.7, ease: 'power2.inOut',
    }, 1.0);
    tl.to(rightDoorRef.current, {
      rotateY: 75, duration: 0.7, ease: 'power2.inOut',
    }, 1.0);
    tl.to(interiorRef.current, {
      opacity: 1, duration: 0.6, ease: 'power2.in',
    }, 1.0);

    // motion blur peak
    tl.to(motionBlurRef.current, { backdropFilter: 'blur(3px)', duration: 0.25, ease: 'power2.out' }, 1.4)
      .to(motionBlurRef.current, { backdropFilter: 'blur(0px)', duration: 0.25, ease: 'power2.in'  }, 1.7);

    // 1.8s — brightness ramp
    tl.to(sceneRef.current, {
      filter: 'brightness(1.8)', duration: 0.6, ease: 'power2.in',
    }, 1.8);

    // 2.1s — white flare
    tl.to(flareRef.current, { opacity: 1, duration: 0.4, ease: 'power2.in' }, 2.1);

    // 2.4s — portal overlay fades out → onComplete
    tl.to(overlayRef.current, {
      opacity: 0, duration: 0.4, ease: 'power2.inOut',
      onComplete: () => onComplete(),
    }, 2.4);
  }

  return (
    <div
      ref={overlayRef}
      style={{
        position: 'fixed', inset: 0, zIndex: 99999,
        overflow: 'hidden', cursor: 'none',
        background: 'linear-gradient(180deg, #e8f0fe 0%, #f0f4ff 60%, #ffffff 100%)',
      }}
    >
      {/* ── GROUND ── */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        height: '20vh',
        background: '#f8faff',
        borderTop: '1px solid rgba(65, 105, 225,0.08)',
        zIndex: 1,
      }}>
        {/* Walkway */}
        <div style={{
          position: 'absolute', inset: 0,
          clipPath: 'polygon(42% 0%, 58% 0%, 75% 100%, 25% 100%)',
          background: 'rgba(65, 105, 225,0.06)',
        }} />
        <div style={{
          position: 'absolute', inset: 0,
          clipPath: 'polygon(42% 0%, 42.3% 0%, 25.3% 100%, 25% 100%)',
          background: 'rgba(65, 105, 225,0.18)',
        }} />
        <div style={{
          position: 'absolute', inset: 0,
          clipPath: 'polygon(57.7% 0%, 58% 0%, 75% 100%, 74.7% 100%)',
          background: 'rgba(65, 105, 225,0.18)',
        }} />
      </div>

      {/* ── SCENE WRAPPER ── */}
      <div
        ref={sceneRef}
        style={{
          position: 'absolute', inset: 0,
          transformOrigin: 'center 45%',
          transformStyle: 'preserve-3d',
          zIndex: 2,
        }}
      >
        {/* ── SIDE WINGS (depth) ── */}
        {([
          { side: 'left',  pos: { left:  '4vw' } },
          { side: 'right', pos: { right: '4vw' } },
        ] as const).map(w => (
          <div key={w.side} style={{
            position: 'absolute',
            ...w.pos,
            top: 'calc(6vh + 19.25vh)',
            width: '12vw', height: 'calc(55vh * 0.65)',
            background: '#f1f5f9',
            border: '1px solid rgba(65, 105, 225,0.12)',
            boxShadow: '0 4px 24px rgba(65, 105, 225,0.06)',
            zIndex: 1,
          }}>
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0,
              height: 4, background: '#1e3a6e',
            }} />
            <div style={{
              position: 'absolute', inset: '18% 18% 24%',
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gridTemplateRows: 'repeat(2, 1fr)',
              gap: 14,
            }}>
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} style={{
                  background: '#cbd5e1', padding: 2, borderRadius: 2,
                }}>
                  <div style={{
                    position: 'relative',
                    width: '100%', height: '100%',
                    background: 'linear-gradient(135deg, #dbeafe 0%, #eff6ff 100%)',
                  }}>
                    <div style={{
                      position: 'absolute', top: '50%', left: 0, right: 0,
                      height: 1, background: 'rgba(65, 105, 225,0.2)',
                    }} />
                    <div style={{
                      position: 'absolute', left: '50%', top: 0, bottom: 0,
                      width: 1, background: 'rgba(65, 105, 225,0.2)',
                    }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* ── MAIN BUILDING ── */}
        <div style={{
          position: 'absolute',
          left: '50%', top: '6vh',
          transform: 'translateX(-50%)',
          width: '70vw', height: '55vh',
          background: '#ffffff',
          border: '1px solid rgba(65, 105, 225,0.15)',
          boxShadow: '0 12px 60px rgba(65, 105, 225,0.12), 0 4px 12px rgba(0,0,0,0.06)',
          borderRadius: '4px 4px 0 0',
          zIndex: 2,
          overflow: 'hidden',
        }}>
          {/* Top brand strip */}
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0,
            height: 10, background: '#4169E1',
            zIndex: 4,
          }} />

          {/* Hospital sign panel */}
          <div style={{
            position: 'absolute',
            left: '50%', top: 28,
            transform: 'translateX(-50%)',
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: 4,
            padding: '14px 28px',
            display: 'flex', alignItems: 'center', gap: 16,
            boxShadow: '0 2px 8px rgba(65, 105, 225,0.06)',
          }}>
            {/* Crisp blue cross */}
            <div style={{ position: 'relative', width: 28, height: 28 }}>
              <div style={{
                position: 'absolute', left: '50%', top: 0,
                transform: 'translateX(-50%)',
                width: 8, height: 28, background: '#4169E1', borderRadius: 1,
              }} />
              <div style={{
                position: 'absolute', top: '50%', left: 0,
                transform: 'translateY(-50%)',
                width: 28, height: 8, background: '#4169E1', borderRadius: 1,
              }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <div style={{
                fontFamily: "'Montserrat', sans-serif",
                fontWeight: 700,
                fontSize: '1.6rem',
                color: '#1e3a6e',
                lineHeight: 1,
                letterSpacing: '-0.01em',
              }}>
                CogniScribe
              </div>
              <div style={{
                fontFamily: "'Montserrat', sans-serif",
                fontWeight: 700,
                fontSize: '0.65rem',
                color: '#4169E1',
                letterSpacing: '0.25em',
                marginTop: 5,
                textTransform: 'uppercase',
              }}>
                Medical Center
              </div>
            </div>
          </div>

          {/* Curtain wall — upper floor glazing */}
          <div style={{
            position: 'absolute',
            left: '8%', right: '8%',
            top: '38%',
            height: 100,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '2%',
          }}>
            {[0, 1, 2, 3].map(i => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                <CurtainPanel />
                {i < 3 && (
                  <div style={{
                    width: 4, height: 110, background: '#1e3a6e',
                    flexShrink: 0,
                  }} />
                )}
              </div>
            ))}
          </div>

          {/* Lower floor — secondary band */}
          <div style={{
            position: 'absolute',
            top: 'calc(38% + 110px)', left: 0, right: 0,
            height: 1, background: '#e2e8f0',
          }} />
        </div>

        {/* ── ENTRANCE PORTICO (projects forward) ── */}
        <div style={{
          position: 'absolute',
          left: '50%', bottom: 'calc(20vh + 24px)',
          transform: 'translateX(-50%)',
          width: 340,
          zIndex: 5,
        }}>
          {/* Portico structure */}
          <div style={{
            position: 'relative',
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            boxShadow: '0 8px 32px rgba(65, 105, 225,0.15), 0 2px 4px rgba(0,0,0,0.08)',
            paddingTop: 12,
          }}>
            {/* Flat roof canopy */}
            <div style={{
              position: 'absolute', top: 0, left: -6, right: -6,
              height: 12, background: '#1e3a6e',
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            }} />
            {/* Strip light under canopy */}
            <div style={{
              position: 'absolute', top: 12, left: 0, right: 0,
              height: 2,
              background: 'linear-gradient(90deg, transparent, #4169E1, transparent)',
              opacity: 0.6,
            }} />

            {/* Door header bar */}
            <div style={{
              position: 'absolute',
              top: 18, left: 30, right: 30,
              height: 16,
              background: '#1e3a6e',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              zIndex: 5,
            }}>
              <span style={{
                fontFamily: "'Montserrat', sans-serif",
                fontWeight: 700,
                fontSize: '0.55rem',
                color: 'white',
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
              }}>
                Automatic Door
              </span>
            </div>

            {/* Columns */}
            <div style={{
              position: 'absolute',
              left: 6, top: 40,
              width: 14, height: 140,
              background: 'linear-gradient(180deg, #f1f5f9 0%, #e2e8f0 100%)',
              border: '1px solid #cbd5e1',
              borderRadius: 3,
              boxShadow: '2px 0 4px rgba(0,0,0,0.06)',
              zIndex: 6,
            }} />
            <div style={{
              position: 'absolute',
              right: 6, top: 40,
              width: 14, height: 140,
              background: 'linear-gradient(180deg, #f1f5f9 0%, #e2e8f0 100%)',
              border: '1px solid #cbd5e1',
              borderRadius: 3,
              boxShadow: '-2px 0 4px rgba(0,0,0,0.06)',
              zIndex: 6,
            }} />

            {/* Door area */}
            <div style={{
              position: 'relative',
              margin: '40px 30px 12px',
              height: 180,
              perspective: 600,
            }}>
              {/* Interior glow */}
              <div
                ref={interiorRef}
                style={{
                  position: 'absolute', inset: 0,
                  background: 'linear-gradient(180deg, #fff9f0 0%, #ffffff 100%)',
                  opacity: 0.3,
                  zIndex: 0,
                }}
              />

              {/* Left door */}
              <div
                ref={leftDoorRef}
                style={{
                  position: 'absolute', left: 0, top: 0,
                  width: '50%', height: '100%',
                  background: 'linear-gradient(135deg, rgba(219,234,254,0.9) 0%, rgba(147,197,253,0.6) 50%, rgba(219,234,254,0.85) 100%)',
                  border: '1px solid rgba(65, 105, 225,0.3)',
                  borderRight: '2px solid rgba(255,255,255,0.85)',
                  boxShadow: 'inset -3px 0 10px rgba(255,255,255,0.5), 2px 0 8px rgba(0,0,0,0.08)',
                  zIndex: 2,
                  transformOrigin: 'left center',
                  transformStyle: 'preserve-3d',
                  backfaceVisibility: 'hidden',
                }}
              >
                <Reflection left="20%" top="6%" />
                <Reflection left="42%" top="3%" />
                <Reflection left="68%" top="9%" />
                {/* Horizontal push bar */}
                <div style={{
                  position: 'absolute',
                  left: '50%', top: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: 35, height: 4,
                  background: '#64748b',
                  borderRadius: 2,
                  boxShadow: '0 1px 2px rgba(0,0,0,0.15)',
                }} />
              </div>

              {/* Right door */}
              <div
                ref={rightDoorRef}
                style={{
                  position: 'absolute', right: 0, top: 0,
                  width: '50%', height: '100%',
                  background: 'linear-gradient(225deg, rgba(219,234,254,0.9) 0%, rgba(147,197,253,0.6) 50%, rgba(219,234,254,0.85) 100%)',
                  border: '1px solid rgba(65, 105, 225,0.3)',
                  borderLeft: '2px solid rgba(255,255,255,0.85)',
                  boxShadow: 'inset 3px 0 10px rgba(255,255,255,0.5), -2px 0 8px rgba(0,0,0,0.08)',
                  zIndex: 2,
                  transformOrigin: 'right center',
                  transformStyle: 'preserve-3d',
                  backfaceVisibility: 'hidden',
                }}
              >
                <Reflection left="20%" top="6%" />
                <Reflection left="42%" top="3%" />
                <Reflection left="68%" top="9%" />
                <div style={{
                  position: 'absolute',
                  left: '50%', top: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: 35, height: 4,
                  background: '#64748b',
                  borderRadius: 2,
                  boxShadow: '0 1px 2px rgba(0,0,0,0.15)',
                }} />
              </div>
            </div>
          </div>

          {/* Steps in front of portico */}
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            marginTop: -2,
          }}>
            <div style={{ width: 360, height: 8, background: '#e2e8f0' }} />
            <div style={{ width: 400, height: 8, background: '#cbd5e1' }} />
            <div style={{ width: 440, height: 8, background: '#b0bec5', boxShadow: '0 2px 4px rgba(0,0,0,0.08)' }} />
          </div>
        </div>

        {/* ── LAMP POSTS ── */}
        {[
          { left: '20%' },
          { right: '20%' },
        ].map((pos, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              ...pos,
              bottom: '20vh',
              width: 3, height: 100,
              zIndex: 3,
            }}
          >
            <div style={{ position: 'absolute', inset: 0, background: '#64748b' }} />
            <div style={{
              position: 'absolute',
              left: '50%', top: -4,
              transform: 'translateX(-50%)',
              width: 20, height: 8, borderRadius: 4,
              background: '#1e3a6e',
              boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
            }} />
            <div style={{
              position: 'absolute',
              left: '50%', top: 6,
              transform: 'translateX(-50%)',
              width: 60, height: 100,
              clipPath: 'polygon(45% 0%, 55% 0%, 100% 100%, 0% 100%)',
              background: 'linear-gradient(180deg, rgba(65, 105, 225,0.1) 0%, transparent 100%)',
              pointerEvents: 'none',
            }} />
          </div>
        ))}
      </div>

      {/* ── MOTION BLUR ── */}
      <div
        ref={motionBlurRef}
        style={{
          position: 'fixed', inset: 0,
          background: 'transparent',
          backdropFilter: 'blur(0px)',
          WebkitBackdropFilter: 'blur(0px)',
          pointerEvents: 'none', zIndex: 100,
        }}
      />

      {/* ── WHITE FLARE ── */}
      <div
        ref={flareRef}
        style={{
          position: 'absolute', inset: 0,
          background: '#ffffff',
          opacity: 0, pointerEvents: 'none', zIndex: 5,
        }}
      />

      {/* ── HUD BADGE ── */}
      <div style={{
        position: 'absolute', top: 24, left: 32, zIndex: 10,
        background: 'white',
        border: '1px solid rgba(65, 105, 225,0.2)',
        borderRadius: 50,
        padding: '6px 16px',
        fontSize: '0.8rem',
        fontWeight: 600,
        fontFamily: "'Montserrat', sans-serif",
        color: '#4169E1',
        letterSpacing: '0.04em',
        boxShadow: '0 2px 8px rgba(65, 105, 225,0.1)',
      }}>
        CogniScribe Medical AI
      </div>

      {/* ── SKIP INTRO ── */}
      <div
        ref={skipRef}
        onClick={() => onComplete()}
        onMouseEnter={e => {
          (e.currentTarget.style.color = '#1a1a2e');
          if (ringRef.current) ringRef.current.style.width = ringRef.current.style.height = '44px';
        }}
        onMouseLeave={e => {
          (e.currentTarget.style.color = '#64748b');
          if (ringRef.current) ringRef.current.style.width = ringRef.current.style.height = '28px';
        }}
        style={{
          position: 'absolute', top: 24, right: 32, zIndex: 10,
          fontSize: 13, fontWeight: 500,
          fontFamily: "'Montserrat', sans-serif",
          color: '#64748b', cursor: 'none',
          opacity: 0, letterSpacing: '0.03em',
          transition: 'color 0.2s',
        }}
      >
        Skip Intro
      </div>

      {/* ── TEXT + BUTTON UI (transparent — text-shadow only) ── */}
      <div
        ref={uiRef}
        style={{
          position: 'absolute',
          left: '50%', bottom: '4%',
          transform: 'translateX(-50%)',
          zIndex: 10, textAlign: 'center',
          fontFamily: "'Montserrat', sans-serif",
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14,
          width: 'min(720px, 90vw)',
          background: 'transparent',
          pointerEvents: 'none',
        }}
      >
        <h2 style={{
          fontSize: 'clamp(1.4rem, 2.6vw, 2rem)',
          fontWeight: 700, color: '#1a1a2e', margin: 0,
          letterSpacing: '-0.02em', lineHeight: 1.2,
          textShadow: '0 1px 12px rgba(255,255,255,0.8)',
        }}>
          Step into smarter documentation
        </h2>
        <p style={{
          fontSize: '0.95rem', fontWeight: 500,
          color: '#475569', margin: 0,
          letterSpacing: '0.01em',
        }}>
          AI-powered medical scribe — built for doctors
        </p>

        <button
          ref={btnRef}
          onClick={triggerEnter}
          disabled={triggered}
          onMouseEnter={() => {
            setBtnHover(true);
            if (ringRef.current) ringRef.current.style.width = ringRef.current.style.height = '44px';
            if (dotRef.current) dotRef.current.style.background = '#4169E1';
          }}
          onMouseLeave={() => {
            setBtnHover(false);
            if (ringRef.current) ringRef.current.style.width = ringRef.current.style.height = '28px';
            if (dotRef.current) dotRef.current.style.background = '#1a1a2e';
          }}
          style={{
            marginTop: 10,
            padding: '14px 44px',
            background: btnHover ? '#1d4ed8' : '#4169E1',
            border: 'none', borderRadius: 50,
            fontSize: 15, fontWeight: 700,
            fontFamily: "'Montserrat', sans-serif",
            color: 'white', cursor: 'none',
            boxShadow: btnHover
              ? '0 8px 32px rgba(65, 105, 225,0.5)'
              : '0 4px 20px rgba(65, 105, 225,0.35)',
            transform: btnHover ? 'scale(1.03)' : 'scale(1)',
            transition: 'all 0.2s ease',
            pointerEvents: 'auto',
            letterSpacing: '0.02em',
          }}
        >
          Enter CogniScribe
        </button>
      </div>

      {/* ── CUSTOM CURSOR ── */}
      <div
        ref={dotRef}
        style={{
          position: 'fixed', top: 0, left: 0,
          width: 8, height: 8, borderRadius: '50%',
          background: '#1a1a2e', pointerEvents: 'none',
          zIndex: 100000,
          transition: 'background 0.2s',
        }}
      />
      <div
        ref={ringRef}
        style={{
          position: 'fixed', top: 0, left: 0,
          width: 28, height: 28, borderRadius: '50%',
          border: '2px solid #4169E1', pointerEvents: 'none',
          zIndex: 100000,
          transition: 'width 0.2s ease, height 0.2s ease',
        }}
      />
    </div>
  );
}
