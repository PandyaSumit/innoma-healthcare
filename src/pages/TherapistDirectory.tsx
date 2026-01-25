import { useState, useMemo, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { THERAPISTS, SPECIALIZATIONS, LANGUAGES, LOCATIONS } from '../data/therapists';
import type { Therapist } from '../data/therapists';

const ITEMS_PER_PAGE = 6;

const TherapistDirectory = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedSpecialization, setSelectedSpecialization] = useState(searchParams.get('specialization') || '');
  const [selectedLanguage, setSelectedLanguage] = useState(searchParams.get('language') || '');
  const [selectedLocation, setSelectedLocation] = useState(searchParams.get('location') || '');
  const [selectedGender, setSelectedGender] = useState(searchParams.get('gender') || '');
  const [selectedAvailability, setSelectedAvailability] = useState(searchParams.get('availability') || '');
  const [feeRange, setFeeRange] = useState<[number, number]>([1500, 5000]);
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState<'relevance' | 'rating' | 'fee-low' | 'fee-high' | 'availability'>('relevance');
  const [showFilters, setShowFilters] = useState(false);
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const [isLoading, setIsLoading] = useState(false);

  // Quick filter suggestions
  const quickFilters = [
    { label: 'Available Today', action: () => setSelectedAvailability('Available Today') },
    { label: 'Anxiety & Stress', action: () => setSelectedSpecialization('Anxiety') },
    { label: 'Female Therapists', action: () => setSelectedGender('Female') },
    { label: 'Hindi Speaking', action: () => setSelectedLanguage('Hindi') },
    { label: 'Top Rated (4.5+)', action: () => setMinRating(4.5) },
  ];

  // Reset visible count when filters change
  useEffect(() => {
    setVisibleCount(ITEMS_PER_PAGE);
  }, [searchQuery, selectedSpecialization, selectedLanguage, selectedLocation, selectedGender, selectedAvailability, feeRange, minRating, sortBy]);

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
    setVisibleCount(ITEMS_PER_PAGE);
    setSearchParams({});
  };

  // Get active filter tags
  const activeFilters = useMemo(() => {
    const filters: { label: string; key: string; clear: () => void }[] = [];

    if (searchQuery) {
      filters.push({ label: `Search: "${searchQuery}"`, key: 'search', clear: () => setSearchQuery('') });
    }
    if (selectedSpecialization) {
      filters.push({ label: selectedSpecialization, key: 'spec', clear: () => setSelectedSpecialization('') });
    }
    if (selectedLanguage) {
      filters.push({ label: selectedLanguage, key: 'lang', clear: () => setSelectedLanguage('') });
    }
    if (selectedLocation) {
      filters.push({ label: selectedLocation, key: 'loc', clear: () => setSelectedLocation('') });
    }
    if (selectedGender) {
      filters.push({ label: `${selectedGender} Therapists`, key: 'gender', clear: () => setSelectedGender('') });
    }
    if (selectedAvailability) {
      filters.push({ label: selectedAvailability, key: 'avail', clear: () => setSelectedAvailability('') });
    }
    if (minRating > 0) {
      filters.push({ label: `${minRating}+ Stars`, key: 'rating', clear: () => setMinRating(0) });
    }
    if (feeRange[0] > 1500 || feeRange[1] < 5000) {
      filters.push({ label: `₹${feeRange[0]} - ₹${feeRange[1]}`, key: 'fee', clear: () => setFeeRange([1500, 5000]) });
    }

    return filters;
  }, [searchQuery, selectedSpecialization, selectedLanguage, selectedLocation, selectedGender, selectedAvailability, minRating, feeRange]);

  // Load more handler with simulated loading
  const handleLoadMore = () => {
    setIsLoading(true);
    // Simulate loading delay for better UX
    setTimeout(() => {
      setVisibleCount((prev) => prev + ITEMS_PER_PAGE);
      setIsLoading(false);
    }, 500);
  };

  // Visible therapists (paginated)
  const visibleTherapists = useMemo(() => {
    return filteredTherapists.slice(0, visibleCount);
  }, [filteredTherapists, visibleCount]);

  const hasMore = visibleCount < filteredTherapists.length;

  return (
    <div className="min-h-screen bg-healthcare-surface pb-20 md:pb-0">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-brand-blue via-brand-blue to-healthcare-lavender">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">Find Your Therapist</h1>
          <p className="text-lg text-white/80 mb-6">
            Browse our verified mental health professionals and find the right fit for you
          </p>

          {/* Search Bar - Overlapping */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search by name, specialization, or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-xl border-0 shadow-lg focus:ring-2 focus:ring-brand-orange outline-none text-healthcare-text bg-white"
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
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-full bg-healthcare-surface hover:bg-healthcare-border transition-colors"
              >
                <svg className="w-4 h-4 text-healthcare-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Quick Filter Chips */}
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="text-white/60 text-sm py-1.5">Popular:</span>
            {quickFilters.map((filter) => (
              <button
                key={filter.label}
                onClick={filter.action}
                className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-sm rounded-full transition-colors backdrop-blur-sm"
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Active Filters */}
        {activeFilters.length > 0 && (
          <div className="mb-6 flex flex-wrap items-center gap-2">
            <span className="text-sm text-healthcare-text-muted">Active filters:</span>
            {activeFilters.map((filter) => (
              <span
                key={filter.key}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand-blue/10 text-brand-blue text-sm rounded-full"
              >
                {filter.label}
                <button
                  onClick={filter.clear}
                  className="w-4 h-4 flex items-center justify-center rounded-full hover:bg-brand-blue/20 transition-colors"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            ))}
            <button
              onClick={clearFilters}
              className="px-3 py-1.5 text-sm text-healthcare-text-muted hover:text-healthcare-text transition-colors"
            >
              Clear all
            </button>
          </div>
        )}

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
              <>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {visibleTherapists.map((therapist) => (
                    <TherapistCard key={therapist.id} therapist={therapist} />
                  ))}
                </div>

                {/* Pagination / Load More */}
                {hasMore && (
                  <div className="mt-8 text-center">
                    <div className="mb-4">
                      <span className="text-sm text-healthcare-text-muted">
                        Showing {visibleTherapists.length} of {filteredTherapists.length} therapists
                      </span>
                      <div className="mt-2 w-full max-w-xs mx-auto h-1.5 bg-healthcare-border rounded-full overflow-hidden">
                        <div
                          className="h-full bg-brand-blue rounded-full transition-all duration-500"
                          style={{ width: `${(visibleTherapists.length / filteredTherapists.length) * 100}%` }}
                        />
                      </div>
                    </div>
                    <button
                      onClick={handleLoadMore}
                      disabled={isLoading}
                      className="inline-flex items-center gap-2 px-8 py-3 bg-brand-blue text-white rounded-full font-semibold hover:bg-brand-blue/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-brand-blue/20"
                    >
                      {isLoading ? (
                        <>
                          <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Loading...
                        </>
                      ) : (
                        <>
                          Load More Therapists
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </>
                      )}
                    </button>
                  </div>
                )}

                {/* All loaded indicator */}
                {!hasMore && filteredTherapists.length > ITEMS_PER_PAGE && (
                  <div className="mt-8 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-full text-sm font-medium">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      All {filteredTherapists.length} therapists loaded
                    </div>
                  </div>
                )}
              </>
            ) : (
              <EmptyState
                searchQuery={searchQuery}
                hasFilters={activeFilters.length > 0}
                onClearFilters={clearFilters}
                onQuickFilter={(spec) => setSelectedSpecialization(spec)}
              />
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
      className="group block bg-white rounded-2xl border border-healthcare-border p-6 hover:shadow-xl hover:border-brand-blue/20 transition-all duration-300 no-underline hover:-translate-y-1"
    >
      <div className="flex gap-4">
        {/* Photo */}
        <div className="flex-shrink-0 relative">
          <img
            src={therapist.photo}
            alt={therapist.name}
            className="w-20 h-20 md:w-24 md:h-24 rounded-xl object-cover ring-2 ring-white shadow-md"
          />
          {/* Online Indicator */}
          {therapist.availability === 'Available Today' && (
            <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
              <span className="w-2 h-2 bg-white rounded-full" />
            </span>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div>
              <h3 className="text-lg font-bold text-healthcare-text mb-0.5 group-hover:text-brand-blue transition-colors">
                {therapist.name}
              </h3>
              <p className="text-sm text-healthcare-text-muted truncate">{therapist.qualifications}</p>
            </div>
            {therapist.availability === 'Available Today' && (
              <span className="flex-shrink-0 px-2.5 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full whitespace-nowrap">
                Available Today
              </span>
            )}
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(therapist.rating) ? 'text-yellow-400' : 'text-gray-200'
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-sm font-bold text-healthcare-text">{therapist.rating}</span>
            <span className="text-sm text-healthcare-text-muted">({therapist.reviewCount})</span>
          </div>

          {/* Specializations */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {therapist.specializations.slice(0, 3).map((spec) => (
              <span
                key={spec}
                className="px-2.5 py-1 bg-healthcare-lavender/30 text-brand-blue text-xs font-medium rounded-full"
              >
                {spec}
              </span>
            ))}
            {therapist.specializations.length > 3 && (
              <span className="px-2.5 py-1 bg-healthcare-surface text-healthcare-text-muted text-xs font-medium rounded-full">
                +{therapist.specializations.length - 3} more
              </span>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-healthcare-border">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 text-xs text-healthcare-text-muted">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                {therapist.experience} yrs
              </div>
              <p className="text-lg font-bold text-healthcare-text">₹{therapist.consultationFee}</p>
            </div>
            <div className="flex items-center gap-2 text-sm text-brand-blue font-semibold group-hover:gap-3 transition-all">
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

// Empty State Component
const EmptyState = ({
  searchQuery,
  hasFilters,
  onClearFilters,
  onQuickFilter,
}: {
  searchQuery: string;
  hasFilters: boolean;
  onClearFilters: () => void;
  onQuickFilter: (spec: string) => void;
}) => {
  const popularSpecializations = ['Anxiety', 'Depression', 'Stress Management', 'Relationship Issues'];

  return (
    <div className="bg-white rounded-2xl border border-healthcare-border p-8 md:p-12 text-center">
      {/* Illustration */}
      <div className="w-24 h-24 mx-auto mb-6 bg-healthcare-surface rounded-full flex items-center justify-center">
        <svg
          className="w-12 h-12 text-healthcare-text-muted"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      </div>

      <h3 className="text-xl md:text-2xl font-bold text-healthcare-text mb-3">
        {searchQuery ? `No results for "${searchQuery}"` : 'No therapists match your criteria'}
      </h3>

      <p className="text-healthcare-text-muted mb-8 max-w-md mx-auto">
        {hasFilters
          ? "We couldn't find any therapists matching your current filters. Try adjusting your criteria or explore our suggestions below."
          : "Try searching for a therapist by name, specialization, or keyword."}
      </p>

      {/* Suggestions */}
      <div className="mb-8">
        <p className="text-sm font-semibold text-healthcare-text mb-3">Popular specializations:</p>
        <div className="flex flex-wrap justify-center gap-2">
          {popularSpecializations.map((spec) => (
            <button
              key={spec}
              onClick={() => onQuickFilter(spec)}
              className="px-4 py-2 bg-healthcare-lavender/20 hover:bg-healthcare-lavender/40 text-brand-blue rounded-full text-sm font-medium transition-colors"
            >
              {spec}
            </button>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        {hasFilters && (
          <button
            onClick={onClearFilters}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-brand-blue text-white rounded-full font-semibold hover:bg-brand-blue/90 transition-all shadow-lg shadow-brand-blue/20"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Clear All Filters
          </button>
        )}
        <Link
          to="/assessment"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-brand-orange text-white rounded-full font-semibold hover:bg-brand-orange/90 transition-all shadow-lg shadow-brand-orange/20 no-underline"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          Take Free Assessment
        </Link>
      </div>

      {/* Help Text */}
      <p className="mt-8 text-sm text-healthcare-text-muted">
        Need help finding the right therapist?{' '}
        <Link to="/support" className="text-brand-blue hover:underline font-medium">
          Contact our support team
        </Link>
      </p>
    </div>
  );
};

export default TherapistDirectory;
