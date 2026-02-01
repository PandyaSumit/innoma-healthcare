import React, { useState } from "react";
import type { FAQ } from "../../../types";

const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs: FAQ[] = [
    {
      id: "1",
      question: "What is trauma-informed care?",
      answer:
        "It is an approach that recognizes developmental and life trauma as the root of many emotional and psychological challenges, focusing on restoring safety, trust, and resilience.",
    },
    {
      id: "2",
      question: "How do you target the root cause?",
      answer:
        "We work simultaneously with present-day symptoms and underlying trauma, helping you understand patterns and regain a sense of emotional control.",
    },
    {
      id: "3",
      question: "How much transparency can I expect?",
      answer:
        "Complete transparency. You will always understand what is happening in your therapy and why, with a clear and collaborative treatment plan.",
    },
    {
      id: "4",
      question: "Is the first session really free?",
      answer:
        "Yes. The first session is a safe, no-pressure space to share your concerns, understand our approach, and decide if it feels right for you.",
    },
  ];

  return (
    <section id="faq" className="py-14 sm:py-20 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 md:px-12">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          {/* ================= LEFT ================= */}
          <div>
            <div className="flex items-center gap-3 mb-5">
              <span className="w-8 h-[2px] bg-brand-orange rounded-full" />
              <span className="text-[10px] sm:text-xs font-bold tracking-widest uppercase text-brand-blue-900/60">
                FAQ
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold tracking-tight text-brand-blue leading-tight max-w-md">
              Common <span className="text-brand-orange">questions.</span>
            </h2>
          </div>

          {/* ================= FAQ LIST ================= */}
          <div className="space-y-1">
            {faqs.map((faq, index) => (
              <div
                key={faq.id}
                className="border-b border-brand-blue-100 last:border-0"
              >
                <button
                  onClick={() =>
                    setOpenIndex(openIndex === index ? null : index)
                  }
                  className="w-full py-4 sm:py-6 flex items-center justify-between text-left group"
                >
                  <span
                    className={`text-base sm:text-lg md:text-xl font-medium transition-colors ${
                      openIndex === index
                        ? "text-brand-orange"
                        : "text-brand-blue-900 group-hover:text-brand-blue-900"
                    }`}
                  >
                    {faq.question}
                  </span>

                  <span
                    className={`ml-4 flex-shrink-0 transition-transform duration-500 ${
                      openIndex === index
                        ? "rotate-180 text-brand-orange"
                        : "text-brand-blue-300"
                    }`}
                  >
                    <svg
                      className="w-5 h-5 sm:w-6 sm:h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.8}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </span>
                </button>

                <div
                  className={`overflow-hidden transition-all duration-500 ease-in-out ${
                    openIndex === index ? "max-h-96 pb-6 sm:pb-8" : "max-h-0"
                  }`}
                >
                  <p className="text-sm sm:text-base md:text-lg text-brand-blue-900/70 leading-relaxed max-w-xl">
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
