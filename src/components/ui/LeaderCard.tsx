import React from "react";
import { Link } from "react-router-dom";

interface Leader {
  id: string;
  name: string;
  photo: string;
  specialization: string;
}

const LeaderCard: React.FC<{ therapist: Leader }> = ({ therapist }) => {
  return (
    <Link
      to={`/leaders/${therapist.id}`}
      className="group bg-white rounded-xl border border-gray-100 overflow-hidden hover:border-brand-blue/20 transition-all duration-300 block no-underline hover:shadow-xl"
    >
      <div className="relative aspect-[4/5] overflow-hidden rounded-t-xl bg-gray-100">
        <img
          src={therapist.photo}
          alt={therapist.name}
          className="w-full h-full object-cover object-top grayscale-[20%] group-hover:grayscale-0 transition-all duration-500"
        />
      </div>
      <div className="p-4 sm:p-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xl font-bold text-brand-blue-900 line-clamp-1">
            {therapist.name}
          </h3>
        </div>
        <p className="text-sm font-medium text-gray-500 leading-relaxed line-clamp-2">
          {therapist.specialization}
        </p>
      </div>
    </Link>
  );
};

export default LeaderCard;
