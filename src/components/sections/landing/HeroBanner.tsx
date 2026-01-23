import React from "react";
import WellnessHeroIllustration from "./WellnessHeroIllustration";

const HeroBanner: React.FC = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20">
      {/* Soft ambient background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-sky-50/40 to-blue-50/60" />

      {/* Background Illustration Layer */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <img src="src/assets/sunrise.jpeg" alt="" className="w-full h-full object-cover opacity-60 scale-105 animate-[slowZoom_20s_ease-out_infinite_alternate]"/>
      </div>

      {/* Hand Image Layer - Above Background */}
      <div className="absolute inset-0 z-10 pointer-events-none flex items-center justify-start">
        <img
          src="src/assets/hand1.png"
          alt=""
          className="w-full h-full object-cover"
        />
      </div>


      {/* Content Center Container */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex flex-col items-center justify-center text-center min-h-[80vh] sm:min-h-[85vh] space-y-8 sm:space-y-10">
          {/* Main Text Content */}
          <div className="space-y-8 max-w-3xl">
            {/* Headline */}
            <div className="space-y-4 opacity-0 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <h1 className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight leading-[1.1] text-slate-900 px-4">
                Build a{" "}
                <span className="bg-gradient-to-r from-brand-orange to-rose-500 bg-clip-text text-transparent">
                  healthier
                </span>{" "}
                mind
              </h1>
              <p className="text-base sm:text-lg md:text-2xl font-light text-white leading-relaxed max-w-2xl mx-auto px-6">
                Trauma-focused mental healthcare designed to restore safety and
                emotional well-being through professional guidance.
              </p>
            </div>

            {/* Single CTA */}
            <div className="opacity-0 animate-slide-up flex justify-center px-6" style={{ animationDelay: '0.4s' }}>
              <button 
                onClick={() => document.getElementById('assessment')?.scrollIntoView({ behavior: 'smooth' })}
                className="group cursor-pointer relative inline-flex items-center justify-center w-full sm:w-auto px-8 sm:px-12 py-4 sm:py-6 bg-brand-orange text-white text-lg sm:text-[1.25rem] font-bold rounded-2xl transition-all duration-300 hover:bg-brand-orange/90 active:scale-[0.98] shadow-[0_12px_48px_rgba(249,115,22,0.3)] hover:shadow-[0_16px_64px_rgba(249,115,22,0.4)] focus:outline-none"
              >
                Start your journey
                <svg
                  className="ml-3 w-5 h-5 sm:w-6 sm:h-6 transition-transform duration-300 group-hover:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </button>
            </div>
          </div>
          
          {/* ... existing headline and CTA ... skipping to trust indicators for precise replacement */}

          {/* Trust indicators */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 px-4 text-xs sm:text-sm md:text-base text-slate-500 opacity-0 animate-slide-up" style={{ animationDelay: '0.6s' }}>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-white">Professional therapists</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-white">Safe & confidential</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-white">Trauma-focused</span>
            </div>
          </div>
        </div>
      </div>

    </section>
  );
};

export default HeroBanner;
