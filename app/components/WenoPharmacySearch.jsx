'use client';
import React, { useState, useEffect, useRef, useCallback } from 'react';

/**
 * WenoPharmacySearch - Searchable pharmacy dropdown component
 * 
 * Uses Weno pharmacy directory data to allow users to search and select
 * a pharmacy for e-prescribing. Integrates with WENO API for pharmacy lookup.
 * 
 * @param {Object} props
 * @param {string} props.value - Selected pharmacy ID
 * @param {Function} props.onChange - Callback when pharmacy selection changes (pharmacy object)
 * @param {string} props.placeholder - Placeholder text
 * @param {string} props.label - Label text
 * @param {string} props.error - Error message to display
 * @param {boolean} props.disabled - Whether the component is disabled
 */
export default function WenoPharmacySearch({
  value = '',
  onChange,
  placeholder = 'Search for a pharmacy...',
  label = 'Pharmacy',
  error = '',
  disabled = false
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [pharmacies, setPharmacies] = useState([]);
  const [filteredPharmacies, setFilteredPharmacies] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPharmacy, setSelectedPharmacy] = useState(null);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);
  const debounceRef = useRef(null);

  // Load pharmacies on mount
  useEffect(() => {
    loadPharmacies();
  }, []);

  // Filter pharmacies based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredPharmacies(pharmacies.slice(0, 50)); // Show first 50 when no search
    } else {
      const term = searchTerm.toLowerCase();
      const filtered = pharmacies.filter(pharmacy => {
        return (
          pharmacy.name?.toLowerCase().includes(term) ||
          pharmacy.address?.toLowerCase().includes(term) ||
          pharmacy.city?.toLowerCase().includes(term) ||
          pharmacy.state?.toLowerCase().includes(term) ||
          pharmacy.zip?.toLowerCase().includes(term) ||
          pharmacy.ncpdp?.toLowerCase().includes(term) ||
          pharmacy.phone?.includes(term)
        );
      }).slice(0, 100); // Limit to 100 results
      setFilteredPharmacies(filtered);
    }
    setHighlightedIndex(-1);
  }, [searchTerm, pharmacies]);

  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        inputRef.current &&
        !inputRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Load pharmacies from API
  const loadPharmacies = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/weno/pharmacies');
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.pharmacies) {
          setPharmacies(data.pharmacies);
          setFilteredPharmacies(data.pharmacies.slice(0, 50));
        }
      }
    } catch (error) {
      console.error('Failed to load pharmacies:', error);
      // Use sample data if API fails
      setPharmacies(getSamplePharmacies());
    } finally {
      setIsLoading(false);
    }
  };

  // Debounced search
  const handleSearchChange = useCallback((e) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    
    debounceRef.current = setTimeout(() => {
      // Search is handled by useEffect
    }, 150);
  }, []);

  // Handle pharmacy selection
  const handleSelect = useCallback((pharmacy) => {
    setSelectedPharmacy(pharmacy);
    setSearchTerm(pharmacy.name);
    setIsOpen(false);
    setHighlightedIndex(-1);
    
    if (onChange) {
      onChange(pharmacy);
    }
  }, [onChange]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
        setIsOpen(true);
        e.preventDefault();
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev < filteredPharmacies.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev > 0 ? prev - 1 : filteredPharmacies.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && filteredPharmacies[highlightedIndex]) {
          handleSelect(filteredPharmacies[highlightedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setHighlightedIndex(-1);
        break;
      case 'Tab':
        setIsOpen(false);
        break;
    }
  }, [isOpen, highlightedIndex, filteredPharmacies, handleSelect]);

  // Clear selection
  const handleClear = useCallback(() => {
    setSelectedPharmacy(null);
    setSearchTerm('');
    setIsOpen(false);
    setHighlightedIndex(-1);
    if (inputRef.current) {
      inputRef.current.focus();
    }
    if (onChange) {
      onChange(null);
    }
  }, [onChange]);

  // Focus input
  const handleContainerClick = useCallback(() => {
    if (!disabled) {
      inputRef.current?.focus();
      setIsOpen(true);
    }
  }, [disabled]);

  // Sample pharmacies for development/fallback
  const getSamplePharmacies = () => [
    { id: '1', name: 'CVS Pharmacy #1234', address: '123 Main St', city: 'San Francisco', state: 'CA', zip: '94102', phone: '(415) 555-0100', ncpdp: '1234567' },
    { id: '2', name: 'Walgreens #5678', address: '456 Market St', city: 'San Francisco', state: 'CA', zip: '94103', phone: '(415) 555-0200', ncpdp: '2345678' },
    { id: '3', name: 'Rite Aid #901', address: '789 Mission St', city: 'San Francisco', state: 'CA', zip: '94105', phone: '(415) 555-0300', ncpdp: '3456789' },
    { id: '4', name: 'Costco Pharmacy #421', address: '100 Airport Blvd', city: 'South San Francisco', state: 'CA', zip: '94108', phone: '(650) 555-0400', ncpdp: '4567890' },
    { id: '5', name: 'Safeway Pharmacy #1234', address: '200 Van Ness Ave', city: 'San Francisco', state: 'CA', zip: '94102', phone: '(415) 555-0500', ncpdp: '5678901' },
    { id: '6', name: 'CVS Pharmacy #5678', address: '300 Geary St', city: 'San Francisco', state: 'CA', zip: '94102', phone: '(415) 555-0600', ncpdp: '6789012' },
    { id: '7', name: 'Walgreens #2345', address: '400 Powell St', city: 'San Francisco', state: 'CA', zip: '94102', phone: '(415) 555-0700', ncpdp: '7890123' },
    { id: '8', name: 'Cigna Pharmacy', address: '500 Sutter St', city: 'San Francisco', state: 'CA', zip: '94102', phone: '(415) 555-0800', ncpdp: '8901234' },
    { id: '9', name: 'Golden Gate Pharmacy', address: '600 Fillmore St', city: 'San Francisco', state: 'CA', zip: '94117', phone: '(415) 555-0900', ncpdp: '9012345' },
    { id: '10', name: 'Mission Pharmacy', address: '700 Valencia St', city: 'San Francisco', state: 'CA', zip: '94110', phone: '(415) 555-1000', ncpdp: '0123456' },
  ];

  return (
    <div style={styles.container}>
      {label && (
        <label style={styles.label}>
          {label}
          {disabled && <span style={styles.required}> *</span>}
        </label>
      )}
      
      <div 
        style={{
          ...styles.inputWrapper,
          ...(error ? styles.inputError : {}),
          ...(disabled ? styles.inputDisabled : {}),
        }}
        onClick={handleContainerClick}
        ref={dropdownRef}
      >
        {/* Search Icon */}
        <div style={styles.searchIcon}>
          {isLoading ? (
            <div style={styles.spinner} />
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
          )}
        </div>

        {/* Input */}
        <input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          style={styles.input}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-autocomplete="list"
          autoComplete="off"
        />

        {/* Clear Button */}
        {selectedPharmacy && !disabled && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleClear();
            }}
            style={styles.clearButton}
            tabIndex={-1}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        )}

        {/* Dropdown Arrow */}
        <div style={styles.arrow}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </div>

        {/* Dropdown */}
        {isOpen && (
          <div style={styles.dropdown} role="listbox">
            {filteredPharmacies.length === 0 ? (
              <div style={styles.noResults}>
                {searchTerm ? 'No pharmacies found' : 'Loading pharmacies...'}
              </div>
            ) : (
              filteredPharmacies.map((pharmacy, index) => (
                <div
                  key={pharmacy.id || pharmacy.ncpdp || index}
                  style={{
                    ...styles.dropdownItem,
                    ...(index === highlightedIndex ? styles.dropdownItemHighlighted : {}),
                    ...(selectedPharmacy?.id === pharmacy.id ? styles.dropdownItemSelected : {}),
                  }}
                  onClick={() => handleSelect(pharmacy)}
                  onMouseEnter={() => setHighlightedIndex(index)}
                  role="option"
                  aria-selected={selectedPharmacy?.id === pharmacy.id}
                >
                  <div style={styles.pharmacyName}>{pharmacy.name}</div>
                  <div style={styles.pharmacyAddress}>
                    {pharmacy.address}
                    {pharmacy.city && `, ${pharmacy.city}`}
                    {pharmacy.state && `, ${pharmacy.state}`}
                    {pharmacy.zip && ` ${pharmacy.zip}`}
                  </div>
                  {pharmacy.phone && (
                    <div style={styles.pharmacyPhone}>{pharmacy.phone}</div>
                  )}
                  {pharmacy.ncpdp && (
                    <div style={styles.pharmacyNcpdp}>NCPDP: {pharmacy.ncpdp}</div>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div style={styles.errorText}>{error}</div>
      )}

      {/* Selected Pharmacy Details */}
      {selectedPharmacy && (
        <div style={styles.selectedDetails}>
          <div style={styles.selectedDetailRow}>
            <span style={styles.selectedDetailLabel}>Selected:</span>
            <span style={styles.selectedDetailValue}>{selectedPharmacy.name}</span>
          </div>
          {selectedPharmacy.ncpdp && (
            <div style={styles.selectedDetailRow}>
              <span style={styles.selectedDetailLabel}>NCPDP:</span>
              <span style={styles.selectedDetailValue}>{selectedPharmacy.ncpdp}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    width: '100%',
    position: 'relative',
  },
  label: {
    display: 'block',
    fontSize: '14px',
    fontWeight: '500',
    color: '#2D2D2D',
    marginBottom: '8px',
  },
  required: {
    color: '#D32F2F',
  },
  inputWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    border: '2px solid #E0E0E0',
    borderRadius: '12px',
    transition: 'all 0.2s ease',
    cursor: 'text',
  },
  inputError: {
    borderColor: '#D32F2F',
  },
  inputDisabled: {
    backgroundColor: '#F5F5F5',
    cursor: 'not-allowed',
    opacity: 0.7,
  },
  searchIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: '14px',
    color: '#8B8B8B',
  },
  spinner: {
    width: '16px',
    height: '16px',
    border: '2px solid #E0E0E0',
    borderTopColor: '#4A6741',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },
  input: {
    flex: 1,
    padding: '14px 12px',
    fontSize: '15px',
    fontFamily: "'DM Sans', sans-serif",
    border: 'none',
    background: 'transparent',
    outline: 'none',
    color: '#2D2D2D',
    cursor: 'inherit',
  },
  clearButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '8px',
    marginRight: '4px',
    border: 'none',
    background: 'transparent',
    color: '#8B8B8B',
    cursor: 'pointer',
    borderRadius: '50%',
    transition: 'all 0.2s',
  },
  arrow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingRight: '14px',
    color: '#8B8B8B',
    transition: 'transform 0.2s',
  },
  dropdown: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    marginTop: '4px',
    backgroundColor: '#FFFFFF',
    border: '1px solid #E0E0E0',
    borderRadius: '12px',
    boxShadow: '0 10px 40px rgba(0,0,0,0.12), 0 2px 10px rgba(0,0,0,0.08)',
    maxHeight: '320px',
    overflowY: 'auto',
    zIndex: 1000,
    animation: 'fadeIn 0.15s ease',
  },
  noResults: {
    padding: '20px',
    textAlign: 'center',
    color: '#8B8B8B',
    fontSize: '14px',
  },
  dropdownItem: {
    padding: '14px 16px',
    cursor: 'pointer',
    borderBottom: '1px solid #F0F0F0',
    transition: 'background 0.1s',
  },
  dropdownItemHighlighted: {
    backgroundColor: '#F5F4F2',
  },
  dropdownItemSelected: {
    backgroundColor: '#E8F5E9',
  },
  pharmacyName: {
    fontSize: '15px',
    fontWeight: '500',
    color: '#2D2D2D',
    marginBottom: '4px',
  },
  pharmacyAddress: {
    fontSize: '13px',
    color: '#666666',
    lineHeight: '1.4',
  },
  pharmacyPhone: {
    fontSize: '13px',
    color: '#4A6741',
    marginTop: '4px',
  },
  pharmacyNcpdp: {
    fontSize: '11px',
    color: '#8B8B8B',
    marginTop: '4px',
  },
  errorText: {
    marginTop: '6px',
    fontSize: '12px',
    color: '#D32F2F',
  },
  selectedDetails: {
    marginTop: '12px',
    padding: '12px 14px',
    backgroundColor: '#F5F4F2',
    borderRadius: '10px',
    fontSize: '13px',
  },
  selectedDetailRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  selectedDetailLabel: {
    color: '#8B8B8B',
    fontWeight: '500',
  },
  selectedDetailValue: {
    color: '#2D2D2D',
  },
};
