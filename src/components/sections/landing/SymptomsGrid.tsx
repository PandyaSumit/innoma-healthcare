import React from "react";
import type { Symptom } from "../../../types";

const SymptomsGrid: React.FC = () => {
  const symptoms: Symptom[] = [
    {
      id: "1",
      name: "Trauma Care",
      description:
        "Let us unpack the baggage you’ve been carrying alone for so long. We help you make sense of your experience and rebuild safety.",
      icon: (
        <svg
          className="w-6 h-6"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    {
      id: "2",
      name: "Burnout Recovery",
      description:
        "Burnout isn’t a sign of weakness; it’s a sign that you’ve been strong for too long. You don’t need to hold your breath.",
      icon: (
        <svg
          className="w-6 h-6"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    {
      id: "3",
      name: "Mental Illness",
      description:
        "Your diagnosis does not define you. Identify the root of your struggles and move toward a healthier, balanced life.",
      icon: (
        <svg
          className="w-6 h-6"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    {
      id: "4",
      name: "Root Cause Care",
      description:
        "We work on both symptoms and underlying trauma together to support deep, sustainable healing.",
      icon: (
        <svg
          className="w-6 h-6"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            d="M12 19l7-7 3 3-7 7-3-3z"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path d="M2 2l5 5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    },
  ];

  return (
    <section id="specializations" className="py-14 sm:py-20 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 md:px-12">
        {/* ================= HEADER ================= */}
        <div className="mb-12 sm:mb-16 max-w-3xl">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-8 h-1 bg-brand-orange rounded-full" />
            <span className="text-[10px] sm:text-xs font-bold tracking-widest uppercase text-brand-blue-900/60">
              OUR EXPERTISE
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-brand-blue-900 tracking-tight leading-tight mb-4">
            Specialized care for <br />
            <span className="text-brand-orange">your unique journey.</span>
          </h2>
        </div>

        {/* ================= GRID ================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {symptoms.map((symptom) => (
            <div
              key={symptom.id}
              className="group h-full p-6 sm:p-7 md:p-8 rounded-2xl bg-gray-50 border border-gray-100 hover:bg-white hover:border-brand-blue/20 hover:shadow-xl transition-all duration-300"
            >
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-lg bg-white flex items-center justify-center mb-5 border border-gray-100 text-brand-blue-900 group-hover:bg-brand-blue group-hover:text-white transition-all duration-300">
                {symptom.icon}
              </div>

              <h3 className="text-lg sm:text-xl font-bold mb-3 text-brand-blue-900">
                {symptom.name}
              </h3>

              <p className="text-gray-500 leading-relaxed mb-6 text-sm sm:text-[15px]">
                {symptom.description}
              </p>

              <div className="flex items-center gap-2 text-xs font-bold text-brand-blue-900 group-hover:text-brand-orange transition-colors cursor-pointer">
                Learn More
                <svg
                  className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </div>
            </div>
          ))}
        </div>

        {/* ================= CTA ================= */}
        <div className="mt-12 sm:mt-16 flex justify-center">
          <button className="px-8 sm:px-10 py-3.5 sm:py-4 rounded-lg bg-brand-blue text-white font-semibold text-sm sm:text-base hover:bg-brand-blue/90 shadow-lg shadow-brand-blue/10 transition-all">
            View All Specialized Care
          </button>
        </div>
      </div>
    </section>
  );
};

export default SymptomsGrid;
