import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { NextRequest } from 'next/server';
import Stripe from 'stripe';

// Mock Stripe
jest.mock('stripe');

// Mock nodemailer
jest.mock('nodemailer', () => ({
  createTransporter: jest.fn(() => ({
    sendMail: jest.fn().mockResolvedValue({ messageId: 'test-message-id' })
  }))
}));

describe('Fortune 500 Automation System', () => {
  let mockStripe: jest.Mocked<Stripe>;

  beforeEach(() => {
    // Reset environment variables
    process.env.STRIPE_SECRET_KEY = 'sk_test_fortune500';
    process.env.STRIPE_WEBHOOK_SECRET = 'whsec_fortune500';
    process.env.SUPPORT_EMAIL = 'support@rescuepcrepairs.com';
    process.env.GMAIL_APP_PASSWORD = 'fortune500_password';
    process.env.BUSINESS_EMAIL = 'tyler@rescuepcrepairs.com';
    process.env.PCLOUD_DOWNLOAD_LINK = 'https://pcloud.com/fortune500/download';

    // Mock Stripe instance
    mockStripe = {
      webhooks: {
        constructEvent: jest.fn()
      },
      customers: {
        retrieve: jest.fn()
      },
      checkout: {
        sessions: {
          listLineItems: jest.fn()
        }
      }
    } as any;

    (Stripe as jest.MockedClass<typeof Stripe>).mockImplementation(() => mockStripe);
  });

  describe('Real Customer Data Processing', () => {
    it('should extract real customer email from Stripe webhook', async () => {
      // Mock real customer data
      const realCustomerEmail = 'john.doe@gmail.com';
      const realCustomerName = 'John Doe';

      const mockEvent = {
        type: 'checkout.session.completed',
        data: {
          object: {
            id: 'cs_test_fortune500',
            customer_email: realCustomerEmail,
            customer: 'cus_test_fortune500',
            amount_total: 4999 // $49.99
          }
        }
      };

      const mockCustomer = {
        id: 'cus_test_fortune500',
        name: realCustomerName,
        email: realCustomerEmail
      };

      const mockLineItems = {
        data: [
          {
            price: {
              product: {
                id: 'prod_basic_license',
                name: 'Basic License'
              }
            }
          }
        ]
      };

      // Setup mocks
      mockStripe.webhooks.constructEvent.mockReturnValue(mockEvent as any);
      mockStripe.customers.retrieve.mockResolvedValue(mockCustomer as any);
      mockStripe.checkout.sessions.listLineItems.mockResolvedValue(mockLineItems as any);

      // Import the webhook handler
      const { POST } = await import('../app/api/webhook/stripe/route');

      // Create mock request
      const request = new NextRequest('https://rescuepcrepairs.com/api/webhook/stripe', {
        method: 'POST',
        headers: {
          'stripe-signature': 'test_signature'
        },
        body: JSON.stringify(mockEvent)
      });

      // Test the webhook
      const response = await POST(request);
      const result = await response.json();

      // Verify real customer data was processed
      expect(result.success).toBe(true);
      expect(result.customerEmail).toBe(realCustomerEmail);
      expect(result.customerName).toBe(realCustomerName);
      expect(result.licenseCount).toBe(1);
      expect(result.amount).toBe(49.99);
      expect(result.productName).toBe('Basic License');
    });

    it('should handle enterprise customer with multiple licenses', async () => {
      const enterpriseCustomerEmail = 'it.director@fortune500.com';
      const enterpriseCustomerName = 'Sarah Johnson';

      const mockEvent = {
        type: 'checkout.session.completed',
        data: {
          object: {
            id: 'cs_test_enterprise',
            customer_email: enterpriseCustomerEmail,
            customer: 'cus_test_enterprise',
            amount_total: 49999 // $499.99
          }
        }
      };

      const mockCustomer = {
        id: 'cus_test_enterprise',
        name: enterpriseCustomerName,
        email: enterpriseCustomerEmail
      };

      const mockLineItems = {
        data: [
          {
            price: {
              product: {
                id: 'prod_enterprise_license',
                name: 'Enterprise License'
              }
            }
          }
        ]
      };

      mockStripe.webhooks.constructEvent.mockReturnValue(mockEvent as any);
      mockStripe.customers.retrieve.mockResolvedValue(mockCustomer as any);
      mockStripe.checkout.sessions.listLineItems.mockResolvedValue(mockLineItems as any);

      const { POST } = await import('../app/api/webhook/stripe/route');

      const request = new NextRequest('https://rescuepcrepairs.com/api/webhook/stripe', {
        method: 'POST',
        headers: {
          'stripe-signature': 'test_signature'
        },
        body: JSON.stringify(mockEvent)
      });

      const response = await POST(request);
      const result = await response.json();

      // Verify enterprise customer gets 25 licenses
      expect(result.success).toBe(true);
      expect(result.customerEmail).toBe(enterpriseCustomerEmail);
      expect(result.customerName).toBe(enterpriseCustomerName);
      expect(result.licenseCount).toBe(25);
      expect(result.amount).toBe(499.99);
      expect(result.productName).toBe('Enterprise License');
    });

    it('should handle unlimited lifetime enterprise license', async () => {
      const unlimitedCustomerEmail = 'ceo@megaenterprise.com';
      const unlimitedCustomerName = 'Michael Chen';

      const mockEvent = {
        type: 'checkout.session.completed',
        data: {
          object: {
            id: 'cs_test_unlimited',
            customer_email: unlimitedCustomerEmail,
            customer: 'cus_test_unlimited',
            amount_total: 49999 // $499.99
          }
        }
      };

      const mockCustomer = {
        id: 'cus_test_unlimited',
        name: unlimitedCustomerName,
        email: unlimitedCustomerEmail
      };

      const mockLineItems = {
        data: [
          {
            price: {
              product: {
                id: 'prod_lifetime_enterprise',
                name: 'Lifetime Enterprise'
              }
            }
          }
        ]
      };

      mockStripe.webhooks.constructEvent.mockReturnValue(mockEvent as any);
      mockStripe.customers.retrieve.mockResolvedValue(mockCustomer as any);
      mockStripe.checkout.sessions.listLineItems.mockResolvedValue(mockLineItems as any);

      const { POST } = await import('../app/api/webhook/stripe/route');

      const request = new NextRequest('https://rescuepcrepairs.com/api/webhook/stripe', {
        method: 'POST',
        headers: {
          'stripe-signature': 'test_signature'
        },
        body: JSON.stringify(mockEvent)
      });

      const response = await POST(request);
      const result = await response.json();

      // Verify unlimited license
      expect(result.success).toBe(true);
      expect(result.customerEmail).toBe(unlimitedCustomerEmail);
      expect(result.customerName).toBe(unlimitedCustomerName);
      expect(result.licenseCount).toBe(1);
      expect(result.amount).toBe(499.99);
      expect(result.productName).toBe('Lifetime Enterprise');
    });
  });

  describe('Fortune 500 Email Templates', () => {
    it('should generate professional customer email', async () => {
      const { generateCustomerEmail } = await import('../app/api/webhook/stripe/route');

      const email = generateCustomerEmail(
        'John Doe',
        'john.doe@gmail.com',
        ['RPCR-1234-5678-9ABC-DEF0'],
        'Basic License',
        49.99
      );

      expect(email).toContain('Dear John Doe');
      expect(email).toContain('john.doe@gmail.com');
      expect(email).toContain('RPCR-1234-5678-9ABC-DEF0');
      expect(email).toContain('$49.99');
      expect(email).toContain('Basic License');
      expect(email).toContain('Download the RescuePC Repairs toolkit');
      expect(email).toContain('Tyler Keesee');
      expect(email).toContain('Enterprise-Grade PC Repair Solutions');
    });

    it('should generate unlimited license email', async () => {
      const { generateCustomerEmail } = await import('../app/api/webhook/stripe/route');

      const email = generateCustomerEmail(
        'Michael Chen',
        'ceo@megaenterprise.com',
        ['RPCR-UNLIMITED-ACCESS-LIFETIME-LICENSE'],
        'Lifetime Enterprise',
        499.99
      );

      expect(email).toContain('UNLIMITED ACCESS');
      expect(email).toContain('Install on 1, 10, 100, or 1000+ computers');
      expect(email).toContain('RPCR-UNLIMITED-ACCESS-LIFETIME-LICENSE');
      expect(email).toContain('$499.99');
    });

    it('should generate professional admin notification', async () => {
      const { generateAdminNotification } = await import('../app/api/webhook/stripe/route');

      const notification = generateAdminNotification(
        'john.doe@gmail.com',
        'John Doe',
        { name: 'Basic License', licenseCount: 1, type: 'basic', price: 49.99 },
        ['RPCR-1234-5678-9ABC-DEF0'],
        49.99
      );

      expect(notification).toContain('FORTUNE 500 AUTOMATED SALE COMPLETED');
      expect(notification).toContain('john.doe@gmail.com');
      expect(notification).toContain('John Doe');
      expect(notification).toContain('$49.99');
      expect(notification).toContain('RPCR-1234-5678-9ABC-DEF0');
      expect(notification).toContain('Your automated empire just made you money');
    });
  });

  describe('Fortune 500 Security', () => {
    it('should validate environment variables', () => {
      // Test missing environment variables
      delete process.env.STRIPE_SECRET_KEY;

      expect(() => {
        require('../app/api/webhook/stripe/route');
      }).toThrow('CRITICAL: STRIPE_SECRET_KEY environment variable is required');
    });

    it('should verify webhook signature', async () => {
      const mockEvent = {
        type: 'checkout.session.completed',
        data: { object: {} }
      };

      mockStripe.webhooks.constructEvent.mockImplementation(() => {
        throw new Error('Invalid signature');
      });

      const { POST } = await import('../app/api/webhook/stripe/route');

      const request = new NextRequest('https://rescuepcrepairs.com/api/webhook/stripe', {
        method: 'POST',
        headers: {
          'stripe-signature': 'invalid_signature'
        },
        body: JSON.stringify(mockEvent)
      });

      const response = await POST(request);
      const result = await response.json();

      expect(result.error).toBe('Invalid signature');
      expect(response.status).toBe(400);
    });
  });

  describe('Fortune 500 Product Mapping', () => {
    it('should correctly map all product types', async () => {
      const { getLicenseInfo } = await import('../app/api/webhook/stripe/route');

      // Test all product mappings
      expect(getLicenseInfo('prod_basic_license')).toEqual({
        name: 'Basic License',
        licenseCount: 1,
        type: 'basic',
        price: 49.99
      });

      expect(getLicenseInfo('prod_professional_license')).toEqual({
        name: 'Professional License',
        licenseCount: 5,
        type: 'professional',
        price: 199.99
      });

      expect(getLicenseInfo('prod_enterprise_license')).toEqual({
        name: 'Enterprise License',
        licenseCount: 25,
        type: 'enterprise',
        price: 499.99
      });

      expect(getLicenseInfo('prod_government_license')).toEqual({
        name: 'Government License',
        licenseCount: 100,
        type: 'government',
        price: 999.99
      });

      expect(getLicenseInfo('prod_lifetime_enterprise')).toEqual({
        name: 'Lifetime Enterprise',
        licenseCount: -1,
        type: 'lifetime_enterprise',
        price: 499.99
      });
    });
  });
});
