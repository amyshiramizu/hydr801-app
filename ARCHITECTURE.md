# Payment System Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     Hydr801 Wellness App                     │
│                    (Next.js 14 - App Router)                 │
└─────────────────────────────────────────────────────────────┘
                              │
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
┌───────────────┐   ┌──────────────────┐   ┌──────────────┐
│   CSV Import  │   │  Query Payments  │   │  Analytics   │
│   Endpoint    │   │    Endpoint      │   │   Endpoint   │
└───────────────┘   └──────────────────┘   └──────────────┘
        │                     │                     │
        └─────────────────────┼─────────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │   Database Pool  │
                    │   (app/api/db.js)│
                    └──────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │   PostgreSQL DB  │
                    │   AWS RDS        │
                    │   hydr801.rds... │
                    └──────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
   ┌─────────┐         ┌──────────┐         ┌──────────┐
   │patients │         │ payments │         │   users  │
   │  table  │◄────────│  table   │         │  table   │
   └─────────┘         └──────────┘         └──────────┘
   1,646 records         (new table)          6 records
```

## API Endpoints

### 1. Migration Endpoint
```
GET /api/migrate-payments
│
├─ Creates payments table
├─ Creates 5 indexes
└─ Returns table schema confirmation
```

### 2. CSV Import Endpoint
```
POST /api/payments-import
│
├─ Parse CSV data
├─ Normalize phone numbers
├─ Match patients by phone
├─ Check for duplicates
├─ Calculate fees
├─ Determine status
└─ Insert payment records
```

### 3. Payments Query Endpoint
```
GET /api/payments?filters
│
├─ Filter by patient_id
├─ Filter by date range
├─ Filter by status
├─ Apply pagination
├─ Sort results
└─ Return with patient data (JOIN)
```

### 4. Daily Summary Endpoint
```
GET /api/payments-daily?days=30
│
├─ Group by date
├─ Aggregate by status
├─ Calculate totals
├─ Count unique patients
└─ Return daily summaries + period totals
```

## Data Flow

### CSV Import Process
```
1. CSV Upload (Podium export)
   │
   ▼
2. Parse & Validate
   ├─ Parse CSV lines
   ├─ Extract columns
   └─ Validate required fields
   │
   ▼
3. Normalize Data
   ├─ Phone: +1XXXXXXXXXX
   ├─ Currency: $1,234.56 → 1234.56
   └─ Dates: MM/DD/YYYY → ISO 8601
   │
   ▼
4. Patient Matching
   ├─ SELECT * FROM patients WHERE phone = ?
   ├─ Match found → link patient_id
   └─ No match → patient_id = NULL
   │
   ▼
5. Duplicate Check
   ├─ Check: date + phone + amount
   ├─ Exists → skip
   └─ New → continue
   │
   ▼
6. Insert Payment
   └─ INSERT INTO payments (...)
   │
   ▼
7. Return Summary
   └─ {imported, skipped, matched, unmatched}
```

### Payment Query Process
```
1. API Request with filters
   │
   ▼
2. Build Dynamic SQL
   ├─ Base query
   ├─ Add WHERE clauses
   ├─ Add ORDER BY
   └─ Add LIMIT/OFFSET
   │
   ▼
3. Execute Query
   ├─ JOIN with patients table
   └─ Return matched rows
   │
   ▼
4. Count Total (for pagination)
   │
   ▼
5. Format Response
   └─ {data, pagination, filters}
```

## Database Schema Details

### Payments Table
```sql
payments
├─ id (UUID) PRIMARY KEY
├─ patient_id (UUID) → patients(id)      [Indexed]
├─ patient_name (VARCHAR)
├─ contact_phone (VARCHAR)                [Indexed]
├─ amount (DECIMAL)
├─ status (VARCHAR)                       [Indexed]
├─ payment_type (VARCHAR)
├─ payment_channel (VARCHAR)
├─ description (TEXT)
├─ podium_invoice_uid (VARCHAR)           [Indexed]
├─ transaction_date (TIMESTAMP)           [Indexed]
├─ net_amount (DECIMAL)
├─ fees (DECIMAL)
├─ refunded_amount (DECIMAL)
├─ source (VARCHAR) DEFAULT 'podium'
├─ imported_at (TIMESTAMP)
└─ created_at (TIMESTAMP)
```

### Relationships
```
patients (existing)
   ↑
   │ patient_id (FK)
   │
