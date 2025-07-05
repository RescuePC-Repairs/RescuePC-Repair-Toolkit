import { test, expect, Page, Browser } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

interface HeadingElement {
  level: number;
  text: string | undefined;
}

interface LandmarkElement {
  role: string | null;
  label: string | null;
}

interface AriaElement {
  hasLabel: boolean;
  hasLabelledBy: boolean;
  hasDescribedBy: boolean;
}

interface FocusableElement {
  tagName: string;
  tabIndex: string | null;
  hidden: boolean;
  disabled: boolean;
}

interface StyleElement {
  color: string;
  backgroundColor: string;
  fontSize: string;
}

interface ImageElement {
  hasAlt: boolean;
  alt: string | null;
  role: string | null;
  isDecorative: boolean;
}

interface FormInput {
  type: string | null;
  hasLabel: boolean;
  hasError: boolean;
  hasErrorMessage: boolean;
}

test.describe('Accessibility Tests', () => {
  let page: Page;

  test.beforeEach(async ({ browser }: { browser: Browser }) => {
    page = await browser.newPage();
    await page.goto('https://rescuepcrepairs.com');
  });

  test.afterEach(async () => {
    await page.close();
  });

  test('should pass axe accessibility tests', async () => {
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

    // Assert no violations
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('should have proper heading structure', async () => {
    const headings = await page.$$eval(
      'h1, h2, h3, h4, h5, h6',
      (elements: Element[]): HeadingElement[] => {
        return elements.map((el) => ({
          level: parseInt(el.tagName.substring(1)),
          text: el.textContent?.trim()
        }));
      }
    );

    // Check for at least one h1
    const h1Count = headings.filter((h: HeadingElement) => h.level === 1).length;
    expect(h1Count).toBe(1);

    // Check heading hierarchy
    let previousLevel = 0;
    for (const heading of headings) {
      expect(heading.level - previousLevel).toBeLessThanOrEqual(1);
      previousLevel = heading.level;
    }
  });

  test('should have proper ARIA attributes', async () => {
    // Check for proper ARIA landmarks
    const landmarks = await page.$$eval('[role]', (elements: Element[]): LandmarkElement[] => {
      return elements.map((el) => ({
        role: el.getAttribute('role'),
        label: el.getAttribute('aria-label')
      }));
    });

    // Verify essential landmarks exist
    const requiredLandmarks = ['banner', 'main', 'navigation', 'contentinfo'];
    for (const required of requiredLandmarks) {
      expect(landmarks.some((l: LandmarkElement) => l.role === required)).toBe(true);
    }

    // Check for proper ARIA labels
    const ariaElements = await page.$$eval(
      '[aria-label], [aria-labelledby], [aria-describedby]',
      (elements: Element[]): AriaElement[] => {
        return elements.map((el) => ({
          hasLabel: el.hasAttribute('aria-label'),
          hasLabelledBy: el.hasAttribute('aria-labelledby'),
          hasDescribedBy: el.hasAttribute('aria-describedby')
        }));
      }
    );

    for (const element of ariaElements) {
      expect(element.hasLabel || element.hasLabelledBy || element.hasDescribedBy).toBe(true);
    }
  });

  test('should have proper focus management', async () => {
    // Get all focusable elements
    const focusableElements = await page.$$eval(
      'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])',
      (elements: Element[]): FocusableElement[] => {
        return elements.map((el) => ({
          tagName: el.tagName.toLowerCase(),
          tabIndex: el.getAttribute('tabindex'),
          hidden: el.hasAttribute('hidden') || el.getAttribute('aria-hidden') === 'true',
          disabled: el.hasAttribute('disabled')
        }));
      }
    );

    // Check that all interactive elements are focusable
    for (const element of focusableElements) {
      if (!element.hidden && !element.disabled) {
        expect(element.tabIndex).not.toBe('-1');
      }
    }

    // Test focus order
    await page.keyboard.press('Tab');
    const firstFocused = await page.evaluate(() => document.activeElement?.tagName.toLowerCase());
    expect(['a', 'button', 'input'].includes(firstFocused || '')).toBe(true);
  });

  test('should have proper color contrast', async () => {
    const contrastViolations = await page.$$eval('*', (elements: Element[]): StyleElement[] => {
      return elements
        .filter((el) => {
          const style = window.getComputedStyle(el as HTMLElement);
          return style.color && style.backgroundColor;
        })
        .map((el) => {
          const style = window.getComputedStyle(el as HTMLElement);
          return {
            color: style.color,
            backgroundColor: style.backgroundColor,
            fontSize: style.fontSize
          };
        });
    });

    // This is a simplified check - in a real test, you'd use a color contrast library
    for (const element of contrastViolations) {
      expect(element.color).not.toBe(element.backgroundColor);
    }
  });

  test('should have proper image accessibility', async () => {
    const images = await page.$$eval('img', (elements: HTMLImageElement[]): ImageElement[] => {
      return elements.map((el) => ({
        hasAlt: el.hasAttribute('alt'),
        alt: el.getAttribute('alt'),
        role: el.getAttribute('role'),
        isDecorative: el.getAttribute('role') === 'presentation' || el.alt === ''
      }));
    });

    for (const image of images) {
      expect(image.hasAlt).toBe(true);
      if (!image.isDecorative) {
        expect(image.alt).toBeTruthy();
      }
    }
  });

  test('should have proper form accessibility', async () => {
    const forms = await page.$$eval('form', (elements: HTMLFormElement[]): FormInput[][] => {
      return elements.map((form) => {
        const inputs = Array.from(form.querySelectorAll('input, select, textarea'));
        return inputs.map((input) => ({
          type: input.getAttribute('type'),
          hasLabel:
            !!(input as HTMLInputElement).labels?.length ||
            input.hasAttribute('aria-label') ||
            input.hasAttribute('aria-labelledby'),
          hasError: input.hasAttribute('aria-invalid'),
          hasErrorMessage: input.hasAttribute('aria-errormessage')
        }));
      });
    });

    for (const form of forms) {
      for (const input of form) {
        expect(input.hasLabel).toBe(true);
        if (input.hasError) {
          expect(input.hasErrorMessage).toBe(true);
        }
      }
    }
  });

  test('should be keyboard navigable', async () => {
    // Test main navigation
    await page.keyboard.press('Tab');
    let focused = await page.evaluate(() => document.activeElement?.tagName.toLowerCase());
    expect(focused).toBe('a');

    // Navigate through all focusable elements
    const focusableElements = await page.$$(
      'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    for (let i = 0; i < focusableElements.length; i++) {
      await page.keyboard.press('Tab');
      focused = await page.evaluate(() => document.activeElement?.tagName.toLowerCase());
      expect(['a', 'button', 'input', 'select', 'textarea'].includes(focused || '')).toBe(true);
    }

    // Test escape key for modals/dropdowns
    const hasModal = await page.evaluate(() => {
      const modal = document.querySelector('[role="dialog"]');
      return !!modal && window.getComputedStyle(modal as HTMLElement).display !== 'none';
    });

    if (hasModal) {
      await page.keyboard.press('Escape');
      const modalVisible = await page.evaluate(() => {
        const modal = document.querySelector('[role="dialog"]');
        return !!modal && window.getComputedStyle(modal as HTMLElement).display !== 'none';
      });
      expect(modalVisible).toBe(false);
    }
  });
});
