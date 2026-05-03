import { motion } from 'framer-motion';

export default function PhilosophyDivider() {
  return (
    <section style={{
      width: '100%',
      background: '#ffffff',
      padding: '60px 5%',
      fontFamily: "'Montserrat', sans-serif",
    }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.7 }}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 32,
          maxWidth: 1000,
          margin: '0 auto',
        }}
      >
        {/* Left rule */}
        <div style={{
          flex: 1,
          height: 1,
          background: 'linear-gradient(to right, transparent, rgba(65,105,225,0.2))',
        }} />

        <p style={{
          fontSize: 'clamp(1.4rem, 2.5vw, 2rem)',
          fontWeight: 700,
          fontStyle: 'italic',
          color: '#2D3748',
          textAlign: 'center',
          margin: 0,
          flexShrink: 0,
          maxWidth: 600,
          lineHeight: 1.4,
        }}>
          Where clinical thinking meets structured execution.
        </p>

        {/* Right rule */}
        <div style={{
          flex: 1,
          height: 1,
          background: 'linear-gradient(to left, transparent, rgba(65,105,225,0.2))',
        }} />
      </motion.div>
    </section>
  );
}
