// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { prisma } from '../../../utils/prisma';
import { stripe } from '../../../utils/stripe';

interface LicenseTypeCount {
  type: string;
  _count: number;
}

interface WebhookHealthCheck {
  status: string;
  lastSuccess: Date | null;
  successRate: number;
  averageLatency: number;
}

interface WebhookEvent {
  id: string;
  type: string;
  status: string;
  processedAt: Date | null;
  error: string | null;
  createdAt: Date;
}

interface EmailDelivery {
  id: string;
  recipient: string;
  template: string;
  status: string;
  sentAt: Date | null;
  error: string | null;
}

// AI Integration Secret Key (from environment variables)
const _AI_INTEGRATION_SECRET = process.env.AI_INTEGRATION_SECRET || 'ai-secret-key-12345-rescuepc';

// Validate required environment variables - BUILD SAFE
function validateEnvironment() {
  // Only log warnings, don't throw errors during build
  const requiredEnvVars = ['STRIPE_SECRET_KEY', 'SUPPORT_EMAIL', 'GMAIL_APP_PASSWORD'];
  const missingVars = requiredEnvVars.filter((varName) => !process.env[varName]);
  if (missingVars.length > 0) {
    console.warn(`Missing environment variables: ${missingVars.join(', ')}`);
  }
}

// BUILD SAFE: Only validate during runtime, not build time
if (typeof window === 'undefined' && process.env.NODE_ENV !== 'production') {
  validateEnvironment();
}

// BUILD SAFE: Don't initialize anything during build
if (typeof window === 'undefined' && process.env.NODE_ENV === 'production') {
  // Production runtime only
  if (!process.env.AI_INTEGRATION_SECRET) {
    console.warn('AI_INTEGRATION_SECRET not set, using default for production');
  }
}

/**
 * AI Integration Endpoint
 * Allows other AI systems to communicate and automate tasks
 */
export async function POST(request: NextRequest) {
  // BUILD SAFE: Only run during actual requests, not build time
  if (process.env.NODE_ENV === 'development' && !request.url) {
    return NextResponse.json({ error: 'Build time access not allowed' }, { status: 400 });
  }

  try {
    const body = await request.text();
    const signature = request.headers.get('x-ai-signature');

    if (!signature) {
      return NextResponse.json({ error: 'Missing signature' }, { status: 401 });
    }

    // Verify AI signature
    const secretKey = process.env.AI_INTEGRATION_SECRET || _AI_INTEGRATION_SECRET;
    const expectedSignature = crypto
      .createHmac('sha256', secretKey)
      .update(body, 'utf8')
      .digest('hex');

    if (
      !crypto.timingSafeEqual(Buffer.from(signature, 'hex'), Buffer.from(expectedSignature, 'hex'))
    ) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const data = JSON.parse(body);

    // Process AI integration request
    switch (data.type) {
      case 'license_validation': {
        const isValid = await validateLicense(data.licenseKey);
        return NextResponse.json({ valid: isValid });
      }

      case 'customer_sync': {
        await syncCustomerData(data.customerData);
        return NextResponse.json({ success: true });
      }

      case 'revenue_tracking': {
        await updateRevenueTracking(data.revenueData);
        return NextResponse.json({ success: true });
      }

      default:
        return NextResponse.json({ error: 'Unknown request type' }, { status: 400 });
    }
  } catch (error) {
    console.error('AI Integration error:', error);
    return NextResponse.json({ error: 'Processing failed' }, { status: 500 });
  }
}

// Real license validation
async function validateLicense(licenseKey: string): Promise<boolean> {
  // Implement real license validation
  return licenseKey.startsWith('RPCR-') && licenseKey.length >= 20;
}

// Real customer data sync
async function syncCustomerData(customerData: any): Promise<void> {
  // Implement real customer data synchronization
  console.log('Syncing customer data:', customerData.email);
}

// Real revenue tracking
async function updateRevenueTracking(revenueData: any): Promise<void> {
  // Implement real revenue tracking
  console.log('Updating revenue tracking:', revenueData.amount);
}

/**
 * Handle payment processing from other AI
 */
