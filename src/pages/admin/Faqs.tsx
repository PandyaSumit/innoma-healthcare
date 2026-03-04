import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { toast } from 'sonner';
import {
  fetchAdminFaqs,
  createFaq,
  updateFaq,
  deleteFaq,
} from '../../api/admin.api';
import type { AdminFaq } from '../../types/admin';
import Spinner from '../../components/ui/Spinner';

const schema = yup.object({
  question: yup.string().required('Question is required'),
  answer: yup.string().required('Answer is required'),
  category: yup.string(),
});

const inputCls = (err?: boolean) =>
  `w-full px-4 py-2.5 rounded-xl border ${err ? 'border-red-400' : 'border-healthcare-neutral/20'} focus:border-brand-blue outline-none text-healthcare-text bg-white font-medium text-sm placeholder:text-healthcare-text-muted/40`;

function FaqModal({
  faq,
  onClose,
}: {
  faq?: AdminFaq;
  onClose: () => void;
}) {
  const qc = useQueryClient();
  const isEdit = !!faq;

  const create = useMutation({
    mutationFn: createFaq,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'faqs'] });
      toast.success('FAQ created.');
      onClose();
    },
    onError: (err: any) => toast.error(err.message ?? 'Failed.'),
  });

  const edit = useMutation({
    mutationFn: (payload: any) => updateFaq(faq!.id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'faqs'] });
      toast.success('FAQ updated.');
      onClose();
    },
    onError: (err: any) => toast.error(err.message ?? 'Failed.'),
  });

  const formik = useFormik({
    initialValues: {
      question: faq?.question ?? '',
      answer: faq?.answer ?? '',
      category: faq?.category ?? '',
      isPublished: faq?.isPublished ?? true,
    },
    validationSchema: schema,
    onSubmit: (values) => {
      const payload = {
        ...values,
        category: values.category || undefined,
      };
      if (isEdit) {
        edit.mutate(payload);
      } else {
        create.mutate(payload);
      }
    },
  });

  const isPending = create.isPending || edit.isPending;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
      <div className="bg-white rounded-2xl shadow-2xl border border-healthcare-border w-full max-w-lg">
        <div className="flex items-center justify-between px-6 py-4 border-b border-healthcare-border">
          <h2 className="text-base font-bold text-healthcare-text">{isEdit ? 'Edit FAQ' : 'Add FAQ'}</h2>
          <button onClick={onClose} className="text-healthcare-text-muted hover:text-healthcare-text bg-transparent border-none cursor-pointer p-1">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={formik.handleSubmit} className="p-6 space-y-4">
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-healthcare-text">Question</label>
            <input name="question" value={formik.values.question} onChange={formik.handleChange} onBlur={formik.handleBlur} placeholder="What is…?" className={inputCls(!!formik.touched.question && !!formik.errors.question)} />
            {formik.touched.question && formik.errors.question && <p className="text-red-500 text-xs font-bold">{formik.errors.question}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-healthcare-text">Answer</label>
            <textarea name="answer" value={formik.values.answer} onChange={formik.handleChange} onBlur={formik.handleBlur} rows={4} placeholder="Detailed answer…" className={inputCls(!!formik.touched.answer && !!formik.errors.answer) + ' resize-none'} />
            {formik.touched.answer && formik.errors.answer && <p className="text-red-500 text-xs font-bold">{formik.errors.answer}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-healthcare-text">Category (optional)</label>
            <input name="category" value={formik.values.category} onChange={formik.handleChange} placeholder="e.g. Billing, General" className={inputCls()} />
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => formik.setFieldValue('isPublished', !formik.values.isPublished)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors border-none cursor-pointer ${formik.values.isPublished ? 'bg-brand-blue' : 'bg-healthcare-neutral/20'}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${formik.values.isPublished ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
            <span className="text-sm font-semibold text-healthcare-text">
              {formik.values.isPublished ? 'Published' : 'Hidden'}
            </span>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 border border-healthcare-neutral/20 rounded-xl text-sm font-bold text-healthcare-text hover:bg-healthcare-surface transition-all cursor-pointer bg-white">Cancel</button>
            <button type="submit" disabled={isPending} className="flex-1 py-2.5 bg-brand-blue text-white rounded-xl text-sm font-bold hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed border-none cursor-pointer">
              {isPending ? 'Saving…' : isEdit ? 'Save' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Faqs() {
  const qc = useQueryClient();
  const [modal, setModal] = useState<{ open: boolean; faq?: AdminFaq }>({ open: false });

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'faqs'],
    queryFn: fetchAdminFaqs,
  });

  const del = useMutation({
    mutationFn: deleteFaq,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'faqs'] });
      toast.success('FAQ deleted.');
    },
    onError: (err: any) => toast.error(err.message ?? 'Failed.'),
  });

  return (
    <div className="space-y-6">
      {modal.open && (
        <FaqModal faq={modal.faq} onClose={() => setModal({ open: false })} />
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-healthcare-text">FAQs</h1>
          <p className="text-sm text-healthcare-text-muted mt-1">Manage frequently asked questions.</p>
        </div>
        <button
          onClick={() => setModal({ open: true })}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-brand-blue text-white rounded-xl font-bold text-sm hover:opacity-90 transition-all border-none cursor-pointer shadow-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add FAQ
        </button>
      </div>

      {isLoading && <div className="flex justify-center py-10"><Spinner size="lg" /></div>}

      {data && (
        <div className="space-y-3">
          {data.length === 0 && (
            <div className="text-center py-12 bg-white rounded-2xl border border-healthcare-border shadow-clinical">
              <p className="text-healthcare-text-muted text-sm">No FAQs yet. Add your first one!</p>
            </div>
          )}
          {data.map((faq, index) => (
            <div
              key={faq.id}
              className="bg-white rounded-xl border border-healthcare-border p-5 flex items-start gap-4 hover:shadow-sm transition-shadow"
            >
              <span className="w-7 h-7 rounded-full bg-brand-blue/8 text-brand-blue text-xs font-bold flex items-center justify-center flex-shrink-0">
                {index + 1}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <p className="font-bold text-healthcare-text text-sm">{faq.question}</p>
                    <p className="text-sm text-healthcare-text-muted mt-1 line-clamp-2">{faq.answer}</p>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    {!faq.isPublished && (
                      <span className="px-2 py-0.5 text-xs font-bold bg-gray-100 text-gray-500 rounded-full">Hidden</span>
                    )}
                    {faq.category && (
                      <span className="px-2 py-0.5 text-xs font-bold bg-brand-blue/8 text-brand-blue rounded-full">{faq.category}</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <button
                    onClick={() => setModal({ open: true, faq })}
                    className="px-3 py-1 text-xs font-bold text-brand-blue bg-brand-blue/5 rounded-lg hover:bg-brand-blue/10 transition-colors border-none cursor-pointer"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => { if (confirm('Delete this FAQ?')) del.mutate(faq.id); }}
                    className="px-3 py-1 text-xs font-bold text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors border-none cursor-pointer"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
