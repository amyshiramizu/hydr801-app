import { NextResponse } from 'next/server';
import { query } from '../db';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Get query parameters
    const patientId = searchParams.get('patient_id');
    const dateFrom = searchParams.get('date_from');
    const dateTo = searchParams.get('date_to');
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '100', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);
    const sortBy = searchParams.get('sort_by') || 'transaction_date';
    const sortOrder = searchParams.get('sort_order') || 'DESC';

    // Build query
    let queryText = `
      SELECT 
        p.id,
        p.patient_id,
        p.patient_name,
        p.contact_phone,
        p.amount,
        p.status,
        p.payment_type,
        p.payment_channel,
        p.description,
        p.podium_invoice_uid,
        p.transaction_date,
        p.net_amount,
        p.fees,
        p.refunded_amount,
        p.source,
        p.imported_at,
        p.created_at,
        pt.name as matched_patient_name,
        pt."firstName" as patient_first_name,
        pt."lastName" as patient_last_name
      FROM payments p
      LEFT JOIN patients pt ON p.patient_id = pt.id
      WHERE 1=1
    `;

    const queryParams = [];
    let paramCount = 1;

    // Add filters
    if (patientId) {
      queryText += ` AND p.patient_id = $${paramCount}`;
      queryParams.push(patientId);
      paramCount++;
    }

    if (dateFrom) {
      queryText += ` AND p.transaction_date >= $${paramCount}`;
      queryParams.push(dateFrom);
      paramCount++;
    }

    if (dateTo) {
      queryText += ` AND p.transaction_date <= $${paramCount}`;
      queryParams.push(dateTo);
      paramCount++;
    }

    if (status) {
      queryText += ` AND p.status = $${paramCount}`;
      queryParams.push(status);
      paramCount++;
    }

    // Add sorting
    const allowedSortFields = ['transaction_date', 'amount', 'created_at', 'patient_name', 'status'];
    const sortField = allowedSortFields.includes(sortBy) ? sortBy : 'transaction_date';
    const order = sortOrder.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
    
    queryText += ` ORDER BY p.${sortField} ${order}`;

    // Add pagination
    queryText += ` LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
    queryParams.push(limit, offset);

    // Execute query
    const result = await query(queryText, queryParams);

    // Get total count for pagination
    let countQueryText = `
      SELECT COUNT(*) as total
      FROM payments p
      WHERE 1=1
    `;
    const countParams = [];
    let countParamIndex = 1;

    if (patientId) {
      countQueryText += ` AND p.patient_id = $${countParamIndex}`;
      countParams.push(patientId);
      countParamIndex++;
    }

    if (dateFrom) {
      countQueryText += ` AND p.transaction_date >= $${countParamIndex}`;
      countParams.push(dateFrom);
      countParamIndex++;
    }

    if (dateTo) {
      countQueryText += ` AND p.transaction_date <= $${countParamIndex}`;
      countParams.push(dateTo);
      countParamIndex++;
    }

    if (status) {
      countQueryText += ` AND p.status = $${countParamIndex}`;
      countParams.push(status);
      countParamIndex++;
    }

    const countResult = await query(countQueryText, countParams);
    const totalRecords = parseInt(countResult.rows[0].total, 10);

    return NextResponse.json({
      success: true,
      data: result.rows,
      pagination: {
        total: totalRecords,
        limit,
        offset,
        has_more: offset + limit < totalRecords
      },
      filters: {
        patient_id: patientId,
        date_from: dateFrom,
        date_to: dateTo,
        status
      }
    });

  } catch (error) {
    console.error('Payments query error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message
      },
      { status: 500 }
    );
  }
}
