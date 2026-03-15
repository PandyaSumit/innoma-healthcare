import { api } from "./axios";

export interface SupportTicket {
  id: string;
  user_id: string;
  category: string;
  subject: string;
  description: string;
  status: "Open" | "Closed" | "Pending";
  created_at: string;
  updated_at: string;
}

export interface SupportTicketsResponse {
  success: boolean;
  data: SupportTicket[];
  error: string | null;
  meta: {
    page: number;
    totalPages: number;
    total: number;
  };
}

export interface CreateSupportTicketRequest {
  category: string;
  subject: string;
  description: string;
}

export async function fetchSupportTickets(): Promise<SupportTicketsResponse> {
  const { data } = await api.get("/support/tickets");
  return data;
}

export async function createSupportTicket(payload: CreateSupportTicketRequest) {
  const { data } = await api.post("/support/tickets", payload);
  return data;
}

export async function fetchFaq(): Promise<any> {
  const { data } = await api.get("/faqs");
  return data;
}
