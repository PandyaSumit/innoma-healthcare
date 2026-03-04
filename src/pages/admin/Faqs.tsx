import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useFormik } from "formik";
import * as yup from "yup";
import { toast } from "sonner";
import {
  fetchAdminFaqs,
  createFaq,
  updateFaq,
  deleteFaq,
} from "../../api/admin.api";
import type { AdminFaq } from "../../types/admin";
import Spinner from "../../components/ui/Spinner";
import AdminPageHeader from "../../components/admin/AdminPageHeader";

const schema = yup.object({
  question: yup.string().required("Question is required"),
  answer: yup.string().required("Answer is required"),
  category: yup.string(),
});

const inputCls = (err?: boolean) =>
  `w-full px-5 py-3 rounded-xl border ${err ? "border-red-400 bg-red-50/10" : "border-healthcare-border bg-healthcare-surface/20"} focus:border-brand-blue/50 focus:ring-4 focus:ring-brand-blue/5 outline-none text-healthcare-text font-medium text-sm placeholder:text-healthcare-text-muted/40 transition-all`;

function FaqModal({ faq, onClose }: { faq?: AdminFaq; onClose: () => void }) {
  const qc = useQueryClient();
  const isEdit = !!faq;

  const create = useMutation({
    mutationFn: createFaq,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "faqs"] });
      toast.success("FAQ created.");
      onClose();
    },
    onError: (err: any) => toast.error(err.message ?? "Failed."),
  });

  const edit = useMutation({
    mutationFn: (payload: any) => updateFaq(faq!.id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "faqs"] });
      toast.success("FAQ updated.");
      onClose();
    },
    onError: (err: any) => toast.error(err.message ?? "Failed."),
  });

  const formik = useFormik({
    initialValues: {
      question: faq?.question ?? "",
      answer: faq?.answer ?? "",
      category: faq?.category ?? "",
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-healthcare-text/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl border border-healthcare-border w-full max-w-xl overflow-hidden animate-slide-up">
        <div className="flex items-center justify-between px-8 py-6 border-b border-healthcare-border bg-healthcare-surface/30">
          <div>
            <h2 className="text-xl font-bold text-healthcare-text">
              {isEdit ? "Edit FAQ" : "Add New FAQ"}
            </h2>
            <p className="text-xs text-healthcare-text-muted mt-1 font-medium">
              Fill in the details for the frequently asked question.
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center text-healthcare-text-muted hover:text-healthcare-text hover:bg-healthcare-surface rounded-xl transition-all border-none cursor-pointer"
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <form onSubmit={formik.handleSubmit} className="p-8 space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-bold text-healthcare-text px-1">
              Question
            </label>
            <input
              name="question"
              value={formik.values.question}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="e.g. How do I reset my password?"
              className={inputCls(
                !!formik.touched.question && !!formik.errors.question,
              )}
            />
            {formik.touched.question && formik.errors.question && (
              <p className="text-red-500 text-xs font-bold px-1">
                {formik.errors.question}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-bold text-healthcare-text px-1">
              Answer
            </label>
            <textarea
              name="answer"
              value={formik.values.answer}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              rows={4}
              placeholder="Provide a detailed answer here..."
              className={
                inputCls(!!formik.touched.answer && !!formik.errors.answer) +
                " resize-none"
              }
            />
            {formik.touched.answer && formik.errors.answer && (
              <p className="text-red-500 text-xs font-bold px-1">
                {formik.errors.answer}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-bold text-healthcare-text px-1">
                Category
              </label>
              <input
                name="category"
                value={formik.values.category}
                onChange={formik.handleChange}
                placeholder="e.g. Account, Payments"
                className={inputCls()}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-healthcare-text px-1">
                Visibility
              </label>
              <div
                onClick={() =>
                  formik.setFieldValue(
                    "isPublished",
                    !formik.values.isPublished,
                  )
                }
                className="flex items-center gap-3 p-3 rounded-xl border border-healthcare-border bg-healthcare-surface/20 cursor-pointer hover:bg-healthcare-surface/40 transition-all select-none"
              >
                <button
                  type="button"
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors border-none cursor-pointer ${formik.values.isPublished ? "bg-emerald-500" : "bg-gray-300"}`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-lg transition-transform ${formik.values.isPublished ? "translate-x-6" : "translate-x-1"}`}
                  />
                </button>
                <span
                  className={`text-sm font-bold ${formik.values.isPublished ? "text-emerald-700" : "text-gray-500"}`}
                >
                  {formik.values.isPublished ? "Published" : "Draft"}
                </span>
              </div>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3.5 border border-healthcare-border rounded-2xl text-sm font-bold text-healthcare-text hover:bg-healthcare-surface transition-all cursor-pointer bg-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 py-3.5 bg-brand-blue text-white rounded-2xl text-sm font-bold hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed border-none cursor-pointer shadow-lg shadow-blue-100"
            >
              {isPending ? "Saving..." : isEdit ? "Save Changes" : "Create FAQ"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Faqs() {
  const qc = useQueryClient();
  const [modal, setModal] = useState<{ open: boolean; faq?: AdminFaq }>({
    open: false,
  });

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "faqs"],
    queryFn: fetchAdminFaqs,
  });

  const del = useMutation({
    mutationFn: deleteFaq,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "faqs"] });
      toast.success("FAQ deleted.");
    },
    onError: (err: any) => toast.error(err.message ?? "Failed."),
  });

  return (
    <div className="space-y-8 animate-fade-in">
      {modal.open && (
        <FaqModal faq={modal.faq} onClose={() => setModal({ open: false })} />
      )}

      <AdminPageHeader
        title="FAQs"
        description="Create and manage frequently asked questions to help your users find answers quickly."
        actions={
          <button
            onClick={() => setModal({ open: true })}
            className="inline-flex items-center gap-2 px-5 py-3 bg-brand-blue text-white rounded-2xl font-bold text-sm hover:opacity-90 transition-all border-none cursor-pointer shadow-lg shadow-blue-100"
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
            Add FAQ
          </button>
        }
      />

      {isLoading && (
        <div className="flex justify-center py-20">
          <Spinner size="lg" />
        </div>
      )}

      {data && (
        <div className="grid grid-cols-1 gap-4">
          {data.length === 0 && (
            <div className="text-center py-20 bg-white rounded-3xl border border-healthcare-border shadow-clinical group overflow-hidden relative">
              <div className="absolute top-0 right-0 w-64 h-64 bg-brand-blue/5 rounded-full -mr-32 -mt-32 blur-3xl opacity-50" />
              <div className="relative z-10">
                <div className="w-20 h-20 bg-healthcare-surface rounded-full flex items-center justify-center mx-auto mb-6 border border-healthcare-border">
                  <svg
                    className="w-10 h-10 text-healthcare-text-muted/40"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-healthcare-text">
                  No FAQs Found
                </h3>
                <p className="text-healthcare-text-muted font-medium mt-2 max-w-xs mx-auto">
                  Start building your knowledge base by adding your first FAQ.
                </p>
                <button
                  onClick={() => setModal({ open: true })}
                  className="mt-8 px-6 py-3 bg-healthcare-text text-white rounded-2xl text-sm font-bold hover:bg-healthcare-text/90 transition-all border-none cursor-pointer"
                >
                  Create First FAQ
                </button>
              </div>
            </div>
          )}

          <div className="space-y-4">
            {data.map((faq, index) => (
              <div
                key={faq.id}
                className="bg-white rounded-2xl border border-healthcare-border p-6 flex flex-col md:flex-row md:items-start gap-4 hover:shadow-clinical transition-all group"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-10 h-10 rounded-xl bg-brand-blue/5 text-brand-blue text-sm font-bold flex items-center justify-center flex-shrink-0 border border-brand-blue/10 group-hover:bg-brand-blue group-hover:text-white transition-all">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <p className="font-bold text-healthcare-text text-base group-hover:text-brand-blue transition-colors">
                        {faq.question}
                      </p>
                      <div className="flex items-center gap-1.5">
                        {!faq.isPublished && (
                          <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-gray-50 text-gray-400 rounded-full border border-gray-100">
                            Draft
                          </span>
                        )}
                        {faq.category && (
                          <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-brand-blue rounded-full border border-blue-100">
                            {faq.category}
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-healthcare-text-muted font-medium leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 md:pt-1 self-end md:self-start">
                  <button
                    onClick={() => setModal({ open: true, faq })}
                    className="p-2.5 text-healthcare-text-muted hover:text-brand-blue hover:bg-brand-blue/5 rounded-xl transition-all border border-transparent hover:border-brand-blue/10 cursor-pointer"
                    title="Edit FAQ"
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
                  </button>
                  <button
                    onClick={() => {
                      if (confirm("Delete this FAQ?")) del.mutate(faq.id);
                    }}
                    className="p-2.5 text-red-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all border border-transparent hover:border-red-100 cursor-pointer"
                    title="Delete FAQ"
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
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
