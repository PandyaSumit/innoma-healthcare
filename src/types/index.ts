export type { AuthUser, AuthContextType, LoginPayload, RegisterPayload } from './auth';
export type {
  PatientProfile,
  PatientDashboard,
  NextSession,
  UpdatePatientPayload,
} from './patient';
export type { ApiResponse, PaginatedResponse, ApiError } from './common';
export type {
  AdminUser,
  AdminTherapist,
  AdminStats,
  SupportTicket,
  AdminArticle,
  AdminFaq,
  FinanceSummary,
  UserStage,
  TicketStatus,
} from './admin';

// Landing-page UI types (used by static data files)
export interface Symptom {
  id: string;
  name: string;
  description: string;
  icon: import('react').ReactNode;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
}

export interface Benefit {
  id: string;
  title: string;
  description: string;
  icon: string;
}
