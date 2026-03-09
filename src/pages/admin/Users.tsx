import { useEffect, useRef, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useFormik } from "formik";
import * as yup from "yup";
import { toast } from "sonner";
import { fetchAdminUsers, sendEmailToUser } from "../../api/admin.api";
import type { AdminUser, UserStage } from "../../types/admin";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import Input from "../../components/ui/Input";
import GroupButton from "../../components/ui/GroupButton";
import AdminTable from "../../components/admin/AdminTable";

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl border border-healthcare-border w-full max-w-lg overflow-hidden animate-slide-up">
        <div className="flex items-center justify-between px-8 py-6 border-b border-healthcare-border bg-healthcare-surface/30">
          <div>
            <h2 className="text-xl font-bold text-healthcare-text">
              Send Email
            </h2>
            <p className="text-sm text-healthcare-text-muted mt-1">
              To:{" "}
              <span className="text-healthcare-text font-semibold">
                {user.name}
              </span>{" "}
              ({user.email})
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-healthcare-text-muted hover:text-healthcare-text hover:bg-healthcare-surface p-2 rounded-xl transition-all border-none cursor-pointer"
          >
            <svg
              className="w-6 h-6"
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
            <label className="block text-sm font-bold text-healthcare-text">
              Subject
            </label>
            <input
              name="subject"
              value={formik.values.subject}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="What is this regarding?"
              className={`w-full px-5 py-3 rounded-2xl border ${formik.touched.subject && formik.errors.subject ? "border-red-400" : "border-healthcare-border"} focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/5 outline-none text-healthcare-text bg-white font-medium transition-all`}
            />
            {formik.touched.subject && formik.errors.subject && (
              <p className="text-red-500 text-xs font-bold pl-1">
                {formik.errors.subject}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-bold text-healthcare-text">
              Message
            </label>
            <textarea
              name="message"
              value={formik.values.message}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              rows={6}
              placeholder="Type your message here..."
              className={`w-full px-5 py-4 rounded-2xl border ${formik.touched.message && formik.errors.message ? "border-red-400" : "border-healthcare-border"} focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/5 outline-none text-healthcare-text bg-white text-sm resize-none font-medium transition-all`}
            />
            {formik.touched.message && formik.errors.message && (
              <p className="text-red-500 text-xs font-bold pl-1">
                {formik.errors.message}
              </p>
            )}
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
              disabled={send.isPending}
              className="flex-1 py-3.5 bg-brand-blue text-white rounded-2xl text-sm font-bold hover:opacity-90 shadow-lg shadow-blue-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed border-none cursor-pointer"
            >
              {send.isPending ? "Sending..." : "Send Email"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Users() {
  const [stageFilter, setStageFilter] = useState<UserStage | "all" | string>(
    "all",
  );
  const [search, setSearch] = useState("");
  const [page, setPage] = useState<number | null>(1);
  const [emailTarget, setEmailTarget] = useState<AdminUser | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "users", stageFilter, search, page],
    queryFn: () =>
      fetchAdminUsers({
        stage: stageFilter === "all" ? undefined : stageFilter,
        search: search || undefined,
        page,
        limit: 10,
      }),
  });

  console.log(data, "data");
  return (
    <div className="space-y-2 animate-fade-in">
      {emailTarget && (
        <EmailModal user={emailTarget} onClose={() => setEmailTarget(null)} />
      )}

      <AdminPageHeader
        title="Users"
        description="Manage your patient accounts, track their progress, and communicate with them directly."
      />

      {/* Filters & Search */}
      <section className="bg-white  rounded-sm border border-healthcare-border  flex flex-col lg:flex-row lg:items-center gap-2">
        <GroupButton
          value={stageFilter}
          onChange={(v) => {
            setStageFilter(v);
            setPage(1);
          }}
          btns={[
            { label: "All Users", value: "all" },
            { label: "Registered", value: "registered" },
            { label: "Free Assessment", value: "free_assessment" },
            { label: "Paid Session", value: "paid_session" },
          ]}
        />

        <div className="relative lg:w-96 p-1">
          <span className="absolute left-5 top-1/2 -translate-y-1/2 text-healthcare-text-muted/50">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </span>
          <Input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search by name or email..."
            className="pl-12 pr-6"
          />
        </div>
      </section>

      <div className="space-y-6">
        <AdminTable<AdminUser>
          data={data || []}
          page={page}
          setPage={setPage}
          isLoading={isLoading}
          emptyMessage="No patients matching your criteria were found."
          columns={[
            {
              header: "User",
              accessor: (u) => (
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-brand-blue/10 flex items-center justify-center flex-shrink-0 text-sm font-bold text-brand-blue shadow-sm">
                    {u.name[0]?.toUpperCase()}
                  </div>
                  <div>
                    <p className="font-bold text-healthcare-text text-sm">
                      {u.name}
                    </p>
                    <p className="text-xs text-healthcare-text-muted mt-0.5">
                      {u.email}
                    </p>
                  </div>
                </div>
              ),
            },
            {
              header: "Joined",
              accessor: (u) => (
                <span className="text-healthcare-text font-medium">
                  {new Date(u.createdAt).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              ),
              hiddenOnTablet: true,
            },
            {
              header: "Sessions",
              accessor: (u) => (
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-brand-blue"></span>
                  <span className="font-bold text-healthcare-text">
                    {u.totalSessions}
                  </span>
                </div>
              ),
              hiddenOnMobile: true,
            },
            {
              header: "Stage",
              accessor: (u) => (
                <span
                  className={`inline-flex items-center px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${STAGE_BADGE[u.stage]}`}
                >
                  {STAGE_LABEL[u.stage]}
                </span>
              ),
            },
            ...(data > 1
              ? [
                  {
                    header: "",
                    accessor: (u) => (
                      <div className="flex justify-end">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEmailTarget(u);
                          }}
                          className="px-4 py-2 text-xs font-bold text-white bg-brand-blue rounded-xl hover:bg-brand-blue/90 shadow-sm shadow-blue-100 transition-all border-none cursor-pointer flex items-center gap-2"
                        >
                          <svg
                            className="w-3.5 h-3.5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                            />
                          </svg>
                          Email
                        </button>
                      </div>
                    ),
                  },
                ]
              : []),
          ]}
        />
      </div>
    </div>
  );
}
