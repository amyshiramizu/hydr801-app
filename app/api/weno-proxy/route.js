import { NextResponse } from 'next/server';

const WENO_ENDPOINT = 'https://test.wenoexchange.com/webapi/wenoonline.asmx';
const SOAP_ACTIONS = {
  send_newrx: 'http://www.weno.com/webservices/send_newrx',
  send_cancelrx: 'http://www.weno.com/webservices/send_cancelrx',
  get_rxlog_iframe: 'http://www.weno.com/webservices/get_rxlog_iframe',
  test_newrx: 'http://www.weno.com/webservices/test_newrx',
};

/**
 * Encodes special characters to HTML entities for XML/SOAP payloads
 */
function htmlEntityEncode(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Parses IFrame URL from SOAP response
 */
function parseIFrameURL(soapResponse) {
  if (!soapResponse) return null;
  
  // Try to extract URL from various XML patterns
  const patterns = [
    /<IFrameURL[^>]*>([^<]*)<\/IFrameURL>/i,
    /<iframe[^>]*src=["']([^"']*)["'][^>]*>/i,
    /<URL>([^<]*)<\/URL>/i,
    /<iframeurl>([^<]*)<\/iframeurl>/i,
  ];

  for (const pattern of patterns) {
    const match = soapResponse.match(pattern);
    if (match && match[1]) {
      return match[1].trim();
    }
  }

  // Try JSON response pattern
  try {
    const jsonMatch = soapResponse.match(/"IFrameURL"\s*:\s*"([^"]*)"/);
    if (jsonMatch && jsonMatch[1]) {
      return jsonMatch[1];
    }
  } catch {
    // Ignore JSON parsing errors
  }

  return null;
}

/**
 * Creates a SOAP 1.2 envelope with the given body
 */
function createSOAPEnvelope(action, body) {
  const soapAction = SOAP_ACTIONS[action] || action;
  
  return `<?xml version="1.0" encoding="utf-8"?>
<soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">
  <soap12:Header>
    <Action xmlns="http://www.w3.org/2003/05/soap-envelope">${htmlEntityEncode(soapAction)}</Action>
  </soap12:Header>
  <soap12:Body>
    ${body}
  </soap12:Body>
</soap12:Envelope>`;
}

/**
 * Extracts content from SOAP response body
 */
function extractSOAPBody(responseText) {
  // Remove XML declaration and soap envelope wrappers
  let body = responseText;
  
  // Remove XML declaration
  body = body.replace(/<\?xml[^?]*\?>/gi, '');
  
  // Extract body content between soap:Body tags (SOAP 1.2)
  const bodyMatch = body.match(/<soap12:Body[^>]*>([\s\S]*)<\/soap12:Body>/i) ||
                    body.match(/<soap:Body[^>]*>([\s\S]*)<\/soap:Body>/i) ||
                    body.match(/<Body[^>]*>([\s\S]*)<\/Body>/i);
  
  if (bodyMatch && bodyMatch[1]) {
    body = bodyMatch[1];
  }
  
  return body.trim();
}

/**
 * Handles NewRx request
 */
async function handleNewRx(payload) {
  const { RxString, DentistID, PatientID, PatientFirstName, PatientLastName, 
          DrugName, DrugQuantity, DrugStrength, DrugForm, Directions, 
          RefillsAllowed, DAW, PON, DOB, Phone, Email, Address1, Address2, 
          City, State, Zip, Notes } = payload;

  const body = `
    <send_newrx xmlns="http://www.weno.com/webservices/">
      <RxString>${htmlEntityEncode(RxString || '')}</RxString>
      <DentistID>${htmlEntityEncode(DentistID || '')}</DentistID>
      <PatientID>${htmlEntityEncode(PatientID || '')}</PatientID>
      <PatientFirstName>${htmlEntityEncode(PatientFirstName || '')}</PatientFirstName>
      <PatientLastName>${htmlEntityEncode(PatientLastName || '')}</PatientLastName>
      <DrugName>${htmlEntityEncode(DrugName || '')}</DrugName>
      <DrugQuantity>${htmlEntityEncode(DrugQuantity || '')}</DrugQuantity>
      <DrugStrength>${htmlEntityEncode(DrugStrength || '')}</DrugStrength>
      <DrugForm>${htmlEntityEncode(DrugForm || '')}</DrugForm>
      <Directions>${htmlEntityEncode(Directions || '')}</Directions>
      <RefillsAllowed>${htmlEntityEncode(RefillsAllowed || '')}</RefillsAllowed>
      <DAW>${htmlEntityEncode(DAW || '')}</DAW>
      <PON>${htmlEntityEncode(PON || '')}</PON>
      <DOB>${htmlEntityEncode(DOB || '')}</DOB>
      <Phone>${htmlEntityEncode(Phone || '')}</Phone>
      <Email>${htmlEntityEncode(Email || '')}</Email>
      <Address1>${htmlEntityEncode(Address1 || '')}</Address1>
      <Address2>${htmlEntityEncode(Address2 || '')}</Address2>
      <City>${htmlEntityEncode(City || '')}</City>
      <State>${htmlEntityEncode(State || '')}</State>
      <Zip>${htmlEntityEncode(Zip || '')}</Zip>
      <Notes>${htmlEntityEncode(Notes || '')}</Notes>
    </send_newrx>`;

  return createSOAPEnvelope('send_newrx', body);
}

