import httpClient from '../httpClient';
import type { UserApi } from '../../types/api';

export const userService = {
  getAll: () => httpClient.get<UserApi[]>('/users'),
  getById: (id: string) => httpClient.get<UserApi>(`/users/${id}`),
  create: (data: Omit<UserApi, 'id'> & { password: string }) =>
    httpClient.post<UserApi>('/users', data),
  updateById: (id: string, data: Partial<UserApi> & { password?: string }) =>
    httpClient.put<UserApi>(`/users/${id}`, data),
  deleteById: (id: string) => httpClient.delete<UserApi>(`/users/${id}`)
};
