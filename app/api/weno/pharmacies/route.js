import { NextResponse } from 'next/server';
import { query } from '../../db';

// Weno Pharmacy Directory API endpoint
// Returns list of pharmacies for the searchable dropdown

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const state = searchParams.get('state') || '';
    const limit = parseInt(searchParams.get('limit') || '100', 10);

    // Try to fetch from Weno pharmacy directory if configured
    const WENO_PARTNER_ID = process.env.WENO_PARTNER_ID;
    const WENO_EZ_KEY = process.env.WENO_EZ_KEY;

    // First, try to get pharmacies from database
    let pharmacies = [];
    
    try {
      // Check if we have a pharmacies table
      const result = await query(
        `SELECT id, name, address, city, state, zip, phone, ncpdp, fax, is_24hr, is_mail_order
         FROM weno_pharmacies 
         WHERE ($1 = '' OR name ILIKE $1 OR address ILIKE $1 OR city ILIKE $1)
         AND ($2 = '' OR state = $2)
         ORDER BY name
         LIMIT $3`,
        [search ? `%${search}%` : '', state, limit]
      );
      pharmacies = result.rows;
    } catch (dbError) {
      // Table might not exist, will use fallback data
      console.log('Pharmacy table not found, using fallback data');
    }

    // If no pharmacies from DB or table doesn't exist, use Weno directory or sample data
    if (pharmacies.length === 0) {
      // In production, this would call Weno's pharmacy directory API
      // For now, return sample pharmacies for development
      pharmacies = getSamplePharmacies(search, state, limit);
    }

    return NextResponse.json({
      success: true,
      pharmacies,
      count: pharmacies.length,
      source: pharmacies.length > 0 && pharmacies[0].id ? 'database' : 'sample',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Pharmacy API error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

function getSamplePharmacies(search, state, limit) {
  const allPharmacies = [
    // California
    { id: '1', name: 'CVS Pharmacy #1234', address: '123 Main St', city: 'San Francisco', state: 'CA', zip: '94102', phone: '(415) 555-0100', ncpdp: '1234567', fax: '(415) 555-0101', is_24hr: false, is_mail_order: true },
    { id: '2', name: 'Walgreens #5678', address: '456 Market St', city: 'San Francisco', state: 'CA', zip: '94103', phone: '(415) 555-0200', ncpdp: '2345678', fax: '(415) 555-0201', is_24hr: true, is_mail_order: true },
    { id: '3', name: 'Rite Aid #901', address: '789 Mission St', city: 'San Francisco', state: 'CA', zip: '94105', phone: '(415) 555-0300', ncpdp: '3456789', fax: '(415) 555-0301', is_24hr: false, is_mail_order: false },
    { id: '4', name: 'Costco Pharmacy #421', address: '100 Airport Blvd', city: 'South San Francisco', state: 'CA', zip: '94108', phone: '(650) 555-0400', ncpdp: '4567890', fax: '(650) 555-0401', is_24hr: false, is_mail_order: true },
    { id: '5', name: 'Safeway Pharmacy #1234', address: '200 Van Ness Ave', city: 'San Francisco', state: 'CA', zip: '94102', phone: '(415) 555-0500', ncpdp: '5678901', fax: '(415) 555-0501', is_24hr: false, is_mail_order: true },
    { id: '6', name: 'CVS Pharmacy #5678', address: '300 Geary St', city: 'San Francisco', state: 'CA', zip: '94102', phone: '(415) 555-0600', ncpdp: '6789012', fax: '(415) 555-0601', is_24hr: true, is_mail_order: true },
    { id: '7', name: 'Walgreens #2345', address: '400 Powell St', city: 'San Francisco', state: 'CA', zip: '94102', phone: '(415) 555-0700', ncpdp: '7890123', fax: '(415) 555-0701', is_24hr: true, is_mail_order: true },
    { id: '8', name: 'Cigna Pharmacy', address: '500 Sutter St', city: 'San Francisco', state: 'CA', zip: '94102', phone: '(415) 555-0800', ncpdp: '8901234', fax: '(415) 555-0801', is_24hr: false, is_mail_order: true },
    { id: '9', name: 'Golden Gate Pharmacy', address: '600 Fillmore St', city: 'San Francisco', state: 'CA', zip: '94117', phone: '(415) 555-0900', ncpdp: '9012345', fax: '(415) 555-0901', is_24hr: false, is_mail_order: false },
    { id: '10', name: 'Mission Pharmacy', address: '700 Valencia St', city: 'San Francisco', state: 'CA', zip: '94110', phone: '(415) 555-1000', ncpdp: '0123456', fax: '(415) 555-1001', is_24hr: false, is_mail_order: false },
    { id: '11', name: 'UCSF Medical Center Pharmacy', address: '500 Parnassus Ave', city: 'San Francisco', state: 'CA', zip: '94143', phone: '(415) 555-1100', ncpdp: '1123456', fax: '(415) 555-1101', is_24hr: true, is_mail_order: false },
    { id: '12', name: 'Kaiser Permanente Pharmacy', address: '1200 Bay Shore Blvd', city: 'Burlingame', state: 'CA', zip: '94010', phone: '(650) 555-1200', ncpdp: '2123456', fax: '(650) 555-1201', is_24hr: false, is_mail_order: true },
    // Texas
    { id: '13', name: 'CVS Pharmacy #2001', address: '1001 Congress Ave', city: 'Austin', state: 'TX', zip: '78701', phone: '(512) 555-0100', ncpdp: '3123456', fax: '(512) 555-0101', is_24hr: false, is_mail_order: true },
    { id: '14', name: 'Walgreens #4001', address: '2001 Guadalupe St', city: 'Austin', state: 'TX', zip: '78701', phone: '(512) 555-0200', ncpdp: '4123456', fax: '(512) 555-0201', is_24hr: true, is_mail_order: true },
    { id: '15', name: 'H-E-B Pharmacy #101', address: '600 Congress Ave', city: 'Austin', state: 'TX', zip: '78701', phone: '(512) 555-0300', ncpdp: '5123456', fax: '(512) 555-0301', is_24hr: false, is_mail_order: true },
    { id: '16', name: 'Costco Pharmacy #1089', address: '5600 Research Blvd', city: 'Austin', state: 'TX', zip: '78701', phone: '(512) 555-0400', ncpdp: '6123456', fax: '(512) 555-0401', is_24hr: false, is_mail_order: true },
    // New York
    { id: '17', name: 'CVS Pharmacy #3001', address: '100 5th Ave', city: 'New York', state: 'NY', zip: '10011', phone: '(212) 555-0100', ncpdp: '7123456', fax: '(212) 555-0101', is_24hr: true, is_mail_order: true },
    { id: '18', name: 'Walgreens #5001', address: '200 Park Ave', city: 'New York', state: 'NY', zip: '10166', phone: '(212) 555-0200', ncpdp: '8123456', fax: '(212) 555-0201', is_24hr: true, is_mail_order: true },
    { id: '19', name: 'Duane Reade #10001', address: '300 Broadway', city: 'New York', state: 'NY', zip: '10007', phone: '(212) 555-0300', ncpdp: '9123456', fax: '(212) 555-0301', is_24hr: false, is_mail_order: true },
    { id: '20', name: 'NYU Langone Pharmacy', address: '550 1st Ave', city: 'New York', state: 'NY', zip: '10016', phone: '(212) 555-0400', ncpdp: '0223456', fax: '(212) 555-0401', is_24hr: true, is_mail_order: false },
    // Florida
    { id: '21', name: 'CVS Pharmacy #4001', address: '100 S Beach St', city: 'Miami', state: 'FL', zip: '33139', phone: '(305) 555-0100', ncpdp: '1223456', fax: '(305) 555-0101', is_24hr: false, is_mail_order: true },
    { id: '22', name: 'Walgreens #6001', address: '200 Biscayne Blvd', city: 'Miami', state: 'FL', zip: '33131', phone: '(305) 555-0200', ncpdp: '2223456', fax: '(305) 555-0201', is_24hr: true, is_mail_order: true },
    { id: '23', name: 'Publix Pharmacy #1001', address: '400 Ocean Dr', city: 'Miami', state: 'FL', zip: '33139', phone: '(305) 555-0300', ncpdp: '3223456', fax: '(305) 555-0301', is_24hr: false, is_mail_order: true },
    // Illinois
    { id: '24', name: 'CVS Pharmacy #5001', address: '100 N Michigan Ave', city: 'Chicago', state: 'IL', zip: '60601', phone: '(312) 555-0100', ncpdp: '4223456', fax: '(312) 555-0101', is_24hr: false, is_mail_order: true },
    { id: '25', name: 'Walgreens #7001', address: '200 N State St', city: 'Chicago', state: 'IL', zip: '60601', phone: '(312) 555-0200', ncpdp: '5223456', fax: '(312) 555-0201', is_24hr: true, is_mail_order: true },
    { id: '26', name: 'Mariano\'s Pharmacy #501', address: '300 E Randolph St', city: 'Chicago', state: 'IL', zip: '60601', phone: '(312) 555-0300', ncpdp: '6223456', fax: '(312) 555-0301', is_24hr: false, is_mail_order: true },
  ];

  let filtered = allPharmacies;

  // Filter by search term
  if (search) {
    const term = search.toLowerCase();
    filtered = filtered.filter(p => 
      p.name.toLowerCase().includes(term) ||
      p.address.toLowerCase().includes(term) ||
      p.city.toLowerCase().includes(term) ||
      p.zip.includes(term) ||
      p.phone.includes(term)
    );
  }

  // Filter by state
  if (state) {
    filtered = filtered.filter(p => p.state === state);
  }

  // Apply limit
  return filtered.slice(0, limit);
}
