'use client';
import React, { useState, useEffect } from 'react';
import WenoPharmacySearch from './WenoPharmacySearch';

/**
 * WritePrescription - Full prescription writing modal for provider view
 * 
 * Features:
 * - Patient selector (or use pre-selected patient)
 * - Drug fields: name, strength, quantity, days supply, refills, SIG, DAW checkbox
 * - ICD-10 diagnosis codes
 * - Pharmacy search via WenoPharmacySearch
 * - Sends prescription via /api/weno
 * - Embedded iframe for WENO signing
 */
export default function WritePrescription({ 
  selectedPatient = null, 
  patients = [], 
  onClose, 
  onSuccess,
  onError 
}) {
  // Patient selection
  const [patient, setPatient] = useState(selectedPatient);
  const [patientSearch, setPatientSearch] = useState('');
  const [showPatientDropdown, setShowPatientDropdown] = useState(false);
  
  // Drug fields
  const [drugName, setDrugName] = useState('');
  const [strength, setStrength] = useState('');
  const [quantity, setQuantity] = useState('');
  const [daysSupply, setDaysSupply] = useState('');
  const [refills, setRefills] = useState('0');
  const [sig, setSig] = useState('');
  const [daw, setDaw] = useState(false);
  
  // ICD-10
  const [icd10Code, setIcd10Code] = useState('');
  const [icd10Description, setIcd10Description] = useState('');
  
  // Pharmacy
  const [pharmacy, setPharmacy] = useState(null);
  const [pharmacyError, setPharmacyError] = useState('');
  
  // WENO signing
  const [showSigningIframe, setShowSigningIframe] = useState(false);
  const [signingUrl, setSigningUrl] = useState('');
  const [iframeLoaded, setIframeLoaded] = useState(false);
  
  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState(null);
  const [error, setError] = useState(null);
  
  // Filter patients based on search
  const filteredPatients = patients.filter(p => 
    p.name.toLowerCase().includes(patientSearch.toLowerCase())
  ).slice(0, 5);

  // Mock ICD-10 codes lookup
  const icd10Codes = [
    { code: 'E66.9', description: 'Obesity, unspecified' },
    { code: 'E66.01', description: 'Morbid (severe) obesity due to excess calories' },
    { code: 'E66.1', description: 'Drug-induced obesity' },
    { code: 'E66.2', description: 'Overweight' },
    { code: 'R73.03', description: 'Prediabetes' },
    { code: 'E11.9', description: 'Type 2 diabetes mellitus without complications' },
    { code: 'I10', description: 'Essential (primary) hypertension' },
    { code: 'E78.5', description: 'Hyperlipidemia, unspecified' },
  ];

  // Handle ICD-10 selection
  const handleIcd10Select = (code) => {
    const found = icd10Codes.find(c => c.code === code);
    if (found) {
      setIcd10Code(found.code);
      setIcd10Description(found.description);
    }
  };

  // Submit prescription to WENO
  const handleSubmit = async () => {
    // Validation
    if (!patient) {
      setError('Please select a patient');
      return;
    }
    if (!drugName) {
      setError('Please enter a drug name');
      return;
    }
    if (!strength) {
      setError('Please enter drug strength');
      return;
    }
    if (!quantity) {
      setError('Please enter quantity');
      return;
    }
    if (!sig) {
      setError('Please enter SIG (directions)');
      return;
    }
    if (!pharmacy) {
      setError('Please select a pharmacy');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const prescription = {
      id: `rx_${Date.now()}`,
      drugName,
      strength,
      quantity,
      daysSupply: daysSupply || '30',
      refills: refills || '0',
      directions: sig,
      daw: daw ? 'Y' : 'N',
      pharmacyId: pharmacy.id,
      pharmacyName: pharmacy.name,
      ncpdp: pharmacy.ncpdp,
      pharmacyPhone: pharmacy.phone,
      icd10Code,
      icd10Description,
    };

    const prescriber = {
      id: 'prov_001',
      npi: '1234567890',
      firstName: 'Jane',
      lastName: 'Williams',
      dea: 'AW1234567',
      stateLicense: 'CA12345',
      phone: '(415) 555-1000',
      fax: '(415) 555-1001',
    };

    try {
      // Send to WENO API
      const response = await fetch('/api/weno', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'send',
          prescription,
          patient: {
            id: patient.id,
            firstName: patient.name.split(' ')[0],
            lastName: patient.name.split(' ')[1] || '',
            dob: patient.dateOfBirth || '1980-01-01',
            gender: patient.gender || 'F',
            phone: patient.phone || '(415) 555-0000',
            address: patient.address || {
              addressLine1: patient.addressLine1 || '123 Patient St',
              city: 'San Francisco',
              state: 'CA',
              zip: '94102',
            },
          },
          prescriber,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to send prescription');
      }

      setSubmitResult({
        success: true,
        transmissionId: result.transmission_id,
        iframeUrl: result.iframe_url,
        message: 'Prescription sent successfully',
      });

      // If WENO returns an iframe URL for signing (via SOAP PostRx response), show it
      // Per PDF: the IFrameURL from the SOAP response is used for the prescriber to sign
      if (result.iframe_url) {
        setSigningUrl(result.iframe_url);
        setShowSigningIframe(true);
      }

      if (onSuccess) {
        onSuccess({ prescription, result });
      }
    } catch (err) {
      const errorMsg = err.message || 'Failed to send prescription';
      setError(errorMsg);
      if (onError) {
        onError(errorMsg);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Request signing URL from WENO - use iframe URL from prior send response
  const handleRequestSigning = async () => {
    // The iframe URL is returned from the SOAP PostRx response during send
    // Per PDF: IFrameURL from SOAP response is used for prescriber signing
    if (submitResult?.iframeUrl) {
      setSigningUrl(submitResult.iframeUrl);
      setShowSigningIframe(true);
      return;
    }

    // Fallback: try to get rxlog_url from API
    if (!submitResult?.transmissionId) return;

    setIframeLoaded(false);
    try {
      const response = await fetch('/api/weno', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'rxlog_url',
          prescription: { id: submitResult.transmissionId },
        }),
      });

      const result = await response.json();
      
      if (result.success && result.rxlog_url) {
        setSigningUrl(result.rxlog_url);
        setShowSigningIframe(true);
      }
    } catch (err) {
      setError('Failed to get signing URL');
    }
  };

  // Reset form
  const handleReset = () => {
    setPatient(selectedPatient);
    setDrugName('');
    setStrength('');
    setQuantity('');
    setDaysSupply('');
    setRefills('0');
    setSig('');
    setDaw(false);
    setIcd10Code('');
    setIcd10Description('');
    setPharmacy(null);
    setSubmitResult(null);
    setError(null);
    setShowSigningIframe(false);
    setSigningUrl('');
  };

  // Common SIG templates
  const sigTemplates = [
    'Take 1 tablet by mouth once daily',
    'Take 1 tablet by mouth twice daily',
    'Take 1 tablet by mouth three times daily',
    'Take 1 tablet by mouth at bedtime',
    'Inject subcutaneously once weekly',
    'Take with food',
  ];

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        {/* Header */}
        <div style={styles.header}>
          <h2 style={styles.title}>Write Prescription</h2>
          <button style={styles.closeBtn} onClick={onClose}>×</button>
        </div>

        {/* Content */}
        <div style={styles.content}>
          {/* Patient Selection */}
          <div style={styles.section}>
            <label style={styles.label}>Patient *</label>
            {selectedPatient ? (
              <div style={styles.selectedPatient}>
                <span style={styles.patientName}>{selectedPatient.name}</span>
                <button 
                  style={styles.changeBtn} 
                  onClick={() => setPatient(null)}
                >
                  Change
                </button>
              </div>
            ) : (
              <div style={styles.searchContainer}>
                <input
                  type="text"
                  placeholder="Search patients..."
                  style={styles.input}
                  value={patientSearch}
                  onChange={(e) => {
                    setPatientSearch(e.target.value);
                    setPatient(null);
                    setShowPatientDropdown(true);
                  }}
                  onFocus={() => setShowPatientDropdown(true)}
                />
                {showPatientDropdown && filteredPatients.length > 0 && (
                  <div style={styles.dropdown}>
                    {filteredPatients.map((p) => (
                      <div
                        key={p.id}
                        style={styles.dropdownItem}
                        onClick={() => {
                          setPatient(p);
                          setPatientSearch(p.name);
                          setShowPatientDropdown(false);
                        }}
                      >
                        <span style={styles.dropdownName}>{p.name}</span>
                        <span style={styles.dropdownMeta}>Week {p.week}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Drug Information */}
          <div style={styles.section}>
            <label style={styles.label}>Medication *</label>
            <input
              type="text"
              placeholder="Drug name (e.g., Semaglutide)"
              style={styles.input}
              value={drugName}
              onChange={(e) => setDrugName(e.target.value)}
            />
          </div>

          <div style={styles.row}>
            <div style={styles.field}>
              <label style={styles.label}>Strength *</label>
              <input
                type="text"
                placeholder="e.g., 0.5mg"
                style={styles.input}
                value={strength}
                onChange={(e) => setStrength(e.target.value)}
              />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Quantity *</label>
              <input
                type="text"
                placeholder="e.g., 4"
                style={styles.input}
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </div>
          </div>

          <div style={styles.row}>
            <div style={styles.field}>
              <label style={styles.label}>Days Supply</label>
              <input
                type="text"
                placeholder="e.g., 30"
                style={styles.input}
                value={daysSupply}
                onChange={(e) => setDaysSupply(e.target.value)}
              />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Refills</label>
              <select
                style={styles.input}
                value={refills}
                onChange={(e) => setRefills(e.target.value)}
              >
                <option value="0">0</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
              </select>
            </div>
          </div>

          {/* SIG */}
          <div style={styles.section}>
            <label style={styles.label}>SIG (Directions) *</label>
            <div style={styles.sigTemplates}>
              {sigTemplates.slice(0, 3).map((template, idx) => (
                <button
                  key={idx}
                  style={styles.sigTemplateBtn}
                  onClick={() => setSig(template)}
                >
                  {template}
                </button>
              ))}
            </div>
            <textarea
              placeholder="Enter directions (e.g., Take 1 tablet by mouth once daily)"
              style={{...styles.input, minHeight: '60px', resize: 'vertical'}}
              value={sig}
              onChange={(e) => setSig(e.target.value)}
            />
          </div>

          {/* DAW Checkbox */}
          <div style={styles.section}>
            <label style={styles.dawLabel}>
              <input
                type="checkbox"
                checked={daw}
                onChange={(e) => setDaw(e.target.checked)}
                style={styles.checkbox}
              />
              <span>Dispense as Written (DAW)</span>
            </label>
          </div>

          {/* ICD-10 */}
          <div style={styles.section}>
            <label style={styles.label}>ICD-10 Diagnosis</label>
            <div style={styles.icd10Container}>
              <input
                type="text"
                placeholder="Code (e.g., E66.9)"
                style={{...styles.input, width: '120px'}}
                value={icd10Code}
                onChange={(e) => setIcd10Code(e.target.value)}
                onBlur={() => handleIcd10Select(icd10Code)}
              />
              <input
                type="text"
                placeholder="Description"
                style={{...styles.input, flex: 1}}
                value={icd10Description}
                onChange={(e) => setIcd10Description(e.target.value)}
                readOnly
              />
            </div>
            <div style={styles.icd10Suggestions}>
              {icd10Codes
                .filter(c => 
                  c.code.toLowerCase().includes(icd10Code.toLowerCase()) ||
                  c.description.toLowerCase().includes(icd10Code.toLowerCase())
                )
                .slice(0, 3)
                .map((c) => (
                  <button
                    key={c.code}
                    style={styles.icd10Chip}
                    onClick={() => handleIcd10Select(c.code)}
                  >
                    {c.code} - {c.description}
                  </button>
                ))}
            </div>
          </div>

          {/* Pharmacy Search */}
          <div style={styles.section}>
            <WenoPharmacySearch
              value={pharmacy?.id || ''}
              onChange={(selectedPharmacy) => {
                setPharmacy(selectedPharmacy);
                setPharmacyError('');
              }}
              label="Pharmacy *"
              placeholder="Search for a pharmacy..."
              error={pharmacyError}
            />
          </div>

          {/* Error Message */}
          {error && (
            <div style={styles.error}>
              {error}
            </div>
          )}

          {/* Submit Result */}
          {submitResult?.success && (
            <div style={styles.success}>
              <span style={styles.successIcon}>✓</span>
              <span>{submitResult.message}</span>
              {submitResult.transmissionId && (
                <span style={styles.transmissionId}>
                  ID: {submitResult.transmissionId}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Signing IFrame */}
        {showSigningIframe && signingUrl && (
          <div style={styles.iframeContainer}>
            <div style={styles.iframeHeader}>
              <h3 style={styles.iframeTitle}>Sign Prescription</h3>
              <button 
                style={styles.closeIframeBtn}
                onClick={() => setShowSigningIframe(false)}
              >
                Close
              </button>
            </div>
            <iframe
              src={signingUrl}
              style={styles.iframe}
              onLoad={() => setIframeLoaded(true)}
              title="WENO Prescription Signing"
            />
            {!iframeLoaded && (
              <div style={styles.iframeLoading}>
                Loading WENO signing page...
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div style={styles.footer}>
          {submitResult?.success ? (
            <>
              <button style={styles.resetBtn} onClick={handleReset}>
                Write Another
              </button>
              {!showSigningIframe && submitResult.transmissionId && (
                <button style={styles.signBtn} onClick={handleRequestSigning}>
                  Sign with WENO
                </button>
              )}
            </>
          ) : (
            <>
              <button style={styles.cancelBtn} onClick={onClose}>
                Cancel
              </button>
              <button 
                style={styles.submitBtn} 
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Sending...' : 'Send Prescription'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// Styles
const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '20px',
  },
  modal: {
    backgroundColor: '#FAF9F7',
    borderRadius: '20px',
    width: '100%',
    maxWidth: '480px',
    maxHeight: '90vh',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    boxShadow: '0 25px 80px rgba(0,0,0,0.2)',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 24px',
    borderBottom: '1px solid #E8E8E8',
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontFamily: "'Fraunces', serif",
    fontSize: '20px',
    fontWeight: '500',
    color: '#2D2D2D',
    margin: 0,
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    fontSize: '28px',
    color: '#8B8B8B',
    cursor: 'pointer',
    padding: '0',
    lineHeight: 1,
  },
  content: {
    flex: 1,
    overflowY: 'auto',
    padding: '24px',
  },
  section: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    fontSize: '13px',
    fontWeight: '600',
    color: '#4A6741',
    marginBottom: '8px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  input: {
    width: '100%',
    padding: '12px 14px',
    fontSize: '15px',
    borderRadius: '12px',
    border: '1px solid #E0E0E0',
    backgroundColor: '#FFFFFF',
    color: '#2D2D2D',
    outline: 'none',
    transition: 'border-color 0.2s',
    fontFamily: "'DM Sans', sans-serif",
  },
  row: {
    display: 'flex',
    gap: '12px',
    marginBottom: '20px',
  },
  field: {
    flex: 1,
  },
  searchContainer: {
    position: 'relative',
  },
  dropdown: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: '12px',
    boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
    zIndex: 100,
    maxHeight: '200px',
    overflowY: 'auto',
    marginTop: '4px',
  },
  dropdownItem: {
    padding: '12px 14px',
    cursor: 'pointer',
    borderBottom: '1px solid #F0F0F0',
  },
  dropdownName: {
    display: 'block',
    fontSize: '14px',
    fontWeight: '500',
    color: '#2D2D2D',
  },
  dropdownMeta: {
    display: 'block',
    fontSize: '12px',
    color: '#8B8B8B',
    marginTop: '2px',
  },
  selectedPatient: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 14px',
    backgroundColor: '#E8EDE6',
    borderRadius: '12px',
  },
  patientName: {
    fontSize: '15px',
    fontWeight: '600',
    color: '#2D2D2D',
  },
  changeBtn: {
    background: 'none',
    border: 'none',
    fontSize: '13px',
    color: '#4A6741',
    cursor: 'pointer',
    textDecoration: 'underline',
  },
  sigTemplates: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    marginBottom: '8px',
  },
  sigTemplateBtn: {
    padding: '6px 12px',
    fontSize: '11px',
    backgroundColor: '#F5F5F5',
    border: '1px solid #E0E0E0',
    borderRadius: '8px',
    cursor: 'pointer',
    color: '#666',
  },
  dawLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontSize: '14px',
    color: '#2D2D2D',
    cursor: 'pointer',
  },
  checkbox: {
    width: '18px',
    height: '18px',
    accentColor: '#4A6741',
  },
  icd10Container: {
    display: 'flex',
    gap: '12px',
  },
  icd10Suggestions: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    marginTop: '8px',
  },
  icd10Chip: {
    padding: '6px 12px',
    fontSize: '11px',
    backgroundColor: '#FFF8E6',
    border: '1px solid #F0D9B0',
    borderRadius: '8px',
    cursor: 'pointer',
    color: '#8B6914',
  },
  selectedPharmacy: {
    marginTop: '12px',
    padding: '12px 14px',
    backgroundColor: '#E8EDE6',
    borderRadius: '12px',
  },
  pharmacyName: {
    display: 'block',
    fontSize: '14px',
    fontWeight: '600',
    color: '#2D2D2D',
  },
  pharmacyAddress: {
    display: 'block',
    fontSize: '12px',
    color: '#666',
    marginTop: '4px',
  },
  pharmacyPhone: {
    display: 'block',
    fontSize: '12px',
    color: '#8B8B8B',
    marginTop: '4px',
  },
  searching: {
    position: 'absolute',
    right: '14px',
    top: '12px',
    fontSize: '12px',
    color: '#8B8B8B',
  },
  error: {
    padding: '12px 14px',
    backgroundColor: '#FEE8E8',
    borderRadius: '12px',
    color: '#D32F2F',
    fontSize: '13px',
    marginBottom: '20px',
  },
  success: {
    padding: '12px 14px',
    backgroundColor: '#E8F5E9',
    borderRadius: '12px',
    color: '#2E7D32',
    fontSize: '13px',
    marginBottom: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  successIcon: {
    fontSize: '18px',
    fontWeight: 'bold',
  },
  transmissionId: {
    fontSize: '11px',
    color: '#666',
    fontFamily: 'monospace',
  },
  iframeContainer: {
    margin: '0 24px 16px',
    borderRadius: '12px',
    overflow: 'hidden',
    border: '1px solid #E0E0E0',
  },
  iframeHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 16px',
    backgroundColor: '#4A6741',
    color: '#FFFFFF',
  },
  iframeTitle: {
    fontSize: '14px',
    fontWeight: '600',
    margin: 0,
  },
  closeIframeBtn: {
    background: 'none',
    border: '1px solid rgba(255,255,255,0.5)',
    color: '#FFFFFF',
    padding: '6px 12px',
    borderRadius: '6px',
    fontSize: '12px',
    cursor: 'pointer',
  },
  iframe: {
    width: '100%',
    height: '300px',
    border: 'none',
    display: 'block',
  },
  iframeLoading: {
    padding: '20px',
    textAlign: 'center',
    fontSize: '13px',
    color: '#8B8B8B',
    backgroundColor: '#F5F5F5',
  },
  footer: {
    display: 'flex',
    gap: '12px',
    padding: '16px 24px',
    borderTop: '1px solid #E8E8E8',
    backgroundColor: '#FFFFFF',
  },
  cancelBtn: {
    flex: 1,
    padding: '14px',
    fontSize: '15px',
    fontWeight: '500',
    borderRadius: '12px',
    border: '1px solid #E0E0E0',
    backgroundColor: '#FFFFFF',
    color: '#666',
    cursor: 'pointer',
  },
  submitBtn: {
    flex: 2,
    padding: '14px',
    fontSize: '15px',
    fontWeight: '600',
    borderRadius: '12px',
    border: 'none',
    backgroundColor: '#4A6741',
    color: '#FFFFFF',
    cursor: 'pointer',
  },
  resetBtn: {
    flex: 1,
    padding: '14px',
    fontSize: '15px',
    fontWeight: '500',
    borderRadius: '12px',
    border: '1px solid #E0E0E0',
    backgroundColor: '#FFFFFF',
    color: '#666',
    cursor: 'pointer',
  },
  signBtn: {
    flex: 2,
    padding: '14px',
    fontSize: '15px',
    fontWeight: '600',
    borderRadius: '12px',
    border: 'none',
    backgroundColor: '#4A6741',
    color: '#FFFFFF',
    cursor: 'pointer',
  },
};
