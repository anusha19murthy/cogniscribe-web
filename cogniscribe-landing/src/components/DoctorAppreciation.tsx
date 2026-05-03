import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const PARAGRAPHS = [
  {
    text: `You chose one of the hardest professions in the world and carry the responsibility that we truly understand.`,
    highlights: [],
  },
  {
    text: `Every consultation demands focus, precision, and care and you carry the weight of every diagnosis. Yet, hours are lost to documentation.`,
    highlights: [],
  },
  {
    text: `CogniScribe exists for you and for one reason — to give that time back to you.`,
    highlights: ['CogniScribe exists for you', 'to give that time back to you'],
  },
  {
    text: `Every feature we have built has been made with one person in mind. You.`,
    highlights: ['has been made with one person in mind'],
  },
];

function highlight(text: string, phrases: string[]) {
  if (!phrases.length) return text;
  let rest = text;
  const parts: { text: string; hi: boolean }[] = [];
  while (rest.length > 0) {
    let earliest = rest.length, found = '';
    for (const p of phrases) {
      const pos = rest.toLowerCase().indexOf(p.toLowerCase());
      if (pos !== -1 && pos < earliest) { earliest = pos; found = p; }
    }
    if (found && earliest < rest.length) {
      if (earliest > 0) parts.push({ text: rest.slice(0, earliest), hi: false });
      const end = earliest + found.length;
      parts.push({ text: rest.slice(earliest, end), hi: true });
      rest = rest.slice(end);
    } else {
      parts.push({ text: rest, hi: false });
      rest = '';
    }
  }
  return parts.map((p, i) =>
    p.hi
      ? <span key={i} style={{ color: '#4169E1', fontWeight: 700 }}>{p.text}</span>
      : <span key={i}>{p.text}</span>
  );
}

function ECG() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const path =
    'M0,40 L100,40 Q110,32 120,40 L160,40 L164,44 L170,4 L176,56 L182,40 L220,40 ' +
    'Q235,22 250,40 L340,40 Q350,32 360,40 L400,40 L404,44 L410,4 L416,56 L422,40 ' +
    'L460,40 Q475,22 490,40 L580,40 Q590,32 600,40 L640,40 L644,44 L650,4 L656,56 L662,40 ' +
    'L700,40 Q715,22 730,40 L900,40 Q910,32 920,40 L960,40 L964,44 L970,4 L976,56 L982,40 ' +
    'L1020,40 Q1035,22 1050,40 L1200,40';
  return (
    <div ref={ref} style={{ maxWidth: 900, margin: '0 auto 48px', padding: '0 5%' }}>
      <svg width="100%" height="60" viewBox="0 0 1200 80" preserveAspectRatio="xMidYMid meet">
        <path d={path} fill="none" stroke="rgba(65,105,225,0.08)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d={path} fill="none" stroke="#4169E1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          style={{
            strokeDasharray: 2400,
            strokeDashoffset: inView ? 0 : 2400,
            transition: 'stroke-dashoffset 2.4s cubic-bezier(0.25, 1, 0.5, 1)',
          }}
        />
      </svg>
    </div>
  );
}

export default function DoctorAppreciation() {
  return (
    <section style={{
      padding: '100px 0',
      background: '#ffffff',
      fontFamily: "'Montserrat', sans-serif",
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 5%' }}>
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7 }}
          style={{ textAlign: 'center', marginBottom: 48 }}
        >
          <div style={{
            color: '#4169E1',
            fontSize: '0.75rem', fontWeight: 700,
            letterSpacing: '0.15em', textTransform: 'uppercase',
            marginBottom: 12,
          }}>
            For Every Doctor
          </div>
          <h2 style={{
            fontFamily: "'Montserrat', sans-serif",
            fontWeight: 700,
            fontSize: 'clamp(1.9rem, 3.5vw, 2.8rem)',
            color: 'var(--text)',
            lineHeight: 1.2,
            margin: 0,
          }}>
            To every doctor who chose healing
          </h2>
        </motion.div>

        {/* ECG */}
        <ECG />

        {/* 2x2 floating cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 24,
          maxWidth: 960, margin: '0 auto 56px',
        }}>
          {PARAGRAPHS.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.6, delay: i * 0.12 }}
              animate={{ y: [0, -8, 0] }}
              style={{
                background: '#ffffff',
                borderRadius: 16,
                padding: '32px 40px',
                boxShadow: '0 4px 24px rgba(65,105,225,0.08)',
                borderLeft: '3px solid #4169E1',
                border: '1px solid rgba(65,105,225,0.12)',
                borderLeftWidth: 3,
                borderLeftColor: '#4169E1',
              }}
            >
              <p style={{
                color: 'var(--text-light)',
                fontSize: '0.98rem',
                lineHeight: 1.85,
                margin: 0, fontWeight: 500,
              }}>
                {highlight(p.text, p.highlights)}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Pull quote */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ maxWidth: 680, margin: '0 auto 48px', textAlign: 'center' }}
        >
          <p style={{
            fontSize: 'clamp(1.1rem, 2vw, 1.4rem)',
            fontWeight: 700, fontStyle: 'italic',
            color: '#4169E1', lineHeight: 1.6, margin: 0,
          }}>
            "Built on how clinical work actually happens — not how software thinks it should."
          </p>
        </motion.div>

        {/* Quote */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{
            maxWidth: 680, margin: '0 auto',
            textAlign: 'center',
            padding: '40px 32px',
          }}
        >
          <p style={{
            color: '#718096', fontStyle: 'italic',
            fontSize: '1.1rem', lineHeight: 1.8, margin: '0 0 16px',
            fontWeight: 500,
          }}>
            "The best doctors listen first. CogniScribe makes sure the notes are already taken —
            so your patients always have your full attention."
          </p>
          <p style={{
            color: '#4169E1', fontWeight: 700,
            fontSize: '0.9rem', margin: 0,
          }}>
            — The CogniScribe Team
          </p>
        </motion.div>
      </div>
    </section>
  );
}
