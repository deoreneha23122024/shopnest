import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiZap, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const slides = [
  {
    title: 'Discover New',
    highlight: 'Arrivals',
    sub: 'Shop the latest in electronics, fashion & more ?" delivered fast.',
    bg: 'from-accent/20 via-dark-800 to-dark-900',
    img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000&auto=format&fit=crop',
  },
  {
    title: 'Exclusive',
    highlight: 'Deals Today',
    sub: 'Up to 50% off on top brands. Limited time only.',
    bg: 'from-primary-400/20 via-dark-800 to-dark-900',
    img: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=1000&auto=format&fit=crop',
  },
  {
    title: 'Premium',
    highlight: 'Fashion',
    sub: "Men's & Women's collections curated for every style.",
    bg: 'from-purple-600/20 via-dark-800 to-dark-900',
    img: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1000&auto=format&fit=crop',
  },
];

export default function Banner() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentSlide((p) => (p + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((p) => (p - 1 + slides.length) % slides.length);

  const slide = slides[currentSlide];

  return (
    <section className="relative h-[80vh] min-h-[600px] flex items-center overflow-hidden pt-16">
      {/* Animated background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${slide.bg} transition-colors duration-1000`} />

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,107,53,0.5) 1px, transparent 1px), linear-gradient(to right, rgba(255,107,53,0.5) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Text */}
          <div className="flex-1 text-center lg:text-left transition-all duration-500 transform translate-y-0 opacity-100" key={currentSlide}>
            <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/30 rounded-full px-4 py-1.5 mb-6 animate-fade-in">
              <FiZap size={14} className="text-accent" />
              <span className="text-accent text-sm font-medium">New Season, New Deals</span>
            </div>
            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6 animate-fade-in-up">
              {slide.title}{' '}
              <span className="text-gradient">{slide.highlight}</span>
            </h1>
            <p className="text-gray-300 text-lg sm:text-xl mb-8 max-w-lg mx-auto lg:mx-0 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              {slide.sub}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <button onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })} className="btn-primary flex items-center justify-center gap-2 text-base py-3 px-8">
                Shop Now <FiArrowRight />
              </button>
            </div>
          </div>

          {/* Hero image */}
          <div className="flex-1 flex justify-center lg:justify-end">
            <div className="relative w-72 h-72 sm:w-[400px] sm:h-[400px] transition-all duration-700 transform scale-100" key={slide.img}>
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-accent/30 to-primary-400/30 blur-2xl" />
              <div className="relative w-full h-full rounded-3xl overflow-hidden border border-white/10 glass flex items-center justify-center animate-fade-in">
                <img
                  src={slide.img}
                  alt={slide.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Carousel Controls */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center items-center gap-6 z-20">
        <button onClick={prevSlide} className="w-10 h-10 rounded-full bg-dark-800/80 border border-dark-600 flex items-center justify-center text-white hover:bg-accent transition-colors backdrop-blur">
          <FiChevronLeft size={20} />
        </button>
        <div className="flex gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`w-2 h-2 rounded-full transition-all ${i === currentSlide ? 'w-6 bg-accent' : 'bg-gray-500 hover:bg-gray-400'}`}
            />
          ))}
        </div>
        <button onClick={nextSlide} className="w-10 h-10 rounded-full bg-dark-800/80 border border-dark-600 flex items-center justify-center text-white hover:bg-accent transition-colors backdrop-blur">
          <FiChevronRight size={20} />
        </button>
      </div>
    </section>
  );
}
