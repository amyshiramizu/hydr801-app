# Payments UI - Quick Start Guide

## What Was Added

A complete **Payments** management system in your HYDR801 provider dashboard.

## How to Access

### Provider Dashboard
1. Switch to **Provider View** (🩺 button at top)
2. Tap **💰 Payments** in the bottom navigation bar

### Patient Detail View
1. Go to **👥 Patients**
2. Select any patient
3. Tap the **Payments** tab (between Injections and Nutrition)

## Main Features

### 📊 Dashboard Overview
- **4 Summary Cards**: Today, This Week, This Month, Outstanding
- **Revenue Chart**: Last 30 days daily totals (hover to see details)
- **Quick Stats**: See payment flow at a glance

### 🔍 Filters & Search
- **Date Range**: Pick from/to dates
- **Status**: Filter by Paid, Sent, Canceled, Refunded
- **Search**: Find by patient name
- **Import CSV**: Bulk upload transactions

### 📋 Transaction Table
- **Sortable**: Click column headers (Date, Patient, Status, Amount)
- **Status Badges**: Color-coded for quick recognition
- **Clickable**: Tap any row for full details
- **Pagination**: 25 per page, navigate with arrows

### 📥 CSV Import
1. Click **Import CSV** button
2. Drag & drop CSV file or click to browse
3. Preview first 5 rows
4. Click **Import Payments**
5. See results: imported, skipped, matched, unmatched

### 👤 Patient Payment History
- View all payments for a specific patient
- Total paid amount at top
- Chronological transaction list
- Status tracking per payment

## First Time Setup

When you first open the Payments screen, you'll see:
> **"Set Up Payments"**
> 
> Click **"Initialize Payments"** to create the database table.

This only needs to be done once.

## CSV Import Format

Your CSV should have these columns (header row required):
```csv
date,patient_name,description,status,amount,fees,net,notes
2025-01-15,Sarah Johnson,GLP-1 Month 2,Paid,200.00,6.50,193.50,
2025-01-16,Michael Roberts,Lipo-C Package,Sent,120.00,,,
```

**Column Details:**
- `date` - YYYY-MM-DD format
- `patient_name` - Full name (will match to patient_id)
- `description` - Service description
- `status` - Paid, Sent, Canceled, or Refunded
- `amount` - Total amount charged
- `fees` - Processing fees (optional)
- `net` - Net received amount (optional)
- `notes` - Additional notes (optional)

## API Endpoints (For Backend Team)

These need to be implemented:

1. **GET /api/payments** - List payments with filters
2. **GET /api/payments-daily** - Daily summary stats
3. **POST /api/payments-import** - CSV upload
4. **GET /api/migrate-payments** - One-time table creation

See `PAYMENTS_IMPLEMENTATION.md` for full API specs.

## Color Coding

- **Green** 🟢 = Paid (money received)
- **Yellow** 🟡 = Sent (invoice sent, awaiting payment)
- **Red** 🔴 = Canceled
- **Orange** 🟠 = Refunded

## Tips

- **Sort by Status** to see all unpaid invoices at once
- **Use Date Filters** to generate monthly/quarterly reports
- **Search by Patient** to quickly review an individual's payment history
- **Import in Batches** if you have lots of historical data
- **Check Patient Tab** to see payments in context of their treatment timeline

## Mobile Friendly ✅

The entire payments system is responsive and touch-optimized for iPad/tablet use in your clinic.

---

**Questions?** All code is in `/tmp/hydr801-app/app/HYDR801App.js` - search for "PAYMENTS" to find the sections.
