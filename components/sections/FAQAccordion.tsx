'use client';

import { useState } from 'react';
// import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, ChevronUp } from 'lucide-react';

const faqs = [
  {
    question: 'What makes RescuePC Repairs different from other repair tools?',
    answer:
      'RescuePC Repairs combines military-grade security with comprehensive repair capabilities. Unlike other tools, it works completely offline, includes an 11GB driver library, and offers lifetime licensing with no recurring fees. The toolkit is designed for both professionals and home users with an intuitive interface that requires no technical knowledge.'
  },
  {
    question: 'How does the lifetime license work?',
    answer:
      'The lifetime license is a one-time payment that gives you permanent access to RescuePC Repairs. This includes all current features plus free updates for life. You can use it on unlimited computers, and there are no hidden fees or subscription costs. The license is tied to your email and can be transferred if needed.'
  },
  {
    question: 'Is my data safe during repairs?',
    answer:
      'Absolutely. RescuePC Repairs uses military-grade 256-bit encryption and operates completely offline. No data is ever transmitted to external servers. The toolkit runs in a secure environment that protects your files during the repair process. We follow strict privacy protocols to ensure your data remains confidential.'
  },
  {
    question: 'What operating systems are supported?',
    answer:
      'RescuePC Repairs supports Windows 7, 8, 10, and 11 (32-bit and 64-bit). The toolkit is designed to work with all major Windows versions and can repair issues across different Windows editions including Home, Pro, Enterprise, and Education versions.'
  },
  {
    question: 'Can I use this on multiple computers?',
    answer:
      "Yes! Your lifetime license allows you to use RescuePC Repairs on unlimited computers. Whether you're a home user with multiple PCs, a small business owner, or an IT professional, you can install and use the toolkit on as many computers as you need."
  },
  {
    question: 'What if I encounter issues during installation?',
    answer:
      'Our 24/7 support team is available to help with any installation or usage issues. We provide step-by-step guidance, remote assistance if needed, and comprehensive documentation. Most installation issues can be resolved within minutes with our expert support.'
  },
  {
    question: 'How often are updates released?',
    answer:
      "We release updates regularly to include new drivers, security patches, and feature improvements. Updates are automatically available when you launch the toolkit, and they're completely free for lifetime license holders. We typically release major updates quarterly with minor updates as needed."
  },
  {
    question: "What's included in the 11GB driver library?",
    answer:
      'Our comprehensive driver library includes drivers for graphics cards, audio devices, network adapters, storage controllers, USB devices, printers, scanners, and more. It covers hardware from major manufacturers like Intel, AMD, NVIDIA, Realtek, and hundreds of others. The library is constantly updated with the latest stable drivers.'
  }
];

export function FAQAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20 bg-gradient-to-br from-primary-950 via-primary-900 to-primary-950">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Frequently Asked Questions</h2>
          <p className="text-lg text-white/80">
            Everything you need to know about RescuePC Repairs
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {faqs.map((faq, index) => (
            <div key={index} className="mb-4">
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full glass-card p-6 text-left flex items-center justify-between hover:bg-primary-800/50 transition-colors"
              >
                <h3 className="text-lg font-semibold text-white pr-4">{faq.question}</h3>
                {openIndex === index ? (
                  <ChevronUp className="w-5 h-5 text-primary-400 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-primary-400 flex-shrink-0" />
                )}
              </button>

              {openIndex === index && (
                <div className="glass-card mt-2 p-6">
                  <p className="text-white/90 leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-white/80 mb-4">
            Still have questions? Our support team is here to help!
          </p>
          <a href="mailto:support@rescuepcrepairs.com" className="btn btn-primary">
            Contact Support
          </a>
        </div>
      </div>
    </section>
  );
}
