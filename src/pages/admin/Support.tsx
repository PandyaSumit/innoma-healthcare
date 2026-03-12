import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  fetchSupportTickets,
  replyToTicket,
  updateTicketStatus,
} from "../../api/admin.api";
import type { SupportTicket } from "../../types/admin";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import AdminTable from "../../components/admin/AdminTable";
import GroupButton from "../../components/ui/GroupButton";
import Modal from "../../components/ui/Model";
import Input from "../../components/ui/Input";

type StatusFilter = "all" | SupportTicket["status"];

const STATUS_BADGE: Record<string, string> = {
  new: "bg-blue-50 text-blue-700 border-blue-100/50",
  open: "bg-amber-50 text-amber-700 border-amber-100/50",
  "in progress": "bg-purple-50 text-purple-700 border-purple-100/50",
  resolved: "bg-emerald-50 text-emerald-700 border-emerald-100/50",
  closed: "bg-gray-50 text-gray-500 border-gray-100/50",
};

const CATEGORY_BADGE: Record<string, string> = {
  Technical: "bg-indigo-50 text-indigo-700 border-indigo-100",
  Billing: "bg-orange-50 text-orange-700 border-orange-100",
  General: "bg-gray-50 text-gray-600 border-gray-100",
  Account: "bg-emerald-50 text-emerald-700 border-emerald-100",
};

