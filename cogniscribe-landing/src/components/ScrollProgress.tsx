import { useScroll, useSpring, motion } from 'framer-motion';

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { damping: 30, stiffness: 200 });

  return (
    <div className="scroll-progress">
      <motion.div className="scroll-progress-bar" style={{ scaleX, transformOrigin: 'left' }} />
    </div>
  );
}
