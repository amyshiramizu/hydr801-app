import { NextResponse } from 'next/server';
import { query } from '../db';

export async function GET(request) {
  try {
    console.log('Starting payments table migration...');

    // Create payments table
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS payments (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        patient_id UUID REFERENCES patients(id),
        patient_name VARCHAR(255) NOT NULL,
        contact_phone VARCHAR(50),
        amount DECIMAL(10,2) NOT NULL,
        status VARCHAR(50) NOT NULL,
        payment_type VARCHAR(50),
        payment_channel VARCHAR(50),
        description TEXT,
        podium_invoice_uid VARCHAR(255),
        transaction_date TIMESTAMP NOT NULL,
        net_amount DECIMAL(10,2),
        fees DECIMAL(10,2),
        refunded_amount DECIMAL(10,2) DEFAULT 0,
        source VARCHAR(50) DEFAULT 'podium',
        imported_at TIMESTAMP DEFAULT NOW(),
        created_at TIMESTAMP DEFAULT NOW()
      );
    `;

    await query(createTableQuery);
    console.log('✓ Payments table created/verified');

    // Create indexes
    const indexes = [
      'CREATE INDEX IF NOT EXISTS idx_payments_patient_id ON payments(patient_id);',
      'CREATE INDEX IF NOT EXISTS idx_payments_transaction_date ON payments(transaction_date);',
      'CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);',
      'CREATE INDEX IF NOT EXISTS idx_payments_contact_phone ON payments(contact_phone);',
      'CREATE INDEX IF NOT EXISTS idx_payments_podium_invoice_uid ON payments(podium_invoice_uid);'
    ];

    for (const indexQuery of indexes) {
      await query(indexQuery);
    }
    console.log('✓ Indexes created/verified');

    // Check if table exists and get info
    const tableInfoQuery = `
      SELECT 
        column_name, 
        data_type, 
        is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'payments' 
      ORDER BY ordinal_position;
    `;
    
    const tableInfo = await query(tableInfoQuery);

    return NextResponse.json({
      success: true,
      message: 'Payments table migration completed successfully',
      columns: tableInfo.rows,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Migration error:', error);
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
