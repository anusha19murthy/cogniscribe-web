import { motion } from 'framer-motion';
import { IconX } from './Icons';

const PAINS = [
  'No more burden of writing notes after every consultation.',
  'No more digging through scattered, disorganized patient records.',
  'No more losing precious time after your last patient leaves.',
  'No more messy, unstructured dictations that make no sense.',
  'No more switching between systems to find one patient\'s history.',
  'No more compromise between patient time and documentation.',
];

export default function ClaimTime() {
  return (
    <section style={{
      padding: '100px 0',
      background: '#F8F9FB',
      fontFamily: "'Montserrat', sans-serif",
    }}>
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '0 5%' }}>
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: 48 }}
        >
          <div style={{
            color: '#4169E1',
            fontSize: '0.75rem', fontWeight: 700,
            letterSpacing: '0.15em', textTransform: 'uppercase',
            marginBottom: 12,
          }}>
            Reclaim Your Day
          </div>
          <h2 style={{
            fontWeight: 700,
            fontSize: 'clamp(1.9rem, 3.5vw, 2.8rem)',
            color: 'var(--text)',
            lineHeight: 1.2, margin: 0,
          }}>
            Claim Back Your Time with CogniScribe
          </h2>
        </motion.div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {PAINS.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -32 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: i * 0.07 }}
              whileHover={{ x: 6 }}
              style={{
                display: 'flex', alignItems: 'center', gap: 16,
                background: '#ffffff',
                border: '1px solid rgba(65,105,225,0.12)',
                borderRadius: 12,
                padding: '16px 20px',
                boxShadow: '0 2px 8px rgba(65,105,225,0.06)',
                cursor: 'none',
              }}
            >
              <span style={{
                width: 28, height: 28, borderRadius: '50%',
                background: 'rgba(239,68,68,0.08)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <IconX size={13} color="#ef4444" />
              </span>
              <span style={{
                fontSize: '0.93rem', color: 'var(--text)', fontWeight: 500,
                lineHeight: 1.5,
              }}>
                {p}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Closing lines */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{ textAlign: 'center', marginTop: 48 }}
        >
          <p style={{
            color: '#4169E1', fontWeight: 700,
            fontSize: '1.05rem', margin: '0 0 8px',
          }}>
            Easier. Quicker. Built for real clinical workflows.
          </p>
          <p style={{
            color: '#718096', fontStyle: 'italic',
            fontSize: '0.97rem', margin: 0, fontWeight: 500,
          }}>
            Designed to match the speed and precision of real clinical decisions.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
