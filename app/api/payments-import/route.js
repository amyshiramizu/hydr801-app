import { NextResponse } from 'next/server';
import { query } from '../db';

// Parse CSV line handling quoted fields
function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

// Normalize phone number to E.164 format
function normalizePhone(phone) {
  if (!phone) return null;
  // Remove all non-digits
  const digits = phone.replace(/\D/g, '');
  // If it's 10 digits, assume US and add +1
  if (digits.length === 10) {
    return `+1${digits}`;
  }
  // If it's 11 digits starting with 1, format as +1...
  if (digits.length === 11 && digits[0] === '1') {
    return `+${digits}`;
  }
  // If it already starts with +, return as-is
  if (phone.startsWith('+')) {
    return phone;
  }
  // Otherwise return what we have with +
  return `+${digits}`;
}

// Parse date from CSV format (MM/DD/YYYY HH:MM:SS or similar)
function parseDate(dateStr) {
  if (!dateStr) return null;
  try {
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? null : date.toISOString();
  } catch {
    return null;
  }
}

// Parse currency string to decimal
function parseCurrency(currencyStr) {
  if (!currencyStr) return 0;
  // Remove $ and commas, parse as float
  return parseFloat(currencyStr.replace(/[$,]/g, '')) || 0;
}

export async function POST(request) {
  try {
    const body = await request.text();
    
    if (!body || body.trim().length === 0) {
      return NextResponse.json(
        { error: 'No CSV data provided' },
        { status: 400 }
      );
    }

    const lines = body.split('\n').filter(line => line.trim());
    
    if (lines.length < 2) {
      return NextResponse.json(
        { error: 'CSV must contain header row and at least one data row' },
        { status: 400 }
      );
    }

    // Parse header
    const headers = parseCSVLine(lines[0]).map(h => h.toLowerCase().trim());
    
    // Expected columns (as per Podium export format)
    const requiredColumns = ['transaction_date', 'contact_info', 'total'];
    const missingColumns = requiredColumns.filter(col => !headers.includes(col));
    
    if (missingColumns.length > 0) {
      return NextResponse.json(
        { error: `Missing required columns: ${missingColumns.join(', ')}` },
        { status: 400 }
      );
    }

    let imported = 0;
    let skipped = 0;
    let matchedPatients = 0;
    let unmatchedPatients = 0;
    const errors = [];

    // Process each row
    for (let i = 1; i < lines.length; i++) {
      try {
        const values = parseCSVLine(lines[i]);
        
        if (values.length !== headers.length) {
          errors.push(`Row ${i}: Column count mismatch`);
          skipped++;
          continue;
        }

        // Build row object
        const row = {};
        headers.forEach((header, idx) => {
          row[header] = values[idx];
        });

        // Extract and normalize data
        const transactionDate = parseDate(row.transaction_date);
        const contactPhone = normalizePhone(row.contact_info);
        const amount = parseCurrency(row.total);
        const netAmount = parseCurrency(row.net);
        const refundedAmount = parseCurrency(row.amount_refunded);
        const interchangeFees = parseCurrency(row.interchange_fees);
        const transactionFees = parseCurrency(row.transaction_fees);
        const totalFees = interchangeFees + transactionFees + parseCurrency(row.gift_card_load_fee || '0');

        if (!transactionDate || !contactPhone || amount === 0) {
          errors.push(`Row ${i}: Missing required data (date, phone, or amount)`);
          skipped++;
          continue;
        }

        // Check for duplicate
        const duplicateCheck = await query(
          `SELECT id FROM payments 
           WHERE transaction_date = $1 
           AND contact_phone = $2 
           AND amount = $3 
           LIMIT 1`,
          [transactionDate, contactPhone, amount]
        );

        if (duplicateCheck.rows.length > 0) {
          skipped++;
          continue;
        }

        // Try to match patient by phone
        const patientMatch = await query(
          `SELECT id, "firstName", "lastName", name FROM patients WHERE phone = $1 LIMIT 1`,
          [contactPhone]
        );

        let patientId = null;
        let patientName = row.contact_name || 'Unknown';

        if (patientMatch.rows.length > 0) {
          const patient = patientMatch.rows[0];
          patientId = patient.id;
          patientName = patient.name || `${patient.firstName || ''} ${patient.lastName || ''}`.trim() || patientName;
          matchedPatients++;
        } else {
          unmatchedPatients++;
        }

        // Determine status from channel_type or payment_type
        let status = 'Paid'; // Default
        if (row.channel_type && row.channel_type.toLowerCase().includes('refund')) {
          status = 'Refunded';
        } else if (refundedAmount > 0) {
          status = 'Refunded';
        } else if (row.channel_type && row.channel_type.toLowerCase().includes('cancel')) {
          status = 'Canceled';
        }

        // Insert payment record
        await query(
          `INSERT INTO payments (
            patient_id, 
            patient_name, 
            contact_phone, 
            amount, 
            status, 
            payment_type, 
            payment_channel,
            description,
            podium_invoice_uid,
            transaction_date,
            net_amount,
            fees,
            refunded_amount,
            source
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)`,
          [
            patientId,
            patientName,
            contactPhone,
            amount,
            status,
            row.payment_type || null,
            row.payment_channel || null,
            row.description || null,
            row.invoice_number || null,
            transactionDate,
            netAmount,
            totalFees,
            refundedAmount,
            'csv_import'
          ]
        );

        imported++;
      } catch (rowError) {
        console.error(`Error processing row ${i}:`, rowError);
        errors.push(`Row ${i}: ${rowError.message}`);
        skipped++;
      }
    }

    return NextResponse.json({
      success: true,
      summary: {
        total_rows: lines.length - 1,
        imported,
        skipped,
        matched_patients: matchedPatients,
        unmatched_patients: unmatchedPatients,
        errors: errors.length > 0 ? errors.slice(0, 10) : [] // Limit error messages
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('CSV import error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        details: error.stack
      },
      { status: 500 }
    );
  }
}
