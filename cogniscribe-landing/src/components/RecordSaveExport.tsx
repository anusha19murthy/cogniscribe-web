import { useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { IconMic, IconSave, IconUpload, IconArrowRight } from './Icons';

const STEPS = [
  {
    n: '01', Icon: IconMic, title: 'Record',
    desc: 'Start your consultation naturally. CogniScribe captures audio, filters background noise, and begins structuring your notes in real-time.',
    type: 'record',
  },
  {
    n: '02', Icon: IconSave, title: 'Save',
    desc: 'Notes are auto-formatted into SOAP, H&P, or specialty-specific templates. Always documentation-standard compliant.',
    type: 'save',
  },
  {
    n: '03', Icon: IconUpload, title: 'Export',
    desc: 'Direct integration with Epic, Cerner, Athena and 40+ EHRs. HIPAA-compliant transfer. Notes appear in seconds.',
    type: 'export',
  },
];

function TiltCard({ s, i }: { s: typeof STEPS[0]; i: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, mx: 50, my: 50 });
  const [hovered, setHovered] = useState(false);

  const onMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setTilt({
      rx: (y - 0.5) * -24,
      ry: (x - 0.5) * 24,
      mx: x * 100,
      my: y * 100,
    });
  }, []);

  const onMouseLeave = useCallback(() => {
    setTilt({ rx: 0, ry: 0, mx: 50, my: 50 });
    setHovered(false);
  }, []);

  return (
    <div style={{ position: 'relative' }}>
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.6, delay: i * 0.12 }}
      >
        <div
          ref={cardRef}
          onMouseMove={onMouseMove}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={onMouseLeave}
          style={{
            background: '#ffffff',
            borderRadius: 20,
            padding: 36,
            boxShadow: hovered
              ? '0 20px 60px rgba(65,105,225,0.2)'
              : '0 2px 8px rgba(65,105,225,0.08)',
            border: '1px solid rgba(65,105,225,0.12)',
            height: '100%',
            cursor: 'none',
            position: 'relative',
            overflow: 'hidden',
            transform: `perspective(1000px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) scale(${hovered ? 1.04 : 1})`,
            transition: hovered
              ? 'transform 0.1s ease, box-shadow 0.3s ease'
              : 'transform 0.5s ease, box-shadow 0.5s ease',
            willChange: 'transform',
          }}
        >
          {/* Shine layer */}
          <div style={{
            position: 'absolute', inset: 0, borderRadius: 20,
            background: `radial-gradient(circle at ${tilt.mx}% ${tilt.my}%, rgba(255,255,255,0.15) 0%, transparent 60%)`,
            pointerEvents: 'none',
            opacity: hovered ? 1 : 0,
            transition: 'opacity 0.3s ease',
          }} />

          {/* Icon with animations */}
          <div style={{ position: 'relative', width: 56, height: 56, marginBottom: 20 }}>
            <IconCircle type={s.type} hovered={hovered} Icon={s.Icon} />
          </div>

          <div style={{
            fontSize: '0.7rem', fontWeight: 700,
            color: hovered ? '#4169E1' : '#718096',
            letterSpacing: '0.1em', marginBottom: 10,
            transition: 'color 0.3s ease',
          }}>
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
  );
}

function IconCircle({ type, hovered, Icon }: { type: string; hovered: boolean; Icon: React.ComponentType<{ size: number; color: string }> }) {
  return (
    <>
      <style>{`
        @keyframes ripple-out {
          0%   { transform: scale(1); opacity: 0.6; }
          100% { transform: scale(2.2); opacity: 0; }
        }
        @keyframes icon-pulse {
          0%,100% { transform: scale(1); }
          50%      { transform: scale(1.2); }
        }
        @keyframes icon-bounce-save {
          0%,100% { transform: translateY(0); }
          40%     { transform: translateY(-4px); }
          70%     { transform: translateY(4px); }
        }
        @keyframes icon-lift-export {
          0%,100% { transform: translateY(0); }
          50%     { transform: translateY(-6px); }
        }
        @keyframes dot-shoot {
          0%   { transform: translateY(0); opacity: 1; }
          100% { transform: translateY(-16px); opacity: 0; }
        }
        @keyframes check-fade {
          0%   { opacity: 0; transform: scale(0.6); }
          100% { opacity: 1; transform: scale(1); }
        }
      `}</style>

      {/* Background circle */}
      <div style={{
        position: 'absolute', inset: 0, borderRadius: '50%',
        background: hovered ? '#4169E1' : 'rgba(65,105,225,0.08)',
        transition: 'background 0.3s ease',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 1,
      }}>
        <div style={{
          animation: hovered
            ? type === 'record' ? 'icon-pulse 0.6s ease infinite'
            : type === 'save'   ? 'icon-bounce-save 0.8s ease infinite'
            : 'icon-lift-export 0.7s ease infinite'
            : 'none',
        }}>
          <Icon size={28} color={hovered ? 'white' : '#4169E1'} />
        </div>
      </div>

      {/* Record — ripple rings */}
      {type === 'record' && hovered && (
        <>
          <div style={{
            position: 'absolute', inset: 0, borderRadius: '50%',
            border: '2px solid #4169E1',
            animation: 'ripple-out 1s ease-out infinite',
            zIndex: 0,
          }} />
          <div style={{
            position: 'absolute', inset: 0, borderRadius: '50%',
            border: '2px solid #4169E1',
            animation: 'ripple-out 1s ease-out 0.4s infinite',
            zIndex: 0,
          }} />
        </>
      )}

      {/* Save — green checkmark */}
      {type === 'save' && hovered && (
        <div style={{
          position: 'absolute', bottom: -14, left: '50%',
          transform: 'translateX(-50%)',
          animation: 'check-fade 0.3s ease forwards',
          zIndex: 2,
        }}>
          <svg width="14" height="10" viewBox="0 0 14 10" fill="none">
            <path d="M1 5l4 4 8-8" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      )}

      {/* Export — dots shooting upward */}
      {type === 'export' && hovered && (
        <>
          {[-8, 0, 8].map((offset, di) => (
            <div key={di} style={{
              position: 'absolute', bottom: -2,
              left: `calc(50% + ${offset}px)`,
              width: 4, height: 4, borderRadius: '50%',
              background: '#4169E1',
              animation: `dot-shoot 0.6s ease ${di * 0.12}s infinite`,
              zIndex: 2,
            }} />
          ))}
        </>
      )}
    </>
  );
}

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
            <TiltCard key={i} s={s} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
