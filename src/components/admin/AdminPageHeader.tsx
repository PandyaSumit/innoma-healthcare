import React from "react";

interface AdminPageHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}

const AdminPageHeader: React.FC<AdminPageHeaderProps> = ({
  title,
  description,
  actions,
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-10 pb-2">
      <div className="space-y-1">
        <h1 className="text-3xl sm:text-4xl font-bold text-healthcare-text tracking-tight animate-slide-up">
          {title}
        </h1>
        {description && (
          <p className="text-base text-healthcare-text-muted max-w-3xl animate-fade-in">
            {description}
          </p>
        )}
      </div>
      {actions && (
        <div className="flex items-center gap-3 animate-fade-in stagger-1">
          {actions}
        </div>
      )}
    </div>
  );
};

export default AdminPageHeader;