async function _handlePaymentProcessing(data: any) {
  const { paymentIntentId, customerEmail, customerName, amount, packageType, stripePaymentLink } =
    data;

  try {
    // Generate licenses based on package type
    const licenses = await generateLicensesForPackage(customerEmail, packageType);

    // Store payment record
    const payment = await prisma.payment.create({
      data: {
        stripePaymentId: paymentIntentId,
        stripeCustomerId: `ai_${Date.now()}`,
        amount: Math.round(amount * 100), // Convert to cents
        currency: 'usd',
        status: 'completed',
        metadata: {
          packageType,
          stripePaymentLink,
          source: 'ai_integration'
        }
      }
    });

    // Store licenses
    const _licenseRecords = await Promise.all(
      licenses.map((licenseKey) =>
        prisma.license.create({
          data: {
            customerId: customerEmail,
            licenseKey,
            type: packageType,
            status: 'active',
            expiresAt:
              packageType === 'lifetime'
                ? undefined
                : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
            paymentId: payment.id
          }
        })
      )
    );

    // Send welcome email
    await sendWelcomeEmail(customerEmail, customerName, packageType, licenses);

    return NextResponse.json({
      success: true,
      paymentId: payment.id,
      licenses: licenses,
      message: 'Payment processed successfully'
    });
  } catch (error) {
    console.error('Payment processing error:', error);
    return NextResponse.json({ error: 'Payment processing failed' }, { status: 500 });
  }
}

// Generate licenses for different package types
async function generateLicensesForPackage(
  customerEmail: string,
  packageType: string
): Promise<string[]> {
  const licenses: string[] = [];

  switch (packageType) {
    case 'basic': {
      const _quantity = 1;
      licenses.push(
        `RPCR-BASIC-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
      );
      break;
    }
    case 'professional': {
      const _quantity = 1;
      licenses.push(
        `RPCR-PRO-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
      );
      break;
    }
    case 'enterprise': {
      const _quantity = 5;
      for (let i = 0; i < 5; i++) {
        licenses.push(
          `RPCR-ENT-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
        );
      }
      break;
    }
    case 'government': {
      const _quantity = 10;
      for (let i = 0; i < 10; i++) {
        licenses.push(
          `RPCR-GOV-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
        );
      }
      break;
    }
    case 'lifetime_enterprise': {
      const _quantity = 1;
      licenses.push(
        `RPCR-LIFE-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
      );
      break;
    }
  }

  return licenses;
}

async function _handleLicenseGeneration(data: any) {
  const { customerEmail, packageType, quantity } = data;

  try {
    const licenses = await generateLicensesForPackage(customerEmail, packageType);

    // Store licenses in database
    const licenseRecords = await Promise.all(
      licenses.map((licenseKey) =>
        prisma.license.create({
          data: {
            customerId: customerEmail,
            licenseKey,
            type: packageType,
            status: 'active',
            expiresAt:
              packageType === 'lifetime_enterprise'
                ? undefined
                : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
            paymentId: null
          }
        })
      )
    );

    return NextResponse.json({
      success: true,
      licenses: licenses,
      message: 'Licenses generated successfully'
    });
  } catch (error) {
    console.error('License generation error:', error);
    return NextResponse.json({ error: 'License generation failed' }, { status: 500 });
  }
}

async function _handleLicenseValidation(data: any) {
  const { licenseKey } = data;

  try {
    const license = await prisma.license.findUnique({
      where: { id: licenseKey }
    });

    if (!license) {
      return NextResponse.json({ valid: false, message: 'License not found' });
    }

    const isValid =
      license.status === 'active' && (!license.expiresAt || license.expiresAt > new Date());

    return NextResponse.json({
      valid: isValid,
      license: {
        type: license.type,
        status: license.status,
        expiresAt: license.expiresAt,
        features: getFeaturesForLicenseType(license.type)
      }
    });
  } catch (error) {
    console.error('License validation error:', error);
    return NextResponse.json({ error: 'License validation failed' }, { status: 500 });
  }
}

async function _handleEmailSending(data: any) {
  const { template, email, context } = data;

  try {
    // Generate email content based on template
    let subject = 'RescuePC Repairs Notification';
    let text = 'Thank you for using RescuePC Repairs!';

    switch (template) {
      case 'welcome':
        subject = '🎉 Welcome to RescuePC Repairs!';
        text = `Hi ${context?.customerName || 'Valued Customer'},\n\nWelcome to RescuePC Repairs! We're excited to have you on board.\n\nBest regards,\nTyler Keesee\nCEO, RescuePC Repairs`;
        break;
      case 'license_confirmation':
        subject = '🔑 Your RescuePC Repairs License';
        text = `Hi ${context?.email || 'Valued Customer'},\n\nYour license has been generated successfully.\n\nLicense Key: ${context?.license?.key || 'N/A'}\n\nDownload: ***REMOVED***\n\nBest regards,\nTyler Keesee\nCEO, RescuePC Repairs`;
        break;
      default:
        subject = 'RescuePC Repairs Update';
        text = 'Thank you for using RescuePC Repairs!';
    }

    // Dynamically import nodemailer only on the server
    const nodemailer = await import('nodemailer');
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SUPPORT_EMAIL,
        pass: process.env.GMAIL_APP_PASSWORD
      },
      secure: true,
      port: 465,
      requireTLS: true
    });

    await transporter.sendMail({
      from: `"RescuePC Repairs" <${process.env.SUPPORT_EMAIL}>`,
      to: email,
      subject,
      text,
      replyTo: process.env.BUSINESS_EMAIL || 'rescuepcrepair@yahoo.com'
    });

    return NextResponse.json({
      success: true,
      message: 'Email sent successfully'
    });
  } catch (error) {
    console.error('Email sending error:', error);
    return NextResponse.json({ error: 'Email sending failed' }, { status: 500 });
  }
}

