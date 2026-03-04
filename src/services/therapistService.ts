import {
    fetchTherapists,
    fetchTherapistById,
    fetchTherapistDashboard
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
    }
};
