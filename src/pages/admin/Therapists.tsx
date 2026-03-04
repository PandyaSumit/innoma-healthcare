import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { fetchAdminTherapists, updateTherapist } from "../../api/admin.api";
import type { AdminTherapist } from "../../types/admin";
import Spinner from "../../components/ui/Spinner";

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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-healthcare-text">
            Therapists
          </h1>
          <p className="text-sm text-healthcare-text-muted mt-1">
            Manage your therapist roster.
          </p>
        </div>
        <Link
          to="/admin/therapists/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-brand-blue text-white rounded-xl font-bold text-sm hover:opacity-90 transition-all no-underline shadow-sm"
        >
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
              d="M12 4v16m8-8H4"
            />
          </svg>
          Add Therapist
        </Link>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
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
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, email or specialty…"
          className="w-full pl-9 pr-4 py-2.5 text-sm border border-healthcare-neutral/20 rounded-xl focus:border-brand-blue outline-none bg-white text-healthcare-text placeholder:text-healthcare-text-muted/40 font-medium"
        />
      </div>

      {isLoading && (
        <div className="flex justify-center py-10">
          <Spinner size="lg" />
        </div>
      )}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600 font-medium">
          Failed to load therapists.
        </div>
      )}

      {data && (
        <div className="bg-white rounded-2xl border border-healthcare-border shadow-clinical overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-healthcare-border bg-healthcare-surface/40">
                  <th className="text-left px-5 py-3.5 text-xs font-bold text-healthcare-text-muted uppercase tracking-wider">
                    Therapist
                  </th>
                  <th className="text-left px-5 py-3.5 text-xs font-bold text-healthcare-text-muted uppercase tracking-wider hidden md:table-cell">
                    Specialization
                  </th>
                  <th className="text-left px-5 py-3.5 text-xs font-bold text-healthcare-text-muted uppercase tracking-wider hidden sm:table-cell">
                    Sessions
                  </th>
                  <th className="text-left px-5 py-3.5 text-xs font-bold text-healthcare-text-muted uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-5 py-3.5" />
                </tr>
              </thead>
              <tbody className="divide-y divide-healthcare-border">
                {filtered.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="text-center py-10 text-sm text-healthcare-text-muted"
                    >
                      No therapists found.
                    </td>
                  </tr>
                )}
                {filtered.map((t) => (
                  <tr
                    key={t.id}
                    className="hover:bg-healthcare-surface/20 transition-colors"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-healthcare-lavender/20 flex items-center justify-center flex-shrink-0 text-sm font-bold text-purple-600">
                          {t.name[0]?.toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-healthcare-text">
                            {t.name}
                          </p>
                          <p className="text-xs text-healthcare-text-muted">
                            {t.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-healthcare-text hidden md:table-cell">
                      {t.specialization}
                    </td>
                    <td className="px-5 py-4 text-healthcare-text hidden sm:table-cell">
                      {t.totalSessions}
                    </td>
                    <td className="px-5 py-4">
                      <button
                        onClick={() =>
                          toggleActive.mutate({
                            id: t.id,
                            isActive: !t.isActive,
                          })
                        }
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border-none cursor-pointer transition-colors ${
                          t.isActive
                            ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                            : "bg-red-50 text-red-600 hover:bg-red-100"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${t.isActive ? "bg-emerald-500" : "bg-red-400"}`}
                        />
                        {t.isActive ? "Active" : "Inactive"}
                      </button>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2 justify-end">
                        <Link
                          to={`/admin/therapists/${t.id}/bookings`}
                          className="px-3 py-1.5 text-xs font-bold text-brand-blue bg-brand-blue/5 rounded-lg hover:bg-brand-blue/10 transition-colors no-underline"
                        >
                          Bookings
                        </Link>
                        <Link
                          to={`/admin/therapists/${t.id}/edit`}
                          className="px-3 py-1.5 text-xs font-bold text-healthcare-text bg-healthcare-surface rounded-lg hover:bg-healthcare-border transition-colors no-underline"
                        >
                          Edit
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
