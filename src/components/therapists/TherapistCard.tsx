import { Link, useLocation } from "react-router-dom";
import type { Therapist } from "../../data/therapists";

interface TherapistCardProps {
  therapist: Therapist;
}

const TherapistCard = ({ therapist }: TherapistCardProps) => {
  const location = useLocation();
  const isInApp = location.pathname.startsWith("/find-therapist");

  const profilePath = isInApp
    ? `/find-therapist/${therapist.id}`
    : `/therapists/${therapist.id}`;

  const specializations = therapist.specializations;

  return (
    <div
      className="
        bg-white
        border border-healthcare-border
        rounded-xl
        p-4 sm:p-6
        transition
        hover:shadow-md
      "
    >
      {/* ================= TOP ================= */}
      <div className="flex gap-4 sm:gap-5">
        {/* Avatar */}
        <img
          src={therapist.photo}
          alt={therapist.name}
          className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg object-cover shrink-0"
        />

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Name + Rating */}
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="text-base sm:text-lg font-semibold text-healthcare-text truncate">
                {therapist.name}
              </h3>
              <p className="text-sm text-healthcare-text-muted truncate">
                {therapist.qualifications}
              </p>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-yellow-50 border border-yellow-200 shrink-0">
              <svg
                className="w-4 h-4 text-yellow-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-sm font-medium text-healthcare-text">
                {therapist.rating}
              </span>
            </div>
          </div>

          {/* Bio */}
          <p className="mt-2 text-sm text-healthcare-text-muted leading-relaxed line-clamp-2">
            {therapist.bio}
          </p>

          {/* ================= TAGS ================= */}
          <div className="mt-3 flex items-center gap-2 overflow-hidden">
            {/* Availability */}
            {therapist.availability === "Available Today" && (
              <span className="px-2.5 py-1 text-[11px] font-medium rounded-full bg-green-50 text-green-700 border border-green-200 whitespace-nowrap">
                Available today
              </span>
            )}

            {/* First specialization – always visible */}
            {specializations[0] && (
              <span className="px-2.5 py-1 text-[11px] font-medium rounded-full bg-healthcare-surface border border-healthcare-border text-healthcare-text-muted whitespace-nowrap">
                {specializations[0]}
              </span>
            )}

            {/* Second specialization – desktop only */}
            {specializations[1] && (
              <span className="hidden sm:inline-flex px-2.5 py-1 text-[11px] font-medium rounded-full bg-healthcare-surface border border-healthcare-border text-healthcare-text-muted whitespace-nowrap">
                {specializations[1]}
              </span>
            )}

            {/* + more */}
            {specializations.length > 1 && (
              <span className="text-[11px] text-healthcare-text-muted whitespace-nowrap">
                +
                {specializations.length -
                  (specializations.length >= 1 ? 1 : 0) -
                  (specializations.length >= 2 ? 1 : 0)}{" "}
                more
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="my-5 border-t border-healthcare-border" />

      {/* ================= BOTTOM ================= */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-[11px] uppercase tracking-wider text-healthcare-text-muted">
            Consultation fee
          </p>
          <p className="text-lg font-semibold text-healthcare-text">
            ₹{therapist.consultationFee}
          </p>
        </div>

        <Link
          to={profilePath}
          className="
            w-full sm:w-auto
            text-center
            px-5 py-2.5
            rounded-lg
            bg-brand-blue
            text-white
            text-sm font-medium
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
