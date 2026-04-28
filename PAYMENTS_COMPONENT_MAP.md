# Payments UI - Component Architecture

## Component Hierarchy

```
HYDR801App
├── providerScreens
│   ├── dashboard (existing)
│   ├── patients (existing)
│   ├── 💰 payments ← NEW
│   ├── messages (existing)
│   ├── analytics (existing)
│   └── settings (existing)
│
└── ProviderBottomNav
    ├── Dashboard 🏠
    ├── Patients 👥
    ├── Payments 💰 ← NEW
    ├── Messages 💬
    └── Settings ⚙️
```

## New Components Added

### 1. **PaymentsScreen** (Main Component)
**Location:** Lines ~1140-1530
**Purpose:** Full payments dashboard for providers

**Sub-components:**
- Summary cards grid (4 cards)
- DailyRevenueChart component
- Filters bar (date range, status, search)
- Transaction table with sorting & pagination
- CSV import button
- Payment detail modal trigger

**State Management:**
```javascript
- payments (array)
- dailySummaries (array)
- loading (boolean)
- needsMigration (boolean)
- dateFrom, dateTo (strings)
- statusFilter (string)
- searchQuery (string)
- currentPage (number)
- sortBy, sortOrder (strings)
- showImportModal (boolean)
- selectedPayment (object)
- summaryStats (object)
```

**API Calls:**
- `GET /api/payments` (with filters, pagination, sorting)
- `GET /api/payments-daily` (for chart)
- `GET /api/migrate-payments` (first-time setup)

---

### 2. **DailyRevenueChart**
**Location:** Lines ~1530-1610
**Purpose:** SVG bar chart showing 30-day revenue

**Features:**
- Dynamic bar heights based on daily totals
- Hover state with tooltip
- Date formatting (M/D)
- Currency formatting
- Responsive bar width calculation

**No external libraries!** Pure inline SVG.

---

### 3. **CSVImportModal**
**Location:** Lines ~1610-1740
**Purpose:** Import payment CSV files

**Features:**
- Drag & drop zone
- File picker fallback
- CSV preview (first 5 rows)
- Import progress state
- Results display (imported/skipped/matched/unmatched)
- Auto-close after success

**API Call:**
- `POST /api/payments-import` (Content-Type: text/csv)

---

### 4. **PaymentDetailModal**
**Location:** Lines ~1740-1830
**Purpose:** Show full payment details

**Displays:**
- Patient name
- Date
- Description
- Status badge (color-coded)
- Amount breakdown (Amount, Fees, Net)
- Notes (if available)

---

### 5. **PatientPaymentHistory**
**Location:** Lines ~1100-1250
**Purpose:** Payment history in patient detail view

**Integration:** Added as new tab in `PatientDetailScreen`

**Features:**
- Total paid summary card
- Transaction list for specific patient
- Status badges
- Date sorting (newest first)
- Fetches via `patient_id` parameter

**API Call:**
- `GET /api/payments?patient_id={id}&limit=50`

---

## Modified Components

### PatientDetailScreen
**Change:** Added `'payments'` to tabs array
```javascript
// Before:
['overview', 'injections', 'nutrition', 'fitness', 'weight']

// After:
['overview', 'injections', 'payments', 'nutrition', 'fitness', 'weight']
```

**New Tab Content:**
```javascript
{activeTab === 'payments' && (
  <PatientPaymentHistory patientId={patient.id} />
)}
```

### ProviderBottomNav
**Change:** Added payments item to navigation
```javascript
{ id: 'payments', icon: '💰', label: 'Payments' }
```
Position: 3rd button (between Patients and Messages)

---

## New Styles Added

**Location:** End of `styles` object (lines ~17700)

```javascript
paymentsCard       // White cards with subtle shadow
paymentInput       // Form inputs (date, select, text)
tableHeader        // Sortable column headers
tableCell          // Table cell styling
paginationBtn      // Pagination buttons
modalOverlay       // Modal backdrop (dark overlay)
modalContent       // Modal container (white card)
closeButton        // X button (top-right of modals)
resultItem         // Import result display boxes
resultLabel        // Result labels
resultValue        // Result values (green, bold)
detailLabel        // Detail modal labels (uppercase)
detailValue        // Detail modal values
```

---

## Data Flow

