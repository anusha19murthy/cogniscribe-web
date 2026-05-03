import { motion } from 'framer-motion';

export default function PhilosophyDivider() {
  return (
    <section style={{
      background: '#ffffff',
      padding: '60px 5%',
      fontFamily: "'Montserrat', sans-serif",
    }}>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        style={{ display: 'flex', alignItems: 'center', gap: 32, maxWidth: 900, margin: '0 auto' }}
      >
        <hr style={{
          flex: 1, height: 1, border: 'none',
          background: 'linear-gradient(90deg, transparent, rgba(65,105,225,0.2))',
        }} />
        <p style={{
          fontSize: 'clamp(1.4rem, 2.5vw, 2rem)',
          fontWeight: 700,
          fontFamily: "'Montserrat', sans-serif",
          color: '#2D3748',
          fontStyle: 'italic',
          letterSpacing: '-0.01em',
          maxWidth: 700,
          margin: 0,
          textAlign: 'center',
          flexShrink: 0,
        }}>
          Where clinical thinking meets structured execution.
        </p>
        <hr style={{
          flex: 1, height: 1, border: 'none',
          background: 'linear-gradient(270deg, transparent, rgba(65,105,225,0.2))',
        }} />
      </motion.div>
    </section>
  );
}
