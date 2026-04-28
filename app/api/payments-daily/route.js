import { NextResponse } from 'next/server';
import { query } from '../db';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Get query parameters
    const days = parseInt(searchParams.get('days') || '30', 10);
    const dateFrom = searchParams.get('from');
    const dateTo = searchParams.get('to');

    let queryText = `
      SELECT 
        DATE(transaction_date) as date,
        COUNT(*) FILTER (WHERE status = 'Paid') as paid_count,
        COALESCE(SUM(amount) FILTER (WHERE status = 'Paid'), 0) as paid_total,
        COUNT(*) FILTER (WHERE status = 'Sent') as sent_count,
        COALESCE(SUM(amount) FILTER (WHERE status = 'Sent'), 0) as sent_total,
        COUNT(*) FILTER (WHERE status = 'Canceled') as canceled_count,
        COALESCE(SUM(amount) FILTER (WHERE status = 'Canceled'), 0) as canceled_total,
        COUNT(*) FILTER (WHERE status = 'Refunded') as refunded_count,
        COALESCE(SUM(amount) FILTER (WHERE status = 'Refunded'), 0) as refunded_total,
        COALESCE(SUM(net_amount), 0) as total_net,
        COALESCE(SUM(fees), 0) as total_fees,
        COUNT(DISTINCT patient_id) as unique_patients,
        COUNT(*) as total_transactions
      FROM payments
      WHERE 1=1
    `;

    const queryParams = [];
    let paramCount = 1;

    // Apply date filters
    if (dateFrom) {
      queryText += ` AND DATE(transaction_date) >= $${paramCount}`;
      queryParams.push(dateFrom);
      paramCount++;
    } else if (!dateTo && days) {
      // Default to last N days if no specific date range
      queryText += ` AND transaction_date >= NOW() - INTERVAL '${days} days'`;
    }

    if (dateTo) {
      queryText += ` AND DATE(transaction_date) <= $${paramCount}`;
      queryParams.push(dateTo);
      paramCount++;
    }

    queryText += `
      GROUP BY DATE(transaction_date)
      ORDER BY date DESC
    `;

    // Execute query
    const result = await query(queryText, queryParams);

    // Calculate summary statistics
    const summary = {
      total_paid: 0,
      total_refunded: 0,
      total_net: 0,
      total_fees: 0,
      total_transactions: 0,
      unique_patients: new Set()
    };

    result.rows.forEach(row => {
      summary.total_paid += parseFloat(row.paid_total) || 0;
      summary.total_refunded += parseFloat(row.refunded_total) || 0;
      summary.total_net += parseFloat(row.total_net) || 0;
      summary.total_fees += parseFloat(row.total_fees) || 0;
      summary.total_transactions += parseInt(row.total_transactions) || 0;
    });

    // Get unique patient count for the period
    let uniquePatientsQuery = `
      SELECT COUNT(DISTINCT patient_id) as unique_patients
      FROM payments
      WHERE patient_id IS NOT NULL
    `;
    
    const uniqueParams = [];
    let uniqueParamCount = 1;
    
    if (dateFrom) {
      uniquePatientsQuery += ` AND DATE(transaction_date) >= $${uniqueParamCount}`;
      uniqueParams.push(dateFrom);
      uniqueParamCount++;
    } else if (!dateTo && days) {
      uniquePatientsQuery += ` AND transaction_date >= NOW() - INTERVAL '${days} days'`;
    }

    if (dateTo) {
      uniquePatientsQuery += ` AND DATE(transaction_date) <= $${uniqueParamCount}`;
      uniqueParams.push(dateTo);
      uniqueParamCount++;
    }

    const uniqueResult = await query(uniquePatientsQuery, uniqueParams);
    summary.unique_patients = parseInt(uniqueResult.rows[0]?.unique_patients) || 0;

    return NextResponse.json({
      success: true,
      daily_summaries: result.rows.map(row => ({
        date: row.date,
        paid: {
          count: parseInt(row.paid_count) || 0,
          total: parseFloat(row.paid_total) || 0
        },
        sent: {
          count: parseInt(row.sent_count) || 0,
          total: parseFloat(row.sent_total) || 0
        },
        canceled: {
          count: parseInt(row.canceled_count) || 0,
          total: parseFloat(row.canceled_total) || 0
        },
        refunded: {
          count: parseInt(row.refunded_count) || 0,
          total: parseFloat(row.refunded_total) || 0
        },
        net_amount: parseFloat(row.total_net) || 0,
        fees: parseFloat(row.total_fees) || 0,
        unique_patients: parseInt(row.unique_patients) || 0,
        total_transactions: parseInt(row.total_transactions) || 0
      })),
      summary: {
        period: {
          from: dateFrom || `${days} days ago`,
          to: dateTo || 'today'
        },
        total_paid: parseFloat(summary.total_paid.toFixed(2)),
        total_refunded: parseFloat(summary.total_refunded.toFixed(2)),
        total_net: parseFloat(summary.total_net.toFixed(2)),
        total_fees: parseFloat(summary.total_fees.toFixed(2)),
        total_transactions: summary.total_transactions,
        unique_patients: summary.unique_patients
      }
    });

  } catch (error) {
    console.error('Daily payments summary error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message
      },
      { status: 500 }
    );
  }
}
