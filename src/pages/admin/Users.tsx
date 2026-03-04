import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useFormik } from "formik";
import * as yup from "yup";
import { toast } from "sonner";
import { fetchAdminUsers, sendEmailToUser } from "../../api/admin.api";
import type { AdminUser, UserStage } from "../../types/admin";
import Spinner from "../../components/ui/Spinner";

const STAGE_BADGE: Record<UserStage, string> = {
  registered: "bg-gray-100 text-gray-600",
  free_assessment: "bg-blue-50 text-blue-700",
  paid_session: "bg-emerald-50 text-emerald-700",
};

const STAGE_LABEL: Record<UserStage, string> = {
  registered: "Registered",
  free_assessment: "Free Assessment",
  paid_session: "Paid Session",
};

const emailSchema = yup.object({
  subject: yup.string().required("Subject is required"),
  message: yup.string().required("Message is required").min(10, "Too short"),
});

function EmailModal({
  user,
  onClose,
}: {
  user: AdminUser;
  onClose: () => void;
}) {
  const send = useMutation({
    mutationFn: (payload: { subject: string; message: string }) =>
      sendEmailToUser(user.id, payload),
    onSuccess: () => {
      toast.success(`Email sent to ${user.email}.`);
      onClose();
    },
    onError: (err: any) => toast.error(err.message ?? "Failed to send email."),
  });

  const formik = useFormik({
    initialValues: { subject: "", message: "" },
    validationSchema: emailSchema,
    onSubmit: (values) => send.mutate(values),
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
      <div className="bg-white rounded-2xl shadow-2xl border border-healthcare-border w-full max-w-lg">
        <div className="flex items-center justify-between px-6 py-4 border-b border-healthcare-border">
          <div>
            <h2 className="text-base font-bold text-healthcare-text">
              Send Email
            </h2>
            <p className="text-xs text-healthcare-text-muted mt-0.5">
              To: {user.name} ({user.email})
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-healthcare-text-muted hover:text-healthcare-text bg-transparent border-none cursor-pointer p-1"
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

        <form onSubmit={formik.handleSubmit} className="p-6 space-y-4">
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-healthcare-text">
              Subject
            </label>
            <input
              name="subject"
              value={formik.values.subject}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Email subject…"
              className={`w-full px-4 py-2.5 rounded-xl border ${formik.touched.subject && formik.errors.subject ? "border-red-400" : "border-healthcare-neutral/20"} focus:border-brand-blue outline-none text-healthcare-text bg-white font-medium text-sm`}
            />
            {formik.touched.subject && formik.errors.subject && (
              <p className="text-red-500 text-xs font-bold">
                {formik.errors.subject}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-healthcare-text">
              Message
            </label>
            <textarea
              name="message"
              value={formik.values.message}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              rows={5}
              placeholder="Write your message…"
              className={`w-full px-4 py-3 rounded-xl border ${formik.touched.message && formik.errors.message ? "border-red-400" : "border-healthcare-neutral/20"} focus:border-brand-blue outline-none text-healthcare-text bg-white text-sm resize-none font-medium`}
            />
            {formik.touched.message && formik.errors.message && (
              <p className="text-red-500 text-xs font-bold">
                {formik.errors.message}
              </p>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 border border-healthcare-neutral/20 rounded-xl text-sm font-bold text-healthcare-text hover:bg-healthcare-surface transition-all cursor-pointer bg-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={send.isPending}
              className="flex-1 py-2.5 bg-brand-blue text-white rounded-xl text-sm font-bold hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed border-none cursor-pointer"
            >
              {send.isPending ? "Sending…" : "Send Email"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Users() {
  const [stageFilter, setStageFilter] = useState<UserStage | "all">("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [emailTarget, setEmailTarget] = useState<AdminUser | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "users", stageFilter, search, page],
    queryFn: () =>
      fetchAdminUsers({
        stage: stageFilter === "all" ? undefined : stageFilter,
        search: search || undefined,
        page,
        limit: 20,
        role: "patient",
      }),
  });

  return (
    <div className="space-y-6">
      {emailTarget && (
        <EmailModal user={emailTarget} onClose={() => setEmailTarget(null)} />
      )}

      <div>
        <h1 className="text-2xl font-bold text-healthcare-text">Users</h1>
        <p className="text-sm text-healthcare-text-muted mt-1">
          Browse and manage patient accounts.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex gap-2 flex-wrap">
          {(
            ["all", "registered", "free_assessment", "paid_session"] as const
          ).map((s) => (
            <button
              key={s}
              onClick={() => {
                setStageFilter(s);
                setPage(1);
              }}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all border-none cursor-pointer ${
                stageFilter === s
                  ? "bg-brand-blue text-white"
                  : "bg-white text-healthcare-text-muted border border-healthcare-neutral/20 hover:bg-healthcare-surface"
              }`}
            >
              {s === "all" ? "All" : STAGE_LABEL[s]}
            </button>
          ))}
        </div>
        <div className="relative sm:ml-auto">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-healthcare-text-muted/50">
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
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </span>
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search name or email…"
            className="pl-9 pr-4 py-2 text-sm border border-healthcare-neutral/20 rounded-xl focus:border-brand-blue outline-none bg-white text-healthcare-text placeholder:text-healthcare-text-muted/40 font-medium"
          />
        </div>
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
                      User
                    </th>
                    <th className="text-left px-5 py-3.5 text-xs font-bold text-healthcare-text-muted uppercase tracking-wider hidden md:table-cell">
                      Joined
                    </th>
                    <th className="text-left px-5 py-3.5 text-xs font-bold text-healthcare-text-muted uppercase tracking-wider hidden sm:table-cell">
                      Sessions
                    </th>
                    <th className="text-left px-5 py-3.5 text-xs font-bold text-healthcare-text-muted uppercase tracking-wider">
                      Stage
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
                        No users found.
                      </td>
                    </tr>
                  )}
                  {(data.items || []).map((u) => (
                    <tr
                      key={u.id}
                      className="hover:bg-healthcare-surface/20 transition-colors"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-brand-blue/10 flex items-center justify-center flex-shrink-0 text-xs font-bold text-brand-blue">
                            {u.name[0]?.toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold text-healthcare-text">
                              {u.name}
                            </p>
                            <p className="text-xs text-healthcare-text-muted">
                              {u.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-healthcare-text-muted hidden md:table-cell">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-5 py-4 text-healthcare-text hidden sm:table-cell">
                        {u.totalSessions}
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${STAGE_BADGE[u.stage]}`}
                        >
                          {STAGE_LABEL[u.stage]}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <button
                          onClick={() => setEmailTarget(u)}
                          className="px-3 py-1.5 text-xs font-bold text-brand-blue bg-brand-blue/5 rounded-lg hover:bg-brand-blue/10 transition-colors border-none cursor-pointer"
                        >
                          Email
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {data.totalPages > 1 && (
            <div className="flex items-center justify-between text-sm">
              <p className="text-healthcare-text-muted">
                {data.total.toLocaleString()} users · Page {data.page} of{" "}
                {data.totalPages}
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
