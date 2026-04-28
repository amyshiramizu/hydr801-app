#!/bin/bash

# Payments API Testing Script
# Usage: ./test-payments-api.sh [BASE_URL]
# Example: ./test-payments-api.sh http://localhost:3000
# Example: ./test-payments-api.sh https://your-app.amplifyapp.com

BASE_URL="${1:-http://localhost:3000}"

echo "🧪 Testing Hydr801 Payments API"
echo "Base URL: $BASE_URL"
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test 1: Migration
echo "${YELLOW}Test 1: Running database migration...${NC}"
curl -s "$BASE_URL/api/migrate-payments" | jq '.'
echo ""
echo ""

# Test 2: Import sample CSV
echo "${YELLOW}Test 2: Importing sample CSV data...${NC}"
if [ -f "sample_payment_transactions.csv" ]; then
  curl -s -X POST "$BASE_URL/api/payments-import" \
    -H "Content-Type: text/csv" \
    --data-binary @sample_payment_transactions.csv | jq '.'
  echo ""
else
  echo "${RED}sample_payment_transactions.csv not found!${NC}"
fi
echo ""

# Test 3: Get all payments
echo "${YELLOW}Test 3: Fetching all payments (limit 10)...${NC}"
curl -s "$BASE_URL/api/payments?limit=10" | jq '.data | length'
echo " payments returned"
echo ""

# Test 4: Get payments by status
echo "${YELLOW}Test 4: Fetching 'Paid' payments...${NC}"
curl -s "$BASE_URL/api/payments?status=Paid&limit=5" | jq '.data[0] | {patient_name, amount, status, transaction_date}'
echo ""

# Test 5: Get daily summary
echo "${YELLOW}Test 5: Fetching daily summary (last 7 days)...${NC}"
curl -s "$BASE_URL/api/payments-daily?days=7" | jq '.summary'
echo ""

# Test 6: Get payments for date range
echo "${YELLOW}Test 6: Fetching payments for March 2026...${NC}"
curl -s "$BASE_URL/api/payments?date_from=2026-03-01&date_to=2026-03-31&limit=5" | jq '{total: .pagination.total, sample: .data[0].patient_name}'
echo ""

echo "${GREEN}✅ All tests completed!${NC}"
