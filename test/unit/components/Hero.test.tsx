/// <reference types="jest" />
/// <reference types="@testing-library/jest-dom" />

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Hero } from '@/components/sections/Hero';

describe('Hero Component', () => {
  it('renders the hero section with main heading', () => {
    render(<Hero />);

    // Look for the specific heading text from the Hero component
    const heading = screen.getByText('RescuePC Repairs', { selector: 'h1' });
    expect(heading).toBeInTheDocument();
  });

  it('renders the call-to-action button', () => {
    render(<Hero />);

    // The LicenseCTA component should render a button
    const ctaButton = screen.getByRole('button');
    expect(ctaButton).toBeInTheDocument();
  });
});

describe('Basic Test', () => {
  it('should pass', () => {
    expect(true).toBe(true);
  });
});
