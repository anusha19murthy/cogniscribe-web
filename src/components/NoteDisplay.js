import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import Navbar from './Navbar';

function NoteDisplay({ doctor, onLogout }) {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { note, noteType, patient, dateKey, audioBlob: audioBlobData } = state || {};
  const [editField, setEditField] = useState(null);
  const [editedNote, setEditedNote] = useState(note || {});
  const [saved, setSaved] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [patients] = useState(() => {
    const s = localStorage.getItem('cogniscribe_patients');
    return s ? JSON.parse(s) : {};
  });

  const todayPatients = patients[dateKey] || [];

  const getConfidenceClass = (field) => {
    const c = editedNote.confidence?.[field];
    if (c === 'low') return 'low-confidence';
    if (c === 'medium') return 'medium-confidence';
    return '';
  };

  const updateField = (field, value) => {
    setEditedNote({ ...editedNote, [field]: value });
  };

  const saveNote = () => {
    const allNotes = JSON.parse(localStorage.getItem('cogniscribe_notes') || '{}');
    if (!allNotes[patient.id]) allNotes[patient.id] = [];
    allNotes[patient.id].push({
      ...editedNote,
      noteType,
      savedAt: new Date().toISOString(),
      dateKey
    });
    localStorage.setItem('cogniscribe_notes', JSON.stringify(allNotes));
    setSaved(true);
  };

  // Fix 3 — proper audio export
  const exportAudio = () => {
    if (!audioBlobData) {
      alert('Audio not available. Please re-record the dictation.');
      return;
    }
    try {
      const blob = audioBlobData instanceof Blob
        ? audioBlobData
        : new Blob([audioBlobData], { type: 'audio/wav' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${patient?.name}_${noteType}_${new Date().toLocaleDateString('en-IN').replace(/\//g, '-')}.wav`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      alert('Could not export audio. Please try again.');
    }
  };

  const exportPDF = () => {
    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();

    // Fix 2 — doctor name instead of CogniScribe in header
    pdf.setFillColor(37, 99, 235);
    pdf.rect(0, 0, pageWidth, 28, 'F');

    pdf.setFontSize(15);
    pdf.setTextColor(255, 255, 255);
    pdf.setFont('helvetica', 'bold');
    pdf.text(doctor.clinic || doctor.ward || '', 14, 12);
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'normal');
    pdf.text(doctor.name, 14, 20);

    pdf.setFontSize(9);
    pdf.text(new Date().toLocaleDateString('en-IN', {
      day: 'numeric', month: 'long', year: 'numeric'
    }), pageWidth - 14, 12, { align: 'right' });
    pdf.text(noteType?.toUpperCase() + ' NOTE', pageWidth - 14, 20, { align: 'right' });

    // Patient info bar
    pdf.setFillColor(240, 244, 255);
    pdf.rect(0, 28, pageWidth, 20, 'F');
    pdf.setFontSize(13);
    pdf.setTextColor(26, 26, 46);
    pdf.setFont('helvetica', 'bold');
    pdf.text(patient?.name || 'Patient', 14, 40);
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(100, 100, 120);
    pdf.text(`${patient?.age} years old  •  ${patient?.gender}  •  ${patient?.reason || ''}`, 14, 47);

    pdf.setDrawColor(220, 220, 230);
    pdf.line(14, 52, pageWidth - 14, 52);

    let y = 62;

    const checkPage = () => {
      if (y > 270) { pdf.addPage(); y = 20; }
    };

    const addSection = (title) => {
      checkPage();
      y += 2;
      pdf.setFillColor(240, 244, 255);
      pdf.rect(14, y - 5, pageWidth - 28, 10, 'F');
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(37, 99, 235);
      pdf.text(title.toUpperCase(), 16, y + 1);
      y += 10;
    };

    const addField = (label, value) => {
      if (!value) return;
      checkPage();
      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(120, 120, 140);
      pdf.text(label.toUpperCase(), 16, y);
      y += 5;
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(26, 26, 46);
      const lines = pdf.splitTextToSize(String(value), pageWidth - 32);
      lines.forEach(line => { checkPage(); pdf.text(line, 16, y); y += 6; });
      y += 3;
    };

    if (noteType === 'opd') {
      addSection('Presenting Complaint');
      addField('Chief Complaint', editedNote.chief_complaint);
      addField('Duration', editedNote.duration);
      addField('History', editedNote.history);
      addSection('Vitals');
      const vitals = [
        editedNote.vitals?.bp ? `BP: ${editedNote.vitals.bp}` : null,
        editedNote.vitals?.pulse ? `Pulse: ${editedNote.vitals.pulse}` : null,
        editedNote.vitals?.temperature ? `Temp: ${editedNote.vitals.temperature}` : null,
        editedNote.vitals?.spo2 ? `SpO2: ${editedNote.vitals.spo2}` : null
      ].filter(Boolean).join('   |   ');
      addField('Observations', vitals);
      addSection('Examination & Investigations');
      addField('Examination Findings', editedNote.examination_findings);
      addField('ECG Findings', editedNote.ecg_findings);
      addField('Investigation Results', editedNote.investigation_results);
      addSection('Assessment & Plan');
      addField('Diagnosis', editedNote.diagnosis);
      if (editedNote.medications?.length > 0) {
        checkPage();
        pdf.setFontSize(8);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(120, 120, 140);
        pdf.text('MEDICATIONS', 16, y);
        y += 5;
        editedNote.medications.forEach((m, i) => {
          checkPage();
          pdf.setFontSize(10);
          pdf.setFont('helvetica', 'normal');
          pdf.setTextColor(26, 26, 46);
          pdf.text(`${i + 1}.  ${m.name}  ${m.dose || ''}  ${m.frequency || ''}`, 16, y);
          y += 6;
        });
        y += 3;
      }
      addField('Advice', editedNote.advice);
      addField('Follow Up', editedNote.follow_up);
    } else if (noteType === 'surgery') {
      addSection('Operative Details');
      addField('Procedure', editedNote.procedure_name);
      addField('Surgeon', editedNote.surgeon_name);
      addField('Assistant Surgeon', editedNote.assistant_surgeon);
      addField('Anaesthesia', editedNote.anaesthesia);
      addSection('Intraoperative Findings');
      addField('Findings', editedNote.findings);
      addField('Procedure Details', editedNote.procedure_details);
      addField('Estimated Blood Loss', editedNote.blood_loss);
      addField('Complications', editedNote.complications);
      addSection('Post Operative Plan');
      addField('Post-Op Plan', editedNote.post_op_plan);
    } else if (noteType === 'progress') {
      addSection('Clinical Status');
      addField('Day', editedNote.day);
      addField('Clinical Status', editedNote.clinical_status);
      addSection('Vitals & Monitoring');
      addField('Vitals', editedNote.vitals);
      addField('Ventilator Settings', editedNote.ventilator_settings);
      addSection('Investigations');
      addField('Investigation Results', editedNote.investigation_results);
      addSection('Examination');
      addField('Examination Findings', editedNote.examination_findings);
      addSection('Assessment & Plan');
      addField('Assessment', editedNote.assessment);
      addField('Plan', editedNote.plan);
    } else if (noteType === 'imaging') {
      addSection('Study Details');
      addField('Imaging Type', editedNote.imaging_type);
      addField('Clinical Indication', editedNote.clinical_indication);
      addSection('Findings');
      addField('Findings', editedNote.findings);
      addSection('Conclusion');
      addField('Impression', editedNote.impression);
      addField('Recommendation', editedNote.recommendation);
    }

    // Footer
    const pageCount = pdf.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      pdf.setPage(i);
      pdf.setFontSize(8);
      pdf.setTextColor(180, 180, 190);
      pdf.setFont('helvetica', 'normal');
      pdf.setDrawColor(220, 220, 230);
      pdf.line(14, 285, pageWidth - 14, 285);
      pdf.text('Generated by CogniScribe AI Medical Scribe  •  cogniscribe.in', 14, 290);
      pdf.text(`Page ${i} of ${pageCount}`, pageWidth - 14, 290, { align: 'right' });
    }

    pdf.save(`${patient?.name}_${noteType}_${new Date().toLocaleDateString('en-IN').replace(/\//g, '-')}.pdf`);
  };

  const renderField = (label, field, multiline = false) => {
    const value = editedNote[field];
    if (!value && editField !== field) return null;
    return (
      <div className="note-field" key={field}>
        <label>{label}</label>
        {editField === field ? (
          multiline ? (
            <textarea
              rows={3}
              defaultValue={value || ''}
              onBlur={e => { updateField(field, e.target.value); setEditField(null); }}
              autoFocus
            />
          ) : (
            <input
              defaultValue={value || ''}
              onBlur={e => { updateField(field, e.target.value); setEditField(null); }}
              autoFocus
            />
          )
        ) : (
          <div
            className={`note-field-value ${getConfidenceClass(field)}`}
            onClick={() => setEditField(field)}
          >
            {value || <span style={{color:'#ccc'}}>Tap to add</span>}
          </div>
        )}
      </div>
    );
  };

  if (!note) return <div>No note data</div>;

  return (
    <div>
      <Navbar
        doctor={doctor}
        onLogout={onLogout}
        onHamburger={() => setShowSidebar(!showSidebar)}
      />

      <div style={{display:'flex'}}>

        {/* Fix 1 — sidebar that doesn't erase note */}
        {showSidebar && (
          <div style={{
            width:'280px', minWidth:'280px', background:'white',
            borderRight:'1px solid #e0e0e0', height:'calc(100vh - 57px)',
            overflowY:'auto', padding:'16px', flexShrink:0
          }}>
            <div style={{
              fontWeight:'600', fontSize:'14px', color:'#888',
              marginBottom:'12px', textTransform:'uppercase', letterSpacing:'0.5px',
              display:'flex', justifyContent:'space-between', alignItems:'center'
            }}>
              Today's Patients
              <span
                onClick={() => setShowSidebar(false)}
                style={{cursor:'pointer', fontSize:'18px', color:'#aaa', fontWeight:'400'}}
              >✕</span>
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
                    background: p.id === patient.id ? '#2563eb' : '#e8eef8',
                    color: p.id === patient.id ? 'white' : '#2563eb',
                    display:'flex', alignItems:'center', justifyContent:'center',
                    fontSize:'14px', fontWeight:'600', flexShrink:0
                  }}>
                    {p.name.charAt(0).toUpperCase()}
                  </div>
                  <div style={{flex:1, minWidth:0}}>
                    <div style={{
                      fontSize:'14px', fontWeight:'500', color:'#1a1a2e',
                      whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis'
                    }}>{p.name}</div>
                    <div style={{fontSize:'12px', color:'#888'}}>{p.reason}</div>
                  </div>
                  {p.id === patient.id && (
                    <div style={{
                      width:'6px', height:'6px', borderRadius:'50%',
                      background:'#2563eb', flexShrink:0
                    }}/>
                  )}
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
              onMouseEnter={e => e.currentTarget.style.background='#f8f9fa'}
              onMouseLeave={e => e.currentTarget.style.background='white'}
            >
              ← Back to Dashboard
            </div>
          </div>
        )}

        {/* Fix 1 — note always visible regardless of sidebar */}
        <div className="main-content" style={{flex:1, minWidth:0}}>
          <div className="note-container">
            <div className="note-header">
              <h2>{patient?.name}</h2>
              <p style={{color:'#888', fontSize:'14px'}}>
                {patient?.age} years old, {patient?.gender} — {noteType?.toUpperCase()} Note
              </p>
            </div>

            {editedNote.extraction_error && (
              <div className="error-banner">
                ⚠️ AI extraction failed. Please fill fields manually. ({editedNote.extraction_error})
              </div>
            )}

            {noteType === 'opd' && (
              <>
                <div className="note-section">
                  <h3>Patient</h3>
                  {renderField('Chief Complaint', 'chief_complaint')}
                  {renderField('Duration', 'duration')}
                  {renderField('History', 'history', true)}
                </div>
                <div className="note-section">
                  <h3>Vitals</h3>
                  <div className="note-field">
                    <label>BP / Pulse / Temp / SpO2</label>
                    <div className="note-field-value">
                      {[editedNote.vitals?.bp, editedNote.vitals?.pulse, editedNote.vitals?.temperature, editedNote.vitals?.spo2].filter(Boolean).join(' | ') || '—'}
                    </div>
                  </div>
                </div>
                <div className="note-section">
                  <h3>Examination & Investigations</h3>
                  {renderField('Examination Findings', 'examination_findings', true)}
                  {renderField('ECG Findings', 'ecg_findings')}
                  {renderField('Investigation Results', 'investigation_results', true)}
                </div>
                <div className="note-section">
                  <h3>Assessment & Plan</h3>
                  <div className={`note-field-value ${getConfidenceClass('diagnosis')}`} onClick={() => setEditField('diagnosis')}>
                    {editField === 'diagnosis' ? (
                      <input
                        defaultValue={editedNote.diagnosis}
                        onBlur={e => { updateField('diagnosis', e.target.value); setEditField(null); }}
                        autoFocus
                        style={{width:'100%', border:'none', outline:'none', fontSize:'15px'}}
                      />
                    ) : editedNote.diagnosis || '—'}
                  </div>
                  {editedNote.medications?.length > 0 && (
                    <div className="note-field" style={{marginTop:'12px'}}>
                      <label>Medications</label>
                      {editedNote.medications.map((m, i) => (
                        <div className="med-row" key={i}>
                          <span>{m.name}</span>
                          <span>{m.dose || '—'}</span>
                          <span>{m.frequency || '—'}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {renderField('Advice', 'advice', true)}
                  {renderField('Follow Up', 'follow_up')}
                </div>
              </>
            )}

            {noteType === 'surgery' && (
              <div className="note-section">
                <h3>Operative Note</h3>
                {renderField('Procedure', 'procedure_name')}
                {renderField('Surgeon', 'surgeon_name')}
                {renderField('Assistant Surgeon', 'assistant_surgeon')}
                {renderField('Anaesthesia', 'anaesthesia')}
                {renderField('Findings', 'findings', true)}
                {renderField('Procedure Details', 'procedure_details', true)}
                {renderField('Blood Loss', 'blood_loss')}
                {renderField('Complications', 'complications')}
                {renderField('Post-Op Plan', 'post_op_plan', true)}
              </div>
            )}

            {noteType === 'progress' && (
              <div className="note-section">
                <h3>Progress Note</h3>
                {renderField('Day', 'day')}
                {renderField('Clinical Status', 'clinical_status')}
                {renderField('Vitals', 'vitals')}
                {renderField('Ventilator Settings', 'ventilator_settings')}
                {renderField('Investigation Results', 'investigation_results', true)}
                {renderField('Examination Findings', 'examination_findings', true)}
                {renderField('Assessment', 'assessment', true)}
                {renderField('Plan', 'plan', true)}
              </div>
            )}

            {noteType === 'imaging' && (
              <div className="note-section">
                <h3>Imaging Report</h3>
                {renderField('Imaging Type', 'imaging_type')}
                {renderField('Clinical Indication', 'clinical_indication')}
                {renderField('Findings', 'findings', true)}
                {renderField('Impression', 'impression', true)}
                {renderField('Recommendation', 'recommendation', true)}
              </div>
            )}

            <div className="action-bar" style={{marginTop:'16px'}}>
              <button className="next-patient-btn" onClick={() => {
                const allPatients = JSON.parse(localStorage.getItem('cogniscribe_patients') || '{}');
                const datePatients = allPatients[dateKey] || [];
                const currentIndex = datePatients.findIndex(p => p.id === patient.id);
                const nextPatient = datePatients[currentIndex + 1];
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
                <button className={`save-btn ${saved ? 'saved' : ''}`} onClick={saveNote}>
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
                      <div className="export-option" onClick={exportPDF}>
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
          </div>
        </div>
      </div>
    </div>
  );
}

export default NoteDisplay;