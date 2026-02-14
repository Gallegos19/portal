import httpClient from '../httpClient';
import type { Region } from '../../types/api';

export const regionService = {
  getAll: () => httpClient.get<Region[]>('/regions'),
  getById: (id: string) => httpClient.get<Region>(`/regions/${id}`),
  create: (data: Omit<Region, 'id'>) => httpClient.post<Region>('/regions', data),
  updateById: (id: string, data: Partial<Region>) =>
    httpClient.put<Region>(`/regions/${id}`, data),
  deleteById: (id: string) => httpClient.delete<Region>(`/regions/${id}`)
};
