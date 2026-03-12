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

  console.log(therapists, "therapists===");
  return (
    <>
      <div className="space-y-2 animate-fade-in">
        <AdminPageHeader
          title="Therapists"
          description="Manage your healthcare providers, monitor their activity, and update their profiles."
          actions={
            <Link
              to="/admin/therapists/new"
              className="inline-flex w-full justify-center items-center text-nowrap gap-2 px-5 py-3 bg-brand-blue text-white rounded-md font-bold text-sm hover:opacity-90 transition-all no-underline shadow-lg shadow-blue-100"
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
          <div className="relative flex-1 rounded-md bg-white ">
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
              className="pl-12"
            />
          </div>

          <div className="flex h-full gap-1">
            <div className=" py-2 px-4  rounded-md bg-white border border-healthcare-border">
              <p className="text-[12px] font-bold flex items-center gap-2 text-healthcare-text-muted uppercase tracking-widest leading-none mb-1">
                <span className="min-w-2 min-h-2 rounded-full bg-yellow-300"></span>{" "}
                Total
              </p>
              <p className="text-xl  font-bold text-yellow-300 leading-none">
                {therapists.length}
              </p>
            </div>
            <div className=" py-2 px-4  rounded-md bg-white border border-healthcare-border">
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
          <div className="p-6 bg-red-50 border border-red-100 rounded-md text-sm text-red-600 font-medium flex items-center gap-3">
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
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-md bg-healthcare-lavender/10 flex items-center justify-center text-sm font-bold text-purple-600">
                    {t.name?.[0]?.toUpperCase()}
                  </div>

                  <div className="flex flex-col">
                    <p className="font-semibold text-healthcare-text text-sm">
                      {t.name}
                    </p>
                    <p className="text-xs text-healthcare-text-muted">
                      {t.email}
                    </p>
                  </div>
                </div>
              ),
            },

            {
              header: "Specializations",
              accessor: (t) => (
                <div className="flex flex-wrap justify-center w-full gap-1">
                  {t?.specializations?.length ? (
                    t.specializations.map((e, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 bg-purple-50 text-purple-700 text-[11px] font-semibold rounded-md"
                      >
                        {e.trim()}
                      </span>
                    ))
                  ) : (
                    <p className="text-xs text-center text-gray-400">N/A</p>
                  )}
                </div>
              ),
              hiddenOnTablet: true,
            },

            {
              header: "Experience",
              accessor: (t) => (
                <span className="text-sm font-semibold text-healthcare-text">
                  {t.experienceYears ?? 0} yrs
                </span>
              ),
              hiddenOnTablet: true,
            },

            {
              header: "Rating",
              accessor: (t) => (
                <div className="flex items-center justify-center gap-1 font-semibold text-sm">
                  ⭐ {t.rating || 0}
                </div>
              ),
              hiddenOnTablet: true,
            },

            {
              header: "Bookings",
              accessor: (t) => (
                <div className="flex items-center justify-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                  <span className="font-semibold text-healthcare-text">
                    {t?.totalBookings ?? 0}
                  </span>
                </div>
              ),
              hiddenOnMobile: true,
            },

            {
              header: "Revenue",
              accessor: (t) => (
                <span className="font-semibold text-green-600">
                  ₹{t?.totalRevenue ?? 0}
                </span>
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
                  className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide transition-all ${
                    t.isActive
                      ? "bg-green-500 text-white"
                      : "bg-red-500 text-white"
                  }`}
                >
                  {t.isActive ? "Active" : "Inactive"}
                </button>
              ),
            },

            {
              header: "",
              accessor: (t) => (
                <div className="flex items-center gap-2 justify-end">
                  <Link
                    to={`/admin/therapists/${t.id}/bookings`}
                    className="px-3 py-1 text-xs font-semibold text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100"
                  >
                    Bookings
                  </Link>

                  <Link
                    to={`/admin/therapists/${t.id}/edit`}
                    className="p-1 hover:bg-gray-100 rounded-md w-10 h-10 flex"
                  >
                    <img src={editIcon} alt="Edit" className="w-5 m-auto" />
                  </Link>

                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteTarget(t);
                    }}
                    className="p-1 cursor-pointer hover:bg-gray-100 rounded-md w-10 h-10 flex"
                  >
                    <img src={deleteIcon} alt="Delete" className="w-5 m-auto" />
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
        <p className="text-lg text-start text-healthcare-text-muted mb-6">
          Are you sure you want to delete
          <span className="font-bold text-healthcare-text-muted/80">
            {" "}
            "{deleteTarget?.name}"
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
            onClick={() => {}}
            className="px-4 py-2 text-sm font-semibold bg-red-500 text-white hover:bg-red-600 rounded-md"
          >
            Delete
          </button>
        </div>
      </Modal>
    </>
  );
}
