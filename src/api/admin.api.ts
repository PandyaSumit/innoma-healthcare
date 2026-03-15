import { api } from "./axios";
import type {
  AdminTherapist,
  TherapistFormPayload,
  TherapistBooking,
  FinanceSummary,
  DailyRevenue,
  TherapistRevenue,
  AdminArticle,
  ArticleFormPayload,
  SupportTicket,
  AdminFaq,
  FaqFormPayload,
  AdminUser,
  AdminStats,
  PaginatedResponse,
  UserStage,
} from "../types/admin";

// ── Therapist Management ──────────────────────────────────────────────────────

export async function fetchAdminTherapists(): Promise<AdminTherapist[]> {
  const { data } = await api.get("/admin/therapists");
  return data.data;
}

export async function fetchAdminTherapist(id: string): Promise<AdminTherapist> {
  const { data } = await api.get(`/admin/therapists/${id}`);
  return data.data;
}

export async function createTherapist(
  payload: TherapistFormPayload,
): Promise<AdminTherapist> {
  const { data } = await api.post("/admin/therapists", payload);
  return data.data;
}

export async function updateTherapist(
  id: string,
  payload: Partial<TherapistFormPayload>,
): Promise<AdminTherapist> {
  const { data } = await api.put(`/admin/therapists/${id}`, payload);
  return data.data;
}

export async function deleteTherapist(
  therapistProfileId: string,
): Promise<AdminTherapist> {
  const { data } = await api.delete(`/admin/therapists/${therapistProfileId}`);
  return data.data;
}

export async function fetchTherapistBookings(
  therapistId: string,
  type: "upcoming" | "past" = "upcoming",
): Promise<TherapistBooking[]> {
  const { data } = await api.get(
    `/admin/therapists/${therapistId}/bookings?type=${type}`,
  );
  return data.data;
}

export async function markSessionComplete(bookingId: string): Promise<void> {
  await api.patch(`/admin/bookings/${bookingId}/complete`);
}

export async function fetchAllBookings(params?: {
  status?: string;
  page?: number;
  limit?: number;
}): Promise<PaginatedResponse<TherapistBooking>> {
  const q = new URLSearchParams();
  if (params?.status) q.set("status", params.status);
  if (params?.page) q.set("page", String(params.page));
  if (params?.limit) q.set("limit", String(params.limit));
  const { data } = await api.get(`/admin/bookings?${q}`);
  return data.data;
}

// ── Finance ───────────────────────────────────────────────────────────────────

export async function fetchFinanceSummary(): Promise<FinanceSummary> {
  const { data } = await api.get("/admin/finance/summary");
  return data.data;
}

export async function fetchFinancePayments(params?: {
  fromDate?: string;
  toDate?: string;
  therapistId?: string;
  page?: number;
  limit?: number;
}): Promise<PaginatedResponse<any>> {
  const q = new URLSearchParams();
  if (params?.fromDate) q.set("fromDate", params.fromDate);
  if (params?.toDate) q.set("toDate", params.toDate);
  if (params?.therapistId) q.set("therapistId", params.therapistId);
  if (params?.page) q.set("page", String(params.page));
  if (params?.limit) q.set("limit", String(params.limit));
  const { data } = await api.get(`/admin/finance/payments?${q}`);
  return data.data;
}

export async function fetchDailyRevenueChart(
  days: number = 30,
): Promise<DailyRevenue[]> {
  const { data } = await api.get(`/admin/finance/chart/daily?days=${days}`);
  return data.data;
}

export async function fetchTherapistRevenue(
  therapistId?: string,
): Promise<TherapistRevenue[]> {
  const url = therapistId
    ? `/admin/finance/therapists/${therapistId}/revenue`
    : "/admin/finance/therapists";
  const { data } = await api.get(url);
  return data.data;
}

// ── Articles ──────────────────────────────────────────────────────────────────

export async function fetchAdminArticles(params?: {
  page?: number;
  limit?: number;
  published?: boolean;
}): Promise<PaginatedResponse<AdminArticle>> {
  const q = new URLSearchParams();
  if (params?.page) q.set("page", String(params.page));
  if (params?.limit) q.set("limit", String(params.limit));
  if (params?.published !== undefined)
    q.set("published", String(params.published));
  const { data } = await api.get(`/admin/articles?${q}`);
  return data.data;
}

