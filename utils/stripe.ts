import Stripe from 'stripe';

// Initialize Stripe with environment variables
const stripe = new Stripe(process.env['STRIPE_SECRET_KEY']!, {
  apiVersion: '2023-10-16'
});

export interface CreateCheckoutSessionParams {
  priceId: string;
  customerEmail?: string;
  successUrl: string;
  cancelUrl: string;
  metadata?: Record<string, string>;
}

export async function createCheckoutSession({
  priceId,
  customerEmail,
  successUrl,
  cancelUrl,
  metadata = {}
}: CreateCheckoutSessionParams) {
  try {
    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      line_items: [
        {
          price: priceId,
          quantity: 1
        }
      ],
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        ...metadata,
        source: 'rescuepc-repairs-nextjs',
        timestamp: new Date().toISOString()
      }
    };

    // Only add customer_email if provided
    if (customerEmail) {
      sessionParams.customer_email = customerEmail;
    }

    const session = await stripe.checkout.sessions.create(sessionParams);

    return { success: true, sessionId: session.id, url: session.url };
  } catch (error) {
    console.error('Stripe checkout session creation failed:', error);
    return { success: false, error: 'Failed to create checkout session' };
  }
}

export async function verifyWebhookSignature(
  payload: string,
  signature: string,
  webhookSecret: string
) {
  try {
    const event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
    return { success: true, event };
  } catch (error) {
    console.error('Webhook signature verification failed:', error);
    return { success: false, error: 'Invalid webhook signature' };
  }
}

export async function getSession(sessionId: string) {
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    return { success: true, session };
  } catch (error) {
    console.error('Failed to retrieve session:', error);
    return { success: false, error: 'Failed to retrieve session' };
  }
}

export { stripe };
