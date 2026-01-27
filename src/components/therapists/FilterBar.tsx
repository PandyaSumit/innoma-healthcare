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
    <div className="bg-white border border-healthcare-border rounded-xl p-4 mb-8">
      <div className="flex flex-col lg:flex-row lg:items-center gap-4">
        {/* Specialization */}
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <select
              value={selectedSpecialization}
              onChange={(e) => setSelectedSpecialization(e.target.value)}
              className="
                w-full
                px-4 py-2.5
                rounded-lg
                border border-healthcare-border
                bg-white
                text-sm font-medium
                text-healthcare-text
                appearance-none
                focus:ring-2 focus:ring-brand-blue/20
                outline-none
              "
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
              className="
                w-full
                px-4 py-2.5
                rounded-lg
                border border-healthcare-border
                bg-white
                text-sm font-medium
                text-healthcare-text
                appearance-none
                focus:ring-2 focus:ring-brand-blue/20
                outline-none
              "
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
        <div className="min-w-[140px]">
          <div className="relative">
            <select
              value={minRating}
              onChange={(e) => setMinRating(Number(e.target.value))}
              className="
                w-full
                px-4 py-2.5
                rounded-lg
                border border-healthcare-border
                bg-white
                text-sm font-medium
                text-healthcare-text
                appearance-none
                focus:ring-2 focus:ring-brand-blue/20
                outline-none
              "
            >
              <option value={0}>All Ratings</option>
              <option value={4}>4+ Stars</option>
              <option value={4.5}>4.5+ Stars</option>
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

        {/* Fee Range */}
        <div className="flex items-center gap-2 border border-healthcare-border rounded-lg px-3 py-2">
          <span className="text-sm text-healthcare-text-muted">Fee</span>

          <input
            type="number"
            value={feeRange[0]}
            onChange={(e) =>
              setFeeRange([parseInt(e.target.value) || 0, feeRange[1]])
            }
            className="w-20 text-sm text-healthcare-text bg-transparent outline-none"
            placeholder="Min"
          />

          <span className="text-healthcare-text-muted">–</span>

          <input
            type="number"
            value={feeRange[1]}
            onChange={(e) =>
              setFeeRange([feeRange[0], parseInt(e.target.value) || 10000])
            }
            className="w-20 text-sm text-healthcare-text bg-transparent outline-none text-right"
            placeholder="Max"
          />
        </div>

        {/* Reset */}
        <button
          onClick={clearFilters}
          className="
            text-sm
            font-medium
            text-brand-blue
            px-4 py-2
            rounded-lg
            hover:bg-brand-blue/10
            transition
            whitespace-nowrap
          "
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default FilterBar;
