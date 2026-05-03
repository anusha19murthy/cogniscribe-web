import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const NAV_LINKS = ['Features', 'How It Works', 'About'];

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const { scrollYProgress } = useScroll();
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <motion.div style={{
        position: 'fixed', top: 0, left: 0, right: 0, height: 2,
        background: '#4169E1', transformOrigin: 'left', scaleX,
        zIndex: 99991,
      }} />

      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 9990,
          height: 64,
          background: scrolled ? 'rgba(255,255,255,0.96)' : 'rgba(255,255,255,0)',
          backdropFilter: scrolled ? 'blur(12px)' : 'none',
          boxShadow: scrolled ? '0 2px 20px rgba(65,105,225,0.10)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(65,105,225,0.10)' : '1px solid transparent',
          transition: 'background 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 5%',
          fontFamily: "'Montserrat', sans-serif",
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'none' }}>
          <img src="/logo.png" alt="CogniScribe" style={{ height: 150, width: 'auto', objectFit: 'contain' }} />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 36 }}>
          {NAV_LINKS.map(link => (
            <a
              key={link}
              href="#"
              style={{
                fontSize: '0.9rem', fontWeight: 500,
                color: '#718096', textDecoration: 'none',
                transition: 'color 0.2s', cursor: 'none',
              }}
              onMouseEnter={e => (e.target as HTMLElement).style.color = '#4169E1'}
              onMouseLeave={e => (e.target as HTMLElement).style.color = '#718096'}
            >
              {link}
            </a>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button
            style={{
              padding: '9px 22px', fontSize: '0.875rem', fontWeight: 600,
              fontFamily: "'Montserrat', sans-serif",
              color: '#4169E1', background: 'transparent',
              border: '1.5px solid #4169E1', borderRadius: 50, cursor: 'none',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(65,105,225,0.06)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
          >
            Sign In
          </button>
          <button
            style={{
              padding: '9px 22px', fontSize: '0.875rem', fontWeight: 700,
              fontFamily: "'Montserrat', sans-serif",
              color: '#ffffff', background: '#4169E1',
              border: 'none', borderRadius: 50, cursor: 'none',
              boxShadow: '0 4px 16px rgba(65,105,225,0.35)',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(65,105,225,0.45)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 16px rgba(65,105,225,0.35)';
            }}
          >
            Get Started Free
          </button>
        </div>
      </motion.nav>
    </>
  );
}
