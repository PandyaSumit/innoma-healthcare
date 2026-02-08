import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getLeaderById } from "../data/leaders";

const LeaderProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const leader = id ? getLeaderById(id) : undefined;

  if (!leader) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-brand-blue mb-4">
            Leader Not Found
          </h2>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 bg-brand-blue text-white rounded-xl font-semibold hover:opacity-90 transition-all"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER */}
      <header className="bg-brand-blue text-white border-b border-brand-blue/20">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <button
            onClick={() => navigate("/")}
            className="mb-8 flex items-center gap-2 text-white/80 hover:text-white transition"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Home
          </button>

          <div className="flex flex-col md:flex-row gap-10 items-start">
            {/* Image */}
            <div className="w-48 h-48 md:w-56 md:h-56 rounded-xl overflow-hidden border-4 border-white">
              <img
                src={leader.photo}
                alt={leader.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Identity */}
            <div className="flex-1">
              <span className="inline-block mb-4 text-sm font-semibold tracking-wide uppercase text-brand-yellow">
                {leader.title}
              </span>

              <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                {leader.name}
              </h1>

              <p className="mt-3 text-xl text-white/90">{leader.role}</p>

              <p className="mt-4 text-sm text-white/80">
                {leader.experience} Experience
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* CONTENT */}
      <main className="max-w-7xl mx-auto px-6 py-14">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* MAIN COLUMN */}
          <section className="lg:col-span-2 space-y-12">
            {/* About */}
            <div>
              <h2 className="text-2xl font-bold text-brand-blue mb-6 border-b pb-3">
                About
              </h2>
              <div className="space-y-5">
                {leader.bio.map((para, i) => (
                  <p key={i} className="text-gray-700 text-lg leading-relaxed">
                    {para}
                  </p>
                ))}
              </div>
            </div>

            {/* Qualifications */}
            {leader.qualifications && leader.qualifications.length > 0 && (
              <div>
                <h3 className="text-xl font-bold text-brand-blue mb-4">
                  Qualifications
                </h3>
                <ul className="space-y-3">
                  {leader.qualifications?.map((q, i) => (
                    <li key={i} className="flex gap-3 text-gray-700">
                      <span className="mt-1 w-2 h-2 rounded-full bg-brand-blue" />
                      <span className="text-lg">{q}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Achievements */}
            {leader.achievements && leader.achievements.length > 0 && (
              <div>
                <h3 className="text-xl font-bold text-brand-blue mb-4">
                  Key Achievements
                </h3>
                <ul className="space-y-3">
                  {leader.achievements.map((a, i) => (
                    <li key={i} className="flex gap-3 text-gray-700">
                      <span className="mt-1 w-2 h-2 rounded-full bg-brand-yellow" />
                      <span className="text-lg">{a}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>

          {/* SIDEBAR */}
          <aside className="lg:col-span-1">
            <div className="bg-white border border-gray-200 rounded-xl p-6 sticky top-24">
              <h3 className="text-xl font-bold text-brand-blue mb-6">
                Areas of Expertise
              </h3>

              <div className="space-y-3">
                {leader.specialties?.map((s, i) => (
                  <div
                    key={i}
                    className="px-4 py-3 border border-gray-200 rounded-lg text-gray-800 font-medium"
                  >
                    {s}
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default LeaderProfile;
