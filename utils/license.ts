interface License {
  key: string;
  type: 'basic' | 'professional' | 'enterprise' | 'government';
  email: string;
  issuedAt: string;
  expiresAt: string;
  features: string[];
}

export async function validateLicense({
  key,
  type,
  email
}: {
  key: string;
  type: string;
  email: string;
}): Promise<License> {
  // Validate license key format
  if (!isValidLicenseFormat(key)) {
    throw new Error('Invalid license key format');
  }

  // Generate license details
  const license: License = {
    key,
    type: type as License['type'],
    email,
    issuedAt: new Date().toISOString(),
    expiresAt: getExpirationDate(type),
    features: getFeaturesForType(type)
  };

  // Store license in database
  await storeLicense(license);

  return license;
}

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
