import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

function PatientHistory({ doctor, onLogout }) {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { patient, dateKey } = state || {};
  const [expandedNote, setExpandedNote] = useState(null);

  const allNotes = JSON.parse(localStorage.getItem('cogniscribe_notes') || '{}');
  const patientNotes = (allNotes[patient?.id] || []).sort((a, b) =>
    new Date(b.savedAt) - new Date(a.savedAt)
  );

  const formatDate = (isoString) => {
    const d = new Date(isoString);
    return d.toLocaleDateString('en-IN', {
      day: 'numeric', month: 'long', year: 'numeric'
    });
  };

  const formatTime = (isoString) => {
    const d = new Date(isoString);
    return d.toLocaleTimeString('en-IN', {
      hour: '2-digit', minute: '2-digit'
    });
  };

  const getNoteTypeColor = (type) => {
    switch(type) {
      case 'opd': return { bg: '#eff6ff', color: '#2563eb', border: '#bfdbfe' };
      case 'surgery': return { bg: '#fef3c7', color: '#d97706', border: '#fde68a' };
      case 'progress': return { bg: '#f0fdf4', color: '#16a34a', border: '#bbf7d0' };
      case 'imaging': return { bg: '#fdf4ff', color: '#9333ea', border: '#e9d5ff' };
      default: return { bg: '#f0f4ff', color: '#2563eb', border: '#bfdbfe' };
    }
  };

  const getNoteTypeLabel = (type) => {
    switch(type) {
      case 'opd': return 'OPD';
      case 'surgery': return 'Surgery';
      case 'progress': return 'Progress';
      case 'imaging': return 'Imaging';
      default: return type?.toUpperCase();
    }
  };

  const renderNoteFields = (note) => {
    const type = note.noteType;
    const fields = [];

    if (type === 'opd') {
      if (note.chief_complaint) fields.push({ label: 'Chief Complaint', value: note.chief_complaint });
      if (note.duration) fields.push({ label: 'Duration', value: note.duration });
      if (note.history) fields.push({ label: 'History', value: note.history });
      const vitals = [
        note.vitals?.bp ? `BP: ${note.vitals.bp}` : null,
        note.vitals?.pulse ? `Pulse: ${note.vitals.pulse}` : null,
        note.vitals?.temperature ? `Temp: ${note.vitals.temperature}` : null,
        note.vitals?.spo2 ? `SpO2: ${note.vitals.spo2}` : null,
      ].filter(Boolean).join('  |  ');
      if (vitals) fields.push({ label: 'Vitals', value: vitals });
      if (note.examination_findings) fields.push({ label: 'Examination', value: note.examination_findings });
      if (note.ecg_findings) fields.push({ label: 'ECG', value: note.ecg_findings });
      if (note.investigation_results) fields.push({ label: 'Investigations', value: note.investigation_results });
      if (note.diagnosis) fields.push({ label: 'Diagnosis', value: note.diagnosis });
      if (note.medications?.length > 0) {
        fields.push({
          label: 'Medications',
          value: note.medications.map(m => `${m.name} ${m.dose || ''} ${m.frequency || ''}`).join(', ')
        });
      }
      if (note.advice) fields.push({ label: 'Advice', value: note.advice });
      if (note.follow_up) fields.push({ label: 'Follow Up', value: note.follow_up });
    } else if (type === 'surgery') {
      if (note.procedure_name) fields.push({ label: 'Procedure', value: note.procedure_name });
      if (note.surgeon_name) fields.push({ label: 'Surgeon', value: note.surgeon_name });
      if (note.assistant_surgeon) fields.push({ label: 'Assistant', value: note.assistant_surgeon });
      if (note.anaesthesia) fields.push({ label: 'Anaesthesia', value: note.anaesthesia });
      if (note.findings) fields.push({ label: 'Findings', value: note.findings });
      if (note.procedure_details) fields.push({ label: 'Procedure Details', value: note.procedure_details });
      if (note.blood_loss) fields.push({ label: 'Blood Loss', value: note.blood_loss });
      if (note.complications) fields.push({ label: 'Complications', value: note.complications });
      if (note.post_op_plan) fields.push({ label: 'Post-Op Plan', value: note.post_op_plan });
    } else if (type === 'progress') {
      if (note.day) fields.push({ label: 'Day', value: note.day });
      if (note.clinical_status) fields.push({ label: 'Clinical Status', value: note.clinical_status });
      if (note.vitals) fields.push({ label: 'Vitals', value: note.vitals });
      if (note.ventilator_settings) fields.push({ label: 'Ventilator Settings', value: note.ventilator_settings });
      if (note.investigation_results) fields.push({ label: 'Investigations', value: note.investigation_results });
      if (note.examination_findings) fields.push({ label: 'Examination', value: note.examination_findings });
      if (note.assessment) fields.push({ label: 'Assessment', value: note.assessment });
      if (note.plan) fields.push({ label: 'Plan', value: note.plan });
    } else if (type === 'imaging') {
      if (note.imaging_type) fields.push({ label: 'Imaging Type', value: note.imaging_type });
      if (note.clinical_indication) fields.push({ label: 'Indication', value: note.clinical_indication });
      if (note.findings) fields.push({ label: 'Findings', value: note.findings });
      if (note.impression) fields.push({ label: 'Impression', value: note.impression });
      if (note.recommendation) fields.push({ label: 'Recommendation', value: note.recommendation });
    }

    return fields;
  };

  if (!patient) return <div>No patient selected</div>;

  return (
    <div>
      <Navbar doctor={doctor} onLogout={onLogout} />

      <div className="main-content">
        <div className="note-container">

          {/* Patient Header */}
          <div style={{
            background: 'white', borderRadius: '12px',
            padding: '24px', marginBottom: '24px',
            border: '1px solid #e0e0e0',
            display: 'flex', alignItems: 'center', gap: '20px'
          }}>
            <div style={{
              width: '64px', height: '64px', borderRadius: '50%',
              background: '#2563eb', color: 'white',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '28px', fontWeight: '700', flexShrink: 0
            }}>
              {patient.name.charAt(0).toUpperCase()}
            </div>
            <div style={{flex: 1}}>
              <h2 style={{margin: 0, fontSize: '22px', fontWeight: '700', color: '#1a1a2e'}}>
                {patient.name}
              </h2>
              <p style={{margin: '4px 0 0', color: '#888', fontSize: '14px'}}>
                {patient.age} years old  •  {patient.gender}  •  {patient.reason}
              </p>
              <p style={{margin: '4px 0 0', color: '#2563eb', fontSize: '13px', fontWeight: '500'}}>
                {patientNotes.length} saved note{patientNotes.length !== 1 ? 's' : ''}
              </p>
            </div>
            <button
              onClick={() => navigate('/dashboard', { state: { selectedDate: dateKey } })}
              style={{
                background: 'none', border: '1px solid #e0e0e0',
                borderRadius: '8px', padding: '8px 16px',
                cursor: 'pointer', fontSize: '13px', color: '#666'
              }}
            >
              ← Back
            </button>
          </div>

          {/* Notes Timeline */}
          {patientNotes.length === 0 ? (
            <div style={{
              textAlign: 'center', padding: '60px 20px',
              background: 'white', borderRadius: '12px',
              border: '1px solid #e0e0e0'
            }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1.5" style={{marginBottom: '16px'}}>
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
              </svg>
              <p style={{color: '#aaa', fontSize: '15px', margin: 0}}>No saved notes for this patient yet.</p>
              <p style={{color: '#ccc', fontSize: '13px', margin: '8px 0 0'}}>Notes will appear here after you save them from the dictation page.</p>
            </div>
          ) : (
            <div style={{position: 'relative'}}>
              {/* Timeline line */}
              <div style={{
                position: 'absolute', left: '27px', top: '0', bottom: '0',
                width: '2px', background: '#e0e0e0', zIndex: 0
              }}/>

              {patientNotes.map((note, index) => {
                const colors = getNoteTypeColor(note.noteType);
                const isExpanded = expandedNote === index;
                const fields = renderNoteFields(note);

                return (
                  <div key={index} style={{
                    position: 'relative', paddingLeft: '64px',
                    marginBottom: '16px', zIndex: 1
                  }}>
                    {/* Timeline dot */}
                    <div style={{
                      position: 'absolute', left: '18px', top: '20px',
                      width: '20px', height: '20px', borderRadius: '50%',
                      background: colors.color, border: '3px solid white',
                      boxShadow: '0 0 0 2px ' + colors.color,
                      zIndex: 2
                    }}/>

                    {/* Note card */}
                    <div style={{
                      background: 'white', borderRadius: '12px',
                      border: '1px solid #e0e0e0',
                      overflow: 'hidden',
                      boxShadow: isExpanded ? '0 4px 20px rgba(0,0,0,0.08)' : 'none',
                      transition: 'box-shadow 0.2s'
                    }}>
                      {/* Card header */}
                      <div
                        onClick={() => setExpandedNote(isExpanded ? null : index)}
                        style={{
                          padding: '16px 20px',
                          display: 'flex', alignItems: 'center', gap: '12px',
                          cursor: 'pointer',
                          background: isExpanded ? '#fafbff' : 'white'
                        }}
                      >
                        <div style={{
                          padding: '4px 10px', borderRadius: '20px',
                          background: colors.bg, color: colors.color,
                          border: `1px solid ${colors.border}`,
                          fontSize: '12px', fontWeight: '600',
                          flexShrink: 0
                        }}>
                          {getNoteTypeLabel(note.noteType)}
                        </div>
                        <div style={{flex: 1}}>
                          <div style={{fontSize: '14px', fontWeight: '600', color: '#1a1a2e'}}>
                            {note.chief_complaint || note.procedure_name || note.imaging_type || note.clinical_status || 'Note'}
                          </div>
                          <div style={{fontSize: '12px', color: '#888', marginTop: '2px'}}>
                            {formatDate(note.savedAt)}  •  {formatTime(note.savedAt)}
                          </div>
                        </div>
                        {note.diagnosis && (
                          <div style={{
                            fontSize: '12px', color: '#666',
                            background: '#f8f9fa', padding: '4px 10px',
                            borderRadius: '6px', maxWidth: '180px',
                            whiteSpace: 'nowrap', overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }}>
                            {note.diagnosis}
                          </div>
                        )}
                        <svg
                          width="16" height="16" viewBox="0 0 24 24"
                          fill="none" stroke="#aaa" strokeWidth="2"
                          style={{
                            transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                            transition: 'transform 0.2s', flexShrink: 0
                          }}
                        >
                          <polyline points="6 9 12 15 18 9"/>
                        </svg>
                      </div>

                      {/* Expanded content */}
                      {isExpanded && (
                        <div style={{
                          padding: '0 20px 20px',
                          borderTop: '1px solid #f0f0f0'
                        }}>
                          <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                            gap: '12px', marginTop: '16px'
                          }}>
                            {fields.map((field, i) => (
                              <div key={i} style={{
                                background: '#f8f9fc', borderRadius: '8px',
                                padding: '10px 14px'
                              }}>
                                <div style={{
                                  fontSize: '10px', fontWeight: '700',
                                  color: '#aaa', textTransform: 'uppercase',
                                  letterSpacing: '0.5px', marginBottom: '4px'
                                }}>
                                  {field.label}
                                </div>
                                <div style={{
                                  fontSize: '13px', color: '#1a1a2e',
                                  lineHeight: '1.5'
                                }}>
                                  {field.value}
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Medications table if OPD */}
                          {note.noteType === 'opd' && note.medications?.length > 0 && (
                            <div style={{marginTop: '12px'}}>
                              <div style={{
                                fontSize: '10px', fontWeight: '700',
                                color: '#aaa', textTransform: 'uppercase',
                                letterSpacing: '0.5px', marginBottom: '8px'
                              }}>
                                Medications
                              </div>
                              <div style={{
                                background: '#f8f9fc', borderRadius: '8px',
                                overflow: 'hidden'
                              }}>
                                {note.medications.map((m, mi) => (
                                  <div key={mi} style={{
                                    display: 'flex', gap: '12px',
                                    padding: '8px 14px',
                                    borderBottom: mi < note.medications.length - 1 ? '1px solid #eee' : 'none',
                                    fontSize: '13px'
                                  }}>
                                    <span style={{fontWeight: '600', color: '#1a1a2e', minWidth: '120px'}}>{m.name}</span>
                                    <span style={{color: '#666'}}>{m.dose || '—'}</span>
                                    <span style={{color: '#888'}}>{m.frequency || '—'}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PatientHistory;