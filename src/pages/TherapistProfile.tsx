import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { THERAPISTS } from '../data/therapists';

const TherapistProfile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(false);

  const therapist = THERAPISTS.find((t) => t.id === id);

  if (!therapist) {
    return (
      <div className="min-h-screen bg-healthcare-surface flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-healthcare-text mb-4">Therapist not found</h2>
          <Link
            to="/therapists"
            className="px-6 py-3 bg-brand-blue text-white rounded-lg font-semibold hover:bg-healthcare-text transition-colors"
          >
            Back to Directory
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-healthcare-surface">
      {/* Back Button */}
      <div className="bg-white border-b border-healthcare-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => navigate('/therapists')}
            className="flex items-center gap-2 text-healthcare-text-muted hover:text-healthcare-text transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Directory
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="bg-white rounded-lg border border-healthcare-border p-8 mb-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Profile Photo */}
            <div className="flex-shrink-0">
              <img
                src={therapist.photo}
                alt={therapist.name}
                className="w-64 h-64 rounded-lg object-cover shadow-lg"
              />
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-healthcare-text mb-2">{therapist.name}</h1>
                  <p className="text-lg text-healthcare-text-muted mb-3">{therapist.qualifications}</p>
                  <p className="text-sm text-healthcare-text-muted mb-1">
                    License: {therapist.licenseNumber}
                  </p>
                  <p className="text-sm text-healthcare-text-muted">
                    <svg
                      className="inline w-4 h-4 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    {therapist.location}
                  </p>
                </div>

                {/* Favorite Button */}
                <button
                  onClick={() => setIsFavorite(!isFavorite)}
                  className="p-2 rounded-lg hover:bg-healthcare-surface transition-colors"
                >
                  <svg
                    className={`w-6 h-6 ${isFavorite ? 'text-red-500 fill-current' : 'text-healthcare-text-muted'}`}
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

              {/* Rating & Stats */}
              <div className="flex items-center gap-6 mb-6">
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.floor(therapist.rating) ? 'text-yellow-400' : 'text-gray-300'
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-lg font-bold text-healthcare-text">{therapist.rating}</span>
                  <span className="text-sm text-healthcare-text-muted">
                    ({therapist.reviewCount} reviews)
                  </span>
                </div>
                <div className="h-6 w-px bg-healthcare-border" />
                <div className="text-sm text-healthcare-text-muted">
                  <span className="font-bold text-healthcare-text">{therapist.experience}</span> years exp.
                </div>
                <div className="h-6 w-px bg-healthcare-border" />
                <div className="text-sm text-healthcare-text-muted">
                  <span className="font-bold text-healthcare-text">{therapist.patientCount}+</span> patients
                </div>
              </div>

              {/* Availability Badge */}
              <div className="mb-6">
                {therapist.availability === 'Available Today' ? (
                  <span className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 text-sm font-semibold rounded-lg">
                    <span className="w-2 h-2 bg-green-500 rounded-full" />
                    Available Today
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 text-sm font-semibold rounded-lg">
                    {therapist.availability}
                  </span>
                )}
                <span className="ml-4 text-sm text-healthcare-text-muted">
                  Response time: {therapist.responseTime}
                </span>
              </div>

              {/* Price & CTA */}
              <div className="flex items-center gap-4">
                <div>
                  <p className="text-sm text-healthcare-text-muted mb-1">Consultation Fee</p>
                  <p className="text-3xl font-bold text-healthcare-text">
                    ₹{therapist.consultationFee}
                    <span className="text-base text-healthcare-text-muted font-normal">/session</span>
                  </p>
                </div>
                <div className="flex-1" />
                <div className="flex gap-3">
                  <Link
                    to={`/book/${therapist.id}`}
                    className="px-8 py-3 bg-brand-blue text-white rounded-lg font-bold hover:bg-healthcare-text transition-colors no-underline"
                  >
                    Book Appointment
                  </Link>
                  <Link
                    to="/assessment"
                    className="px-6 py-3 border-2 border-brand-blue text-brand-blue rounded-lg font-bold hover:bg-brand-blue hover:text-white transition-colors no-underline"
                  >
                    Free Assessment
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* About Section */}
            <section className="bg-white rounded-lg border border-healthcare-border p-6">
              <h2 className="text-2xl font-bold text-healthcare-text mb-4">About</h2>
              <p className="text-healthcare-text-muted leading-relaxed">{therapist.bio}</p>
            </section>

            {/* Approach Section */}
            <section className="bg-white rounded-lg border border-healthcare-border p-6">
              <h2 className="text-2xl font-bold text-healthcare-text mb-4">Treatment Approach</h2>
              <p className="text-healthcare-text-muted leading-relaxed">{therapist.approach}</p>
            </section>

            {/* Specializations Section */}
            <section className="bg-white rounded-lg border border-healthcare-border p-6">
              <h2 className="text-2xl font-bold text-healthcare-text mb-4">Specializations</h2>
              <div className="flex flex-wrap gap-3">
                {therapist.specializations.map((spec) => (
                  <span
                    key={spec}
                    className="px-4 py-2 bg-healthcare-lavender/30 text-brand-blue font-semibold rounded-lg"
                  >
                    {spec}
                  </span>
                ))}
              </div>
            </section>

            {/* Languages Section */}
            <section className="bg-white rounded-lg border border-healthcare-border p-6">
              <h2 className="text-2xl font-bold text-healthcare-text mb-4">Languages Spoken</h2>
              <div className="flex flex-wrap gap-3">
                {therapist.languages.map((lang) => (
                  <span
                    key={lang}
                    className="px-4 py-2 bg-healthcare-surface text-healthcare-text font-semibold rounded-lg"
                  >
                    {lang}
                  </span>
                ))}
              </div>
            </section>

            {/* Testimonials Section */}
            <section className="bg-white rounded-lg border border-healthcare-border p-6">
              <h2 className="text-2xl font-bold text-healthcare-text mb-6">Patient Testimonials</h2>
              <div className="space-y-6">
                {therapist.testimonials.map((testimonial) => (
                  <div key={testimonial.id} className="border-b border-healthcare-border pb-6 last:border-0">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`w-4 h-4 ${
                              i < testimonial.rating ? 'text-yellow-400' : 'text-gray-300'
                            }`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <span className="text-sm font-semibold text-healthcare-text">
                        {testimonial.rating}.0
                      </span>
                    </div>
                    <p className="text-healthcare-text-muted mb-3 italic">"{testimonial.comment}"</p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-healthcare-text-muted font-medium">
                        {testimonial.author}
                      </span>
                      <span className="text-healthcare-text-muted">
                        {new Date(testimonial.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Info Card */}
            <div className="bg-white rounded-lg border border-healthcare-border p-6">
              <h3 className="text-lg font-bold text-healthcare-text mb-4">Quick Info</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-healthcare-text-muted mb-1">Experience</p>
                  <p className="font-semibold text-healthcare-text">{therapist.experience} years</p>
                </div>
                <div>
                  <p className="text-sm text-healthcare-text-muted mb-1">Patients Helped</p>
                  <p className="font-semibold text-healthcare-text">{therapist.patientCount}+</p>
                </div>
                <div>
                  <p className="text-sm text-healthcare-text-muted mb-1">Response Time</p>
                  <p className="font-semibold text-healthcare-text">{therapist.responseTime}</p>
                </div>
                <div>
                  <p className="text-sm text-healthcare-text-muted mb-1">Gender</p>
                  <p className="font-semibold text-healthcare-text">{therapist.gender}</p>
                </div>
              </div>
            </div>

            {/* Availability Card */}
            <div className="bg-white rounded-lg border border-healthcare-border p-6">
              <h3 className="text-lg font-bold text-healthcare-text mb-4">Availability</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-healthcare-text-muted">Status</span>
                  <span className="text-sm font-semibold text-green-600">{therapist.availability}</span>
                </div>
                <div className="pt-3 border-t border-healthcare-border">
                  <p className="text-sm text-healthcare-text-muted mb-3">
                    View available time slots and book your appointment
                  </p>
                  <Link
                    to={`/book/${therapist.id}`}
                    className="block w-full text-center px-4 py-2 bg-brand-blue text-white rounded-lg font-semibold hover:bg-healthcare-text transition-colors no-underline"
                  >
                    Check Availability
                  </Link>
                </div>
              </div>
            </div>

            {/* Contact Card */}
            <div className="bg-healthcare-lavender/20 rounded-lg border border-healthcare-lavender/30 p-6">
              <h3 className="text-lg font-bold text-healthcare-text mb-3">Need Help?</h3>
              <p className="text-sm text-healthcare-text-muted mb-4">
                Have questions? Our support team is here to help you choose the right therapist.
              </p>
              <Link
                to="/support"
                className="block w-full text-center px-4 py-2 border-2 border-brand-blue text-brand-blue rounded-lg font-semibold hover:bg-brand-blue hover:text-white transition-colors no-underline"
              >
                Contact Support
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TherapistProfile;
