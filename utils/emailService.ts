import nodemailer from 'nodemailer';

interface EmailOptions {
  to: string;
  subject: string;
  text: string;
}

export async function sendTransactionalEmail({ to, subject, text }: EmailOptions) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.SUPPORT_EMAIL,
      pass: process.env.EMAIL_APP_PASSWORD
    }
  });

  try {
    const info = await transporter.sendMail({
      from: `"RescuePC Repairs" <${process.env.SUPPORT_EMAIL}>`,
      to,
      subject,
      text,
      replyTo: process.env.BUSINESS_EMAIL
    });

    console.log('Email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}
