import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  fetchSupportTickets,
  replyToTicket,
  updateTicketStatus,
} from '../../api/admin.api';
import type { SupportTicket } from '../../types/admin';
import Spinner from '../../components/ui/Spinner';

type StatusFilter = 'all' | SupportTicket['status'];

const STATUS_BADGE: Record<string, string> = {
  new: 'bg-blue-50 text-blue-700',
  open: 'bg-yellow-50 text-yellow-700',
  resolved: 'bg-emerald-50 text-emerald-700',
  closed: 'bg-gray-100 text-gray-600',
};

function TicketDetail({
  ticket,
  onClose,
}: {
  ticket: SupportTicket;
  onClose: () => void;
}) {
  const qc = useQueryClient();
  const [reply, setReply] = useState(ticket.adminReply ?? '');

  const sendReply = useMutation({
    mutationFn: () => replyToTicket(ticket.id, reply),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'support'] });
      toast.success('Reply sent.');
      onClose();
    },
    onError: (err: any) => toast.error(err.message ?? 'Failed to send reply.'),
  });

  const changeStatus = useMutation({
    mutationFn: (status: SupportTicket['status']) => updateTicketStatus(ticket.id, status),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'support'] });
      toast.success('Status updated.');
      onClose();
    },
    onError: (err: any) => toast.error(err.message ?? 'Failed to update status.'),
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
      <div className="bg-white rounded-2xl shadow-2xl border border-healthcare-border w-full max-w-xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-healthcare-border">
          <h2 className="text-base font-bold text-healthcare-text truncate">{ticket.subject}</h2>
          <button onClick={onClose} className="text-healthcare-text-muted hover:text-healthcare-text transition-colors bg-transparent border-none cursor-pointer p-1">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-6 space-y-4">
          <div className="text-sm">
            <p className="font-bold text-healthcare-text">{ticket.userName}</p>
            <p className="text-healthcare-text-muted text-xs">{ticket.userEmail}</p>
            <p className="text-xs text-healthcare-text-muted mt-1">
              {new Date(ticket.createdAt).toLocaleString()}
            </p>
          </div>

          <div className="p-4 bg-healthcare-surface/40 rounded-xl border border-healthcare-border text-sm text-healthcare-text">
            {ticket.message}
          </div>

          {ticket.adminReply && (
            <div className="p-4 bg-brand-blue/5 rounded-xl border border-brand-blue/15 text-sm text-healthcare-text">
              <p className="text-xs font-bold text-brand-blue mb-1.5">Admin Reply</p>
              {ticket.adminReply}
            </div>
          )}

          {/* Reply textarea */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-healthcare-text">Reply</label>
            <textarea
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              rows={4}
              placeholder="Write your reply…"
              className="w-full px-4 py-3 border border-healthcare-neutral/20 rounded-xl focus:border-brand-blue outline-none text-sm text-healthcare-text bg-white resize-none font-medium"
            />
          </div>

          {/* Status select */}
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-healthcare-text">Update Status</label>
            <div className="flex gap-2 flex-wrap">
              {(['new', 'open', 'resolved', 'closed'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => changeStatus.mutate(s)}
                  disabled={changeStatus.isPending || ticket.status === s}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg border-none cursor-pointer transition-colors disabled:opacity-50 ${
                    ticket.status === s
                      ? 'bg-brand-blue text-white cursor-default'
                      : 'bg-healthcare-surface text-healthcare-text hover:bg-healthcare-border'
                  }`}
                >
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-healthcare-border flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 text-sm font-bold text-healthcare-text bg-healthcare-surface border border-healthcare-neutral/20 rounded-xl hover:bg-white transition-all cursor-pointer">
            Cancel
          </button>
          <button
            onClick={() => sendReply.mutate()}
            disabled={!reply.trim() || sendReply.isPending}
            className="px-4 py-2 text-sm font-bold text-white bg-brand-blue rounded-xl hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed border-none cursor-pointer"
          >
            {sendReply.isPending ? 'Sending…' : 'Send Reply'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Support() {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<SupportTicket | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'support', statusFilter, page],
    queryFn: () =>
      fetchSupportTickets({
        status: statusFilter === 'all' ? undefined : statusFilter,
        page,
        limit: 20,
      }),
  });

  return (
    <div className="space-y-6">
      {selected && <TicketDetail ticket={selected} onClose={() => setSelected(null)} />}

      <div>
        <h1 className="text-2xl font-bold text-healthcare-text">Support Tickets</h1>
        <p className="text-sm text-healthcare-text-muted mt-1">Manage and respond to user support requests.</p>
      </div>

      {/* Filter */}
      <div className="flex gap-2 flex-wrap">
        {(['all', 'new', 'open', 'resolved', 'closed'] as StatusFilter[]).map((f) => (
          <button
            key={f}
            onClick={() => { setStatusFilter(f); setPage(1); }}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all border-none cursor-pointer ${
              statusFilter === f
                ? 'bg-brand-blue text-white'
                : 'bg-white text-healthcare-text-muted border border-healthcare-neutral/20 hover:bg-healthcare-surface'
            }`}
          >
            {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {isLoading && <div className="flex justify-center py-10"><Spinner size="lg" /></div>}

      {data && (
        <>
          <div className="bg-white rounded-2xl border border-healthcare-border shadow-clinical overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-healthcare-border bg-healthcare-surface/40">
                    <th className="text-left px-5 py-3.5 text-xs font-bold text-healthcare-text-muted uppercase tracking-wider">Subject</th>
                    <th className="text-left px-5 py-3.5 text-xs font-bold text-healthcare-text-muted uppercase tracking-wider hidden md:table-cell">User</th>
                    <th className="text-left px-5 py-3.5 text-xs font-bold text-healthcare-text-muted uppercase tracking-wider hidden sm:table-cell">Date</th>
                    <th className="text-left px-5 py-3.5 text-xs font-bold text-healthcare-text-muted uppercase tracking-wider">Status</th>
                    <th className="px-5 py-3.5" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-healthcare-border">
                  {data.items.length === 0 && (
                    <tr>
                      <td colSpan={5} className="text-center py-10 text-sm text-healthcare-text-muted">
                        No tickets found.
                      </td>
                    </tr>
                  )}
                  {data.items.map((t) => (
                    <tr key={t.id} className="hover:bg-healthcare-surface/20 transition-colors">
                      <td className="px-5 py-4">
                        <p className="font-bold text-healthcare-text line-clamp-1">{t.subject}</p>
                        <p className="text-xs text-healthcare-text-muted line-clamp-1 mt-0.5">{t.message}</p>
                      </td>
                      <td className="px-5 py-4 hidden md:table-cell">
                        <p className="font-medium text-healthcare-text">{t.userName}</p>
                        <p className="text-xs text-healthcare-text-muted">{t.userEmail}</p>
                      </td>
                      <td className="px-5 py-4 text-healthcare-text-muted hidden sm:table-cell">
                        {new Date(t.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${STATUS_BADGE[t.status] ?? 'bg-gray-100 text-gray-600'}`}>
                          {t.status.charAt(0).toUpperCase() + t.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <button
                          onClick={() => setSelected(t)}
                          className="px-3 py-1.5 text-xs font-bold text-brand-blue bg-brand-blue/5 rounded-lg hover:bg-brand-blue/10 transition-colors border-none cursor-pointer"
                        >
                          View
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
                Page {data.page} of {data.totalPages} ({data.total} tickets)
              </p>
              <div className="flex gap-2">
                <button disabled={page <= 1} onClick={() => setPage(page - 1)} className="px-3 py-1.5 rounded-lg border border-healthcare-neutral/20 text-healthcare-text font-bold disabled:opacity-40 hover:bg-healthcare-surface transition-all cursor-pointer bg-white">Prev</button>
                <button disabled={page >= data.totalPages} onClick={() => setPage(page + 1)} className="px-3 py-1.5 rounded-lg border border-healthcare-neutral/20 text-healthcare-text font-bold disabled:opacity-40 hover:bg-healthcare-surface transition-all cursor-pointer bg-white">Next</button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
