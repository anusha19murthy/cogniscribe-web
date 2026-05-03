import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef, useCallback } from 'react';

const CONFIG = {
  opd:      { color: '#7c3aed', label: 'OPD Note',       pdf: '/opd-sample.pdf' },
  surgery:  { color: '#ea580c', label: 'Surgery Note',    pdf: '/surgery-sample.pdf' },
  progress: { color: '#16a34a', label: 'Progress Note',   pdf: '/progress-sample.pdf' },
  imaging:  { color: '#db2777', label: 'Imaging Report',  pdf: '/imaging-sample.pdf' },
} as const;

type NoteType = keyof typeof CONFIG;

export default function SampleViewer() {
  const { type } = useParams<{ type: string }>();
  const navigate = useNavigate();
  const safeType: NoteType = (type as NoteType) in CONFIG ? (type as NoteType) : 'opd';
  const { color, label, pdf } = CONFIG[safeType];

  const [phase, setPhase] = useState<'printer' | 'desk' | 'zoomed'>('printer');

  const dotRef  = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  // Custom cursor
  useEffect(() => {
    const dot  = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;
    let mx = window.innerWidth / 2, my = window.innerHeight / 2;
    let rx = mx, ry = my;
    const onMove = (e: MouseEvent) => { mx = e.clientX; my = e.clientY; };
    window.addEventListener('mousemove', onMove);
    let raf: number;
    const loop = () => {
      rx += (mx - rx) * 0.15;
      ry += (my - ry) * 0.15;
      dot.style.transform  = `translate(calc(${mx}px - 50%), calc(${my}px - 50%))`;
      ring.style.transform = `translate(calc(${rx}px - 50%), calc(${ry}px - 50%))`;
      raf = requestAnimationFrame(loop);
    };
    loop();
    return () => { window.removeEventListener('mousemove', onMove); cancelAnimationFrame(raf); };
  }, []);

  // Escape key
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape' && phase === 'zoomed') setPhase('desk'); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [phase]);

  // Auto-advance printer → desk
  useEffect(() => {
    const t = setTimeout(() => setPhase('desk'), 1800);
    return () => clearTimeout(t);
  }, []);

  const handleDownload = useCallback(() => {
    const a = document.createElement('a');
    a.href = pdf;
    a.download = `CogniScribe-${safeType}-sample.pdf`;
    a.click();
  }, [pdf, safeType]);

  return (
    <div style={{
      width: '100vw', height: '100vh',
      overflow: 'hidden', position: 'relative',
      fontFamily: "'Montserrat', sans-serif",
      cursor: 'none',
      background: '#f0f4ff',
    }}>
      <style>{`
        @keyframes pulse { from { opacity:0.4; box-shadow:0 0 4px #22c55e; } to { opacity:1; box-shadow:0 0 12px #22c55e; } }
        @keyframes paperSlide { from { transform:translateX(-50%) translateY(-120px); opacity:0; } to { transform:translateX(-50%) translateY(0); opacity:1; } }
        @keyframes shimmer { 0%{background-position:-300px 0} 100%{background-position:300px 0} }
        * { box-sizing:border-box; }
      `}</style>

      {/* Custom cursor */}
      <div ref={dotRef} style={{
        position: 'fixed', top: 0, left: 0, zIndex: 99999,
        width: 8, height: 8, borderRadius: '50%',
        background: '#1a1a2e', pointerEvents: 'none',
      }} />
      <div ref={ringRef} style={{
        position: 'fixed', top: 0, left: 0, zIndex: 99998,
        width: 30, height: 30, borderRadius: '50%',
        border: `2px solid ${color}`,
        pointerEvents: 'none',
      }} />

      {/* Back button */}
      <button
        onClick={() => {
          window.close();
          setTimeout(() => navigate('/'), 300);
        }}
        style={{
          position: 'fixed', top: 20, left: 20, zIndex: 1000,
          display: 'flex', alignItems: 'center', gap: 7,
          padding: '10px 20px', borderRadius: 8,
          border: '1px solid rgba(65,105,225,0.2)',
          background: 'white', color: '#4169E1',
          fontFamily: "'Montserrat', sans-serif", fontWeight: 600,
          fontSize: '0.875rem', cursor: 'none',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          transition: 'all 0.2s ease',
        }}
        onMouseEnter={e => { e.currentTarget.style.background = '#4169E1'; e.currentTarget.style.color = 'white'; }}
        onMouseLeave={e => { e.currentTarget.style.background = 'white';   e.currentTarget.style.color = '#4169E1'; }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <path d="M19 12H5M12 5l-7 7 7 7" />
        </svg>
        Back
      </button>

      {/* Category badge */}
      <div style={{
        position: 'fixed', top: 20, right: 20, zIndex: 1000,
        padding: '10px 24px', borderRadius: 50,
        background: color, color: 'white',
        fontFamily: "'Montserrat', sans-serif", fontWeight: 700,
        fontSize: '0.875rem',
        boxShadow: `0 4px 20px ${color}66`,
      }}>
        {label}
      </div>

      {/* ── WALL — top 55% ── */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '55%',
        background: 'linear-gradient(180deg, #eef2ff 0%, #f0f4ff 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {/* Printer */}
        <div style={{
          width: 340, height: 170,
          background: 'linear-gradient(160deg, #f5f5f5 0%, #e0e0e0 100%)',
          borderRadius: 16,
          boxShadow: '0 20px 60px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.9)',
          border: '1px solid #c0c0c0',
          position: 'relative',
          flexShrink: 0,
        }}>
          {/* Top panel */}
          <div style={{
            height: 36, background: '#e8e8e8',
            borderRadius: '16px 16px 0 0',
            borderBottom: '1px solid #d0d0d0',
            display: 'flex', alignItems: 'center',
            justifyContent: 'space-between', padding: '0 16px',
          }}>
            <span style={{ fontSize: '0.65rem', color: '#4169E1', fontWeight: 700, letterSpacing: '0.06em' }}>
              CogniScribe
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {[0,1].map(i => (
                <div key={i} style={{ width: 18, height: 18, borderRadius: 4, background: '#d0d0d0', border: '1px solid #bbb' }} />
              ))}
              <div style={{
                width: 8, height: 8, borderRadius: '50%',
                background: '#22c55e',
                animation: phase === 'printer' ? 'pulse 0.5s ease-in-out infinite alternate' : 'none',
                boxShadow: '0 0 6px #22c55e',
              }} />
            </div>
          </div>
          {/* Body */}
          <div style={{ padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {[1,2,3,4].map(i => <div key={i} style={{ width: 28, height: 2, background: '#ccc', borderRadius: 1 }} />)}
            </div>
            <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
              <span style={{ fontSize: '0.55rem', color: '#aaa', letterSpacing: '0.15em', fontWeight: 500 }}>PRO SERIES</span>
            </div>
          </div>
          {/* Output slot */}
          <div style={{
            position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)',
            width: 220, height: 10, background: '#1a1a1a',
            borderRadius: '0 0 4px 4px',
            boxShadow: phase !== 'printer' ? '0 4px 16px rgba(255,180,50,0.5)' : 'none',
            transition: 'box-shadow 0.4s ease',
          }} />

          {/* Paper on desk (shown after printer phase) */}
          {phase !== 'printer' && (
            <div
              onClick={() => setPhase('zoomed')}
              style={{
                position: 'absolute',
                bottom: -200,
                left: '50%',
                transform: 'translateX(-50%)',
                width: 190,
                height: 260,
                background: 'white',
                borderRadius: 3,
                boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
                overflow: 'hidden',
                cursor: 'pointer',
                animation: 'paperSlide 0.6s cubic-bezier(0.22,1,0.36,1) forwards',
                zIndex: 5,
              }}
            >
              {/* Paper header */}
              <div style={{
                height: 30, background: '#4169E1',
                display: 'flex', alignItems: 'center',
                justifyContent: 'space-between', padding: '0 10px',
              }}>
                <span style={{ color: 'white', fontSize: '0.58rem', fontWeight: 700, fontFamily: "'Montserrat',sans-serif" }}>CogniScribe</span>
                <span style={{
                  background: color, color: 'white',
                  fontSize: '0.5rem', fontWeight: 700, fontFamily: "'Montserrat',sans-serif",
                  padding: '2px 7px', borderRadius: 50,
                }}>
                  {label}
                </span>
              </div>
              {/* Skeleton content */}
              <div style={{ padding: '10px 10px 6px', display: 'flex', flexDirection: 'column', gap: 5 }}>
                {[75, 55, 65, 45, 70, 50, 60, 42, 68, 48].map((w, i) => (
                  <div key={i} style={{
                    height: i % 3 === 0 ? 5 : 3.5, width: `${w}%`,
                    borderRadius: 2,
                    background: i % 3 === 0
                      ? `${color}44`
                      : 'linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%)',
                    backgroundSize: '300px 100%',
                    animation: i % 3 !== 0 ? `shimmer 1.8s linear ${i * 0.1}s infinite` : 'none',
                  }} />
                ))}
              </div>
              {/* Click hint */}
              <div style={{
                position: 'absolute', bottom: 10, left: 0, right: 0,
                textAlign: 'center',
                fontSize: '0.48rem', color: '#94a3b8',
                fontFamily: "'Montserrat',sans-serif", fontWeight: 600,
                letterSpacing: '0.04em',
              }}>
                Click to view full document
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Wall–desk seam */}
      <div style={{
        position: 'absolute', top: '55%', left: 0, right: 0,
        height: 1, background: 'rgba(65,105,225,0.15)', zIndex: 3,
      }} />
      <div style={{
        position: 'absolute', top: '55%', left: 0, right: 0,
        height: 18, zIndex: 2,
        background: 'linear-gradient(180deg, rgba(0,0,0,0.10) 0%, transparent 100%)',
      }} />

      {/* ── DESK — bottom 45% ── */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '45%',
        background: '#2c1f14',
        backgroundImage: `
          repeating-linear-gradient(90deg,transparent 0px,transparent 48px,rgba(255,255,255,0.015) 48px,rgba(255,255,255,0.015) 50px),
          repeating-linear-gradient(90deg,transparent 0px,transparent 20px,rgba(0,0,0,0.04) 20px,rgba(0,0,0,0.04) 22px)
        `,
        overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'rgba(255,255,255,0.15)' }} />
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '40%', background: 'linear-gradient(180deg, rgba(255,255,255,0.06) 0%, transparent 100%)' }} />

        {/* Stethoscope */}
        <svg width="80" height="120" viewBox="0 0 80 120"
          style={{ position: 'absolute', left: 80, bottom: 20, opacity: 0.85, filter: 'drop-shadow(2px 4px 6px rgba(0,0,0,0.4))' }}>
          <circle cx="18" cy="12" r="6" fill="#2d2d2d" /><circle cx="18" cy="12" r="3" fill="#3d3d3d" />
          <circle cx="38" cy="12" r="6" fill="#2d2d2d" /><circle cx="38" cy="12" r="3" fill="#3d3d3d" />
          <path d="M18 18 Q18 40 28 46 Q38 52 38 68 Q38 86 28 92" stroke="#2d2d2d" strokeWidth="5" fill="none" strokeLinecap="round" />
          <path d="M38 18 Q38 40 38 46" stroke="#2d2d2d" strokeWidth="5" fill="none" strokeLinecap="round" />
          <circle cx="28" cy="96" r="12" fill="#c8c8c8" stroke="#888" strokeWidth="1.5" />
          <circle cx="28" cy="96" r="6" fill="#d8d8d8" />
        </svg>

        {/* Prescription pad */}
        <div style={{ position: 'absolute', left: 190, bottom: 18, filter: 'drop-shadow(2px 4px 8px rgba(0,0,0,0.35))' }}>
          {[4,2,0].map((o,i) => <div key={i} style={{ position:'absolute', bottom:-o, left:o, width:62, height:86, background: i===2?'white':'#f0f0f0', border:'1px solid #ddd', borderRadius:2 }} />)}
          <div style={{ position:'relative', zIndex:3, width:62, height:12, background:'#6b3a1f', borderRadius:'3px 3px 0 0' }} />
          <div style={{ position:'relative', zIndex:3, width:62, height:86, background:'white', border:'1px solid #ddd', borderRadius:'0 0 2px 2px', padding:'6px 7px' }}>
            <span style={{ fontSize:10, fontWeight:700, color:'#4169E1', fontFamily:"'Montserrat',sans-serif" }}>Rx</span>
            {[78,60,72,52,66].map((w,i) => <div key={i} style={{ height:2.5, width:`${w}%`, background:'#e5e7eb', borderRadius:1, marginTop:5 }} />)}
          </div>
        </div>

        {/* Medicine bottle */}
        <div style={{ position: 'absolute', right: 180, bottom: 18, display:'flex', flexDirection:'column', alignItems:'center', filter:'drop-shadow(2px 4px 8px rgba(0,0,0,0.4))' }}>
          <div style={{ width:42, height:13, background:'#e85d04', borderRadius:'4px 4px 0 0', border:'1px solid #c44d03' }} />
          <div style={{ width:34, height:62, background:'white', border:'1px solid #e0e0e0', borderRadius:'3px 3px 5px 5px', overflow:'hidden' }}>
            <div style={{ height:26, background:color, opacity:0.2, display:'flex', alignItems:'center', justifyContent:'center' }}>
              <span style={{ fontSize:7, fontWeight:700, color:color, fontFamily:"'Montserrat',sans-serif" }}>Rx</span>
            </div>
            <div style={{ padding:'4px 5px', display:'flex', flexDirection:'column', gap:3 }}>
              {[70,55,65].map((w,i) => <div key={i} style={{ width:`${w}%`, height:2, background:'#e5e7eb', borderRadius:1 }} />)}
            </div>
          </div>
        </div>

        {/* Thermometer */}
        <div style={{ position:'absolute', right:90, bottom:28, display:'flex', flexDirection:'column', alignItems:'center', transform:'rotate(-25deg)', transformOrigin:'bottom center', filter:'drop-shadow(1px 3px 5px rgba(0,0,0,0.4))' }}>
          <div style={{ width:9, height:76, borderRadius:'5px 5px 0 0', background:'white', border:'1px solid #ddd', position:'relative', overflow:'hidden' }}>
            <div style={{ position:'absolute', bottom:0, left:'50%', transform:'translateX(-50%)', width:4, height:'44%', background:'#ef4444', borderRadius:2 }} />
          </div>
          <div style={{ width:15, height:15, borderRadius:'50%', background:'#ef4444', border:'2px solid #dc2626', marginTop:-1 }} />
        </div>

        {/* Pen */}
        <div style={{ position:'absolute', right:300, bottom:44, width:138, height:8, background:'linear-gradient(90deg, #d4a017 0 13px, #1a1a2e 13px 118px, rgba(200,200,200,0.3) 118px 130px, #f5f5f5 130px)', borderRadius:'0 4px 4px 0', transform:'rotate(15deg)', filter:'drop-shadow(1px 3px 5px rgba(0,0,0,0.3))' }} />
      </div>

      {/* ── PDF OVERLAY ── */}
      {phase === 'zoomed' && (
        <div
          onClick={() => setPhase('desk')}
          style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            zIndex: 9000,
            background: 'rgba(0,0,0,0.65)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 16,
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              width: 'min(520px, 82vw)',
              height: 'min(740px, 78vh)',
              background: 'white',
              borderRadius: 6,
              overflow: 'hidden',
              boxShadow: '0 30px 80px rgba(0,0,0,0.5)',
              flexShrink: 0,
            }}
          >
            <iframe
              src={`${pdf}#toolbar=0&navpanes=0`}
              style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
              title={label}
            />
          </div>

          <button
            onClick={e => { e.stopPropagation(); handleDownload(); }}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '12px 32px', borderRadius: 50,
              border: 'none', background: color,
              color: 'white', fontFamily: "'Montserrat', sans-serif",
              fontWeight: 700, fontSize: '0.9rem',
              cursor: 'none', flexShrink: 0,
              boxShadow: `0 4px 20px ${color}66`,
              transition: 'transform 0.2s ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.05)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
            </svg>
            Download PDF
          </button>

          <p style={{
            color: 'rgba(255,255,255,0.45)',
            fontSize: '0.75rem',
            fontFamily: "'Montserrat', sans-serif",
            margin: 0, flexShrink: 0,
          }}>
            Press Esc or click outside to close
          </p>
        </div>
      )}
    </div>
  );
}