export default function Support() {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<SupportTicket | null>(null);
  const [isshowTicketDetail, setIsShowTicketDetail] = useState(false);
  const [isSelectedStatus, setIsSelectedStatus] = useState(selected?.status);
  const { data, isLoading } = useQuery({
    queryKey: ["admin", "support", statusFilter, page],
    queryFn: () =>
      fetchSupportTickets({
        status: statusFilter === "all" ? undefined : statusFilter,
        page,
        limit: 20,
      }),
  });

  const qc = useQueryClient();
  const [reply, setReply] = useState(selected?.adminReply ?? "");

  const sendReply = useMutation({
    mutationFn: () => replyToTicket(selected.id, reply),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "support"] });
      toast.success("Reply sent.");
    },
    onError: (err: any) => toast.error(err.message ?? "Failed to send reply."),
  });
  const changeStatus = useMutation({
    mutationFn: (status: SupportTicket["status"]) =>
      updateTicketStatus(
        selected.id,
        status.charAt(0).toUpperCase() + status.slice(1),
      ),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "support"] });
      toast.success("Status updated.");
    },
    onError: (err: any) =>
      toast.error(err.message ?? "Failed to update status."),
  });

  console.log(data, "data===");

  useEffect(() => {
    setIsSelectedStatus(selected?.status);
  }, [selected]);
  return (
    <>
      <div className="space-y-2 animate-fade-in">
        <AdminPageHeader
          title="Support Tickets"
          description="View and respond to inquiries, issues, and feedback from your platform users."
        />

        {/* Filter Section */}
        <section className="bg-white p-2 w-max rounded-md border border-healthcare-border  flex items-center gap-2 overflow-x-auto scrollbar-hide">
          <GroupButton
            value={statusFilter}
            onChange={(f) => {
              setStatusFilter(f);
              setPage(1);
            }}
            btns={[
              { label: "all", value: "all" },
              { label: "new", value: "new" },
              {
                label: "open",
                value: "open",
              },
              {
                label: "resolved",
                value: "resolved",
              },
              {
                label: "closed",
                value: "closed",
              },
            ]}
          />
        </section>

        <div className="space-y-6">
          <AdminTable<SupportTicket>
            data={data || []}
            isLoading={isLoading}
            emptyMessage="No support tickets found matching criteria."
            columns={[
              {
                header: "Subject",
                accessor: (t) => (
                  <div className="max-w-md space-y-1">
                    <p className="font-semibold text-healthcare-text text-sm line-clamp-1">
                      {t.subject}
                    </p>

                    <p className="text-xs text-healthcare-text-muted line-clamp-1">
                      {t.description}
                    </p>
                  </div>
                ),
              },

              {
                header: "Category",
                accessor: (t) => (
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-semibold border ${
                      CATEGORY_BADGE[t.category] ??
                      "bg-gray-50 text-gray-600 border-gray-100"
                    }`}
                  >
                    {t.category}
                  </span>
                ),
              },

              {
                header: "User",
                accessor: (t) => (
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center text-xs font-bold">
                      {t.user?.email?.[0]?.toUpperCase()}
                    </div>

                    <div className="leading-tight">
                      <p className="text-sm font-semibold text-healthcare-text">
                        {t.user?.email}
                      </p>
                    </div>
                  </div>
                ),
                hiddenOnTablet: true,
              },

              {
                header: "Date",
                accessor: (t) => (
                  <span className="text-sm text-healthcare-text-muted">
                    {new Date(t.created_at).toLocaleDateString(undefined, {
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
                    className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-semibold border ${
                      STATUS_BADGE[t?.status?.toLowerCase()]
                    }`}
                  >
                    {t.status}
                  </span>
                ),
              },

              {
                header: "",
                accessor: (t) => (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelected(t);
                      setIsShowTicketDetail(true);
                    }}
                    className="px-4 py-2 text-xs font-semibold text-brand-blue bg-blue-50 rounded-lg hover:bg-blue-100 transition"
                  >
                    View
                  </button>
                ),
              },
            ]}
          />

          {data?.totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between p-6 gap-6">
              <p className="text-sm font-medium text-healthcare-text-muted order-2 sm:order-1">
                Showing{" "}
                <span className="text-healthcare-text font-bold">
                  {(page - 1) * 20 + 1}-{Math.min(page * 20, data?.total)}
                </span>{" "}
                of{" "}
                <span className="text-healthcare-text font-bold">
                  {data?.total.toLocaleString()}
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
                    {data?.totalPages}
                  </span>
                </div>

                <button
                  disabled={page >= data?.totalPages}
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
      </div>

      <Modal
        isOpen={isshowTicketDetail}
        onClose={() => setIsShowTicketDetail(false)}
        title={selected?.subject}
      >
        <p className="text-xs text-healthcare-text-muted mt-1 font-medium">
          Ticket ID: #{selected?.id.slice(-6).toUpperCase()}
        </p>
        <div className="overflow-y-auto flex-1  space-y-4">
          <div className="flex items-center justify-between bg-healthcare-surface/20 p-4 rounded-md border border-healthcare-border">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-md bg-brand-blue text-white flex items-center justify-center font-bold text-lg shadow-lg shadow-blue-100">
                {selected?.user?.email?.[0]?.toUpperCase()}
              </div>
              <div>
                <p className="text-healthcare-text-muted text-xs font-medium">
                  {selected?.user?.email}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-bold text-healthcare-text-muted uppercase tracking-widest leading-none mb-1">
                Created At
              </p>
              <p className="text-xs font-bold text-healthcare-text">
                {new Date(selected?.created_at).toLocaleString(undefined, {
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
            <Input value={selected?.description} />
          </div>

          {selected?.adminReply && (
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-brand-blue uppercase tracking-widest px-1">
                Previous Admin Reply
              </label>
              <div className="p-6 bg-blue-50/50 rounded-md border border-brand-blue/10 text-sm text-healthcare-text leading-relaxed relative overflow-hidden">
                <div className="absolute top-0 right-0 p-3 opacity-10">
                  <svg
                    className="w-8 h-8 text-brand-blue"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
                  </svg>
                </div>
                {selected?.adminReply}
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
              className="w-full px-5 py-4 border border-healthcare-border rounded-md focus:border-brand-blue/50 focus:ring-4 focus:ring-brand-blue/5 outline-none text-sm text-healthcare-text bg-healthcare-surface/20 resize-none font-medium transition-all"
            />
          </div>

          {/* Status select */}
          <div className="space-y-3 mb-4">
            <label className="text-sm font-bold text-healthcare-text px-1">
              Update Ticket Status
            </label>
            <div className="flex gap-2 p-1 bg-healthcare-surface/40 border border-healthcare-border rounded-md max-w-fit">
              {(["New", "Open", "Resolved", "Closed"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    (changeStatus.mutate(s), setIsSelectedStatus(s));
                  }}
                  disabled={
                    changeStatus.isPending ||
                    selected?.status == isSelectedStatus
                  }
                  className={`px-4 py-2 text-xs font-bold rounded-md border-none cursor-pointer transition-all uppercase tracking-wider ${
                    selected?.status == isSelectedStatus
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
        <div className=" pt-4 border-t border-healthcare-border bg-healthcare-surface/30 grid grid-cols-2 gap-4">
          <button
            onClick={() => setIsShowTicketDetail(false)}
            className="px-6 py-2  text-sm font-bold text-healthcare-text bg-white border border-healthcare-border rounded-md hover:bg-healthcare-surface transition-all cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={() => sendReply.mutate()}
            disabled={!reply.trim() || sendReply.isPending}
            className="px-8 py-2 text-sm font-bold text-white bg-[#1e40af] rounded-md hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed border-none cursor-pointer shadow-lg shadow-gray-200"
          >
            {sendReply.isPending ? "Sending Reply..." : "Send Response"}
          </button>
        </div>
      </Modal>
    </>
  );
}
