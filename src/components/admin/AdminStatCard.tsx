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
}

const AdminStatCard: React.FC<AdminStatCardProps> = ({
  label,
  value,
  icon,
  color,
  to,
  trend,
}) => {
  const CardContent = (
    <div className="bg-white rounded-2xl border border-healthcare-border p-6 shadow-clinical hover:shadow-clinical-lg transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <div
          className={`w-12 h-12 rounded-2xl flex items-center justify-center ${color} shadow-sm`}
        >
          {icon}
        </div>
        {trend && (
          <div
            className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
              trend.isPositive
                ? "bg-emerald-50 text-emerald-600"
                : "bg-red-50 text-red-600"
            }`}
          >
            {trend.isPositive ? "+" : "-"}
            {trend.value}%
          </div>
        )}
      </div>
      <div>
        <p className="text-sm font-semibold text-healthcare-text-muted mb-1">
          {label}
        </p>
        <h3 className="text-2xl sm:text-3xl font-bold text-healthcare-text tracking-tight">
          {value}
        </h3>
        {trend?.label && (
          <p className="text-xs text-healthcare-text-muted mt-2">
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
