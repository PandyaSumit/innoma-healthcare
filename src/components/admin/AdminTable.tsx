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
  data: T[] | undefined | any;
  isLoading?: boolean;
  onRowClick?: (item: T) => void;
  emptyMessage?: string;
  page?: number | undefined | any;
  setPage?: any;
}

function AdminTable<T extends { id: string | number }>({
  columns,
  data,
  isLoading,
  onRowClick,
  emptyMessage = "No data found.",
  page = 1,
  setPage = (n: any) => n,
}: AdminTableProps<T>) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-sm border border-healthcare-border overflow-hidden">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead className="bg-healthcare-surface/40 border-b border-healthcare-border">
              <tr>
                {columns.map((column, idx) => (
                  <th
                    key={idx}
                    className="px-6 py-3 text-xs font-bold text-healthcare-text-muted uppercase"
                  >
                    {column.header}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {Array.from({ length: 6 }).map((_, rowIdx) => (
                <tr
                  key={rowIdx}
                  className="odd:bg-white even:bg-healthcare-surface/30"
                >
                  {columns.map((column, colIdx) => (
                    <td
                      key={colIdx}
                      className={`px-6 py-5 ${
                        column.hiddenOnMobile ? "hidden sm:table-cell" : ""
                      } ${column.hiddenOnTablet ? "hidden md:table-cell" : ""}`}
                    >
                      <div className="h-4 w-3/4 rounded bg-gray-200 animate-pulse"></div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-sm border border-healthcare-border  overflow-hidden transition-all duration-300">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-healthcare-surface/40 border-b border-healthcare-border">
                {columns.map((column, idx) => (
                  <th
                    key={idx}
                    className={`px-6 py-3 text-xs font-bold text-healthcare-text-muted uppercase font-sans
        ${column.className || ""}
        ${column.hiddenOnMobile ? "hidden sm:table-cell" : ""}
        ${column.hiddenOnTablet ? "hidden md:table-cell" : ""}
        ${
          idx === 0
            ? "text-start"
            : idx === columns.length - 1
              ? "text-end"
              : "text-center"
        }`}
                  >
                    {column.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-healthcare-border/60">
              {data?.length === 0 ? (
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
                data?.map((item) => (
                  <tr
                    key={item.id}
                    onClick={() => onRowClick?.(item)}
                    className={`group transition-all duration-200 ${
                      onRowClick
                        ? "cursor-pointer hover:bg-healthcare-surface"
                        : "hover:bg-healthcare-surface"
                    }`}
                  >
                    {columns.map((column, idx) => (
                      <td
                        key={idx}
                        className={`px-6 py-2.5 text-sm text-healthcare-text align-middle  transition-colors ${column.className || ""} ${
                          column.hiddenOnMobile ? "hidden sm:table-cell" : ""
                        } ${column.hiddenOnTablet ? "hidden md:table-cell" : ""}
                      
                       ${
                         idx === 0
                           ? "text-start"
                           : idx === columns.length - 1
                             ? "text-end"
                             : "text-center"
                       }
                      `}
                      >
                        {typeof column.accessor === "function" ? (
                          <div
                            className={`flex items-center  w-full min-h-[1.5rem] ${idx === 0 ? "justify-start" : idx === columns.length - 1 ? "justify-end" : "justify-center"}`}
                          >
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

      {data?.meta?.total > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 p-2 bg-white border border-healthcare-border rounded-sm">
          {/* Results Info */}
          <p className="text-sm font-medium text-healthcare-text-muted">
            Showing{" "}
            <span className="font-bold text-healthcare-text">
              {(page - 1) * data.meta.limit + 1} –{" "}
              {Math.min(page * data.meta.limit, data.meta.total)}
            </span>{" "}
            of{" "}
            <span className="font-bold text-healthcare-text">
              {data.meta.total.toLocaleString()}
            </span>{" "}
            patients
          </p>

          {/* Pagination Controls */}
          <div className="flex items-center gap-2">
            {/* Previous */}
            <button
              disabled={page <= 1}
              onClick={() => setPage(page - 1)}
              className="flex items-center justify-center w-10 h-10 rounded-sm border border-transparent hover:border-healthcare-border bg-white hover:bg-healthcare-surface transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            {/* Page indicator */}
            <div className="px-4 py-2 rounded-sm bg-brand-blue/5 border border-brand-blue/10">
              <span className="font-bold text-brand-blue">{page}</span>
              <span className="mx-1 text-healthcare-text-muted">/</span>
              <span className="font-semibold text-healthcare-text-muted">
                {data.meta.totalPages}
              </span>
            </div>

            {/* Next */}
            <button
              disabled={page >= data?.meta?.totalPages}
              onClick={() => setPage(page + 1)}
              className="flex items-center justify-center w-10 h-10 rounded-sm border border-transparent hover:border-healthcare-border bg-white hover:bg-healthcare-surface transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default AdminTable;
