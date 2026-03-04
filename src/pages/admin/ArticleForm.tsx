import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { toast } from 'sonner';
import {
  fetchAdminArticle,
  createArticle,
  updateArticle,
} from '../../api/admin.api';
import Spinner from '../../components/ui/Spinner';

const schema = yup.object({
  title: yup.string().required('Title is required'),
  content: yup.string().required('Content is required').min(50, 'Content must be at least 50 characters'),
  excerpt: yup.string(),
  coverImageUrl: yup.string().url('Must be a valid URL'),
});

const inputCls = (err?: boolean) =>
  `w-full px-4 py-2.5 rounded-xl border ${err ? 'border-red-400' : 'border-healthcare-neutral/20'} focus:border-brand-blue outline-none text-healthcare-text bg-white font-medium text-sm placeholder:text-healthcare-text-muted/40`;

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-semibold text-healthcare-text">{label}</label>
      {children}
      {error && <p className="text-red-500 text-xs font-bold">{error}</p>}
    </div>
  );
}

export default function ArticleForm() {
  const { id } = useParams<{ id?: string }>();
  const isEdit = !!id && id !== 'new';
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');

  const { data: existing, isLoading } = useQuery({
    queryKey: ['admin', 'article', id],
    queryFn: () => fetchAdminArticle(id!),
    enabled: isEdit,
  });

  const create = useMutation({
    mutationFn: createArticle,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'articles'] });
      toast.success('Article created.');
      navigate('/admin/articles');
    },
    onError: (err: any) => toast.error(err.message ?? 'Failed to create article.'),
  });

  const edit = useMutation({
    mutationFn: (payload: any) => updateArticle(id!, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'articles'] });
      qc.invalidateQueries({ queryKey: ['admin', 'article', id] });
      toast.success('Article updated.');
      navigate('/admin/articles');
    },
    onError: (err: any) => toast.error(err.message ?? 'Failed to update article.'),
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      title: existing?.title ?? '',
      content: existing?.content ?? '',
      excerpt: existing?.excerpt ?? '',
      coverImageUrl: existing?.coverImageUrl ?? '',
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
  if (isEdit && existing && tags.length === 0 && existing.tags.length > 0 && !formik.dirty) {
    setTags(existing.tags);
  }

  const addTag = () => {
    const val = newTag.trim();
    if (val && !tags.includes(val)) {
      setTags([...tags, val]);
      setNewTag('');
    }
  };

  if (isEdit && isLoading) {
    return <div className="flex justify-center py-10"><Spinner size="lg" /></div>;
  }

  const isPending = create.isPending || edit.isPending;

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-healthcare-text">
          {isEdit ? 'Edit Article' : 'New Article'}
        </h1>
        <p className="text-sm text-healthcare-text-muted mt-1">
          {isEdit ? 'Update article content.' : 'Create a new blog post.'}
        </p>
      </div>

      <form onSubmit={formik.handleSubmit} className="bg-white rounded-2xl border border-healthcare-border shadow-clinical p-6 space-y-5">
        <Field label="Title" error={formik.touched.title ? formik.errors.title : undefined}>
          <input name="title" value={formik.values.title} onChange={formik.handleChange} onBlur={formik.handleBlur} placeholder="Article title…" className={inputCls(!!formik.touched.title && !!formik.errors.title)} />
        </Field>

        <Field label="Excerpt (optional)">
          <textarea name="excerpt" value={formik.values.excerpt} onChange={formik.handleChange} rows={2} placeholder="Short summary shown in listings…" className={inputCls() + ' resize-none'} />
        </Field>

        <Field label="Cover Image URL (optional)" error={formik.touched.coverImageUrl ? formik.errors.coverImageUrl : undefined}>
          <input name="coverImageUrl" value={formik.values.coverImageUrl} onChange={formik.handleChange} onBlur={formik.handleBlur} placeholder="https://example.com/image.jpg" className={inputCls(!!formik.touched.coverImageUrl && !!formik.errors.coverImageUrl)} />
        </Field>

        <Field label="Content" error={formik.touched.content ? formik.errors.content : undefined}>
          <textarea
            name="content"
            value={formik.values.content}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            rows={12}
            placeholder="Write your article content here… (Markdown supported)"
            className={inputCls(!!formik.touched.content && !!formik.errors.content) + ' resize-none font-mono text-xs'}
          />
        </Field>

        {/* Tags */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-healthcare-text">Tags</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {tags.map((t) => (
              <span key={t} className="flex items-center gap-1.5 px-3 py-1 bg-brand-blue/8 text-brand-blue text-xs font-bold rounded-full border border-brand-blue/20">
                {t}
                <button
                  type="button"
                  onClick={() => setTags(tags.filter((x) => x !== t))}
                  className="text-brand-blue/60 hover:text-brand-blue transition-colors bg-transparent border-none cursor-pointer p-0"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              placeholder="Add tag…"
              className={inputCls() + ' flex-1'}
            />
            <button type="button" onClick={addTag} className="px-4 py-2.5 bg-healthcare-surface border border-healthcare-neutral/20 rounded-xl text-sm font-bold text-healthcare-text hover:bg-white transition-all cursor-pointer">
              Add
            </button>
          </div>
        </div>

        {/* Publish toggle */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => formik.setFieldValue('isPublished', !formik.values.isPublished)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors border-none cursor-pointer ${formik.values.isPublished ? 'bg-brand-blue' : 'bg-healthcare-neutral/20'}`}
          >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${formik.values.isPublished ? 'translate-x-6' : 'translate-x-1'}`} />
          </button>
          <span className="text-sm font-semibold text-healthcare-text">
            {formik.values.isPublished ? 'Published' : 'Draft'}
          </span>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={() => navigate('/admin/articles')}
            className="px-5 py-2.5 border border-healthcare-neutral/20 rounded-xl text-sm font-bold text-healthcare-text hover:bg-healthcare-surface transition-all cursor-pointer bg-white"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isPending}
            className="px-5 py-2.5 bg-brand-blue text-white rounded-xl text-sm font-bold hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed border-none cursor-pointer"
          >
            {isPending ? 'Saving…' : isEdit ? 'Save Changes' : 'Create Article'}
          </button>
        </div>
      </form>
    </div>
  );
}
