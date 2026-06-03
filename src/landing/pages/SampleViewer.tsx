import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';

const CONFIG = {
  opd:      { color: '#7c3aed', label: 'OPD Note',       pdf: '/opd-sample.pdf' },
  surgery:  { color: '#ea580c', label: 'Surgery Note',    pdf: '/surgery-sample.pdf' },
  progress: { color: '#16a34a', label: 'Progress Note',   pdf: '/progress-sample.pdf' },
  imaging:  { color: '#db2777', label: 'Imaging Report',  pdf: '/imaging-sample.pdf' },
} as const;

type NoteType = keyof typeof CONFIG;

export default function SampleViewer() {
  const { type } = useParams<{ type: string }>();
  const safeType: NoteType = (type as NoteType) in CONFIG ? (type as NoteType) : 'opd';
  const { color, label, pdf } = CONFIG[safeType];
  const [showPDF, setShowPDF] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShowPDF(true), 3000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowPDF(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const handleDownload = () => {
    const a = document.createElement('a');
    a.href = pdf;
    a.download = `CogniScribe-${safeType}-sample.pdf`;
    a.click();
  };

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      overflow: 'hidden',
      fontFamily: 'Montserrat, sans-serif',
      position: 'relative',
      background: '#f0f4ff',
    }}>

      {/* TOP BAR */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0,
        height: 56, background: 'white',
        borderBottom: '1px solid rgba(0,0,0,0.08)',
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px', zIndex: 1000,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: color }} />
          <span style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.95rem' }}>
            CogniScribe — {label}
          </span>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button onClick={handleDownload} style={{
            padding: '8px 20px', borderRadius: 50,
            background: color, color: 'white',
            border: 'none', fontFamily: 'Montserrat',
            fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer',
          }}>Download PDF</button>
          <button onClick={() => window.close()} style={{
            padding: '8px 20px', borderRadius: 50,
            background: 'transparent', color: '#64748b',
            border: '1px solid #e2e8f0', fontFamily: 'Montserrat',
            fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer',
          }}>Close</button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div style={{
        position: 'absolute',
        top: 56, left: 0, right: 0, bottom: 0,
        display: 'flex',
        flexDirection: 'column',
      }}>

        {/* WALL - top 55% */}
        <div style={{
          flex: '0 0 55%',
          background: '#f0f4ff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}>
          {/* PRINTER */}
          <div style={{
            width: 340, height: 170,
            background: 'linear-gradient(160deg, #f5f5f5, #e0e0e0)',
            borderRadius: 16,
            boxShadow: '0 20px 60px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.9)',
            border: '1px solid #c0c0c0',
            position: 'relative',
            display: 'flex', flexDirection: 'column',
          }}>
            {/* Top panel */}
            <div style={{
              height: 36, background: '#e8e8e8',
              borderRadius: '16px 16px 0 0',
              borderBottom: '1px solid #d0d0d0',
              display: 'flex', alignItems: 'center',
              justifyContent: 'space-between', padding: '0 16px',
            }}>
              <span style={{ fontSize: '0.65rem', color: '#4169E1', fontWeight: 700 }}>
                CogniScribe
              </span>
              <div style={{
                width: 8, height: 8, borderRadius: '50%',
                background: '#22c55e',
                boxShadow: '0 0 8px #22c55e',
              }} />
            </div>
            {/* Body */}
            <div style={{
              flex: 1, display: 'flex',
              alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{ fontSize: '0.6rem', color: '#999', letterSpacing: '0.15em' }}>
                PRO SERIES
              </span>
            </div>
            {/* Output slot */}
            <div style={{
              width: 220, height: 10, background: '#1a1a1a',
              borderRadius: '0 0 6px 6px', margin: '0 auto',
              boxShadow: '0 4px 16px rgba(255,180,50,0.4)',
            }} />

            {/* PAPER emerging from slot */}
            <div style={{
              position: 'absolute',
              top: '100%',
              left: '50%',
              transform: 'translateX(-50%)',
              width: 200,
              background: 'white',
              borderRadius: 3,
              boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
              overflow: 'hidden',
              cursor: 'pointer',
              zIndex: 10,
              animation: 'slideDown 1.5s ease forwards',
            }} onClick={() => setShowPDF(true)}>
              {/* Paper header */}
              <div style={{
                height: 32, background: color,
                display: 'flex', alignItems: 'center',
                justifyContent: 'space-between', padding: '0 10px',
              }}>
                <span style={{ color: 'white', fontSize: '0.6rem', fontWeight: 700 }}>
                  CogniScribe
                </span>
                <span style={{ color: 'white', fontSize: '0.55rem', opacity: 0.8 }}>
                  {label}
                </span>
              </div>
              {/* Skeleton lines */}
              <div style={{ padding: 8, display: 'flex', flexDirection: 'column', gap: 4 }}>
                {[80,60,70,50,65,55,75,45,60,50].map((w, i) => (
                  <div key={i} style={{
                    height: 5, width: `${w}%`,
                    background: i % 3 === 0 ? `${color}33` : '#e2e8f0',
                    borderRadius: 3,
                  }} />
                ))}
              </div>
              <div style={{
                textAlign: 'center', padding: '8px',
                fontSize: '0.5rem', color: '#94a3b8',
              }}>
                Click to view full document
              </div>
            </div>
          </div>
        </div>

        {/* DESK - bottom 45% */}
        <div style={{
          flex: '0 0 45%',
          background: 'linear-gradient(180deg, #3d2b1f 0%, #2c1f14 100%)',
          borderTop: '2px solid rgba(255,255,255,0.1)',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Wood grain lines */}
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: 'repeating-linear-gradient(90deg, transparent 0px, transparent 48px, rgba(255,255,255,0.02) 48px, rgba(255,255,255,0.02) 50px)',
          }} />

          {/* STETHOSCOPE - left */}
          <svg width="80" height="120" style={{
            position: 'absolute', left: 80, bottom: 20, opacity: 0.85,
          }} viewBox="0 0 80 120">
            <path d="M20,10 Q20,40 30,50 Q40,60 40,80 Q40,100 55,105"
              stroke="#555" strokeWidth="5" fill="none" strokeLinecap="round"/>
            <path d="M35,10 Q35,40 30,50"
              stroke="#555" strokeWidth="5" fill="none" strokeLinecap="round"/>
            <circle cx="55" cy="108" r="8" fill="#c0c0c0" stroke="#999" strokeWidth="1"/>
            <circle cx="17" cy="8" r="5" fill="#444"/>
            <circle cx="37" cy="8" r="5" fill="#444"/>
          </svg>

          {/* RX CLIPBOARD - left */}
          <div style={{ position: 'absolute', left: 200, bottom: 20, opacity: 0.9 }}>
            <div style={{ width: 60, height: 10, background: '#8B4513', borderRadius: '3px 3px 0 0' }} />
            <div style={{
              width: 60, height: 80, background: 'white',
              borderRadius: '0 0 3px 3px', padding: 6,
            }}>
              <div style={{ color: '#4169E1', fontSize: '0.7rem', fontWeight: 700 }}>Rx</div>
              {[70,50,60,40,55].map((w, i) => (
                <div key={i} style={{
                  height: 4, width: `${w}%`,
                  background: '#e2e8f0', borderRadius: 2, marginTop: 4,
                }} />
              ))}
            </div>
          </div>

          {/* MEDICINE BOTTLE - right */}
          <div style={{ position: 'absolute', right: 200, bottom: 20, opacity: 0.9 }}>
            <div style={{ width: 40, height: 14, background: '#ea580c', borderRadius: '4px 4px 0 0' }} />
            <div style={{
              width: 40, height: 64, background: 'white',
              border: '1px solid #e2e8f0', borderRadius: '0 0 4px 4px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{ fontSize: '0.6rem', color: '#4169E1', fontWeight: 700 }}>Rx</span>
            </div>
          </div>

          {/* THERMOMETER - right */}
          <div style={{
            position: 'absolute', right: 120, bottom: 30,
            width: 8, height: 90,
            background: 'white', borderRadius: 4,
            border: '1px solid #e2e8f0',
            transform: 'rotate(-20deg)', overflow: 'hidden', opacity: 0.9,
          }}>
            <div style={{
              position: 'absolute', bottom: 0, left: '50%',
              transform: 'translateX(-50%)',
              width: 6, height: 30, background: '#ef4444', borderRadius: 3,
            }} />
          </div>

          {/* PEN - right */}
          <div style={{
            position: 'absolute', right: 340, bottom: 45,
            width: 120, height: 7,
            background: 'linear-gradient(90deg, #ffd700 0%, #1a1a2e 20%, #1a1a2e 85%, white 100%)',
            borderRadius: '0 4px 4px 0',
            transform: 'rotate(15deg)', opacity: 0.9,
          }} />
        </div>
      </div>

      {/* PDF ZOOM OVERLAY */}
      {showPDF && (
        <div
          onClick={() => setShowPDF(false)}
          style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            zIndex: 9999,
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
              width: 'min(560px, 85vw)',
              height: 'min(780px, 80vh)',
              background: 'white',
              borderRadius: 6,
              overflow: 'hidden',
              boxShadow: '0 30px 80px rgba(0,0,0,0.5)',
              flexShrink: 0,
            }}
          >
            <object
              data={`${pdf}#toolbar=0&navpanes=0`}
              type="application/pdf"
              style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
            >
              <embed
                src={`${pdf}#toolbar=0&navpanes=0`}
                type="application/pdf"
                style={{ width: '100%', height: '100%' }}
              />
            </object>
          </div>

          <button
            onClick={e => { e.stopPropagation(); handleDownload(); }}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '12px 32px', borderRadius: 50,
              border: 'none', background: color,
              color: 'white', fontFamily: 'Montserrat',
              fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer',
              boxShadow: `0 4px 20px ${color}66`, flexShrink: 0,
            }}
          >↓ Download PDF</button>

          <p style={{
            color: 'rgba(255,255,255,0.5)',
            fontSize: '0.75rem', fontFamily: 'Montserrat',
            margin: 0, flexShrink: 0,
          }}>Press Esc or click outside to close</p>
        </div>
      )}

      <style>{`
        @keyframes slideDown {
          from { transform: translateX(-50%) translateY(-20px); opacity: 0; }
          to { transform: translateX(-50%) translateY(20px); opacity: 1; }
        }
        * { box-sizing: border-box; }
      `}</style>
    </div>
  );
}
