import { useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IconMic, IconSave, IconUpload, IconArrowRight } from './Icons';

/* ── Ripple rings for Record card ── */
function RecordRipples({ active }: { active: boolean }) {
  return (
    <AnimatePresence>
      {active && (
        <>
          {[0, 0.3].map((delay, i) => (
            <motion.div
              key={i}
              initial={{ scale: 1, opacity: 0.6 }}
              animate={{ scale: 2.5, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1, delay, repeat: Infinity, ease: 'easeOut' }}
              style={{
                position: 'absolute', inset: 0,
                borderRadius: '50%',
                border: '2px solid #4169E1',
                pointerEvents: 'none',
              }}
            />
          ))}
        </>
      )}
    </AnimatePresence>
  );
}

/* ── Upward particles for Export card ── */
function ExportParticles({ active }: { active: boolean }) {
  return (
    <AnimatePresence>
      {active && (
        <>
          {[-6, 0, 6].map((x, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 1, y: 0, x }}
              animate={{ opacity: 0, y: -22, x }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: 'easeOut' }}
              style={{
                position: 'absolute',
                bottom: '100%', left: '50%',
                width: 4, height: 4, borderRadius: '50%',
                background: '#4169E1',
                pointerEvents: 'none',
                marginLeft: -2,
              }}
            />
          ))}
        </>
      )}
    </AnimatePresence>
  );
}

/* ── Individual tilt card ── */
interface StepType {
  n: string;
  type: 'record' | 'save' | 'export';
  Icon: React.ComponentType<{ size: number; color: string }>;
  title: string;
  desc: string;
}

function TiltCard({ s, index }: { s: StepType; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });
  const [shine, setShine] = useState({ x: 50, y: 50 });
  const [saveChecked, setSaveChecked] = useState(false);
  const exportKey = useRef(0);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ rx: -y * 24, ry: x * 24 });
    setShine({ x: (x + 0.5) * 100, y: (y + 0.5) * 100 });
  }, []);

  const handleMouseEnter = useCallback(() => {
    setHovered(true);
    if (s.type === 'save') {
      setSaveChecked(false);
      setTimeout(() => setSaveChecked(true), 400);
    }
    if (s.type === 'export') {
      exportKey.current += 1;
    }
  }, [s.type]);

  const handleMouseLeave = useCallback(() => {
    setHovered(false);
    setTilt({ rx: 0, ry: 0 });
    setSaveChecked(false);
  }, []);

  const iconBg = hovered ? '#4169E1' : 'rgba(65,105,225,0.08)';
  const iconColor = hovered ? 'white' : '#4169E1';

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ perspective: '1000px', transformStyle: 'preserve-3d' }}
    >
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.6, delay: index * 0.12 }}
        style={{
          background: '#ffffff',
          borderRadius: 20,
          padding: 36,
          boxShadow: hovered
            ? '0 20px 60px rgba(65,105,225,0.2), 0 8px 20px rgba(65,105,225,0.1)'
            : '0 2px 8px rgba(65,105,225,0.08)',
          border: hovered
            ? '1px solid rgba(65,105,225,0.4)'
            : '1px solid rgba(65,105,225,0.12)',
          height: '100%',
          cursor: 'none',
          position: 'relative',
          overflow: 'hidden',
          transform: `perspective(1000px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) scale(${hovered ? 1.04 : 1})`,
          transition: hovered ? 'transform 0.1s ease, box-shadow 0.3s ease, border-color 0.3s ease' : 'transform 0.5s ease, box-shadow 0.3s ease, border-color 0.3s ease',
        }}
      >
        {/* Shine layer */}
        <div style={{
          position: 'absolute', inset: 0,
          background: `radial-gradient(circle at ${shine.x}% ${shine.y}%, rgba(255,255,255,0.15) 0%, transparent 60%)`,
          pointerEvents: 'none',
          zIndex: 10,
          opacity: hovered ? 1 : 0,
          transition: 'opacity 0.2s ease',
        }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          {/* Icon circle */}
          <div style={{ position: 'relative', display: 'inline-block', marginBottom: 20 }}>
            <motion.div
              animate={{
                background: iconBg,
                scale: hovered && s.type === 'record' ? [1, 1.2, 1] : 1,
              }}
              transition={s.type === 'record' && hovered
                ? { duration: 0.4, ease: 'easeInOut' }
                : { duration: 0.25 }
              }
              style={{
                width: 56, height: 56, borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                position: 'relative',
              }}
            >
              {/* Record ripples */}
              {s.type === 'record' && <RecordRipples active={hovered} />}

              {/* Save: drop animation */}
              {s.type === 'save' ? (
                <motion.div
                  key={hovered ? 'hovered' : 'idle'}
                  animate={hovered ? { y: [-4, 4, 0] } : { y: 0 }}
                  transition={hovered ? { duration: 0.6, ease: [0.34, 1.56, 0.64, 1] } : {}}
                >
                  <s.Icon size={28} color={iconColor} />
                </motion.div>
              ) : s.type === 'export' ? (
                <div style={{ position: 'relative' }}>
                  <motion.div
                    key={hovered ? 'hovered' : 'idle'}
                    animate={hovered ? { y: [0, -6, 0] } : { y: 0 }}
                    transition={hovered ? { duration: 0.5, ease: 'easeInOut' } : {}}
                  >
                    <s.Icon size={28} color={iconColor} />
                  </motion.div>
                  {/* Export particles */}
                  <ExportParticles active={hovered} key={exportKey.current} />
                </div>
              ) : (
                <s.Icon size={28} color={iconColor} />
              )}
            </motion.div>

            {/* Save checkmark */}
            {s.type === 'save' && (
              <AnimatePresence>
                {saveChecked && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: [0.34, 1.56, 0.64, 1] }}
                    style={{
                      position: 'absolute', bottom: -6, right: -6,
                      width: 18, height: 18, borderRadius: '50%',
                      background: '#10B981',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 10, color: 'white', fontWeight: 700,
                      lineHeight: 1,
                    }}
                  >
                    ✓
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          </div>

          {/* Step number */}
          <div style={{
            fontSize: '0.7rem', fontWeight: 700,
            letterSpacing: '0.1em', marginBottom: 10,
            color: hovered ? '#4169E1' : '#718096',
            fontSize: hovered ? '0.75rem' : '0.7rem',
            transition: 'color 0.2s ease, font-size 0.2s ease',
          } as React.CSSProperties}>
            {s.n}
          </div>

          <h3 style={{
            fontFamily: "'Montserrat', sans-serif",
            fontWeight: 700, fontSize: '1.25rem',
            color: 'var(--text)', margin: '0 0 12px',
            letterSpacing: '-0.01em',
          }}>
            {s.title}
          </h3>
          <p style={{
            color: 'var(--text-light)', fontSize: '0.93rem',
            lineHeight: 1.75, margin: 0, fontWeight: 500,
          }}>
            {s.desc}
          </p>
        </div>
      </motion.div>
    </div>
  );
}

