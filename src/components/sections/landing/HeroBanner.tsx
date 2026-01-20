import React from "react";
import WellnessHeroIllustration from "./WellnessHeroIllustration";

const HeroBanner: React.FC = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20">
      {/* Soft ambient background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-sky-50/40 to-blue-50/60" />

      {/* Content Grid - Split layout */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 py-12 md:py-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center min-h-[80vh]">
          {/* Left side - Text content */}
          <div className="space-y-8 md:space-y-10 text-center lg:text-left order-2 lg:order-1">
            {/* Headline */}
            <div className="space-y-6 opacity-0 animate-[slide-up_1s_ease-out_0.2s_forwards]">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] text-slate-900">
                Build a{" "}
                <span className="bg-gradient-to-r from-brand-orange to-rose-500 bg-clip-text text-transparent">
                  healthier
                </span>{" "}
                mind
              </h1>
              <p className="text-lg md:text-xl font-light text-slate-600 leading-relaxed max-w-xl mx-auto lg:mx-0">
                Trauma-focused mental healthcare designed to restore safety and
                emotional well-being through professional guidance.
              </p>
            </div>

            {/* Single CTA */}
            <div className="opacity-0 animate-[slideUp_1s_ease-out_0.4s_forwards]">
              <button className="group cursor-pointer relative inline-flex items-center justify-center px-10 py-5 bg-brand-orange text-white text-[1.125rem] font-bold rounded-xl transition-all duration-300 hover:bg-brand-orange/90 hover:px-12 active:scale-[0.98] shadow-[0_8px_32px_rgba(249,115,22,0.25)] hover:shadow-[0_12px_48px_rgba(249,115,22,0.35)] focus:outline-none focus-visible:outline-none focus:ring-0">
                Start your journey
                <svg
                  className="ml-2 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"
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

            {/* Trust indicators */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 text-sm text-slate-500 opacity-0 animate-[slideUp_1s_ease-out_0.6s_forwards]">
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-green-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Professional therapists</span>
              </div>
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-green-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Safe & confidential</span>
              </div>
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-green-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Trauma-focused</span>
              </div>
            </div>
          </div>

          {/* Right side - Premium Mental Wellness Illustration */}
          <div className="relative w-full h-[500px] md:h-[600px] lg:h-[700px] order-1 lg:order-2 opacity-0 animate-[fadeIn_1.2s_ease-out_0.3s_forwards]">
            <WellnessHeroIllustration />
          </div>
        </div>
      </div>

      {/* Subtle bottom gradient for smooth transition */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white/60 to-transparent pointer-events-none" />
    </section>
  );
};

export default HeroBanner;
