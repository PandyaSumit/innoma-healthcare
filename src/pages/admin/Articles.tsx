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
import GroupButton from "../../components/ui/GroupButton";

import editIcon from "../../assets/svg/edit.svg";
import deleteIcon from "../../assets/svg/delete.svg";

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
    <div className="space-y-2 animate-fade-in">
      <AdminPageHeader
        title="Articles"
        description="Manage your platform's knowledge base, blog posts, and educational content."
        actions={
          <Link
            to="/admin/articles/new"
            className="inline-flex flex-1 justify-center items-center gap-2 px-5 py-3 bg-brand-blue text-white rounded-sm font-bold text-sm hover:opacity-90 transition-all no-underline shadow-lg shadow-blue-100"
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
      <section className="bg-white w-max p-2 rounded-sm border border-healthcare-border  flex items-center gap-2">
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
          data={data?.items || []}
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
                    className=" text-healthcare-text-muted hover:text-healthcare-text hover:bg-healthcare-surface transition-all no-underline "
                  >
                    <img src={editIcon} alt="Edit" className="min-w-5 w-5" />
                  </Link>
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm("Delete this article?")) del.mutate(a.id);
                    }}
                    className=" text-healthcare-text-muted cursor-pointer hover:text-healthcare-text hover:bg-healthcare-surface transition-all no-underline "
                  >
                    <img
                      src={deleteIcon}
                      alt="Delete"
                      className="min-w-5 w-5"
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
  );
}
