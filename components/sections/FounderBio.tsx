import React from 'react';

export function FounderBio() {
  return (
    <section className="py-20 bg-gradient-to-br from-primary-950 via-primary-900 to-primary-800">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto glass-card p-10 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Meet the Founder</h2>
          <h3 className="text-xl font-semibold text-blue-300 mb-2">Tyler Keesee</h3>
          <p className="text-blue-200 mb-2">Founder & Lead Developer</p>
          <p className="text-white/90 mb-6">6+ Years Experience</p>
          <p className="text-white/80 text-lg mb-6">
            Hi, I'm Tyler, a 24-year-old Computer Science student with a passion for building
            high-performance systems. With 6+ years of experience in Windows repair and
            optimization, I've created RescuePC Repairs with military-grade security standards.
            <br />
            <br />
            Every line of code is designed for maximum security, scalability, and performance. This
            enterprise infrastructure can handle millions of users while maintaining the highest
            security standards.
            <br />
            <br />
            After fixing hundreds of computers and seeing the same problems repeatedly, I thought to
            myself: "There had to be a better way." What started as a personal project to streamline
            my own repair process has evolved into RescuePC Repairs—a comprehensive toolkit that
            makes professional Windows repair accessible to everyone.
          </p>
        </div>
      </div>
    </section>
  );
}
