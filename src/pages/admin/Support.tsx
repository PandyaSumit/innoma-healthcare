import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  fetchSupportTickets,
  replyToTicket,
  updateTicketStatus,
} from "../../api/admin.api";
import type { SupportTicket } from "../../types/admin";
import Spinner from "../../components/ui/Spinner";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import AdminTable from "../../components/admin/AdminTable";

type StatusFilter = "all" | SupportTicket["status"];

const STATUS_BADGE: Record<string, string> = {
  new: "bg-blue-50 text-blue-700 border-blue-100/50",
  open: "bg-amber-50 text-amber-700 border-amber-100/50",
  resolved: "bg-emerald-50 text-emerald-700 border-emerald-100/50",
  closed: "bg-gray-50 text-gray-500 border-gray-100/50",
};

function TicketDetail({
  ticket,
  onClose,
}: {
  ticket: SupportTicket;
  onClose: () => void;
}) {
  const qc = useQueryClient();
  const [reply, setReply] = useState(ticket.adminReply ?? "");

  const sendReply = useMutation({
    mutationFn: () => replyToTicket(ticket.id, reply),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "support"] });
      toast.success("Reply sent.");
      onClose();
    },
    onError: (err: any) => toast.error(err.message ?? "Failed to send reply."),
  });

  const changeStatus = useMutation({
    mutationFn: (status: SupportTicket["status"]) =>
      updateTicketStatus(ticket.id, status),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "support"] });
      toast.success("Status updated.");
      onClose();
    },
    onError: (err: any) =>
      toast.error(err.message ?? "Failed to update status."),
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-healthcare-text/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl border border-healthcare-border w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-healthcare-border bg-healthcare-surface/30">
          <div>
            <h2 className="text-xl font-bold text-healthcare-text truncate">
              {ticket.subject}
            </h2>
            <p className="text-xs text-healthcare-text-muted mt-1 font-medium">
              Ticket ID: #{ticket.id.slice(-6).toUpperCase()}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center text-healthcare-text-muted hover:text-healthcare-text hover:bg-healthcare-surface rounded-xl transition-all border-none cursor-pointer"
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

        <div className="overflow-y-auto flex-1 p-8 space-y-8">
          <div className="flex items-center justify-between bg-healthcare-surface/20 p-4 rounded-2xl border border-healthcare-border">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-brand-blue text-white flex items-center justify-center font-bold text-lg shadow-lg shadow-blue-100">
                {ticket.userName[0]}
              </div>
              <div>
                <p className="font-bold text-healthcare-text">
                  {ticket.userName}
                </p>
                <p className="text-healthcare-text-muted text-xs font-medium">
                  {ticket.userEmail}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-bold text-healthcare-text-muted uppercase tracking-widest leading-none mb-1">
                Created At
              </p>
              <p className="text-xs font-bold text-healthcare-text">
                {new Date(ticket.createdAt).toLocaleString(undefined, {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-healthcare-text-muted uppercase tracking-widest px-1">
              Message
            </label>
            <div className="p-6 bg-white rounded-2xl border border-healthcare-border text-sm text-healthcare-text leading-relaxed shadow-sm">
              {ticket.message}
            </div>
          </div>

          {ticket.adminReply && (
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-brand-blue uppercase tracking-widest px-1">
                Previous Admin Reply
              </label>
              <div className="p-6 bg-blue-50/50 rounded-2xl border border-brand-blue/10 text-sm text-healthcare-text leading-relaxed relative overflow-hidden">
                <div className="absolute top-0 right-0 p-3 opacity-10">
                  <svg
                    className="w-8 h-8 text-brand-blue"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
                  </svg>
                </div>
                {ticket.adminReply}
              </div>
            </div>
          )}

          {/* Reply textarea */}
          <div className="space-y-3">
            <label className="text-sm font-bold text-healthcare-text px-1 flex items-center gap-2">
              <svg
                className="w-4 h-4 text-brand-blue"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
                />
              </svg>
              Response
            </label>
            <textarea
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              rows={5}
              placeholder="Type your response to the user here..."
              className="w-full px-5 py-4 border border-healthcare-border rounded-2xl focus:border-brand-blue/50 focus:ring-4 focus:ring-brand-blue/5 outline-none text-sm text-healthcare-text bg-healthcare-surface/20 resize-none font-medium transition-all"
            />
          </div>

          {/* Status select */}
          <div className="space-y-3">
            <label className="text-sm font-bold text-healthcare-text px-1">
              Update Ticket Status
            </label>
            <div className="flex gap-2 p-1 bg-healthcare-surface/40 border border-healthcare-border rounded-2xl max-w-fit">
              {(["new", "open", "resolved", "closed"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => changeStatus.mutate(s)}
                  disabled={changeStatus.isPending || ticket.status === s}
                  className={`px-4 py-2 text-xs font-bold rounded-xl border-none cursor-pointer transition-all uppercase tracking-wider ${
                    ticket.status === s
                      ? "bg-brand-blue text-white shadow-clinical"
                      : "bg-transparent text-healthcare-text-muted hover:text-healthcare-text hover:bg-white"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-6 border-t border-healthcare-border bg-healthcare-surface/30 flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-6 py-3 text-sm font-bold text-healthcare-text bg-white border border-healthcare-border rounded-2xl hover:bg-healthcare-surface transition-all cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={() => sendReply.mutate()}
            disabled={!reply.trim() || sendReply.isPending}
            className="px-8 py-3 text-sm font-bold text-white bg-healthcare-text rounded-2xl hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed border-none cursor-pointer shadow-lg shadow-gray-200"
          >
            {sendReply.isPending ? "Sending Reply..." : "Send Response"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Support() {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<SupportTicket | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "support", statusFilter, page],
    queryFn: () =>
      fetchSupportTickets({
        status: statusFilter === "all" ? undefined : statusFilter,
        page,
        limit: 20,
      }),
  });

  return (
    <div className="space-y-8 animate-fade-in">
      {selected && (
        <TicketDetail ticket={selected} onClose={() => setSelected(null)} />
      )}

      <AdminPageHeader
        title="Support Tickets"
        description="View and respond to inquiries, issues, and feedback from your platform users."
      />

      {/* Filter Section */}
      <section className="bg-white p-2 rounded-2xl border border-healthcare-border shadow-clinical flex items-center gap-2 overflow-x-auto scrollbar-hide">
        <div className="flex items-center gap-1 p-1">
          {(["all", "new", "open", "resolved", "closed"] as StatusFilter[]).map(
            (f) => (
              <button
                key={f}
                onClick={() => {
                  setStatusFilter(f);
                  setPage(1);
                }}
                className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all border whitespace-nowrap cursor-pointer uppercase tracking-wider ${
                  statusFilter === f
                    ? "bg-brand-blue text-white border-brand-blue shadow-clinical"
                    : "bg-transparent text-healthcare-text-muted border-transparent hover:bg-healthcare-surface hover:text-healthcare-text"
                }`}
              >
                {f}
              </button>
            ),
          )}
        </div>
      </section>

      {isLoading && (
        <div className="flex justify-center py-20">
          <Spinner size="lg" />
        </div>
      )}

      {data && (
        <div className="space-y-6">
          <AdminTable<SupportTicket>
            data={data.items || []}
            isLoading={isLoading}
            emptyMessage="No support tickets found matching criteria."
            columns={[
              {
                header: "Subject",
                accessor: (t) => (
                  <div className="max-w-md">
                    <p className="font-bold text-healthcare-text text-sm line-clamp-1 group-hover:text-brand-blue transition-colors">
                      {t.subject}
                    </p>
                    <p className="text-xs text-healthcare-text-muted line-clamp-1 mt-1 opacity-80">
                      {t.message}
                    </p>
                  </div>
                ),
              },
              {
                header: "User",
                accessor: (t) => (
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-healthcare-lavender/10 flex items-center justify-center font-bold text-purple-600 text-[10px] border border-purple-100">
                      {t.userName[0]}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-healthcare-text leading-tight">
                        {t.userName}
                      </p>
                      <p className="text-[10px] text-healthcare-text-muted font-medium">
                        {t.userEmail}
                      </p>
                    </div>
                  </div>
                ),
                hiddenOnTablet: true,
              },
              {
                header: "Date",
                accessor: (t) => (
                  <span className="text-sm text-healthcare-text-muted font-medium">
                    {new Date(t.createdAt).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                ),
                hiddenOnMobile: true,
              },
              {
                header: "Status",
                accessor: (t) => (
                  <span
                    className={`inline-flex items-center px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${STATUS_BADGE[t.status] ?? "bg-gray-50 text-gray-500 border-gray-100"}`}
                  >
                    {t.status}
                  </span>
                ),
              },
              {
                header: "",
                accessor: (t) => (
                  <div className="flex items-center gap-2 justify-end">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelected(t);
                      }}
                      className="px-5 py-2 text-xs font-bold text-brand-blue bg-blue-50/50 rounded-xl hover:bg-blue-100/50 transition-all border-none cursor-pointer"
                    >
                      View Ticket
                    </button>
                  </div>
                ),
              },
            ]}
          />

          {data.totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between p-6 gap-6">
              <p className="text-sm font-medium text-healthcare-text-muted order-2 sm:order-1">
                Showing{" "}
                <span className="text-healthcare-text font-bold">
                  {(page - 1) * 20 + 1}-{Math.min(page * 20, data.total)}
                </span>{" "}
                of{" "}
                <span className="text-healthcare-text font-bold">
                  {data.total.toLocaleString()}
                </span>{" "}
                tickets
              </p>
              <div className="flex items-center gap-2 order-1 sm:order-2">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage(page - 1)}
                  className="p-2.5 rounded-xl border border-healthcare-border text-healthcare-text disabled:opacity-30 hover:bg-healthcare-surface transition-all cursor-pointer bg-white group"
                >
                  <svg
                    className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform"
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
                </button>

                <div className="bg-healthcare-surface/50 border border-healthcare-border rounded-xl px-4 py-2 flex items-center gap-2">
                  <span className="text-sm font-bold text-brand-blue">
                    {page}
                  </span>
                  <span className="text-sm text-healthcare-text-muted/40 font-bold">
                    /
                  </span>
                  <span className="text-sm font-bold text-healthcare-text-muted">
                    {data.totalPages}
                  </span>
                </div>

                <button
                  disabled={page >= data.totalPages}
                  onClick={() => setPage(page + 1)}
                  className="p-2.5 rounded-xl border border-healthcare-border text-healthcare-text disabled:opacity-30 hover:bg-healthcare-surface transition-all cursor-pointer bg-white group"
                >
                  <svg
                    className="w-5 h-5 group-hover:translate-x-0.5 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
