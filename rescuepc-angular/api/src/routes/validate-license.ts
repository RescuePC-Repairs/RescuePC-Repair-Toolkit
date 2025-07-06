import { Router } from 'express';

export const validateLicenseRouter = Router();

validateLicenseRouter.post('/', async (req, res) => {
  try {
    const { licenseKey, email } = req.body;

    if (!licenseKey || !email) {
      return res.status(400).json({ 
        error: 'License key and email are required',
        valid: false 
      });
    }

    // TODO: Implement actual license validation logic
    // For now, return a mock validation
    const isValid = licenseKey.length > 10 && email.includes('@');

    res.json({
      valid: isValid,
      licenseKey,
      email,
      message: isValid ? 'License is valid' : 'Invalid license key'
    });
  } catch (error) {
    console.error('License validation error:', error);
    res.status(500).json({ error: 'License validation failed' });
  }
}); 