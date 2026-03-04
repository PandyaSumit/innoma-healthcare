import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { fetchAdminTherapists, updateTherapist } from "../../api/admin.api";
import type { AdminTherapist } from "../../types/admin";
import Spinner from "../../components/ui/Spinner";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import AdminTable from "../../components/admin/AdminTable";

export default function AdminTherapists() {
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
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
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.email.toLowerCase().includes(search.toLowerCase()) ||
      t.specialization.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-8 animate-fade-in">
      <AdminPageHeader
        title="Therapists"
        description="Manage your healthcare providers, monitor their activity, and update their profiles."
        actions={
          <Link
            to="/admin/therapists/new"
            className="inline-flex items-center gap-2 px-5 py-3 bg-brand-blue text-white rounded-2xl font-bold text-sm hover:opacity-90 transition-all no-underline shadow-lg shadow-blue-100"
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
      <section className="bg-white p-6 rounded-2xl border border-healthcare-border shadow-clinical flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="relative w-full md:w-96">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-healthcare-text-muted/60">
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
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email or specialty..."
            className="w-full pl-12 pr-4 py-3 text-sm border border-healthcare-border rounded-2xl focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/5 outline-none bg-healthcare-surface/30 text-healthcare-text placeholder:text-healthcare-text-muted/50 font-medium transition-all"
          />
        </div>

        <div className="flex items-center gap-6 px-2">
          <div className="text-center">
            <p className="text-[10px] font-bold text-healthcare-text-muted uppercase tracking-widest mb-1">
              Total
            </p>
            <p className="text-lg font-bold text-healthcare-text">
              {therapists.length}
            </p>
          </div>
          <div className="w-px h-8 bg-healthcare-border"></div>
          <div className="text-center">
            <p className="text-[10px] font-bold text-healthcare-text-muted uppercase tracking-widest mb-1">
              Active
            </p>
            <p className="text-lg font-bold text-emerald-600">
              {therapists.filter((t) => t.isActive).length}
            </p>
          </div>
        </div>
      </section>

      {isLoading && (
        <div className="flex justify-center py-20">
          <Spinner size="lg" />
        </div>
      )}

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

      {data && (
        <AdminTable<AdminTherapist>
          data={filtered}
          isLoading={isLoading}
          emptyMessage="No therapists matching your search were found."
          columns={[
            {
              header: "Therapist",
              accessor: (t) => (
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl bg-healthcare-lavender/10 flex items-center justify-center flex-shrink-0 text-sm font-bold text-purple-600 shadow-sm">
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
                <span className="px-3 py-1 bg-healthcare-surface border border-healthcare-border rounded-lg text-xs font-semibold text-healthcare-text">
                  {t.specialization}
                </span>
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
                  className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider border-none cursor-pointer transition-all ${
                    t.isActive
                      ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                      : "bg-red-50 text-red-600 hover:bg-red-100"
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full animate-pulse-slow ${t.isActive ? "bg-emerald-500" : "bg-red-400"}`}
                  />
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
                    className="px-4 py-2 text-xs font-bold text-brand-blue bg-blue-50 rounded-xl hover:bg-blue-100 transition-all no-underline shadow-sm"
                  >
                    Bookings
                  </Link>
                  <Link
                    to={`/admin/therapists/${t.id}/edit`}
                    className="p-2 text-healthcare-text-muted hover:text-healthcare-text hover:bg-healthcare-surface rounded-xl transition-all no-underline border border-transparent hover:border-healthcare-border"
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
                        d="M11 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-5M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </Link>
                </div>
              ),
            },
          ]}
        />
      )}
    </div>
  );
}
