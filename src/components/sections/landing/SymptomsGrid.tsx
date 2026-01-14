import React from 'react';
import type { Symptom } from '../../../types';

const SymptomsGrid: React.FC = () => {
  const symptoms: Symptom[] = [
    { 
      id: '1', 
      name: 'Trauma Care', 
      description: 'Let us unpack the baggage you’ve been carrying alone for so long. We help you make sense of your experience and rebuild safety.', 
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    },
    { 
      id: '2', 
      name: 'Burnout Recovery', 
      description: 'Burnout isn’t a sign of weakness; it’s a sign that you’ve been strong for too long. You don’t need to hold your breath.', 
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    },
    { 
      id: '3', 
      name: 'Mental illness', 
      description: 'Your diagnosis does not define you. Identify the root of your issues and move on to a healthier and happier life.', 
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    },
    { 
      id: '4', 
      name: 'Root Cause Care', 
      description: 'We enhance mental well-being by simultaneously working on symptoms and root trauma for lasting change.', 
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 19l7-7 3 3-7 7-3-3z" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M2 2l5 5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    },
  ];

  return (
    <section id="specializations" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="mb-20">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-8 h-1 bg-brand-orange rounded-full"></span>
            <span className="text-xs font-bold tracking-widest uppercase text-brand-blue/60">OUR EXPERTISE</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-brand-blue tracking-tight leading-tight max-w-2xl">
            Specialized care for <br />
            <span className="text-brand-orange">your unique journey.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {symptoms.map((symptom) => (
            <div
              key={symptom.id}
              className="group p-8 rounded-xl bg-gray-50 border border-gray-100 hover:border-brand-blue/20 hover:bg-white hover:shadow-xl transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-lg bg-white flex items-center justify-center mb-6 border border-gray-100 group-hover:bg-brand-blue group-hover:text-white transition-all duration-300 text-brand-blue">
                {symptom.icon}
              </div>
              
              <h3 className="text-xl font-bold mb-3 text-brand-blue">
                {symptom.name}
              </h3>
              
              <p className="text-gray-500 leading-relaxed mb-6 text-sm">
                {symptom.description}
              </p>
              
              <div className="flex items-center gap-2 text-xs font-bold text-brand-blue hover:text-brand-orange transition-colors cursor-pointer">
                Learn More
                <svg className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </div>
          ))}
        </div>

        {/* Global CTA */}
        <div className="mt-16 flex justify-center">
          <button className="px-10 py-4 rounded-md bg-brand-blue text-white font-bold text-sm hover:bg-brand-blue/90 shadow-lg shadow-brand-blue/10 transition-all cursor-pointer">
            View All Specialized Care
          </button>
        </div>
      </div>
    </section>
  );
};

export default SymptomsGrid;



