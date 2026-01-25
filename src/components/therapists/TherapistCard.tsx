import { Link } from "react-router-dom";
import type { Therapist } from "../../data/therapists";

interface TherapistCardProps {
  therapist: Therapist;
}

const TherapistCard = ({ therapist }: TherapistCardProps) => {
  return (
    <div
      className="
        bg-white
        rounded-[14px]
        border border-healthcare-border
        p-5 sm:p-6
        transition
        hover:shadow-md
      "
    >
      {/* Top */}
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-5">
        {/* Avatar */}
        <div className="relative shrink-0">
          <img
            src={therapist.photo}
            alt={therapist.name}
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl object-cover"
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Name + rating */}
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="text-base sm:text-lg font-semibold text-healthcare-text truncate">
                {therapist.name}
              </h3>
              <p className="text-sm text-healthcare-text-muted truncate">
                {therapist.qualifications}
              </p>
            </div>

            <div className="shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-yellow-50 border border-yellow-200">
              <svg
                className="w-4 h-4 text-yellow-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-sm font-semibold text-healthcare-text">
                {therapist.rating}
              </span>
            </div>
          </div>

          {/* Bio */}
          <p className="mt-2 text-sm text-healthcare-text-muted leading-relaxed line-clamp-2">
            {therapist.bio}
          </p>

          {/* Tags Row */}
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {/* Status pill */}
            {therapist.availability === "Available Today" && (
              <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-50 text-green-700 border border-green-200 whitespace-nowrap">
                Available today
              </span>
            )}

            {/* Specializations */}
            {therapist.specializations.slice(0, 3).map((spec) => (
              <span
                key={spec}
                className="
                  px-3 py-1
                  text-xs font-medium
                  rounded-full
                  bg-healthcare-surface
                  border border-healthcare-border
                  text-healthcare-text-muted
                  whitespace-nowrap
                "
              >
                {spec}
              </span>
            ))}

            {therapist.specializations.length > 3 && (
              <span className="text-xs text-healthcare-text-muted whitespace-nowrap">
                +{therapist.specializations.length - 3} more
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="my-5 border-t border-healthcare-border" />

      {/* Bottom */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-wide text-healthcare-text-muted">
            Consultation fee
          </p>
          <p className="text-lg font-semibold text-healthcare-text">
            ₹{therapist.consultationFee}
          </p>
        </div>

        <Link
          to={`/therapists/${therapist.id}`}
          className="
            w-full sm:w-auto
            text-center
            px-5 py-2.5
            rounded-lg
            bg-brand-blue
            text-white
            text-sm font-semibold
            hover:opacity-90
            transition
            no-underline
          "
        >
          View profile
        </Link>
      </div>
    </div>
  );
};

export default TherapistCard;
