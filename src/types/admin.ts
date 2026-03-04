// ── Admin types ───────────────────────────────────────────────────────────────

export interface AdminTherapist {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  specialization: string;
  experience: number;
  bio: string | null;
  avatarUrl: string | null;
  isActive: boolean;
  rating: number | null;
  totalSessions: number;
  createdAt: string;
}

export type TherapistFormPayload = {
  name: string;
  email: string;
  phone?: string;
  specialization: string;
  experience: number;
  bio?: string;
  password?: string;
};

export interface TherapistBooking {
  id: string;
  patientName: string;
  patientEmail: string;
  therapistName: string;
  date: string;
  time: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  amount: number;
  meetingLink: string | null;
}

export interface FinanceSummary {
  totalRevenue: number;
  totalSessions: number;
  averageSessionValue: number;
  revenueThisMonth: number;
  revenueLastMonth: number;
  growthPercent: number;
}

export interface DailyRevenue {
  date: string;
  revenue: number;
  sessions: number;
}

export interface TherapistRevenue {
  therapistId: string;
  therapistName: string;
  revenue: number;
  sessions: number;
  avgRating: number | null;
}

export interface AdminArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  authorName: string;
  coverImageUrl: string | null;
  tags: string[];
  isPublished: boolean;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export type ArticleFormPayload = {
  title: string;
  content: string;
  excerpt?: string;
  coverImageUrl?: string;
  tags?: string[];
  isPublished?: boolean;
};

export interface SupportTicket {
  id: string;
  subject: string;
  message: string;
  status: 'new' | 'open' | 'resolved' | 'closed';
  userName: string;
  userEmail: string;
  adminReply: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AdminFaq {
  id: string;
  question: string;
  answer: string;
  category: string | null;
  order: number;
  isPublished: boolean;
}

export type FaqFormPayload = {
  question: string;
  answer: string;
  category?: string;
  order?: number;
  isPublished?: boolean;
};

export type UserStage = 'registered' | 'free_assessment' | 'paid_session';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'patient' | 'therapist' | 'admin';
  stage: UserStage;
  createdAt: string;
  totalSessions: number;
  lastLoginAt: string | null;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
