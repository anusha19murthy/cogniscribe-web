import { useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  IconClipboard, IconScalpel, IconActivity, IconEye,
  IconFileText, IconGlobe, IconCalendar,
} from './Icons';

const SPECIALTIES = [
  {
    Icon: IconClipboard, title: 'OPD', type: 'opd',
    color: '#7c3aed', light: '#f5f3ff',
    desc: 'Chief complaint, vitals, diagnosis, medications — structured instantly.',
    tags: ['Vitals', 'Diagnosis', 'Rx'],
    iconAnim: 'bounce',
  },
  {
    Icon: IconScalpel, title: 'Surgery', type: 'surgery',
    color: '#ea580c', light: '#fff7ed',
    desc: 'Operative findings, procedure details, blood loss, post-op plan.',
    tags: ['Procedure', 'Findings', 'Post-op'],
    iconAnim: 'rotate',
  },
  {
    Icon: IconActivity, title: 'Progress', type: 'progress',
    color: '#16a34a', light: '#f0fdf4',
    desc: 'Day-wise clinical status, ventilator settings, investigation results.',
    tags: ['Status', 'Vitals', 'Labs'],
    iconAnim: 'heartbeat',
  },
  {
    Icon: IconEye, title: 'Imaging', type: 'imaging',
    color: '#db2777', light: '#fdf2f8',
    desc: 'Findings, impression, recommendation — ready to sign.',
    tags: ['Findings', 'Impression'],
    iconAnim: 'blink',
  },
];

const FEATURES = [
  {
    Icon: IconFileText, title: 'Structured Notes with Flexible Export',
    body: 'Every dictation becomes a clean, professional, structured clinical note — formatted specifically for that note type. Export as branded PDF, share, print, or send.',
  },
  {
    Icon: IconGlobe, title: 'Built for Indian Doctors, Indian Languages',
    body: 'Supports multiple languages. However you speak in clinic, CogniScribe listens, understands, and responds in perfect structured English. No accent training. No setup.',
  },
  {
    Icon: IconCalendar, title: "Every Patient's History in One Place",
    body: 'Stop searching across registers, files, and apps. Every patient has their own complete record — every note, every visit — organized and accessible in seconds.',
  },
];

function SpecialtyCard({ s, i }: { s: typeof SPECIALTIES[0]; i: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, mx: 50, my: 50 });
  const [hovered, setHovered] = useState(false);

  const onMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setTilt({ rx: (y - 0.5) * -24, ry: (x - 0.5) * 24, mx: x * 100, my: y * 100 });
  }, []);

  const onMouseLeave = useCallback(() => {
    setTilt({ rx: 0, ry: 0, mx: 50, my: 50 });
    setHovered(false);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.6, delay: i * 0.1 }}
    >
      <style>{`
        @keyframes dt-bounce   { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-3px)} }
        @keyframes dt-rotate   { 0%{transform:rotate(-15deg)} 50%{transform:rotate(15deg)} 100%{transform:rotate(-15deg)} }
        @keyframes dt-heartbeat{ 0%,100%{transform:scale(1)} 20%{transform:scale(1.3)} 40%{transform:scale(1)} 60%{transform:scale(1.2)} 80%{transform:scale(1)} }
        @keyframes dt-blink    { 0%,100%{transform:scaleX(1)} 50%{transform:scaleX(0.3)} }
        @keyframes dt-ripple   { 0%{transform:scale(1);opacity:0.6} 100%{transform:scale(2.4);opacity:0} }
      `}</style>
      <div
        ref={cardRef}
        onMouseMove={onMouseMove}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={onMouseLeave}
        style={{
          background: '#ffffff',
          borderRadius: 20,
          padding: 32,
          boxShadow: hovered
            ? `0 20px 60px ${s.color}33`
            : '0 2px 8px rgba(65,105,225,0.08)',
          border: hovered
            ? `1px solid ${s.color}66`
            : '1px solid rgba(65,105,225,0.12)',
          cursor: 'none',
          willChange: 'transform',
          position: 'relative',
          overflow: 'hidden',
          transform: `perspective(1000px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) scale(${hovered ? 1.04 : 1})`,
          transition: hovered
            ? 'transform 0.1s ease, box-shadow 0.3s ease, border-color 0.3s ease'
            : 'transform 0.5s ease, box-shadow 0.5s ease, border-color 0.5s ease',
          display: 'flex', flexDirection: 'column',
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

        {/* Icon area */}
        <div style={{ position: 'relative', width: 52, height: 52, marginBottom: 18 }}>
          <div style={{
            position: 'absolute', inset: 0, borderRadius: '50%',
            background: hovered ? s.color : s.light,
            transition: 'background 0.3s ease',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 1,
          }}>
            <div style={{
              animation: hovered
                ? s.iconAnim === 'bounce'    ? 'dt-bounce 0.7s ease infinite'
                : s.iconAnim === 'rotate'    ? 'dt-rotate 0.8s ease infinite'
                : s.iconAnim === 'heartbeat' ? 'dt-heartbeat 0.9s ease infinite'
                : 'dt-blink 0.8s ease infinite'
                : 'none',
            }}>
              <s.Icon size={24} color={hovered ? 'white' : s.color} />
            </div>
          </div>
          {/* Ripple rings */}
          {hovered && (
            <>
              <div style={{
                position: 'absolute', inset: 0, borderRadius: '50%',
                border: `2px solid ${s.color}`,
                animation: 'dt-ripple 1s ease-out infinite', zIndex: 0,
              }} />
              <div style={{
                position: 'absolute', inset: 0, borderRadius: '50%',
                border: `2px solid ${s.color}`,
                animation: 'dt-ripple 1s ease-out 0.4s infinite', zIndex: 0,
              }} />
            </>
          )}
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
          lineHeight: 1.7, margin: '0 0 16px', fontWeight: 500, flex: 1,
        }}>
          {s.desc}
        </p>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 20 }}>
          {s.tags.map(t => (
            <span key={t} style={{
              fontSize: '0.72rem', fontWeight: 600,
              background: hovered ? `${s.color}18` : s.light,
              color: s.color,
              borderRadius: 50, padding: '4px 12px',
              border: `1px solid ${s.color}33`,
              transition: 'background 0.3s ease',
            }}>
              {t}
            </span>
          ))}
        </div>

        {/* View Sample button */}
        <button
          onClick={() => window.open(`/sample/${s.type}`, '_blank')}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.background = s.color;
            (e.currentTarget as HTMLElement).style.color = 'white';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.background = s.light;
            (e.currentTarget as HTMLElement).style.color = s.color;
          }}
          style={{
            alignSelf: 'flex-start',
            border: `1.5px solid ${s.color}66`,
            color: s.color,
            background: s.light,
            borderRadius: 50,
            padding: '7px 20px',
            fontSize: '0.8rem', fontWeight: 600,
            cursor: 'none',
            transition: 'background 0.25s ease, color 0.25s ease',
          }}
        >
          View Sample
        </button>
      </div>
    </motion.div>
  );
}

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
            Purpose-built for every medical specialty
          </h2>
          <p style={{
            color: 'var(--text-light)',
            fontSize: '1.05rem', lineHeight: 1.7,
            maxWidth: 560, margin: '0 auto', fontWeight: 500,
          }}>
            From OPD to surgery, every note type structured exactly how it should be.
          </p>
        </motion.div>

        {/* Tilt cards 2x2 */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 24,
          marginBottom: 72,
        }}>
          {SPECIALTIES.map((s, i) => (
            <SpecialtyCard key={i} s={s} i={i} />
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
