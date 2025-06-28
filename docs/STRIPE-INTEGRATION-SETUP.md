# 🎯 RESCUEPC REPAIRS - STRIPE INTEGRATION SETUP GUIDE

## 📋 **Complete Automated License Distribution System**

This guide will walk you through setting up the automated license distribution system that integrates with Stripe for seamless payment processing and license generation.

---

## 🚀 **QUICK START - 4 Steps to Launch**

### **Step 1: Create Stripe Payment Links**
1. Log into your [Stripe Dashboard](https://dashboard.stripe.com)
2. Go to **Payments** → **Payment Links**
3. Create 5 payment links with these exact amounts:

| License Type | Price | Payment Link Name |
|--------------|-------|-------------------|
| Basic | $49.99 | RescuePC Basic License |
| Professional | $199.99 | RescuePC Professional License |
| Enterprise | $499.99 | RescuePC Enterprise License |
| Government | $999.99 | RescuePC Government License |
| Lifetime | $499.99 | RescuePC Lifetime License |

### **Step 2: Configure Webhook Endpoint**
1. In Stripe Dashboard, go to **Developers** → **Webhooks**
2. Click **Add endpoint**
3. Set endpoint URL: `https://yourdomain.com/webhook`
4. Select events: `payment_intent.succeeded`
5. Copy the webhook secret

### **Step 3: Update Configuration**
1. Open `js/automated-license-system.js`
2. Replace these values:
   ```javascript
   this.webhookSecret = 'whsec_your_webhook_secret_here'; // Your webhook secret
   this.stripePublicKey = 'pk_test_your_public_key_here'; // Your public key
   ```

### **Step 4: Test the System**
1. Open your website
2. Scroll to the **License Management Dashboard**
3. Click **Test Automated System**
4. Verify all 5 license types are generated correctly

---

## 🔧 **DETAILED SETUP INSTRUCTIONS**

### **1. Stripe Account Setup**

#### **Create Stripe Account**
1. Visit [stripe.com](https://stripe.com) and sign up
2. Complete account verification
3. Add your business information
4. Set up your bank account for payouts

#### **Get API Keys**
1. Go to **Developers** → **API Keys**
2. Copy your **Publishable Key** (starts with `pk_`)
3. Copy your **Secret Key** (starts with `sk_`)
4. Keep these secure - never share the secret key

### **2. Payment Link Creation**

#### **Basic License ($49.99)**
1. Create new payment link
2. Set amount: $49.99
3. Set name: "RescuePC Basic License"
4. Add description: "1 device, 1 year, basic repairs"
5. Enable customer email collection
6. Copy the payment link URL

#### **Professional License ($199.99)**
1. Create new payment link
2. Set amount: $199.99
3. Set name: "RescuePC Professional License"
4. Add description: "3 devices, 1 year, advanced features"
5. Enable customer email collection
6. Copy the payment link URL

#### **Enterprise License ($499.99)**
1. Create new payment link
2. Set amount: $499.99
3. Set name: "RescuePC Enterprise License"
4. Add description: "25 devices, 1 year, enterprise features"
5. Enable customer email collection
6. Copy the payment link URL

#### **Government License ($999.99)**
1. Create new payment link
2. Set amount: $999.99
3. Set name: "RescuePC Government License"
4. Add description: "Unlimited devices, government compliance"
5. Enable customer email collection
6. Copy the payment link URL

#### **Lifetime License ($499.99)**
1. Create new payment link
2. Set amount: $499.99
3. Set name: "RescuePC Lifetime License"
4. Add description: "5 devices, lifetime, all features"
5. Enable customer email collection
6. Copy the payment link URL

### **3. Webhook Configuration**

#### **Create Webhook Endpoint**
1. Go to **Developers** → **Webhooks**
2. Click **Add endpoint**
3. Enter endpoint URL: `https://yourdomain.com/webhook`
4. Select events:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
5. Click **Add endpoint**

#### **Get Webhook Secret**
1. After creating the webhook, click on it
2. Copy the **Signing secret** (starts with `whsec_`)
3. This is used to verify webhook authenticity

### **4. Code Configuration**

#### **Update Automated System**
1. Open `js/automated-license-system.js`
2. Find the constructor section
3. Update these values:
   ```javascript
   this.webhookSecret = 'whsec_your_actual_webhook_secret';
   this.stripePublicKey = 'pk_your_actual_public_key';
   ```

#### **Update Payment Links in HTML**
1. Open `index.html`
2. Find the pricing section
3. Replace the placeholder URLs with your actual Stripe payment links:
   ```html
   <a href="https://buy.stripe.com/your_basic_link" class="btn btn-primary">
   <a href="https://buy.stripe.com/your_professional_link" class="btn btn-primary">
   <a href="https://buy.stripe.com/your_enterprise_link" class="btn btn-primary">
   <a href="https://buy.stripe.com/your_government_link" class="btn btn-primary">
   <a href="https://buy.stripe.com/your_lifetime_link" class="btn btn-primary">
   ```

### **5. Server-Side Webhook Handler**

#### **Create Webhook Handler**
You'll need a server to handle Stripe webhooks. Here's a basic Node.js example:

```javascript
const express = require('express');
const stripe = require('stripe')('sk_your_secret_key');
const app = express();

app.post('/webhook', express.raw({type: 'application/json'}), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = 'whsec_your_webhook_secret';

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.log(`Webhook Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object;
    
    // Process the payment
    const amount = paymentIntent.amount / 100;
    const customerEmail = paymentIntent.receipt_email;
    
    // Send to your automated system
    console.log(`Payment received: $${amount} from ${customerEmail}`);
    
    // Here you would call your automated license system
    // automatedLicenseSystem.processStripePayment({
    //   amount: amount,
    //   customer_email: customerEmail,
    //   payment_intent_id: paymentIntent.id
    // });
  }

  res.json({received: true});
});

