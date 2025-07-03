import { NextResponse } from 'next/server';
import { sendLicenseEmail } from '../../../utils/email';

export async function GET() {
  try {
    // Verify required environment variables
    if (
      !process.env.SUPPORT_EMAIL ||
      !process.env.GMAIL_APP_PASSWORD ||
      !process.env.BUSINESS_EMAIL ||
      !process.env.PCLOUD_DOWNLOAD_LINK
    ) {
      throw new Error('Missing required environment variables for email configuration');
    }

    // Send test email
    await sendLicenseEmail(
      process.env.BUSINESS_EMAIL, // Send to business email for testing
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
