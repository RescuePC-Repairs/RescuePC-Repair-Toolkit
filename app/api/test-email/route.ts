import { NextRequest, NextResponse } from 'next/server';
import { sendLicenseEmail } from '../../../utils/email';

export async function GET(request: NextRequest) {
  try {
    console.log('Testing email system...');

    // Test email configuration
    if (!process.env.SUPPORT_EMAIL || !process.env.GMAIL_APP_PASSWORD) {
      return NextResponse.json(
        {
          error: 'Email configuration missing',
          required: ['SUPPORT_EMAIL', 'GMAIL_APP_PASSWORD'],
          current: {
            SUPPORT_EMAIL: process.env.SUPPORT_EMAIL ? 'SET' : 'MISSING',
            GMAIL_APP_PASSWORD: process.env.GMAIL_APP_PASSWORD ? 'SET' : 'MISSING'
          }
        },
        { status: 500 }
      );
    }

    // Send test email
    await sendLicenseEmail(
      'rescuepcrepair@yahoo.com',
      'TEST-LICENSE-KEY-2024',
      'Professional License'
    );

    return NextResponse.json({
      success: true,
      message: 'Test email sent successfully',
      config: {
        SUPPORT_EMAIL: process.env.SUPPORT_EMAIL,
        BUSINESS_EMAIL: process.env.BUSINESS_EMAIL,
        DOWNLOAD_LINK: process.env.DOWNLOAD_LINK || 'https://secure-download.rescuepcrepairs.com'
      }
    });
  } catch (error) {
    console.error('Email test failed:', error);
    return NextResponse.json(
      {
        error: 'Email test failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
