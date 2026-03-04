// ── Patient types ────────────────────────────────────────────────────────────

export interface PatientProfile {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  dob: string | null;
  age: number | null;
  gender: 'Male' | 'Female' | 'Other' | null;
  occupation: string | null;
  bloodGroup: string | null;
  bio: string | null;
  healthInterests: string[];
  allergies: string | null;
  medications: string | null;
  emergencyContact: string | null;
  avatarUrl: string | null;
  notificationEmail: boolean;
  notificationSms: boolean;
  marketingEmail: boolean;
  reminderFrequency: '1h' | '6h' | '12h' | '24h' | '48h';
  memberSince: string;
}

export interface NextSession {
  appointmentId: string;
  therapistName: string;
  therapistPhoto: string;
  date: string;
  time: string;
  meetingLink: string | null;
}

export interface PatientDashboard {
  nextSession: NextSession | null;
  upcomingCount: number;
  totalSessions: number;
  assessmentCompleted: boolean;
}

export type UpdatePatientPayload = Partial<{
  fullName: string;
  email: string;
  phone: string;
  dob: string;
  gender: string;
  occupation: string;
  bloodGroup: string;
  bio: string;
  healthInterests: string[];
  allergies: string;
  medications: string;
  emergencyContact: string;
  notificationEmail: boolean;
  notificationSms: boolean;
  marketingEmail: boolean;
  reminderFrequency: string;
  currentPassword: string;
  newPassword: string;
}>;
