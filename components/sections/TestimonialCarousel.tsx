'use client';

import { useState, useEffect } from 'react';
// import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: 'Mike Rodriguez',
    role: 'IT Manager, TechSolutions Inc.',
    content:
      'RescuePC Repairs saved my business! I had 15 computers down with driver issues. This toolkit fixed them all in under 2 hours. The 11GB driver library is incredible - it had drivers for every single device. ROI was immediate.',
    rating: 5
  },
  {
    id: 2,
    name: 'Sarah Chen',
    role: 'Computer Repair Specialist',
    content:
      'As a computer repair technician, this is now my go-to tool. The USB portability means I can fix any PC anywhere. The malware scanner is top-notch, and the Windows error repair module is incredibly effective.',
    rating: 5
  },
  {
    id: 3,
    name: 'David Thompson',
    role: 'Gaming Enthusiast',
    content:
      'Fixed my gaming PC in 10 minutes! Had audio issues and missing network drivers. RescuePC Repairs detected and installed everything automatically. The military-grade security gives me peace of mind.',
    rating: 5
  },
  {
    id: 4,
    name: 'Lisa Johnson',
    role: 'Office Manager, Creative Agency',
    content:
      'Perfect for our small business! We have 8 computers and this toolkit keeps them all running smoothly. The lifetime license is amazing value. Customer support is responsive and helpful.',
    rating: 5
  },
  {
    id: 5,
    name: 'Dr. Robert Williams',
    role: 'IT Director, University Tech Dept.',
    content:
      'Incredible tool for educational institutions. We use it across our computer lab with 50+ machines. The offline capability is crucial for our environment. Highly recommend for schools and universities.',
    rating: 5
  },
  {
    id: 6,
    name: 'Alex Martinez',
    role: 'Owner, PC Repair Pro',
    content:
      'Best investment for my computer repair business. The white-label option lets me brand it as my own service. Clients love the professional interface and comprehensive repair capabilities.',
    rating: 5
  }
];

export function TestimonialCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="py-20 bg-gradient-to-br from-primary-950 via-primary-900 to-primary-800">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Trusted by Thousands of Users Worldwide
          </h2>
          <p className="text-lg text-white/80">See what our customers say about RescuePC Repairs</p>
        </div>

        <div className="max-w-4xl mx-auto relative">
          <div className="relative overflow-hidden rounded-2xl">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="w-full flex-shrink-0 px-4">
                  <div className="glass-card p-8 text-center">
                    <div className="mb-6">
                      <Quote className="w-12 h-12 text-primary-400 mx-auto mb-4" />
                      <p className="text-lg text-white/90 italic mb-6">"{testimonial.content}"</p>
                    </div>
                    <div className="flex items-center justify-center gap-2 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <span key={i} className="text-yellow-400 text-xl">
                          ★
                        </span>
                      ))}
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-1">{testimonial.name}</h4>
                      <p className="text-white/70 text-sm">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={prevTestimonial}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-primary-800/80 hover:bg-primary-700 text-white p-2 rounded-full transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={nextTestimonial}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-primary-800/80 hover:bg-primary-700 text-white p-2 rounded-full transition-colors"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* Dots Indicator */}
        <div className="flex justify-center mt-8 gap-2">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentIndex ? 'bg-primary-400' : 'bg-white/30'
              }`}
            />
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary-400 mb-2">4.9/5</div>
            <div className="text-white/80">Customer Rating</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary-400 mb-2">99.9%</div>
            <div className="text-white/80">Success Rate</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary-400 mb-2">24/7</div>
            <div className="text-white/80">Support Available</div>
          </div>
        </div>
      </div>
    </section>
  );
}
