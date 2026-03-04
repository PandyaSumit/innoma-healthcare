import {
    fetchTherapists,
    fetchTherapistById,
    fetchTherapistDashboard,
    fetchTherapistMe,
    updateTherapistMe,
    uploadTherapistAvatar
} from '../api/therapist.api';

export const therapistService = {
    async getAll(filters = {}) {
        return fetchTherapists(filters);
    },

    async getById(id: string) {
        return fetchTherapistById(id);
    },

    async getDashboard() {
        return fetchTherapistDashboard();
    },

    async getProfile() {
        return fetchTherapistMe();
    },

    async updateProfile(payload: any) {
        return updateTherapistMe(payload);
    },

    async uploadAvatar(file: File) {
        return uploadTherapistAvatar(file);
    }
};
