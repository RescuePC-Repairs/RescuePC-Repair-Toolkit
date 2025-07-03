# 🛠️ Development Guide - RescuePC Repairs Multi-OS Toolkit

**Complete Development Workflow for Production-Ready System**

## 🎯 **Quick Start**

### **Prerequisites**
```bash
# Required software
Node.js 18+ 
npm 9+
Git
PostgreSQL 14+
```

### **Initial Setup**
```bash
# Clone repository
git clone [repository-url]
cd rescuepc-repairs-store

# Install dependencies
npm install

# Environment setup
cp config/env.example .env.local

# Database setup
npx prisma migrate dev
npx prisma generate

# Start development
npm run dev
```

## 📁 **Project Structure**

```
rescuepc-repairs-store/
├── app/                          # Next.js App Router
│   ├── api/                     # API Routes
│   │   ├── webhook/             # Stripe webhooks
│   │   ├── create-checkout-session/ # Payment processing
│   │   ├── ai-integration/      # AI automation
│   │   └── validate-license/    # License validation
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Main page
│   └── globals.css             # Global styles
├── components/                   # React Components
│   ├── common/                  # Shared components
│   ├── layout/                  # Layout components
│   └── sections/                # Page sections
├── config/                       # Configuration
├── utils/                        # Utility functions
├── types/                        # TypeScript types
├── emails/                       # Email templates
└── docs/                         # Documentation
```

## 🔧 **Development Workflow**

### **1. Feature Development**
```bash
# Create feature branch
git checkout -b feature/new-feature

# Make changes
# Test locally
npm run test

# Commit changes
git add .
git commit -m "feat: add new feature"

# Push and create PR
git push origin feature/new-feature
```

### **2. Code Quality**
```bash
# Linting
npm run lint

# Type checking
npm run type-check

# Formatting
npm run format

# Security audit
npm run security:audit
```

### **3. Testing**
```bash
# Run all tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage

# Security tests
npm run test:security
```

## 🏗️ **Component Development**

### **Creating New Components**
```typescript
// components/common/NewComponent.tsx
import React from 'react';
import { cn } from '@/utils/cn';

interface NewComponentProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export const NewComponent: React.FC<NewComponentProps> = ({
  title,
  children,
  className
}) => {
  return (
    <div className={cn('bg-white rounded-lg p-6', className)}>
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      {children}
    </div>
  );
};
```

### **Component Testing**
```typescript
// test/components/NewComponent.test.tsx
import { render, screen } from '@testing-library/react';
import { NewComponent } from '@/components/common/NewComponent';

describe('NewComponent', () => {
  it('renders title and children', () => {
    render(
      <NewComponent title="Test Title">
        <p>Test content</p>
      </NewComponent>
    );

    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });
});
```

## 🔌 **API Development**

### **Creating API Routes**
```typescript
// app/api/new-endpoint/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const requestSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1)
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = requestSchema.parse(body);

    // Business logic here
    const result = await processData(validatedData);

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request' },
      { status: 400 }
    );
  }
}
```

### **API Testing**
```typescript
// test/api/new-endpoint.test.ts
import { POST } from '@/app/api/new-endpoint/route';

describe('POST /api/new-endpoint', () => {
  it('validates request data', async () => {
    const request = new Request('http://localhost:3000/api/new-endpoint', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test@example.com', name: 'Test' })
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
  });
});
```

## 🗄️ **Database Development**

### **Schema Changes**
```sql
-- prisma/schema.prisma
model NewTable {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### **Migrations**
```bash
# Create migration
npx prisma migrate dev --name add_new_table

# Apply to production
npx prisma migrate deploy

# Generate client
npx prisma generate
```

### **Database Operations**
```typescript
// utils/database.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function createUser(data: { email: string; name: string }) {
  return await prisma.user.create({
    data
  });
}

export async function getUserByEmail(email: string) {
  return await prisma.user.findUnique({
    where: { email }
  });
}
```

## 🔐 **Security Development**

### **Input Validation**
```typescript
// utils/validation.ts
import { z } from 'zod';

export const userSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(1).max(100)
});

export function validateUserInput(data: unknown) {
  return userSchema.parse(data);
}
```

### **Authentication**
```typescript
// utils/auth.ts
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

export function createToken(payload: object) {
  return jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: '24h'
  });
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET!);
  } catch {
    return null;
  }
}
```

## 📧 **Email Development**

### **Creating Email Templates**
```html
<!-- emails/new_template.html -->
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>{{subject}}</title>
</head>
<body>
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <h1>{{title}}</h1>
    <p>{{message}}</p>
    <a href="{{actionUrl}}" style="background: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
      {{actionText}}
    </a>
  </div>
