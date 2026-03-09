import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { fetchAdminTherapists, updateTherapist } from "../../api/admin.api";
import type { AdminTherapist } from "../../types/admin";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import AdminTable from "../../components/admin/AdminTable";
import Input from "../../components/ui/Input";
import editIcon from "../../assets/svg/edit.svg";
import deleteIcon from "../../assets/svg/delete.svg";
import Modal from "../../components/ui/Model";

export default function AdminTherapists() {
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<AdminTherapist | null>(null);
  const { data, isLoading, error } = useQuery({
    queryKey: ["admin", "therapists"],
    queryFn: fetchAdminTherapists,
  });

  const toggleActive = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      updateTherapist(id, { isActive } as any),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "therapists"] });
      toast.success("Therapist status updated.");
    },
    onError: (err: any) => toast.error(err.message ?? "Failed to update."),
  });

  const therapists: AdminTherapist[] = Array.isArray(data)
    ? data
    : (data as any)?.items || [];

  const filtered = therapists.filter(
    (t: AdminTherapist) =>
      t.name.toLowerCase()?.includes(search.toLowerCase()) ||
      t.email.toLowerCase()?.includes(search.toLowerCase()) ||
      t.specialization?.toLowerCase()?.includes(search.toLowerCase()),
  );

  return (
    <>
      <div className="space-y-2 animate-fade-in">
        <AdminPageHeader
          title="Therapists"
          description="Manage your healthcare providers, monitor their activity, and update their profiles."
          actions={
            <Link
              to="/admin/therapists/new"
              className="inline-flex w-full justify-center items-center text-nowrap gap-2 px-5 py-3 bg-brand-blue text-white rounded-sm font-bold text-sm hover:opacity-90 transition-all no-underline shadow-lg shadow-blue-100"
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
              Add Therapist
            </Link>
          }
        />

        {/* Search & Stats Bar */}
        <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="relative flex-1 rounded-sm bg-white ">
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
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email or specialty..."
              // className="w-full pl-12 pr-6 py-3 text-sm border border-healthcare-border/60 rounded-xl focus:border-brand-blue/50 focus:ring-4 focus:ring-brand-blue/5 outline-none bg-healthcare-surface/20 text-healthcare-text placeholder:text-healthcare-text-muted/40 font-medium transition-all"
              className="pl-12"
            />
          </div>

          <div className="flex h-full gap-1">
            <div className=" py-2 px-4  rounded-sm bg-white border border-healthcare-border">
              <p className="text-[12px] font-bold flex items-center gap-2 text-healthcare-text-muted uppercase tracking-widest leading-none mb-1">
                <span className="min-w-2 min-h-2 rounded-full bg-yellow-300"></span>{" "}
                Total
              </p>
              <p className="text-xl  font-bold text-yellow-300 leading-none">
                {therapists.length}
              </p>
            </div>
            <div className=" py-2 px-4  rounded-sm bg-white border border-healthcare-border">
              <p className="text-[12px] font-bold flex items-center gap-2 text-healthcare-text-muted uppercase tracking-widest leading-none mb-1">
                <span className="min-w-2 min-h-2 rounded-full bg-green-500"></span>{" "}
                Active
              </p>
              <p className="text-xl  font-bold text-green-500 leading-none">
                {therapists.filter((t) => t.isActive).length}
              </p>
            </div>
          </div>
        </section>

        {error && (
          <div className="p-6 bg-red-50 border border-red-100 rounded-2xl text-sm text-red-600 font-medium flex items-center gap-3">
            <svg
              className="w-5 h-5 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Failed to load therapist data. Please try again.
          </div>
        )}

        <AdminTable<AdminTherapist>
          data={filtered}
          isLoading={isLoading}
          emptyMessage="No therapists matching your search were found."
          columns={[
            {
              header: "Therapist",
              accessor: (t) => (
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-sm bg-healthcare-lavender/10 flex items-center justify-center flex-shrink-0 text-sm font-bold text-purple-600 ">
                    {t.name[0]?.toUpperCase()}
                  </div>
                  <div>
                    <p className="font-bold text-healthcare-text text-sm">
                      {t.name}
                    </p>
                    <p className="text-xs text-healthcare-text-muted mt-0.5">
                      {t.email}
                    </p>
                  </div>
                </div>
              ),
            },
            {
              header: "Specialization",
              accessor: (t) => (
                <p className="capitalize  rounded-lg text-xs text-center font-semibold text-healthcare-text">
                  {t.specialization || "N/A"}
                </p>
              ),
              hiddenOnTablet: true,
            },
            {
              header: "Sessions",
              accessor: (t) => (
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-healthcare-lavender"></span>
                  <span className="font-bold text-healthcare-text">
                    {t.totalSessions}
                  </span>
                </div>
              ),
              hiddenOnMobile: true,
            },
            {
              header: "Status",
              accessor: (t) => (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleActive.mutate({
                      id: t.id,
                      isActive: !t.isActive,
                    });
                  }}
                  className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[12px] font-bold shadow uppercase tracking-wider border-none cursor-pointer transition-all ${
                    t.isActive
                      ? "bg-green-500 text-white"
                      : "bg-red-500 text-white "
                  }`}
                >
                  {t.isActive ? "Active" : "Inactive"}
                </button>
              ),
            },
            {
              header: "",
              accessor: (t) => (
                <div className="flex items-center gap-2.5 justify-end">
                  <Link
                    to={`/admin/therapists/${t.id}/bookings`}
                    className="px-4 py-2 text-xs font-bold text-brand-blue bg-blue-50 rounded-sm hover:bg-blue-100 transition-all no-underline shadow-sm"
                  >
                    Bookings
                  </Link>
                  <Link
                    to={`/admin/therapists/${t.id}/edit`}
                    className=" text-healthcare-text-muted hover:text-healthcare-text hover:bg-healthcare-surface transition-all no-underline "
                  >
                    <img src={editIcon} alt="Edit" className="min-w-5 w-5" />
                  </Link>

                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteTarget(t);
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
      </div>
      <Modal
        title=" Delete Therapist"
        isOpen={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
      >
        <p className="text-lg text-center text-healthcare-text-muted mb-6">
          Are you sure you want to delete <br />
          <span className="font-bold text-healthcare-text-muted/80">
            "{deleteTarget?.name}"
          </span>{" "}
          ?
        </p>

        <div className="grid grid-cols-2  gap-2">
          <button
            onClick={() => setDeleteTarget(null)}
            className="px-4 py-2 text-sm font-semibold bg-gray-100 hover:bg-gray-200 rounded-sm"
          >
            Cancel
          </button>

          <button
            onClick={() => {}}
            className="px-4 py-2 text-sm font-semibold bg-red-500 text-white hover:bg-red-600 rounded-sm"
          >
            Delete
          </button>
        </div>
      </Modal>
    </>
  );
}