### Loading Payments
```
User opens Payments screen
  ↓
useEffect triggers
  ↓
loadPayments() fetches /api/payments
  ↓
Calculate summaryStats
  ↓
Render summary cards + table
```

### Filtering/Sorting
```
User changes filter or sort
  ↓
State updates (dateFrom, statusFilter, sortBy, etc.)
  ↓
useEffect dependency triggers
  ↓
loadPayments() with new params
  ↓
Re-render with filtered data
```

### CSV Import
```
User clicks Import CSV
  ↓
Modal opens (showImportModal = true)
  ↓
User drops/selects CSV file
  ↓
FileReader loads CSV text
  ↓
User clicks Import button
  ↓
POST /api/payments-import
  ↓
Display results
  ↓
Auto-close and refresh payments list
```

### Patient Payment History
```
User opens patient detail
  ↓
Clicks "Payments" tab
  ↓
PatientPaymentHistory mounts
  ↓
useEffect fetches /api/payments?patient_id={id}
  ↓
Calculate total paid
  ↓
Render summary + transaction list
```

---

## Screen Flow Map

```
Provider Dashboard
       ↓
   [💰 Payments] (bottom nav)
       ↓
   PaymentsScreen
       ├─→ Summary Cards (today/week/month/outstanding)
       ├─→ Daily Revenue Chart (hover tooltips)
       ├─→ Filters Bar
       │    ├─→ Date Range
       │    ├─→ Status Dropdown
       │    ├─→ Search Input
       │    └─→ [Import CSV] → CSVImportModal
       ├─→ Transaction Table
       │    ├─→ Sortable Headers
       │    ├─→ Click Row → PaymentDetailModal
       │    └─→ Pagination Controls
       └─→ [If no table] → Migration Setup Button

OR

Patients List
       ↓
   Select Patient
       ↓
   PatientDetailScreen
       ↓
   [Payments Tab]
       ↓
   PatientPaymentHistory
       ├─→ Total Paid Summary
       └─→ Transaction List
```

---

## File Structure

```
/tmp/hydr801-app/
├── app/
│   ├── HYDR801App.js ← MODIFIED (all changes here)
│   └── api/ (needs to be created)
│       ├── payments/
│       │   └── route.js ← TO BE IMPLEMENTED
│       ├── payments-daily/
│       │   └── route.js ← TO BE IMPLEMENTED
│       ├── payments-import/
│       │   └── route.js ← TO BE IMPLEMENTED
│       └── migrate-payments/
│           └── route.js ← TO BE IMPLEMENTED
│
├── PAYMENTS_IMPLEMENTATION.md ← CREATED (full spec)
├── PAYMENTS_QUICK_START.md ← CREATED (user guide)
└── PAYMENTS_COMPONENT_MAP.md ← THIS FILE
```

---

## Integration Points

### ✅ Complete
- [x] Navigation button added (ProviderBottomNav)
- [x] Screen routing added (providerScreens object)
- [x] Patient detail tab added (PatientDetailScreen)
- [x] Styles added (styles object)
- [x] All components implemented
- [x] State management implemented
- [x] API integration ready

### ⏳ Backend Required
- [ ] API endpoints implementation
- [ ] Database table creation
- [ ] CSV parsing logic
- [ ] Patient ID matching
- [ ] Data validation

---

## Testing Points

1. **Payments Screen Loads**
   - Navigation button appears
   - Screen renders without errors
   - Shows migration setup if table doesn't exist

2. **Data Loading**
   - Summary cards calculate correctly
   - Chart renders with data
   - Table displays transactions
   - Pagination works

3. **Filters**
   - Date range filters apply
   - Status filter works
   - Search filters by patient name
   - Multiple filters combine correctly

4. **Sorting**
   - Click headers to sort
   - Direction indicator shows (↑/↓)
   - Data re-orders correctly

5. **CSV Import**
   - Modal opens
   - File upload works (drag/drop + picker)
   - Preview displays
   - Import processes
   - Results show correctly

6. **Patient History**
   - Tab appears in patient detail
   - Loads patient-specific payments
   - Summary calculates correctly
   - List displays with status badges

---

**Total Lines Added:** ~600 lines
**Total Components Added:** 5 major components
**Total Styles Added:** 13 new style definitions
**Breaking Changes:** None
**Existing Functionality Affected:** None