</body>
</html>
```

### **Email Sending**
```typescript
// utils/email.ts
import nodemailer from 'nodemailer';
import { readFileSync } from 'fs';
import { compile } from 'handlebars';

export async function sendEmail(to: string, template: string, data: object) {
  const transporter = nodemailer.createTransporter({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD
    }
  });

  const templateContent = readFileSync(`emails/${template}.html`, 'utf8');
  const compiledTemplate = compile(templateContent);
  const html = compiledTemplate(data);

  await transporter.sendMail({
    from: process.env.GMAIL_USER,
    to,
    subject: data.subject,
    html
  });
}
```

## 🧪 **Testing Strategy**

### **Unit Tests**
```typescript
// test/utils/validation.test.ts
import { validateUserInput } from '@/utils/validation';

describe('validateUserInput', () => {
  it('validates correct user data', () => {
    const validData = {
      email: 'test@example.com',
      password: 'password123',
      name: 'Test User'
    };

    const result = validateUserInput(validData);
    expect(result).toEqual(validData);
  });

  it('throws error for invalid email', () => {
    const invalidData = {
      email: 'invalid-email',
      password: 'password123',
      name: 'Test User'
    };

    expect(() => validateUserInput(invalidData)).toThrow();
  });
});
```

### **Integration Tests**
```typescript
// test/integration/payment.test.ts
import { createCheckoutSession } from '@/utils/stripe';

describe('Payment Integration', () => {
  it('creates checkout session', async () => {
    const session = await createCheckoutSession({
      priceId: 'price_test',
      successUrl: 'http://localhost:3000/success',
      cancelUrl: 'http://localhost:3000/cancel'
    });

    expect(session.url).toBeDefined();
    expect(session.id).toBeDefined();
  });
});
```

### **E2E Tests**
```typescript
// test/e2e/payment-flow.test.ts
import { test, expect } from '@playwright/test';

test('complete payment flow', async ({ page }) => {
  await page.goto('http://localhost:3000');
  
  // Select package
  await page.click('[data-testid="professional-package"]');
  
  // Fill payment form
  await page.fill('[data-testid="email"]', 'test@example.com');
  await page.fill('[data-testid="card-number"]', '4242424242424242');
  
  // Submit payment
  await page.click('[data-testid="pay-button"]');
  
  // Verify success
  await expect(page).toHaveURL(/success/);
});
```

## 🚀 **Deployment**

### **Local Testing**
```bash
# Build application
npm run build

# Start production server
npm start

# Test production build
npm run test:production
```

### **Staging Deployment**
```bash
# Deploy to staging
vercel --env staging

# Run staging tests
npm run test:staging
```

### **Production Deployment**
```bash
# Deploy to production
vercel --prod

# Verify deployment
npm run health-check
```

## 🔍 **Debugging**

### **Local Debugging**
```typescript
// Add debugging
console.log('Debug info:', { data, timestamp: new Date() });

// Use debugger
debugger;
```

### **Error Tracking**
```typescript
// utils/error-tracking.ts
export function logError(error: Error, context?: object) {
  console.error('Error:', {
    message: error.message,
    stack: error.stack,
    context,
    timestamp: new Date().toISOString()
  });
}
```

### **Performance Monitoring**
```typescript
// utils/performance.ts
export function measurePerformance<T>(
  name: string,
  fn: () => Promise<T>
): Promise<T> {
  const start = performance.now();
  return fn().finally(() => {
    const duration = performance.now() - start;
    console.log(`${name} took ${duration}ms`);
  });
}
```

## 📚 **Best Practices**

### **Code Organization**
- Keep components small and focused
- Use TypeScript for type safety
- Follow naming conventions
- Document complex logic

### **Performance**
- Optimize images and assets
- Use code splitting
- Implement caching strategies
- Monitor bundle size

### **Security**
- Validate all inputs
- Sanitize outputs
- Use HTTPS everywhere
- Implement rate limiting

### **Testing**
- Write tests for all features
- Maintain high coverage
- Test edge cases
- Use realistic test data

## 🔄 **Maintenance**

### **Dependency Updates**
```bash
# Check for updates
npm outdated

# Update dependencies
npm update

# Update major versions
npx npm-check-updates -u
npm install
```

### **Database Maintenance**
```bash
# Backup database
pg_dump database_name > backup.sql

# Restore database
psql database_name < backup.sql

# Optimize database
VACUUM ANALYZE;
```

### **Monitoring**
```bash
# Check system health
npm run health-check

# Monitor logs
npm run logs

# Performance metrics
npm run metrics
```

---

**This development guide ensures consistent, high-quality development practices for the RescuePC Repairs Multi-OS Toolkit.** 