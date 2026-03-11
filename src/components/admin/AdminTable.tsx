import React, { useEffect, useLayoutEffect, useRef } from "react";

interface Column<T> {
  header: string;
  accessor: keyof T | ((item: T) => React.ReactNode);
  className?: string;
  hiddenOnMobile?: boolean;
  hiddenOnTablet?: boolean;
}

interface AdminTableProps<T> {
  columns: Column<T>[];
  data: T[] | { data: T[]; meta?: any } | undefined;
  isLoading?: boolean;
  onRowClick?: (item: T) => void;
  emptyMessage?: string;
  page?: number;
  setPage?: (n: number) => void;
}

/* ---------------- THROTTLE ---------------- */

function throttle<T extends (...args: any[]) => void>(func: T, delay: number) {
  let lastCall = 0;

  return (...args: Parameters<T>) => {
    const now = Date.now();

    if (now - lastCall < delay) return;

    lastCall = now;
    func(...args);
  };
}

function AdminTable<T extends { id: string | number }>({
  columns,
  data,
  isLoading,
  onRowClick,
  emptyMessage = "No data found.",
  page = 1,
  setPage,
}: AdminTableProps<T>) {
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  /* ---------------- NORMALIZE DATA ---------------- */

  const rows: T[] = Array.isArray(data) ? data : data?.data || [];
  const meta = !Array.isArray(data) ? data?.meta : undefined;

  /* ---------------- INFINITE SCROLL ---------------- */

  const loadNextPage = throttle(() => {
    if (!meta || !setPage) return;

    if (page < meta.totalPages && !isLoading) {
      setPage(page + 1);
    }
  }, 800);

  useLayoutEffect(() => {
    if (!loadMoreRef.current || !meta) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadNextPage();
        }
      },
      {
        rootMargin: "200px",
      }
    );

    observer.observe(loadMoreRef.current);

    return () => observer.disconnect();
  }, [page, meta, isLoading]);

  /* ---------------- LOADING SKELETON ---------------- */

  if (isLoading && rows.length === 0) {
    return (
      <div className="bg-white rounded-md border border-healthcare-border overflow-hidden">
        <table className="w-full">
          <thead>
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
              <tr key={rowIdx}>
                {columns.map((_, colIdx) => (
                  <td key={colIdx} className="px-6 py-4">
                    <div className="h-4 w-3/4 bg-gray-200 animate-pulse rounded"></div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  /* ---------------- TABLE ---------------- */

  return (
    <>
      <div className="bg-white rounded-md border border-healthcare-border overflow-hidden">
        <div className="overflow-x-auto max-h-[calc(100vh-242px)] no-scrollbar">
          <table className="w-full text-left border-collapse">
            {/* HEADER */}

            <thead>
              <tr className="bg-healthcare-surface border-b sticky top-0 border-healthcare-border">
                {columns.map((column, idx) => (
                  <th
                    key={idx}
                    className={`px-6 py-3 text-xs font-bold uppercase text-healthcare-text-muted
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

            {/* BODY */}

            <tbody className="divide-y divide-healthcare-border/60">
              {rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-6 py-16 text-center text-healthcare-text-muted"
                  >
                    {emptyMessage}
                  </td>
                </tr>
              ) : (
                rows.map((item) => (
                  <tr
                    key={item.id}
                    onClick={() => onRowClick?.(item)}
                    className={`transition-all ${
                      onRowClick
                        ? "cursor-pointer hover:bg-healthcare-surface"
                        : "hover:bg-healthcare-surface"
                    }`}
                  >
                    {columns.map((column, idx) => (
                      <td
                        key={idx}
                        className={`px-6 py-3 text-sm text-healthcare-text
                        ${column.className || ""}
                        ${
                          column.hiddenOnMobile ? "hidden sm:table-cell" : ""
                        }
                        ${
                          column.hiddenOnTablet ? "hidden md:table-cell" : ""
                        }
                        ${
                          idx === 0
                            ? "text-start"
                            : idx === columns.length - 1
                            ? "text-end"
                            : "text-center"
                        }`}
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

          {/* INFINITE SCROLL TRIGGER */}

          {meta && (
            <div
              ref={loadMoreRef}
              className="h-16 flex items-center justify-center"
            >
              {isLoading && (
                <p className="text-sm text-healthcare-text-muted">
                  Loading more...
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* FOOTER INFO */}

      {meta && (
        <div className="flex justify-between items-center p-4 bg-white border border-healthcare-border rounded-md mt-2">
          <p className="text-sm text-healthcare-text-muted">
            Showing{" "}
            <span className="font-bold text-healthcare-text">
              {(page - 1) * meta.limit + 1} –{" "}
              {Math.min(page * meta.limit, meta.total)}
            </span>{" "}
            of{" "}
            <span className="font-bold text-healthcare-text">
              {meta.total}
            </span>
          </p>

          <p className="text-sm text-healthcare-text-muted">
            Page{" "}
            <span className="font-bold text-brand-blue">{page}</span> /{" "}
            {meta.totalPages}
          </p>
        </div>
      )}
    </>
  );
}

export default AdminTable;