/**
 * Handles CancelRx request
 */
async function handleCancelRx(payload) {
  const { RxNumber, Reason, DentistID, CancelDate } = payload;

  const body = `
    <send_cancelrx xmlns="http://www.weno.com/webservices/">
      <RxNumber>${htmlEntityEncode(RxNumber || '')}</RxNumber>
      <Reason>${htmlEntityEncode(Reason || '')}</Reason>
      <DentistID>${htmlEntityEncode(DentistID || '')}</DentistID>
      <CancelDate>${htmlEntityEncode(CancelDate || '')}</CancelDate>
    </send_cancelrx>`;

  return createSOAPEnvelope('send_cancelrx', body);
}

/**
 * Handles GetRxLogIFrame request
 */
async function handleGetRxLogIFrame(payload) {
  const { DentistID, StartDate, EndDate, Status, PageSize, PageIndex } = payload;

  const body = `
    <get_rxlog_iframe xmlns="http://www.weno.com/webservices/">
      <DentistID>${htmlEntityEncode(DentistID || '')}</DentistID>
      <StartDate>${htmlEntityEncode(StartDate || '')}</StartDate>
      <EndDate>${htmlEntityEncode(EndDate || '')}</EndDate>
      <Status>${htmlEntityEncode(Status || '')}</Status>
      <PageSize>${htmlEntityEncode(PageSize || '')}</PageSize>
      <PageIndex>${htmlEntityEncode(PageIndex || '')}</PageIndex>
    </get_rxlog_iframe>`;

  return createSOAPEnvelope('get_rxlog_iframe', body);
}

/**
 * Handles TestNewRx request
 */
async function handleTestNewRx(payload) {
  const { DentistID } = payload;

  const body = `
    <test_newrx xmlns="http://www.weno.com/webservices/">
      <DentistID>${htmlEntityEncode(DentistID || '')}</DentistID>
    </test_newrx>`;

  return createSOAPEnvelope('test_newrx', body);
}

/**
 * Sends SOAP request to Weno endpoint
 */
async function sendToWeno(soapEnvelope, action) {
  const soapAction = SOAP_ACTIONS[action] || action;

  const response = await fetch(WENO_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/soap+xml; charset=utf-8',
      'SOAPAction': soapAction,
      'Accept': 'application/soap+xml, text/xml',
    },
    body: soapEnvelope,
  });

  const responseText = await response.text();
  
  return {
    status: response.status,
    statusText: response.statusText,
    headers: Object.fromEntries(response.headers.entries()),
    body: responseText,
    extractedBody: extractSOAPBody(responseText),
    iframeUrl: parseIFrameURL(responseText),
  };
}

/**
 * POST handler for all SOAP operations
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const { action, ...payload } = body;

    if (!action) {
      return NextResponse.json(
        { success: false, error: 'Missing required field: action' },
        { status: 400 }
      );
    }

    let soapEnvelope;
    
    switch (action) {
      case 'send_newrx':
        soapEnvelope = await handleNewRx(payload);
        break;
      case 'send_cancelrx':
        soapEnvelope = await handleCancelRx(payload);
        break;
      case 'get_rxlog_iframe':
        soapEnvelope = await handleGetRxLogIFrame(payload);
        break;
      case 'test_newrx':
        soapEnvelope = await handleTestNewRx(payload);
        break;
      case 'raw':
        // Allow sending raw SOAP envelope directly
        soapEnvelope = payload.xml;
        break;
      default:
        return NextResponse.json(
          { 
            success: false, 
            error: `Unknown action: ${action}`,
            validActions: Object.keys(SOAP_ACTIONS)
          },
          { status: 400 }
        );
    }

    const result = await sendToWeno(soapEnvelope, action);

    return NextResponse.json({
      success: result.status >= 200 && result.status < 300,
      action,
      endpoint: WENO_ENDPOINT,
      response: {
        status: result.status,
        statusText: result.statusText,
        body: result.body,
        extractedBody: result.extractedBody,
        iframeUrl: result.iframeUrl,
      },
    });

  } catch (error) {
    console.error('Weno proxy error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

/**
 * GET handler - returns service info
 */
export async function GET() {
  return NextResponse.json({
    service: 'Weno SOAP Proxy',
    endpoint: WENO_ENDPOINT,
    version: '1.0',
    availableActions: Object.keys(SOAP_ACTIONS),
    actions: SOAP_ACTIONS,
    documentation: {
      send_newrx: 'Sends a new prescription to Weno',
      send_cancelrx: 'Cancels an existing prescription',
      get_rxlog_iframe: 'Retrieves prescription log iframe URL',
      test_newrx: 'Tests connectivity with NewRx action',
    },
  });
}
