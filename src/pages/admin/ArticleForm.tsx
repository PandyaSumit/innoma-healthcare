import { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useFormik } from "formik";
import * as yup from "yup";
import { toast } from "sonner";
import {
  fetchAdminArticle,
  createArticle,
  updateArticle,
} from "../../api/admin.api";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import Input from "../../components/ui/Input";
import Textarea from "../../components/ui/Textarea";

const schema = yup.object({
  title: yup.string().required("Title is required"),
  content: yup
    .string()
    .required("Content is required")
    .min(50, "Content must be at least 50 characters"),
  excerpt: yup.string(),
  coverImageUrl: yup.string().url("Must be a valid URL"),
});

const inputCls = (err?: boolean) =>
  `w-full px-5 py-3.5 rounded-2xl border ${err ? "border-red-400 bg-red-50/10" : "border-healthcare-border bg-healthcare-surface/20"} focus:border-brand-blue/50 focus:ring-4 focus:ring-brand-blue/5 outline-none text-healthcare-text font-medium text-sm transition-all placeholder:text-healthcare-text-muted/40`;

const ArticleFormSkeleton = () => {
  return (
    <div className="bg-white rounded-sm border border-healthcare-border p-8 space-y-8 animate-pulse">
      <div className="flex flex-col gap-4">
        {/* Title */}
        <div className="space-y-2">
          <div className="h-3 w-32 bg-gray-200 rounded" />
          <div className="h-12 w-full bg-gray-200 rounded-sm" />
        </div>

        {/* Excerpt */}
        <div className="space-y-2">
          <div className="h-3 w-40 bg-gray-200 rounded" />
          <div className="h-16 w-full bg-gray-200 rounded-sm" />
        </div>

        {/* Cover URL */}
        <div className="space-y-2">
          <div className="h-3 w-48 bg-gray-200 rounded" />
          <div className="h-11 w-full bg-gray-200 rounded-sm" />
        </div>

        {/* Content */}
        <div className="space-y-2">
          <div className="h-3 w-24 bg-gray-200 rounded" />
          <div className="h-64 w-full bg-gray-200 rounded-sm" />
          <div className="h-2 w-40 bg-gray-200 rounded mt-2" />
        </div>

        {/* Tags */}
        <div className="space-y-4">
          <div className="h-3 w-40 bg-gray-200 rounded" />

          <div className="flex flex-wrap gap-2 p-4 border border-healthcare-border border-dashed rounded-sm">
            <div className="h-6 w-16 bg-gray-200 rounded-sm" />
            <div className="h-6 w-20 bg-gray-200 rounded-sm" />
            <div className="h-6 w-14 bg-gray-200 rounded-sm" />
          </div>

          <div className="flex gap-2">
            <div className="h-11 flex-1 bg-gray-200 rounded-sm" />
            <div className="h-11 w-32 bg-gray-200 rounded-sm" />
          </div>
        </div>

        {/* Publish toggle */}
        <div className="p-6 border border-healthcare-border rounded-sm space-y-3">
          <div className="h-3 w-28 bg-gray-200 rounded" />
          <div className="h-3 w-40 bg-gray-200 rounded" />
        </div>
      </div>

      {/* Draft text */}
      <div className="h-3 w-32 bg-gray-200 rounded" />

      {/* Buttons */}
      <div className="grid sm:grid-cols-2 gap-4 pt-6 mt-4 border-t border-healthcare-border">
        <div className="h-12 bg-gray-200 rounded-sm" />
        <div className="h-12 bg-gray-200 rounded-sm" />
      </div>
    </div>
  );
};

function Field({
  label,
  error,
  children,
  required,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-bold text-healthcare-text px-1 flex items-center gap-1">
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {error && (
        <div className="flex items-center gap-1.5 px-1 animate-fade-in">
          <svg
            className="w-3.5 h-3.5 text-red-500"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          <p className="text-red-500 text-[11px] font-bold uppercase tracking-wider">
            {error}
          </p>
        </div>
      )}
    </div>
  );
}

