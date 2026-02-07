import React from "react";
import type { Benefit } from "../../../types";

const BenefitsSection: React.FC = () => {
  const benefits: Benefit[] = [
    {
      id: "1",
      title: "Trauma-focused care",
      description:
        "We acknowledge childhood developmental trauma as the root cause of mental illness, simultaneously working on symptoms and root trauma.",
      icon: "",
    },
    {
      id: "2",
      title: "Research-backed & Transparent",
      description:
        "Get more structure and transparency from your therapy. Our care plans are grounded in groundbreaking research.",
      icon: "",
    },
    {
      id: "3",
      title: "Collaborative Community",
      description:
        "We speak as one community. We help you rebuild safety within yourself and your surroundings.",
      icon: "",
    },
  ];

  return (
    <section id="about" className="py-24 bg-gray-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="w-8 h-1 bg-brand-orange rounded-full"></span>
              <span className="text-xs font-bold tracking-widest uppercase text-brand-blue/60">
                WHY INNOMA
              </span>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold text-brand-blue tracking-tight leading-tight mb-8">
              Healing the root, <br />
              <span className="text-brand-orange">not just the symptoms.</span>
            </h2>

            <p className="text-lg text-gray-600 mb-12 leading-relaxed max-w-xl">
              We've rethought mental healthcare to create a space that feels
              safe, supportive, and focused on your long-term resilience.
            </p>

            <div className="space-y-8">
              {benefits.map((benefit) => (
                <div
                  key={benefit.id}
                  className="flex gap-4 p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:border-brand-blue/10 transition-all duration-300"
                >
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-brand-orange/10 flex items-center justify-center mt-1">
                    <div className="w-2 h-2 rounded-full bg-brand-orange"></div>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-brand-blue mb-2">
                      {benefit.title}
                    </h3>
                    <p className="text-gray-500 text-sm leading-relaxed max-w-md">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Content */}
          <div className="relative">
            <div className="aspect-[4/5] bg-white rounded-2xl overflow-hidden shadow-2xl p-4">
              <img
                src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=1200"
                alt="Empathetic healthcare professional"
                className="w-full h-full object-cover rounded-xl grayscale-[30%]"
              />
            </div>
            {/* Minimal Stat Box */}
            <div className="absolute -bottom-6 -left-6 bg-brand-blue text-white p-6 rounded-xl shadow-xl hidden md:block">
              <p className="text-3xl font-bold mb-1">100%</p>
              <p className="text-xs font-medium text-white/70 uppercase tracking-widest">
                Transparency
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
