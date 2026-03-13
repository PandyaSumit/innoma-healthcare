import React from "react";
import { Link } from "react-router-dom";

interface AdminStatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  to?: string;
  trend?: {
    value: string | number;
    isPositive: boolean;
    label?: string;
  };
  isLoading?: boolean;
}

const AdminStatCard: React.FC<AdminStatCardProps> = ({
  label,
  value,
  icon,
  color,
  to,
  trend,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <div className="bg-white rounded-md border border-healthcare-border p-5 animate-pulse">
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 rounded-md bg-gray-200" />
          <div className="w-16 h-6 rounded-full bg-gray-200" />
        </div>

        <div>
          <div className="h-4 w-24 bg-gray-200 rounded mb-3"></div>
          <div className="h-8 w-20 bg-gray-200 rounded"></div>
          <div className="h-3 w-32 bg-gray-200 rounded mt-3"></div>
        </div>
      </div>
    );
  }

  const CardContent = (
    <div className="bg-white rounded-md border border-healthcare-border p-5 h-full transition-all duration-500 group relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-brand-blue/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-brand-blue/10 transition-colors duration-500" />

      <div className="flex items-center justify-between mb-4 relative z-10">
        <div
          className={`w-12 h-12 rounded-md flex items-center justify-center ${color} shadow-clinical group-hover:scale-110 transition-transform duration-500`}
        >
          {React.isValidElement(icon)
            ? React.cloneElement(
                icon as React.ReactElement<{ className?: string }>,
                {
                  className: "w-6 h-6",
                },
              )
            : icon}
        </div>
        {trend && (
          <div
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${
              trend.isPositive
                ? "bg-emerald-50 text-emerald-600 border border-emerald-100/50"
                : "bg-red-50 text-red-600 border border-red-100/50"
            }`}
          >
            {trend.isPositive ? (
              <svg
                className="w-3 h-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 10l7-7m0 0l7 7m-7-7v18"
                />
              </svg>
            ) : (
              <svg
                className="w-3 h-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
            )}
            {trend.value}%
          </div>
        )}
      </div>
      <div className="relative z-10">
        <p className="text-xs font-semibold text-healthcare-text-muted mb-1 tracking-wide uppercase">
          {label}
        </p>
        <h3 className="text-2xl sm:text-3xl font-bold text-healthcare-text tracking-tight group-hover:text-brand-blue transition-colors duration-300">
          {value}
        </h3>
        {trend?.label && (
          <p className="text-xs text-healthcare-text-muted mt-3 font-medium opacity-80">
            {trend.label}
          </p>
        )}
      </div>
    </div>
  );

  if (to) {
    return (
      <Link to={to} className="no-underline block group">
        {CardContent}
      </Link>
    );
  }

  return CardContent;
};

export default AdminStatCard;
