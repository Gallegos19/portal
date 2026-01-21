import httpClient from '../httpClient';
import type { LoginCredentials, AuthResponse } from '../../types/auth';

export const authService = {
  login: (credentials: LoginCredentials) =>
    httpClient.post<AuthResponse>('/auth/login', credentials),

  refreshToken: () =>
    httpClient.post<AuthResponse>('/auth/refresh'),

  logout: () =>
    httpClient.post('/auth/logout')
};