import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface FooterLink {
  name: string;
  href: string;
}

interface FooterSection {
  title: string;
  links: FooterLink[];
}

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
})
export class FooterComponent {
  footerSections: FooterSection[] = [
    {
      title: 'Product',
      links: [
        { name: 'Features', href: '#features' },
        { name: 'Pricing', href: '#pricing' },
        { name: 'Knowledge Base', href: '#knowledge-base' },
        { name: 'Download', href: '#download' },
        { name: 'Product Flyer', href: '#flyer' },
      ],
    },
    {
      title: 'Support',
      links: [
        { name: 'Email Support', href: 'mailto:rescuepcrepair@yahoo.com' },
        { name: 'Support Center', href: '#support' },
        { name: 'Documentation', href: '#docs' },
        { name: 'FAQ', href: '#faq' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { name: 'Privacy Policy', href: '#privacy' },
        { name: 'Terms of Service', href: '#terms' },
        { name: 'Refund Policy', href: '#refund' },
        { name: 'License', href: '#license' },
      ],
    },
  ];

  contactInfo = [
    { icon: '📧', text: 'rescuepcrepair@yahoo.com' },
    { icon: '📞', text: '24/7 Support Available' },
    { icon: '🌐', text: 'Worldwide Service' },
  ];

  scrollToSection(href: string): void {
    if (href.startsWith('#')) {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }
}
