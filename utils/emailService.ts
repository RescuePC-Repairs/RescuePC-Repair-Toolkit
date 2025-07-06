export async function sendEmail(to: string, subject: string, text: string) {
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

    await transporter.sendMail({
      from: process.env.SUPPORT_EMAIL,
      to,
      subject,
      text
    });

    console.log('Email sent successfully');
  } catch (error) {
    console.error('Failed to send email:', error);
  }
}
