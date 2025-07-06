import { NextRequest, NextResponse } from 'next/server';

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

    // Send test email
    await transporter.sendMail({
      from: `"RescuePC Repairs" <${process.env.SUPPORT_EMAIL}>`,
      to: 'rescuepcrepair@yahoo.com',
      subject: 'Test License Email - Professional License',
      text: `Your license key: TEST-LICENSE-KEY-2024\nThank you for testing RescuePC Repairs!`,
      replyTo: process.env.BUSINESS_EMAIL || 'rescuepcrepair@yahoo.com'
    });

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
