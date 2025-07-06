import { NextRequest, NextResponse } from 'next/server';
import { validateLicense } from '@/utils/license';
import crypto from 'crypto';

interface LicenseData {
  licenseKey: string;
  userEmail: string;
  licenseType: string;
  purchaseDate: string;
  expiryDate: string | null;
  status: 'active' | 'expired' | 'revoked';
  stripeSessionId: string;
  assignedTo?: string; // For enterprise employees
}

// Mock license database - replace with your actual storage
const mockLicenses: Record<string, LicenseData> = {
  'RPC-1234-5678-9ABC': {
    licenseKey: 'RPC-1234-5678-9ABC',
    userEmail: 'user@example.com',
    licenseType: 'individual',
    purchaseDate: '2024-01-01T00:00:00Z',
    expiryDate: '2025-01-01T00:00:00Z',
    status: 'active',
    stripeSessionId: 'cs_test_123'
  },
  'EMP-ENT-4FA121C1-ABC12345-1234567890': {
    licenseKey: 'EMP-ENT-4FA121C1-ABC12345-1234567890',
    userEmail: 'employee@company.com',
    licenseType: 'enterprise',
    purchaseDate: '2024-01-01T00:00:00Z',
    expiryDate: '2025-01-01T00:00:00Z',
    status: 'active',
    stripeSessionId: 'cs_test_456',
    assignedTo: 'employee@company.com'
  },
  'RescuePC-2025': {
    licenseKey: 'RescuePC-2025',
    userEmail: 'admin@company.com',
    licenseType: 'unlimited',
    purchaseDate: '2024-01-01T00:00:00Z',
    expiryDate: null, // Lifetime
    status: 'active',
    stripeSessionId: 'cs_test_789'
  }
};

interface License {
  key: string;
  type: 'basic' | 'professional' | 'enterprise' | 'government';
  email: string;
  issuedAt: string;
  expiresAt: string;
  features: string[];
}

// validateLicense function moved to utils/license.ts

function isValidLicenseFormat(key: string): boolean {
  // License key format: RESCUE-XXXXXXXX-XXXXXXXXXX
  const licensePattern = /^RESCUE-[A-F0-9]{8}-[0-9]{10}$/;
  return licensePattern.test(key);
}

function getExpirationDate(type: string): string {
  const now = new Date();
  switch (type) {
    case 'basic':
      now.setFullYear(now.getFullYear() + 1); // 1 year
      break;
    case 'professional':
      now.setFullYear(now.getFullYear() + 2); // 2 years
      break;
    case 'enterprise':
    case 'government':
      now.setFullYear(now.getFullYear() + 5); // 5 years
      break;
    default:
      throw new Error('Invalid license type');
  }
  return now.toISOString();
}

function getFeaturesForType(type: string): string[] {
  switch (type) {
    case 'basic':
      return ['core_functionality', 'basic_support', 'updates_1_year'];
    case 'professional':
      return [
        'core_functionality',
        'priority_support',
        'updates_2_years',
        'advanced_features',
        'api_access'
      ];
    case 'enterprise':
      return [
        'core_functionality',
        'dedicated_support',
        'updates_5_years',
        'advanced_features',
        'api_access',
        'custom_integration',
        'sla_guarantee'
      ];
    case 'government':
      return [
        'core_functionality',
        'dedicated_support',
        'updates_5_years',
        'advanced_features',
        'api_access',
        'custom_integration',
        'sla_guarantee',
        'compliance_features',
        'audit_logging'
      ];
    default:
      throw new Error('Invalid license type');
  }
}

async function storeLicense(license: License): Promise<void> {
  // Implementation for storing license in database
  // This would typically use a database like MongoDB or PostgreSQL
  console.log('Storing license:', license);
}

export async function POST(request: NextRequest) {
  try {
    const { key, type, email } = await request.json();
    const license = await validateLicense({ key, type, email });

    return NextResponse.json({ license });
  } catch (error) {
    return NextResponse.json({ error: 'License validation failed' }, { status: 400 });
  }
}

// GET endpoint for checking license status
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const licenseKey = searchParams.get('key');

    if (!licenseKey) {
      return NextResponse.json({ error: 'License key parameter is required' }, { status: 400 });
    }

    // Check if license exists in mock database
    const license = mockLicenses[licenseKey];
    
    if (!license) {
      return NextResponse.json(
        {
          valid: false,
          error: 'License not found',
          code: 'LICENSE_NOT_FOUND'
        },
        { status: 404 }
      );
    }

    // Check if license is expired
    if (license.expiryDate && new Date(license.expiryDate) < new Date()) {
      return NextResponse.json(
        {
          valid: false,
          error: 'License expired',
          code: 'LICENSE_EXPIRED'
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      valid: true,
      license: {
        key: license.licenseKey,
        type: license.licenseType,
        email: license.userEmail,
        status: license.status,
        features: getFeaturesForLicenseType(license.licenseType)
      }
    });
  } catch (error) {
    console.error('License validation error:', error);
    return NextResponse.json(
      {
        valid: false,
        error: 'Internal server error',
        code: 'SERVER_ERROR'
      },
      { status: 500 }
    );
  }
}

function getFeaturesForLicenseType(licenseType: string): string[] {
  switch (licenseType) {
    case 'basic':
      return ['System Health Check', 'Basic Repairs', 'Standard Support'];
    case 'professional':
      return ['All Basic Features', 'Driver Management', 'Advanced Repairs', 'Priority Support'];
    case 'enterprise':
      return [
        'All Professional Features',
        'Military Security',
        'Compliance Tools',
        'White-label Options'
      ];
    case 'unlimited':
      return ['Complete Toolkit', 'All Features', 'Lifetime Updates', 'Unlimited Support'];
    default:
      return ['Basic Features'];
  }
}
