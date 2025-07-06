import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from '../../../../utils/emailService';
import { getPurchaseEmailTemplate } from '../../../../utils/emailTemplates';

export async function POST(request: NextRequest) {
  try {
    const { influencerName, influencerEmail } = await request.json();

    if (!influencerName || !influencerEmail) {
      return NextResponse.json(
        { error: 'Influencer name and email are required' },
        { status: 400 }
      );
    }

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
