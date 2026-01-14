import React from 'react';
import type { Therapist } from '../../../types';
import TherapistCard from '../../ui/TherapistCard';

const TherapistsCarousel: React.FC = () => {
  // Mock therapist data
  const therapists: Therapist[] = [
    {
      id: '1',
      name: 'Dr. Sidharth Chattopadhyaya',
      photo: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=600&h=800',
      specialization: 'Anxiety & Depression Specialist',
      rating: 4.9,
      reviewCount: 127,
      experience: '12 years',
    },
    {
      id: '2',
      name: 'Dr. Eepsita',
      photo: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=600&h=800',
      specialization: 'Relationship & Family Therapist',
      rating: 4.8,
      reviewCount: 98,
      experience: '10 years',
    },
    {
      id: '3',
      name: 'Dr. Hitakanshi',
      photo: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=600&h=800',
      specialization: 'Trauma & PTSD Expert',
      rating: 5.0,
      reviewCount: 156,
      experience: '15 years',
    },
  ];

  return (
    <section id="therapists" className="py-10 sm:py-24 bg-gray-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 md:px-12">
        <div className="mb-16">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-8 h-1 bg-brand-orange rounded-full"></span>
            <span className="text-xs font-bold tracking-widest uppercase text-brand-blue/60">OUR CORE TEAM</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-brand-blue tracking-tight leading-tight mb-6">
            Personalized care from <br />
            <span className="text-brand-orange">trusted specialists.</span>
          </h2>
          <p className="text-lg md:text-xl text-brand-blue/70 max-w-2xl leading-relaxed">
            We are a team of trauma survivors, trauma experts, and frontline heroes!
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative">
          <div className="flex gap-6 sm:gap-8 overflow-x-auto xl:overflow-visible pb-0 sm:pb-12 snap-x lg:snap-none no-scrollbar px-2">
            {therapists.map((therapist) => (
              <div key={therapist.id} className="snap-start flex-shrink-0 w-[90vw] sm:w-[85vw] md:w-1/2 lg:w-[380px] max-w-[380px]">
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