export default function ArticleForm() {
  const { id } = useParams<{ id?: string }>();
  const isEdit = !!id && id !== "new";
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");

  const { data: existing, isLoading } = useQuery({
    queryKey: ["admin", "article", id],
    queryFn: () => fetchAdminArticle(id!),
    enabled: isEdit,
  });

  const create = useMutation({
    mutationFn: createArticle,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "articles"] });
      toast.success("Article created.");
      navigate("/admin/articles");
    },
    onError: (err: any) =>
      toast.error(err.message ?? "Failed to create article."),
  });

  const edit = useMutation({
    mutationFn: (payload: any) => updateArticle(id!, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "articles"] });
      qc.invalidateQueries({ queryKey: ["admin", "article", id] });
      toast.success("Article updated.");
      navigate("/admin/articles");
    },
    onError: (err: any) =>
      toast.error(err.message ?? "Failed to update article."),
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      title: existing?.title ?? "",
      content: existing?.content ?? "",
      excerpt: existing?.excerpt ?? "",
      coverImageUrl: existing?.coverImageUrl ?? "",
      isPublished: existing?.isPublished ?? false,
    },
    validationSchema: schema,
    onSubmit: (values) => {
      const payload = {
        ...values,
        excerpt: values.excerpt || undefined,
        coverImageUrl: values.coverImageUrl || undefined,
        tags: tags.length ? tags : undefined,
      };
      if (isEdit) {
        edit.mutate(payload);
      } else {
        create.mutate(payload);
      }
    },
  });

  // Sync tags from existing on load
  if (
    isEdit &&
    existing &&
    tags.length === 0 &&
    (existing.tags?.length ?? 0) > 0 &&
    !formik.dirty
  ) {
    setTags(existing.tags);
  }

  const addTag = () => {
    const val = newTag.trim();
    if (val && !tags.includes(val)) {
      setTags([...tags, val]);
      setNewTag("");
    }
  };



  const isPending = create.isPending || edit.isPending;

  return (
    <div className="max-w-4xl space-y-2 animate-fade-in">
      <div className="flex items-start gap-4">
        <Link to="/admin/articles" className="mt-2">
          <svg
            className="w-6 h-6 group-hover:-translate-x-0.5 transition-transform"
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
        </Link>
        <div className="flex-1">
          <AdminPageHeader
            title={isEdit ? "Edit Article" : "New Article"}
            description={
              isEdit
                ? `Editing: "${existing?.title}"`
                : "Create and publish a new blog post for the platform users."
            }
          />
        </div>
      </div>

      {isEdit && isLoading ? (
        <ArticleFormSkeleton />
      ) : (
        <form
          onSubmit={formik.handleSubmit}
          className="bg-white rounded-sm border border-healthcare-border  p-8 space-y-8"
        >
          <div className="flex flex-col gap-4">
            <div className="md:col-span-2">
              <Field
                label="Article Title"
                required
                error={formik.touched.title ? formik.errors.title : undefined}
              >
                <Input
                  name="title"
                  value={formik.values.title}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Enter a compelling title…"
                  className={
                    inputCls(!!formik.touched.title && !!formik.errors.title) +
                    " text-lg font-bold"
                  }
                />
              </Field>
            </div>

            <div className="md:col-span-2">
              <Field label="Short Excerpt (optional)">
                <Textarea
                  name="excerpt"
                  value={formik.values.excerpt}
                  onChange={formik.handleChange}
                  rows={2}
                  placeholder="A brief summary that appears in listings…"
                  className={inputCls() + " resize-none"}
                />
              </Field>
            </div>

            <div className="md:col-span-2">
              <Field
                label="Cover Image URL (optional)"
                error={
                  formik.touched.coverImageUrl
                    ? formik.errors.coverImageUrl
                    : undefined
                }
              >
                <div className="relative">
                  <Input
                    name="coverImageUrl"
                    value={formik.values.coverImageUrl}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="https://images.unsplash.com/…"
                    className={
                      inputCls(
                        !!formik.touched.coverImageUrl &&
                          !!formik.errors.coverImageUrl,
                      ) + " pr-12"
                    }
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-healthcare-text-muted/40">
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
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                </div>
              </Field>
            </div>

            <div className="md:col-span-2">
              <Field
                label="Content"
                required
                error={
                  formik.touched.content ? formik.errors.content : undefined
                }
              >
                <Textarea
                  name="content"
                  value={formik.values.content}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  rows={15}
                  placeholder="Start writing your article content here… Markdown formatting is supported."
                  className={
                    inputCls(
                      !!formik.touched.content && !!formik.errors.content,
                    ) + " resize-none font-medium leading-relaxed"
                  }
                />
                <div className="flex items-center gap-2 mt-2 px-1">
                  <div className="w-2 h-2 rounded-full bg-brand-blue/40 animate-pulse" />
                  <p className="text-[10px] font-bold text-healthcare-text-muted uppercase tracking-widest">
                    Supports Markdown Rendering
                  </p>
                </div>
              </Field>
            </div>

            <div className="col-span-2">
              <div className="space-y-4">
                <label className="text-sm font-bold text-healthcare-text px-1">
                  Tags & Categories
                </label>
                <div className="flex flex-wrap gap-2 min-h-10 p-4 bg-healthcare-surface/20 border border-healthcare-border border-dashed rounded-sm">
                  {tags.length === 0 && (
                    <span className="text-xs text-healthcare-text-muted font-medium italic opacity-60">
                      No tags added yet
                    </span>
                  )}
                  {tags.map((t) => (
                    <span
                      key={t}
                      className="flex items-center gap-2 px-4 py-1.5 bg-brand-blue text-white text-xs font-bold rounded-sm shadow-clinical-sm animate-scale-in"
                    >
                      {t}
                      <button
                        type="button"
                        onClick={() => setTags(tags.filter((x) => x !== t))}
                        className="hover:scale-110 transition-transform bg-transparent border-none cursor-pointer p-0 text-white"
                      >
                        <svg
                          className="w-3 h-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === "Enter" && (e.preventDefault(), addTag())
                    }
                    placeholder="Type a tag…"
                  />
                  <button
                    type="button"
                    onClick={addTag}
                    className="px-6 py-2.5 bg-brand-blue min-w-37.5 text-white rounded-sm text-sm font-bold  transition-all cursor-pointer border-none"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-end  col-span-2">
              <div className="flex items-center justify-between p-6 bg-healthcare-surface/20 border border-healthcare-border rounded-sm transition-all hover:bg-healthcare-surface/30">
                <div className="space-y-1">
                  <p className="text-sm font-bold text-healthcare-text leading-none">
                    Publish Status
                  </p>
                  <p className="text-xs text-healthcare-text-muted font-medium opacity-80">
                    {formik.values.isPublished
                      ? "Visible to all users"
                      : "Saved as a draft"}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    formik.setFieldValue(
                      "isPublished",
                      !formik.values.isPublished,
                    )
                  }
                  className={`relative inline-flex h-7 w-12 items-center rounded-full transition-all border-none cursor-pointer focus:ring-4 focus:ring-brand-blue/10 ${formik.values.isPublished ? "bg-brand-blue shadow-clinical-blue" : "bg-healthcare-neutral/30"}`}
                >
                  <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-xl transition-all ${formik.values.isPublished ? "translate-x-6" : "translate-x-1"}`}
                  />
                </button>
              </div>
            </div>
          </div>

          <p className="text-xs text-healthcare-text-muted font-bold uppercase tracking-widest hidden sm:block">
            {isEdit ? "Unsaved Changes" : "Draft Article"}
          </p>
          <div className="grid sm:grid-cols-2 gap-4 pt-6 mt-4 border-t border-healthcare-border">
            <button
              type="button"
              onClick={() => navigate("/admin/articles")}
              className="flex-1 sm:flex-none px-8 py-3.5 border border-healthcare-border rounded-sm text-sm font-bold text-healthcare-text hover:bg-healthcare-surface transition-all cursor-pointer bg-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 sm:flex-none px-12 py-3.5 bg-brand-blue text-white rounded-sm text-sm font-bold hover:opacity-90 hover:shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed border-none cursor-pointer"
            >
              {isPending
                ? "Processing…"
                : isEdit
                  ? "Save Changes"
                  : "Create Article"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
