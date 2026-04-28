import { NextResponse } from 'next/server';
import { query } from '../db';

const WENO_WHITELIST_IPS = ['20.225.173.129', '4.151.83.96'];

const XML_STATUS_RESPONSE = '<?xml version="1.0" encoding="UTF-8"?><Status>001</Status>';

function getClientIp(request) {
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }
  return request.headers.get('x-real-ip') || 'unknown';
}

async function updatePrescriptionStatus(prescriptionId, status, metadata = {}) {
  const allowedStatuses = ['pending', 'verified', 'filled', 'cancelled', 'renewed'];
  const normalizedStatus = allowedStatuses.includes(status) ? status : 'pending';

  const queryText = `
    UPDATE prescriptions
    SET status = $1, updated_at = NOW()
    WHERE external_id = $2
    RETURNING id
  `;

  try {
    const result = await query(queryText, [normalizedStatus, prescriptionId]);
    if (result.rowCount === 0) {
      console.warn(`Prescription not found for external_id: ${prescriptionId}`);
    }
    return result;
  } catch (error) {
    console.error(`Error updating prescription ${prescriptionId}:`, error);
    throw error;
  }
}

async function handleCallback(callbackType, payload) {
  switch (callbackType) {
    case 'Status':
    case 'Verify':
      if (payload.prescriptionId) {
        await updatePrescriptionStatus(payload.prescriptionId, 'verified', payload);
      }
      break;

    case 'RxFill':
      if (payload.prescriptionId) {
        await updatePrescriptionStatus(payload.prescriptionId, 'filled', payload);
      }
      break;

    case 'CancelRxResponse':
      if (payload.prescriptionId) {
        await updatePrescriptionStatus(payload.prescriptionId, 'cancelled', payload);
      }
      break;

    case 'RxRenewalRequest':
      if (payload.prescriptionId) {
        await updatePrescriptionStatus(payload.prescriptionId, 'pending', payload);
      }
      break;

    default:
      console.log(`Unhandled callback type: ${callbackType}`);
  }
}

function parseXmlPayload(xmlString) {
  const result = {};

  const prescriptionIdMatch = xmlString.match(/<PrescriptionID>(\d+)<\/PrescriptionID>/);
  if (prescriptionIdMatch) {
    result.prescriptionId = prescriptionIdMatch[1];
  }

  const statusMatch = xmlString.match(/<Status>(\w+)<\/Status>/);
  if (statusMatch) {
    result.status = statusMatch[1];
  }

  const rxNumberMatch = xmlString.match(/<RxNumber>(\w+)<\/RxNumber>/);
  if (rxNumberMatch) {
    result.rxNumber = rxNumberMatch[1];
  }

  const errorCodeMatch = xmlString.match(/<ErrorCode>(\w+)<\/ErrorCode>/);
  if (errorCodeMatch) {
    result.errorCode = errorCodeMatch[1];
  }

  const messageMatch = xmlString.match(/<Message>([^<]+)<\/Message>/);
  if (messageMatch) {
    result.message = messageMatch[1];
  }

  return result;
}

export async function POST(request) {
  const clientIp = getClientIp(request);

  console.log(`Weno webhook received from IP: ${clientIp}`);

  if (!WENO_WHITELIST_IPS.includes(clientIp)) {
    console.warn(`Blocked request from non-whitelisted IP: ${clientIp}`);
    return new NextResponse(XML_STATUS_RESPONSE, {
      headers: { 'Content-Type': 'application/xml' },
      status: 403,
    });
  }

  try {
    const xmlString = await request.text();

    console.log('Weno webhook payload:', xmlString);

    const callbackMatch = xmlString.match(/<CallbackType>(\w+)<\/CallbackType>/);
    if (!callbackMatch) {
      console.error('No CallbackType found in payload');
      return new NextResponse(XML_STATUS_RESPONSE, {
        headers: { 'Content-Type': 'application/xml' },
        status: 200,
      });
    }

    const callbackType = callbackMatch[1];
    const payload = parseXmlPayload(xmlString);

    await handleCallback(callbackType, payload);

    return new NextResponse(XML_STATUS_RESPONSE, {
      headers: { 'Content-Type': 'application/xml' },
      status: 200,
    });

  } catch (error) {
    console.error('Weno webhook error:', error);
    return new NextResponse(XML_STATUS_RESPONSE, {
      headers: { 'Content-Type': 'application/xml' },
      status: 200,
    });
  }
}

export async function GET(request) {
  return new NextResponse(XML_STATUS_RESPONSE, {
    headers: { 'Content-Type': 'application/xml' },
    status: 200,
  });
}
