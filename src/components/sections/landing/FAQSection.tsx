import React, { useState } from 'react';
import type { FAQ } from '../../../types';

const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs: FAQ[] = [
    {
      id: '1',
      question: 'What is trauma-informed care?',
      answer: 'It is an approach that acknowledges childhood developmental trauma as the root cause of many mental health issues, focusing on building safety and resilience.',
    },
    {
      id: '2',
      question: 'How do you target the root cause?',
      answer: 'We work simultaneously on symptoms and underlying trauma, helping you make sense of your experiences and rebuild a sense of control.',
    },
    {
      id: '3',
      question: 'How much transparency can I expect?',
      answer: 'Complete transparency. You will exactly know what is going on in your therapy, with a structured plan that focuses on your authentic self.',
    },
    {
      id: '4',
      question: 'Is the first session really free?',
      answer: 'Yes. We believe in building connection first. Your first session is a safe space to discuss your needs and see if we are a good match.',
    },
  ];

  return (
    <section className="section-spacing bg-white">
      <div className="max-w-[1440px] mx-auto px-[24px] md:px-[48px] lg:px-[80px] xl:px-[120px]">
        <div className="grid lg:grid-cols-2 gap-6 md:gap-12">
          
          {/* Left - Title */}
          <div>
            <div className="inline-flex items-center gap-3 mb-6">
              <span className="w-8 h-[1px] bg-brand-orange-500"></span>
              <span className="text-xs font-bold tracking-[0.2em] uppercase text-brand-blue-500">FAQ</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-semibold tracking-tight text-balance text-brand-blue-500">
              Common <span className="text-brand-orange-500">questions.</span>
            </h2>
          </div>

          {/* Right - FAQ Items */}
          <div>
            {faqs.map((faq, index) => (
              <div 
                key={index} 
                className="border-b border-brand-blue-100 last:border-0"
              >
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full py-4 sm:py-6 flex items-center justify-between text-left group cursor-pointer"
                >
                  <span className={`text-xl font-medium transition-colors ${openIndex === index ? 'text-brand-orange-500' : 'text-brand-blue-900 group-hover:text-brand-blue-500'}`}>
                    {faq.question}
                  </span>
                  <span className={`ml-4 flex-shrink-0 transition-transform duration-500 ${openIndex === index ? 'rotate-180 text-brand-orange-500' : 'text-brand-blue-300'}`}>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </button>
                <div 
                  className={`overflow-hidden transition-all duration-500 ease-in-out ${
                    openIndex === index ? 'max-h-96 pb-8' : 'max-h-0'
                  }`}
                >
                  <p className="text-lg text-brand-blue-500/60 leading-relaxed max-w-[540px]">
                    {faq.answer}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};

export default FAQSection;


