import React from "react";
import type { Therapist } from "../../../types";
import TherapistCard from "../../ui/TherapistCard";

const TherapistsCarousel: React.FC = () => {
  const therapists: Therapist[] = [
    {
      id: "1",
      name: "Dr. Hitakanshi",
      photo: "/dr-hitakanshi.jpeg",
      specialization: "Trauma & PTSD Expert",
      rating: 5.0,
      reviewCount: 156,
      experience: "15 years",
    },
    {
      id: "2",
      name: "Dr. Eepsita",
      photo: "/dr-epista.jpeg",
      specialization: "Relationship & Family Therapist",
      rating: 4.8,
      reviewCount: 98,
      experience: "10 years",
    },
    {
      id: "3",
      name: "Dr. Sidharth Chattopadhyaya",
      photo: "/dr-Siddharth .jpeg",
      specialization: "Anxiety & Depression Specialist",
      rating: 4.9,
      reviewCount: 127,
      experience: "12 years",
    },
  ];

  return (
    <section
      id="therapists"
      className="py-14 sm:py-20 md:py-24 bg-gray-50 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-6 md:px-12">
        {/* ================= HEADER ================= */}
        <div className="mb-12 sm:mb-16 max-w-3xl">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-8 h-1 bg-brand-orange rounded-full" />
            <span className="text-[10px] sm:text-xs font-bold tracking-widest uppercase text-brand-blue/60">
              OUR CORE TEAM
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-brand-blue tracking-tight leading-tight mb-5">
            Expertise Grounded in <br />
            <span className="text-brand-orange">Understanding</span>
          </h2>

          <p className="text-base sm:text-lg md:text-xl text-brand-blue/70 leading-relaxed">
            We are a team of trauma survivors, trauma experts, and frontline
            heroes!
          </p>
        </div>

        {/* ================= CAROUSEL ================= */}
        <div className="relative">
          <div className="flex gap-5 sm:gap-6 lg:gap-8 overflow-x-auto no-scrollbar snap-x snap-mandatory lg:snap-none px-1 pb-2">
            {therapists.map((therapist) => (
              <div
                key={therapist.id}
                className="
                  snap-start
                  flex-shrink-0
                  w-[88vw]
                  sm:w-[70vw]
                  md:w-[45vw]
                  lg:w-[360px]
                  xl:w-[380px]
                "
              >
                <TherapistCard therapist={therapist} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TherapistsCarousel;
