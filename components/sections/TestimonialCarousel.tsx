'use client';

import { useState, useEffect } from 'react';
// import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Quote, Star } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: 'Mike Rodriguez',
    role: 'IT Manager, TechSolutions Inc.',
    content:
      'RescuePC Repairs saved my business! I had 15 computers down with driver issues. This toolkit fixed them all in under 2 hours. The 11GB driver library is incredible - it had drivers for every single device. ROI was immediate.',
    rating: 5,
    avatar: '👨‍💼'
  },
  {
    id: 2,
    name: 'Sarah Chen',
    role: 'Computer Repair Specialist',
    content:
      'As a computer repair technician, this is now my go-to tool. The USB portability means I can fix any PC anywhere. The malware scanner is top-notch, and the Windows error repair module is incredibly effective.',
    rating: 5,
    avatar: '👩‍💻'
  },
  {
    id: 3,
    name: 'David Thompson',
    role: 'Gaming Enthusiast',
    content:
      'Fixed my gaming PC in 10 minutes! Had audio issues and missing network drivers. RescuePC Repairs detected and installed everything automatically. The military-grade security gives me peace of mind.',
    rating: 5,
    avatar: '🎮'
  },
  {
    id: 4,
    name: 'Lisa Johnson',
    role: 'Office Manager, Creative Agency',
    content:
      'Perfect for our small business! We have 8 computers and this toolkit keeps them all running smoothly. The lifetime license is amazing value. Customer support is responsive and helpful.',
    rating: 5,
    avatar: '👩‍💼'
  },
  {
    id: 5,
    name: 'Dr. Robert Williams',
    role: 'IT Director, University Tech Dept.',
    content:
      'Incredible tool for educational institutions. We use it across our computer lab with 50+ machines. The offline capability is crucial for our environment. Highly recommend for schools and universities.',
    rating: 5,
    avatar: '👨‍🎓'
  },
  {
    id: 6,
    name: 'Alex Martinez',
    role: 'Owner, PC Repair Pro',
    content:
      'Best investment for my computer repair business. The white-label option lets me brand it as my own service. Clients love the professional interface and comprehensive repair capabilities.',
    rating: 5,
    avatar: '🔧'
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
    <section className="py-24 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-indigo-900/20"></div>
      <div className="absolute top-0 left-0 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>

      <div className="container relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            What Our Customers Say
          </h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            Real experiences from professionals who trust RescuePC Repairs
          </p>
        </div>

        {/* Mobile Testimonials */}
        <div className="block md:hidden">
          <div className="space-y-6">
            {testimonials.slice(0, 3).map((testimonial, index) => (
              <div key={index} className="glass-card p-6">
                <div className="flex items-center mb-4">
                  <div className="text-3xl mr-4">{testimonial.avatar}</div>
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <h4 className="font-semibold text-white">{testimonial.name}</h4>
                    <p className="text-white/60 text-sm">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-white/90 italic">"{testimonial.content}"</p>
              </div>
            ))}
          </div>
        </div>

        {/* Desktop Testimonials */}
        <div className="hidden md:block">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {testimonials.slice(0, 3).map((testimonial, index) => (
              <div key={index} className="glass-card p-8 h-full">
                <div className="flex items-start mb-6">
                  <div className="text-4xl mr-4">{testimonial.avatar}</div>
                  <div className="flex-1">
                    <div className="flex items-center mb-3">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <h4 className="font-semibold text-white text-lg">{testimonial.name}</h4>
                    <p className="text-white/60 text-sm">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-white/90 italic leading-relaxed">"{testimonial.content}"</p>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <div className="text-center mt-16">
          <div className="inline-flex flex-col sm:flex-row items-center gap-8 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-400/30 rounded-2xl px-8 py-6 backdrop-blur-sm">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white">4.9/5</div>
              <div className="text-white/60 text-sm">Customer Rating</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white">99.9%</div>
              <div className="text-white/60 text-sm">Success Rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white">24/7</div>
              <div className="text-white/60 text-sm">Support Available</div>
            </div>
          </div>
        </div>

        {/* Navigation Dots */}
        <div className="flex justify-center mt-8">
          <div className="flex space-x-2">
            {testimonials.slice(0, 3).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex ? 'bg-white' : 'bg-white/30'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
