// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { z } from 'zod';
import { prisma } from './prisma';

// Email validation schema
export const emailSchema = z
  .string()
  .email('Please enter a valid email address')
  .min(1, 'Email is required');

// Name validation schema
export const nameSchema = z
  .string()
  .min(2, 'Name must be at least 2 characters')
  .max(100, 'Name must be less than 100 characters')
  .regex(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces');

// License key validation schema
export const licenseKeySchema = z
  .string()
  .min(10, 'License key must be at least 10 characters')
  .max(50, 'License key must be less than 50 characters')
  .regex(/^[A-Z0-9-]+$/, 'License key can only contain uppercase letters, numbers, and hyphens');

// Contact form validation schema
export const contactFormSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters'),
  email: emailSchema,
  message: z
    .string()
    .min(10, 'Message must be at least 10 characters')
    .max(1000, 'Message must be less than 1000 characters'),
  subject: z.string().optional()
});

// License purchase validation schema
export const licensePurchaseSchema = z.object({
  licenseId: z.string().min(1, 'License ID is required'),
  priceId: z.string().min(1, 'Price ID is required'),
  successUrl: z.string().url('Success URL must be a valid URL'),
  cancelUrl: z.string().url('Cancel URL must be a valid URL')
});

// Newsletter signup validation schema
export const newsletterSignupSchema = z.object({
  email: emailSchema,
  name: z.string().optional()
});

// Validation functions
export function validateEmail(email: string): {
  isValid: boolean;
  error?: string;
  sanitizedValue?: string;
} {
  try {
    const sanitizedEmail = sanitizeEmail(email);
    emailSchema.parse(sanitizedEmail);
    return { isValid: true, sanitizedValue: sanitizedEmail };
  } catch (error) {
    if (error instanceof z.ZodError && error.errors?.[0]?.message) {
      return { isValid: false, error: error.errors[0].message };
    }
    return { isValid: false, error: 'Invalid email format' };
  }
}

export function validateName(name: string): {
  isValid: boolean;
  error?: string;
  sanitizedValue?: string;
} {
  try {
    const sanitizedName = sanitizeString(name);
    nameSchema.parse(sanitizedName);
    return { isValid: true, sanitizedValue: sanitizedName };
  } catch (error) {
    if (error instanceof z.ZodError && error.errors?.[0]?.message) {
      return { isValid: false, error: error.errors[0].message };
    }
    return { isValid: false, error: 'Invalid name format' };
  }
}

export function validateLicenseKey(licenseKey: string): { isValid: boolean; error?: string } {
  try {
    licenseKeySchema.parse(licenseKey);
    return { isValid: true };
  } catch (error) {
    if (error instanceof z.ZodError && error.errors?.[0]?.message) {
      return { isValid: false, error: error.errors[0].message };
    }
    return { isValid: false, error: 'Invalid license key format' };
  }
}

export function validateContactForm(data: any): {
  isValid: boolean;
  errors?: Record<string, string>;
} {
  try {
    contactFormSchema.parse(data);
    return { isValid: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string> = {};
      error.errors.forEach((err) => {
        if (err.path) {
          errors[err.path[0] as string] = err.message;
        }
      });
      return { isValid: false, errors };
    }
    return { isValid: false, errors: { general: 'Validation failed' } };
  }
}

export function validateLicensePurchase(data: any): {
  isValid: boolean;
  errors?: Record<string, string>;
} {
  try {
    licensePurchaseSchema.parse(data);
    return { isValid: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string> = {};
      error.errors.forEach((err) => {
        if (err.path) {
          errors[err.path[0] as string] = err.message;
        }
      });
      return { isValid: false, errors };
    }
    return { isValid: false, errors: { general: 'Validation failed' } };
  }
}

