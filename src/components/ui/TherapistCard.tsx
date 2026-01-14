import React from 'react';
import type { Therapist } from '../../types';

interface TherapistCardProps {
  therapist: Therapist;
}

const TherapistCard: React.FC<TherapistCardProps> = ({ therapist }) => {
  return (
    <div className="group bg-white rounded-xl border border-gray-100 overflow-hidden hover:border-brand-blue/20 transition-all duration-300">
      {/* Image Container */}
      <div className="relative aspect-[4/5] overflow-hidden">
        <img
          src={therapist.photo}
          alt={therapist.name}
          className="w-full h-full object-cover object-top grayscale-[20%] group-hover:grayscale-0 transition-all duration-500"
        />
        {/* Experience Tag */}
        <div className="absolute bottom-4 left-4">
          <span className="px-3 py-1.5 bg-brand-blue text-white text-[10px] font-bold uppercase tracking-wider rounded-md shadow-lg">
            {therapist.experience} Exp
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xl font-bold text-brand-blue line-clamp-1">
            {therapist.name}
          </h3>
          <div className="flex items-center gap-1 text-brand-yellow">
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
              <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
            </svg>
            <span className="text-sm font-bold text-brand-blue/60">{therapist.rating}</span>
          </div>
        </div>
        
        <p className="text-sm font-medium text-gray-500 leading-relaxed line-clamp-2">
          {therapist.specialization}
        </p>
      </div>
    </div>
  );
};

export default TherapistCard;