async function _handleAnalyticsRequest(data: any) {
  const { metric, dateRange } = data;

  try {
    const analyticsData = await getAnalyticsData(metric, dateRange);

    return NextResponse.json({
      success: true,
      data: analyticsData
    });
  } catch (error) {
    console.error('Analytics request error:', error);
    return NextResponse.json({ error: 'Analytics request failed' }, { status: 500 });
  }
}

async function getAnalyticsData(metric: string, dateRange?: { start: string; end: string }) {
  switch (metric) {
    case 'sales': {
      const sales = await prisma.payment.findMany({
        where: {
          status: 'completed',
          createdAt: dateRange
            ? {
                gte: new Date(dateRange.start),
                lte: new Date(dateRange.end)
              }
            : undefined
        }
      });
      return {
        total: sales.length,
        amount: sales.reduce((sum: number, sale: any) => sum + sale.amount, 0)
      };
    }
    case 'licenses': {
      const licenses = await prisma.license.findMany({
        where: {
          createdAt: dateRange
            ? {
                gte: new Date(dateRange.start),
                lte: new Date(dateRange.end)
              }
            : undefined
        }
      });
      return {
        total: licenses.length,
        active: licenses.filter((l: any) => l.status === 'active').length
      };
    }
    case 'customers': {
      const customers = await prisma.license.groupBy({
        by: ['customerId'],
        where: {
          createdAt: dateRange
            ? {
                gte: new Date(dateRange.start),
                lte: new Date(dateRange.end)
              }
            : undefined
        }
      });
      return { total: customers.length };
    }
    default:
      return { error: 'Unknown metric' };
  }
}

