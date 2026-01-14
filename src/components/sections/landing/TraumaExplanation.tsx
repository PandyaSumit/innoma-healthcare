import React from 'react';

const TraumaExplanation: React.FC = () => {
  return (
    <section className="py-16 md:py-24 bg-white overflow-hidden" id="mission">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
        {/* Section Header */}
        <div className="mb-16 md:mb-20 text-left lg:text-center">
          <div className="flex items-center lg:justify-center gap-2 mb-4">
            <span className="w-8 h-1 bg-brand-orange rounded-full"></span>
            <span className="text-xs font-bold tracking-widest uppercase text-brand-blue/60">OUR MISSION</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-brand-blue tracking-tight leading-tight max-w-3xl lg:mx-auto">
            Understanding Trauma and our 
            <span className="text-brand-orange"> Holistic Approach</span>
          </h2>
        </div>

        {/* Flowcharts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-start mb-16">
          
          {/* FLOWCHART 1: HOW TRAUMA WORKS */}
          <div className="bg-slate-50/80 backdrop-blur rounded-[2.5rem] p-6 md:p-10 border border-white shadow-card flex flex-col items-center">
            <h3 className="text-2xl font-bold text-brand-blue mb-10 self-start lg:self-center">How Trauma Works</h3>
            
            <div className="w-full flex flex-col items-center">
              {/* Node: Trauma */}
              <div className="bg-white border-2 border-red-50 rounded-2xl px-8 py-4 shadow-flow min-w-[180px] text-center">
                <p className="text-[10px] font-black text-red-400 uppercase tracking-widest mb-1">Source</p>
                <p className="font-bold text-brand-blue text-xl">Trauma</p>
              </div>

              {/* Arrow Down */}
              <div className="h-10 w-px bg-red-200 relative my-2">
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-red-200"></div>
              </div>

              {/* Node: Coping Mechanisms */}
              <div className="bg-white border border-slate-200 rounded-2xl px-10 py-5 shadow-flow min-w-[220px] text-center">
                <p className="text-[10px] font-black text-brand-blue/40 uppercase tracking-widest mb-1">Response</p>
                <p className="font-bold text-brand-blue text-lg">Coping Mechanisms</p>
              </div>

              {/* Branching SVG for 3 categories */}
              <div className="w-full max-w-[380px] h-12">
                <svg viewBox="0 0 400 40" className="w-full h-full" preserveAspectRatio="none">
                  <path d="M200 0 V15 M200 15 H50 V40 M200 15 H350 V40 M200 15 V40" stroke="#CBD5E1" strokeWidth="2" fill="none" />
                </svg>
              </div>

              {/* 3 Categories: Addictions, Mental Illness, Physiological */}
              <div className="grid grid-cols-3 gap-2 w-full max-w-[420px]">
                {["Addictions", "Mental Illness", "Physiological Disorders"].map((item, i) => (
                  <div key={i} className="bg-white/80 border border-slate-100 rounded-xl p-3 sm:p-2 text-center shadow-flow flex items-center justify-center min-h-[50px] sm:min-h-[auto]">
                    <p className="text-[8px] sm:text-[12px] font-bold text-slate-500 uppercase leading-tight tracking-tight break-words w-full">{item}</p>
                  </div>
                ))}
              </div>

              {/* Arrow Down */}
              <div className="h-12 w-px bg-red-300 relative my-2">
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-red-300"></div>
              </div>

              {/* Node: Outcome */}
              <div className="bg-white border-2 border-red-50 rounded-2xl p-6 shadow-md w-full text-center">
                <p className="text-[10px] font-black text-red-500 uppercase tracking-widest mb-1">Outcome</p>
                <p className="font-bold text-brand-blue text-lg md:text-xl italic font-serif">Symptoms / Dysfunctionalities</p>
              </div>
            </div>
          </div>

          {/* FLOWCHART 2: HOW TOT WORKS */}
          <div className="bg-slate-50/80 backdrop-blur rounded-[2.5rem] p-6 md:p-10 border border-white shadow-card flex flex-col items-center">
            <h3 className="text-2xl font-bold text-brand-blue mb-10 self-start lg:self-center">How TOT Works</h3>
            
            <div className="w-full flex flex-col items-center">
              {/* Step 1 */}
              <div className="bg-white border border-slate-200 rounded-2xl px-8 py-4 shadow-flow min-w-[240px] text-center">
                <p className="text-[10px] font-black text-brand-blue/30 uppercase tracking-widest mb-1">Step 01</p>
                <p className="font-bold text-brand-blue">Identification of Symptoms</p>
              </div>

              {/* Branching Down to categories */}
              <div className="w-full max-w-[380px] h-10">
                <svg viewBox="0 0 400 30" className="w-full h-full" preserveAspectRatio="none">
                   <path d="M200 0 V10 M200 10 H50 V30 M200 10 H350 V30 M200 10 V30" stroke="#CBD5E1" strokeWidth="2" fill="none" />
                </svg>
              </div>

              {/* Categories */}
              <div className="grid grid-cols-3 gap-2 w-full max-w-[420px]">
                {["Toxic Behaviours", "Mental Illness", "Addictions"].map((item, i) => (
                  <div key={i} className="bg-white/80 border border-slate-100 rounded-xl p-3 text-center shadow-flow flex items-center justify-center">
                    <p className="text-[8px] sm:text-[12px] font-bold text-slate-400 uppercase leading-tight tracking-tight break-words w-full">{item}</p>
                  </div>
                ))}
              </div>

              {/* Branching back Up */}
              <div className="w-full max-w-[380px] h-10 transform rotate-180">
                <svg viewBox="0 0 400 30" className="w-full h-full" preserveAspectRatio="none">
                   <path d="M200 0 V10 M200 10 H50 V30 M200 10 H350 V30 M200 10 V30" stroke="#CBD5E1" strokeWidth="2" fill="none" />
                </svg>
              </div>

              {/* Step 2 */}
              <div className="bg-white border border-slate-200 rounded-2xl px-6 py-4 shadow-flow text-center max-w-[320px]">
                <p className="text-[10px] font-black text-brand-blue/30 uppercase tracking-widest mb-1">Step 02</p>
                <p className="font-bold text-brand-blue text-[13px] italic">Symptom Management Through Therapy/Medication</p>
              </div>

              {/* Green Arrow */}
              <div className="h-10 w-px bg-green-200 relative my-2">
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-green-300"></div>
              </div>

              {/* Step 3 */}
              <div className="bg-white border border-green-100 rounded-2xl px-6 py-4 shadow-flow text-center max-w-[320px]">
                <p className="text-[10px] font-black text-green-500 uppercase tracking-widest mb-1">Step 03</p>
                <p className="font-bold text-brand-blue text-[13px] italic">Exploration Of Coping Mechanisms And Patterns</p>
              </div>

              {/* Final Arrow */}
              <div className="h-10 w-px bg-green-400 relative my-2">
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-green-500"></div>
              </div>

              {/* The Goal */}
              <div className="bg-brand-blue rounded-2xl p-8 shadow-card w-full text-center">
                <p className="text-[10px] font-black text-green-400 uppercase tracking-[0.3em] mb-2">The Goal</p>
                <p className="font-bold text-white text-sm md:text-base uppercase tracking-wider">Identification and Processing of Root Trauma</p>
              </div>
            </div>
          </div>
        </div>

        {/* Support Text from SS */}
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <p className="text-slate-600 text-lg leading-relaxed border-l-4 border-brand-orange pl-6">
              Trauma is the response of the brain to a specific event that overwhelms the central nervous system.
            </p>
            <p className="text-slate-600 text-lg leading-relaxed border-l-4 border-brand-blue pl-6">
              We understand mental disorders as a coping mechanism used to keep trauma dissociated and keep us protected.
            </p>
          </div>
          
          <div className="bg-brand-blue rounded-3xl p-8 md:p-12 text-white shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150 duration-700"></div>
            <p className="text-xl md:text-2xl font-medium leading-relaxed relative z-10">
              Our therapy is based on a <span className="text-brand-orange font-bold underline decoration-2 underline-offset-8">holistic approach</span> of identifying and soothing symptoms while exploring underlying trauma to provide effective, long-lasting mental healthcare solutions.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TraumaExplanation;