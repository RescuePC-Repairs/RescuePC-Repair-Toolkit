import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { influencerName, influencerEmail } = await request.json();

    if (!influencerName || !influencerEmail) {
      return NextResponse.json(
        { error: 'Influencer name and email are required' },
        { status: 400 }
      );
    }

    // Dynamically import email functions to prevent bundling issues
    const { sendEmail } = await import('../../../../utils/emailService');
    const { getPurchaseEmailTemplate } = await import('../../../../utils/emailTemplates');

    // Send affiliate invitation email
    await sendEmail(
      influencerEmail,
      'Exclusive Affiliate Partnership Invitation - RescuePC Repairs',
      getPurchaseEmailTemplate(influencerName, ['N/A'], 'Affiliate Invite')
    );

    return NextResponse.json({
      success: true,
      message: 'Affiliate invitation sent successfully'
    });
  } catch (error) {
    console.error('Affiliate invitation error:', error);
    return NextResponse.json({ error: 'Failed to send affiliate invitation' }, { status: 500 });
  }
}
