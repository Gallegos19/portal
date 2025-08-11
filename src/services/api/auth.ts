import httpClient from '../httpClient';
import { LoginCredentials, AuthResponse } from '../../types/auth';
import { ApiResponse } from '../../types/api';

export const authService = {
  login: (credentials: LoginCredentials) =>
    httpClient.post<ApiResponse<AuthResponse>>('/auth/login', credentials),

  refreshToken: () =>
    httpClient.post<ApiResponse<AuthResponse>>('/auth/refresh'),

  logout: () =>
    httpClient.post('/auth/logout')
};