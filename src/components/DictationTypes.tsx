import { useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  IconClipboard, IconScalpel, IconActivity, IconEye,
  IconFileText, IconGlobe, IconCalendar, IconFileText as IconPdf,
} from './Icons';

/* ── Per-card color theme ── */
interface CardTheme {
  color: string;
  light: string;
  shadow: string;
  border: string;
}

const THEMES: CardTheme[] = [
  { color: '#7c3aed', light: '#f5f3ff', shadow: 'rgba(124,58,237,0.18)', border: 'rgba(124,58,237,0.4)' },
  { color: '#ea580c', light: '#fff7ed', shadow: 'rgba(234,88,12,0.18)',  border: 'rgba(234,88,12,0.4)'  },
  { color: '#16a34a', light: '#f0fdf4', shadow: 'rgba(22,163,74,0.18)',  border: 'rgba(22,163,74,0.4)'  },
  { color: '#db2777', light: '#fdf2f8', shadow: 'rgba(219,39,119,0.18)', border: 'rgba(219,39,119,0.4)' },
];

/* ── Ripple rings (reusable) ── */
function Ripples({ active, color }: { active: boolean; color: string }) {
  return (
    <AnimatePresence>
      {active && [0, 0.3].map((delay, i) => (
        <motion.div
          key={i}
          initial={{ scale: 1, opacity: 0.5 }}
          animate={{ scale: 2.5, opacity: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, delay, repeat: Infinity, ease: 'easeOut' }}
          style={{
            position: 'absolute', inset: 0, borderRadius: '50%',
            border: `2px solid ${color}`, pointerEvents: 'none',
          }}
        />
      ))}
    </AnimatePresence>
  );
}

/* ── Animated icon per card type ── */
type CardType = 'opd' | 'surgery' | 'progress' | 'imaging';

function AnimatedIcon({
  type, Icon, color, hovered,
}: {
  type: CardType;
  Icon: React.ComponentType<{ size: number; color: string }>;
  color: string;
  hovered: boolean;
}) {
  const iconColor = hovered ? 'white' : color;

  const anim = {
    opd:      hovered ? { y: [-3, 0],           transition: { duration: 0.3 } } : {},
    surgery:  hovered ? { rotate: [-15, 15, 0], transition: { duration: 0.4 } } : {},
    progress: hovered ? { scale: [1, 1.3, 1, 1.2, 1], transition: { duration: 0.6 } } : {},
    imaging:  hovered ? { scaleX: [1, 0.3, 1],  transition: { duration: 0.5 } } : {},
  }[type];

  return (
    <motion.div key={hovered ? 'h' : 'i'} animate={anim as object}>
      <Icon size={24} color={iconColor} />
    </motion.div>
  );
}

/* ── Single specialty card ── */
interface SpecialtyCard {
  type: CardType;
  Icon: React.ComponentType<{ size: number; color: string }>;
  title: string;
  desc: string;
  tags: string[];
}

