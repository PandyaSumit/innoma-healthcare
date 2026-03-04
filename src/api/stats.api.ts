import { api } from './axios';

export interface DashboardStats {
    totalUsers: number;
    totalPatients: number;
    totalTherapists: number;
    totalAdmins: number;
    byStage: {
        registered: number;
        assessment: number;
        paid_session: number;
    };
}

export interface FinanceSummary {
    totalRevenue: number;
    totalRefunds: number;
    netRevenue: number;
    totalTransactions: number;
    pendingRevenue: number;
    thisMonthRevenue: number;
    lastMonthRevenue: number;
    growthPercent: number | null;
}

export async function fetchUserStageStats(): Promise<DashboardStats> {
    const { data } = await api.get('/admin/users/stats/stages');
    return data.data;
}

export async function fetchFinanceSummary(): Promise<FinanceSummary> {
    const { data } = await api.get('/admin/finance/summary');
    return data.data;
}

export async function fetchDailyRevenueChart(days: number = 30): Promise<any[]> {
    const { data } = await api.get(`/admin/finance/chart/daily?days=${days}`);
    return data.data;
}
