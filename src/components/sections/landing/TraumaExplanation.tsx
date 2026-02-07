import React from "react";

const TraumaExplanation: React.FC = () => {
  return (
    <section
      id="mission"
      className="py-14 sm:py-16 md:py-24 bg-white overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-6 md:px-12">
        {/* ================= HEADER ================= */}
        <div className="mb-12 sm:mb-16 max-w-3xl">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-8 h-1 bg-brand-orange rounded-full" />
            <span className="text-[10px] sm:text-xs font-bold tracking-widest uppercase text-brand-blue/60">
              OUR MISSION
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-brand-blue tracking-tight leading-tight max-w-3xl">
            Resolving Trauma through our
            <span className="text-brand-orange"> Holistic Approach</span>
          </h2>
        </div>

        {/* ================= FLOWCHART GRID ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 mb-16">
          {/* ================= TRAUMA FLOW ================= */}
          <div className="bg-slate-50/80 backdrop-blur rounded-[2rem] sm:rounded-[2.5rem] p-5 sm:p-6 md:p-10 border border-white shadow-card flex flex-col items-center">
            <h3 className="text-xl sm:text-2xl font-bold text-brand-blue mb-8">
              How Trauma Works
            </h3>

            <div className="w-full flex flex-col items-center">
              {/* Trauma */}
              <div className="bg-white border-2 border-red-50 rounded-2xl px-6 py-4 shadow-flow w-full max-w-[260px] text-center">
                <p className="text-[10px] font-black uppercase tracking-widest text-red-400 mb-1">
                  Source
                </p>
                <p className="font-bold text-brand-blue text-lg sm:text-xl">
                  Trauma
                </p>
              </div>

              {/* Arrow */}
              <div className="h-8 sm:h-10 w-px bg-red-200 relative my-2">
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-red-200" />
              </div>

              {/* Coping */}
              <div className="bg-white border border-slate-200 rounded-2xl px-6 py-4 shadow-flow w-full max-w-[300px] text-center">
                <p className="text-[10px] font-black uppercase tracking-widest text-brand-blue/40 mb-1">
                  Response
                </p>
                <p className="font-bold text-brand-blue text-base sm:text-lg">
                  Coping Mechanisms
                </p>
              </div>

              {/* Branch */}
              <div className="w-full max-w-[380px] h-10 sm:h-12">
                <svg viewBox="0 0 400 40" className="w-full h-full">
                  <path
                    d="M200 0 V15 M200 15 H50 V40 M200 15 H350 V40 M200 15 V40"
                    stroke="#CBD5E1"
                    strokeWidth="2"
                    fill="none"
                  />
                </svg>
              </div>

              {/* Categories */}
              <div className="grid grid-cols-3 gap-2 w-full max-w-[420px]">
                {[
                  "Addictions",
                  "Mental Illness",
                  "Physiological Disorders",
                ].map((item) => (
                  <div
                    key={item}
                    className="bg-white/80 border border-slate-100 rounded-xl p-2 sm:p-3 shadow-flow text-center"
                  >
                    <p className="text-[9px] sm:text-[11px] md:text-xs font-bold text-slate-500 uppercase leading-tight">
                      {item}
                    </p>
                  </div>
                ))}
              </div>

              {/* Arrow */}
              <div className="h-10 w-px bg-red-300 relative my-3">
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-red-300" />
              </div>

              {/* Outcome */}
              <div className="bg-white border-2 border-red-50 rounded-2xl p-5 shadow-md w-full max-w-[360px] text-center">
                <p className="text-[10px] font-black uppercase tracking-widest text-red-500 mb-1">
                  Outcome
                </p>
                <p className="font-bold text-brand-blue text-base sm:text-lg md:text-xl font-serif">
                  Symptoms / Dysfunctionalities
                </p>
              </div>
            </div>
          </div>

          {/* ================= TOT FLOW ================= */}
          <div className="bg-slate-50/80 backdrop-blur rounded-[2rem] sm:rounded-[2.5rem] p-5 sm:p-6 md:p-10 border border-white shadow-card flex flex-col items-center">
            <h3 className="text-xl sm:text-2xl font-bold text-brand-blue mb-8">
              How TOT Works
            </h3>

            <div className="w-full flex flex-col items-center">
              {/* Step 1 */}
              <div className="bg-white border border-slate-200 rounded-2xl px-6 py-4 shadow-flow w-full max-w-[300px] text-center">
                <p className="text-[10px] font-black uppercase tracking-widest text-brand-blue-900/30 mb-1">
                  Step 01
                </p>
                <p className="font-bold text-brand-blue text-sm sm:text-base">
                  Identification of Symptoms
                </p>
              </div>

              {/* Branch */}
              <div className="w-full max-w-[380px] h-10">
                <svg viewBox="0 0 400 30" className="w-full h-full">
                  <path
                    d="M200 0 V10 M200 10 H50 V30 M200 10 H350 V30 M200 10 V30"
                    stroke="#CBD5E1"
                    strokeWidth="2"
                    fill="none"
                  />
                </svg>
              </div>

              {/* Categories */}
              <div className="grid grid-cols-3 gap-2 w-full max-w-[420px]">
                {["Toxic Behaviours", "Mental Illness", "Addictions"].map(
                  (item) => (
                    <div
                      key={item}
                      className="bg-white/80 border border-slate-100 rounded-xl p-2 sm:p-3 shadow-flow text-center"
                    >
                      <p className="text-[9px] sm:text-[11px] md:text-xs font-bold text-slate-400 uppercase leading-tight">
                        {item}
                      </p>
                    </div>
                  ),
                )}
              </div>

              {/* Reverse branch */}
              <div className="w-full max-w-[380px] h-10 rotate-180">
                <svg viewBox="0 0 400 30" className="w-full h-full">
                  <path
                    d="M200 0 V10 M200 10 H50 V30 M200 10 H350 V30 M200 10 V30"
                    stroke="#CBD5E1"
                    strokeWidth="2"
                    fill="none"
                  />
                </svg>
              </div>

              {/* Step 2 */}
              <div className="bg-white border border-slate-200 rounded-2xl px-6 py-4 shadow-flow w-full max-w-[320px] text-center">
                <p className="text-[10px] font-black uppercase tracking-widest text-brand-blue-900/30 mb-1">
                  Step 02
                </p>
                <p className="font-bold text-brand-blue text-xs sm:text-sm">
                  Symptom Management Through Therapy / Medication
                </p>
              </div>

              {/* Arrow */}
              <div className="h-10 w-px bg-green-300 relative my-3">
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-green-400" />
              </div>

              {/* Step 3 */}
              <div className="bg-white border border-green-100 rounded-2xl px-6 py-4 shadow-flow w-full max-w-[320px] text-center">
                <p className="text-[10px] font-black uppercase tracking-widest text-green-500 mb-1">
                  Step 03
                </p>
                <p className="font-bold text-brand-blue text-xs sm:text-sm">
                  Exploration of Coping Mechanisms & Patterns
                </p>
              </div>

              {/* Final Arrow */}
              <div className="h-10 w-px bg-green-500 relative my-3">
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-green-500" />
              </div>

              {/* Goal */}
              <div className="bg-brand-blue rounded-2xl p-6 shadow-card w-full max-w-[420px] text-center">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-green-400 mb-2">
                  The Goal
                </p>
                <p className="font-bold text-white text-xs sm:text-sm md:text-base uppercase tracking-wider">
                  Identification and Processing of Root Trauma
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ================= SUPPORT TEXT ================= */}
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-slate-600 text-base sm:text-lg items-center">
            <p className="border-l-4 border-brand-orange pl-6 leading-relaxed">
              Trauma is the response of the brain to a specific event that
              overwhelms the central nervous system.
            </p>

            <p className="border-l-4 border-brand-blue pl-6 leading-relaxed">
              We understand mental disorders as a coping mechanism used to keep
              the trauma dissociated and keep us protected from trauma. These
              coping mechanisms later become disorders and dysfunctionalities.
            </p>
          </div>

          <div className="bg-brand-blue rounded-3xl p-8 sm:p-10 md:p-12 text-white shadow-2xl relative overflow-hidden">
            <p className="text-lg sm:text-xl md:text-2xl font-medium leading-relaxed">
              Our therapy is based on{" "}
              <span className="text-brand-orange font-bold underline underline-offset-8">
                holistic approach
              </span>{" "}
              of identifying and soothing symptoms while exploring underlying
              trauma to provide effective, long-lasting mental healthcare
              solutions.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TraumaExplanation;