// Sanitization functions
export function sanitizeString(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/[&]/g, '&amp;') // Escape ampersands
    .replace(/["]/g, '&quot;') // Escape quotes
    .replace(/[']/g, '&#x27;'); // Escape apostrophes
}

export function sanitizeInput(input: string): string {
  return sanitizeString(input);
}

export function sanitizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function sanitizeLicenseKey(licenseKey: string): string {
  return licenseKey
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9-]/g, '');
}

// Type exports
export type ContactFormData = z.infer<typeof contactFormSchema>;
export type LicensePurchaseData = z.infer<typeof licensePurchaseSchema>;
export type NewsletterSignupData = z.infer<typeof newsletterSignupSchema>;

// Rate limiting helper
export function createRateLimiter(maxRequests: number, windowMs: number) {
  const requests = new Map<string, number[]>();

  return function isRateLimited(identifier: string): boolean {
    const now = Date.now();
    const userRequests = requests.get(identifier) || [];

    // Remove old requests outside the window
    const validRequests = userRequests.filter((time) => now - time < windowMs);

    if (validRequests.length >= maxRequests) {
      return true; // Rate limited
    }

    // Add current request
    validRequests.push(now);
    requests.set(identifier, validRequests);

    return false; // Not rate limited
  };
}

interface LicenseValidationResult {
  isValid: boolean;
  message: string;
  pcCount: number;
  remainingActivations: number;
}

const LICENSE_LIMITS = {
  basic: 1,
  professional: 5,
  enterprise: 25,
  government: 100,
  lifetime: Number.POSITIVE_INFINITY
} as const;

export type LicenseType = keyof typeof LICENSE_LIMITS;

export async function validateLicense(
  licenseKey: string,
  type: LicenseType
): Promise<LicenseValidationResult> {
  try {
    const license = await prisma.license.findUnique({
      where: { id: licenseKey },
      include: { activations: true }
    });

    if (!license) {
      return {
        isValid: false,
        message: 'Invalid license key',
        pcCount: 0,
        remainingActivations: 0
      };
    }

    if (license.status !== 'active') {
      return {
        isValid: false,
        message: 'License is not active',
        pcCount: 0,
        remainingActivations: 0
      };
    }

    const maxPCs = LICENSE_LIMITS[type];
    const currentActivations = license.activations.length;
    const remaining = maxPCs - currentActivations;

    return {
      isValid: remaining > 0,
      message: remaining > 0 ? 'License is valid' : 'Maximum PC count reached',
      pcCount: currentActivations,
      remainingActivations: remaining
    };
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('License validation failed:', error.message);
    } else {
      console.error('License validation failed:', error);
    }
    throw new Error('Failed to validate license');
  }
}

export async function activateLicense(licenseKey: string, pcIdentifier: string): Promise<boolean> {
  try {
    const validation = await validateLicense(licenseKey, 'basic'); // Default to basic for safety

    if (!validation.isValid) {
      return false;
    }

    await prisma.licenseActivation.create({
      data: {
        licenseId: licenseKey,
        pcIdentifier,
        activatedAt: new Date()
      }
    });

    return true;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('License activation failed:', error.message);
    } else {
      console.error('License activation failed:', error);
    }
    return false;
  }
}

// File validation functions
export function validateFileType(
  filename: string | null | undefined,
  mimeType: string,
  allowedTypes: string[] = defaultFileConfig.allowedTypes
): boolean {
  if (!filename || !mimeType) return false;

  try {
    const extension = filename.split('.').pop()?.toLowerCase();
    const allowedExtensions = defaultFileConfig.allowedExtensions[mimeType];
    return (
      (allowedTypes.includes(mimeType) && allowedExtensions?.includes(extension || '')) || false
    );
  } catch (error) {
    return false;
  }
}

export function validateFileSize(size: number): boolean {
  if (size < 0 || isNaN(size)) return false;
  return size <= defaultFileConfig.maxFileSize;
}

export function validateFileContent(
  content: Buffer | null | undefined,
  declaredType: string
): boolean {
  if (!content) return false;

  const magicNumbers: Record<string, string[]> = {
    'application/pdf': ['25504446'],
    'image/jpeg': ['FFD8FF'],
    'image/png': ['89504E47'],
    'image/gif': ['47494638'],
    'image/webp': ['52494646'],
    'text/plain': [''],
    'application/json': [''],
    'text/html': [''],
    'text/css': [''],
    'application/javascript': [''],
    'text/javascript': [''],
    'application/xml': [''],
    'text/xml': [''],
    'application/zip': ['504B0304', '504B0506', '504B0708'],
    'application/x-zip-compressed': ['504B0304', '504B0506', '504B0708'],
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['504B0304'],
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['504B0304'],
    'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['504B0304']
  };

  try {
    const magic = content.toString('hex').toUpperCase().slice(0, 8);
    return magicNumbers[declaredType]?.some((m) => magic.startsWith(m)) ?? false;
  } catch (error) {
    return false;
  }
}
