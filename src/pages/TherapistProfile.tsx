import { useState } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import { THERAPISTS } from "../data/therapists";

const TherapistProfile = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const [isFavorite, setIsFavorite] = useState(false);

  const isInApp = location.pathname.startsWith("/find-therapist");
  const backPath = isInApp ? "/find-therapist" : "/therapists";

  const therapist = THERAPISTS.find((t) => t.id === id);

  if (!therapist) {
    return (
      <div
        className={`flex items-center justify-center ${isInApp ? "min-h-[400px]" : "min-h-screen bg-healthcare-surface"}`}
      >
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-4">Therapist not found</h2>
          <Link
            to={backPath}
            className="px-5 py-2.5 rounded-lg bg-brand-blue text-white"
          >
            Back to directory
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={isInApp ? "" : "bg-healthcare-surface min-h-screen"}>
      <div
        className={
          isInApp ? "space-y-8" : "mx-auto px-5 sm:px-8 py-8 space-y-8"
        }
      >
        {/* ================= HEADER ================= */}
        <section className="bg-white border border-healthcare-border rounded-xl p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row gap-6">
            {/* Photo */}
            <img
              src={therapist.photo}
              alt={therapist.name}
              className="w-28 h-28 sm:w-32 sm:h-32 rounded-xl object-cover shrink-0"
            />

            {/* Info */}
            <div className="flex-1 space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h1 className="text-xl sm:text-2xl font-semibold text-healthcare-text">
                    {therapist.name}
                  </h1>
                  <p className="text-sm text-healthcare-text-muted">
                    {therapist.qualifications}
                  </p>
                </div>

                <button
                  onClick={() => setIsFavorite(!isFavorite)}
                  className="p-2 rounded-lg hover:bg-healthcare-surface"
                >
                  <svg
                    className={`w-6 h-6 ${
                      isFavorite
                        ? "text-red-500 fill-current"
                        : "text-healthcare-text-muted"
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </button>
              </div>

              {/* Rating */}
              <div className="flex flex-wrap items-center gap-3 text-sm">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(therapist.rating)
                          ? "text-yellow-400"
                          : "text-gray-300"
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>

                <span className="font-semibold text-healthcare-text">
                  {therapist.rating}
                </span>
                <span className="text-healthcare-text-muted">
                  ({therapist.reviewCount} reviews)
                </span>
              </div>

              {/* Stats */}
              <div className="flex flex-wrap gap-6 text-sm text-healthcare-text-muted">
                <span>
                  <strong className="text-healthcare-text">
                    {therapist.experience}
                  </strong>{" "}
                  yrs experience
                </span>
                <span>
                  <strong className="text-healthcare-text">
                    {therapist.patientCount}+
                  </strong>{" "}
                  patients
                </span>
              </div>

              {/* Availability */}
              <div className="flex flex-wrap items-center gap-3">
                <span className="px-3 py-1 rounded-full bg-green-50 text-green-700 text-xs font-medium">
                  {therapist.availability}
                </span>
                <span className="text-xs text-healthcare-text-muted">
                  Responds in {therapist.responseTime}
                </span>
              </div>

              {/* CTA */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Link
                  to={`/book/${therapist.id}`}
                  className="px-6 py-3 rounded-lg bg-brand-blue text-white text-sm font-semibold text-center"
                >
                  Book appointment
                </Link>

                <Link
                  to="/assessment"
                  className="px-6 py-3 rounded-lg border border-brand-blue text-brand-blue text-sm font-semibold text-center hover:bg-brand-blue hover:text-white transition"
                >
                  Free assessment
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ================= CONTENT GRID ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* About */}
            <section className="bg-white border border-healthcare-border rounded-xl p-6">
              <h2 className="text-lg font-semibold mb-3">About</h2>
              <p className="text-healthcare-text-muted leading-relaxed">
                {therapist.bio}
              </p>
            </section>

            {/* Approach */}
            <section className="bg-white border border-healthcare-border rounded-xl p-6">
              <h2 className="text-lg font-semibold mb-3">Treatment approach</h2>
              <p className="text-healthcare-text-muted leading-relaxed">
                {therapist.approach}
              </p>
            </section>

            {/* Specializations */}
            <section className="bg-white border border-healthcare-border rounded-xl p-6">
              <h2 className="text-lg font-semibold mb-4">Specializations</h2>
              <div className="flex flex-wrap gap-2">
                {therapist.specializations.map((spec) => (
                  <span
                    key={spec}
                    className="px-3 py-1 rounded-full bg-healthcare-surface text-sm text-healthcare-text-muted"
                  >
                    {spec}
                  </span>
                ))}
              </div>
            </section>

            {/* Languages */}
            <section className="bg-white border border-healthcare-border rounded-xl p-6">
              <h2 className="text-lg font-semibold mb-4">Languages spoken</h2>
              <div className="flex flex-wrap gap-2">
                {therapist.languages.map((lang) => (
                  <span
                    key={lang}
                    className="px-3 py-1 rounded-full bg-healthcare-surface text-sm"
                  >
                    {lang}
                  </span>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            <div className="bg-white border border-healthcare-border rounded-xl p-6">
              <h3 className="text-sm font-semibold mb-4">Quick info</h3>
              <div className="space-y-2 text-sm text-healthcare-text-muted">
                <p>Experience: {therapist.experience} yrs</p>
                <p>Patients helped: {therapist.patientCount}+</p>
                <p>Gender: {therapist.gender}</p>
                <p>Response time: {therapist.responseTime}</p>
              </div>
            </div>

            <div className="bg-healthcare-lavender/20 border border-healthcare-lavender/30 rounded-xl p-6">
              <h3 className="text-sm font-semibold mb-3">
                Need help choosing?
              </h3>
              <p className="text-sm text-healthcare-text-muted mb-4">
                Our care team can help you find the right therapist.
              </p>
              <Link
                to="/support"
                className="block text-center px-4 py-2 rounded-lg border border-brand-blue text-brand-blue text-sm font-semibold hover:bg-brand-blue hover:text-white transition"
              >
                Contact support
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default TherapistProfile;
