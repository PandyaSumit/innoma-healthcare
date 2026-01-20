// import React from 'react';

// const ApproachSection: React.FC = () => {
//   return (
//     <section className="py-24 bg-white overflow-hidden" id="approach">
//       <div className="max-w-7xl mx-auto px-6 md:px-12">
//         {/* Section Header */}
//         <div className="mb-20 text-center">
//           <div className="flex items-center justify-center gap-2 mb-4">
//             <span className="w-8 h-1 bg-brand-orange rounded-full"></span>
//             <span className="text-xs font-bold tracking-widest uppercase text-brand-blue-900/60">OUR APPROACH</span>
//           </div>
//           <h2 className="text-4xl md:text-5xl font-bold text-brand-blue-900 tracking-tight leading-tight max-w-3xl mx-auto">
//             Comprehensive Trauma-Informed 
//             <span className="text-brand-orange"> Clinical Excellence</span>
//           </h2>
//           <p className="mt-6 text-lg text-slate-600 max-w-2xl mx-auto">
//             We combine evidence-based therapy with compassionate care to help you navigate your journey toward healing and self-discovery.
//           </p>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
//           {/* Card 1: Trauma Processing */}
//           <div className="group bg-slate-50 border border-slate-100 rounded-3xl p-8 hover:bg-white hover:shadow-2xl hover:shadow-brand-blue/5 hover:-translate-y-2 transition-all duration-500">
//             <div className="w-14 h-14 bg-brand-blue/10 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-brand-blue group-hover:scale-110 transition-all duration-500">
//               <svg className="w-7 h-7 text-brand-blue-900 group-hover:text-white transition-colors duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
//               </svg>
//             </div>
//             <h3 className="text-xl font-bold text-slate-900 mb-4 leading-tight">Deep-Seated Trauma</h3>
//             <p className="text-slate-600 leading-relaxed font-medium text-sm">
//               Advanced clinical processing of deep-seated trauma underlying complex mental health challenges and persistent issues.
//             </p>
//           </div>

//           {/* Card 2: Featured - Restore & Thrive */}
//           <div className="group relative bg-brand-blue rounded-[2.5rem] overflow-hidden hover:shadow-2xl hover:shadow-brand-blue/20 hover:-translate-y-2 transition-all duration-500 lg:transform lg:scale-105 z-10 border border-brand-blue">
//             <div className="relative h-48 overflow-hidden">
//               <img 
//                 src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&auto=format&fit=crop&q=80"
//                 alt="Compassionate care"
//                 className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
//               />
//               <div className="absolute inset-0 bg-gradient-to-t from-brand-blue via-brand-blue/20 to-transparent"></div>
//             </div>
//             <div className="p-8">
//               <h3 className="text-xl font-bold text-white mb-3 tracking-tight">Restore & Thrive</h3>
//               <p className="text-blue-100/80 leading-relaxed font-medium text-sm mb-6">
//                 Scientifically-backed Trauma-Oriented Therapy to restore safety, resilience, and sustainable well-being.
//               </p>
//               <div className="pt-4 border-t border-white/10 flex items-center justify-between group/btn cursor-pointer">
//                 <span className="uppercase tracking-widest text-[10px] font-bold text-brand-orange-500">Learn More</span>
//                 <svg className="w-5 h-5 text-white transition-transform group-hover/btn:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
//                 </svg>
//               </div>
//             </div>
//           </div>

//           {/* Card 3: Developmental Trauma */}
//           <div className="group bg-slate-50 border border-slate-100 rounded-3xl p-8 hover:bg-white hover:shadow-2xl hover:shadow-brand-blue/5 hover:-translate-y-2 transition-all duration-500">
//             <div className="w-14 h-14 bg-brand-orange/10 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-brand-orange group-hover:scale-110 transition-all duration-500">
//               <svg className="w-7 h-7 text-brand-orange group-hover:text-white transition-colors duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
//               </svg>
//             </div>
//             <h3 className="text-xl font-bold text-slate-900 mb-4 leading-tight">Childhood Healing</h3>
//             <p className="text-slate-600 leading-relaxed font-medium text-sm">
//               Specialized therapeutic interventions to address and heal the long-term after-effects of childhood developmental trauma.
//             </p>
//           </div>

//           {/* Card 4: Inner Child */}
//           <div className="group bg-slate-50 border border-slate-100 rounded-3xl p-8 hover:bg-white hover:shadow-2xl hover:shadow-brand-blue/5 hover:-translate-y-2 transition-all duration-500">
//             <div className="w-14 h-14 bg-brand-yellow/10 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-brand-yellow group-hover:scale-110 transition-all duration-500">
//               <svg className="w-7 h-7 text-brand-yellow group-hover:text-white transition-colors duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//               </svg>
//             </div>
//             <h3 className="text-xl font-bold text-slate-900 mb-4 leading-tight">Authentic Self</h3>
//             <p className="text-slate-600 leading-relaxed font-medium text-sm">
//               Discover and reconnect with your authentic self by nurturing and healing your inner child through guided self-exploration.
//             </p>
//           </div>

