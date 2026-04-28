'use client';

import React, { useState, useEffect } from 'react';

/**
 * RxLog Component
 * Embeds Weno RxLog iframe in a modal/panel
 * Gets encrypted URL from /api/weno?action=rxlog_url
 */
export default function RxLog({ isOpen, onClose, prescriptionId }) {
  const [iframeUrl, setIframeUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && prescriptionId) {
      fetchRxLogUrl();
    }
    return () => {
      // Cleanup on unmount or when closing
      setIframeUrl(null);
      setError(null);
    };
  }, [isOpen, prescriptionId]);

  const fetchRxLogUrl = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/weno?action=rxlog_url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'rxlog_url',
          prescription: { id: prescriptionId },
        }),
      });

      const data = await response.json();

      if (data.success && data.rxlog_url) {
        setIframeUrl(data.rxlog_url);
      } else {
        setError(data.error || 'Failed to load RxLog');
      }
    } catch (err) {
      console.error('RxLog fetch error:', err);
      setError('Failed to connect to RxLog service');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div style={styles.header}>
          <h2 style={styles.title}>Prescription Log</h2>
          <button style={styles.closeButton} onClick={onClose}>
            ×
          </button>
        </div>

        {/* Content */}
        <div style={styles.body}>
          {loading && (
            <div style={styles.loadingContainer}>
              <div style={styles.spinner} />
              <p style={styles.loadingText}>Loading RxLog...</p>
            </div>
          )}

          {error && (
            <div style={styles.errorContainer}>
              <span style={styles.errorIcon}>⚠️</span>
              <p style={styles.errorText}>{error}</p>
              <button style={styles.retryButton} onClick={fetchRxLogUrl}>
                Retry
              </button>
            </div>
          )}

          {iframeUrl && !loading && !error && (
            <div style={styles.iframeContainer}>
              <iframe
                src={iframeUrl}
                style={styles.iframe}
                title="Weno RxLog"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '20px',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: '16px',
    width: '100%',
    maxWidth: '900px',
    maxHeight: '90vh',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 24px',
    borderBottom: '1px solid #eee',
  },
  title: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#333',
    margin: 0,
  },
  closeButton: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    border: 'none',
    backgroundColor: '#f5f5f5',
    fontSize: '20px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#666',
    transition: 'background-color 0.2s',
  },
  body: {
    flex: 1,
    padding: '0',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  },
  iframeContainer: {
    flex: 1,
    minHeight: '500px',
    padding: '0',
  },
  iframe: {
    width: '100%',
    height: '100%',
    minHeight: '500px',
    border: 'none',
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '60px 20px',
    gap: '16px',
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '3px solid #f3f3f3',
    borderTop: '3px solid #4A6741',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  loadingText: {
    fontSize: '14px',
    color: '#666',
    margin: 0,
  },
  errorContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '60px 20px',
    gap: '12px',
  },
  errorIcon: {
    fontSize: '48px',
  },
  errorText: {
    fontSize: '14px',
    color: '#666',
    margin: 0,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: '8px',
    padding: '10px 24px',
    backgroundColor: '#4A6741',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
  },
};
