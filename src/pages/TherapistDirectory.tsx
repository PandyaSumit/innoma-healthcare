import { useState, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { THERAPISTS } from "../data/therapists";
import TherapistCard from "../components/therapists/TherapistCard";
import FilterBar from "../components/therapists/FilterBar";

const TherapistDirectory = () => {
  const location = useLocation();
  const isInApp = location.pathname.startsWith("/find-therapist");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecialization, setSelectedSpecialization] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [feeRange, setFeeRange] = useState<[number, number]>([0, 10000]);
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState<
    "relevance" | "rating" | "fee-low" | "fee-high"
  >("relevance");

  // filters toggle for ALL screen sizes
  const [showFilters, setShowFilters] = useState(false);

  const filteredTherapists = useMemo(() => {
    let filtered = THERAPISTS.filter((t) => {
      const q = searchQuery.toLowerCase();

      if (
        q &&
        !t.name.toLowerCase().includes(q) &&
        !t.specializations.some((s) => s.toLowerCase().includes(q)) &&
        !t.bio.toLowerCase().includes(q)
      )
        return false;

      if (
        selectedSpecialization &&
        !t.specializations.includes(selectedSpecialization)
      )
        return false;

      if (selectedLanguage && !t.languages.includes(selectedLanguage))
        return false;

      if (t.consultationFee < feeRange[0] || t.consultationFee > feeRange[1])
        return false;

      if (t.rating < minRating) return false;

      return true;
    });

    if (sortBy === "rating") filtered.sort((a, b) => b.rating - a.rating);
    if (sortBy === "fee-low")
      filtered.sort((a, b) => a.consultationFee - b.consultationFee);
    if (sortBy === "fee-high")
      filtered.sort((a, b) => b.consultationFee - a.consultationFee);

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
    <div className={isInApp ? "" : "min-h-screen bg-healthcare-surface"}>
      {/* ================= HEADER ================= */}
      <div className={isInApp ? "mb-6" : "bg-white border-b border-healthcare-border"}>
        <div className={isInApp ? "" : "px-5 sm:px-8 lg:px-12 py-6 sm:py-8"}>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-healthcare-text mb-1">
            Find a therapist
          </h1>

          <p className="text-sm text-healthcare-text-muted">
            Verified professionals for your mental health needs.
          </p>

          {/* Search + filter */}
          <div className="mt-4 flex gap-3">
            <div className="relative flex-1">
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search therapist"
                className="
                  w-full
                  pl-11 pr-4 py-3
                  rounded-lg
                  border border-healthcare-border
                  bg-white
                  text-sm
                  focus:ring-2 focus:ring-brand-blue/20
                  outline-none
                "
              />
              <svg
                className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-healthcare-text-muted"
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
              onClick={() => setShowFilters((prev) => !prev)}
              className="
                px-4
                rounded-lg
                border border-healthcare-border
                bg-white
                text-sm
                font-medium
                whitespace-nowrap
                hover:bg-healthcare-surface
              "
            >
              Filters
            </button>
          </div>
        </div>
      </div>

      {/* ================= FILTER BAR ================= */}
      {showFilters && (
        <div className={isInApp
          ? "py-4 mb-4 border-b border-healthcare-border"
          : "px-5 sm:px-8 lg:px-12 py-4 border-b border-healthcare-border bg-white"
        }>
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
      )}

      {/* ================= RESULTS ================= */}
      <div className={isInApp ? "py-2" : "px-5 sm:px-8 lg:px-12 py-6"}>
        {/* Results header */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-healthcare-text">
            {filteredTherapists.length} therapists found
          </p>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="text-sm border border-healthcare-border rounded-lg px-3 py-2 bg-white"
          >
            <option value="relevance">Relevance</option>
            <option value="rating">Rating</option>
            <option value="fee-low">Fee (Low)</option>
            <option value="fee-high">Fee (High)</option>
          </select>
        </div>

        {/* Cards */}
        {filteredTherapists.length ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredTherapists.map((therapist) => (
              <TherapistCard key={therapist.id} therapist={therapist} />
            ))}
          </div>
        ) : (
          <div className="bg-white border border-healthcare-border rounded-xl p-10 text-center">
            <h3 className="text-base font-semibold text-healthcare-text mb-2">
              No therapists found
            </h3>
            <p className="text-sm text-healthcare-text-muted mb-5">
              Try adjusting filters or search keywords.
            </p>
            <button
              onClick={clearFilters}
              className="px-5 py-2.5 rounded-lg bg-brand-blue text-white text-sm"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TherapistDirectory;
