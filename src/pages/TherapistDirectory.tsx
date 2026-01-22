import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { THERAPISTS, SPECIALIZATIONS, LANGUAGES, LOCATIONS, Therapist } from '../data/therapists';

const TherapistDirectory = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedGender, setSelectedGender] = useState('');
  const [selectedAvailability, setSelectedAvailability] = useState('');
  const [feeRange, setFeeRange] = useState<[number, number]>([1500, 5000]);
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState<'relevance' | 'rating' | 'fee-low' | 'fee-high' | 'availability'>('relevance');
  const [showFilters, setShowFilters] = useState(false);

  // Filter and sort therapists
  const filteredTherapists = useMemo(() => {
    let filtered = THERAPISTS.filter((therapist) => {
      // Search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch =
          therapist.name.toLowerCase().includes(query) ||
          therapist.specializations.some((s) => s.toLowerCase().includes(query)) ||
          therapist.bio.toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }

      // Specialization filter
      if (selectedSpecialization && !therapist.specializations.includes(selectedSpecialization)) {
        return false;
      }

      // Language filter
      if (selectedLanguage && !therapist.languages.includes(selectedLanguage)) {
        return false;
      }

      // Location filter
      if (selectedLocation && therapist.location !== selectedLocation) {
        return false;
      }

      // Gender filter
      if (selectedGender && therapist.gender !== selectedGender) {
        return false;
      }

      // Availability filter
      if (selectedAvailability && therapist.availability !== selectedAvailability) {
        return false;
      }

      // Fee range filter
      if (therapist.consultationFee < feeRange[0] || therapist.consultationFee > feeRange[1]) {
        return false;
      }

      // Rating filter
      if (therapist.rating < minRating) {
        return false;
      }

      return true;
    });

    // Sort
    switch (sortBy) {
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'fee-low':
        filtered.sort((a, b) => a.consultationFee - b.consultationFee);
        break;
      case 'fee-high':
        filtered.sort((a, b) => b.consultationFee - a.consultationFee);
        break;
      case 'availability':
        const availabilityOrder = { 'Available Today': 1, 'Available This Week': 2, 'Next Week': 3 };
        filtered.sort((a, b) => availabilityOrder[a.availability] - availabilityOrder[b.availability]);
        break;
      default:
        // relevance - keep original order
        break;
    }

    return filtered;
  }, [
    searchQuery,
    selectedSpecialization,
    selectedLanguage,
    selectedLocation,
    selectedGender,
    selectedAvailability,
    feeRange,
    minRating,
    sortBy,
  ]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedSpecialization('');
    setSelectedLanguage('');
    setSelectedLocation('');
    setSelectedGender('');
    setSelectedAvailability('');
    setFeeRange([1500, 5000]);
    setMinRating(0);
    setSortBy('relevance');
  };

  return (
    <div className="min-h-screen bg-healthcare-surface">
      {/* Header Banner */}
      <div className="bg-white border-b border-healthcare-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-bold text-healthcare-text mb-3">Find Your Therapist</h1>
          <p className="text-lg text-healthcare-text-muted">
            Browse our verified mental health professionals and find the right fit for you
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by name, specialization, or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-lg border border-healthcare-border focus:border-brand-blue outline-none text-healthcare-text bg-white"
            />
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-healthcare-text-muted"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {/* Filter Toggle (Mobile) */}
        <div className="mb-6 lg:hidden">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="w-full flex items-center justify-between px-4 py-3 bg-white border border-healthcare-border rounded-lg text-healthcare-text font-semibold"
          >
            <span>Filters</span>
            <svg
              className={`w-5 h-5 transition-transform ${showFilters ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <aside
            className={`${
              showFilters ? 'block' : 'hidden'
            } lg:block w-full lg:w-80 flex-shrink-0 space-y-6`}
          >
            <div className="bg-white rounded-lg border border-healthcare-border p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-healthcare-text">Filters</h3>
                <button
                  onClick={clearFilters}
                  className="text-sm text-brand-blue font-semibold hover:underline"
                >
                  Clear All
                </button>
              </div>

              {/* Specialization Filter */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-healthcare-text mb-2">
                  Specialization
                </label>
                <select
                  value={selectedSpecialization}
                  onChange={(e) => setSelectedSpecialization(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-healthcare-border focus:border-brand-blue outline-none text-healthcare-text bg-white"
                >
                  <option value="">All Specializations</option>
                  {SPECIALIZATIONS.map((spec) => (
                    <option key={spec} value={spec}>
                      {spec}
                    </option>
                  ))}
                </select>
              </div>

              {/* Language Filter */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-healthcare-text mb-2">Language</label>
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-healthcare-border focus:border-brand-blue outline-none text-healthcare-text bg-white"
                >
                  <option value="">All Languages</option>
                  {LANGUAGES.map((lang) => (
                    <option key={lang} value={lang}>
                      {lang}
                    </option>
                  ))}
                </select>
              </div>

              {/* Location Filter */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-healthcare-text mb-2">Location</label>
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-healthcare-border focus:border-brand-blue outline-none text-healthcare-text bg-white"
                >
                  <option value="">All Locations</option>
                  {LOCATIONS.map((loc) => (
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
                  ))}
                </select>
              </div>

              {/* Gender Filter */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-healthcare-text mb-2">Gender</label>
                <select
                  value={selectedGender}
                  onChange={(e) => setSelectedGender(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-healthcare-border focus:border-brand-blue outline-none text-healthcare-text bg-white"
                >
                  <option value="">Any Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Availability Filter */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-healthcare-text mb-2">
                  Availability
                </label>
                <select
                  value={selectedAvailability}
                  onChange={(e) => setSelectedAvailability(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-healthcare-border focus:border-brand-blue outline-none text-healthcare-text bg-white"
                >
                  <option value="">Any Time</option>
                  <option value="Available Today">Available Today</option>
                  <option value="Available This Week">Available This Week</option>
                  <option value="Next Week">Next Week</option>
                </select>
              </div>

              {/* Fee Range Filter */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-healthcare-text mb-2">
                  Fee Range: ₹{feeRange[0]} - ₹{feeRange[1]}
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="1500"
                    max="5000"
                    step="100"
                    value={feeRange[0]}
                    onChange={(e) => setFeeRange([parseInt(e.target.value), feeRange[1]])}
                    className="flex-1"
                  />
                  <input
                    type="range"
                    min="1500"
                    max="5000"
                    step="100"
                    value={feeRange[1]}
                    onChange={(e) => setFeeRange([feeRange[0], parseInt(e.target.value)])}
                    className="flex-1"
                  />
                </div>
              </div>

              {/* Rating Filter */}
              <div>
                <label className="block text-sm font-semibold text-healthcare-text mb-2">
                  Minimum Rating
                </label>
                <div className="space-y-2">
                  {[0, 3.5, 4, 4.5].map((rating) => (
                    <label key={rating} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="rating"
                        checked={minRating === rating}
                        onChange={() => setMinRating(rating)}
                        className="text-brand-blue focus:ring-brand-blue"
                      />
                      <span className="text-sm text-healthcare-text">
                        {rating === 0 ? 'All Ratings' : `${rating}+ Stars`}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Therapists Grid */}
          <main className="flex-1">
            {/* Results Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
              <p className="text-healthcare-text">
                <span className="font-bold">{filteredTherapists.length}</span> therapist
                {filteredTherapists.length !== 1 ? 's' : ''} found
              </p>
              <div className="flex items-center gap-3">
                <label className="text-sm font-semibold text-healthcare-text">Sort by:</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-3 py-2 rounded-lg border border-healthcare-border focus:border-brand-blue outline-none text-healthcare-text bg-white"
                >
                  <option value="relevance">Relevance</option>
                  <option value="rating">Highest Rating</option>
                  <option value="fee-low">Lowest Fee</option>
                  <option value="fee-high">Highest Fee</option>
                  <option value="availability">Availability</option>
                </select>
              </div>
            </div>

            {/* Therapists Grid */}
            {filteredTherapists.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredTherapists.map((therapist) => (
                  <TherapistCard key={therapist.id} therapist={therapist} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg border border-healthcare-border p-12 text-center">
                <svg
                  className="w-16 h-16 mx-auto mb-4 text-healthcare-text-muted"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <h3 className="text-xl font-bold text-healthcare-text mb-2">No therapists found</h3>
                <p className="text-healthcare-text-muted mb-6">
                  Try adjusting your filters or search query
                </p>
                <button
                  onClick={clearFilters}
                  className="px-6 py-2 bg-brand-blue text-white rounded-lg font-semibold hover:bg-healthcare-text transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

// Therapist Card Component
const TherapistCard = ({ therapist }: { therapist: Therapist }) => {
  return (
    <Link
      to={`/therapists/${therapist.id}`}
      className="block bg-white rounded-lg border border-healthcare-border p-6 hover:shadow-lg transition-shadow no-underline"
    >
      <div className="flex gap-4">
        {/* Photo */}
        <div className="flex-shrink-0">
          <img
            src={therapist.photo}
            alt={therapist.name}
            className="w-24 h-24 rounded-lg object-cover"
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div>
              <h3 className="text-lg font-bold text-healthcare-text mb-1">{therapist.name}</h3>
              <p className="text-sm text-healthcare-text-muted">{therapist.qualifications}</p>
            </div>
            {therapist.availability === 'Available Today' && (
              <span className="flex-shrink-0 px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded">
                Available Today
              </span>
            )}
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(therapist.rating) ? 'text-yellow-400' : 'text-gray-300'
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-sm font-semibold text-healthcare-text">{therapist.rating}</span>
            <span className="text-sm text-healthcare-text-muted">({therapist.reviewCount} reviews)</span>
          </div>

          {/* Specializations */}
          <div className="flex flex-wrap gap-2 mb-3">
            {therapist.specializations.slice(0, 3).map((spec) => (
              <span
                key={spec}
                className="px-2 py-1 bg-healthcare-lavender/30 text-brand-blue text-xs font-semibold rounded"
              >
                {spec}
              </span>
            ))}
            {therapist.specializations.length > 3 && (
              <span className="px-2 py-1 bg-healthcare-surface text-healthcare-text-muted text-xs font-semibold rounded">
                +{therapist.specializations.length - 3} more
              </span>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-healthcare-border">
            <div>
              <p className="text-xs text-healthcare-text-muted mb-1">{therapist.experience} years experience</p>
              <p className="text-lg font-bold text-healthcare-text">₹{therapist.consultationFee}/session</p>
            </div>
            <div className="flex items-center gap-2 text-sm text-brand-blue font-semibold">
              View Profile
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default TherapistDirectory;