function SpecCard({ s, theme, i }: { s: SpecialtyCard; theme: CardTheme; i: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const [tilt, setTilt]       = useState({ rx: 0, ry: 0 });
  const [shine, setShine]     = useState({ x: 50, y: 50 });

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ rx: -y * 24, ry: x * 24 });
    setShine({ x: (x + 0.5) * 100, y: (y + 0.5) * 100 });
  }, []);

  const handleEnter = useCallback(() => setHovered(true), []);
  const handleLeave = useCallback(() => { setHovered(false); setTilt({ rx: 0, ry: 0 }); }, []);

  const circleBg    = hovered ? theme.color : theme.light;

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.6, delay: i * 0.1 }}
      style={{ perspective: '1000px' }}
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
        style={{
          background: '#ffffff',
          borderRadius: 20,
          padding: 32,
          boxShadow: hovered
            ? `0 20px 60px ${theme.shadow}, 0 8px 20px ${theme.shadow}`
            : '0 2px 8px rgba(0,0,0,0.06)',
          border: hovered
            ? `1px solid ${theme.border}`
            : '1px solid rgba(0,0,0,0.07)',
          borderLeft: hovered ? `3px solid ${theme.color}` : '1px solid rgba(0,0,0,0.07)',
          cursor: 'none',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          transform: `perspective(1000px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) scale(${hovered ? 1.03 : 1})`,
          transition: hovered
            ? 'transform 0.1s ease, box-shadow 0.3s ease, border-color 0.3s ease'
            : 'transform 0.5s ease, box-shadow 0.3s ease, border-color 0.3s ease',
          willChange: 'transform',
        }}
      >
        {/* Shine layer */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 10,
          background: `radial-gradient(circle at ${shine.x}% ${shine.y}%, rgba(255,255,255,0.18) 0%, transparent 60%)`,
          opacity: hovered ? 1 : 0,
          transition: 'opacity 0.2s ease',
        }} />

        <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', flex: 1 }}>
          {/* Icon circle */}
          <div style={{ position: 'relative', display: 'inline-block', marginBottom: 18, alignSelf: 'flex-start' }}>
            <div style={{
              width: 52, height: 52, borderRadius: '50%',
              background: circleBg,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              position: 'relative',
              transition: 'background 0.25s ease',
            }}>
              <Ripples active={hovered} color={theme.color} />
              <AnimatedIcon type={s.type} Icon={s.Icon} color={theme.color} hovered={hovered} />
            </div>
          </div>

          <h3 style={{
            fontWeight: 700, fontSize: '1.1rem',
            color: 'var(--text)', margin: '0 0 10px',
            letterSpacing: '-0.01em',
          }}>
            {s.title}
          </h3>

          <p style={{
            color: 'var(--text-light)', fontSize: '0.88rem',
            lineHeight: 1.7, margin: '0 0 16px', fontWeight: 500,
            flex: 1,
          }}>
            {s.desc}
          </p>

          {/* Tags */}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 18 }}>
            {s.tags.map(t => (
              <span key={t} style={{
                fontSize: '0.72rem', fontWeight: 600,
                background: theme.light,
                color: theme.color,
                borderRadius: 50, padding: '4px 12px',
                border: `1px solid ${theme.color}30`,
              }}>
                {t}
              </span>
            ))}
          </div>

          {/* View Sample button */}
          <button
            onClick={() => window.open(`/sample/${s.type}`, '_blank')}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '6px 16px', borderRadius: 50,
              fontSize: '0.75rem', fontWeight: 600,
              fontFamily: "'Montserrat', sans-serif",
              border: `1.5px solid ${theme.color}66`,
              color: theme.color,
              background: theme.light,
              cursor: 'none',
              transition: 'all 0.2s ease',
              alignSelf: 'flex-start',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = theme.color;
              e.currentTarget.style.color = 'white';
              e.currentTarget.style.borderColor = theme.color;
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = theme.light;
              e.currentTarget.style.color = theme.color;
              e.currentTarget.style.borderColor = `${theme.color}66`;
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            <IconPdf size={14} color="currentColor" />
            View Sample
          </button>
        </div>
      </div>
    </motion.div>
  );
}

const SPECIALTIES: SpecialtyCard[] = [
  {
    type: 'opd', Icon: IconClipboard, title: 'OPD',
    desc: 'Chief complaint, vitals, diagnosis, medications — structured instantly',
    tags: ['Vitals', 'Diagnosis', 'Rx'],
  },
  {
    type: 'surgery', Icon: IconScalpel, title: 'Surgery',
    desc: 'Operative findings, procedure details, blood loss, post-op plan',
    tags: ['Procedure', 'Findings', 'Post-op'],
  },
  {
    type: 'progress', Icon: IconActivity, title: 'Progress',
    desc: 'Day-wise clinical status, ventilator settings, investigation results',
    tags: ['Status', 'Vitals', 'Labs'],
  },
  {
    type: 'imaging', Icon: IconEye, title: 'Imaging',
    desc: 'Findings, impression, recommendation — ready to sign',
    tags: ['Findings', 'Impression'],
  },
];

