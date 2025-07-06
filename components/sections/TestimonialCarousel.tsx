'use client';

import { useState, useEffect, useMemo, useCallback, memo } from 'react';
// import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Quote, Star } from 'lucide-react';

// Memoized testimonials data to prevent recreation on every render
const TESTIMONIALS_DATA = [
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
    name: 'Maria Garcia',
    role: 'System Administrator, Healthcare Network',
    content:
      'Critical for our healthcare environment. We need reliable, secure tools that work offline. RescuePC Repairs meets all our requirements and has reduced our IT support tickets by 80%.',
    rating: 5,
    avatar: '🏥'
  },
  {
    id: 7,
    name: 'James Wilson',
    role: 'Cybersecurity Consultant',
    content:
      'The security features are impressive. Military-grade encryption and offline operation make this perfect for sensitive environments. I recommend this to all my clients who need reliable PC repair tools.',
    rating: 5,
    avatar: '🔒'
  },
  {
    id: 8,
    name: 'Emily Davis',
    role: 'Remote IT Support Specialist',
    content:
      'Game-changer for remote support. The USB portability and comprehensive driver database mean I can fix any PC issue remotely. The automated repair scripts save hours of manual work.',
    rating: 5,
    avatar: '💻'
  }
];

// Memoized components to prevent unnecessary re-renders
const TestimonialCard = memo(({ testimonial }: { testimonial: typeof TESTIMONIALS_DATA[0] }) => (
  <div className="glass-card p-8 text-center max-w-4xl mx-auto">
    <div className="flex items-center justify-center mb-6">
      <Quote className="w-8 h-8 text-blue-400 mr-2" />
      <div className="text-4xl">{testimonial.avatar}</div>
      <Quote className="w-8 h-8 text-blue-400 ml-2" />
    </div>
    
    <p className="text-lg md:text-xl text-white/90 leading-relaxed mb-6 italic">
      "{testimonial.content}"
    </p>
    
    <div className="flex items-center justify-center gap-1 mb-4">
      {[...Array(testimonial.rating)].map((_, i) => (
        <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
      ))}
    </div>
    
    <div>
      <h4 className="text-white font-bold text-lg">{testimonial.name}</h4>
      <p className="text-white/70 text-sm">{testimonial.role}</p>
    </div>
  </div>
));

const NavigationButton = memo(({ 
  direction, 
  onClick, 
  disabled 
}: { 
  direction: 'prev' | 'next'; 
  onClick: () => void; 
  disabled: boolean;
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`absolute top-1/2 transform -translate-y-1/2 z-10 w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${
      direction === 'prev' ? 'left-4' : 'right-4'
    }`}
  >
    {direction === 'prev' ? (
      <ChevronLeft className="w-6 h-6" />
    ) : (
      <ChevronRight className="w-6 h-6" />
    )}
  </button>
));

const DotIndicator = memo(({ 
  active, 
  onClick 
}: { 
  active: boolean; 
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={`w-3 h-3 rounded-full transition-all duration-300 ${
      active ? 'bg-blue-400 scale-125' : 'bg-white/30 hover:bg-white/50'
    }`}
  />
));

export function TestimonialCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Memoized navigation callbacks to prevent recreation on every render
  const handlePrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? TESTIMONIALS_DATA.length - 1 : prev - 1));
  }, []);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === TESTIMONIALS_DATA.length - 1 ? 0 : prev + 1));
  }, []);

  const handleDotClick = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  // Memoized current testimonial to prevent recalculation
  const currentTestimonial = useMemo(() => TESTIMONIALS_DATA[currentIndex], [currentIndex]);

  // Auto-advance carousel
  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, 5000);

    return () => clearInterval(interval);
  }, [handleNext]);

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-float"></div>
        <div
          className="absolute bottom-0 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-float"
          style={{ animationDelay: '2s' }}
        ></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Enhanced Header */}
        <div
          className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white gradient-text mb-6">
            What Our Users Say
          </h2>
          <p className="text-xl md:text-2xl text-white/90 max-w-4xl mx-auto leading-relaxed">
            Trusted by <strong className="text-white">10,000+ professionals</strong> worldwide
          </p>
        </div>

        {/* Enhanced Carousel */}
        <div
          className={`relative transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        >
          <div className="relative max-w-6xl mx-auto">
            <TestimonialCard testimonial={currentTestimonial} />
            
            {/* Navigation Buttons */}
            <NavigationButton direction="prev" onClick={handlePrevious} disabled={false} />
            <NavigationButton direction="next" onClick={handleNext} disabled={false} />
          </div>

          {/* Enhanced Dot Indicators */}
          <div className="flex justify-center gap-3 mt-8">
            {TESTIMONIALS_DATA.map((_, index) => (
              <DotIndicator
                key={index}
                active={index === currentIndex}
                onClick={() => handleDotClick(index)}
              />
            ))}
          </div>
        </div>

        {/* Enhanced Stats */}
        <div
          className={`grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 transition-all duration-1000 delay-600 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        >
          {[
            { number: '10,000+', label: 'Happy Users' },
            { number: '99.9%', label: 'Success Rate' },
            { number: '24/7', label: 'Support Available' },
            { number: '5.0', label: 'Average Rating' }
          ].map((stat, index) => (
            <div key={index} className="glass-card text-center p-6">
              <div className="text-3xl font-black text-white mb-2">{stat.number}</div>
              <div className="text-white/70 text-sm font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
