// Test script to simulate Stripe webhook and send email
const https = require('https');

// Simulate a successful checkout session completion
const testEvent = {
  type: 'checkout.session.completed',
  data: {
    object: {
      id: 'cs_test_webhook_123',
      customer_email: 'rescuepcrepair@yahoo.com',
      customer_details: {
        name: 'Test Customer',
        email: 'rescuepcrepair@yahoo.com'
      },
      amount_total: 49999, // $499.99
      metadata: {
        packageType: 'lifetime',
        packageName: 'Lifetime Enterprise',
        licenseCount: 'unlimited'
      }
    }
  }
};

// Test the webhook endpoint
const postData = JSON.stringify(testEvent);

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/webhook/stripe',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'stripe-signature': 'test_signature_for_testing',
    'Content-Length': Buffer.byteLength(postData)
  }
};

const req = https.request(options, (res) => {
  console.log(`Status: ${res.statusCode}`);
  console.log(`Headers: ${JSON.stringify(res.headers)}`);

  res.setEncoding('utf8');
  res.on('data', (chunk) => {
    console.log(`Response: ${chunk}`);
  });
});

req.on('error', (e) => {
  console.error(`Problem with request: ${e.message}`);
});

req.write(postData);
req.end();

console.log('Testing webhook with simulated Stripe event...');