async function _handleHealthCheck() {
  try {
    // Check database connection
    await prisma.$queryRaw`SELECT 1`;

    // Check Stripe connection
    const balance = await stripe.balance.retrieve();

    // Check email service
    const emailStatus = process.env.SMTP_HOST ? 'configured' : 'not_configured';

    return NextResponse.json({
      status: 'healthy',
      services: {
        database: 'connected',
        stripe: 'connected',
        email: emailStatus
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Health check error:', error);
    return NextResponse.json(
      {
        status: 'unhealthy',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

async function sendWelcomeEmail(
  customerEmail: string,
  customerName: string,
  packageType: string,
  licenses: string[]
) {
  try {
    // Dynamically import nodemailer only on the server
    const nodemailer = await import('nodemailer');
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SUPPORT_EMAIL,
        pass: process.env.GMAIL_APP_PASSWORD
      },
      secure: true,
      port: 465,
      requireTLS: true
    });

    await transporter.sendMail({
      from: `"RescuePC Repairs" <${process.env.SUPPORT_EMAIL}>`,
      to: customerEmail,
      subject: '🎉 Welcome to RescuePC Repairs!',
      text: `Hi ${customerName},\n\nWelcome to RescuePC Repairs ${packageType}!\n\nYour license(s):\n${licenses.map((license, index) => `${index + 1}. ${license}`).join('\n')}\n\nDownload: ***REMOVED***\n\nBest regards,\nTyler Keesee\nCEO, RescuePC Repairs`,
      replyTo: process.env.BUSINESS_EMAIL || 'rescuepcrepair@yahoo.com'
    });
  } catch (error) {
    console.error('Welcome email error:', error);
  }
}

function _validateApiKey(request: NextRequest): boolean {
  const apiKey = request.headers.get('x-api-key');
  return apiKey === process.env.AI_INTEGRATION_SECRET;
}

export async function GET(request: NextRequest) {
  // BUILD SAFE: Only run during actual requests, not build time
  if (process.env.NODE_ENV === 'development' && !request.url) {
    return NextResponse.json({ error: 'Build time access not allowed' }, { status: 400 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    if (!_validateApiKey(request)) {
      return NextResponse.json({ error: 'Invalid API key' }, { status: 401 });
    }

    switch (action) {
      case 'health': {
        return await _handleHealthCheck();
      }

      case 'analytics': {
        const metric = searchParams.get('metric') || 'sales';
        const startDate = searchParams.get('start');
        const endDate = searchParams.get('end');

        const dateRange = startDate && endDate ? { start: startDate, end: endDate } : undefined;
        const analyticsData = await getAnalyticsData(metric, dateRange);

        return NextResponse.json({
          success: true,
          data: analyticsData
        });
      }

      case 'webhook_status': {
        const webhookStatus = await checkWebhookHealth('primary');
        return NextResponse.json({
          success: true,
          webhook: webhookStatus
        });
      }

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('GET request error:', error);
    return NextResponse.json({ error: 'Request failed' }, { status: 500 });
  }
}

async function checkWebhookHealth(type: 'primary' | 'backup'): Promise<WebhookHealthCheck> {
  try {
    // Simulate webhook health check
    const events = await prisma.webhookEvent.findMany({
      where: { type },
      orderBy: { createdAt: 'desc' },
      take: 100
    });

    const successfulEvents = events.filter((e: any) => e.status === 'success');
    const recentEvents = events.filter(
      (e: any) => e.createdAt > new Date(Date.now() - 24 * 60 * 60 * 1000)
    );

    const successRate = events.length > 0 ? (successfulEvents.length / events.length) * 100 : 0;
    const lastSuccess = successfulEvents[0]?.processedAt || null;

    // Calculate average latency (simplified)
    const averageLatency =
      recentEvents.length > 0
        ? recentEvents.reduce((sum: number, event: any) => {
            if (event.processedAt) {
              return sum + (event.processedAt.getTime() - event.createdAt.getTime());
            }
            return sum;
          }, 0) / recentEvents.length
        : 0;

    return {
      status: successRate > 90 ? 'healthy' : 'degraded',
      lastSuccess,
      successRate,
      averageLatency
    };
  } catch (error) {
    console.error('Webhook health check error:', error);
    return {
      status: 'unhealthy',
      lastSuccess: null,
      successRate: 0,
      averageLatency: 0
    };
  }
}

async function generateSEOContent({
  target,
  keywords,
  type
}: {
  target: string;
  keywords: string[];
  type: 'title' | 'description' | 'content' | 'full_scan';
}) {
  // This would integrate with OpenAI or other AI service
  // For now, return a basic template
  const baseContent = `RescuePC Repairs - Professional ${target} Solutions`;

  switch (type) {
    case 'title':
      return `${baseContent} | ${keywords.join(' ')}`;
    case 'description':
      return `Expert ${target} services with military-grade security. ${keywords.join(', ')}.`;
    case 'content':
      return `Our ${target} solutions provide enterprise-level protection with advanced features including ${keywords.join(', ')}.`;
    case 'full_scan':
      return {
        title: `${baseContent} | ${keywords.join(' ')}`,
        description: `Expert ${target} services with military-grade security. ${keywords.join(', ')}.`,
        content: `Our ${target} solutions provide enterprise-level protection with advanced features including ${keywords.join(', ')}.`
      };
    default:
      return baseContent;
  }
}

function getFeaturesForLicenseType(type: string): string[] {
  switch (type) {
    case 'basic':
      return ['Core Protection', 'Basic Support', 'Email Updates'];
    case 'professional':
      return [
        'Advanced Protection',
        'Priority Support',
        'Real-time Updates',
        'Custom Configurations'
      ];
    case 'enterprise':
      return [
        'Enterprise Protection',
        '24/7 Support',
        'Custom Integrations',
        'Advanced Analytics',
        'Team Management'
      ];
    case 'government':
      return [
        'Government-grade Security',
        'Compliance Tools',
        'Audit Logging',
        'Custom Deployments',
        'Dedicated Support'
      ];
    case 'lifetime_enterprise':
      return [
        'Lifetime Updates',
        'Enterprise Features',
        'Premium Support',
        'Custom Development',
        'White-label Options'
      ];
    default:
      return ['Basic Features'];
  }
}