app.listen(3000, () => console.log('Webhook server running on port 3000'));
```

---

## 🧪 **TESTING THE SYSTEM**

### **1. Test Payment Processing**
1. Use Stripe's test mode
2. Use test card numbers:
   - Success: `4242 4242 4242 4242`
   - Decline: `4000 0000 0000 0002`
3. Make test payments through your payment links

### **2. Test License Generation**
1. Open your website
2. Go to the License Management Dashboard
3. Click **Test Automated System**
4. Verify all 5 license types are generated
5. Check the dashboard statistics update

### **3. Test Email Delivery**
1. Make a test payment
2. Check that the license email is generated
3. Verify the email contains:
   - Correct license key
   - Appropriate download links
   - Customer-specific information

---

## 📊 **MONITORING & ANALYTICS**

### **Dashboard Features**
- **Real-time Statistics**: Total licenses, revenue, active/expired
- **License Breakdown**: Distribution by type
- **Recent Activity**: Latest license generations
- **System Controls**: Test, export, status check

### **Key Metrics to Track**
- Total revenue by license type
- License activation rates
- Customer support requests
- System performance

---

## 🔒 **SECURITY CONSIDERATIONS**

### **Webhook Security**
- Always verify webhook signatures
- Use HTTPS for webhook endpoints
- Keep webhook secrets secure
- Monitor for suspicious activity

### **License Security**
- Hardware fingerprinting prevents sharing
- Automatic expiration enforcement
- Device limit enforcement
- Violation logging

---

## 🚨 **TROUBLESHOOTING**

### **Common Issues**

#### **Webhook Not Receiving Events**
- Check endpoint URL is correct
- Verify webhook secret matches
- Ensure server is accessible
- Check Stripe dashboard for errors

#### **License Not Generated**
- Verify payment amount matches expected values
- Check customer email is collected
- Review browser console for errors
- Test automated system manually

#### **Email Not Sent**
- Check email service configuration
- Verify customer email format
- Review email template syntax
- Test email preview function

### **Debug Steps**
1. Check browser console for errors
2. Verify all scripts are loaded
3. Test individual functions
4. Check localStorage for license data
5. Review Stripe dashboard logs

---

## 📞 **SUPPORT**

### **Getting Help**
- Check the troubleshooting section above
- Review browser console for error messages
- Test individual components
- Contact support with specific error details

### **Useful Resources**
- [Stripe Documentation](https://stripe.com/docs)
- [Stripe Webhook Guide](https://stripe.com/docs/webhooks)
- [Stripe Testing Guide](https://stripe.com/docs/testing)

---

## ✅ **LAUNCH CHECKLIST**

- [ ] Stripe account created and verified
- [ ] 5 payment links created with correct amounts
- [ ] Webhook endpoint configured
- [ ] Webhook secret copied
- [ ] Code configuration updated
- [ ] Payment links updated in HTML
- [ ] System tested with test payments
- [ ] License generation verified
- [ ] Email delivery tested
- [ ] Dashboard monitoring active
- [ ] Security measures implemented

**🎉 Congratulations! Your automated license distribution system is ready to launch!** 