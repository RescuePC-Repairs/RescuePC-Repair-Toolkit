import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
// Import pricing config when available

// ENVIRONMENT VALIDATION - CRITICAL SECURITY CHECK
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('CRITICAL: STRIPE_SECRET_KEY environment variable is required');
}

// SECURE STRIPE INITIALIZATION
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-06-30.basil',
  typescript: true
});

// PAYMENT PACKAGE CONFIGURATION - MATCHES FRONTEND
const PAYMENT_PACKAGES = {
  basic: {
    name: 'Basic License',
    price: 4999, // $49.99 in cents
    licenses: 1,
    interval: 'year' as const
  },
  professional: {
    name: 'Professional License',
    price: 19999, // $199.99 in cents
    licenses: 5,
    interval: 'year' as const
  },
  enterprise: {
    name: 'Enterprise License',
    price: 49999, // $499.99 in cents
    licenses: 25,
    interval: 'year' as const
  },
  government: {
    name: 'Government License',
    price: 99999, // $999.99 in cents
    licenses: 100,
    interval: 'year' as const
  },
  lifetime: {
    name: 'Lifetime Enterprise',
    price: 49999, // $499.99 in cents
    licenses: 'unlimited',
    interval: 'one_time' as const
  }
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { packageType, packageName, licenseCount, successUrl, cancelUrl } = body;

    // Validate package type
    if (!packageType || !PAYMENT_PACKAGES[packageType as keyof typeof PAYMENT_PACKAGES]) {
      return NextResponse.json({ error: 'Invalid package type' }, { status: 400 });
    }

    const packageInfo = PAYMENT_PACKAGES[packageType as keyof typeof PAYMENT_PACKAGES];

    // CREATE STRIPE CHECKOUT SESSION
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: packageInfo.name,
              description: `RescuePC Repairs ${packageInfo.name} - ${packageInfo.licenses} ${typeof packageInfo.licenses === 'number' ? 'PC' : ''} License${typeof packageInfo.licenses === 'number' && packageInfo.licenses > 1 ? 's' : ''}`,
              images: ['https://rescuepcrepairs.com/assets/logo.png'], // Optional logo
              metadata: {
                licenseCount: packageInfo.licenses.toString(),
                packageType: packageType
              }
            },
            unit_amount: packageInfo.price,
            recurring:
              packageInfo.interval === 'year'
                ? {
                    interval: 'year'
                  }
                : undefined
          },
          quantity: 1
        }
      ],
      mode: packageInfo.interval === 'year' ? 'subscription' : 'payment',
      success_url:
        successUrl || `${process.env.NEXT_PUBLIC_DOMAIN}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${process.env.NEXT_PUBLIC_DOMAIN}/pricing`,
      customer_email: undefined, // Let customer enter email
      allow_promotion_codes: true,
      billing_address_collection: 'required',
      customer_creation: 'always',

      // METADATA FOR WEBHOOK PROCESSING
      metadata: {
        packageType: packageType,
        packageName: packageName,
        licenseCount: packageInfo.licenses.toString(),
        source: 'automated_checkout'
      },

      // SUBSCRIPTION OPTIONS (for yearly packages)
      ...(packageInfo.interval === 'year' && {
        subscription_data: {
          metadata: {
            packageType: packageType,
            licenseCount: packageInfo.licenses.toString()
          }
        }
      }),

      // AUTOMATIC TAX CALCULATION (optional)
      automatic_tax: {
        enabled: true
      },

      // PAYMENT INTENT DATA (for one-time payments)
      ...(packageInfo.interval === 'one_time' && {
        payment_intent_data: {
          metadata: {
            packageType: packageType,
            licenseCount: packageInfo.licenses.toString()
          }
        }
      })
    });

    // Log session creation for debugging
    console.log(`[CHECKOUT] Created session for ${packageType}: ${session.id}`);

    return NextResponse.json({
      url: session.url,
      sessionId: session.id
    });
  } catch (error) {
    console.error('[CHECKOUT_ERROR]', error);

    // Return detailed error for debugging (remove in production)
    return NextResponse.json(
      {
        error: 'Failed to create checkout session',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Handle GET requests (not used but good practice)
export async function GET() {
  return NextResponse.json(
    { message: 'This endpoint only accepts POST requests' },
    { status: 405 }
  );
}
