import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import Navbar from './Navbar';

function NoteDisplay({ doctor, onLogout }) {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { note, noteType, patient, dateKey } = state || {};
  const [editField, setEditField] = useState(null);
  const [editedNote, setEditedNote] = useState(note || {});
  const [saved, setSaved] = useState(false);
  const [showExport, setShowExport] = useState(false);

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

  const exportPDF = () => {
    const pdf = new jsPDF();
    pdf.setFontSize(16);
    pdf.text('CogniScribe — Medical Note', 20, 20);
    pdf.setFontSize(12);
    pdf.text(`Patient: ${patient?.name} | ${patient?.age}yr ${patient?.gender}`, 20, 35);
    pdf.text(`Note Type: ${noteType?.toUpperCase()}`, 20, 45);
    pdf.text(`Date: ${new Date().toLocaleDateString()}`, 20, 55);
    pdf.line(20, 60, 190, 60);

    let y = 70;
    const addLine = (label, value) => {
      if (!value) return;
      if (y > 270) { pdf.addPage(); y = 20; }
      pdf.setFontSize(10);
      pdf.setTextColor(120, 120, 120);
      pdf.text(label.toUpperCase(), 20, y);
      y += 6;
      pdf.setFontSize(12);
      pdf.setTextColor(0, 0, 0);
      const lines = pdf.splitTextToSize(String(value), 170);
      pdf.text(lines, 20, y);
      y += lines.length * 7 + 6;
    };

    if (noteType === 'opd') {
      addLine('Chief Complaint', editedNote.chief_complaint);
      addLine('Duration', editedNote.duration);
      addLine('History', editedNote.history);
      addLine('Vitals', `BP: ${editedNote.vitals?.bp || '-'} | Pulse: ${editedNote.vitals?.pulse || '-'} | Temp: ${editedNote.vitals?.temperature || '-'} | SpO2: ${editedNote.vitals?.spo2 || '-'}`);
      addLine('Examination', editedNote.examination_findings);
      addLine('Investigation Results', editedNote.investigation_results);
      addLine('ECG Findings', editedNote.ecg_findings);
      addLine('Diagnosis', editedNote.diagnosis);
      if (editedNote.medications?.length > 0) {
        addLine('Medications', editedNote.medications.map(m => `${m.name} ${m.dose || ''} ${m.frequency || ''}`).join('\n'));
      }
      addLine('Advice', editedNote.advice);
      addLine('Follow Up', editedNote.follow_up);
    } else if (noteType === 'surgery') {
      addLine('Procedure', editedNote.procedure_name);
      addLine('Surgeon', editedNote.surgeon_name);
      addLine('Anaesthesia', editedNote.anaesthesia);
      addLine('Findings', editedNote.findings);
      addLine('Procedure Details', editedNote.procedure_details);
      addLine('Blood Loss', editedNote.blood_loss);
      addLine('Complications', editedNote.complications);
      addLine('Post-Op Plan', editedNote.post_op_plan);
    } else if (noteType === 'progress') {
      addLine('Day', editedNote.day);
      addLine('Clinical Status', editedNote.clinical_status);
      addLine('Vitals', editedNote.vitals);
      addLine('Ventilator Settings', editedNote.ventilator_settings);
      addLine('Investigation Results', editedNote.investigation_results);
      addLine('Examination', editedNote.examination_findings);
      addLine('Assessment', editedNote.assessment);
      addLine('Plan', editedNote.plan);
    } else if (noteType === 'imaging') {
      addLine('Imaging Type', editedNote.imaging_type);
      addLine('Clinical Indication', editedNote.clinical_indication);
      addLine('Findings', editedNote.findings);
      addLine('Impression', editedNote.impression);
      addLine('Recommendation', editedNote.recommendation);
    }

    pdf.save(`${patient?.name}_${noteType}_note.pdf`);
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
      <Navbar doctor={doctor} onLogout={onLogout} />

      <div className="main-content">
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
            <button className="next-patient-btn" onClick={() => navigate('/dashboard')}>
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
                      <div className="export-option" onClick={() => navigate(-1)}>
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
  );
}

export default NoteDisplay;