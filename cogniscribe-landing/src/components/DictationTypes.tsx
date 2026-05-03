import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  IconClipboard, IconScalpel, IconActivity, IconEye,
  IconFileText, IconGlobe, IconCalendar,
} from './Icons';
import { tiltEffect } from '../animations/hoverEffects';

const SPECIALTIES = [
  {
    Icon: IconClipboard, title: 'OPD',
    desc: 'Chief complaint, vitals, diagnosis, medications — structured instantly.',
    tags: ['Vitals', 'Diagnosis', 'Rx'],
  },
  {
    Icon: IconScalpel, title: 'Surgery',
    desc: 'Operative findings, procedure details, blood loss, post-op plan.',
    tags: ['Procedure', 'Findings', 'Post-op'],
  },
  {
    Icon: IconActivity, title: 'Progress',
    desc: 'Day-wise clinical status, ventilator settings, investigation results.',
    tags: ['Status', 'Vitals', 'Labs'],
  },
  {
    Icon: IconEye, title: 'Imaging',
    desc: 'Findings, impression, recommendation — ready to sign.',
    tags: ['Findings', 'Impression'],
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

function TiltCard({ s, i }: { s: typeof SPECIALTIES[0]; i: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (ref.current) return tiltEffect(ref.current, 12);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.6, delay: i * 0.1 }}
    >
      <div
        ref={ref}
        style={{
          background: '#ffffff',
          borderRadius: 20,
          padding: 32,
          boxShadow: '0 2px 8px rgba(65,105,225,0.08)',
          border: '1px solid rgba(65,105,225,0.12)',
          cursor: 'none',
          willChange: 'transform',
        }}
      >
        <div style={{
          width: 52, height: 52, borderRadius: '50%',
          background: 'rgba(65,105,225,0.08)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: 18,
        }}>
          <s.Icon size={24} color="#4169E1" />
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
        }}>
          {s.desc}
        </p>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {s.tags.map(t => (
            <span key={t} style={{
              fontSize: '0.72rem', fontWeight: 600,
              background: 'rgba(65,105,225,0.06)', color: '#4169E1',
              borderRadius: 50, padding: '4px 12px',
              border: '1px solid rgba(65,105,225,0.15)',
            }}>
              {t}
            </span>
          ))}
        </div>
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
            <TiltCard key={i} s={s} i={i} />
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
                    <h3 style={{
                      fontWeight: 700, fontSize: '1.15rem',
                      color: 'var(--text)', margin: '0 0 10px',
                    }}>
                      {f.title}
                    </h3>
                    <p style={{
                      color: 'var(--text-light)', fontSize: '0.95rem',
                      lineHeight: 1.75, margin: 0, fontWeight: 500,
                    }}>
                      {f.body}
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <h3 style={{
                      fontWeight: 700, fontSize: '1.15rem',
                      color: 'var(--text)', margin: '0 0 10px',
                    }}>
                      {f.title}
                    </h3>
                    <p style={{
                      color: 'var(--text-light)', fontSize: '0.95rem',
                      lineHeight: 1.75, margin: 0, fontWeight: 500,
                    }}>
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
