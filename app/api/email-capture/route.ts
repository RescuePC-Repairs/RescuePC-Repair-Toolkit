import { NextRequest, NextResponse } from 'next/server';
import { sendWelcomeEmail } from '../../../utils/email';
import { validateEmail, validateName, sanitizeInput } from '@/utils/validation';
import { createRateLimiter } from '@/utils/validation';

// Rate limiter: 5 requests per minute per IP
const rateLimiter = createRateLimiter(5, 60000);

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const clientIp = request.ip || request.headers.get('x-forwarded-for') || 'unknown';
    if (rateLimiter(clientIp)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { name, email } = body;

    // Validate inputs
    const nameValidation = validateName(sanitizeInput(name));
    const emailValidation = validateEmail(sanitizeInput(email));

    if (!nameValidation.isValid || !emailValidation.isValid) {
      const errors = [];
      if (!nameValidation.isValid && nameValidation.error) {
        errors.push(nameValidation.error);
      }
      if (!emailValidation.isValid && emailValidation.error) {
        errors.push(emailValidation.error);
      }
      return NextResponse.json({ error: 'Invalid input', details: errors }, { status: 400 });
    }

    // Send welcome email
    try {
      await sendWelcomeEmail(emailValidation.sanitizedValue!);
    } catch (error) {
      console.error('Failed to send welcome email:', error);
      return NextResponse.json({ error: 'Failed to send welcome email' }, { status: 500 });
    }

    // Store in database or CRM (optional)
    // await storeEmailSignup(emailValidation.sanitizedValue!, nameValidation.sanitizedValue!)

    return NextResponse.json({
      success: true,
      message: 'Thank you for signing up! Check your email for the RescuePC Repairs Flyer.'
    });
  } catch (error) {
    console.error('Email capture error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Optional: Store email signup in database
async function storeEmailSignup(email: string, name: string) {
  try {
    // This would integrate with your existing customer database
    // For now, we'll just log it
    console.log(`New email signup: ${name} (${email})`);

    // Example database integration:
    // await db.customers.create({
    //   email,
    //   name,
    //   signupDate: new Date(),
    //   source: 'website-newsletter'
    // })
  } catch (error) {
    console.error('Failed to store email signup:', error);
  }
}
