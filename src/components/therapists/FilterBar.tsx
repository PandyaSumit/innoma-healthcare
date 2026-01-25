import { SPECIALIZATIONS, LANGUAGES } from "../../data/therapists";

interface FilterBarProps {
  selectedSpecialization: string;
  setSelectedSpecialization: (val: string) => void;
  selectedLanguage: string;
  setSelectedLanguage: (val: string) => void;
  feeRange: [number, number];
  setFeeRange: (val: [number, number]) => void;
  minRating: number;
  setMinRating: (val: number) => void;
  clearFilters: () => void;
}

const FilterBar = ({
  selectedSpecialization,
  setSelectedSpecialization,
  selectedLanguage,
  setSelectedLanguage,
  feeRange,
  setFeeRange,
  minRating,
  setMinRating,
  clearFilters,
}: FilterBarProps) => {
  return (
    <div className="bg-white rounded-2xl border border-healthcare-border p-4 shadow-sm mb-8">
      <div className="flex flex-col lg:flex-row gap-4 lg:items-center">
        {/* Specialization */}
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <select
              value={selectedSpecialization}
              onChange={(e) => setSelectedSpecialization(e.target.value)}
              className="w-full pl-4 pr-10 py-2.5 rounded-xl border border-healthcare-border bg-healthcare-surface/30 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/10 outline-none text-healthcare-text text-sm font-medium appearance-none cursor-pointer hover:border-brand-blue/50 transition-colors"
            >
              <option value="">All Specializations</option>
              {SPECIALIZATIONS.map((spec) => (
                <option key={spec} value={spec}>
                  {spec}
                </option>
              ))}
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

        {/* Language */}
        <div className="flex-1 min-w-[180px]">
          <div className="relative">
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="w-full pl-4 pr-10 py-2.5 rounded-xl border border-healthcare-border bg-healthcare-surface/30 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/10 outline-none text-healthcare-text text-sm font-medium appearance-none cursor-pointer hover:border-brand-blue/50 transition-colors"
            >
              <option value="">All Languages</option>
              {LANGUAGES.map((lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
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

        {/* Rating */}
        <div className="flex-shrink-0 min-w-[140px]">
          <div className="relative">
            <select
              value={minRating}
              onChange={(e) => setMinRating(Number(e.target.value))}
              className="w-full pl-4 pr-10 py-2.5 rounded-xl border border-healthcare-border bg-healthcare-surface/30 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/10 outline-none text-healthcare-text text-sm font-medium appearance-none cursor-pointer hover:border-brand-blue/50 transition-colors"
            >
              <option value="0">All Ratings</option>
              <option value="4">4+ Stars</option>
              <option value="4.5">4.5+ Stars</option>
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

        {/* Price & Divider */}
        <div className="hidden lg:block w-px h-8 bg-healthcare-border mx-2"></div>

        {/* Price Range */}
        <div className="flex-shrink-0 flex items-center gap-3 bg-healthcare-surface/30 border border-healthcare-border rounded-xl px-4 py-2">
          <span className="text-sm font-bold text-healthcare-text-muted">
            Fee:
          </span>
          <input
            type="number"
            placeholder="Min"
            value={feeRange[0]}
            onChange={(e) =>
              setFeeRange([parseInt(e.target.value) || 0, feeRange[1]])
            }
            className="w-20 bg-transparent text-sm font-semibold text-healthcare-text outline-none border-none p-0 focus:ring-0"
          />
          <span className="text-healthcare-text-muted">-</span>
          <input
            type="number"
            placeholder="Max"
            value={feeRange[1]}
            onChange={(e) =>
              setFeeRange([feeRange[0], parseInt(e.target.value) || 10000])
            }
            className="w-20 bg-transparent text-sm font-semibold text-healthcare-text outline-none border-none p-0 focus:ring-0 text-right"
          />
        </div>

        {/* Divider */}
        <div className="hidden lg:block w-px h-8 bg-healthcare-border mx-2"></div>

        {/* Reset */}
        <button
          onClick={clearFilters}
          className="px-4 py-2.5 text-sm font-bold text-brand-blue hover:bg-brand-blue-50 rounded-xl transition-colors whitespace-nowrap"
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default FilterBar;
