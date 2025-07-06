import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

// FAQ interface for type safety
interface FAQ {
  question: string;
  answer: string;
}

@Component({
  selector: 'app-faq-accordion',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './faq-accordion.component.html',
  styleUrls: ['./faq-accordion.component.css']
})
export class FAQAccordionComponent {
  openIndex: number | null = null;

  faqs: FAQ[] = [
    {
      question: 'What makes RescuePC Repairs different from other repair tools?',
      answer:
        'RescuePC Repairs offers military-grade security, offline operation, comprehensive driver database (11GB), and multi-platform support. Unlike other tools, it works completely offline with no data collection, ensuring maximum privacy and security.'
    },
    {
      question: 'How does the lifetime license work?',
      answer:
        'The lifetime license is a one-time payment that gives you unlimited access to all current and future features. No recurring fees, no subscriptions - just pay once and use forever with free lifetime updates.'
    },
    {
      question: 'Is my data safe during repairs?',
      answer:
        'Absolutely. RescuePC Repairs uses 256-bit encryption and operates completely offline. No data is transmitted to external servers, ensuring your privacy and security are never compromised.'
    },
    {
      question: 'What operating systems are supported?',
      answer:
        'We support Windows (7, 8, 10, 11), Linux (Ubuntu, Debian, Fedora, CentOS), macOS (10.14+), ChromeOS (80+), and BSD (FreeBSD, OpenBSD, NetBSD).'
    },
    {
      question: 'Can I use this on multiple computers?',
      answer:
        'Yes, depending on your license. Basic license covers 1 PC, Professional covers 5 PCs, Enterprise covers 25 PCs, Government covers 100 PCs, and Lifetime Enterprise covers unlimited PCs.'
    },
    {
      question: 'What if I encounter issues during installation?',
      answer:
        'Our 24/7 support team is available to help with any installation or usage issues. We provide live chat, email support, and phone assistance to ensure you get the help you need.'
    },
    {
      question: 'How often are updates released?',
      answer:
        'We release updates monthly with new features, security improvements, and driver database updates. Lifetime license holders get all updates automatically at no additional cost.'
    },
    {
      question: "What's included in the 11GB driver library?",
      answer:
        'Our comprehensive driver library includes drivers for all major hardware manufacturers, network adapters, graphics cards, audio devices, and more. It covers Windows, Linux, and macOS drivers.'
    }
  ];

  toggleFAQ(index: number): void {
    console.log('FAQ clicked:', index, 'Current open:', this.openIndex);
    this.openIndex = this.openIndex === index ? null : index;
  }

  isOpen(index: number): boolean {
    return this.openIndex === index;
  }

  getAnimationDelay(index: number): string {
    return `${index * 100}ms`;
  }

  contactSupport(): void {
    // Implement contact support functionality
    window.open('mailto:support@rescuepcrepairs.com', '_blank');
  }

  viewDocumentation(): void {
    // Implement documentation link
    window.open('https://docs.rescuepcrepairs.com', '_blank');
  }
} 