//         </div>
//       </div>
//     </section>
//   );
// };

// export default ApproachSection;
import React from "react";

const ApproachSection: React.FC = () => {
  const approaches = [
    {
      title: "Deep-Seated Trauma",
      description:
        "Advanced clinical processing of deep-seated trauma underlying complex mental health challenges and persistent issues.",
      image:
        "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop&q=80",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
          />
        </svg>
      ),
      accent: "bg-brand-blue",
    },
    {
      title: "Restore & Thrive",
      description:
        "Scientifically-backed Trauma-Oriented Therapy to restore safety, resilience, and sustainable well-being.",
      image:
        "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&auto=format&fit=crop&q=80",
      featured: true,
      accent: "bg-brand-blue",
    },
    {
      title: "Childhood Healing",
      description:
        "Specialized therapeutic interventions to address and heal the long-term after-effects of childhood developmental trauma.",
      image:
        "https://images.unsplash.com/photo-1484665754804-74b091211472?w=800&auto=format&fit=crop&q=80",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      accent: "bg-brand-orange",
    },
    {
      title: "Authentic Self",
      description:
        "Discover and reconnect with your authentic self by nurturing and healing your inner child through guided exploration.",
      image:
        "https://images.unsplash.com/photo-1490730141103-6cac27aaab94?w=800&auto=format&fit=crop&q=80",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      accent: "bg-brand-yellow",
    },
  ];

  return (
    <section className="py-12 sm:py-16 md:py-24 bg-white overflow-hidden" id="approach">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="mb-14 md:mb-20 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="w-8 h-1 bg-brand-orange rounded-full"></span>
            <span className="text-xs font-bold tracking-widest uppercase text-brand-blue-900/60">
              OUR APPROACH
            </span>
          </div>

          <h2 className="text-3xl md:text-5xl font-bold text-brand-blue-900 tracking-tight leading-tight max-w-3xl mx-auto">
            Comprehensive Trauma-Informed{" "}
            <span className="text-brand-orange">Clinical Excellence</span>
          </h2>

          <p className="mt-6 text-lg text-slate-600 max-w-2xl mx-auto">
            We combine evidence-based therapy with compassionate care to help you
            navigate your journey toward healing and self-discovery.
          </p>
        </div>

        {/* Cards Grid: items-stretch ensures all items in a row have equal height */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 xl:gap-10 items-stretch">
          {approaches.map((item, idx) => (
            <div
              key={idx}
              className={`group flex flex-col h-full rounded-[2.5rem] overflow-hidden will-change-transform transform-gpu transition-all duration-500 hover:-translate-y-1.5 border
              ${
                item.featured
                  ? "bg-brand-blue border-brand-blue lg:scale-105 shadow-[0_20px_60px_rgba(19,32,79,0.35)] z-10"
                  : "bg-white border-slate-100 shadow-[0_12px_40px_rgba(19,32,79,0.08)] hover:shadow-[0_20px_60px_rgba(19,32,79,0.12)]"
              }`}
            >
              {/* Image Section */}
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-t-[2.5rem] flex-shrink-0">
               <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-100">
                <img
                  src={item.image}
                  alt={item.title}
                  className="absolute  w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />

                <div
                  className={`absolute bottom-0 left-0 right-0 h-[65%] bg-gradient-to-t${
                    item.featured
                      ? "from-brand-blue via-brand-blue/40 to-transparent"
                      : "from-white via-white/60 to-transparent"
                  }`}
                />
                </div>

                {!item.featured && (
                  <div
                    className={`absolute top-5 left-5 w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg z-20 ${item.accent}`}
                  >
                    {item.icon}
                  </div>
                )}
              </div>

              {/* Content Section: flex-grow forces this div to fill available space */}
              <div className="p-6 flex flex-col flex-grow">
                <h3
                  className={`text-xl font-bold mb-3 leading-tight ${
                    item.featured ? "text-white" : "text-slate-900"
                  }`}
                >
                  {item.title}
                </h3>

                <p
                  className={`text-sm leading-relaxed mb-5 ${
                    item.featured ? "text-blue-100/80" : "text-slate-600"
                  }`}
                >
                  {item.description}
                </p>

                {/* Button Section: mt-auto pushes this to the very bottom of the card */}
                {/* <div
                  className={`mt-auto pt-5 border-t flex items-center justify-between cursor-pointer group/btn ${
                    item.featured ? "border-white/10" : "border-slate-100"
                  }`}
                >
                  <span
                    className={`uppercase tracking-widest text-[10px] font-bold transition-colors ${
                      item.featured ? "text-brand-orange group-hover/btn:text-white" : "text-brand-blue-900 group-hover/btn:text-brand-orange"
                    }`}
                  >
                    Learn More
                  </span>
                  <svg
                    className={`w-5 h-5 transition-transform group-hover/btn:translate-x-1 ${
                      item.featured ? "text-white" : "text-brand-blue-900"
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </div> */}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ApproachSection;