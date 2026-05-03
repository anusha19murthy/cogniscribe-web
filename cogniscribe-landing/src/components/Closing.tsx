import { motion } from 'framer-motion';
import { IconArrowRight } from './Icons';

export default function Closing() {
  return (
    <>
      <section style={{
        padding: '100px 0',
        background: '#f0f4ff',
        fontFamily: "'Montserrat', sans-serif",
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Subtle glow */}
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 600, height: 400,
          background: 'radial-gradient(ellipse, rgba(65,105,225,0.10) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{ maxWidth: 720, margin: '0 auto', padding: '0 5%', textAlign: 'center', position: 'relative' }}>
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.7 }}
          >
            <div style={{
              display: 'inline-block',
              background: 'rgba(65,105,225,0.10)',
              color: '#4169E1',
              borderRadius: 50,
              padding: '6px 18px',
              fontSize: '0.75rem', fontWeight: 700,
              letterSpacing: '0.12em', textTransform: 'uppercase',
              marginBottom: 28, border: '1px solid rgba(65,105,225,0.2)',
            }}>
              Get Started Today
            </div>

            <h2 style={{
              fontWeight: 800,
              fontSize: 'clamp(2.2rem, 4.5vw, 3.4rem)',
              color: '#1e293b',
              lineHeight: 1.15,
              letterSpacing: '-0.025em',
              margin: '0 0 20px',
            }}>
              Built for Doctors. Completely.
            </h2>

            <p style={{
              color: '#475569',
              fontSize: '1.05rem',
              lineHeight: 1.75, fontWeight: 500,
              maxWidth: 540, margin: '0 auto 16px',
            }}>
              Every feature, every workflow, every decision — built around the doctor's reality.
            </p>
            <p style={{
              color: '#475569',
              fontSize: '1.0rem',
              lineHeight: 1.75, fontWeight: 500,
              maxWidth: 540, margin: '0 auto 44px',
            }}>
              Join 2,000+ doctors using CogniScribe to focus on what matters most — their patients.
            </p>

            <div style={{
              display: 'flex', gap: 14, justifyContent: 'center',
              flexWrap: 'wrap',
            }}>
              <button
                className="btn-capsule"
                style={{
                  background: '#4169E1',
                  color: 'white',
                  boxShadow: '0 8px 32px rgba(65,105,225,0.35)',
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 16px 48px rgba(65,105,225,0.45)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 8px 32px rgba(65,105,225,0.35)';
                }}
              >
                Book a Demo Today
                <IconArrowRight size={16} color="white" />
              </button>
              <button
                className="btn-capsule"
                style={{
                  background: 'transparent',
                  color: '#4169E1',
                  border: '1.5px solid rgba(65,105,225,0.4)',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'rgba(65,105,225,0.08)';
                  e.currentTarget.style.borderColor = 'rgba(65,105,225,0.6)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.borderColor = 'rgba(65,105,225,0.4)';
                }}
              >
                Start Free Trial
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        padding: '32px 5%',
        background: '#f0f4ff',
        borderTop: '1px solid rgba(65,105,225,0.12)',
        fontFamily: "'Montserrat', sans-serif",
      }}>
        <div style={{
          maxWidth: 1200, margin: '0 auto',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: 20,
        }}>
          

          <div style={{ display: 'flex', gap: 28 }}>
            {['Features', 'Pricing', 'Privacy', 'Terms', 'Contact'].map(l => (
              <a key={l} href="#" style={{
                fontSize: '0.85rem', fontWeight: 500,
                color: '#64748b',
                textDecoration: 'none', cursor: 'none',
                transition: 'color 0.2s',
              }}
              onMouseEnter={e => (e.target as HTMLElement).style.color = '#4169E1'}
              onMouseLeave={e => (e.target as HTMLElement).style.color = '#64748b'}
              >
                {l}
              </a>
            ))}
          </div>

          <div style={{
            fontSize: '0.8rem',
            color: '#94a3b8', fontWeight: 500,
          }}>
            © 2025 CogniScribe. All rights reserved.
          </div>
        </div>
      </footer>
    </>
  );
}
