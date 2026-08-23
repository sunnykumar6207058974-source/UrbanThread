import React, { useState, useEffect } from 'react';
import { HERO_SLIDES } from '../data/ecommerceData';
import { useEcommerce } from '../context/EcommerceContext';
import { ArrowRight, ChevronLeft, ChevronRight, Tag, Sparkles } from 'lucide-react';

export const HeroBanner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { setSelectedCategory, showToast } = useEcommerce();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const slide = HERO_SLIDES[currentSlide];

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  };

  const handleApplyHeroCode = (code) => {
    navigator.clipboard.writeText(code);
    showToast(`📋 Copied code "${code}" to clipboard!`);
  };

  return (
    <section className="hero-banner-section">
      <div
        className="hero-slide-container"
        style={{ background: slide.bgGradient }}
      >
        <div className="hero-content">
          <div className="hero-badge animate-fade-in">
            <Sparkles size={16} /> {slide.badge}
          </div>
          <h1 className="hero-title animate-slide-up">{slide.title}</h1>
          <p className="hero-subtitle animate-slide-up-delay">{slide.subtitle}</p>

          <div className="hero-promo-pill">
            <Tag size={16} /> Use Code: <span className="code-box">{slide.code}</span>
            <button
              className="copy-code-btn"
              onClick={() => handleApplyHeroCode(slide.code)}
            >
              COPY
            </button>
          </div>

          <div className="hero-actions">
            <a
              href="#products"
              className="btn btn-primary btn-lg"
              onClick={() => setSelectedCategory(slide.category)}
            >
              {slide.buttonText} <ArrowRight size={18} />
            </a>
            <a href="#flash-sale" className="btn btn-outline-light btn-lg">
              FLASH DEALS
            </a>
          </div>
        </div>

        {/* Hero Image Card Showcase */}
        <div className="hero-image-wrapper">
          <div className="hero-image-card">
            <img src={slide.image} alt={slide.title} className="hero-image" />
            <div className="image-overlay-glow"></div>
            <div className="floating-offer-badge">
              <span className="offer-percent">MIN. 50% OFF</span>
              <span className="offer-sub">ON TOP BRANDS</span>
            </div>
          </div>
        </div>

        {/* Carousel Controls */}
        <button className="slider-arrow prev-arrow" onClick={handlePrev} aria-label="Previous Slide">
          <ChevronLeft size={24} />
        </button>
        <button className="slider-arrow next-arrow" onClick={handleNext} aria-label="Next Slide">
          <ChevronRight size={24} />
        </button>

        {/* Slide Indicators */}
        <div className="slider-indicators">
          {HERO_SLIDES.map((item, index) => (
            <button
              key={item.id}
              className={`indicator-dot ${index === currentSlide ? 'active' : ''}`}
              onClick={() => setCurrentSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
