import React from 'react';

const ApproachSection: React.FC = () => {
  return (
    <section className="py-24 bg-white overflow-hidden" id="approach">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section Header */}
        <div className="mb-20 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="w-8 h-1 bg-brand-orange rounded-full"></span>
            <span className="text-xs font-bold tracking-widest uppercase text-brand-blue/60">OUR APPROACH</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-brand-blue tracking-tight leading-tight max-w-3xl mx-auto">
            Comprehensive Trauma-Informed 
            <span className="text-brand-orange"> Clinical Excellence</span>
          </h2>
          <p className="mt-6 text-lg text-slate-600 max-w-2xl mx-auto">
            We combine evidence-based therapy with compassionate care to help you navigate your journey toward healing and self-discovery.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Card 1: Trauma Processing */}
          <div className="group bg-slate-50 border border-slate-100 rounded-3xl p-8 hover:bg-white hover:shadow-2xl hover:shadow-brand-blue/5 hover:-translate-y-2 transition-all duration-500">
            <div className="w-14 h-14 bg-brand-blue/10 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-brand-blue group-hover:scale-110 transition-all duration-500">
              <svg className="w-7 h-7 text-brand-blue group-hover:text-white transition-colors duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-4 leading-tight">Deep-Seated Trauma</h3>
            <p className="text-slate-600 leading-relaxed font-medium text-sm">
              Advanced clinical processing of deep-seated trauma underlying complex mental health challenges and persistent issues.
            </p>
          </div>

          {/* Card 2: Featured - Restore & Thrive */}
          <div className="group relative bg-brand-blue rounded-[2.5rem] overflow-hidden hover:shadow-2xl hover:shadow-brand-blue/20 hover:-translate-y-2 transition-all duration-500 lg:transform lg:scale-105 z-10 border border-brand-blue">
            <div className="relative h-48 overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&auto=format&fit=crop&q=80"
                alt="Compassionate care"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-blue via-brand-blue/20 to-transparent"></div>
            </div>
            <div className="p-8">
              <h3 className="text-xl font-bold text-white mb-3 tracking-tight">Restore & Thrive</h3>
              <p className="text-blue-100/80 leading-relaxed font-medium text-sm mb-6">
                Scientifically-backed Trauma-Oriented Therapy to restore safety, resilience, and sustainable well-being.
              </p>
              <div className="pt-4 border-t border-white/10 flex items-center justify-between group/btn cursor-pointer">
                <span className="uppercase tracking-widest text-[10px] font-bold text-brand-orange-500">Learn More</span>
                <svg className="w-5 h-5 text-white transition-transform group-hover/btn:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </div>
          </div>

          {/* Card 3: Developmental Trauma */}
          <div className="group bg-slate-50 border border-slate-100 rounded-3xl p-8 hover:bg-white hover:shadow-2xl hover:shadow-brand-blue/5 hover:-translate-y-2 transition-all duration-500">
            <div className="w-14 h-14 bg-brand-orange/10 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-brand-orange group-hover:scale-110 transition-all duration-500">
              <svg className="w-7 h-7 text-brand-orange group-hover:text-white transition-colors duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-4 leading-tight">Childhood Healing</h3>
            <p className="text-slate-600 leading-relaxed font-medium text-sm">
              Specialized therapeutic interventions to address and heal the long-term after-effects of childhood developmental trauma.
            </p>
          </div>

          {/* Card 4: Inner Child */}
          <div className="group bg-slate-50 border border-slate-100 rounded-3xl p-8 hover:bg-white hover:shadow-2xl hover:shadow-brand-blue/5 hover:-translate-y-2 transition-all duration-500">
            <div className="w-14 h-14 bg-brand-yellow/10 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-brand-yellow group-hover:scale-110 transition-all duration-500">
              <svg className="w-7 h-7 text-brand-yellow group-hover:text-white transition-colors duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-4 leading-tight">Authentic Self</h3>
            <p className="text-slate-600 leading-relaxed font-medium text-sm">
              Discover and reconnect with your authentic self by nurturing and healing your inner child through guided self-exploration.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
};

export default ApproachSection;
