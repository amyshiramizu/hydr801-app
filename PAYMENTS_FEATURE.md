# Podium Payments Import Feature

This feature allows you to import and manage Podium payment transaction data in the Hydr801 app.

## Files Created

### 1. Database Connection Utility
**`app/api/db.js`**
- Shared PostgreSQL connection pool
- Query wrapper with logging
- Uses `DATABASE_URL` or `DB_CONNECTION_STRING` environment variable

### 2. Migration Endpoint
**`app/api/migrate-payments/route.js`**
- **Method:** GET
- **Purpose:** Creates the `payments` table and indexes
- **URL:** `/api/migrate-payments`

**Response:**
```json
{
  "success": true,
  "message": "Payments table migration completed successfully",
  "columns": [...],
  "timestamp": "2026-03-17T13:26:00.000Z"
}
```

### 3. CSV Import Endpoint
**`app/api/payments-import/route.js`**
- **Method:** POST
- **Purpose:** Import Podium payment CSV data
- **URL:** `/api/payments-import`
- **Content-Type:** `text/csv` or `text/plain`

**Features:**
- Parses Podium CSV export format
- Matches patients by phone number (E.164 format)
- Skips duplicate transactions (same date + phone + amount)
- Normalizes phone numbers automatically
- Handles currency parsing (removes $ and commas)
- Maps payment status (Paid, Refunded, Canceled)

**CSV Columns Expected:**
- `transaction_date` - Date and time of transaction
- `contact_info` - Phone number (will be normalized to E.164)
- `contact_name` - Customer name
- `total` - Total amount
- `net` - Net amount after fees
- `amount_refunded` - Refunded amount
- `interchange_fees` - Interchange fees
- `transaction_fees` - Transaction fees
- `gift_card_load_fee` - Gift card fees
- `payment_type` - Type of payment
- `payment_channel` - Payment channel
- `channel_type` - Channel type (for status detection)
- `invoice_number` - Invoice/UID
- `description` - Payment description

**Response:**
```json
{
  "success": true,
  "summary": {
    "total_rows": 150,
    "imported": 145,
    "skipped": 5,
    "matched_patients": 120,
    "unmatched_patients": 25,
    "errors": []
  },
  "timestamp": "2026-03-17T13:26:00.000Z"
}
```

### 4. Payments Query Endpoint
**`app/api/payments/route.js`**
- **Method:** GET
- **Purpose:** Query payment records with filters
- **URL:** `/api/payments`

**Query Parameters:**
- `patient_id` - Filter by patient UUID
- `date_from` - Start date (YYYY-MM-DD)
- `date_to` - End date (YYYY-MM-DD)
- `status` - Filter by status (Paid, Sent, Canceled, Refunded)
- `limit` - Results per page (default: 100)
- `offset` - Pagination offset (default: 0)
- `sort_by` - Sort field (transaction_date, amount, created_at, patient_name, status)
- `sort_order` - ASC or DESC (default: DESC)

**Examples:**
```
GET /api/payments?patient_id=123e4567-e89b-12d3-a456-426614174000
GET /api/payments?date_from=2026-01-01&date_to=2026-03-17&status=Paid
GET /api/payments?limit=50&offset=0&sort_by=amount&sort_order=DESC
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "patient_id": "uuid",
      "patient_name": "John Doe",
      "contact_phone": "+18015604499",
      "amount": 150.00,
      "status": "Paid",
      "payment_type": "text_payment",
      "payment_channel": "card_not_present",
      "transaction_date": "2026-03-15T10:30:00.000Z",
      "net_amount": 145.50,
      "fees": 4.50,
      "source": "csv_import",
      ...
    }
  ],
  "pagination": {
    "total": 1500,
    "limit": 100,
    "offset": 0,
    "has_more": true
  }
}
```

### 5. Daily Payment Summary Endpoint
**`app/api/payments-daily/route.js`**
- **Method:** GET
- **Purpose:** Get daily payment summaries and aggregates
- **URL:** `/api/payments-daily`

**Query Parameters:**
- `days` - Number of days to look back (default: 30)
- `from` - Start date (YYYY-MM-DD)
- `to` - End date (YYYY-MM-DD)

