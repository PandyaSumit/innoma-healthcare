import { apiFetch, setTokens, clearTokens } from './api';

// ── Payload types ────────────────────────────────────────────────────────────

export interface RegisterPayload {
  fullName: string;
  email: string;
  password: string;
  dob: string;         // YYYY-MM-DD
  gender: string;      // "Male" | "Female" | "Other"
  occupation: string;
  role?: 'patient';
}

export interface LoginPayload {
  email: string;
  password: string;
  rememberMe?: boolean;
}

// ── Auth service ─────────────────────────────────────────────────────────────

export const authService = {
  /**
   * POST /auth/register
   * Returns { userId, email, role, accessToken, refreshToken }
   */
  async register(payload: RegisterPayload) {
    const json = await apiFetch(
      '/auth/register',
      { method: 'POST', body: JSON.stringify({ ...payload, role: 'patient' }) },
      false,
    );
    setTokens(json.data.accessToken, json.data.refreshToken);
    return json.data;
  },

  /**
   * POST /auth/login
   * Returns { accessToken, refreshToken, expiresIn, user: { id, email, role, name, avatar } }
   */
  async login(payload: LoginPayload) {
    const json = await apiFetch(
      '/auth/login',
      { method: 'POST', body: JSON.stringify(payload) },
      false,
    );
    setTokens(json.data.accessToken, json.data.refreshToken);
    return json.data;
  },

  /**
   * POST /auth/logout  (requires valid access token)
   */
  async logout() {
    try {
      await apiFetch('/auth/logout', { method: 'POST' }, true);
    } finally {
      clearTokens();
    }
  },

  /**
   * POST /auth/forgot-password
   * Always returns success to prevent user enumeration.
   */
  async forgotPassword(email: string) {
    const json = await apiFetch(
      '/auth/forgot-password',
      { method: 'POST', body: JSON.stringify({ email }) },
      false,
    );
    return json.data;
  },

  /**
   * POST /auth/reset-password
   */
  async resetPassword(token: string, newPassword: string) {
    const json = await apiFetch(
      '/auth/reset-password',
      { method: 'POST', body: JSON.stringify({ token, newPassword }) },
      false,
    );
    return json.data;
  },

  /**
   * POST /auth/verify-email
   */
  async verifyEmail(token: string) {
    const json = await apiFetch(
      '/auth/verify-email',
      { method: 'POST', body: JSON.stringify({ token }) },
      false,
    );
    return json.data;
  },
};
