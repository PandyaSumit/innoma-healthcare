import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { THERAPISTS } from "../data/therapists";

const TherapistProfile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(false);

  const therapist = THERAPISTS.find((t) => t.id === id);

  if (!therapist) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-healthcare-surface">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-healthcare-text mb-4">
            Therapist not found
          </h2>
          <Link
            to="/therapists"
            className="px-6 py-3 rounded-lg bg-brand-blue text-white font-semibold"
          >
            Back to directory
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-healthcare-surface min-h-screen">
      <div className="mx-auto px-4 py-8 space-y-8">
        {/* Profile Header */}
        <section className="bg-white rounded-xl border border-healthcare-border p-5 sm:p-6 md:p-8">
          <div className="flex flex-col md:flex-row gap-6 md:gap-8">
            {/* Image */}
            <div className="flex justify-center md:justify-start">
              <img
                src={therapist.photo}
                alt={therapist.name}
                className="w-32 h-32 sm:w-36 sm:h-36 md:w-40 md:h-40 rounded-xl object-cover"
              />
            </div>

            {/* Info */}
            <div className="flex-1 space-y-4">
              {/* Name + Fav */}
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
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-healthcare-text-muted">
                <p>
                  <span className="font-semibold text-healthcare-text">
                    {therapist.experience}
                  </span>{" "}
                  yrs experience
                </p>
                <p>
                  <span className="font-semibold text-healthcare-text">
                    {therapist.patientCount}+
                  </span>{" "}
                  patients
                </p>
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
              <div className="flex flex-col sm:flex-row gap-3 pt-3">
                <Link
                  to={`/book/${therapist.id}`}
                  className="w-full sm:w-auto text-center px-6 py-3 rounded-lg bg-brand-blue text-white font-semibold"
                >
                  Book appointment
                </Link>

                <Link
                  to="/assessment"
                  className="w-full sm:w-auto text-center px-6 py-3 rounded-lg border border-brand-blue text-brand-blue font-semibold hover:bg-brand-blue hover:text-white transition"
                >
                  Free assessment
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main */}
          <div className="lg:col-span-2 space-y-6">
            {[
              { title: "About", content: therapist.bio },
              { title: "Treatment approach", content: therapist.approach },
            ].map((section) => (
              <div
                key={section.title}
                className="bg-white rounded-[14px] border border-healthcare-border p-6"
              >
                <h2 className="text-lg font-semibold text-healthcare-text mb-3">
                  {section.title}
                </h2>
                <p className="text-healthcare-text-muted leading-relaxed">
                  {section.content}
                </p>
              </div>
            ))}

            {/* Specializations */}
            <div className="bg-white rounded-[14px] border border-healthcare-border p-6">
              <h2 className="text-lg font-semibold text-healthcare-text mb-4">
                Specializations
              </h2>
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
            </div>

            {/* Languages */}
            <div className="bg-white rounded-[14px] border border-healthcare-border p-6">
              <h2 className="text-lg font-semibold text-healthcare-text mb-4">
                Languages spoken
              </h2>
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
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            <div className="bg-white rounded-[14px] border border-healthcare-border p-6">
              <h3 className="text-sm font-semibold text-healthcare-text mb-4">
                Quick info
              </h3>
              <div className="space-y-3 text-sm text-healthcare-text-muted">
                <p>Experience: {therapist.experience} yrs</p>
                <p>Patients helped: {therapist.patientCount}+</p>
                <p>Gender: {therapist.gender}</p>
                <p>Response time: {therapist.responseTime}</p>
              </div>
            </div>

            <div className="bg-healthcare-lavender/20 rounded-[14px] border border-healthcare-lavender/30 p-6">
              <h3 className="text-sm font-semibold text-healthcare-text mb-3">
                Need help choosing?
              </h3>
              <p className="text-sm text-healthcare-text-muted mb-4">
                Our care team can help you find the right therapist.
              </p>
              <Link
                to="/support"
                className="block text-center px-4 py-2 rounded-lg border border-brand-blue text-brand-blue font-semibold hover:bg-brand-blue hover:text-white transition"
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
