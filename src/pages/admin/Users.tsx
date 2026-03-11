import { useEffect, useState } from "react";
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
import Modal from "../../components/ui/Model";
import Textarea from "../../components/ui/Textarea";

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

const VERIFIED_BADGE = {
  true: "bg-emerald-50 text-emerald-600 border border-emerald-100",
  false: "bg-amber-50 text-amber-600 border border-amber-100",
};

const emailSchema = yup.object({
  subject: yup.string().required("Subject is required"),
  message: yup.string().required("Message is required").min(10, "Too short"),
});

export default function Users() {
  const [stageFilter, setStageFilter] = useState<UserStage | "all">("all");
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

  /* ---------------- EMAIL MUTATION ---------------- */

  const send = useMutation({
    mutationFn: (payload: { subject: string; message: string }) =>
      sendEmailToUser(emailTarget!.id, payload),

    onSuccess: () => {
      toast.success(`Email sent to ${emailTarget?.email}.`);
      handleClose();
    },

    onError: (err: any) => toast.error(err?.message ?? "Failed to send email."),
  });

  /* ---------------- FORM ---------------- */

  const formik = useFormik({
    initialValues: { subject: "", message: "" },
    validationSchema: emailSchema,
    onSubmit: (values) => send.mutate(values),
  });

  /* ---------------- MODAL HANDLING ---------------- */

  const handleClose = () => {
    setEmailTarget(null);
    formik.resetForm();
  };

  useEffect(() => {
    if (emailTarget) formik.resetForm();
  }, [emailTarget]);

  return (
    <>
      <div className="space-y-2 animate-fade-in">
        <AdminPageHeader
          title="Users"
          description="Manage your patient accounts, track their progress, and communicate with them directly."
        />

        {/* Filters */}
        <section className="bg-white rounded-md border border-healthcare-border flex flex-col lg:flex-row lg:items-center gap-2">
          <GroupButton
            value={stageFilter}
            onChange={(v) => {
              setStageFilter(v as UserStage | "all");
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
              🔍
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

        {/* Users Table */}

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
                  <div className="w-11 h-11 rounded-xl bg-brand-blue/10 flex items-center justify-center text-sm font-bold text-brand-blue">
                    {u.avatarUrl ? (
                      <img
                        src={u.avatarUrl}
                        alt={u.name}
                        className="w-full h-full rounded-xl object-cover"
                      />
                    ) : (
                      u.name?.[0]?.toUpperCase()
                    )}
                  </div>

                  <div>
                    <p className="font-bold text-sm">{u.name}</p>
                    <p className="text-xs text-healthcare-text-muted">
                      {u.email}
                    </p>
                  </div>
                </div>
              ),
            },

            {
              header: "Verified",
              accessor: (u) => (
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                    VERIFIED_BADGE[u.isVerified ? "true" : "false"]
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      u.isVerified ? "bg-emerald-500" : "bg-amber-500"
                    }`}
                  />
                  {u.isVerified ? "Verified" : "Unverified"}
                </span>
              ),
            },

            {
              header: "Joined",
              accessor: (u) => (
                <span className="text-sm">
                  {new Date(u.createdAt).toLocaleDateString()}
                </span>
              ),
              hiddenOnTablet: true,
            },

            {
              header: "Sessions",
              accessor: (u) => (
                <span className="font-bold text-sm">{u.sessions}</span>
              ),
              hiddenOnMobile: true,
            },

            {
              header: "Stage",
              accessor: (u) => (
                <span
                  className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase ${STAGE_BADGE[u.stage]}`}
                >
                  {STAGE_LABEL[u.stage]}
                </span>
              ),
            },

            {
              header: "",
              accessor: (u) => (
                <div className="flex justify-end">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setEmailTarget(u);
                    }}
                    className="px-4 py-2 text-xs font-bold text-white bg-brand-blue rounded-xl hover:bg-brand-blue/90"
                  >
                    Email
                  </button>
                </div>
              ),
            },
          ]}
        />
      </div>

      {/* EMAIL MODAL */}

      <Modal isOpen={!!emailTarget} title="Send Email" onClose={handleClose}>
        {emailTarget && (
          <>
            <p className="text-sm text-healthcare-text-muted mt-2">
              To:{" "}
              <span className="font-semibold text-healthcare-text">
                {emailTarget.name}
              </span>{" "}
              ({emailTarget.email})
            </p>

            <form onSubmit={formik.handleSubmit} className=" space-y-3 mt-3">
              <div>
                <label className="text-sm font-bold">Subject</label>
                <Input
                  name="subject"
                  value={formik.values.subject}
                  onChange={formik.handleChange}
                />

                {formik.touched.subject && formik.errors.subject && (
                  <p className="text-red-500 text-xs mt-1">
                    {formik.errors.subject}
                  </p>
                )}
              </div>

              <div>
                <label className="text-sm font-bold">Message</label>
                <Textarea
                  name="message"
                  rows={6}
                  value={formik.values.message}
                  onChange={formik.handleChange}
                />

                {formik.touched.message && formik.errors.message && (
                  <p className="text-red-500 text-xs mt-1">
                    {formik.errors.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2  gap-2">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2 text-sm font-semibold bg-gray-100 hover:bg-gray-200 rounded-md"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={send.isPending}
                  className="px-4 py-2 text-sm font-semibold bg-brand-blue text-white  rounded-md"
                >
                  {send.isPending ? "Sending..." : "Send Email"}
                </button>
              </div>
            </form>
          </>
        )}
      </Modal>
    </>
  );
}
