import React from 'react';

const TraumaExplanation: React.FC = () => {
  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section Header */}
        <div className="mb-20">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-8 h-1 bg-brand-orange rounded-full"></span>
            <span className="text-xs font-bold tracking-widest uppercase text-brand-blue/60">OUR MISSION</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-brand-blue tracking-tight leading-tight max-w-2xl">
            Understanding Trauma and our 
            <span className="text-brand-orange"> Holistic Approach</span>
          </h2>
        </div>

        {/* Flowcharts Container */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 mb-24">
          
          {/* How Trauma Works */}
          <div className="bg-gray-50 rounded-2xl p-8 md:p-12">
            <h3 className="text-2xl font-bold text-brand-blue mb-12 flex items-center gap-3">
              <span className="w-1.5 h-6 bg-brand-blue rounded-full"></span>
              How Trauma Works
            </h3>
            
            <div className="flex flex-col items-center space-y-0">
              {/* Trauma Node */}
              <div className="group relative z-10 transition-transform duration-300 hover:scale-105">
                <div className="absolute -inset-1 bg-gradient-to-r from-red-200 to-red-100 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative bg-white border border-red-100 rounded-xl px-12 py-5 text-center shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] min-w-[200px]">
                  <p className="text-[10px] font-bold text-red-400 uppercase tracking-[0.2em] mb-1">Source</p>
                  <p className="font-bold text-brand-blue text-xl">Trauma</p>
                </div>
              </div>

              {/* Red Arrow Path */}
              <div className="h-12 w-px bg-gradient-to-b from-red-100 to-red-400 relative">
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-4 border-r-2 border-b-2 border-red-400 rotate-45 rounded-br-sm"></div>
              </div>

              {/* Coping Mechanisms Node */}
              <div className="group relative z-10 transition-transform duration-300 hover:scale-105">
                <div className="absolute -inset-1 bg-gradient-to-r from-brand-blue/20 to-brand-blue/10 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative bg-white border border-brand-blue/10 rounded-xl px-12 py-5 text-center shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] min-w-[240px]">
                  <p className="text-[10px] font-bold text-brand-blue/40 uppercase tracking-[0.2em] mb-1">Response</p>
                  <p className="font-bold text-brand-blue text-lg">Coping Mechanisms</p>
                </div>
              </div>

              {/* Branching SVG (Curved) */}
              <div className="w-full max-w-[440px] mt-0 -mb-2">
                <svg width="100%" height="60" viewBox="0 0 400 60" fill="none" preserveAspectRatio="none">
                  <path d="M200 0V20 C200 30 190 30 180 30 H60 C40 30 40 30 40 45 V60" stroke="#E2E8F0" strokeWidth="2" strokeLinecap="round" />
                  <path d="M200 0V60" stroke="#E2E8F0" strokeWidth="2" strokeLinecap="round" />
                  <path d="M200 0V20 C200 30 210 30 220 30 H340 C360 30 360 30 360 45 V60" stroke="#E2E8F0" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>

              {/* 3 Categories Nodes */}
              <div className="grid grid-cols-3 gap-3 w-full max-w-[480px]">
                {[
                  { title: "Addictions", color: "bg-gray-100" },
                  { title: "Mental Illness", color: "bg-gray-100" },
                  { title: "Physiological Disorders", color: "bg-gray-100" }
                ].map((item, idx) => (
                  <div key={idx} className="flex flex-col items-center">
                    <div className="bg-white border border-gray-100 rounded-lg px-2 py-3 w-full text-center shadow-sm">
                      <p className="text-[10px] md:text-[11px] font-bold text-brand-blue/60 uppercase tracking-tight leading-tight">
                        {item.title.split(' ').map((line, i) => (
                          <span key={i} className="block">{line}</span>
                        ))}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom Red Arrow Path */}
              <div className="h-16 w-px bg-gradient-to-b from-gray-200 via-red-200 to-red-400 relative">
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-4 border-r-2 border-b-2 border-red-400 rotate-45 rounded-br-sm"></div>
              </div>

              {/* Final Node - Symptoms */}
              <div className="group relative w-full transition-transform duration-300 hover:scale-[1.02]">
                <div className="absolute -inset-1 bg-gradient-to-r from-brand-blue/10 to-transparent rounded-2xl blur opacity-25"></div>
                <div className="relative bg-white border-2 border-brand-blue/5 rounded-2xl p-6 text-center shadow-md">
                  <p className="text-[10px] font-bold text-red-400 uppercase tracking-[0.3em] mb-2">Outcome</p>
                  <p className="text-xl font-bold text-brand-blue italic font-serif">
                    Symptoms/Dysfunctionalities
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* How TOT Works */}
          <div className="bg-gray-50 rounded-2xl p-8 md:p-12">
            <h3 className="text-2xl font-bold text-brand-blue mb-12 flex items-center gap-3">
              <span className="w-1.5 h-6 bg-brand-orange rounded-full"></span>
              How TOT Works
            </h3>

            <div className="flex flex-col items-center space-y-0">
              {/* Step 1 */}
              <div className="group relative transition-transform duration-300 hover:scale-105">
                <div className="relative bg-white border border-gray-100 rounded-xl px-10 py-4 text-center shadow-sm min-w-[220px]">
                  <p className="text-[10px] font-bold text-brand-blue/40 uppercase tracking-[0.2em] mb-1">Step 01</p>
                  <p className="font-bold text-brand-blue text-[13px]">Identification of Symptoms</p>
                </div>
              </div>

              {/* Branching Down SVG (Curved) */}
              <div className="w-full max-w-[440px] mt-0 -mb-2">
                <svg width="100%" height="60" viewBox="0 0 400 60" fill="none" preserveAspectRatio="none">
                  <path d="M200 0V20 C200 30 190 30 180 30 H60 C40 30 40 30 40 45 V60" stroke="#E2E8F0" strokeWidth="2" strokeLinecap="round" />
                  <path d="M200 0V60" stroke="#E2E8F0" strokeWidth="2" strokeLinecap="round" />
                  <path d="M200 0V20 C200 30 210 30 220 30 H340 C360 30 360 30 360 45 V60" stroke="#E2E8F0" strokeWidth="2" strokeLinecap="round" />
                  {/* Arrows */}
                  <path d="M40 60L36 54M40 60L44 54" stroke="#E2E8F0" strokeWidth="2" />
                  <path d="M200 60L196 54M200 60L204 54" stroke="#E2E8F0" strokeWidth="2" />
                  <path d="M360 60L356 54M360 60L364 54" stroke="#E2E8F0" strokeWidth="2" />
                </svg>
              </div>

              {/* 3 Categories Nodes */}
              <div className="grid grid-cols-3 gap-3 w-full max-w-[480px]">
                {[
                  { title: "Toxic Behaviours" },
                  { title: "Mental Illness" },
                  { title: "Addictions" }
                ].map((item, idx) => (
                  <div key={idx} className="bg-white border border-gray-100 rounded-lg px-2 py-4 w-full text-center shadow-sm">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight leading-tight">
                      {item.title.split(' ').map((line, i) => (
                        <span key={i} className="block">{line}</span>
                      ))}
                    </p>
                  </div>
                ))}
              </div>

              {/* Branching Up SVG (Merge Curved) */}
              <div className="w-full max-w-[440px] mt-0">
                <svg width="100%" height="60" viewBox="0 0 400 60" fill="none" preserveAspectRatio="none">
                  <path d="M40 0V15 C40 30 40 30 60 30 H180 C190 30 200 30 200 40 V60" stroke="#E2E8F0" strokeWidth="2" strokeLinecap="round" />
                  <path d="M200 0V60" stroke="#E2E8F0" strokeWidth="2" strokeLinecap="round" />
                  <path d="M360 0V15 C360 30 360 30 340 30 H220 C210 30 200 30 200 40 V60" stroke="#E2E8F0" strokeWidth="2" strokeLinecap="round" />
                  {/* Arrows */}
                  <path d="M200 60L196 54L200 60L204 54" stroke="#E2E8F0" strokeWidth="2" />
                </svg>
              </div>

              {/* Symptom Management Node */}
              <div className="group relative transition-transform duration-300 hover:scale-105">
                <div className="relative bg-white border border-brand-blue/10 rounded-xl px-10 py-4 text-center shadow-sm min-w-[300px]">
                  <p className="text-[10px] font-bold text-brand-blue/40 uppercase tracking-[0.2em] mb-1">Step 02</p>
                  <p className="font-bold text-brand-blue text-[13px] italic">Symptom Management Through Therapy/Medication</p>
                </div>
              </div>

              {/* Green Arrow Path */}
              <div className="h-10 w-px bg-gradient-to-b from-brand-blue/10 to-green-500 relative">
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-4 border-r-2 border-b-2 border-green-500 rotate-45 rounded-br-sm"></div>
              </div>

              {/* Exploration Node */}
              <div className="group relative transition-transform duration-300 hover:scale-105">
                <div className="relative bg-white border border-brand-blue/10 rounded-xl px-10 py-4 text-center shadow-sm min-w-[320px]">
                  <p className="text-[10px] font-bold text-green-500 uppercase tracking-[0.2em] mb-1">Step 03</p>
                  <p className="font-bold text-brand-blue text-[13px] italic">Exploration Of Coping Mechanisms And Patterns</p>
                </div>
              </div>

              {/* Green Arrow Path */}
              <div className="h-10 w-px bg-gradient-to-b from-green-300 to-green-600 relative">
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-4 border-r-2 border-b-2 border-green-600 rotate-45 rounded-br-sm"></div>
              </div>

              {/* Final Node - Root Trauma */}
              <div className="group relative w-full transition-transform duration-300 hover:scale-[1.02]">
                <div className="absolute -inset-1 bg-gradient-to-r from-green-400 to-brand-blue rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
                <div className="relative bg-brand-blue rounded-xl p-6 text-center shadow-xl border border-brand-blue">
                  <p className="text-[10px] font-bold text-green-400 uppercase tracking-[0.3em] mb-2">The Goal</p>
                  <p className="text-[15px] font-bold text-white uppercase tracking-wider">
                    Identification and Processing of Root Trauma
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Informative Text */}
        <div className="max-w-3xl mx-auto space-y-12 mb-12">
          <div className="space-y-6">
            <p className="text-gray-600 text-lg md:text-xl leading-relaxed">
              Trauma is the response of the brain to a specific event that overwhelms the central nervous system.
            </p>
            <p className="text-gray-600 text-lg md:text-xl leading-relaxed">
              Mental disorders often emerge as coping mechanisms to protect us from underlying trauma. Over time, these mechanisms can become dysfunctionalities that require professional care.
            </p>
          </div>
          <div className="p-8 md:p-12 rounded-2xl bg-brand-blue text-white shadow-xl">
            <p className="text-xl md:text-2xl font-bold leading-tight">
              Our therapy is based on a holistic approach of identifying and soothing symptoms while exploring underlying trauma.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TraumaExplanation;

