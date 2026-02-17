import httpClient from '../httpClient';
import type { Format } from '../../types/api';

export const formatService = {
  getAll: () => httpClient.get<Format[]>('/formats'),
  getById: (id: string) => httpClient.get<Format>(`/formats/${id}`),
  getByCreatorId: (creatorId: string) =>
    httpClient.get<Format[]>(`/formats/creator/${creatorId}`),
  create: (data: Omit<Format, 'id'>) => httpClient.post<Format>('/formats', data),
  updateById: (id: string, data: Partial<Format>) =>
    httpClient.put<Format>(`/formats/${id}`, data),
  deleteById: (id: string) => httpClient.delete<Format>(`/formats/${id}`)
};
