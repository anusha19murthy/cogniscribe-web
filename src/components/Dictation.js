import React, { useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';

const BACKEND = 'https://aims-production-3ac3.up.railway.app';

function Dictation({ doctor, onLogout }) {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { patient } = state || {};
  const dateKey = state?.dateKey || (() => {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  })();

  const [noteType, setNoteType] = useState('opd');
  const [recording, setRecording] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [hasRecorded, setHasRecorded] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [error, setError] = useState('');
  const [showSidebar, setShowSidebar] = useState(false);
  const [patients, setPatients] = useState(() => {
    const saved = localStorage.getItem('cogniscribe_patients');
    return saved ? JSON.parse(saved) : {};
  });

  const mediaRecorder = useRef(null);
  const audioChunks = useRef([]);
  const audioBlob = useRef(null);

  const getDateKey = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  const todayPatients = patients[dateKey] || [];

  const startRecording = async () => {
    try {
      setError('');
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      audioChunks.current = [];
      mediaRecorder.current.ondataavailable = e => audioChunks.current.push(e.data);
      mediaRecorder.current.onstop = async () => {
        audioBlob.current = new Blob(audioChunks.current, { type: 'audio/wav' });
        await processAudio(audioBlob.current);
      };
      mediaRecorder.current.start();
      setRecording(true);
      setSaved(false);
    } catch (err) {
      setError('Microphone access denied. Please allow microphone access and try again.');
    }
  };

  const stopRecording = () => {
    mediaRecorder.current.stop();
    mediaRecorder.current.stream.getTracks().forEach(track => track.stop());
    setRecording(false);
    setProcessing(true);
    setHasRecorded(true);
  };

  const processAudio = async (blob) => {
    try {
      const formData = new FormData();
      formData.append('file', blob, 'recording.wav');

      let text = '';
      try {
        const transcribeRes = await axios.post(`${BACKEND}/transcribe`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        text = transcribeRes.data.transcript;
        setTranscript(text);
      } catch (transcribeErr) {
        setError(`Transcription failed: ${transcribeErr.response?.data?.detail || transcribeErr.message}`);
        setProcessing(false);
        return;
      }

      try {
        const extractRes = await axios.post(`${BACKEND}/extract/${noteType}`, {
          transcript: text,
          patient_id: patient?.id || null
        });
        navigate('/note', { state: { note: extractRes.data, noteType, patient, dateKey } });
      } catch (extractErr) {
        setError(`Extraction failed: ${extractErr.response?.data?.detail || extractErr.message}`);
      }

    } finally {
      setProcessing(false);
    }
  };

  const handleMicClick = () => {
    if (recording) stopRecording();
    else startRecording();
  };

  const handleNoteTypeChange = (type) => {
    if (recording || processing) return;
    setNoteType(type);
    setTranscript('');
    setHasRecorded(false);
    setError('');
    setSaved(false);
  };

  const exportAudio = () => {
    if (!audioBlob.current) return;
    const url = URL.createObjectURL(audioBlob.current);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${patient?.name}_${noteType}_audio.wav`;
    a.click();
  };

  if (!patient) return <div>No patient selected</div>;

  return (
    <div>
      <Navbar
        doctor={doctor}
        onLogout={onLogout}
        onHamburger={() => setShowSidebar(!showSidebar)}
      />

      <div style={{display:'flex'}}>

        {/* SIDEBAR */}
        {showSidebar && (
          <div style={{
            width:'280px', minWidth:'280px', background:'white',
            borderRight:'1px solid #e0e0e0', height:'calc(100vh - 57px)',
            overflowY:'auto', padding:'16px'
          }}>
            <div style={{fontWeight:'600', fontSize:'14px', color:'#888', marginBottom:'12px', textTransform:'uppercase', letterSpacing:'0.5px'}}>
              Today's Patients
            </div>
            {todayPatients.length === 0 ? (
              <div style={{color:'#aaa', fontSize:'14px'}}>No patients today.</div>
            ) : (
              todayPatients.map(p => (
                <div
                  key={p.id}
                  onClick={() => navigate(`/dictation/${p.id}`, {
                    state: { patient: p, dateKey }
                  })}
                  style={{
                    display:'flex', alignItems:'center', gap:'10px',
                    padding:'10px', borderRadius:'8px', cursor:'pointer',
                    background: p.id === patient.id ? '#f0f4ff' : 'white',
                    border: p.id === patient.id ? '1px solid #2563eb' : '1px solid transparent',
                    marginBottom:'6px'
                  }}
                  onMouseEnter={e => {
                    if (p.id !== patient.id) e.currentTarget.style.background = '#f8f9fa';
                  }}
                  onMouseLeave={e => {
                    if (p.id !== patient.id) e.currentTarget.style.background = 'white';
                  }}
                >
                  <div style={{
                    width:'32px', height:'32px', borderRadius:'50%',
                    background:'#2563eb', color:'white', display:'flex',
                    alignItems:'center', justifyContent:'center',
                    fontSize:'14px', fontWeight:'600', flexShrink:0
                  }}>
                    {p.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div style={{fontSize:'14px', fontWeight:'500', color:'#1a1a2e'}}>{p.name}</div>
                    <div style={{fontSize:'12px', color:'#888'}}>{p.reason}</div>
                  </div>
                </div>
              ))
            )}
            <div
              onClick={() => navigate('/dashboard', { state: { selectedDate: dateKey } })}
              style={{
                marginTop:'16px', padding:'10px', borderRadius:'8px',
                border:'1px solid #e0e0e0', cursor:'pointer', textAlign:'center',
                fontSize:'13px', color:'#666'
              }}
            >
              ← Back to Dashboard
            </div>
          </div>
        )}

        {/* MAIN DICTATION AREA */}
        <div className="main-content" style={{flex:1}}>
          <div className="dictation-container">
            <div className="patient-header">
              <h2>{patient.name}</h2>
              <p>{patient.age} years old, {patient.gender}</p>
              <p className="reason">{patient.reason}</p>
            </div>

            <button
              className={`mic-btn ${recording ? 'recording' : ''} ${processing ? 'processing' : ''}`}
              onClick={handleMicClick}
              disabled={processing}
            >
              {processing ? (
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                </svg>
              ) : recording ? (
                <svg width="36" height="36" viewBox="0 0 24 24" fill="white">
                  <rect x="6" y="6" width="12" height="12" rx="2"/>
                </svg>
              ) : (
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                  <line x1="12" y1="19" x2="12" y2="23"/>
                  <line x1="8" y1="23" x2="16" y2="23"/>
                </svg>
              )}
            </button>

            <div className="note-type-tabs">
              {[
                { key: 'opd', label: 'OPD' },
                { key: 'surgery', label: 'Surgery' },
                { key: 'progress', label: 'Progress' },
                { key: 'imaging', label: 'Imaging' }
              ].map(({ key, label }) => (
                <button
                  key={key}
                  className={`tab-btn ${noteType === key ? 'active' : ''}`}
                  onClick={() => handleNoteTypeChange(key)}
                >
                  {label}
                </button>
              ))}
            </div>

            {noteType === 'imaging' && (
              <div className="image-upload-section">
                <label>Attach Scan Image (optional)</label>
                <input
                  type="file"
                  accept="image/*"
                  className="image-upload-input"
                  onChange={e => setImageFile(e.target.files[0])}
                />
              </div>
            )}

            {error && <div className="error-banner">{error}</div>}

            {(transcript || processing) && !error && (
              <div className="transcript-box">
                {processing ? (
                  <div className="processing-text">AI is processing the audio...</div>
                ) : transcript}
              </div>
            )}

            {hasRecorded && !processing && (
              <div className="action-bar">
                <button className="next-patient-btn" onClick={() => {
  const currentIndex = todayPatients.findIndex(p => p.id === patient.id);
  const nextPatient = todayPatients[currentIndex + 1];
  if (nextPatient) {
    navigate(`/dictation/${nextPatient.id}`, {
      state: { patient: nextPatient, dateKey }
    });
  } else {
    navigate('/dashboard', { state: { selectedDate: dateKey } });
  }
}}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight:'6px'}}>
                    <polygon points="5 4 15 12 5 20 5 4"/>
                    <line x1="19" y1="5" x2="19" y2="19"/>
                  </svg>
                  Next Patient
                </button>
                <div className="action-btns">
                  <button className={`save-btn ${saved ? 'saved' : ''}`} onClick={() => setSaved(true)}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight:'6px'}}>
                      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                      <polyline points="17 21 17 13 7 13 7 21"/>
                      <polyline points="7 3 7 8 15 8"/>
                    </svg>
                    {saved ? 'Saved!' : 'Save'}
                  </button>
                  <div className="export-wrapper">
                    <button className="export-btn" onClick={() => setShowExport(!showExport)}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight:'6px'}}>
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                        <polyline points="7 10 12 15 17 10"/>
                        <line x1="12" y1="15" x2="12" y2="3"/>
                      </svg>
                      Export
                    </button>
                    {showExport && (
                      <div className="export-dropdown">
                        {noteType === 'opd' && (
                          <div className="export-option" onClick={exportAudio}>
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{marginRight:'8px'}}>
                              <path d="M9 18V5l12-2v13"/>
                              <circle cx="6" cy="18" r="3"/>
                              <circle cx="18" cy="16" r="3"/>
                            </svg>
                            Export Audio (.wav)
                          </div>
                        )}
                        <div className="export-option">
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{marginRight:'8px'}}>
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                            <polyline points="14 2 14 8 20 8"/>
                          </svg>
                          Export PDF
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dictation;