import { api } from './axios';
import type { RegisterPayload } from '../types/auth';

export async function login(
  email: string,
  password: string,
  rememberMe = false,
): Promise<{ accessToken: string; refreshToken: string; user: any }> {
  const { data } = await api.post('/auth/login', { email, password, rememberMe });
  return data.data;
}

export async function register(
  payload: RegisterPayload,
): Promise<{ userId: string; email: string; role: string }> {
  const { data } = await api.post('/auth/register', payload);
  return data.data;
}

export async function sendOtp(userId: string): Promise<void> {
  await api.post('/auth/send-otp', { userId });
}

export async function verifyOtp(
  userId: string,
  otp: string,
): Promise<{ accessToken: string; refreshToken: string; user: any }> {
  const { data } = await api.post('/auth/verify-otp', { userId, otp });
  return data.data;
}

export async function logout(refreshToken: string): Promise<void> {
  await api.post('/auth/logout', { refreshToken });
}

export async function refreshToken(
  token: string,
): Promise<{ accessToken: string; refreshToken: string }> {
  const { data } = await api.post('/auth/refresh', { refreshToken: token });
  return data.data;
}

export async function forgotPassword(email: string): Promise<void> {
  await api.post('/auth/forgot-password', { email });
}

export async function resetPassword(token: string, password: string): Promise<void> {
  await api.post('/auth/reset-password', { token, password });
}
