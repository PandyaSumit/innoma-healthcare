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
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import AdminTable from "../../components/admin/AdminTable";
import type { AdminArticle } from "../../types/admin";
import GroupButton from "../../components/ui/GroupButton";

import editIcon from "../../assets/svg/edit.svg";
import deleteIcon from "../../assets/svg/delete.svg";
import Modal from "../../components/ui/Model";

export default function Articles() {
  const qc = useQueryClient();
  const [filter, setFilter] = useState<"all" | "published" | "draft">("all");
  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState(null);
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
    <>
      <div className="space-y-2 animate-fade-in">
        <AdminPageHeader
          title="Articles"
          description="Manage your platform's knowledge base, blog posts, and educational content."
          actions={
            <Link
              to="/admin/articles/new"
              className="inline-flex flex-1 justify-center items-center gap-2 px-5 py-3 bg-brand-blue text-white rounded-md font-bold text-sm hover:opacity-90 transition-all no-underline shadow-lg shadow-blue-100"
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
        <section className="bg-white w-max p-2 rounded-md border border-healthcare-border  flex items-center gap-2">
          <GroupButton
            value={filter}
            onChange={(f) => {
              setFilter(f);
              setPage(1);
            }}
            btns={[
              { label: "all", value: "all" },
              { label: "published", value: "published" },
              {
                label: "draft",
                value: "draft",
              },
            ]}
          />
        </section>

        <div className="space-y-6">
          <AdminTable<AdminArticle>
            data={data || []}
            isLoading={isLoading}
            emptyMessage="No articles found."
            columns={[
              {
                header: "Article",
                accessor: (a) => (
                  <div className="flex items-center gap-3 max-w-md">
                    {/* Cover */}
                    <div className="w-12 h-12 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                      {a.cover_image_url ? (
                        <img
                          src={a.cover_image_url}
                          alt={a.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-gray-400 font-semibold">
                          {a?.author_name?.charAt(0)?.toUpperCase()}
                        </div>
                      )}
                    </div>

                    {/* Title + excerpt */}
                    <div className="flex flex-col">
                      <p className="font-semibold text-healthcare-text text-sm line-clamp-1">
                        {a.title}
                      </p>

                      {a.excerpt && (
                        <p className="text-xs text-healthcare-text-muted line-clamp-1 mt-0.5">
                          {a.excerpt}
                        </p>
                      )}

                      {a.is_featured && (
                        <span className="text-[10px] mt-1 font-bold text-amber-600">
                          ⭐ Featured
                        </span>
                      )}
                    </div>
                  </div>
                ),
              },

              {
                header: "Author",
                accessor: (a) => (
                  <span className="text-sm font-medium text-healthcare-text">
                    {a.author_name}
                  </span>
                ),
                hiddenOnTablet: true,
              },

              {
                header: "Tags",
                accessor: (a) => (
                  <div className="flex flex-wrap gap-1 max-w-45">
                    {a.tags?.slice(0, 2).map((t: string) => (
                      <span
                        key={t}
                        className="px-2 py-1 text-[10px] bg-gray-100 text-gray-600 rounded-md font-semibold"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                ),
                hiddenOnTablet: true,
              },

              {
                header: "Stats",
                accessor: (a) => (
                  <div className="flex flex-col text-xs text-healthcare-text-muted">
                    <span>👁 {a?.views_count}</span>
                    <span>⏱ {a?.read_time_minutes} min</span>
                  </div>
                ),
                hiddenOnMobile: true,
              },

              {
                header: "published_Date",
                accessor: (a) => (
                  <span className="text-sm text-healthcare-text-muted font-medium">
                    {a.published_at
                      ? new Date(a.published_at).toLocaleDateString(undefined, {
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
                    className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      a.status === "published"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                        : "bg-gray-50 text-gray-500 border border-gray-100"
                    }`}
                  >
                    {a.status}
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
                          published: a.status === "published",
                        });
                      }}
                      className="px-3 py-1.5 text-xs font-semibold text-brand-blue bg-blue-50 rounded-md hover:bg-blue-100 transition"
                    >
                      {a.status === "published" ? "Unpublish" : "Publish"}
                    </button>

                    <Link
                      to={`/admin/articles/${a.id}/edit`}
                      className="p-1 hover:bg-gray-100 rounded-md transition w-10 h-10 flex"
                    >
                      <img
                        src={editIcon}
                        alt="Edit"
                        className="w-5 h-5 m-auto"
                      />
                    </Link>

                    <span
                      onClick={(e) => {
                        setDeleteTarget(a);
                      }}
                      className="p-1 hover:bg-gray-100 rounded-md cursor-pointer transition w-10 h-10 flex"
                    >
                      <img
                        src={deleteIcon}
                        alt="Delete"
                        className="w-5 h-5 m-auto"
                      />
                    </span>
                  </div>
                ),
              },
            ]}
          />

          {data?.totalPages > 1 && (
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
      </div>

      <Modal
        title=" Delete Articles"
        isOpen={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
      >
        <p className="text-lg text-start text-healthcare-text-muted mb-6">
          Are you sure you want to delete{" "}
          <span className="font-bold text-healthcare-text-muted/80">
            "{deleteTarget?.title}"
          </span>{" "}
          ?
        </p>

        <div className="grid grid-cols-2  gap-2">
          <button
            onClick={() => setDeleteTarget(null)}
            className="px-4 py-2 text-sm font-semibold bg-gray-100 hover:bg-gray-200 rounded-md"
          >
            Cancel
          </button>

          <button
            onClick={() => {
              del.mutate(deleteTarget?.id);
              setDeleteTarget(null);
            }}
            className="px-4 py-2 text-sm font-semibold bg-red-500 text-white hover:bg-red-600 rounded-md"
          >
            Delete
          </button>
        </div>
      </Modal>
    </>
  );
}
