import httpClient from '../httpClient';
import type { Coordinator } from '../../types/api';

export const coordinatorService = {
  getAll: () => httpClient.get<Coordinator[]>('/coordinators'),
  getById: (id: string) => httpClient.get<Coordinator>(`/coordinators/${id}`),
  create: (data: Omit<Coordinator, 'id'>) => httpClient.post<Coordinator>('/coordinators', data),
  updateById: (id: string, data: Partial<Coordinator>) =>
    httpClient.put<Coordinator>(`/coordinators/${id}`, data),
  deleteById: (id: string) => httpClient.delete<Coordinator>(`/coordinators/${id}`)
};
