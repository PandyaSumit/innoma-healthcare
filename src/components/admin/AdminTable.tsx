import React from "react";

interface Column<T> {
  header: string;
  accessor: keyof T | ((item: T) => React.ReactNode);
  className?: string;
  hiddenOnMobile?: boolean;
  hiddenOnTablet?: boolean;
}

interface AdminTableProps<T> {
  columns: Column<T>[];
  data: T[];
  isLoading?: boolean;
  onRowClick?: (item: T) => void;
  emptyMessage?: string;
}

function AdminTable<T extends { id: string | number }>({
  columns,
  data,
  isLoading,
  onRowClick,
  emptyMessage = "No data found.",
}: AdminTableProps<T>) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl border border-healthcare-border shadow-clinical-lg overflow-hidden h-64 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-blue"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-healthcare-border shadow-clinical overflow-hidden transition-all duration-300">
      <div className="overflow-x-auto no-scrollbar">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-healthcare-surface/40 border-b border-healthcare-border">
              {columns.map((column, idx) => (
                <th
                  key={idx}
                  className={`px-6 py-5 text-xs font-bold text-healthcare-text-muted uppercase tracking-wider font-sans ${
                    column.className || ""
                  } ${column.hiddenOnMobile ? "hidden sm:table-cell" : ""} ${
                    column.hiddenOnTablet ? "hidden md:table-cell" : ""
                  }`}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-healthcare-border/60">
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-16 text-center text-healthcare-text-muted bg-healthcare-surface/10"
                >
                  <div className="flex flex-col items-center gap-2">
                    <svg
                      className="w-10 h-10 text-healthcare-border"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"
                      />
                    </svg>
                    <p className="text-sm">{emptyMessage}</p>
                  </div>
                </td>
              </tr>
            ) : (
              data.map((item) => (
                <tr
                  key={item.id}
                  onClick={() => onRowClick?.(item)}
                  className={`group transition-all duration-200 ${
                    onRowClick
                      ? "cursor-pointer hover:bg-healthcare-surface/80"
                      : "hover:bg-healthcare-surface/40"
                  }`}
                >
                  {columns.map((column, idx) => (
                    <td
                      key={idx}
                      className={`px-6 py-5 text-sm text-healthcare-text align-middle border-transparent border-l-2 group-hover:border-brand-blue/30 transition-colors ${column.className || ""} ${
                        column.hiddenOnMobile ? "hidden sm:table-cell" : ""
                      } ${column.hiddenOnTablet ? "hidden md:table-cell" : ""}`}
                    >
                      {typeof column.accessor === "function" ? (
                        <div className="flex items-center min-h-[1.5rem]">
                          {column.accessor(item)}
                        </div>
                      ) : (
                        (item[column.accessor] as React.ReactNode)
                      )}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminTable;
