import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  fetchAdminArticles,
  deleteArticle,
  publishArticle,
  unpublishArticle,
} from "../../api/admin.api";
import Spinner from "../../components/ui/Spinner";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import AdminTable from "../../components/admin/AdminTable";
import type { AdminArticle } from "../../types/admin";

export default function Articles() {
  const qc = useQueryClient();
  const [filter, setFilter] = useState<"all" | "published" | "draft">("all");
  const [page, setPage] = useState(1);

  const params =
    filter === "all"
      ? { page, limit: 20 }
      : { page, limit: 20, published: filter === "published" };

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "articles", filter, page],
    queryFn: () => fetchAdminArticles(params),
  });

  const del = useMutation({
    mutationFn: deleteArticle,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "articles"] });
      toast.success("Article deleted.");
    },
    onError: (err: any) => toast.error(err.message ?? "Failed to delete."),
  });

  const togglePublish = useMutation({
    mutationFn: ({ id, published }: { id: string; published: boolean }) =>
      published ? unpublishArticle(id) : publishArticle(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "articles"] });
      toast.success("Article updated.");
    },
    onError: (err: any) => toast.error(err.message ?? "Failed to update."),
  });

  return (
    <div className="space-y-8 animate-fade-in">
      <AdminPageHeader
        title="Articles"
        description="Manage your platform's knowledge base, blog posts, and educational content."
        actions={
          <Link
            to="/admin/articles/new"
            className="inline-flex items-center gap-2 px-5 py-3 bg-brand-blue text-white rounded-2xl font-bold text-sm hover:opacity-90 transition-all no-underline shadow-lg shadow-blue-100"
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
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            New Article
          </Link>
        }
      />

      {/* Filter Section */}
      <section className="bg-white p-2 rounded-2xl border border-healthcare-border shadow-clinical flex items-center gap-2">
        <div className="flex-1 flex items-center gap-1 p-1">
          {(["all", "published", "draft"] as const).map((f) => (
            <button
              key={f}
              onClick={() => {
                setFilter(f);
                setPage(1);
              }}
              className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all border whitespace-nowrap cursor-pointer uppercase tracking-wider ${
                filter === f
                  ? "bg-brand-blue text-white border-brand-blue shadow-clinical"
                  : "bg-transparent text-healthcare-text-muted border-transparent hover:bg-healthcare-surface hover:text-healthcare-text"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </section>

      {isLoading && (
        <div className="flex justify-center py-20">
          <Spinner size="lg" />
        </div>
      )}

      {data && (
        <div className="space-y-6">
          <AdminTable<AdminArticle>
            data={data.items || []}
            isLoading={isLoading}
            emptyMessage="No articles found."
            columns={[
              {
                header: "Content",
                accessor: (a) => (
                  <div className="max-w-md">
                    <p className="font-bold text-healthcare-text text-sm line-clamp-1">
                      {a.title}
                    </p>
                    {a.excerpt && (
                      <p className="text-xs text-healthcare-text-muted line-clamp-1 mt-1 opacity-80">
                        {a.excerpt}
                      </p>
                    )}
                  </div>
                ),
              },
              {
                header: "Author",
                accessor: (a) => (
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-healthcare-surface flex items-center justify-center text-[10px] font-bold text-healthcare-text-muted border border-healthcare-border">
                      {a.authorName[0]}
                    </div>
                    <span className="text-sm font-medium text-healthcare-text">
                      {a.authorName}
                    </span>
                  </div>
                ),
                hiddenOnTablet: true,
              },
              {
                header: "Date",
                accessor: (a) => (
                  <span className="text-sm text-healthcare-text-muted font-medium">
                    {a.publishedAt
                      ? new Date(a.publishedAt).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "—"}
                  </span>
                ),
                hiddenOnMobile: true,
              },
              {
                header: "Status",
                accessor: (a) => (
                  <span
                    className={`inline-flex items-center px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      a.isPublished
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-100/50"
                        : "bg-gray-50 text-gray-500 border border-gray-100/50"
                    }`}
                  >
                    {a.isPublished ? "Published" : "Draft"}
                  </span>
                ),
              },
              {
                header: "",
                accessor: (a) => (
                  <div className="flex items-center gap-2 justify-end">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        togglePublish.mutate({
                          id: a.id,
                          published: a.isPublished,
                        });
                      }}
                      className="px-4 py-2 text-xs font-bold text-brand-blue bg-blue-50/50 rounded-xl hover:bg-blue-100/50 transition-all border-none cursor-pointer"
                    >
                      {a.isPublished ? "Unpublish" : "Publish"}
                    </button>
                    <Link
                      to={`/admin/articles/${a.id}/edit`}
                      className="p-2 text-healthcare-text-muted hover:text-healthcare-text hover:bg-healthcare-surface rounded-xl transition-all no-underline border border-transparent hover:border-healthcare-border"
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
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </Link>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm("Delete this article?")) del.mutate(a.id);
                      }}
                      className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all border-none cursor-pointer"
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
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                ),
              },
            ]}
          />

          {data.totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between p-6 gap-6">
              <p className="text-sm font-medium text-healthcare-text-muted order-2 sm:order-1">
                Showing{" "}
                <span className="text-healthcare-text font-bold">
                  {(page - 1) * 20 + 1}-{Math.min(page * 20, data.total)}
                </span>{" "}
                of{" "}
                <span className="text-healthcare-text font-bold">
                  {data.total.toLocaleString()}
                </span>{" "}
                articles
              </p>
              <div className="flex items-center gap-2 order-1 sm:order-2">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage(page - 1)}
                  className="p-2.5 rounded-xl border border-healthcare-border text-healthcare-text disabled:opacity-30 hover:bg-healthcare-surface transition-all cursor-pointer bg-white group"
                >
                  <svg
                    className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform"
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

                <div className="bg-healthcare-surface/50 border border-healthcare-border rounded-xl px-4 py-2 flex items-center gap-2">
                  <span className="text-sm font-bold text-brand-blue">
                    {page}
                  </span>
                  <span className="text-sm text-healthcare-text-muted/40 font-bold">
                    /
                  </span>
                  <span className="text-sm font-bold text-healthcare-text-muted">
                    {data.totalPages}
                  </span>
                </div>

                <button
                  disabled={page >= data.totalPages}
                  onClick={() => setPage(page + 1)}
                  className="p-2.5 rounded-xl border border-healthcare-border text-healthcare-text disabled:opacity-30 hover:bg-healthcare-surface transition-all cursor-pointer bg-white group"
                >
                  <svg
                    className="w-5 h-5 group-hover:translate-x-0.5 transition-transform"
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
        </div>
      )}
    </div>
  );
}
