import React from "react";

const HeroBanner: React.FC = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-blue-50 via-purple-50 to-orange-50">
      {/* Sunrise Background - Slow fade-in with upward movement */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-amber-200/40 via-orange-100/30 to-transparent animate-[sunrise_3s_ease-out_forwards]"></div>

        {/* Animated Sun */}
        <div className="absolute top-[15%] left-1/2 -translate-x-1/2 w-32 h-32 md:w-48 md:h-48 rounded-full bg-gradient-to-br from-yellow-300 to-orange-400 opacity-0 animate-[sunRise_4s_ease-out_0.5s_forwards] blur-2xl"></div>
        <div className="absolute top-[15%] left-1/2 -translate-x-1/2 w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-yellow-200 to-orange-300 opacity-0 animate-[sunRise_4s_ease-out_0.5s_forwards]"></div>

        {/* Light rays */}
        <div className="absolute top-[15%] left-1/2 -translate-x-1/2 w-96 h-96 opacity-0 animate-[glowPulse_6s_ease-in-out_1s_infinite]">
          <div className="absolute inset-0 bg-gradient-radial from-yellow-200/30 via-orange-200/20 to-transparent blur-3xl"></div>
        </div>
      </div>

      {/* Decorative Plants/Flowers - Left Side */}
      <div className="absolute left-0 bottom-0 w-64 h-96 opacity-0 animate-[growIn_2s_ease-out_1.5s_forwards] z-10">
        {/* Plant stems and leaves */}
        <div className="absolute bottom-0 left-8 w-2 h-64 bg-gradient-to-t from-green-600 to-green-400 rounded-full origin-bottom animate-[sway_4s_ease-in-out_infinite]"></div>
        <div className="absolute bottom-32 left-6 w-16 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full opacity-80 origin-bottom-right animate-[sway_3s_ease-in-out_0.5s_infinite]" style={{clipPath: 'ellipse(70% 100% at 30% 100%)'}}></div>
        <div className="absolute bottom-40 left-10 w-20 h-28 bg-gradient-to-bl from-green-300 to-green-500 rounded-full opacity-70 origin-bottom-left animate-[sway_3.5s_ease-in-out_1s_infinite]" style={{clipPath: 'ellipse(70% 100% at 70% 100%)'}}></div>

        {/* Flowers */}
        <div className="absolute bottom-48 left-4 w-8 h-8 bg-pink-400 rounded-full opacity-0 animate-[bloomIn_1.5s_ease-out_2.5s_forwards]"></div>
        <div className="absolute bottom-56 left-14 w-10 h-10 bg-purple-400 rounded-full opacity-0 animate-[bloomIn_1.5s_ease-out_3s_forwards]"></div>
      </div>

      {/* Decorative Plants/Flowers - Right Side */}
      <div className="absolute right-0 bottom-0 w-64 h-96 opacity-0 animate-[growIn_2s_ease-out_1.8s_forwards] z-10">
        {/* Plant stems and leaves */}
        <div className="absolute bottom-0 right-8 w-2 h-56 bg-gradient-to-t from-green-700 to-green-500 rounded-full origin-bottom animate-[sway_3.5s_ease-in-out_0.8s_infinite]"></div>
        <div className="absolute bottom-28 right-6 w-18 h-26 bg-gradient-to-bl from-green-500 to-green-700 rounded-full opacity-80 origin-bottom-left animate-[sway_4s_ease-in-out_1.2s_infinite]" style={{clipPath: 'ellipse(70% 100% at 70% 100%)'}}></div>
        <div className="absolute bottom-36 right-10 w-22 h-30 bg-gradient-to-br from-green-400 to-green-600 rounded-full opacity-70 origin-bottom-right animate-[sway_3.2s_ease-in-out_0.3s_infinite]" style={{clipPath: 'ellipse(70% 100% at 30% 100%)'}}></div>

        {/* Flowers and fruits */}
        <div className="absolute bottom-44 right-5 w-9 h-9 bg-orange-400 rounded-full opacity-0 animate-[bloomIn_1.5s_ease-out_2.8s_forwards]"></div>
        <div className="absolute bottom-52 right-12 w-8 h-8 bg-yellow-400 rounded-full opacity-0 animate-[bloomIn_1.5s_ease-out_3.2s_forwards]"></div>
      </div>

      {/* Water Element at Bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-40 z-[5]">
        {/* Water layers with wave animation */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-blue-400/30 via-blue-300/20 to-transparent animate-[waterFlow_8s_ease-in-out_infinite]"></div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-cyan-400/25 via-cyan-300/15 to-transparent animate-[waterFlow_6s_ease-in-out_1s_infinite]"></div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-teal-400/20 via-teal-300/10 to-transparent animate-[waterFlow_10s_ease-in-out_0.5s_infinite]"></div>

        {/* Water ripples */}
        <div className="absolute bottom-8 left-1/4 w-32 h-2 bg-white/10 rounded-full animate-[ripple_4s_ease-in-out_infinite]"></div>
        <div className="absolute bottom-12 right-1/3 w-24 h-2 bg-white/10 rounded-full animate-[ripple_5s_ease-in-out_1s_infinite]"></div>
      </div>

      {/* Main Hands Image - Center Focus */}
      <div className="relative z-20 opacity-0 animate-[handsFloat_3s_ease-out_0.8s_forwards]">
        <div className="relative w-72 h-72 md:w-96 md:h-96 mb-8 animate-[floatingSlow_6s_ease-in-out_infinite]">
          {/* Healing glow behind hands */}
          <div className="absolute inset-0 bg-gradient-radial from-brand-blue/20 via-purple-400/10 to-transparent rounded-full blur-3xl animate-[glowPulse_4s_ease-in-out_infinite]"></div>

          {/* Hands illustration placeholder - You can replace with actual image */}
          <div className="relative w-full h-full flex items-center justify-center">
            <img
              src="https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=800&auto=format&fit=crop&q=80"
              alt="Caring hands representing support and healing"
              className="w-full h-full object-contain drop-shadow-2xl"
            />
          </div>
        </div>
      </div>

      {/* Content Area - Below hands */}
      <div className="absolute bottom-48 md:bottom-56 left-0 right-0 z-30 w-full max-w-7xl mx-auto px-6 md:px-12 text-center">
        <div className="max-w-3xl mx-auto space-y-6 md:space-y-8">
          {/* Headline */}
          <div className="space-y-6 opacity-0 animate-[slideUpFade_1s_ease-out_1.5s_forwards]">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] text-brand-blue-900">
              Build a <span className="text-brand-orange">healthier</span>{" "}
              mind
            </h1>
            <p className="text-lg md:text-xl font-medium text-gray-700 leading-relaxed max-w-2xl mx-auto">
              Trauma-focused mental healthcare designed to restore safety and
              emotional well-being through professional guidance.
            </p>
          </div>

          {/* CTA Button */}
          <div className="opacity-0 animate-[slideUpFade_1s_ease-out_2s_forwards]">
            <button
              className="group cursor-pointer relative inline-flex items-center justify-center px-10 py-5 bg-brand-orange text-white text-[1.125rem] font-bold rounded-full transition-all duration-300 hover:bg-brand-orange/90 hover:scale-105 active:scale-95 shadow-[0_8px_30px_rgba(249,115,22,0.3)] hover:shadow-[0_12px_40px_rgba(249,115,22,0.4)]"
            >
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
        </div>
      </div>

      {/* Gradient overlay at bottom for smooth transition */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white to-transparent pointer-events-none z-40"></div>
    </section>
  );
};

export default HeroBanner;