payments (new)
```

## Performance Optimizations

### Indexes
```sql
1. idx_payments_patient_id
   → Fast patient history lookups

2. idx_payments_transaction_date
   → Efficient date range queries

3. idx_payments_status
   → Quick status filtering

4. idx_payments_contact_phone
   → Patient matching during import

5. idx_payments_podium_invoice_uid
   → Invoice lookups, duplicate prevention
```

### Query Patterns
```
✅ Indexed: SELECT * FROM payments WHERE patient_id = ?
✅ Indexed: SELECT * FROM payments WHERE transaction_date BETWEEN ? AND ?
✅ Indexed: SELECT * FROM payments WHERE status = 'Paid'
⚡ Composite: All above filters combined
```

## Integration Points

### Current
```
┌──────────┐
│  CSV     │
│  Files   │
└────┬─────┘
     │
     ▼
┌──────────────────┐
│ payments-import  │
│    endpoint      │
└──────────────────┘
```

### Future (Podium OAuth)
```
┌──────────┐      ┌──────────────┐
│ Podium   │──────│ OAuth Flow   │
│ API      │      └──────────────┘
└────┬─────┘              │
     │                    ▼
     │            ┌──────────────┐
     └────────────│  /api/podium │ (existing)
                  └──────┬───────┘
                         │
                         ▼
                  ┌──────────────┐
                  │   Webhook    │
                  │   Handler    │
                  └──────┬───────┘
                         │
                         ▼
                  ┌──────────────┐
                  │   payments   │
                  │    table     │
                  └──────────────┘
```

## Security Model

```
Environment Variables
└─ DATABASE_URL (PostgreSQL connection)
   │
   ▼
Connection Pool (SSL in production)
   │
   ▼
Parameterized Queries ($1, $2, ...)
   │
   ▼
Row-Level Security (future: RLS policies)
```

## Deployment Architecture

### AWS Amplify
```
┌────────────────────────────────────┐
│         Amplify Hosting            │
│  ┌──────────────────────────────┐  │
│  │     Next.js Application      │  │
│  │                              │  │
│  │  ┌────────────────────────┐  │  │
│  │  │  API Routes            │  │  │
│  │  │  /api/payments*        │  │  │
│  │  └────────────────────────┘  │  │
│  └──────────────────────────────┘  │
└────────────────────────────────────┘
                │
                │ DATABASE_URL (env var)
                │
                ▼
┌────────────────────────────────────┐
│          AWS RDS (PostgreSQL)      │
│  hydr801.cns0yka6kka9.us-east-2... │
│                                    │
│  ┌────────┐  ┌──────────┐         │
│  │patients│  │ payments │         │
│  └────────┘  └──────────┘         │
└────────────────────────────────────┘
```

## Error Handling

```
API Request
   │
   ▼
Try {
   │
   ├─ Parse Input
   │  └─ Invalid → 400 Bad Request
   │
   ├─ Database Query
   │  └─ Error → 500 Server Error
   │
   └─ Return Success
      └─ 200 OK + JSON
}
Catch {
   └─ Log Error + Return {error, details}
}
```

## Monitoring Points

```
1. Import Success Rate
   └─ imported / (imported + skipped)

2. Patient Match Rate
   └─ matched_patients / total_rows

3. Query Performance
   └─ response time by filter type

4. Database Pool Health
   └─ active connections, errors

5. API Endpoint Status
   └─ 200 vs 4xx vs 5xx rates
```

## Scalability Considerations

### Current Capacity
- ✅ Connection pooling
- ✅ Indexed queries
- ✅ Pagination support
- ✅ Batch CSV imports

### Future Scaling
- Background job processing for large CSVs
- Read replicas for analytics queries
- Caching layer (Redis) for frequently accessed data
- Webhook queue for real-time Podium updates

---

**Version:** 1.0  
**Built:** March 17, 2026  
**Target:** Hydr801 Wellness App
