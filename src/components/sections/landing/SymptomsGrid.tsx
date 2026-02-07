import React from "react";
import type { Symptom } from "../../../types";

const SymptomsGrid: React.FC = () => {
  const symptoms: Symptom[] = [
    {
      id: "1",
      name: "Online Therapy",
      description:
        "Confidential and secure trauma-oriented therapy designed for you, wherever you are emotionally and geographically.",
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
      name: "Diagnosis",
      description:
        "Accurate evaluations based on your symptoms through a trauma-informed lens.",
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
      name: "Medication",
      description:
        "Personalised medication to help you stay functional in your daily life and support long-term mental well-being.",
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
      name: "Psychiatric Review",
      description:
        "Regular psychiatric evaluations to review progress and refine treatment plans.",
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
            <span className="text-[10px] sm:text-xs font-bold tracking-widest uppercase text-brand-blue/60">
              OUR EXPERTISE
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-brand-blue tracking-tight leading-tight mb-4">
            End-to-End Care for <br />
            <span className="text-brand-orange">Your Mental Health</span>
          </h2>
        </div>

        {/* ================= GRID ================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {symptoms.map((symptom) => (
            <div
              key={symptom.id}
              className="group p-8 rounded-2xl bg-white border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all duration-200 flex flex-col items-start"
            >
              <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center mb-6 text-brand-blue-900 group-hover:bg-brand-blue-50 transition-colors duration-200">
                {symptom.icon}
              </div>

              <h3 className="text-lg font-bold mb-3 text-brand-blue tracking-tight">
                {symptom.name}
              </h3>

              <p className="text-gray-500 leading-relaxed text-sm">
                {symptom.description}
              </p>
            </div>
          ))}
        </div>

        {/* ================= CTA ================= */}
        {/* <div className="mt-12 sm:mt-16 flex justify-center">
          <button className="px-8 sm:px-10 py-3.5 sm:py-4 rounded-lg bg-brand-blue text-white font-semibold text-sm sm:text-base hover:bg-brand-blue/90 shadow-lg shadow-brand-blue/10 transition-all">
            View All Specialized Care
          </button>
        </div> */}
      </div>
    </section>
  );
};

export default SymptomsGrid;
