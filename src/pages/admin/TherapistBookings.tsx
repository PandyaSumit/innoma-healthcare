import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  fetchAdminTherapist,
  fetchTherapistBookings,
  markSessionComplete,
} from '../../api/admin.api';
import Spinner from '../../components/ui/Spinner';

const STATUS_BADGE: Record<string, string> = {
  upcoming: 'bg-blue-50 text-blue-700',
  completed: 'bg-emerald-50 text-emerald-700',
  cancelled: 'bg-red-50 text-red-600',
};

export default function TherapistBookings() {
  const { id } = useParams<{ id: string }>();
  const [tab, setTab] = useState<'upcoming' | 'past'>('upcoming');
  const qc = useQueryClient();

  const { data: therapist } = useQuery({
    queryKey: ['admin', 'therapist', id],
    queryFn: () => fetchAdminTherapist(id!),
    enabled: !!id,
  });

  const { data: bookings, isLoading } = useQuery({
    queryKey: ['admin', 'therapist-bookings', id, tab],
    queryFn: () => fetchTherapistBookings(id!, tab),
    enabled: !!id,
  });

  const complete = useMutation({
    mutationFn: markSessionComplete,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'therapist-bookings', id] });
      toast.success('Session marked as completed.');
    },
    onError: (err: any) => toast.error(err.message ?? 'Failed to update session.'),
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link
          to="/admin/therapists"
          className="p-2 rounded-xl bg-white border border-healthcare-neutral/20 text-healthcare-text hover:bg-healthcare-surface transition-colors no-underline"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-healthcare-text">
            {therapist?.name ?? 'Therapist'} — Bookings
          </h1>
          <p className="text-sm text-healthcare-text-muted mt-0.5">
            {therapist?.specialization} · {therapist?.totalSessions} total sessions
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {(['upcoming', 'past'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all border-none cursor-pointer ${
              tab === t
                ? 'bg-brand-blue text-white shadow-sm'
                : 'bg-white text-healthcare-text-muted border border-healthcare-neutral/20 hover:bg-healthcare-surface'
            }`}
          >
            {t === 'upcoming' ? 'Upcoming' : 'Past'}
          </button>
        ))}
      </div>

      {isLoading && (
        <div className="flex justify-center py-10">
          <Spinner size="lg" />
        </div>
      )}

      {bookings && (
        <div className="bg-white rounded-2xl border border-healthcare-border shadow-clinical overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-healthcare-border bg-healthcare-surface/40">
                  <th className="text-left px-5 py-3.5 text-xs font-bold text-healthcare-text-muted uppercase tracking-wider">Patient</th>
                  <th className="text-left px-5 py-3.5 text-xs font-bold text-healthcare-text-muted uppercase tracking-wider hidden sm:table-cell">Date & Time</th>
                  <th className="text-left px-5 py-3.5 text-xs font-bold text-healthcare-text-muted uppercase tracking-wider hidden md:table-cell">Amount</th>
                  <th className="text-left px-5 py-3.5 text-xs font-bold text-healthcare-text-muted uppercase tracking-wider">Status</th>
                  <th className="px-5 py-3.5" />
                </tr>
              </thead>
              <tbody className="divide-y divide-healthcare-border">
                {bookings.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center py-10 text-sm text-healthcare-text-muted">
                      No {tab} bookings found.
                    </td>
                  </tr>
                )}
                {bookings.map((b) => (
                  <tr key={b.id} className="hover:bg-healthcare-surface/20 transition-colors">
                    <td className="px-5 py-4">
                      <p className="font-bold text-healthcare-text">{b.patientName}</p>
                      <p className="text-xs text-healthcare-text-muted">{b.patientEmail}</p>
                    </td>
                    <td className="px-5 py-4 hidden sm:table-cell">
                      <p className="font-medium text-healthcare-text">{b.date}</p>
                      <p className="text-xs text-healthcare-text-muted">{b.time}</p>
                    </td>
                    <td className="px-5 py-4 font-bold text-healthcare-text hidden md:table-cell">
                      ${b.amount}
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${STATUS_BADGE[b.status] ?? 'bg-gray-50 text-gray-600'}`}>
                        {b.status.charAt(0).toUpperCase() + b.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      {b.status === 'upcoming' && (
                        <button
                          onClick={() => complete.mutate(b.id)}
                          disabled={complete.isPending}
                          className="px-3 py-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors border-none cursor-pointer disabled:opacity-50"
                        >
                          Mark Complete
                        </button>
                      )}
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
