'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

export function FAQAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
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

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 via-purple-900/20 to-blue-900/20"></div>
      <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl"></div>

      <div className="container relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mb-6">
            <HelpCircle className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            Everything you need to know about RescuePC Repairs
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="faq-item transform hover:scale-[1.01] transition-all duration-300"
                style={{
                  animationDelay: `${index * 100}ms`,
                  animation: 'fadeInUp 0.6s ease-out forwards'
                }}
              >
                <button
                  onClick={() => {
                    console.log('FAQ clicked:', index, 'Current open:', openIndex);
                    setOpenIndex(openIndex === index ? null : index);
                  }}
                  className="w-full flex items-center justify-between text-left p-6 rounded-2xl transition-all duration-300 hover:bg-white/10 hover:scale-[1.02] active:scale-[0.98] group cursor-pointer"
                >
                  <h3 className="text-lg md:text-xl font-semibold text-white pr-4 group-hover:text-blue-200 transition-colors duration-300">
                    {faq.question}
                  </h3>
                  <div className="flex-shrink-0">
                    <div
                      className={`w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center transition-all duration-500 hover:scale-110 ${
                        openIndex === index
                          ? 'rotate-180 bg-gradient-to-r from-purple-500 to-blue-500'
                          : ''
                      }`}
                    >
                      <ChevronDown className="w-5 h-5 text-white transition-transform duration-500" />
                    </div>
                  </div>
                </button>
                {openIndex === index && (
                  <div className="mt-4 ml-6 mr-6 mb-6 p-6 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-2xl border border-white/20 shadow-lg">
                    <p className="text-white/90 leading-relaxed text-base md:text-lg">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mt-16">
          <div className="glass-card inline-block p-8">
            <p className="text-white/90 mb-6 text-lg">
              Still have questions? Our support team is here to help!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="cta-button">Contact Support</button>
              <button className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-2xl transition-all duration-300 border border-white/20">
                View Documentation
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
