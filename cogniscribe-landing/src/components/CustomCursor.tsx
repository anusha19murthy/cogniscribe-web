import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function CustomCursor() {
  const [hovering, setHovering] = useState(false);

  const cx = useMotionValue(-200);
  const cy = useMotionValue(-200);
  const rx = useMotionValue(-200);
  const ry = useMotionValue(-200);

  const sx  = useSpring(cx, { damping: 26, stiffness: 320 });
  const sy  = useSpring(cy, { damping: 26, stiffness: 320 });
  const srx = useSpring(rx, { damping: 20, stiffness: 180 });
  const sry = useSpring(ry, { damping: 20, stiffness: 180 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      cx.set(e.clientX); cy.set(e.clientY);
      rx.set(e.clientX); ry.set(e.clientY);
    };
    const onOver = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest('button, a, [data-hover]')) setHovering(true);
    };
    const onOut = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest('button, a, [data-hover]')) setHovering(false);
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseover', onOver);
    window.addEventListener('mouseout', onOut);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseover', onOver);
      window.removeEventListener('mouseout', onOut);
    };
  }, [cx, cy, rx, ry]);

  return (
    <>
      {/* Dot */}
      <motion.div className="cursor" style={{ left: sx, top: sy }}>
        <div
          className="cursor-dot"
          style={{ background: hovering ? '#F97316' : '#4169E1', transition: 'background 0.2s' }}
        />
      </motion.div>

      {/* Ring */}
      <motion.div className="cursor" style={{ left: srx, top: sry }}>
        <div
          className={`cursor-ring${hovering ? ' hover' : ''}`}
          style={{
            borderColor: hovering ? '#F97316' : '#4169E1',
            transition: 'border-color 0.2s, width 0.2s, height 0.2s',
          }}
        />
      </motion.div>
    </>
  );
}
