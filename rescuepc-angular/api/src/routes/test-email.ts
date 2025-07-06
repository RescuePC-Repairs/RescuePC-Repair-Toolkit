import { Router } from 'express';

export const testEmailRouter = Router();

testEmailRouter.post('/', async (req, res) => {
  try {
    const { to, subject, message } = req.body;

    if (!to || !to.includes('@')) {
      return res.status(400).json({ 
        error: 'Valid email address is required',
        success: false 
      });
    }

    // TODO: Implement actual email sending logic
    // For now, just log the test
    console.log(`Test email would be sent to: ${to}`);
    console.log(`Subject: ${subject || 'Test Email'}`);
    console.log(`Message: ${message || 'This is a test email'}`);

    res.json({
      success: true,
      message: 'Test email logged successfully',
      to,
      subject: subject || 'Test Email',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Test email error:', error);
    res.status(500).json({ error: 'Test email failed' });
  }
}); 