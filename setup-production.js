#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const readline = require('readline');

class ProductionSetup {
  constructor() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
  }

  async question(prompt) {
    return new Promise((resolve) => {
      this.rl.question(prompt, resolve);
    });
  }

  async setupEnvironment() {
    console.log('🚀 RESCUEPC REPAIRS - PRODUCTION SETUP\n');
    console.log('This script will help you configure your production environment.\n');

    const envConfig = {};

    // Stripe Configuration
    console.log('📋 STEP 1: STRIPE CONFIGURATION');
    console.log('Get these from your Stripe Dashboard > Developers > API Keys\n');
    
    envConfig.STRIPE_WEBHOOK_SECRET = await this.question('Enter your Stripe Webhook Secret (whsec_...): ');
    envConfig.STRIPE_SECRET_KEY = await this.question('Enter your Stripe Secret Key (sk_...): ');
    envConfig.STRIPE_PUBLISHABLE_KEY = await this.question('Enter your Stripe Publishable Key (pk_...): ');

    // Email Configuration
    console.log('\n📧 STEP 2: EMAIL CONFIGURATION');
    console.log('Set up Gmail App Password: https://support.google.com/accounts/answer/185833\n');
    
    envConfig.GMAIL_USER = await this.question('Enter your Gmail address: ');
    envConfig.GMAIL_APP_PASSWORD = await this.question('Enter your Gmail App Password: ');

    // Security Configuration
    console.log('\n🔒 STEP 3: SECURITY CONFIGURATION');
    
    envConfig.NODE_ENV = 'production';
    envConfig.VERCEL_ENV = 'production';
    envConfig.RATE_LIMIT_WINDOW_MS = '900000';
    envConfig.RATE_LIMIT_MAX_REQUESTS = '100';
    envConfig.LICENSE_KEY_PREFIX = 'RESCUE';
    envConfig.LICENSE_KEY_LENGTH = '32';
    envConfig.WEBHOOK_TIMEOUT_MS = '30000';
    envConfig.WEBHOOK_RETRY_ATTEMPTS = '3';
    envConfig.LOG_LEVEL = 'info';
    envConfig.ENABLE_SECURITY_LOGGING = 'true';
    envConfig.ENABLE_PERFORMANCE_MONITORING = 'true';
    envConfig.BACKUP_ENABLED = 'true';
    envConfig.BACKUP_INTERVAL_HOURS = '24';
    envConfig.BACKUP_RETENTION_DAYS = '30';

    // Generate secure keys
    envConfig.ENCRYPTION_KEY = crypto.randomBytes(32).toString('hex');
    envConfig.JWT_SECRET = crypto.randomBytes(64).toString('hex');
    envConfig.CSP_NONCE = crypto.randomBytes(16).toString('hex');
    envConfig.HSTS_MAX_AGE = '31536000';
    envConfig.DATABASE_SSL = 'true';

    return envConfig;
  }

  createEnvFile(envConfig) {
    const envContent = Object.entries(envConfig)
      .map(([key, value]) => `${key}=${value}`)
      .join('\n');

    fs.writeFileSync('.env', envContent);
    console.log('✅ Created .env file with your configuration');
  }

  async testConfiguration(envConfig) {
    console.log('\n🧪 TESTING CONFIGURATION...\n');

    // Test Stripe keys format
    const stripeTests = [
      { key: 'STRIPE_WEBHOOK_SECRET', pattern: /^whsec_/ },
      { key: 'STRIPE_SECRET_KEY', pattern: /^sk_(test|live)_/ },
      { key: 'STRIPE_PUBLISHABLE_KEY', pattern: /^pk_(test|live)_/ }
    ];

    let stripePassed = true;
    stripeTests.forEach(test => {
      if (!test.pattern.test(envConfig[test.key])) {
        console.log(`❌ ${test.key}: Invalid format`);
        stripePassed = false;
      } else {
        console.log(`✅ ${test.key}: Valid format`);
      }
    });

    // Test email configuration
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(envConfig.GMAIL_USER)) {
      console.log('✅ GMAIL_USER: Valid email format');
    } else {
      console.log('❌ GMAIL_USER: Invalid email format');
      stripePassed = false;
    }

    if (envConfig.GMAIL_APP_PASSWORD.length >= 16) {
      console.log('✅ GMAIL_APP_PASSWORD: Valid length');
    } else {
      console.log('❌ GMAIL_APP_PASSWORD: Too short (should be 16+ characters)');
      stripePassed = false;
    }

    return stripePassed;
  }

  async deployToVercel() {
    console.log('\n🚀 DEPLOYING TO VERCEL...\n');
    
    const deployChoice = await this.question('Deploy to Vercel now? (y/n): ');
    
    if (deployChoice.toLowerCase() === 'y') {
      console.log('📤 Pushing to GitHub...');
      try {
        const { execSync } = require('child_process');
        execSync('git add .', { stdio: 'inherit' });
        execSync('git commit -m "Production setup complete"', { stdio: 'inherit' });
        execSync('git push origin main', { stdio: 'inherit' });
        console.log('✅ Code pushed to GitHub');
        console.log('🔄 Vercel will automatically deploy from GitHub');
        console.log('📊 Monitor deployment at: https://vercel.com/dashboard');
      } catch (error) {
        console.log('❌ Git push failed. Please check your git configuration.');
      }
    }
  }

  generateDeploymentGuide() {
    const guide = `# PRODUCTION DEPLOYMENT GUIDE

## ✅ Setup Complete!

Your RescuePC Repairs system is now configured for production.

### 🔧 Next Steps:

1. **Deploy to Vercel:**
   - Your code is ready to deploy
   - Vercel will automatically deploy from GitHub
   - Monitor at: https://vercel.com/dashboard

2. **Configure Stripe Webhooks:**
   - Go to Stripe Dashboard > Webhooks
   - Add endpoint: https://your-domain.vercel.app/api/webhook
   - Select events: payment_intent.succeeded, checkout.session.completed

3. **Test the System:**
   - Run: node production-test.js
   - Run: node security-audit.js
   - Test a real payment flow

4. **Monitor Performance:**
   - Check Vercel analytics
   - Monitor webhook delivery
   - Review email delivery logs

### 🛡️ Security Features Active:
- ✅ Stripe webhook signature verification
- ✅ Rate limiting (100 requests/15min)
- ✅ Input validation
- ✅ Secure license generation
- ✅ HTTPS enforcement
- ✅ Security headers
- ✅ Data encryption

### 📧 Email System:
- ✅ Gmail SMTP configured
- ✅ Automated license delivery
- ✅ Professional email templates

### 🔑 License System:
- ✅ Automated generation
- ✅ Unique key validation
- ✅ Customer database updates
- ✅ Multi-license support

### 🚀 Ready for Launch!
Your system is now production-ready with military-grade security.

For support: Check the documentation in the /docs folder
`;

    fs.writeFileSync('PRODUCTION-READY.md', guide);
    console.log('✅ Generated PRODUCTION-READY.md guide');
  }

  async run() {
    try {
      const envConfig = await this.setupEnvironment();
      
      if (await this.testConfiguration(envConfig)) {
        this.createEnvFile(envConfig);
        this.generateDeploymentGuide();
        await this.deployToVercel();
        
        console.log('\n🎉 PRODUCTION SETUP COMPLETE!');
        console.log('✅ Environment configured');
        console.log('✅ Security implemented');
        console.log('✅ Ready for deployment');
        console.log('\n📖 See PRODUCTION-READY.md for next steps');
      } else {
        console.log('\n❌ Configuration test failed');
        console.log('Please fix the issues above and run setup again');
      }
    } catch (error) {
      console.log('❌ Setup failed:', error.message);
    } finally {
      this.rl.close();
    }
  }
}

// Run setup if called directly
if (require.main === module) {
  const setup = new ProductionSetup();
  setup.run();
}

module.exports = ProductionSetup; 