const STEPS: StepType[] = [
  {
    n: '01', type: 'record', Icon: IconMic, title: 'Record',
    desc: 'Start your consultation naturally. CogniScribe captures audio, filters background noise, and begins structuring your notes in real-time.',
  },
  {
    n: '02', type: 'save', Icon: IconSave, title: 'Save',
    desc: 'Notes are auto-formatted into SOAP, H&P, or specialty-specific templates. Always documentation-standard compliant.',
  },
  {
    n: '03', type: 'export', Icon: IconUpload, title: 'Export',
    desc: 'Direct integration with Epic, Cerner, Athena and 40+ EHRs. HIPAA-compliant transfer. Notes appear in seconds.',
  },
];

export default function RecordSaveExport() {
  return (
    <section style={{
      padding: '100px 0',
      background: '#F8F9FB',
      fontFamily: "'Montserrat', sans-serif",
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 5%' }}>
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: 64 }}
        >
          <div style={{
            color: '#4169E1',
            fontSize: '0.75rem', fontWeight: 700,
            letterSpacing: '0.15em', textTransform: 'uppercase',
            marginBottom: 12,
          }}>
            How It Works
          </div>
          <h2 style={{
            fontWeight: 700,
            fontSize: 'clamp(1.9rem, 3.5vw, 2.8rem)',
            color: 'var(--text)',
            lineHeight: 1.2, margin: '0 0 14px',
          }}>
            Record. Save. Export.
          </h2>
          <p style={{
            color: 'var(--text-light)',
            fontSize: '1.05rem', lineHeight: 1.7,
            maxWidth: 560, margin: '0 auto', fontWeight: 500,
          }}>
            Three simple steps. From spoken consultation to structured EHR record — automatically.
          </p>
        </motion.div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 28,
          alignItems: 'stretch',
          position: 'relative',
        }}>
          {STEPS.map((s, i) => (
            <div key={i} style={{ position: 'relative' }}>
              <TiltCard s={s} index={i} />
              {i < STEPS.length - 1 && (
                <div style={{
                  position: 'absolute',
                  right: -18, top: '50%',
                  transform: 'translateY(-50%)',
                  zIndex: 1,
                }}>
                  <IconArrowRight size={20} color="rgba(65,105,225,0.3)" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
