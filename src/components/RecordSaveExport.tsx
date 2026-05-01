import { motion } from 'framer-motion';
import { IconMic, IconSave, IconUpload, IconArrowRight } from './Icons';

const STEPS = [
  {
    n: '01', Icon: IconMic, title: 'Record',
    desc: 'Start your consultation naturally. CogniScribe captures audio, filters background noise, and begins structuring your notes in real-time.',
  },
  {
    n: '02', Icon: IconSave, title: 'Save',
    desc: 'Notes are auto-formatted into SOAP, H&P, or specialty-specific templates. Always documentation-standard compliant.',
  },
  {
    n: '03', Icon: IconUpload, title: 'Export',
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
              <motion.div
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.6, delay: i * 0.12 }}
                whileHover={{ y: -6, boxShadow: '0 20px 60px rgba(65,105,225,0.18)' }}
                style={{
                  background: '#ffffff',
                  borderRadius: 20,
                  padding: 36,
                  boxShadow: '0 2px 8px rgba(65,105,225,0.08)',
                  border: '1px solid rgba(65,105,225,0.12)',
                  height: '100%',
                  transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  cursor: 'none',
                }}
              >
                <div style={{
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  width: 56, height: 56, borderRadius: '50%',
                  background: 'rgba(65,105,225,0.08)',
                  marginBottom: 20,
                }}>
                  <s.Icon size={28} color="#4169E1" />
                </div>

                <div style={{
                  fontSize: '0.7rem', fontWeight: 700, color: '#4169E1',
                  letterSpacing: '0.1em', marginBottom: 10,
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
          ))}
        </div>
      </div>
    </section>
  );
}