const FEATURES = [
  {
    Icon: IconFileText, title: 'Structured Notes with Flexible Export',
    body: 'Every dictation becomes a clean, professional, structured clinical note — formatted specifically for that note type. Export as a branded PDF with your name and clinic on it, share it, print it, send it. Your documentation, your way.',
  },
  {
    Icon: IconGlobe, title: 'Built for Indian Doctors, Indian Languages',
    body: 'Supports multiple languages. However you speak in the clinic — CogniScribe listens, understands, and responds in perfect structured English. No accent training. No setup. Just speak.',
  },
  {
    Icon: IconCalendar, title: "Every Patient's History in One Place",
    body: 'Stop searching across registers, files, and apps. Every patient has their own complete record — every note, every visit, every dictation — organized, structured, and accessible in seconds. The way it should have always been.',
  },
];

export default function DictationTypes() {
  return (
    <section style={{
      padding: '100px 0',
      background: '#ffffff',
      fontFamily: "'Montserrat', sans-serif",
    }}>
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
            Why CogniScribe
          </div>
          <h2 style={{
            fontWeight: 700,
            fontSize: 'clamp(1.9rem, 3.5vw, 2.8rem)',
            color: 'var(--text)',
            lineHeight: 1.2, margin: '0 0 14px',
          }}>
            Four Dictation Types, Built for Every Specialty
          </h2>
          <p style={{
            color: 'var(--text-light)',
            fontSize: '1.05rem', lineHeight: 1.7,
            maxWidth: 620, margin: '0 auto', fontWeight: 500,
          }}>
            Whether you are running an OPD, performing a surgery, writing a progress
            note, or reporting an imaging study — CogniScribe understands the context
            and extracts exactly what matters.
          </p>
        </motion.div>

        {/* 2×2 specialty cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 24,
          marginBottom: 72,
        }}>
          {SPECIALTIES.map((s, i) => (
            <SpecCard key={i} s={s} theme={THEMES[i]} i={i} />
          ))}
        </div>

        {/* Feature rows */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {FEATURES.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              style={{
                display: 'grid',
                gridTemplateColumns: i % 2 === 0 ? '80px 1fr' : '1fr 80px',
                gap: 36, alignItems: 'center',
                padding: '36px 0',
                borderTop: i === 0 ? 'none' : '1px solid rgba(65,105,225,0.08)',
              }}
            >
              {i % 2 === 0 ? (
                <>
                  <div style={{
                    width: 64, height: 64, borderRadius: 14,
                    background: 'rgba(65,105,225,0.08)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <f.Icon size={28} color="#4169E1" />
                  </div>
                  <div>
                    <h3 style={{ fontWeight: 700, fontSize: '1.15rem', color: 'var(--text)', margin: '0 0 10px' }}>
                      {f.title}
                    </h3>
                    <p style={{ color: 'var(--text-light)', fontSize: '0.95rem', lineHeight: 1.75, margin: 0, fontWeight: 500 }}>
                      {f.body}
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <h3 style={{ fontWeight: 700, fontSize: '1.15rem', color: 'var(--text)', margin: '0 0 10px' }}>
                      {f.title}
                    </h3>
                    <p style={{ color: 'var(--text-light)', fontSize: '0.95rem', lineHeight: 1.75, margin: 0, fontWeight: 500 }}>
                      {f.body}
                    </p>
                  </div>
                  <div style={{
                    width: 64, height: 64, borderRadius: 14,
                    background: 'rgba(65,105,225,0.08)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    justifySelf: 'end',
                  }}>
                    <f.Icon size={28} color="#4169E1" />
                  </div>
                </>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
