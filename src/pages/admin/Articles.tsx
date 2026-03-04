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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-healthcare-text">Articles</h1>
          <p className="text-sm text-healthcare-text-muted mt-1">
            Manage blog posts and published content.
          </p>
        </div>
        <Link
          to="/admin/articles/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-brand-blue text-white rounded-xl font-bold text-sm hover:opacity-90 transition-all no-underline shadow-sm"
        >
          <svg
            className="w-4 h-4"
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
      </div>

      {/* Filter */}
      <div className="flex gap-2">
        {(["all", "published", "draft"] as const).map((f) => (
          <button
            key={f}
            onClick={() => {
              setFilter(f);
              setPage(1);
            }}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all border-none cursor-pointer ${
              filter === f
                ? "bg-brand-blue text-white"
                : "bg-white text-healthcare-text-muted border border-healthcare-neutral/20 hover:bg-healthcare-surface"
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {isLoading && (
        <div className="flex justify-center py-10">
          <Spinner size="lg" />
        </div>
      )}

      {data && (
        <>
          <div className="bg-white rounded-2xl border border-healthcare-border shadow-clinical overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-healthcare-border bg-healthcare-surface/40">
                    <th className="text-left px-5 py-3.5 text-xs font-bold text-healthcare-text-muted uppercase tracking-wider">
                      Title
                    </th>
                    <th className="text-left px-5 py-3.5 text-xs font-bold text-healthcare-text-muted uppercase tracking-wider hidden md:table-cell">
                      Author
                    </th>
                    <th className="text-left px-5 py-3.5 text-xs font-bold text-healthcare-text-muted uppercase tracking-wider hidden sm:table-cell">
                      Date
                    </th>
                    <th className="text-left px-5 py-3.5 text-xs font-bold text-healthcare-text-muted uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-5 py-3.5" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-healthcare-border">
                  {(!data.items || data.items.length === 0) && (
                    <tr>
                      <td
                        colSpan={5}
                        className="text-center py-10 text-sm text-healthcare-text-muted"
                      >
                        No articles found.
                      </td>
                    </tr>
                  )}
                  {(data.items || []).map((a) => (
                    <tr
                      key={a.id}
                      className="hover:bg-healthcare-surface/20 transition-colors"
                    >
                      <td className="px-5 py-4">
                        <p className="font-bold text-healthcare-text line-clamp-1">
                          {a.title}
                        </p>
                        {a.excerpt && (
                          <p className="text-xs text-healthcare-text-muted line-clamp-1 mt-0.5">
                            {a.excerpt}
                          </p>
                        )}
                      </td>
                      <td className="px-5 py-4 text-healthcare-text hidden md:table-cell">
                        {a.authorName}
                      </td>
                      <td className="px-5 py-4 text-healthcare-text-muted hidden sm:table-cell">
                        {a.publishedAt
                          ? new Date(a.publishedAt).toLocaleDateString()
                          : "—"}
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${a.isPublished ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-600"}`}
                        >
                          {a.isPublished ? "Published" : "Draft"}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2 justify-end">
                          <button
                            onClick={() =>
                              togglePublish.mutate({
                                id: a.id,
                                published: a.isPublished,
                              })
                            }
                            className="px-3 py-1.5 text-xs font-bold text-brand-blue bg-brand-blue/5 rounded-lg hover:bg-brand-blue/10 transition-colors border-none cursor-pointer"
                          >
                            {a.isPublished ? "Unpublish" : "Publish"}
                          </button>
                          <Link
                            to={`/admin/articles/${a.id}/edit`}
                            className="px-3 py-1.5 text-xs font-bold text-healthcare-text bg-healthcare-surface rounded-lg hover:bg-healthcare-border transition-colors no-underline"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => {
                              if (confirm("Delete this article?"))
                                del.mutate(a.id);
                            }}
                            className="px-3 py-1.5 text-xs font-bold text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors border-none cursor-pointer"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {data.totalPages > 1 && (
            <div className="flex items-center justify-between text-sm">
              <p className="text-healthcare-text-muted">
                Page {data.page} of {data.totalPages} ({data.total} articles)
              </p>
              <div className="flex gap-2">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage(page - 1)}
                  className="px-3 py-1.5 rounded-lg border border-healthcare-neutral/20 text-healthcare-text font-bold disabled:opacity-40 hover:bg-healthcare-surface transition-all cursor-pointer bg-white"
                >
                  Prev
                </button>
                <button
                  disabled={page >= data.totalPages}
                  onClick={() => setPage(page + 1)}
                  className="px-3 py-1.5 rounded-lg border border-healthcare-neutral/20 text-healthcare-text font-bold disabled:opacity-40 hover:bg-healthcare-surface transition-all cursor-pointer bg-white"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