**Examples:**
```
GET /api/payments-daily?days=30
GET /api/payments-daily?from=2026-01-01&to=2026-03-17
```

**Response:**
```json
{
  "success": true,
  "daily_summaries": [
    {
      "date": "2026-03-17",
      "paid": { "count": 15, "total": 2250.00 },
      "sent": { "count": 3, "total": 450.00 },
      "canceled": { "count": 1, "total": 100.00 },
      "refunded": { "count": 0, "total": 0 },
      "net_amount": 2180.50,
      "fees": 69.50,
      "unique_patients": 18,
      "total_transactions": 19
    },
    ...
  ],
  "summary": {
    "period": { "from": "30 days ago", "to": "today" },
    "total_paid": 45000.00,
    "total_refunded": 500.00,
    "total_net": 43650.00,
    "total_fees": 1350.00,
    "total_transactions": 450,
    "unique_patients": 280
  }
}
```

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

This will install the `pg` (PostgreSQL client) dependency that was added to `package.json`.

### 2. Set Environment Variables
Add to your `.env.local` or environment configuration:

```
DATABASE_URL=postgresql://username:password@hydr801.cns0yka6kka9.us-east-2.rds.amazonaws.com:5432/hydr801
```

Or use `DB_CONNECTION_STRING` as an alternative.

### 3. Run Migration
Visit or call:
```
GET http://localhost:3000/api/migrate-payments
```

Or in production:
```
GET https://your-app.amplifyapp.com/api/migrate-payments
```

This creates the `payments` table and all indexes.

### 4. Import CSV Data
```bash
curl -X POST http://localhost:3000/api/payments-import \
  -H "Content-Type: text/csv" \
  --data-binary @payment_transactions_export.csv
```

Or use a tool like Postman:
- Method: POST
- URL: `/api/payments-import`
- Body: Raw, Text, paste CSV content

## Database Schema

```sql
CREATE TABLE payments (
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
```

**Indexes:**
- `idx_payments_patient_id` - Fast patient lookups
- `idx_payments_transaction_date` - Date range queries
- `idx_payments_status` - Filter by status
- `idx_payments_contact_phone` - Phone number lookups
- `idx_payments_podium_invoice_uid` - Invoice lookups

## Usage Notes

1. **Phone Matching:** Patients are automatically matched by phone number. The import normalizes phone numbers to E.164 format (+1XXXXXXXXXX) to match the `patients.phone` format.

2. **Duplicate Prevention:** The import checks for existing records with the same transaction_date + contact_phone + amount combination and skips them.

3. **Unmatched Patients:** Payments without matching patients are still imported with `patient_id = NULL`. You can link them later or treat them as unregistered customers.

4. **Status Mapping:** The import attempts to determine status from the CSV data:
   - Default: "Paid"
   - If `amount_refunded > 0`: "Refunded"
   - If channel_type contains "refund": "Refunded"
   - If channel_type contains "cancel": "Canceled"

5. **Fees Calculation:** Total fees = interchange_fees + transaction_fees + gift_card_load_fee

## Testing

### Sample CSV Format
See `sample_payment_transactions.csv` for a reference file.

### Example API Calls

**Get all payments for a patient:**
```javascript
fetch('/api/payments?patient_id=abc-123-def')
  .then(r => r.json())
  .then(data => console.log(data));
```

**Get last 7 days summary:**
```javascript
fetch('/api/payments-daily?days=7')
  .then(r => r.json())
  .then(data => console.log(data));
```

## Troubleshooting

### Error: "relation 'payments' does not exist"
Run the migration endpoint first: `GET /api/migrate-payments`

### Error: "database connection failed"
Check your `DATABASE_URL` environment variable and ensure the RDS instance is accessible.

### CSV Import Errors
Check the response `errors` array for specific row issues. Common problems:
- Missing required columns
- Invalid date formats
- Phone numbers that can't be normalized
- Malformed CSV (mismatched quote pairs)

## Future Enhancements

- Real-time Podium API integration (OAuth + webhook)
- Payment reconciliation UI in HYDR801App.js
- Patient payment history view
- Revenue reports and analytics
- Automated invoice matching
- Email receipts
