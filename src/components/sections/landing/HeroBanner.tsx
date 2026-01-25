import React from "react";

const HeroBanner: React.FC = () => {
  return (
    <section className="relative min-h-[90vh] md:min-h-screen flex items-center overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/sunrise.jpeg"
          alt=""
          className="w-full h-full object-cover scale-105 opacity-70 animate-[slowZoom_20s_ease-out_infinite_alternate]"
        />
      </div>

      {/* Readability overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/35 to-black/50 z-[1]" />

      {/* Hand overlay */}
      <div className="absolute inset-0 z-[2] pointer-events-none flex items-center justify-start">
        <img
          src="/hand1.png"
          alt=""
          className="w-full h-full object-cover opacity-90"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-5 sm:px-8 md:px-12">
        <div className="flex flex-col items-center justify-center text-center min-h-[80vh] space-y-8 sm:space-y-10 md:space-y-12">
          {/* Headline */}
          <div
            className="space-y-5 max-w-xl sm:max-w-2xl md:max-w-3xl opacity-0 animate-slide-up"
            style={{ animationDelay: "0.2s" }}
          >
            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.08] text-white">
              Build a{" "}
              <span className="bg-gradient-to-r from-brand-orange to-rose-500 bg-clip-text text-transparent">
                healthier
              </span>{" "}
              mind
            </h1>

            <p className="text-sm sm:text-base md:text-xl text-white/90 font-light leading-relaxed">
              Trauma-focused mental healthcare designed to restore safety,
              clarity, and emotional well-being through expert-led therapy.
            </p>
          </div>

          {/* CTA */}
          <div
            className="opacity-0 animate-slide-up"
            style={{ animationDelay: "0.4s" }}
          >
            <button
              onClick={() =>
                document
                  .getElementById("assessment")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="group w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 sm:px-12 py-4 sm:py-5 bg-brand-orange text-white text-base sm:text-lg font-semibold rounded-2xl transition-all duration-300 hover:bg-brand-orange/90 active:scale-[0.98] shadow-[0_14px_48px_rgba(249,115,22,0.35)]"
            >
              Start your journey
              <svg
                className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"
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
          <div
            className="flex flex-wrap justify-center gap-x-6 gap-y-3 text-xs sm:text-sm text-white/80 opacity-0 animate-slide-up"
            style={{ animationDelay: "0.6s" }}
          >
            {[
              "Professional therapists",
              "Safe & confidential",
              "Trauma-focused care",
            ].map((text) => (
              <div key={text} className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-green-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
