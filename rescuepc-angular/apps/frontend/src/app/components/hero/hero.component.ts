import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

// Icon interfaces for type safety
interface Feature {
  icon: string;
  text: string;
}

interface Platform {
  name: string;
  icon: string;
  versions: string;
}

interface SecurityFeature {
  icon: string;
  title: string;
  desc: string;
}

interface TrustBadge {
  icon: string;
  text: string;
}

interface Stat {
  number: string;
  label: string;
}

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.css'],
})
export class HeroComponent implements OnInit {
  isLoading = false;
  isVisible = false;

  // Data arrays
  features: Feature[] = [
    { icon: '🩺', text: 'Professional diagnostics' },
    { icon: '📊', text: 'Real-time monitoring' },
    { icon: '⚙️', text: 'Advanced algorithms' },
    { icon: '⬇️', text: 'One-click drivers' },
    { icon: '🛡️', text: 'Security protection' },
    { icon: '🔧', text: 'Enterprise ready' },
  ];

  platforms: Platform[] = [
    { name: 'Windows', icon: '🪟', versions: '7, 8, 10, 11' },
    { name: 'Linux', icon: '🐧', versions: 'Ubuntu, Debian, Fedora' },
    { name: 'macOS', icon: '🍎', versions: '10.14+ to 13+' },
    { name: 'ChromeOS', icon: '🌐', versions: '80+ to 100+' },
    { name: 'BSD', icon: '🔧', versions: 'FreeBSD, OpenBSD' },
  ];

  securityFeatures: SecurityFeature[] = [
    { icon: '🔒', title: '256-bit Encryption', desc: 'Bank-level security' },
    { icon: '⬇️', title: 'Offline Operation', desc: 'No data transmission' },
    { icon: '🛡️', title: 'Privacy First', desc: 'No tracking or collection' },
    { icon: '🖥️', title: 'Secure Environment', desc: 'Isolated execution' },
  ];

  trustBadges: TrustBadge[] = [
    { icon: '🛡️', text: 'Military-Grade Security Certified' },
    { icon: '🖥️', text: 'Enterprise Container Platform' },
    { icon: '⏰', text: '99.9% Uptime Guarantee' },
    { icon: '👥', text: 'Built by enterprise experts' },
  ];

  stats: Stat[] = [
    { number: '11GB', label: 'Driver Database' },
    { number: '200+', label: 'Repair Scripts' },
    { number: '5', label: 'OS Support' },
    { number: '99.9%', label: 'Success Rate' },
  ];

  ngOnInit(): void {
    // Trigger animation on component init
    setTimeout(() => {
      this.isVisible = true;
    }, 100);
  }

  handleGetStarted(): void {
    this.isLoading = true;

    // Scroll to pricing section
    const pricingElement = document.getElementById('pricing');
    if (pricingElement) {
      pricingElement.scrollIntoView({ behavior: 'smooth' });
    }

    // Reset loading state after animation
    setTimeout(() => {
      this.isLoading = false;
    }, 1000);
  }
}
