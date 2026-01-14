import React from "react";

const HeroBanner: React.FC = () => {
  return (
    <section className="relative min-h-[85vh] md:min-h-[90vh] flex items-center justify-center overflow-hidden bg-slate-950">
      {/* Immersive Background */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://cdn.lanars.com/thumbnails/main_preview/toa-heftiba-_UIVmIBB3JU-unsplash_1wrererere_cases_main_medium_x2_804Nmip.webp"
          alt="Peaceful and calm environment"
          className="w-full h-full object-cover opacity-60 scale-105 animate-[slowZoom_20s_ease-out_infinite_alternate]"
        />
        {/* Soft Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/40 via-slate-950/70 to-slate-950"></div>
        <div className="absolute inset-0 bg-slate-950/0 backdrop-blur-[2px]"></div>
      </div>

      {/* Content Area */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 text-center">
        <div className="max-w-3xl mx-auto space-y-6 md:space-y-10">
          {/* Headline */}
          <div className="space-y-8 opacity-0 animate-[slide-up_1s_ease-out_0.2s_forwards]">
            <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-extrabold text-brand-blue-500 tracking-tight leading-[1.05] text-white">
              Build a <span className="text-brand-orange-500">healthier</span>{" "}
              mind
            </h1>
            <p className="text-xl md:text-2xl font-light text-slate-200 leading-relaxed font-medium max-w-2xl mx-auto">
              Trauma-focused mental healthcare designed to restore safety and
              emotional well-being through professional guidance.
            </p>
          </div>

          {/* Single CTA */}
          <div className="opacity-0 animate-[slideUp_1s_ease-out_0.4s_forwards]">
            <button
              className="group relative inline-flex items-center justify-center px-10 py-5 bg-orange-500 text-white text-[1.125rem] font-bold rounded-md transition-all duration-300 hover:bg-orange-600 hover:px-12 active:scale-[0.98] shadow-[0_0_40px_rgba(249,115,22,0.2)] hover:shadow-[0_0_60px_rgba(249,115,22,0.4)] focus:outline-none focus-visible:outline-none focus:ring-0"
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

      {/* Decorative element for depth */}
      <div className="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-t from-slate-950 to-transparent pointer-events-none"></div>
    </section>
  );
};

export default HeroBanner;
