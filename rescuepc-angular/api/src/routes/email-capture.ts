import { Router } from 'express';

export const emailCaptureRouter = Router();

emailCaptureRouter.post('/', async (req, res) => {
  try {
    const { email, name, source } = req.body;

    if (!email || !email.includes('@')) {
      return res.status(400).json({
        error: 'Valid email is required',
        success: false,
      });
    }

    // TODO: Implement actual email storage logic
    // For now, just log the capture
    console.log(
      `Email captured: ${email} from ${name || 'anonymous'} via ${source || 'unknown'}`,
    );

    res.json({
      success: true,
      message: 'Email captured successfully',
      email,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Email capture error:', error);
    res.status(500).json({ error: 'Email capture failed' });
  }
});
