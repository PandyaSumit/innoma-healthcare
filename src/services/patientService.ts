import { apiFetch } from './api';

export interface PatientProfileData {
    id: string;
    name: string;
    email: string;
    phone?: string;
    dob: string;
    age: number | null;
    gender: 'Male' | 'Female' | 'Other';
    occupation: string;
    bloodGroup: string;
    bio?: string;
    healthInterests: string[];
    allergies?: string;
    medications?: string;
    emergencyContact?: string;
    avatarUrl?: string;
    notificationEmail: boolean;
    notificationSms: boolean;
    marketingEmail: boolean;
    reminderFrequency: string;
    memberSince: string;
}

export interface DashboardData {
    nextSession: {
        appointmentId: string;
        therapistName: string;
        therapistPhoto?: string;
        date: string;
        time: string;
        meetingLink?: string;
    } | null;
    upcomingCount: number;
    totalSessions: number;
    assessmentCompleted: boolean;
}

export interface UpdateProfilePayload extends Partial<PatientProfileData> {
    fullName?: string;
    currentPassword?: string;
    newPassword?: string;
}

export const patientService = {
    /**
     * GET /api/patients/me
     */
    async getProfile(): Promise<PatientProfileData> {
        const json = await apiFetch('/patients/me', { method: 'GET' }, true);
        return json.data;
    },

    /**
     * PUT /api/patients/me
     */
    async updateProfile(data: UpdateProfilePayload): Promise<PatientProfileData> {
        const json = await apiFetch(
            '/patients/me',
            { method: 'PUT', body: JSON.stringify(data) },
            true,
        );
        return json.data;
    },

    /**
     * POST /api/patients/me/avatar
     */
    async uploadAvatar(file: File): Promise<{ avatarUrl: string }> {
        const formData = new FormData();
        formData.append('avatar', file);

        const json = await apiFetch(
            '/patients/me/avatar',
            {
                method: 'POST',
                body: formData,
            },
            true,
        );
        return json.data;
    },

    /**
     * GET /api/patients/me/dashboard
     */
    async getDashboard(): Promise<DashboardData> {
        const json = await apiFetch('/patients/me/dashboard', { method: 'GET' }, true);
        return json.data;
    },
};
