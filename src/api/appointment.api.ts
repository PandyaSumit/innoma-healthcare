import { api } from "./axios";

export interface AppointmentRecord {
  id: string;
  therapist_id: string;
  patient_id: string;
  scheduled_date: string;
  scheduled_time: string;
  duration_minutes: number;
  type: "Assessment" | "Consultation" | "Follow-up";
  status: "Upcoming" | "In Progress" | "Completed" | "Cancelled";
  fee: number;
  payment_status: "Pending" | "Paid" | "Refunded";
  invoice_number?: string;
  meeting_link?: string;
  reschedules_left: number;
  cancel_reason?: string;
  rating?: number;
  feedback_text?: string;
  therapist?: { name: string; avatar_url?: string };
  patient?: { name: string; avatar_url?: string };
  package?: { name: string; price: number; sessions: number };
}

export interface CreateAppointmentPayload {
  therapistId: string;
  packageId: string;
  scheduledDate: string;
  scheduledTime: string;
  type?: "Assessment" | "Consultation" | "Follow-up";
  isFreeAssessment?: boolean;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
}

export interface AppointmentsListResponse {
  data: AppointmentRecord[];
  meta: { page: number; totalPages: number; total: number };
}

export async function createAppointment(
  payload: CreateAppointmentPayload,
): Promise<AppointmentRecord> {
  const { data } = await api.post("/appointments", payload);
  return data.data;
}

export async function fetchAppointments(params?: {
  status?: string;
  page?: number;
  limit?: number;
}): Promise<AppointmentsListResponse> {
  const q = new URLSearchParams();
  if (params?.status) q.set("status", params.status);
  if (params?.page) q.set("page", String(params.page));
  if (params?.limit) q.set("limit", String(params.limit));
  const { data } = await api.get(`/appointments?${q}`);
  return { data: data.data, meta: data.meta };
}

export async function fetchAppointmentById(
  id: string,
): Promise<AppointmentRecord> {
  const { data } = await api.get(`/appointments/${id}`);
  return data.data;
}

export async function rescheduleAppointment(
  id: string,
  newDate: string,
  newTime: string,
): Promise<AppointmentRecord> {
  const { data } = await api.post(`/appointments/${id}/reschedule`, {
    newDate,
    newTime,
  });
  return data.data;
}

export async function cancelAppointment(
  id: string,
  reason?: string,
): Promise<{ refundPercent: number }> {
  const { data } = await api.post(`/appointments/${id}/cancel`, { reason });
  return data.data;
}

export async function submitFeedback(
  id: string,
  rating: number,
  feedbackText?: string,
): Promise<AppointmentRecord> {
  const { data } = await api.post(`/appointments/${id}/feedback`, {
    rating,
    feedbackText,
  });
  return data.data;
}

export async function joinSession(
  id: string,
): Promise<{ meetingLink: string; sessionStartsAt: string }> {
  const { data } = await api.post(`/appointments/${id}/join`);
  return data.data;
}

export async function fetchFreeAssessmentEligibility(): Promise<{
  eligible: boolean;
  hasUsed: boolean;
}> {
  const { data } = await api.get("/patients/me/free-assessment");
  return data.data;
}

export async function fetchTherapistAvailability(
  therapistId: string,
  date: string,
): Promise<{ available: string[]; booked: string[] }> {
  const { data } = await api.get(
    `/therapists/${therapistId}/availability?date=${date}`,
  );
  return data.data;
}

export async function fetchTherapistpatients(): Promise<{
  available: string[];
  booked: string[];
}> {
  const { data } = await api.get(`/therapists/me/patients`);
  return data.data;
}
