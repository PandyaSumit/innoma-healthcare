import { useState, useMemo } from "react";
import { THERAPISTS } from "../data/therapists";
import TherapistCard from "../components/therapists/TherapistCard";
import FilterBar from "../components/therapists/FilterBar";

const TherapistDirectory = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecialization, setSelectedSpecialization] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [feeRange, setFeeRange] = useState<[number, number]>([0, 10000]);
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState<
    "relevance" | "rating" | "fee-low" | "fee-high"
  >("relevance");
  const [showFilters, setShowFilters] = useState(false);

  // Filter and sort therapists
  const filteredTherapists = useMemo(() => {
    let filtered = THERAPISTS.filter((therapist) => {
      // Search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch =
          therapist.name.toLowerCase().includes(query) ||
          therapist.specializations.some((s) =>
            s.toLowerCase().includes(query),
          ) ||
          therapist.bio.toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }

      // Specialization filter
      if (
        selectedSpecialization &&
        !therapist.specializations.includes(selectedSpecialization)
      ) {
        return false;
      }

      // Language filter
      if (selectedLanguage && !therapist.languages.includes(selectedLanguage)) {
        return false;
      }

      // Fee range filter
      if (
        therapist.consultationFee < feeRange[0] ||
        therapist.consultationFee > feeRange[1]
      ) {
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
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case "fee-low":
        filtered.sort((a, b) => a.consultationFee - b.consultationFee);
        break;
      case "fee-high":
        filtered.sort((a, b) => b.consultationFee - a.consultationFee);
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
    feeRange,
    minRating,
    sortBy,
  ]);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedSpecialization("");
    setSelectedLanguage("");
    setFeeRange([0, 10000]);
    setMinRating(0);
    setSortBy("relevance");
  };

  return (
    <div className="min-h-screen bg-healthcare-surface/50">
      {/* Header Banner */}
      <div className="bg-white border-b border-healthcare-border relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-brand-blue/5 to-transparent pointer-events-none"></div>
        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold text-healthcare-text mb-4 tracking-tight">
            Find Your Therapist
          </h1>
          <p className="text-lg md:text-xl text-healthcare-text-muted max-w-2xl leading-relaxed">
            Browse our verified mental health professionals and find the perfect
            match for your journey to better mental health.
          </p>
        </div>
      </div>

      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Search Bar & Mobile Filter Toggle */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search by name, specialization, or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-14 pr-4 py-4 rounded-2xl border border-healthcare-border focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 outline-none text-healthcare-text bg-white shadow-sm transition-all text-lg"
            />
            <svg
              className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-healthcare-text-muted"
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

          <button
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden w-full flex items-center justify-between px-6 py-4 bg-white border border-healthcare-border rounded-2xl text-healthcare-text font-bold shadow-sm active:bg-healthcare-surface transition-colors"
          >
            <span className="flex items-center gap-2">
              <svg
                className="w-5 h-5 text-brand-blue"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                />
              </svg>
              Filter Results
            </span>
            <svg
              className={`w-5 h-5 text-healthcare-text-muted transition-transform duration-300 ${showFilters ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
        </div>

        {/* Horizontal Filters (Collapsible on Mobile) */}
        <div
          className={`${showFilters ? "block" : "hidden"} lg:block transition-all duration-300 ease-in-out`}
        >
          <FilterBar
            selectedSpecialization={selectedSpecialization}
            setSelectedSpecialization={setSelectedSpecialization}
            selectedLanguage={selectedLanguage}
            setSelectedLanguage={setSelectedLanguage}
            feeRange={feeRange}
            setFeeRange={setFeeRange}
            minRating={minRating}
            setMinRating={setMinRating}
            clearFilters={clearFilters}
          />
        </div>

        {/* Results Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
          <p className="text-healthcare-text text-lg">
            Showing{" "}
            <span className="font-bold">{filteredTherapists.length}</span>{" "}
            results
          </p>
          <div className="flex items-center gap-3">
            <label className="text-sm font-bold text-healthcare-text-muted">
              Sort by:
            </label>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="appearance-none pl-4 pr-10 py-2.5 rounded-xl border border-healthcare-border focus:border-brand-blue outline-none text-healthcare-text bg-white font-semibold cursor-pointer hover:border-brand-blue/50 transition-colors"
              >
                <option value="relevance">Relevance</option>
                <option value="rating">Highest Rating</option>
                <option value="fee-low">Lowest Fee</option>
                <option value="fee-high">Highest Fee</option>
              </select>
              <svg
                className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-healthcare-text-muted pointer-events-none"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Therapists Grid */}
        {filteredTherapists.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredTherapists.map((therapist) => (
              <TherapistCard key={therapist.id} therapist={therapist} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-healthcare-border p-16 text-center shadow-sm">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-healthcare-surface rounded-full mb-6">
              <svg
                className="w-10 h-10 text-healthcare-text-muted"
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
            </div>
            <h3 className="text-2xl font-bold text-healthcare-text mb-2">
              No therapists found
            </h3>
            <p className="text-healthcare-text-muted mb-8 max-w-sm mx-auto">
              We couldn't find any therapists matching your current filters. Try
              adjusting your search criteria.
            </p>
            <button
              onClick={clearFilters}
              className="px-8 py-3 bg-brand-blue text-white rounded-xl font-bold hover:bg-brand-blue-700 transition-all hover:-translate-y-0.5 hover:shadow-lg"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TherapistDirectory;