export async function fetchAdminArticle(id: string): Promise<AdminArticle> {
  const { data } = await api.get(`/admin/articles/${id}`);
  return data.data;
}

export async function createArticle(
  payload: ArticleFormPayload,
): Promise<AdminArticle> {
  const { data } = await api.post("/admin/articles", payload);
  return data.data;
}

export async function updateArticle(
  id: string,
  payload: Partial<ArticleFormPayload>,
): Promise<AdminArticle> {
  const { data } = await api.put(`/admin/articles/${id}`, payload);
  return data.data;
}

export async function deleteArticle(id: string): Promise<void> {
  await api.delete(`/admin/articles/${id}`);
}

export async function publishArticle(id: string): Promise<AdminArticle> {
  const { data } = await api.patch(`/admin/articles/${id}/publish`);
  return data.data;
}

export async function unpublishArticle(id: string): Promise<AdminArticle> {
  const { data } = await api.patch(`/admin/articles/${id}/unpublish`);
  return data.data;
}

// ── Support Tickets ───────────────────────────────────────────────────────────

export async function fetchSupportTickets(params?: {
  status?: string;
  page?: number;
  limit?: number;
}): Promise<PaginatedResponse<SupportTicket>> {
  const q = new URLSearchParams();
  if (params?.status) q.set("status", params.status);
  if (params?.page) q.set("page", String(params.page));
  if (params?.limit) q.set("limit", String(params.limit));
  const { data } = await api.get(`/admin/support?${q}`);
  return data.data;
}

export async function fetchSupportTicket(id: string): Promise<SupportTicket> {
  const { data } = await api.get(`/admin/support/${id}`);
  return data.data;
}

export async function replyToTicket(
  id: string,
  reply: string,
): Promise<SupportTicket> {
  const { data } = await api.post(`/admin/support/${id}/reply`, { reply });
  return data.data;
}

export async function updateTicketStatus(
  id: string,
  status: SupportTicket["status"],
): Promise<SupportTicket> {
  const { data } = await api.patch(`/admin/support/${id}/status`, { status });
  return data.data;
}

// ── FAQs ──────────────────────────────────────────────────────────────────────

export async function fetchAdminFaqs(): Promise<AdminFaq[]> {
  const { data } = await api.get("/admin/faqs");
  return data.data;
}

export async function createFaq(payload: FaqFormPayload): Promise<AdminFaq> {
  const { data } = await api.post("/admin/faqs", payload);
  return data.data;
}

export async function updateFaq(
  id: string,
  payload: Partial<FaqFormPayload>,
): Promise<AdminFaq> {
  const { data } = await api.put(`/admin/faqs/${id}`, payload);
  return data.data;
}

export async function deleteFaq(id: string): Promise<void> {
  await api.delete(`/admin/faqs/${id}`);
}

export async function reorderFaqs(orderedIds: string[]): Promise<void> {
  await api.patch("/admin/faqs/reorder", { orderedIds });
}

// ── User Management ───────────────────────────────────────────────────────────

export async function fetchAdminUsers(params?: {
  stage?: UserStage | string;
  role?: string;
  search?: string;
  page?: number | null;
  limit?: number;
}): Promise<PaginatedResponse<AdminUser>> {
  const q = new URLSearchParams();
  if (params?.stage) q.set("stage", params.stage);
  if (params?.search) q.set("search", params.search);
  if (params?.page) q.set("page", String(params.page));
  if (params?.limit) q.set("limit", String(params.limit));
  const { data } = await api.get(`/admin/users?${q}`);
  return data.data;
}

export async function sendEmailToUser(
  userId: string,
  payload: { subject: string; message: string },
): Promise<void> {
  await api.post(`/admin/users/${userId}/email`, payload);
}

// ── Dashboard Stats ───────────────────────────────────────────────────────────

export async function fetchAdminDashboardStats(): Promise<AdminStats> {
  const { data } = await api.get("/admin/dashboard/stats");
  return data.data;
}
