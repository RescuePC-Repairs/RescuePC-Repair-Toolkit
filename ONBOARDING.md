# 🚀 RescuePC Repairs - Developer Onboarding Guide

**Welcome to the RescuePC Repairs Store!** This guide will get you up and running in minutes.

---

## 📋 **Quick Start (5 minutes)**

### 1. **Install Dependencies**
```bash
npm install
```

### 2. **Set Up Environment**
```bash
cp config/env.example .env.local
# Edit .env.local with your credentials
```

### 3. **Start Development Server**
```bash
npm run dev
```

### 4. **Open Browser**
Navigate to `http://localhost:3000`

---

## 🏗️ **Project Structure**

```
RescuePC Repairs Store/
├── 📁 app/                    # Next.js App Router
│   ├── 📁 api/               # API Routes (Stripe, webhooks, etc.)
│   ├── 📄 page.tsx          # Main landing page
│   └── 📄 layout.tsx        # Root layout
├── 📁 components/            # React Components
│   ├── 📁 sections/         # Page sections (Hero, Pricing, etc.)
│   ├── 📁 layout/           # Layout components (Navbar, etc.)
│   └── 📁 common/           # Shared components
├── 📁 config/               # Configuration files
├── 📁 utils/                # Utility functions
├── 📁 types/                # TypeScript type definitions
├── 📁 emails/               # Email templates
├── 📁 docs/                 # Documentation
│   ├── 📁 production/       # Production deployment docs
│   ├── 📁 development/      # Development guides
│   └── 📁 security/         # Security documentation
└── 📁 scripts/              # Build and deployment scripts
```

---

## 🔧 **Available Scripts**

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run format` | Format code with Prettier |
| `npm test` | Run tests |

---

## 🛡️ **Security Features**

This project includes military-grade security:

- **AES-256-GCM Encryption** for sensitive data
- **TLS 1.3** for all communications
- **HSTS** headers for HTTPS enforcement
- **Rate Limiting** to prevent abuse
- **Input Validation** and sanitization
- **Zero-Trust Authentication** system
- **Real-time Security Monitoring**

---

## 💳 **Payment Integration**

- **Stripe** for secure payment processing
- **Automated license generation** after payment
- **Webhook handling** for payment confirmations
- **Email automation** for customer communication

---

## 📧 **Email System**

- **Gmail SMTP** integration
- **Professional templates** for all license types
- **Automated delivery** (< 3 seconds)
- **HTML and text versions**

---

## 🧪 **Testing**

```bash
# Run all tests
npm test

# Run specific test suites
npm test -- --testPathPattern=security
npm test -- --testPathPattern=components
```

---

## 🚀 **Deployment**

### **Vercel (Recommended)**
```bash
# Deploy to Vercel
vercel --prod
```

### **Environment Variables**
Ensure these are set in production:
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `GMAIL_APP_PASSWORD`
- `ENCRYPTION_KEY`

---

## 📚 **Key Files to Know**

| File | Purpose |
|------|---------|
| `app/page.tsx` | Main landing page |
| `config/pricing.ts` | Pricing configuration |
| `utils/stripe.ts` | Stripe integration |
| `utils/email.ts` | Email functionality |
| `app/api/webhook/route.ts` | Stripe webhook handler |
| `components/sections/PricingSection.tsx` | Pricing UI |

---

## 🔍 **Common Tasks**

### **Add a New Feature**
1. Create component in `components/`
2. Add to main page in `app/page.tsx`
3. Test with `npm test`
4. Format with `npm run format`

### **Update Pricing**
1. Edit `config/pricing.ts`
2. Update `components/sections/PricingSection.tsx`
3. Test payment flow

### **Add Email Template**
1. Create template in `emails/`
2. Update `utils/emailTemplates.ts`
3. Test with `npm run test:email`

---

## 🆘 **Troubleshooting**

### **Build Errors**
```bash
# Clear cache and rebuild
rm -rf .next
npm run build
```

### **Payment Issues**
- Check Stripe dashboard for webhook status
- Verify environment variables
- Check logs in `logs/` directory

### **Email Not Sending**
- Verify Gmail app password
- Check SMTP settings in `utils/email.ts`
- Test with `npm run test:email`

---

## 📞 **Support**

- **Documentation**: Check `docs/` directory
- **Security**: Review `docs/security/`
- **Production**: See `docs/production/`

---

## ✅ **Checklist for New Developers**

- [ ] Environment variables configured
- [ ] Development server running
- [ ] All tests passing
- [ ] Code formatting working
- [ ] Payment flow tested
- [ ] Email system verified
- [ ] Security features understood

**You're ready to contribute! 🎉** 