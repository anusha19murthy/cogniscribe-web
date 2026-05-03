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
        {/* Glow blob */}
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 600, height: 400,
          background: 'radial-gradient(ellipse, rgba(65,105,225,0.1) 0%, transparent 70%)',
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
              background: '#eff6ff',
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
              color: '#1a1a2e',
              lineHeight: 1.15,
              letterSpacing: '-0.025em',
              margin: '0 0 28px',
            }}>
              Built for Doctors. Completely.
            </h2>

            <div style={{ maxWidth: 560, margin: '0 auto 44px' }}>
              <p style={{
                color: '#475569',
                fontSize: '1.05rem',
                lineHeight: 1.8, fontWeight: 500,
                margin: '0 0 14px',
              }}>
                You carry the weight of people's lives on your shoulders every single day.
              </p>
              <p style={{
                color: '#475569',
                fontSize: '1.05rem',
                lineHeight: 1.8, fontWeight: 500,
                margin: '0 0 14px',
              }}>
                You carry responsibility, pressure, and expectations — without pause.
              </p>
              <p style={{
                color: '#475569',
                fontSize: '1.05rem',
                lineHeight: 1.8, fontWeight: 500,
                margin: 0,
              }}>
                CogniScribe is built with one purpose: to support you. Not replace you.
                Not complicate your work. But to stand quietly in the background and
                reduce the burden you've carried for far too long.
              </p>
            </div>

            <div style={{
              display: 'flex', gap: 14, justifyContent: 'center',
              flexWrap: 'wrap',
            }}>
              <button
                className="btn-capsule"
                style={{
                  background: '#4169E1',
                  color: 'white',
                  boxShadow: '0 8px 32px rgba(65,105,225,0.5)',
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 16px 48px rgba(65,105,225,0.6)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 8px 32px rgba(65,105,225,0.5)';
                }}
              >
                Book a Demo Today
                <IconArrowRight size={16} color="white" />
              </button>
            </div>

            <p style={{
              marginTop: 20,
              color: '#94a3b8',
              fontSize: '0.85rem', fontWeight: 500,
            }}>
              Contact us to get started
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        padding: '29px 5%',
        background: '#ffffff',
        borderTop: '1px solid rgba(65,105,225,0.1)',
        fontFamily: "'Montserrat', sans-serif",
      }}>
        <div style={{
          maxWidth: 1200, margin: '0 auto',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
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
            marginLeft: 'auto',
            fontSize: '0.8rem',
            color: '#64748b', fontWeight: 500,
          }}>
            © 2026 CogniScribe. All rights reserved.
          </div>
        </div>
      </footer>
    </>
  );
}
