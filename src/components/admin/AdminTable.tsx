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
    <div className="bg-white rounded-2xl border border-healthcare-border shadow-clinical-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b border-healthcare-border bg-healthcare-surface/50">
              {columns.map((column, idx) => (
                <th
                  key={idx}
                  className={`text-left px-6 py-4 text-xs font-bold text-healthcare-text-muted uppercase tracking-wider ${
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
          <tbody className="divide-y divide-healthcare-border">
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-12 text-center text-healthcare-text-muted"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((item) => (
                <tr
                  key={item.id}
                  onClick={() => onRowClick?.(item)}
                  className={`transition-colors ${
                    onRowClick
                      ? "cursor-pointer hover:bg-healthcare-surface/30"
                      : "hover:bg-healthcare-surface/10"
                  }`}
                >
                  {columns.map((column, idx) => (
                    <td
                      key={idx}
                      className={`px-6 py-4 align-middle ${column.className || ""} ${
                        column.hiddenOnMobile ? "hidden sm:table-cell" : ""
                      } ${column.hiddenOnTablet ? "hidden md:table-cell" : ""}`}
                    >
                      {typeof column.accessor === "function"
                        ? column.accessor(item)
                        : (item[column.accessor] as React.ReactNode)}
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
