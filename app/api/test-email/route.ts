import { NextResponse } from 'next/server';
import { sendLicenseEmail } from '../../../utils/email';

export async function GET() {
  try {
    // Validate email configuration only during actual API calls
    if (
      !process.env.SUPPORT_EMAIL ||
      !process.env.GMAIL_APP_PASSWORD ||
      !process.env.BUSINESS_EMAIL
    ) {
      return NextResponse.json({ error: 'Email configuration missing' }, { status: 500 });
    }

    // Send test email
    const businessEmail = process.env.BUSINESS_EMAIL;
    if (!businessEmail) {
      return NextResponse.json({ error: 'Business email not configured' }, { status: 500 });
    }

    await sendLicenseEmail(
      businessEmail, // Send to business email for testing
      'TEST-LICENSE-KEY-2024',
      'Professional License',
      'Test Customer'
    );

    return NextResponse.json({ success: true, message: 'Test email sent successfully!' });
  } catch (error) {
    console.error('Error sending test email:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
