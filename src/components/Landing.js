export default function Landing() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      background: '#0a0a0a',
      color: '#fff',
      fontFamily: 'sans-serif',
      textAlign: 'center',
      gap: '16px'
    }}>
      <h1 style={{ fontSize: '2.5rem', fontWeight: 700 }}>CogniScribe</h1>
      <p style={{ color: '#888', fontSize: '1.1rem' }}>
        AI-powered medical dictation platform
      </p>
      <a href="/login" style={{
        marginTop: '16px',
        padding: '12px 32px',
        background: '#2563EB',
        color: '#fff',
        borderRadius: '8px',
        textDecoration: 'none',
        fontWeight: 600
      }}>
        Get Started
      </a>
    </div>
  );
}