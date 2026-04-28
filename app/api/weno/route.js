import { NextResponse } from 'next/server';
import { query } from '../db';
import crypto from 'crypto';

// WENO API configuration
const WENO_PARTNER_ID = process.env.WENO_PARTNER_ID;
const WENO_MD5_PASSWORD = process.env.WENO_MD5_PASSWORD;
const WENO_EZ_KEY = process.env.WENO_EZ_KEY;
const WENO_LOCATION_ID = process.env.WENO_LOCATION_ID || 'L1255'; // Default test location ID
const WENO_MODE = process.env.WENO_MODE || 'TEST'; // TEST or LIVE

// WENO API endpoints
const WENO_ENDPOINTS = {
  TEST: 'https://test.wenoexchange.com/webapi/wenoonline.asmx',
  LIVE: 'https://online.wenoexchange.com/webapi/wenoonline.asmx',
};

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    if (action === 'config_status') {
      const isConfigured = !!(WENO_PARTNER_ID && WENO_MD5_PASSWORD && WENO_EZ_KEY);
      
      return NextResponse.json({
        success: true,
        configured: isConfigured,
        env_vars: {
          WENO_PARTNER_ID: WENO_PARTNER_ID ? '***' + WENO_PARTNER_ID.slice(-4) : null,
          WENO_MD5_PASSWORD: WENO_MD5_PASSWORD ? '***' + WENO_MD5_PASSWORD.slice(-4) : null,
          WENO_EZ_KEY: WENO_EZ_KEY ? '***' + WENO_EZ_KEY.slice(-4) : null,
          WENO_LOCATION_ID: WENO_LOCATION_ID || null,
          WENO_MODE,
        },
        timestamp: new Date().toISOString()
      });
    }

    return NextResponse.json({
      success: true,
      message: 'WENO API',
      available_actions: ['config_status', 'build_xml', 'send', 'rxlog_url'],
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('WENO GET error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { action, prescription, patient, prescriber } = body;

    // Check if WENO credentials are configured
    if (!WENO_PARTNER_ID || !WENO_MD5_PASSWORD || !WENO_EZ_KEY) {
      return NextResponse.json(
        { success: false, error: 'WENO credentials not configured. Set WENO_PARTNER_ID, WENO_MD5_PASSWORD, and WENO_EZ_KEY environment variables.' },
        { status: 500 }
      );
    }

    switch (action) {
      case 'build_xml':
        return handleBuildXml(prescription, patient, prescriber);

      case 'send':
        return await handleSend(prescription, patient, prescriber);

      case 'rxlog_url':
        return handleRxlogUrl(prescription, prescriber);

      default:
        return NextResponse.json(
          { success: false, error: `Unknown action: ${action}` },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error('WENO POST error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

function handleBuildXml(prescription, patient, prescriber) {
  try {
    if (!prescription || !patient) {
      return NextResponse.json(
        { success: false, error: 'Prescription and patient data required' },
        { status: 400 }
      );
    }

    const xml = buildPrescriptionXml(prescription, patient, prescriber);

    return NextResponse.json({
      success: true,
      action: 'build_xml',
      xml,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Build XML error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

async function handleSend(prescription, patient, prescriber) {
  try {
    if (!prescription || !patient) {
      return NextResponse.json(
        { success: false, error: 'Prescription and patient data required' },
        { status: 400 }
      );
    }

    const xml = buildPrescriptionXml(prescription, patient, prescriber);

    // Transmit via SOAP to WENO
    const result = await transmitToWeno(xml, prescription.id);

    return NextResponse.json({
      success: true,
      action: 'send',
      transmission_id: result.transmission_id,
      iframe_url: result.iframe_url,
      xml_sent: xml,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Send error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

function handleRxlogUrl(prescription, prescriber) {
  try {
    if (!prescription) {
      return NextResponse.json(
        { success: false, error: 'Prescription data required' },
        { status: 400 }
      );
    }

    // Get user email from prescriber or prescription (fallbacks require proper WENO creds)
    const userEmail = prescriber?.weno_email || prescription.weno_email;
    const md5Password = prescriber?.weno_password || prescription.weno_password || WENO_MD5_PASSWORD;

    if (!userEmail) {
      return NextResponse.json(
        { success: false, error: 'WENO user email required for RxLog URL. Set prescriber.weno_email or prescription.weno_email.' },
        { status: 400 }
      );
    }

    // Generate WENO RxLog URL with encrypted credentials
    const rxlogUrl = buildRxlogUrl(userEmail, md5Password);

    return NextResponse.json({
      success: true,
      action: 'rxlog_url',
      rxlog_url: rxlogUrl,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('RxLog URL error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

/**
 * Build NCPDP SCRIPT 20170715 compliant prescription XML
 * Follows the SCRIPT header + NewRx Body structure per WOL EHR API documentation
 */
function buildPrescriptionXml(prescription, patient, prescriber) {
  const sentTime = new Date().toISOString();
  const messageId = generateUUID();
  
  // Format dates for NCPDP SCRIPT
  const dateOfBirth = formatNCPDPDate(patient.dateOfBirth || patient.dob);
  const writtenDate = formatNCPDPDate(new Date().toISOString().split('T')[0]);
  const writtenTime = new Date().toTimeString().split(' ')[0];

  // Build the SCRIPT-compliant XML
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<SCRIPT xmlns="http://www.ncpdp.org/schema/SCRIPT">
  <Header>
      <From>
      <ID>${escapeXml(WENO_PARTNER_ID)}</ID>
    </From>
    <To>
      <ID>WENO</ID>
    </To>
    <MessageID>${escapeXml(messageId)}</MessageID>
    <SentTime>${escapeXml(sentTime)}</SentTime>
    <Security>
      <Username>${escapeXml(WENO_PARTNER_ID)}</Username>
      <Password>${escapeXml(WENO_MD5_PASSWORD)}</Password>
    </Security>
  </Header>
  <Body>
    <NewRx>
      <Prescriber>
        <Identification>
          <NPI>${escapeXml(prescriber?.npi || '')}</NPI>
          <DEA>${escapeXml(prescriber?.dea || '')}</DEA>
          <StateLicense>${escapeXml(prescriber?.stateLicense || prescriber?.state_license || '')}</StateLicense>
        </Identification>
        <Name>
          <LastName>${escapeXml(prescriber?.lastName || prescriber?.last_name || '')}</LastName>
          <FirstName>${escapeXml(prescriber?.firstName || prescriber?.first_name || '')}</FirstName>
        </Name>
        <Phone>
          <Number>${escapeXml(prescriber?.phone || '')}</Number>
        </Phone>
        <Fax>
          <Number>${escapeXml(prescriber?.fax || '')}</Number>
        </Fax>
      </Prescriber>
      <Patient>
        <Name>
          <LastName>${escapeXml(patient.lastName || patient.last_name || '')}</LastName>
          <FirstName>${escapeXml(patient.firstName || patient.first_name || '')}</FirstName>
        </Name>
        <DateOfBirth>${escapeXml(dateOfBirth)}</DateOfBirth>
        <Gender>${escapeXml(patient.gender || 'U')}</Gender>
        <Address>
          <AddressLine1>${escapeXml(patient.address?.addressLine1 || patient.address_line_1 || '')}</AddressLine1>
          <City>${escapeXml(patient.address?.city || '')}</City>
          <State>${escapeXml(patient.address?.state || '')}</State>
          <ZipCode>${escapeXml(patient.address?.zip || patient.address?.zipCode || '')}</ZipCode>
        </Address>
        <Phone>
          <Number>${escapeXml(patient.phone || '')}</Number>
        </Phone>
      </Patient>
      <MedicationPrescribed>
        <DrugDescription>${escapeXml(prescription.drugName || prescription.drug_name || '')}</DrugDescription>
        <DrugCode>${escapeXml(prescription.drugCode || prescription.drug_code || '')}</DrugCode>
        <Strength>${escapeXml(prescription.strength || '')}</Strength>
        <Quantity>
          <Value>${escapeXml(prescription.quantity || '')}</Value>
          <Unit>${escapeXml(prescription.quantityUnit || prescription.quantity_unit || 'EA')}</Unit>
        </Quantity>
        <Directions>${escapeXml(prescription.directions || '')}</Directions>
        <Refills>
          <RefillNumber>${escapeXml(prescription.refills || '0')}</RefillNumber>
        </Refills>
        <DAW>${escapeXml(prescription.daw || 'N')}</DAW>
      </MedicationPrescribed>
      <Pharmacy>
        <NCPDP>${escapeXml(prescription.ncpdp || '')}</NCPDP>
        <PharmacyName>${escapeXml(prescription.pharmacyName || prescription.pharmacy_name || '')}</PharmacyName>
        <Phone>${escapeXml(prescription.pharmacyPhone || prescription.pharmacy_phone || '')}</Phone>
      </Pharmacy>
    </NewRx>
  </Body>
</SCRIPT>`;

  return xml;
}

/**
 * Transmit prescription to WENO via SOAP PostRx
 * Per WOL EHR API documentation (Step 13, pages 20-24)
 */
async function transmitToWeno(xml, prescriptionId) {
  const endpoint = WENO_ENDPOINTS[WENO_MODE] || WENO_ENDPOINTS.TEST;
  const base64Xml = Buffer.from(xml, 'utf-8').toString('base64');
  const sentTime = new Date().toISOString();
  const transmissionId = `TX-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  // Build SOAP envelope per PDF page 22
  const soapEnvelope = `<?xml version='1.0' encoding='utf-8'?>
<soap12:Envelope xmlns:xsi='http://www.w3.org/2001/XMLSchema-instance' xmlns:xsd='http://www.w3.org/2001/XMLSchema' xmlns:soap12='http://www.w3.org/2003/05/soap-envelope'>
<soap12:Body>
<WENOOnlinePostRx xmlns='http://tempuri.org/'>
<inputString>
<Message xmlns='https://wenoexchange.com/schema/POSTRX'>
<Header>
<SentTime>${sentTime}</SentTime>
</Header>
<Body>
<PostRxMsg>
<WenoOnlineLocationID>${escapeXml(WENO_LOCATION_ID)}</WenoOnlineLocationID>
<ValidRxMsg>
${base64Xml}
</ValidRxMsg>
</PostRxMsg>
</Body>
</Message>
</inputString>
</WENOOnlinePostRx>
</soap12:Body>
</soap12:Envelope>`;

  try {
    // Make SOAP request to WENO
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/soap+xml; charset=utf-8',
        'SOAPAction': 'http://tempuri.org/WENOOnlinePostRx',
      },
      body: soapEnvelope,
    });

    const responseText = await response.text();

    // Parse IFrameURL from SOAP response
    const iframeUrl = parseIFrameUrlFromSoapResponse(responseText);

    // Store transmission in database
    try {
      await query(
        `INSERT INTO weno_transmissions (transmission_id, prescription_id, xml_payload, status, created_at)
         VALUES ($1, $2, $3, 'SENT', NOW())`,
        [transmissionId, prescriptionId, xml]
      );
    } catch (dbError) {
      console.error('Failed to store transmission in DB:', dbError);
    }

    return {
      transmission_id: transmissionId,
      iframe_url: iframeUrl,
      status: 'SENT',
      raw_response: responseText
    };

  } catch (error) {
    console.error('WENO SOAP request failed:', error);
    
    // Store failed transmission attempt
    try {
      await query(
        `INSERT INTO weno_transmissions (transmission_id, prescription_id, xml_payload, status, error_message, created_at)
         VALUES ($1, $2, $3, 'FAILED', $4, NOW())`,
        [transmissionId, prescriptionId, xml, error.message]
      );
    } catch (dbError) {
      console.error('Failed to store failed transmission in DB:', dbError);
    }

    throw new Error(`WENO transmission failed: ${error.message}`);
  }
}

/**
 * Build RxLog URL with AES-256-CBC encrypted credentials
 * Per WOL EHR API documentation (Step 12, pages 17-19)
 */
function buildRxlogUrl(userEmail, md5Password) {
  // Create JSON credential object
  const credentialJson = JSON.stringify({
    UserEmail: userEmail || WENO_PARTNER_ID,
    MD5Password: md5Password || WENO_MD5_PASSWORD
  });

  // Derive AES key from SHA256 of EZ key (first 32 bytes)
  const keyHash = crypto.createHash('sha256').update(WENO_EZ_KEY).digest();
  const aesKey = keyHash.slice(0, 32); // First 32 bytes
  const iv = Buffer.alloc(16, 0); // 16 null bytes for CBC

  // Encrypt with AES-256-CBC
  const cipher = crypto.createCipheriv('aes-256-cbc', aesKey, iv);
  let encrypted = cipher.update(credentialJson, 'utf8', 'base64');
  encrypted += cipher.final('base64');

  // URL encode the Base64 string
  const encodedData = encodeURIComponent(encrypted);

  // Build final URL
  const baseUrl = 'https://online.wenoexchange.com/en/EPCS/RxLog';
  return `${baseUrl}?useremail=${encodeURIComponent(userEmail || WENO_PARTNER_ID)}&data=${encodedData}`;
}

/**
 * Parse IFrameURL from SOAP response
 * Per WOL EHR API documentation (page 23)
 */
function parseIFrameUrlFromSoapResponse(soapResponse) {
  try {
    // Extract IFrameURL from SOAP response body
    // Response format: <IFrameURL>https://test.wenoexchange.com/en/newrx/reviewrx?token=...</IFrameURL>
    const iframeUrlMatch = soapResponse.match(/<IFrameURL>([^<]+)<\/IFrameURL>/i);
    
    if (iframeUrlMatch && iframeUrlMatch[1]) {
      return iframeUrlMatch[1].trim();
    }

    // Also try to find in any namespace format
    const anyIframeMatch = soapResponse.match(/IFrameURL[^>]*>([^<]+)</i);
    if (anyIframeMatch && anyIframeMatch[1]) {
      return anyIframeMatch[1].trim();
    }

    console.warn('Could not parse IFrameURL from SOAP response');
    return null;

  } catch (error) {
    console.error('Error parsing IFrameURL from SOAP response:', error);
    return null;
  }
}

/**
 * Format date for NCPDP SCRIPT (YYYY-MM-DD)
 */
function formatNCPDPDate(dateStr) {
  if (!dateStr) return '';
  // Expecting YYYY-MM-DD format already
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    return dateStr;
  }
  // Try to parse and format
  try {
    const date = new Date(dateStr);
    return date.toISOString().split('T')[0];
  } catch {
    return dateStr;
  }
}

function escapeXml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}
