'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';

interface CarouselSlide {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  buttonText: string;
  buttonLink: string;
  backgroundImage?: string;
  backgroundColor: string;
  textColor: string;
  buttonColor: string;
  buttonTextColor: string;
}

interface HeroCarouselProps {
  slides: CarouselSlide[];
}

export function HeroCarousel({ slides }: HeroCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying || slides.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [isAutoPlaying, slides.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false); // Stop auto-play when user manually navigates
  };

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setIsAutoPlaying(false);
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setIsAutoPlaying(false);
  };

  if (!slides || slides.length === 0) {
    return null;
  }

  const currentSlideData = slides[currentSlide];

  return (
    <section 
      className="relative w-full overflow-hidden"
      style={{ 
        height: '500px',
        minHeight: '500px',
        maxHeight: '500px',
        display: 'block'
      }}
    >
      {/* Background */}
      <div 
        className="absolute inset-0 transition-all duration-1000 ease-in-out"
        style={{ 
          backgroundColor: currentSlideData.backgroundColor,
          height: '500px',
          width: '100%'
        }}
      >
        {/* Background Image with proper cover positioning */}
        {currentSlideData.backgroundImage && (
          <div 
            className="absolute w-full"
            style={{
              height: '500px',
              top: 0,
              left: 0,
              backgroundImage: `url(${currentSlideData.backgroundImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}
          />
        )}
        {/* Overlay for better text readability */}
        <div 
          className="absolute w-full bg-black/20"
          style={{
            height: '500px',
            top: 0,
            left: 0
          }}
        />
      </div>

      {/* Content */}
      <div 
        className="relative z-10 flex items-center"
        style={{ 
          height: '500px',
          width: '100%'
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Text Content */}
            <div className="text-center lg:text-left">
              {currentSlideData.subtitle && (
                <div 
                  className="text-sm md:text-base font-medium mb-2 tracking-wider uppercase"
                  style={{ color: currentSlideData.textColor }}
                >
                  {currentSlideData.subtitle}
                </div>
              )}
              
              <h1 
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight"
                style={{ color: currentSlideData.textColor }}
              >
                {currentSlideData.title}
              </h1>
              
              {currentSlideData.description && (
                <p 
                  className="text-base md:text-lg mb-6 max-w-2xl mx-auto lg:mx-0 leading-relaxed"
                  style={{ color: currentSlideData.textColor }}
                >
                  {currentSlideData.description}
                </p>
              )}
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link href={currentSlideData.buttonLink}>
                  <Button
                    size="lg"
                    className="text-lg px-8 py-4 shadow-xl hover:shadow-2xl transition-all hover:scale-105 font-semibold"
                    style={{
                      backgroundColor: currentSlideData.buttonColor,
                      color: currentSlideData.buttonTextColor,
                    }}
                  >
                    {currentSlideData.buttonText}
                  </Button>
                </Link>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="hidden lg:block relative">
              <div className="relative w-full h-96">
                {/* Floating decorative elements */}
                <div className="absolute top-4 left-4 w-16 h-16 bg-white/20 rounded-full flex items-center justify-center animate-bounce">
                  <Star className="w-8 h-8 text-white" />
                </div>
                <div className="absolute top-20 right-8 w-12 h-12 bg-white/20 rounded-full flex items-center justify-center animate-pulse">
                  <Star className="w-6 h-6 text-white" />
                </div>
                <div className="absolute bottom-8 left-8 w-20 h-20 bg-white/20 rounded-full flex items-center justify-center animate-bounce delay-1000">
                  <Star className="w-10 h-10 text-white" />
                </div>
                <div className="absolute bottom-16 right-4 w-14 h-14 bg-white/20 rounded-full flex items-center justify-center animate-pulse delay-500">
                  <Star className="w-7 h-7 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      {slides.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-4 z-20 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-all duration-200 backdrop-blur-sm"
            style={{ top: '50%', transform: 'translateY(-50%)' }}
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <button
            onClick={goToNext}
            className="absolute right-4 z-20 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-all duration-200 backdrop-blur-sm"
            style={{ top: '50%', transform: 'translateY(-50%)' }}
            aria-label="Next slide"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {slides.length > 1 && (
        <div 
          className="absolute left-1/2 z-20 flex space-x-2"
          style={{ 
            bottom: '24px',
            transform: 'translateX(-50%)'
          }}
        >
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-200 ${
                index === currentSlide
                  ? 'bg-white scale-125'
                  : 'bg-white/50 hover:bg-white/70'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Auto-play indicator */}
      {slides.length > 1 && (
        <div 
          className="absolute z-20"
          style={{ 
            top: '16px',
            right: '16px'
          }}
        >
          <button
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-all duration-200 backdrop-blur-sm"
            aria-label={isAutoPlaying ? 'Pause slideshow' : 'Play slideshow'}
          >
            <div className={`w-4 h-4 ${isAutoPlaying ? 'animate-pulse' : ''}`}>
              {isAutoPlaying ? '⏸️' : '▶️'}
            </div>
          </button>
        </div>
      )}
    </section>
  );
}
