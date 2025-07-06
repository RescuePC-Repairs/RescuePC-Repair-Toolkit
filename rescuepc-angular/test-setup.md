# 🧪 Testing Framework Setup - RescuePC Angular

## Testing Strategy

### 1. Unit Tests (Jest)
- **Frontend**: Angular components, services, pipes
- **Backend**: Express routes, middleware, utilities
- **Libraries**: Shared utilities, Stripe integration, license validation

### 2. Integration Tests (Supertest)
- **API Routes**: All Express endpoints
- **Webhook Handlers**: Stripe webhook processing
- **Authentication**: License validation flows

### 3. E2E Tests (Playwright)
- **User Flows**: Complete purchase journeys
- **Responsive Testing**: Mobile, tablet, desktop
- **Cross-browser**: Chrome, Firefox, Safari

## Test Commands

```bash
# Unit Tests
nx test frontend          # Angular app tests
nx test api              # Express API tests
nx test shared           # Shared library tests
nx test stripe           # Stripe integration tests
nx test license          # License validation tests
nx test ui               # UI component tests

# All Tests
nx run-many --target=test --all

# Test with Coverage
nx test frontend --coverage
nx test api --coverage

# E2E Tests
nx e2e frontend-e2e      # Frontend E2E tests
nx e2e api-e2e           # API E2E tests

# Test Specific Files
nx test frontend --testNamePattern="HeroComponent"
nx test api --testNamePattern="webhook"
```

## Test Structure

```
rescuepc-angular/
├── apps/
│   ├── frontend/
│   │   └── src/
│   │       └── app/
│   │           └── components/
│   │               └── hero/
│   │                   ├── hero.component.spec.ts
│   │                   └── hero.component.ts
│   └── api/
│       └── src/
│           └── routes/
│               └── webhook.spec.ts
├── libs/
│   ├── shared/
│   │   └── src/
│   │       └── lib/
│   │           └── utils.spec.ts
│   ├── stripe/
│   │   └── src/
│   │       └── lib/
│   │           └── stripe.service.spec.ts
│   └── license/
│       └── src/
│           └── lib/
│               └── license.service.spec.ts
└── e2e/
    ├── frontend-e2e/
    │   └── src/
    │       └── tests/
    │           └── purchase-flow.spec.ts
    └── api-e2e/
        └── src/
            └── tests/
                └── webhook-integration.spec.ts
```

## Test Configuration

### Jest Configuration
- **Coverage**: 80% minimum
- **Timeout**: 10 seconds
- **Environment**: jsdom for frontend, node for backend
- **Mocking**: Stripe, external APIs, file system

### Playwright Configuration
- **Browsers**: Chrome, Firefox, Safari
- **Devices**: Mobile, tablet, desktop
- **Screenshots**: On failure
- **Video**: Record test runs

### Supertest Configuration
- **Base URL**: http://localhost:3333
- **Headers**: Authentication, CORS
- **Timeout**: 5 seconds per request

## Test Examples

### Angular Component Test
```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeroComponent } from './hero.component';

describe('HeroComponent', () => {
  let component: HeroComponent;
  let fixture: ComponentFixture<HeroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeroComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(HeroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display hero title', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain('RescuePC Repairs');
  });
});
```

### Express Route Test
```typescript
import request from 'supertest';
import { app } from '../main';

describe('Webhook Routes', () => {
  it('should handle Stripe webhook', async () => {
    const response = await request(app)
      .post('/api/webhook')
      .set('stripe-signature', 'test-signature')
      .send({ type: 'payment_intent.succeeded' });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });
});
```

### E2E Test
```typescript
import { test, expect } from '@playwright/test';

test('complete purchase flow', async ({ page }) => {
  await page.goto('/');
  await page.click('[data-testid="get-started"]');
  await page.click('[data-testid="basic-license"]');
  await page.fill('[data-testid="email"]', 'test@example.com');
  await page.click('[data-testid="purchase"]');
  
  await expect(page.locator('[data-testid="success-message"]')).toBeVisible();
});
```

## CI/CD Integration

### GitHub Actions
```yaml
name: Test
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: pnpm install
      - run: nx run-many --target=test --all
      - run: nx run-many --target=e2e --all
```

## Coverage Reports

- **HTML Reports**: `coverage/index.html`
- **LCOV**: For CI integration
- **Thresholds**: 80% statements, branches, functions, lines

## Performance Testing

- **Lighthouse**: Performance, accessibility, SEO
- **Load Testing**: Artillery or k6
- **Memory Leaks**: Jest memory usage tracking

## Security Testing

- **Dependency Scanning**: npm audit
- **Code Analysis**: ESLint security rules
- **Penetration Testing**: OWASP ZAP integration 