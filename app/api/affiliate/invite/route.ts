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

    // Send affiliate invitation email directly here
    try {
      // Dynamically import nodemailer only on the server
      const nodemailer = await import('nodemailer');
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.SUPPORT_EMAIL,
          pass: process.env.GMAIL_APP_PASSWORD
        }
      });

      const emailContent = `Hi ${influencerName},

I'm Tyler Keesee, CEO of RescuePC Repairs — a next-gen cybersecurity + repair toolkit built for real-world reliability and peace of mind.

We're launching our Affiliate Partner Program, and I'd love to invite you to be part of it.

Why Join?
🚀 Earn commissions on every referral
🔒 Promote a brand built on security, performance & trust
💻 Help your audience protect and optimize their PCs
🎁 Early access to features, branding assets & special promos

Our toolkit is ideal for:
• Tech-savvy followers
• Gamers
• Remote workers
• Everyday users who just want a safer, faster machine

🔗 https://www.rescuepcrepairs.com/

I'd love to send over your custom affiliate link and assets if you're open to partnering up.

Let's build something powerful together.

Best,
Tyler Keesee
CEO, RescuePC Repairs
📧 ${process.env.BUSINESS_EMAIL}
🌐 https://www.rescuepcrepairs.com/`;

      await transporter.sendMail({
        from: `"RescuePC Repairs" <${process.env.SUPPORT_EMAIL}>`,
        to: influencerEmail,
        subject: 'Exclusive Affiliate Partnership Invitation - RescuePC Repairs',
        text: emailContent,
        replyTo: process.env.BUSINESS_EMAIL || 'rescuepcrepair@yahoo.com'
      });

      return NextResponse.json({
        success: true,
        message: 'Affiliate invitation sent successfully'
      });
    } catch (error) {
      console.error('Failed to send affiliate invitation email:', error);
      return NextResponse.json({ error: 'Failed to send affiliate invitation' }, { status: 500 });
    }
  } catch (error) {
    console.error('Affiliate invitation error:', error);
    return NextResponse.json({ error: 'Failed to send affiliate invitation' }, { status: 500 });
  }
}
