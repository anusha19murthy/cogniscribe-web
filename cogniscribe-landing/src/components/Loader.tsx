import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IconActivity } from './Icons';

export default function Loader({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const iv = setInterval(() => {
      setProgress(prev => {
        const next = prev + Math.random() * 11 + 4;
        if (next >= 100) {
          clearInterval(iv);
          setDone(true);
          setTimeout(onComplete, 640);
          return 100;
        }
        return next;
      });
    }, 75);
    return () => clearInterval(iv);
  }, [onComplete]);

  const r = 36;
  const circ = 2 * Math.PI * r;

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="loader-overlay"
          exit={{ opacity: 0, scale: 1.04 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          style={{ gap: 28 }}
        >
          {/* Circular progress + cross */}
          <div style={{ position: 'relative', width: 88, height: 88 }}>
            <svg width="88" height="88" viewBox="0 0 88 88">
              {/* Track */}
              <circle cx="44" cy="44" r={r} fill="none" stroke="rgba(65, 105, 225,0.1)" strokeWidth="3" />
              {/* Progress arc */}
              <circle
                cx="44" cy="44" r={r} fill="none" stroke="url(#loaderGrad)"
                strokeWidth="3.5" strokeLinecap="round"
                strokeDasharray={circ}
                strokeDashoffset={circ * (1 - progress / 100)}
                transform="rotate(-90 44 44)"
                style={{ transition: 'stroke-dashoffset 0.1s linear' }}
              />
              <defs>
                <linearGradient id="loaderGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#4169E1" />
                  <stop offset="100%" stopColor="#8B5CF6" />
                </linearGradient>
              </defs>
            </svg>

            {/* Center pulsing cross */}
            <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center' }}>
              <motion.div
                animate={{ scale: [1, 1.07, 1] }}
                transition={{ repeat: Infinity, duration: 1.3, ease: 'easeInOut' }}
              >
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                  <rect x="11" y="3" width="6" height="22" rx="2.5" fill="#4169E1" />
                  <rect x="3" y="11" width="22" height="6" rx="2.5" fill="#4169E1" />
                </svg>
              </motion.div>
            </div>

            {/* Orbital dot */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1.6, ease: 'linear' }}
              style={{
                position:'absolute', inset:0,
                display:'flex', alignItems:'flex-start', justifyContent:'center',
              }}
            >
              <div style={{ width:9, height:9, borderRadius:'50%', background:'#F97316', marginTop:4 }} />
            </motion.div>
          </div>

          {/* Brand */}
          <motion.div
            animate={{ opacity: [0.65, 1, 0.65] }}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            style={{ textAlign:'center' }}
          >
            <div style={{ fontFamily:'Inter,sans-serif', fontSize:22, fontWeight:800, color:'#1a1a2e', letterSpacing:'-0.02em' }}>
              Cogni<span style={{ color:'#4169E1' }}>Scribe</span>
            </div>
            <div style={{ fontSize:13, color:'#64748b', marginTop:5, display:'flex', alignItems:'center', justifyContent:'center', gap:5 }}>
              <IconActivity size={13} color="#64748b" />
              AI Medical Scribe
            </div>
          </motion.div>

          {/* Progress % */}
          <div style={{ fontSize:13, color:'#4169E1', fontWeight:700, fontVariantNumeric:'tabular-nums' }}>
            {Math.round(progress)}%
          </div>

          {/* Loading bar */}
          <div style={{ width:180, height:3, borderRadius:2, background:'rgba(65, 105, 225,0.1)', overflow:'hidden' }}>
            <motion.div
              style={{
                height:'100%', borderRadius:2,
                background:'linear-gradient(90deg,#4169E1,#8B5CF6)',
                width: `${progress}%`, transition:'width 0.1s linear',
              }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
