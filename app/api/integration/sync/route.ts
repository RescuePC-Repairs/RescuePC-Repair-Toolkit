import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

// INTEGRATION SECRET FOR CROSS-PROJECT COMMUNICATION
const INTEGRATION_SECRET = process.env.AI_INTEGRATION_SECRET;

if (!INTEGRATION_SECRET) {
  throw new Error(
    'CRITICAL: AI_INTEGRATION_SECRET environment variable is required for project integration'
  );
}

// VERIFY INTEGRATION REQUEST
function verifyIntegrationRequest(signature: string, body: string): boolean {
  const expectedSignature = crypto
    .createHmac('sha256', INTEGRATION_SECRET!)
    .update(body, 'utf8')
    .digest('hex');

  return crypto.timingSafeEqual(
    Buffer.from(signature, 'hex'),
    Buffer.from(expectedSignature, 'hex')
  );
}

// INTEGRATION HANDLER FOR BOTH PROJECTS
export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('x-integration-signature');

    if (!signature) {
      return NextResponse.json({ error: 'Missing integration signature' }, { status: 401 });
    }

    // VERIFY REQUEST AUTHENTICITY
    if (!verifyIntegrationRequest(signature, body)) {
      return NextResponse.json({ error: 'Invalid integration signature' }, { status: 401 });
    }

    const data = JSON.parse(body);

    // HANDLE DIFFERENT INTEGRATION TYPES
    switch (data.type) {
      case 'sale_notification':
        // Sync sale data between projects
        await handleSaleSync(data);
        break;

      case 'license_validation':
        // Validate license across projects
        const isValid = await validateLicense(data.licenseKey);
        return NextResponse.json({ valid: isValid });

      case 'customer_sync':
        // Sync customer data
        await handleCustomerSync(data);
        break;

      default:
        return NextResponse.json({ error: 'Unknown integration type' }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Integration sync error:', error);
    return NextResponse.json({ error: 'Integration failed' }, { status: 500 });
  }
}

// SALE SYNCHRONIZATION
async function handleSaleSync(data: any) {
  // Add your sale sync logic here
  console.log('🔄 Syncing sale data between projects:', data);

  // Example: Update customer database, sync inventory, etc.
}

// LICENSE VALIDATION
async function validateLicense(licenseKey: string): Promise<boolean> {
  // Add your license validation logic here
  const isValid = licenseKey.startsWith('RPCR-') && licenseKey.length >= 20;
  console.log('🔍 Validating license:', licenseKey, 'Valid:', isValid);
  return isValid;
}

// CUSTOMER SYNCHRONIZATION
async function handleCustomerSync(data: any) {
  // Add your customer sync logic here
  console.log('👤 Syncing customer data:', data);
}
