import { Router } from 'express';

export const testWebhookRouter = Router();

testWebhookRouter.post('/', async (req, res) => {
  try {
    const { eventType, data } = req.body;

    console.log(`Test webhook received: ${eventType}`);
    console.log('Webhook data:', data);

    // Simulate webhook processing
    const processingTime = Math.random() * 1000 + 100; // 100-1100ms
    await new Promise(resolve => setTimeout(resolve, processingTime));

    res.json({
      success: true,
      message: 'Test webhook processed successfully',
      eventType,
      processingTime: `${processingTime.toFixed(0)}ms`,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Test webhook error:', error);
    res.status(500).json({ error: 'Test webhook failed' });
  }
}); 