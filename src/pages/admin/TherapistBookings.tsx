import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  fetchAdminTherapist,
  fetchTherapistBookings,
  markSessionComplete,
} from "../../api/admin.api";
import Spinner from "../../components/ui/Spinner";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import AdminTable from "../../components/admin/AdminTable";
import GroupButton from "../../components/ui/GroupButton";

const STATUS_BADGE: Record<string, string> = {
  upcoming: "bg-blue-50 text-blue-700 border-blue-100/50",
  completed: "bg-emerald-50 text-emerald-700 border-emerald-100/50",
  cancelled: "bg-red-50 text-red-600 border-red-100/50",
};

export default function TherapistBookings() {
  const { id } = useParams<{ id: string }>();
  const [tab, setTab] = useState<"upcoming" | "past">("upcoming");
  const qc = useQueryClient();

  const { data: therapist } = useQuery({
    queryKey: ["admin", "therapist", id],
    queryFn: () => fetchAdminTherapist(id!),
    enabled: !!id,
  });

  const { data: bookings, isLoading } = useQuery({
    queryKey: ["admin", "therapist-bookings", id, tab],
    queryFn: () => fetchTherapistBookings(id!, tab),
    enabled: !!id,
  });

  const complete = useMutation({
    mutationFn: markSessionComplete,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "therapist-bookings", id] });
      toast.success("Session marked as completed.");
    },
    onError: (err: any) =>
      toast.error(err.message ?? "Failed to update session."),
  });

  return (
    <div className="space-y-2  animate-fade-in">
      <div className="flex items-start gap-4">
        <Link to="/admin/therapists" className="mt-2">
          <svg
            className="w-6 h-6 group-hover:-translate-x-0.5 transition-transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </Link>
        <div className="flex-1">
          <AdminPageHeader
            title={`${therapist?.name ?? "Therapist"} — Bookings`}
            description={`${therapist?.specialization ?? ""} · ${therapist?.totalSessions ?? 0} total sessions delivered`}
          />
        </div>
      </div>

      {/* Tabs Section */}
      <section className="bg-white  pr-1 py-1 rounded-sm border border-healthcare-border  flex items-center gap-2 max-w-fit">
        <GroupButton
          value={tab}
          onChange={(v) => {
            setTab(v);
          }}
          btns={[
            { label: "upcoming", value: "upcoming" },
            { label: "past", value: "past" },
          ]}
        />
      </section>

      <AdminTable<any>
        data={bookings}
        isLoading={isLoading}
        emptyMessage={`No ${tab} bookings found for this therapist.`}
        columns={[
          {
            header: "Patient",
            accessor: (b) => (
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-brand-blue/5 flex items-center justify-center font-bold text-brand-blue text-sm border border-brand-blue/10">
                  {b?.name?.[0] ?? "P"}
                </div>
                <div>
                  <p className="font-bold text-healthcare-text text-sm leading-tight">
                    {b?.name ?? "Unknown Patient"}
                  </p>
                  <p className="text-[11px] text-healthcare-text-muted font-medium mt-0.5">
                    {b?.patientEmail}
                  </p>
                </div>
              </div>
            ),
          },
          {
            header: "Date & Time",
            accessor: (b) => (
              <div>
                <p className="font-bold text-healthcare-text text-sm">
                  {new Date(b.date).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
                <p className="text-[11px] text-healthcare-text-muted font-bold uppercase tracking-wider mt-0.5">
                  {b.time}
                </p>
              </div>
            ),
            hiddenOnMobile: true,
          },
          {
            header: "Amount",
            accessor: (b) => (
              <span className="font-bold text-healthcare-text">
                ${b.amount}
              </span>
            ),
            hiddenOnTablet: true,
          },
          {
            header: "Status",
            accessor: (b) => (
              <span
                className={`inline-flex items-center px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${STATUS_BADGE[b.status] ?? "bg-gray-50 text-gray-500 border-gray-100"}`}
              >
                {b.status}
              </span>
            ),
          },
          {
            header: "",
            accessor: (b) => (
              <div className="flex justify-end">
                {b.status === "upcoming" && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      complete.mutate(b.id);
                    }}
                    disabled={complete.isPending}
                    className="px-5 py-2 text-xs font-bold text-emerald-700 bg-emerald-50/50 rounded-xl hover:bg-emerald-100/50 transition-all border border-emerald-100/30 cursor-pointer disabled:opacity-50"
                  >
                    Mark Complete
                  </button>
                )}
              </div>
            ),
          },
        ]}
      />
    </div>
  );
}
